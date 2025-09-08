import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login";
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
import Astrochat from "./pages/AstroChat";
import Layout from "./pages/Footer"; // 👈 import Layout instead of Footer
import RefundCancellation from "./pages/RefundCancellation";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import PricingPolicy from "./pages/PricingPolicy";
import DailyHoroscopes from "./pages/Horoscopes";
import Aboutus from "./pages/About"
import BraceletPage from "./pages/BraceletPage"
function App() {
  return (
    <Router>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/astrologer/register" element={<AstrologerRegister />} />

          {/* Consultancy & Shopping */}
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/shopping" element={<Shopping />} />

          {/* User Dashboard & Wallet */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/wallet" element={<Wallet />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/user/consultancy" element={<UserConsultancy />} />

          {/* Astrologer Dashboard */}
          <Route
            path="/astrologer/dashboard"
            element={<AstrologerDashboard />}
          />
          <Route
            path="/astrologer/dashboard/consultations"
            element={<AstrologerConsultations />}
          />

          {/* Chat & Video */}
          <Route path="/chat/:consultationId" element={<ChatPage />} />
          <Route
            path="/astrologer/chat/:consultationId"
            element={<AstrologerChat />}
          />
          <Route path="/video-call/:consultationId" element={<VideoCall />} />

          {/* AI & Matchmaking */}
          <Route path="/ai-consultation" element={<AIConsultation />} />
          <Route path="/match-making" element={<MatchMakingForm />} />

          {/* Wallet success (redirect page from Cashfree) */}
          <Route path="/wallet-success" element={<WalletSuccess />} />

          {/* Astrochat */}
          <Route path="/astrochat" element={<Astrochat />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/Horoscopes" element={<DailyHoroscopes />} />
          <Route path="/refund-cancellation" element={<RefundCancellation />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/pricing-policy" element={<PricingPolicy />} />


          <Route path="/shop/bracelet" element={<BraceletPage />}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
