// src/staffPageComponents/BookingModal.js
import React, { useState, useEffect } from "react";

const BookingModal = ({ booking, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courtName: "",
    date: "",
    startTime: "8:00 AM",
    endTime: "9:00 AM",
    status: "Pending",
  });
  const [errors, setErrors] = useState({});
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name || "",
        email: booking.email || "",
        phone: booking.phone || "",
        courtName: booking.courtName || "",
        date: booking.date ? booking.date.split("T")[0] : "",
        startTime: booking.startTime || "8:00 AM",
        endTime: booking.endTime || "9:00 AM",
        status: booking.status || "Pending",
      });
    }
  }, [booking]);

  // Fetch courts from backend
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courts/getAllCourts");
        const data = await res.json();
        const courtList = Array.isArray(data) ? data : data.courts || [];
        setCourts(courtList.filter((c) => c.status !== "Maintenance"));
      } catch (err) {
        console.error("Error fetching courts:", err);
        setCourts([]);
      }
    };
    fetchCourts();
  }, []);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  });

  const getEndTime = (startTime) => {
    const [time, meridian] = startTime.split(" ");
    let [hour] = time.split(":").map(Number);
    hour += 1;
    if (hour === 12) return `12:00 ${meridian === "AM" ? "PM" : "AM"}`;
    if (hour > 12) hour -= 12;
    return `${hour}:00 ${meridian}`;
  };

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value;
    setFormData({
      ...formData,
      startTime: newStart,
      endTime: getEndTime(newStart),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?\d{9,15}$/.test(formData.phone)) newErrors.phone = "Phone must be 9–15 digits.";
    if (!formData.courtName) newErrors.courtName = "Court is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{booking ? "Edit Booking" : "New Booking"}</h2>
        <div className="space-y-3">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 rounded bg-neutral-800 text-white border ${errors.name ? "border-red-500" : "border-transparent"}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full p-2 rounded bg-neutral-800 text-white border ${errors.email ? "border-red-500" : "border-transparent"}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full p-2 rounded bg-neutral-800 text-white border ${errors.phone ? "border-red-500" : "border-transparent"}`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          {/* Court Dropdown */}
          <select
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
            className={`w-full p-2 rounded bg-neutral-800 text-white border ${errors.courtName ? "border-red-500" : "border-transparent"}`}
          >
            <option value="">Select Court</option>
            {courts.map((c) => (
              <option key={c.courtName} value={c.courtName}>
                {c.courtName}
              </option>
            ))}
          </select>
          {errors.courtName && <p className="text-red-500 text-sm">{errors.courtName}</p>}

          {/* Date */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full p-2 rounded bg-neutral-800 text-white border ${errors.date ? "border-red-500" : "border-transparent"}`}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

          {/* Time */}
          <div className="flex gap-2">
            <select
              value={formData.startTime}
              onChange={handleStartTimeChange}
              className="w-1/2 p-2 rounded bg-neutral-800 text-white"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <select
              value={formData.endTime}
              disabled
              className="w-1/2 p-2 rounded bg-neutral-700 text-gray-400 cursor-not-allowed"
            >
              <option>{formData.endTime}</option>
            </select>
          </div>

          {/* Status */}
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
