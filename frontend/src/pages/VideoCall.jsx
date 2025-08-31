import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// Import your icons
import micOnIcon from "../assets/mic-on.png";
import micOffIcon from "../assets/mic-off.png";
import videoOnIcon from "../assets/video-on.png";
import videoOffIcon from "../assets/video-off.png";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function VideoCall() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const callMode = location.state?.mode || "Video"; // "Video" or "Audio"

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const targetSocketRef = useRef(null);
  const socketRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callMode === "Audio"); // Audio call starts with video off

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callMode === "Video",
          audio: true,
        });

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Automatically disable video track for audio-only calls
        if (callMode === "Audio") {
          const videoTrack = stream.getTracks().find((t) => t.kind === "video");
          if (videoTrack) {
            videoTrack.enabled = false;
          }
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (e) {
        console.error("getUserMedia error:", e);
        setStatus("Camera/Mic permission denied");
      }
    })();

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      const s = pc.connectionState;
      if (s === "connected") setStatus("Connected");
      else if (s === "failed") setStatus("Connection failed");
      else if (s === "disconnected") setStatus("Disconnected");
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        socket.emit("ice-candidate", {
          to: targetSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    socket.emit("joinRoom", consultationId);

    socket.on("existing-peers", async ({ peers }) => {
      if (peers && peers.length > 0) {
        targetSocketRef.current = peers[0];
        setStatus("Calling...");
        await startCall();
      } else {
        setStatus("Waiting for the other person...");
      }
    });

    socket.on("peer-joined", ({ socketId }) => {
      if (!targetSocketRef.current) {
        targetSocketRef.current = socketId;
      }
    });

    socket.on("incoming-call", async ({ from, offer }) => {
      try {
        targetSocketRef.current = from;
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer-call", { to: from, answer });
        setStatus("Ringing...");
      } catch (e) {
        console.error("incoming-call error:", e);
      }
    });

    socket.on("call-answered", async ({ answer }) => {
      try {
        await pc.setRemoteDescription(answer);
        setStatus("Connected");
      } catch (e) {
        console.error("call-answered error:", e);
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(
          candidate?.candidate ? candidate : new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socket.on("peer-left", () => {
      setStatus("Peer left");
      if (remoteVideoRef.current?.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      pc.close();
    };
  }, [consultationId, callMode]);

  const startCall = async () => {
    const pc = peerConnectionRef.current;
    const socket = socketRef.current;
    if (!pc || !socket || !targetSocketRef.current) return;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call-user", { to: targetSocketRef.current, offer });
    } catch (e) {
      console.error("startCall error:", e);
    }
  };

  // --- Controls ---
  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      const audioTrack = stream.getTracks().find((t) => t.kind === "audio");
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (callMode === "Audio") return; // Disable video toggle for audio-only
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      const videoTrack = stream.getTracks().find((t) => t.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (socketRef.current) socketRef.current.disconnect();
    navigate(-1);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Remote video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${callMode === "Audio" ? "bg-gray-900" : ""}`}
      />

      {/* Local video */}
      {callMode === "Video" && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-40 h-28 bg-black rounded-lg shadow-lg border-2 border-white"
        />
      )}

      {/* Status overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
        {status}
      </div>

      {/* End Call button */}
      <button
        onClick={endCall}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition"
      >
        End
      </button>

      {/* Control Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 bg-black bg-opacity-60 px-6 py-3 rounded-full">
        {/* Mic button */}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
        >
          <img
            src={isMuted ? micOffIcon : micOnIcon}
            alt="Mic"
            className="w-6 h-6"
          />
        </button>

        {/* Video button (only for video calls) */}
        {callMode === "Video" && (
          <button
            onClick={toggleVideo}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
          >
            <img
              src={isVideoOff ? videoOffIcon : videoOnIcon}
              alt="Video"
              className="w-6 h-6"
            />
          </button>
        )}
      </div>
    </div>
  );
}
