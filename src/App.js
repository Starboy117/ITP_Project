// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ==== User Pages ====
import Home from "./pages/home";
import AvailableBooking from "./pages/AvalaibleBooking";
import BookingDetails from "./pages/Book";
import BookingSuccess from "./pages/bookSuccess";
import InquiryPage from "./pages/InquiryPage/InquiryPage";
import ManageInquiries from "./pages/InquiryPage/manageInquiries";

// ==== Equipment & Shop Pages ====
import EquipmentManagement from "./EquipmentPages/EquipmentManagement";
import EquipmentDetails from "./EquipmentPages/EquipmentDetails";
import ShopManagement from "./EquipmentPages/ShopManagement";
import UserShop from "./EquipmentPages/UserShop";
import MaintenanceRequests from "./EquipmentPages/MaintenanceRequests";

// ==== Receptionist/Admin Pages ====
import Dashboard from "./receptionistPages/dashboard";
import Bookings from "./receptionistPages/booking";
import Reports from "./receptionistPages/reports";
import Courts from "./receptionistPages/courts";
import Payments from "./receptionistPages/payments";

function App() {
  return (
    <Router>
      <Routes>
        {/* ==== Public/User Routes ==== */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/available" element={<AvailableBooking />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/contact" element={<InquiryPage />} />
        <Route path="/manageInquiry" element={<ManageInquiries />} />

        {/* ==== Equipment & Shop Routes ==== */}
        <Route path="/equipment-management" element={<EquipmentManagement />} />
        <Route path="/equipment-details" element={<EquipmentDetails />} />
        <Route path="/shop-management" element={<ShopManagement />} />
        <Route path="/user-shop" element={<UserShop />} />
        <Route path="/maintenance-requests" element={<MaintenanceRequests />} />

        {/* ==== Receptionist/Admin Routes ==== */}
        <Route path="/ReceptionistDashboard" element={<Dashboard />} />
        <Route path="/ReceptionistDashboard/bookings" element={<Bookings />} />
        <Route path="/ReceptionistDashboard/reports" element={<Reports />} />
        <Route path="/ReceptionistDashboard/courts" element={<Courts />} />
        <Route path="/ReceptionistDashboard/payments" element={<Payments />} />
      </Routes>
    </Router>
  );
}

export default App;
