import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserConsultancy() {
  const [filters, setFilters] = useState({
    experience: "",
    language: "",
    category: "",
    system: "",
  });

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingChatId, setStartingChatId] = useState(null); // to disable buttons while starting chat/video

  const navigate = useNavigate();

  const languages = [
    { value: "", label: "Any" },
    { value: "Assamese", label: "Assamese" },
    { value: "Bengali", label: "Bengali" },
    { value: "Bhojpuri", label: "Bhojpuri" },
    { value: "English", label: "English" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Hindi", label: "Hindi" },
    { value: "Kannada", label: "Kannada" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Marathi", label: "Marathi" },
    { value: "Oriya", label: "Oriya" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Sanskrit", label: "Sanskrit" },
    { value: "Tamil", label: "Tamil" },
    { value: "Telugu", label: "Telugu" },
    { value: "Urdu", label: "Urdu" },
  ];

  const systemsOptions = [
    { value: "", label: "Any" },
    { value: "Angel", label: "Angel Reading" },
    { value: "FaceReading", label: "Face Reading" },
    { value: "Horary", label: "Horary Astrology" },
    { value: "KP", label: "KP System" },
    { value: "LalKitab", label: "Lal Kitab" },
    { value: "Nadi", label: "Nadi Astrology" },
    { value: "Numerology", label: "Numerology" },
    { value: "Palmistry", label: "Palmistry" },
    { value: "Prashna", label: "Prashna Kundali" },
    { value: "Psychic", label: "Psychic Reading" },
    { value: "Tarot", label: "Tarot Reading" },
    { value: "Vastu", label: "Vastu Shastra" },
    { value: "Vedic", label: "Vedic Astrology" },
    { value: "Western", label: "Western Astrology" },
  ];

  const categoryOptions = [
    { value: "", label: "Any" },
    { value: "Business", label: "Business" },
    { value: "Career", label: "Career" },
    { value: "Education", label: "Education" },
    { value: "Finance", label: "Finance" },
    { value: "Health", label: "Health" },
    { value: "Legal", label: "Legal" },
    { value: "Love", label: "Love" },
    { value: "Marriage", label: "Marriage" },
    { value: "Pregnancy", label: "Pregnancy" },
  ];

  // Fetch astrologers
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://bhavanaastro.onrender.com/api/Consult-astrologers");
        setConsultations(response.data.astrologers || []);
      } catch (error) {
        console.error("Error fetching astrologers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologers();
  }, []);

  const filtered = consultations.filter(c =>
    (!filters.experience || c.experience >= Number(filters.experience)) &&
    (!filters.language || c.languagesKnown?.map(l => l.toLowerCase()).includes(filters.language.toLowerCase())) &&
    (!filters.category || c.categories?.map(cat => cat.toLowerCase()).includes(filters.category.toLowerCase())) &&
    (!filters.system || c.systemsKnown?.map(sys => sys.toLowerCase()).includes(filters.system.toLowerCase()))
  );

  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  // Start Chat
  const handleStartChat = async (astrologerId) => {
    await startConsultation(astrologerId, "Chat", "/chat");
  };

  // Start Video Call
  const handleStartVideoCall = async (astrologerId) => {
    await startConsultation(astrologerId, "Video", "/video-call");
  };

  // Shared function to start chat or video consultation
  const startConsultation = async (astrologerId, mode, route) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    setStartingChatId(astrologerId);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations",
        { userId: currentUser.id, astrologerId, topic: mode === "Chat" ? "General Chat" : "Video Call", mode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const consultationId = res.data._id;
      navigate(`${route}/${consultationId}`);
    } catch (err) {
      console.error(`Error starting ${mode}:`, err);
      alert(`Failed to start ${mode}. Try again.`);
    } finally {
      setStartingChatId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Filter */}
      <aside className="w-64 bg-white shadow-md p-6 sticky top-0 h-screen">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Filters</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Exp (years)</label>
          <input type="number" name="experience" value={filters.experience} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" placeholder="Min exp" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Language</label>
          <select name="language" value={filters.language} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full">
            {languages.map((lang) => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Category</label>
          <select name="category" value={filters.category} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full">
            {categoryOptions.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">System</label>
          <select name="system" value={filters.system} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full">
            {systemsOptions.map((sys) => <option key={sys.value} value={sys.value}>{sys.label}</option>)}
          </select>
        </div>
      </aside>

      {/* Consultation List */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">Consultations</h2>

        {loading ? (
          <p className="text-gray-500">Loading astrologers...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No astrologers found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, index) => (
              <div key={index} className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-purple-700 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{c.systemsKnown?.join(", ") || ""}</p>
                <p className="text-gray-500 mb-1">Exp - {c.experience} yrs</p>
                <p className="text-gray-500 mb-1">{c.languagesKnown?.join(", ") || ""}</p>
                <p className="text-gray-500 mb-4">{c.categories?.join(", ") || ""}</p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartChat(c._id)}
                    disabled={startingChatId === c._id}
                    className={`px-4 py-2 text-white rounded-lg ${startingChatId === c._id ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                  >
                    {startingChatId === c._id ? "Connecting..." : "Start Chat"}
                  </button>

                  <button
                    onClick={() => handleStartVideoCall(c._id)}
                    disabled={startingChatId === c._id}
                    className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    Start Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
