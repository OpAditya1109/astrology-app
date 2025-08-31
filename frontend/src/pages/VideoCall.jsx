// VideoCall.jsx
import { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function VideoCall() {
  const { consultationId } = useParams();
  const location = useLocation();
  const isCaller = location.state?.isCaller; // true for user
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const targetSocketRef = useRef(null);
  const socketRef = useRef(null);

  const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        socket.emit("ice-candidate", {
          to: targetSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    // Join room
    socket.emit("joinRoom", consultationId);

    // When another peer joins
    socket.on("peer-joined", ({ socketId }) => {
      targetSocketRef.current = socketId;
      if (isCaller) startCall(); // user automatically initiates call
    });

    // Incoming call (callee)
    socket.on("incoming-call", async ({ from, offer }) => {
      targetSocketRef.current = from;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer-call", { to: from, answer });
    });

    // Call answered (caller)
    socket.on("call-answered", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // ICE candidate from remote
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    return () => {
      socket.disconnect();
      pc.close();
    };
  }, [consultationId, isCaller]);

  const startCall = async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !targetSocketRef.current) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("call-user", { to: targetSocketRef.current, offer });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Video Call</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black rounded-lg"/>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg"/>
      </div>
      {!isCaller && (
        <p className="mt-4 text-gray-500">Waiting for user to call...</p>
      )}
    </div>
  );
}
