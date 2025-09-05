// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AvailableBooking from "./pages/AvalaibleBooking";
// import other pages here when you add them

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/available" element={<AvailableBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
