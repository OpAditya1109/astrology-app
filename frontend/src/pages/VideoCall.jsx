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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-2">Video Call</h2>
      <p className="mb-4 text-gray-600">{status}</p>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg" />
      </div>
    </div>
  );
}
