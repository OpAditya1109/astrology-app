// VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com"; // your backend

export default function VideoCall() {
  const { consultationId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // you can add TURN server here for production
    ],
  };

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);

    const pc = new RTCPeerConnection(ICE_SERVERS);
    setPeerConnection(pc);

    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      })
      .catch(err => console.error("Error accessing media devices:", err));

    // Handle remote stream
    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        s.emit("ice-candidate", { consultationId, candidate: event.candidate });
      }
    };

    // Socket events
    s.emit("joinRoom", consultationId);

    s.on("offer", async ({ offer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit("answer", { consultationId, answer });
    });

    s.on("answer", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    s.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    return () => {
      s.disconnect();
      pc.close();
    };
  }, [consultationId]);

  const startCall = async () => {
    if (!peerConnection || !socket) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", { consultationId, offer });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Video Call</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg" />
      </div>
      <button
        onClick={startCall}
        className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      >
        Start Call
      </button>
    </div>
  );
}
