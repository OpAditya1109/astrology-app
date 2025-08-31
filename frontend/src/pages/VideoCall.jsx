// VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function VideoCall() {
  const { consultationId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const targetSocketRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // ⚠ For real-world reliability add a TURN server here
      // { urls: "turn:YOUR_TURN_HOST:3478", username: "USER", credential: "PASS" },
    ],
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
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

    // Join signaling room
    socket.emit("joinRoom", consultationId);

    // You are the JOINER → server tells you who is already in the room
    socket.on("existing-peers", async ({ peers }) => {
      if (peers && peers.length > 0) {
        // Call the first peer
        targetSocketRef.current = peers[0];
        setStatus("Calling...");
        await startCall();
      } else {
        setStatus("Waiting for the other person...");
      }
    });

    // Someone else joined (you were here first) — don't start an offer here
    socket.on("peer-joined", ({ socketId }) => {
      // This peer will initiate (they got existing-peers)
      // Keep reference for ICE if needed later
      if (!targetSocketRef.current) {
        targetSocketRef.current = socketId;
      }
    });

    // Incoming offer → you are the ANSWERER
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

    // Your offer was answered
    socket.on("call-answered", async ({ answer }) => {
      try {
        await pc.setRemoteDescription(answer);
        setStatus("Connected");
      } catch (e) {
        console.error("call-answered error:", e);
      }
    });

    // Remote ICE
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        // Some browsers require wrapping:
        await pc.addIceCandidate(candidate?.candidate ? candidate : new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // Peer left
    socket.on("peer-left", () => {
      setStatus("Peer left");
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      // Stop local tracks
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      pc.close();
    };
  }, [consultationId]);

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

return (
  <div className="relative w-screen h-screen bg-black overflow-hidden">
    {/* Remote video (fullscreen, no scroll) */}
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Local video (small floating) */}
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      className="absolute bottom-4 right-4 w-40 h-28 bg-black rounded-lg shadow-lg border-2 border-white"
    />

    {/* Status overlay */}
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
      {status}
    </div>

    {/* Control Bar */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 bg-black bg-opacity-60 px-6 py-3 rounded-full">
      {/* Mute/Unmute */}
      <button
        onClick={() => {
          const stream = localVideoRef.current?.srcObject;
          if (stream) {
            const audioTrack = stream.getTracks().find(t => t.kind === "audio");
            if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
          }
        }}
        className="text-white hover:text-red-500 transition"
      >
        🎤
      </button>

      {/* Toggle Camera */}
      <button
        onClick={() => {
          const stream = localVideoRef.current?.srcObject;
          if (stream) {
            const videoTrack = stream.getTracks().find(t => t.kind === "video");
            if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
          }
        }}
        className="text-white hover:text-red-500 transition"
      >
        🎥
      </button>

      {/* End Call */}
      <button
        onClick={() => {
          if (peerConnection.current) peerConnection.current.close();
          socket.disconnect();
          navigate("/"); // redirect to home or chat list
        }}
        className="text-white hover:text-red-500 transition"
      >
        ❌
      </button>
    </div>
  </div>
);


}
