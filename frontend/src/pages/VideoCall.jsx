import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// Icons
import micOnIcon from "../assets/mic-on.png";
import micOffIcon from "../assets/mic-off.png";
import videoOnIcon from "../assets/video-on.png";
import videoOffIcon from "../assets/video-off.png";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function VideoCall() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const callMode = location.state?.mode || "Video";
  const role = location.state?.role || "user";

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const targetSocketRef = useRef(null);
  const socketRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callMode === "Audio");
  const [secondsLeft, setSecondsLeft] = useState(null);

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // --- Local media ---
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callMode === "Video",
          audio: true,
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (e) {
        console.error("getUserMedia error:", e);
        setStatus("Camera/Mic permission denied");
      }
    })();

    // --- Remote stream ---
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    // --- ICE candidates ---
    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        socket.emit("video-ice-candidate", {
          roomId: consultationId,
          to: targetSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    // --- Join Room ---
    socket.emit("joinVideoRoom", { roomId: consultationId, role });

    // === Signaling ===

    // Existing peers
    socket.on("video-existing-peers", async ({ peers }) => {
      if (role === "user") {
        if (peers.length > 0) {
          targetSocketRef.current = peers[0];
          setStatus("Ringing..."); // waiting for astrologer to pick
          await startCall();
        } else {
          setStatus("Waiting for astrologer...");
        }
      }
    });

    // Astrologer side: incoming call
    socket.on("video-incoming-call", async ({ from, offer }) => {
      targetSocketRef.current = from;
      setStatus("Ringing...");
      const pc = peerConnectionRef.current;
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("video-answer-call", { roomId: consultationId, to: from, answer });
    });

    // Call answered by astrologer
   socket.on("video-call-answered", async ({ answer }) => {
  const pc = peerConnectionRef.current;
  if (!pc) return;
  await pc.setRemoteDescription(answer);
  setStatus("Connected");

  // Show timer immediately if already received
  if (secondsLeft === null && socketRef.current) {
    socketRef.current.emit("joinVideoRoom", { roomId: consultationId, role: "user" });
  }
});


    // Timer starts only when astrologer accepts
 socket.on("video-timer-started", ({ remaining }) => {
  setSecondsLeft(remaining);
});


    // ICE candidate from peer
    socket.on("video-ice-candidate", async ({ candidate }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        await pc.addIceCandidate(candidate?.candidate ? candidate : new RTCIceCandidate(candidate));
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
  }, [consultationId, callMode, role]);

  // --- Timer countdown ---
  useEffect(() => {
    if (status === "Connected" && secondsLeft > 0) {
      const interval = setInterval(() => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
    if (secondsLeft === 0) endCall();
  }, [status, secondsLeft]);

  const startCall = async () => {
    const pc = peerConnectionRef.current;
    const socket = socketRef.current;
    if (!pc || !socket || !targetSocketRef.current) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("video-call-user", { roomId: consultationId, to: targetSocketRef.current, offer });
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    const audioTrack = stream.getTracks().find((t) => t.kind === "audio");
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleVideo = () => {
    if (callMode === "Audio") return;
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    const videoTrack = stream.getTracks().find((t) => t.kind === "video");
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOff(!videoTrack.enabled);
  };

  const endCall = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (socketRef.current) socketRef.current.disconnect();
    navigate(-1);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <video ref={remoteVideoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${callMode === "Audio" ? "bg-gray-900" : ""}`} />
      {callMode === "Video" && <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-40 h-28 bg-black rounded-lg shadow-lg border-2 border-white" />}

      {/* Status + Timer */}
      <div className="absolute top-4 left-4 flex gap-4 items-center">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">{status}</div>
        {status === "Connected" && secondsLeft !== null && <div className="bg-black bg-opacity-50 text-green-400 px-4 py-2 rounded-lg font-mono">{formatTime(secondsLeft)}</div>}
      </div>

      <button onClick={endCall} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition">End</button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 bg-black bg-opacity-60 px-6 py-3 rounded-full">
        <button onClick={toggleMute} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition">
          <img src={isMuted ? micOffIcon : micOnIcon} alt="Mic" className="w-6 h-6" />
        </button>
        {callMode === "Video" && <button onClick={toggleVideo} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition">
          <img src={isVideoOff ? videoOffIcon : videoOnIcon} alt="Video" className="w-6 h-6" />
        </button>}
      </div>
    </div>
  );
}
