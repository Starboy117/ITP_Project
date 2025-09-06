// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AvailableBooking from "./pages/AvalaibleBooking";
import BookingDetails from "./pages/Book";
// import other pages here when you add them

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/available" element={<AvailableBooking />} />
        <Route path="/booking-details" element={<BookingDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
