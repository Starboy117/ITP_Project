// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AvailableBooking from "./pages/AvalaibleBooking";
import BookingDetails from "./pages/Book";
import BookingSuccess from "./pages/bookSuccess";
import RDashboard from "./receptionistPages/dashboard";
import Bookings from "./receptionistPages/booking";
import Reports from "./receptionistPages/reports";
import Courts from "./receptionistPages/courts";
import Payments from "./receptionistPages/payments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/available" element={<AvailableBooking />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/ReceptionistDashboard" element={<RDashboard />} />
        <Route path="/ReceptionistDashboard/bookings" element={<Bookings />} />
        <Route path="/ReceptionistDashboard/reports" element={<Reports />} />
        <Route path="/ReceptionistDashboard/courts" element={<Courts />} />
        <Route path="/ReceptionistDashboard/payments" element={<Payments />} />
        
      </Routes>
    </Router>
  );
}

export default App;
