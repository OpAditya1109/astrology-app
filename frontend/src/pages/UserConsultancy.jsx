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
  const [startingConsultationId, setStartingConsultationId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const languages = [
    { value: "", label: "Any" },
    "Assamese","Bengali","Bhojpuri","English","Gujarati","Hindi",
    "Kannada","Malayalam","Marathi","Oriya","Punjabi","Sanskrit","Tamil","Telugu","Urdu"
  ].map(lang => typeof lang === "string" ? { value: lang, label: lang } : lang);

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

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bhavanaastro.onrender.com/api/Consult-astrologers"
        );
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

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const startConsultation = async (astrologerId, mode, route) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    setStartingConsultationId(astrologerId);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations",
        {
          userId: currentUser.id,
          astrologerId,
          topic: mode === "Chat" ? "General Chat" : `${mode} Call`,
          mode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`${route}/${res.data._id}`, { state: { mode } });
    } catch (err) {
      console.error(`Error starting ${mode}:`, err);
      alert(`Failed to start ${mode}. Try again.`);
    } finally {
      setStartingConsultationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md p-6 w-64 z-20
          md:sticky md:top-0 md:h-screen
          transform md:transform-none transition-transform duration-300 ease-in-out
          fixed top-0 left-0 h-full
          ${showFilters ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-purple-700">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-purple-700 hidden md:block">Filters</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Exp (years)</label>
          <input
            type="number"
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Min exp"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Language</label>
          <select
            name="language"
            value={filters.language}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          >
            {categoryOptions.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">System</label>
          <select
            name="system"
            value={filters.system}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          >
            {systemsOptions.map(sys => (
              <option key={sys.value} value={sys.value}>{sys.label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">Consultations</h2>
          <button
            onClick={() => setShowFilters(true)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg"
          >
            Show Filters
          </button>
        </div>

        {/* Title for Desktop */}
        <h2 className="hidden md:block text-2xl font-semibold mb-6 text-purple-700">Consultations</h2>

        {loading ? (
          <p className="text-gray-500">Loading astrologers...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No astrologers found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => (
              <div
                key={c._id}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition flex flex-col items-center text-center"
              >
                <img
                  src={c.photo || "https://via.placeholder.com/150"}
                  alt={c.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-200"
                />
                <h3 className="text-xl font-bold text-purple-700 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{c.systemsKnown?.join(", ") || ""}</p>
                <p className="text-gray-500 mb-1">Exp - {c.experience} yrs</p>
                <p className="text-gray-500 mb-1">{c.languagesKnown?.join(", ") || ""}</p>
                <p className="text-gray-500 mb-4">{c.categories?.join(", ") || ""}</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => startConsultation(c._id, "Chat", "/chat")}
                    disabled={startingConsultationId === c._id}
                    className={`px-4 py-2 text-white rounded-lg ${
                      startingConsultationId === c._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {startingConsultationId === c._id ? "Connecting..." : "Start Chat"}
                  </button>
                  <button
                    onClick={() => startConsultation(c._id, "Video", "/video-call")}
                    disabled={startingConsultationId === c._id}
                    className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    Start Video Call
                  </button>
                  <button
                    onClick={() => startConsultation(c._id, "Audio", "/video-call")}
                    disabled={startingConsultationId === c._id}
                    className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    Start Audio Call
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
