import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

import { AuthProvider, useAuth } from "./Context/AuthContext"; // ✅ import

// ✅ Protect routes if user is not logged in
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
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

            {/* ✅ Protected User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/consultancy"
              element={
                <ProtectedRoute>
                  <UserConsultancy />
                </ProtectedRoute>
              }
            />

            {/* ✅ Protected Astrologer Routes */}
            <Route
              path="/astrologer/dashboard"
              element={
                <ProtectedRoute>
                  <AstrologerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/astrologer/dashboard/consultations"
              element={
                <ProtectedRoute>
                  <AstrologerConsultations />
                </ProtectedRoute>
              }
            />

            {/* Chat & Video (protected) */}
            <Route
              path="/chat/:consultationId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/astrologer/chat/:consultationId"
              element={
                <ProtectedRoute>
                  <AstrologerChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/video-call/:consultationId"
              element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              }
            />

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

            {/* Shop pages */}
            <Route path="/shop/bracelet" element={<BraceletPage />} />
            <Route path="/shop/rudraksha" element={<RudrakshaPage />} />
            <Route path="/shop/mala" element={<MalaPage />} />
            <Route path="/shop/gemstone" element={<GemstonePage />} />
            <Route path="/shop/yantra" element={<YantraPage />} />
            <Route path="/shop/misc" element={<MiscPage />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            {/* Education */}
            <Route path="/occult" element={<EducationPage />} />
            <Route path="/course/:id" element={<CourseDetail />} />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
