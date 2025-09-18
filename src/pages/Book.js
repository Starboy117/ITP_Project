import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, selectedDate, court } = location.state || {}; // only exists if navigated from booking-available

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠ Prevent access if user tries to go here directly or via back button
  useEffect(() => {
    if (!slot || !selectedDate || !court) {
      navigate("/available", { replace: true });
    }
  }, [slot, selectedDate, court, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    const [startTime, endTime] = slot.split(" - ");

    const data = {
      name,
      phone: Number(phone),
      email,
      courtName: court,
      date: selectedDate,
      startTime,
      endTime
    };

    try {
      const res = await fetch("http://localhost:5000/api/reservations/addBookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (res.ok) {
        navigate("/booking-success", {
          state: { bookingId: result.bookingId, court, date: selectedDate, slot, name, email, phone, status: result.status },
          replace: true // replace history to prevent going back to form
        });
      } else {
        alert("Booking failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar />
      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-28">
        <h1 className="text-3xl font-bold text-center mb-10">Booking Details</h1>
        <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-8">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {/* Court */}
            <div>
              <label className="block mb-2 font-semibold">Court</label>
              <input type="text" value={court} disabled className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
            </div>

            {/* Slot */}
            <div>
              <label className="block mb-2 font-semibold">Time Slot</label>
              <input type="text" value={slot} disabled className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
            </div>

            {/* Date and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Date</label>
                <input type="text" value={selectedDate?.toLocaleDateString()} disabled className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-semibold">Your Name</label>
              <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]" />
            </div>

            {/* Submit */}
            <div className="text-center mt-4">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition">
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
};

export default BookingDetails;
