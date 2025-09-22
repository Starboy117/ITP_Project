import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slot, selectedDate, courtName, courtType } = location.state || {}; // ✅ use correct values

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Prevent access if not navigated properly
  useEffect(() => {
    if (!slot || !selectedDate || !courtName || !courtType) {
      navigate("/available", { replace: true });
    }
  }, [slot, selectedDate, courtName, courtType, navigate]);

  // ✅ Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10,15}$/.test(phone)) {
      newErrors.phone = "Phone must be 10-15 digits.";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    const [startTime, endTime] = slot.split(" - ");

    const data = {
      name,
      phone: Number(phone),
      email,
      courtName, 
      courtType, 
      date: selectedDate,
      startTime,
      endTime,
    };

    try {
      const res = await fetch("http://localhost:5000/api/reservations/addBookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        navigate("/booking-success", {
          state: {
            bookingId: result.bookingId,
            courtName, 
            courtType, 
            date: selectedDate,
            slot,
            name,
            email,
            phone,
            status: result.status,
          },
          replace: true,
        });
      } else {
        setErrors({ general: result.error });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Error connecting to server" });
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
              <input
                type="text"
                value={courtName}
                disabled
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            {/* Court Type */}
            <div>
              <label className="block mb-2 font-semibold">Court Type</label>
              <input
                type="text"
                value={courtType}
                disabled
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            {/* Slot */}
            <div>
              <label className="block mb-2 font-semibold">Time Slot</label>
              <input
                type="text"
                value={slot}
                disabled
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
            </div>

            {/* Date and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Date</label>
                <input
                  type="text"
                  value={selectedDate?.toLocaleDateString()}
                  disabled
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-3 rounded-lg bg-gray-900 border ${
                    errors.phone ? "border-red-500" : "border-gray-700"
                  } text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 rounded-lg bg-gray-900 border ${
                  errors.name ? "border-red-500" : "border-gray-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg bg-gray-900 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* General error */}
            {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

            {/* Submit */}
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition"
              >
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
