import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Navbar from "./HomeComponents/Navbar";

// Pages
import Home from "./pages/home";
import AboutUs from "./pages/AboutUs";
import AvailableBooking from "./pages/AvalaibleBooking";
import BookingDetails from "./pages/Book";
import BookingSuccess from "./pages/bookSuccess";
import InquiryPage from "./pages/InquiryPage/InquiryPage";
import ManageInquiries from "./pages/InquiryPage/manageInquiries";
import UserPayment from "./pages/userPayment";
import PaymentSuccessPage from "./pages/paymentSuccess";
import ViewBookings from "./pages/ViewBookings";

// Equipment & Shop
import EquipmentManagement from "./EquipmentPages/EquipmentManagement";
import EquipmentDetails from "./EquipmentPages/EquipmentDetails";
import ShopManagement from "./EquipmentPages/ShopManagement";
import UserShop from "./EquipmentPages/UserShop";
import MaintenanceRequests from "./EquipmentPages/MaintenanceRequests";

// Auth/Admin
import Login from "./AuthContextComponents/Login";
import Register from "./AuthContextComponents/Register";
import AdminDashboard from "./AuthContextComponents/AdminDashboard";
import StaffManagement from "./AuthContextComponents/StaffManagement";
import UserProfile from "./AuthContextComponents/UserProfile";
import ProtectedRoute from "./AuthContextComponents/ProtectedRoute";

// Receptionist
import RDashboard from "./receptionistPages/dashboard";
import Bookings from "./receptionistPages/booking";
import Reports from "./receptionistPages/reports";
import Courts from "./receptionistPages/courts";
import Payments from "./receptionistPages/payments";
import PaymentPage from "./receptionistPages/payments";

const AppWrapper = () => {
  const location = useLocation();
  const NAVBAR_HEIGHT = 64; // px

  const isDashboardPage = [
    "/AdminDashboard",
    "/StaffManagement",
    "/ReceptionistDashboard",
    "/ReceptionistDashboard/bookings",
    "/ReceptionistDashboard/reports",
    "/ReceptionistDashboard/courts",
    "/ReceptionistDashboard/payments",
    "/manageInquiry",
    "/equipment-management",
    "/shop-management",
    "/maintenance-requests",
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: isDashboardPage ? `${NAVBAR_HEIGHT}px` : "0px" }}>
        <Routes>
          {/* Public/User */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/available" element={<AvailableBooking />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/contact" element={<InquiryPage />} />
          <Route path="/pay" element={<UserPayment />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/viewBookings" element={<ViewBookings/>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Equipment & Shop */}
          <Route path="/equipment-management" element={<EquipmentManagement />} />
          <Route path="/equipment-details" element={<EquipmentDetails />} />
          <Route path="/shop-management" element={<ShopManagement />} />
          <Route path="/user-shop" element={<UserShop />} />
          <Route path="/maintenance-requests" element={<MaintenanceRequests />} />

          {/* Admin */}
          <Route path="/AdminDashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/StaffManagement" element={<ProtectedRoute adminOnly={true}><StaffManagement /></ProtectedRoute>} />

          {/* User Profile */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Receptionist */}
          <Route path="/ReceptionistDashboard" element={<RDashboard />} />
          <Route path="/ReceptionistDashboard/bookings" element={<Bookings />} />
          <Route path="/ReceptionistDashboard/reports" element={<Reports />} />
          <Route path="/ReceptionistDashboard/courts" element={<Courts />} />
          <Route path="/ReceptionistDashboard/payments" element={<Payments />} />
          <Route path="/manageInquiry" element={<ManageInquiries />} />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
