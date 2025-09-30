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

        console.log("Profile shared successfully with image!");
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
     {/* Share Icon */}
<div
  className="absolute top-4 right-4 cursor-pointer"
  onClick={shareProfile}
  title={copied ? "Link Copied!" : "Share Profile"}
>
  <svg
    fill="#669c35"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="36px"
    height="36px"
    viewBox="-183.54 -183.54 850.08 850.08"
    stroke="#669c35"
    strokeWidth="0.00483"
    className="hover:scale-110 transition-transform"
  >
    <g>
      <rect
        x="-183.54"
        y="-183.54"
        width="850.08"
        height="850.08"
        rx="221.0208"
        fill="#96d35f"
      ></rect>
      <path d="M395.72,0c-48.204,0-87.281,39.078-87.281,87.281c0,2.036,0.164,4.03,0.309,6.029l-161.233,75.674
        c-15.668-14.971-36.852-24.215-60.231-24.215c-48.204,0.001-87.282,39.079-87.282,87.282c0,48.204,39.078,87.281,87.281,87.281
        c15.206,0,29.501-3.907,41.948-10.741l69.789,58.806c-3.056,8.896-4.789,18.396-4.789,28.322c0,48.204,39.078,87.281,87.281,87.281
        c48.205,0,87.281-39.078,87.281-87.281s-39.077-87.281-87.281-87.281c-15.205,0-29.5,3.908-41.949,10.74l-69.788-58.805
        c3.057-8.891,4.789-18.396,4.789-28.322c0-2.035-0.164-4.024-0.308-6.029l161.232-75.674c15.668,14.971,36.852,24.215,60.23,24.215
        c48.203,0,87.281-39.078,87.281-87.281C482.999,39.079,443.923,0,395.72,0z"></path>
    </g>
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

        {/* ✅ Total Consultation Time (Moved Up + Styled as cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-purple-50 p-4 rounded-xl shadow">
            <p className="text-gray-700 font-semibold">💬 Chat</p>
            <p className="text-xl font-bold text-purple-700">
              {astrologer?.totalChatTime ?? 0} mins
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow">
            <p className="text-gray-700 font-semibold">📹 Video</p>
            <p className="text-xl font-bold text-green-700">
              {astrologer?.totalVideoTime ?? 0} mins
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow">
            <p className="text-gray-700 font-semibold">🎙 Audio</p>
            <p className="text-xl font-bold text-blue-700">
              {astrologer?.totalAudioTime ?? 0} mins
            </p>
          </div>
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
                {astrologer.rates?.video ? `₹${astrologer.rates.video}/min` : "Free"}
              </li>
              <li>
                🎙 Audio:{" "}
                {astrologer.rates?.audio ? `₹${astrologer.rates.audio}/min` : "Free"}
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
