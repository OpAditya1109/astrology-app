import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// Icons
import micOnIcon from "../assets/mic-on.png";
import micOffIcon from "../assets/mic-off.png";

const SOCKET_SERVER_URL = "https://bhavanaastro.onrender.com";

export default function AudioCall() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "user";

  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const targetSocketRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const localStreamRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);

  // Extension logic
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(5);
  const [extendRate, setExtendRate] = useState(0);
  const [userWallet, setUserWallet] = useState(0);
  const [extending, setExtending] = useState(false);
  const [skipExtendPrompt, setSkipExtendPrompt] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // Store full consultation
  const [consultation, setConsultation] = useState(null);

  const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  // End call
// End call
const endCall = () => {
  const socket = socketRef.current;
  if (socket) {
    socket.emit("endAudioCall", { roomId: consultationId });
    socket.emit("leaveAudioRoom", { roomId: consultationId });
    socket.disconnect();
  }

  if (peerConnectionRef.current) peerConnectionRef.current.close();
  if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
  if (remoteAudioRef.current?.srcObject) {
    remoteAudioRef.current.srcObject.getTracks().forEach((t) => t.stop());
    remoteAudioRef.current.srcObject = null;
  }

  // ✅ Show review modal only if role is "user"
  if (role === "user") {
    setShowReviewModal(true);
  } else {
    navigate("/astrologer/dashboard"); // or wherever astrologers should go
  }
};

  // Fetch consultation rate and wallet
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://bhavanaastro.onrender.com/api/consultations/details/${consultationId}`);
        const data = await res.json();
        setConsultation(data);
        setExtendRate(data.ratePerMinute || 0);

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

  // WebRTC & Socket.IO
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        if (localAudioRef.current) localAudioRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (e) {
        console.error("getUserMedia error:", e);
        setStatus("Mic permission denied");
      }
    })();

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        socket.emit("audio-ice-candidate", {
          roomId: consultationId,
          to: targetSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    socket.emit("joinAudioRoom", { roomId: consultationId, role });

    socket.on("audio-existing-peers", async ({ peers }) => {
      if (role === "user" && peers.length > 0) {
        targetSocketRef.current = peers[0];
        setStatus("Ringing...");
        await startCall();
      } else if (role === "user") {
        setStatus("Waiting for astrologer...");
      }
    });

    socket.on("audio-incoming-call", async ({ from, offer }) => {
      targetSocketRef.current = from;
      setStatus("Ringing...");
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("audio-answer-call", { roomId: consultationId, to: from, answer });
    });

    socket.on("audio-call-answered", async ({ answer }) => {
      if (!pc) return;
      await pc.setRemoteDescription(answer);
      setStatus("Connected");
    });

    socket.on("audio-timer-started", ({ remaining }) => {
      setSecondsLeft(remaining);
      setStatus("Connected");
    });

    socket.on("audio-ice-candidate", async ({ candidate }) => {
      try {
        if (!pc) return;
        await pc.addIceCandidate(candidate?.candidate ? candidate : new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socket.on("user-left", ({ message }) => {
      setStatus(message);
      if (remoteAudioRef.current?.srcObject) {
        remoteAudioRef.current.srcObject.getTracks().forEach((t) => t.stop());
        remoteAudioRef.current.srcObject = null;
      }
      setTimeout(() => navigate(-1), 5000);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
      pc.close();
    };
  }, [consultationId, role]);

  const startCall = async () => {
    const pc = peerConnectionRef.current;
    const socket = socketRef.current;
    if (!pc || !socket || !targetSocketRef.current) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("audio-call-user", { roomId: consultationId, to: targetSocketRef.current, offer });
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
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
      socketRef.current.emit("extendAudioTimer", { roomId: consultationId, extendMinutes });
    } catch (err) {
      console.error(err);
      alert("Failed to extend call. Try again.");
    } finally {
      setExtending(false);
    }
  };

  // --- Show Extend Modal when call is about to end ---
  useEffect(() => {
    if (!skipExtendPrompt && secondsLeft !== null && secondsLeft <= 30) {
      setShowExtendModal(true);
    }
  }, [secondsLeft, skipExtendPrompt]);

  const submitReview = async () => {
    try {
      if (!reviewRating) return alert("Please select a rating");

      await fetch("https://bhavanaastro.onrender.com/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId,
          astrologerId: consultation?.astrologerId,
          userId: currentUser.id,
          rating: reviewRating,
          feedback: reviewFeedback,
        }),
      });

      alert("Thank you for your review!");
      setShowReviewModal(false);
      navigate("/user/consultancy");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Persistent hidden audio elements */}
      <audio ref={remoteAudioRef} autoPlay controls={false} className="hidden" />
      <audio ref={localAudioRef} autoPlay controls={false} muted className="hidden" />

      {/* Status + Timer */}
      <div className="absolute top-4 left-4 flex gap-4 items-center">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">{status}</div>
        {status === "Connected" && secondsLeft !== null && (
          <div className="bg-black bg-opacity-50 text-green-400 px-4 py-2 rounded-lg font-mono">{formatTime(secondsLeft)}</div>
        )}
      </div>

      <button
        onClick={endCall}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition"
      >
        End
      </button>

      {/* Controls */}
      <div className="absolute bottom-4 flex gap-6 bg-black bg-opacity-60 px-6 py-3 rounded-full">
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
        >
          <img src={isMuted ? micOffIcon : micOnIcon} alt="Mic" className="w-6 h-6" />
        </button>
      </div>

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">
              ⏰ Call is about to end.<br />
              Wallet: ₹{userWallet}<br />
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Rate Your Consultation</h2>
            <div className="mb-4">
              <label>Rating:</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="border p-2 rounded w-full mt-1"
              >
                <option value={0}>Select Rating</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Feedback (optional):</label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="border p-2 rounded w-full mt-1"
                rows={3}
                placeholder="Write your feedback..."
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={submitReview}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  navigate("/user/consultancy");
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
