import React from "react";
import { Link } from "react-router-dom";
import {
  FaFutbol,
  FaVolleyballBall,
  FaTableTennis,
  FaBasketballBall,
} from "react-icons/fa";
import { GiShuttlecock, GiBeachBall } from "react-icons/gi";

// Court configuration
const courtConfig = {
football: { icon: <FaFutbol className="text-3xl text-green-600" />, bg: "bg-black", sideBg: "bg-green-950" },
volleyball: { icon: <FaVolleyballBall className="text-3xl text-yellow-400" />, bg: "bg-black", sideBg: "bg-yellow-700" },
beachVolley: {  icon: <GiBeachBall className="text-3xl text-cyan-700" />, bg: "bg-black", sideBg: "bg-cyan-700" },
badminton: {  icon: <GiShuttlecock className="text-3xl text-blue-400" />, bg: "bg-black", sideBg: "bg-blue-900" },
basketball: { icon: <FaBasketballBall className="text-3xl text-orange-500" />, bg: "bg-black", sideBg: "bg-orange-900" },
tableTennis: {  icon: <FaTableTennis className="text-3xl text-red-400" />, bg: "bg-black", sideBg: "bg-red-900" },
};

// Generate booking slots
function generateBookingSlots(selectedDate) {
  const slots = [];
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();

  for (let hour = 7; hour < 25; hour++) {
    if (isToday && hour <= now.getHours()) continue;
    const start = formatTime(hour);
    const end = formatTime(hour + 1);
    slots.push(`${start} - ${end}`);
  }
  return slots;
}

function formatTime(hour) {
  const period = hour >= 12 && hour < 24 ? "PM" : "AM";
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${adjustedHour}:00 ${period}`;
}

// Booking Ticket Component
const BookingTicket = ({ slot, selectedDate, courtName, courtType,courtPrice, disabled }) => {
  const displayDate = selectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get proper config for the court
  const courtInfo = courtConfig[courtType] || {
    name: courtName || "All Courts",
    icon: <FaFutbol className="text-3xl text-gray-400" />,
    bg: "bg-neutral-800",
    sideBg: "bg-neutral-700",
  };

  return (
    <Link
      to={disabled ? "#" : "/booking-details"}
      state={{ slot, selectedDate, courtName, courtType, courtPrice }}
      className="relative w-[380px]"
    >
      <div
        className={`relative flex flex-col sm:flex-row text-white rounded-2xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-105 ${courtInfo.bg} h-[160px]`}
      >
        {/* Left Section */}
        <div className="flex flex-col justify-between gap-2 p-6 flex-1">
          <div className="flex items-center gap-3">
            {courtInfo.icon}
            <h2 className="text-lg font-bold">{courtName}</h2>
          </div>
          <div>
            <p className="text-sm text-gray-300">{displayDate}</p>
            <p className="text-base font-semibold">{slot}</p>
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`flex flex-col justify-center items-center px-4 border-l border-dashed border-gray-500 ${courtInfo.sideBg}`}
        >
          <p className="text-xs uppercase tracking-widest text-gray-400">Admit</p>
          <p className="text-sm font-bold">Booking</p>
          <p className="text-xs text-gray-400">Orion Sports</p>
        </div>

        {/* Watermark if booked */}
        {disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center rounded-2xl pointer-events-none">
            <span className="text-4xl font-bold text-red-900 opacity-90 select-none">
              BOOKED
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};


export const BookingTicketsList = ({ selectedDate, court, bookedSlots = [], courts = [] }) => {
  const slots = generateBookingSlots(selectedDate);

  if (!courts || courts.length === 0) return null;

const courtsToRender =
  court === "all"
    ? courts.filter((c) => c.status !== "Maintenance")
    : courts.filter((c) => c.courtName === court && c.status !== "Maintenance");


  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {slots.map((slot, slotIndex) =>
        courtsToRender.map((c) => {
          const isBooked = bookedSlots.some(
            (b) => b.courtName === c.courtName && b.slot === slot
          );

          return (
            <BookingTicket
              key={`${slotIndex}-${c.courtName}`}
              slot={slot}
              selectedDate={selectedDate}
              courtName={c.courtName}
              courtType={c.courtType}
              courtPrice={c.hourlyRate}
              disabled={isBooked}
            />
          );
        })
      )}
    </div>
  );
};

export default BookingTicket;
