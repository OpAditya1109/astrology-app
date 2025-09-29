import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ThankYouPage from "./pages/ThankYou";
import ScrollToTop from "./ScrollToTop";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login";
import AstrologerProfile from "./pages/AstrologerProfile";  
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
import AudioCall from "./pages/AudioCall";
import WalletSuccess from "./pages/WalletSuccess";
import Astrochat from "./pages/AstroChat";
import Layout from "./pages/Footer"; // 👈 imported as Layout
import RefundCancellation from "./pages/RefundCancellation";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import PricingPolicy from "./pages/PricingPolicy";
import DailyHoroscopes from "./pages/Horoscopes";
import Aboutus from "./pages/About";
import BraceletPage from "./pages/BraceletPage";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import RudrakshaPage from "./pages/RudrakshaPage";
import MalaPage from "./pages/MalaPage";
import GemstonePage from "./pages/GemstonePage";
import YantraPage from "./pages/YantraPage";
import MiscPage from "./pages/MiscPage";
import EducationPage from "./pages/EducationPage";
import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from "./pages/AdminDashboard";
import FreeKundali from "./pages/FreeKundali";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// 🔹 Helper: Get logged-in user from storage
const getStoredUser = () => {
  return (
    JSON.parse(sessionStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("user")) ||
    null
  );
};

// 🔹 Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getStoredUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
       <ScrollToTop />
      <Navbar />
      <Layout>
        <Routes>
          {/* Public Routes */}
      

          <Route path="/" element={<Home />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
           <Route path="/astrologer/:id" element={<AstrologerProfile />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/free-kundali" element={<FreeKundali />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/astrologer/register" element={<AstrologerRegister />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/ai-consultation" element={<AIConsultation />} />
          <Route path="/match-making" element={<MatchMakingForm />} />
          <Route path="/wallet-success" element={<WalletSuccess />} />
          <Route path="/astrochat" element={<Astrochat />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/Horoscopes" element={<DailyHoroscopes />} />
          <Route path="/refund-cancellation" element={<RefundCancellation />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/pricing-policy" element={<PricingPolicy />} />
          <Route path="/shop/bracelet" element={<BraceletPage />} />
          <Route path="/shop/rudraksha" element={<RudrakshaPage />} />
          <Route path="/shop/mala" element={<MalaPage />} />
          <Route path="/shop/gemstone" element={<GemstonePage />} />
          <Route path="/shop/yantra" element={<YantraPage />} />
          <Route path="/shop/misc" element={<MiscPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/occult" element={<EducationPage />} />
          <Route path="/course/:id" element={<CourseDetail />} />

          {/* Protected User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/wallet"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/consultancy"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserConsultancy />
              </ProtectedRoute>
            }
          />

          {/* Protected Astrologer Routes */}
          <Route
            path="/astrologer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["astrologer"]}>
                <AstrologerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/astrologer/dashboard/consultations"
            element={
              <ProtectedRoute allowedRoles={["astrologer"]}>
                <AstrologerConsultations />
              </ProtectedRoute>
            }
          />

          {/* Protected Chat & Video */}
          <Route
            path="/chat/:consultationId"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/astrologer/chat/:consultationId"
            element={
              <ProtectedRoute allowedRoles={["astrologer"]}>
                <AstrologerChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video-call/:consultationId"
            element={
              <ProtectedRoute allowedRoles={["user", "astrologer"]}>
                <VideoCall />
              </ProtectedRoute>
            }
          />

 <Route
            path="/audio-call/:consultationId"
            element={
              <ProtectedRoute allowedRoles={["user", "astrologer"]}>
                <AudioCall/>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
