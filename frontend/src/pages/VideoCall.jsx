import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const targetSocketRef = useRef(null);
  const socketRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [callMode, setCallMode] = useState("Video");

  // Extend call state
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(5);
  const [extendRate, setExtendRate] = useState(0);
  const [userWallet, setUserWallet] = useState(0);
  const [extending, setExtending] = useState(false);
  const [skipExtendPrompt, setSkipExtendPrompt] = useState(false);

  const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const endCall = () => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit("endVideoCall", { roomId: consultationId });
      socket.emit("leaveVideoRoom", { roomId: consultationId });
      socket.disconnect();
    }
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    navigate(-1);
  };

  // Fetch consultation and user wallet
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://bhavanaastro.onrender.com/api/consultations/details/${consultationId}`);
        const data = await res.json();
        setExtendRate(data.ratePerMinute || 0);
        setCallMode(data.mode || "Video");
        setIsVideoOff(data.mode === "Audio");

        if (currentUser?.id) {
          const walletRes = await fetch(`https://bhavanaastro.onrender.com/api/users/${currentUser.id}/details`);
          const walletData = await walletRes.json();
          setUserWallet(walletData.wallet?.balance || 0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [consultationId]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    const setupLocalMedia = async (mode) => {
      try {
        let stream;
        if (mode === "Video") {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (err) {
        console.error("getUserMedia error:", err);
        setStatus("Camera/Mic permission denied");
      }
    };

    setupLocalMedia(callMode);

    // Remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        socket.emit("video-ice-candidate", {
          roomId: consultationId,
          to: targetSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    // Join Room
    socket.emit("joinVideoRoom", { roomId: consultationId, role: currentUser?.role || "user" });

    // Existing peers
    socket.on("video-existing-peers", async ({ peers }) => {
      if (peers.length > 0) {
        targetSocketRef.current = peers[0];
        setStatus("Ringing...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("video-call-user", { roomId: consultationId, to: peers[0], offer });
      } else {
        setStatus("Waiting for other participant...");
      }
    });

    // Incoming call
    socket.on("video-incoming-call", async ({ from, offer }) => {
      targetSocketRef.current = from;
      setStatus("Ringing...");
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("video-answer-call", { roomId: consultationId, to: from, answer });
    });

    // Call answered
    socket.on("video-call-answered", async ({ answer }) => {
      if (!pc) return;
      await pc.setRemoteDescription(answer);
      setStatus("Connected");
    });

    // Timer for both video/audio
    socket.on("video-timer-started", ({ remaining }) => {
      setSecondsLeft(remaining);
      setStatus("Connected");
    });

    // ICE candidate from remote
    socket.on("video-ice-candidate", async ({ candidate }) => {
      try {
        if (!pc) return;
        await pc.addIceCandidate(candidate?.candidate ? candidate : new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // User left
    socket.on("user-left", ({ message }) => {
      setStatus(message);
      if (remoteVideoRef.current?.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        remoteVideoRef.current.srcObject = null;
      }
      setTimeout(() => navigate(-1), 5000);
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

  // Timer countdown
  useEffect(() => {
    if (status === "Connected" && secondsLeft > 0) {
      const interval = setInterval(() => setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
    if (secondsLeft === 0) endCall();
  }, [status, secondsLeft]);

  // Extend call modal
  useEffect(() => {
    if (
      secondsLeft !== null &&
      secondsLeft <= 60 &&
      !showExtendModal &&
      !skipExtendPrompt &&
      extendRate > 0
    ) {
      const maxMinutes = Math.floor(userWallet / extendRate);
      if (maxMinutes > 0) {
        setExtendMinutes(Math.min(5, maxMinutes));
        setShowExtendModal(true);
      }
    }
  }, [secondsLeft, showExtendModal, skipExtendPrompt, userWallet, extendRate]);

const toggleMute = () => {
  const stream = localVideoRef.current?.srcObject;
  if (!stream) return;

  const audioTrack = stream.getTracks().find((t) => t.kind === "audio");
  if (!audioTrack) return;

  const newMuted = audioTrack.enabled; // save current state
  audioTrack.enabled = !audioTrack.enabled; // toggle track
  setIsMuted(!newMuted); // set button state correctly
};

const toggleVideo = () => {
  if (callMode === "Audio") return;
  const stream = localVideoRef.current?.srcObject;
  if (!stream) return;

  const videoTrack = stream.getTracks().find((t) => t.kind === "video");
  if (!videoTrack) return;

  const newVideoState = videoTrack.enabled;
  videoTrack.enabled = !videoTrack.enabled;
  setIsVideoOff(!newVideoState);
};

  const extendConsultation = async () => {
    if (extending) return;
    setExtending(true);
    try {
      const extendCost = extendMinutes * extendRate;
      if (userWallet < extendCost) {
        alert(`Insufficient balance. You have ₹${userWallet}`);
        return;
      }
      const res = await fetch("https://bhavanaastro.onrender.com/api/users/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          amount: extendCost,
          consultationId,
          extendMinutes,
        }),
      });
      if (!res.ok) throw new Error("Deduction failed");
      const data = await res.json();
      setUserWallet(data.balance);
      socketRef.current.emit("extendVideoTimer", { roomId: consultationId, extendMinutes });
    } catch (err) {
      console.error(err);
      alert("Failed to extend call. Try again.");
    } finally {
      setExtending(false);
    }
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

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">
              ⏰ Call is about to end.<br/>
              Wallet: ₹{userWallet}<br/>
              Extend {extendMinutes} min at ₹{extendRate}/min = ₹{extendMinutes * extendRate}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setSkipExtendPrompt(true);
                  extendConsultation();
                  setTimeout(() => setSkipExtendPrompt(false), 10000);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Yes, Extend
              </button>
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setSkipExtendPrompt(true);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                No, End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
