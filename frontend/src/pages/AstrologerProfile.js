import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstrologerProfile() {
  const { id } = useParams();
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingConsultation, setStartingConsultation] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/Consult-astrologers/${id}`
        );
        setAstrologer(res.data);
      } catch (err) {
        console.error("Error fetching astrologer profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBalance = async () => {
      const currentUser = JSON.parse(sessionStorage.getItem("user"));
      if (!currentUser?.id) return;
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/users/${currentUser.id}/details`
        );
        setUserBalance(res.data.wallet?.balance || 0);
      } catch (err) {
        console.error("Error fetching user balance:", err);
      }
    };

    fetchAstrologer();
    fetchUserBalance();
  }, [id]);

  const startConsultation = async (mode, rate) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const first5MinCost = rate * 5;
    if (userBalance < first5MinCost) {
      alert(`Insufficient balance. First 5 min cost: ₹${first5MinCost}`);
      navigate("/user/wallet");
      return;
    }

    setStartingConsultation(true);

    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations",
        {
          userId: currentUser.id,
          astrologerId: astrologer._id,
          topic: mode === "Chat" ? "General Chat" : `${mode} Call`,
          mode,
          rate,
          kundaliUrl: currentUser.kundaliUrl || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserBalance((prev) => prev - first5MinCost);

      // Navigate dynamically based on mode
      let route = "/chat";
      if (mode === "Video") route = "/video-call";
      else if (mode === "Audio") route = "/audio-call";

      navigate(`${route}/${res.data._id}`, { state: { mode } });
    } catch (err) {
      console.error(`Error starting ${mode}:`, err);
      alert(`Failed to start ${mode}. Try again.`);
    } finally {
      setStartingConsultation(false);
    }
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/astrologer/${id}`;

    if (navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const response = await fetch(astrologer.photo);
        const blob = await response.blob();
        const file = new File([blob], "astrologer.jpg", { type: blob.type });

        await navigator.share({
          title: "Check out this astrologer!",
          text: `I found this astrologer on Bhavana Astro: ${astrologer.name}`,
          url: profileUrl,
          files: [file],
        });
      } catch (err) {
        console.error("Error sharing profile with image:", err);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this astrologer!",
          text: `I found this astrologer on Bhavana Astro: ${astrologer.name}`,
          url: profileUrl,
        });
      } catch (err) {
        console.error("Error sharing profile:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy URL:", err);
        alert("Failed to share profile.");
      }
    }
  };

  if (loading) return <p className="text-gray-500">Loading profile...</p>;
  if (!astrologer) return <p className="text-red-500">Astrologer not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full relative">
        {/* Share Button */}
        <div
          className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-purple-600"
          onClick={shareProfile}
          title={copied ? "Link Copied!" : "Share Profile"}
        >
          {/* Share Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 8a3 3 0 100-6 3 3 0 000 6zM15 20a3 3 0 100-6 3 3 0 000 6zM3 12a3 3 0 116 0 3 3 0 01-6 0zM8.59 13.51L13.5 17m0-10l-4.91 3.49"
            />
          </svg>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={astrologer.photo || "https://via.placeholder.com/150"}
            alt={astrologer.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-purple-200 shadow-md"
          />
          <h2 className="text-3xl font-bold text-purple-700 mb-1">{astrologer.name}</h2>
          <p className="text-gray-500 italic mb-4">
            {astrologer.city}, {astrologer.country}
          </p>
        </div>

        {/* Total Consultation Time */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Total Consultation Time
          </h3>
          <ul className="text-gray-600 space-y-1">
            <li>💬 Chat: {astrologer?.totalChatTime ?? 0} mins</li>
            <li>📹 Video: {astrologer?.totalVideoTime ?? 0} mins</li>
            <li>🎙 Audio: {astrologer?.totalAudioTime ?? 0} mins</li>
          </ul>
        </div>

        {/* About */}
        {astrologer.description && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">About Me</h3>
            <p className="text-gray-600 leading-relaxed">{astrologer.description}</p>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-700 font-semibold">Experience</p>
            <p className="text-gray-600">{astrologer.experience} years</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Languages</p>
            <p className="text-gray-600">
              {astrologer.languagesKnown?.join(", ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Categories</p>
            <p className="text-gray-600">
              {astrologer.categories?.join(", ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Systems Known</p>
            <p className="text-gray-600">
              {astrologer.systemsKnown?.join(", ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Rates</p>
            <ul className="text-gray-600">
              <li>
                💬 Chat:{" "}
                {astrologer.rates?.chat ? `₹${astrologer.rates.chat}/min` : "Free"}
              </li>
              <li>
                📹 Video:{" "}
                {astrologer.rates?.video
                  ? `₹${astrologer.rates.video}/min`
                  : "Free"}
              </li>
              <li>
                🎙 Audio:{" "}
                {astrologer.rates?.audio
                  ? `₹${astrologer.rates.audio}/min`
                  : "Free"}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Availability</p>
            <ul className="text-gray-600">
              <li>
                💬 Chat:{" "}
                <span
                  className={
                    astrologer.online?.chat
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }
                >
                  {astrologer.online?.chat ? "Online" : "Offline"}
                </span>
              </li>
              <li>
                📹 Video:{" "}
                <span
                  className={
                    astrologer.online?.video
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }
                >
                  {astrologer.online?.video ? "Online" : "Offline"}
                </span>
              </li>
              <li>
                🎙 Audio:{" "}
                <span
                  className={
                    astrologer.online?.audio
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }
                >
                  {astrologer.online?.audio ? "Online" : "Offline"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Consultation Buttons */}
        <div className="flex gap-4 flex-wrap justify-center mb-6">
          {["Chat", "Video", "Audio"].map((mode) => {
            const rate = astrologer.rates?.[mode.toLowerCase()] || 0;
            const online = astrologer.online?.[mode.toLowerCase()];
            return (
              <button
                key={mode}
                onClick={() => startConsultation(mode, rate)}
                disabled={!online || startingConsultation}
                className={`px-4 py-2 rounded-lg text-white ${
                  !online
                    ? "bg-gray-400 cursor-not-allowed"
                    : mode === "Chat"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : mode === "Video"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {mode} {rate ? `₹${rate}/min` : "Free"}
              </button>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-8 py-2 rounded-lg hover:bg-purple-700 shadow-md"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
