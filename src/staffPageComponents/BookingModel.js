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

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  });

  // Function to calculate end time (start + 1 hour)
  const getEndTime = (startTime) => {
    const [time, meridian] = startTime.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    hour += 1; // add 1 hour
    if (hour === 12) {
      return `12:00 ${meridian === "AM" ? "PM" : "AM"}`;
    } else if (hour > 12) {
      hour -= 12;
      return `${hour}:00 ${meridian === "AM" ? "PM" : "AM"}`;
    }
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

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{booking ? "Edit Booking" : "New Booking"}</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Court Name"
            name="courtName"
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />

          <div className="flex gap-2">
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleStartTimeChange}
              className="w-1/2 p-2 rounded bg-neutral-800 text-white"
            >
              {timeOptions.map((time, idx) => (
                <option key={idx} value={time}>{time}</option>
              ))}
            </select>
            <select
              name="endTime"
              value={formData.endTime}
              disabled
              className="w-1/2 p-2 rounded bg-neutral-700 text-gray-400 cursor-not-allowed"
            >
              <option>{formData.endTime}</option>
            </select>
          </div>

          <select
            name="status"
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
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
