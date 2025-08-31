// VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function VideoCall() {
  const { consultationId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [targetSocketId, setTargetSocketId] = useState(null); // store callee/caller socket id

  const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);

    const pc = new RTCPeerConnection(ICE_SERVERS);
    setPeerConnection(pc);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketId) {
        s.emit("ice-candidate", { to: targetSocketId, candidate: event.candidate });
      }
    };

    // Join room
    s.emit("joinRoom", consultationId);

    // Listen for signaling events
    s.on("incoming-call", async ({ from, offer }) => {
      setTargetSocketId(from);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit("answer-call", { to: from, answer });
    });

    s.on("call-answered", async ({ answer }) => {
      await pc.setRemoteDescription(answer);
    });

    s.on("ice-candidate", async ({ candidate }) => {
      try { await pc.addIceCandidate(candidate); } 
      catch (err) { console.error(err); }
    });

    return () => {
      s.disconnect();
      pc.close();
    };
  }, [consultationId, targetSocketId]);

  const startCall = async () => {
    if (!peerConnection || !socket) return;

    // Ask backend for the other peer's socket ID
    socket.emit("getPeerSocketId", consultationId, async (peerId) => {
      if (!peerId) return alert("No one is available to call");
      setTargetSocketId(peerId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("call-user", { to: peerId, offer });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Video Call</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black rounded-lg"/>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg"/>
      </div>
      <button onClick={startCall} className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
        Start Call
      </button>
    </div>
  );
}
