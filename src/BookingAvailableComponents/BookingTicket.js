import React from "react";
import {
  FaFutbol,
  FaVolleyballBall,
  FaTableTennis,
  FaBasketballBall,
} from "react-icons/fa";
import { GiShuttlecock, GiBeachBall } from "react-icons/gi";

import { Link } from "react-router-dom";


const courtConfig = {
  futsal1: {
    name: "Futsal Court 1",
    icon: <FaFutbol className="text-3xl text-green-600" />,
    bg: "bg-black",
    sideBg: "bg-green-950",
  },
  futsal2: {
    name: "Futsal Court 2",
    icon: <FaFutbol className="text-3xl text-green-600" />,
    bg: "bg-black",
    sideBg: "bg-green-950",
  },
  volleyball: {
    name: "Volleyball Court",
    icon: <FaVolleyballBall className="text-3xl text-yellow-400" />,
    bg: "bg-black",
    sideBg: "bg-yellow-700",
  },
  beach: {
    name: "Beach Volleyball Court",
    icon: <GiBeachBall className="text-3xl text-cyan-700" />,
    bg: "bg-black",
    sideBg: "bg-cyan-700",
  },
  badmintonFamily: {
    name: "Badminton Family Court",
    icon: <GiShuttlecock className="text-3xl text-blue-300" />,
    bg: "bg-black",
    sideBg: "bg-blue-900",
  },
  badminton1: {
    name: "Badminton Court 1",
    icon: <GiShuttlecock className="text-3xl text-blue-400" />,
    bg: "bg-black",
    sideBg: "bg-blue-900",
  },
  badminton2: {
    name: "Badminton Court 2",
    icon: <GiShuttlecock className="text-3xl text-blue-500" />,
    bg: "bg-black",
    sideBg: "bg-blue-900",
  },
  basketball: {
    name: "Basketball Court",
    icon: <FaBasketballBall className="text-3xl text-orange-500" />,
    bg: "bg-black",
    sideBg: "bg-orange-900",
  },
  tableTennis: {
    name: "Table Tennis Room",
    icon: <FaTableTennis className="text-3xl text-red-400" />,
    bg: "bg-black",
    sideBg: "bg-red-900",
  },
};

function generateBookingSlots() {
  const slots = [];
  let startHour = 7; 
  let endHour = 25; 

  for (let hour = startHour; hour < endHour; hour++) {
    let start = formatTime(hour);
    let end = formatTime(hour + 1);
    slots.push(`${start} - ${end}`);
  }

  return slots;
}

function formatTime(hour) {
  let period = hour >= 12 && hour < 24 ? "PM" : "AM";
  let adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${adjustedHour}:00 ${period}`;
}

const BookingTicket = ({ slot, selectedDate, court }) => {
  const displayDate = selectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const courtInfo = courtConfig[court] || {
    name: "All Courts",
    icon: <FaFutbol className="text-3xl text-gray-400" />,
    bg: "bg-neutral-800",
    sideBg: "bg-neutral-700",
  };

  return (
    <Link
      to="/booking-details"
      state={{ slot, selectedDate, court }} // Pass data here
    >
      <div
        className={`relative flex flex-col sm:flex-row w-[380px] text-white rounded-2xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-105 ${courtInfo.bg} h-[160px]`}
      >
        {/* Left Section */}
        <div className="flex flex-col justify-between gap-2 p-6 flex-1">
          <div className="flex items-center gap-3">
            {courtInfo.icon}
            <h2 className="text-lg font-bold">{courtInfo.name}</h2>
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
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Admit
          </p>
          <p className="text-sm font-bold">Booking</p>
          <p className="text-xs text-gray-400">Orion Sports</p>
        </div>
      </div>
    </Link>
  );
};

export const BookingTicketsList = ({ selectedDate, court }) => {
  const slots = generateBookingSlots();

 
  const allCourts = Object.keys(courtConfig);

 
  const courtsToRender = court === "all" ? allCourts : [court];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {slots.map((slot, slotIndex) =>
        courtsToRender.map((c) => (
          <BookingTicket
            key={`${slotIndex}-${c}`}
            slot={slot}
            selectedDate={selectedDate}
            court={c}
          />
        ))
      )}
    </div>
  );
};

export default BookingTicket;
