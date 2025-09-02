import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login"
import AstrologerRegister from "./pages/AstrologerRegister";
import Navbar from "./components/Navbar";
import Consultancy from "./pages/Consultancy";
import Shopping from "./pages/Shopping";
import UserDashboard from "./pages/UserDashboard";
import Wallet from "./pages/Wallet";
import Payment from "./pages/Payment";
import UserConsultancy from "./pages/UserConsultancy";
import AstrologerDashboard from "./pages/AstrologerDashboard";
import AstrologerConsultations from "./pages/AstrologerConsultations";
import ChatPage from "./pages/ChatPage";
import AstrologerChat from "./pages/AstrologerChat";
import AIConsultation from "./pages/AIConsultation";
import MatchMakingForm from "./pages/MatchMakingForm";
import VideoCall from "./pages/VideoCall";
import WalletSuccess from "./pages/WalletSuccess";
import Astrochat from "./pages/AstroChat"
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="Login" element={<Login />} />
        <Route path="/astrologer/register" element={<AstrologerRegister />} />
        {/* <Route path="/astrologer/login" element={<AstrologerLogin />} /> */}
        <Route path="/consultancy" element={<Consultancy />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/wallet" element={<Wallet />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/user/consultancy" element={<UserConsultancy />} />
        <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />
        <Route
          path="/astrologer/dashboard/consultations"
          element={<AstrologerConsultations />}
        />
        <Route path="/chat/:consultationId" element={<ChatPage />} />
        <Route
          path="/astrologer/chat/:consultationId"
          element={<AstrologerChat />}
        />
        <Route path="/video-call/:consultationId" element={<VideoCall />} />
        <Route path="/ai-consultation" element={<AIConsultation />} />
        <Route path="/match-making" element={<MatchMakingForm />} />
        <Route path="/wallet-success" element={<WalletSuccess />} />
        <Route path="/astrochat" element={<Astrochat />} />
      </Routes>
    </Router>
  );
}

export default App;
