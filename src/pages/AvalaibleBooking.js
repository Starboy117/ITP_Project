import React, { useState, useEffect } from "react";
import {
  FaFutbol,
  FaVolleyballBall,
  FaBasketballBall,
  FaTableTennis,
} from "react-icons/fa";
import { GiBeachBall, GiShuttlecock } from "react-icons/gi";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BookingTicketsList } from "../BookingAvailableComponents/BookingTicket";

// Court configuration with friendly names, icons, and colors
const courtConfig = {
  football: {
    name: "Futsal Court 1",
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
  beachVolley: {
    name: "Beach Volleyball Court",
    icon: <GiBeachBall className="text-3xl text-cyan-700" />,
    bg: "bg-black",
    sideBg: "bg-cyan-700",
  },
  badminton: {
    name: "Badminton Court 1",
    icon: <GiShuttlecock className="text-3xl text-blue-400" />,
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

function AvailableBooking() {
  const [court, setCourt] = useState("all");
  const [courts, setCourts] = useState([]); // list from backend
  const [date, setDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Fetch courts from backend
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/courts/getAllCourts"
        );
        const data = await res.json();
        // Normalize to array
        const courtList = Array.isArray(data) ? data : data.courts || [];
        setCourts(courtList);
      } catch (err) {
        console.error("Error fetching courts:", err);
        setCourts([]);
      }
    };
    fetchCourts();
  }, []);

  // Fetch booked slots whenever court or date changes
  useEffect(() => {
    if (!court || !date) return;

    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/reservations/check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courtName: court,
              date: date.toISOString(),
            }),
          }
        );
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [court, date]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Navbar />

      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-24">
        <h1 className="text-3xl font-bold text-center text-white mb-10 tracking-wide">
          Available Courts
        </h1>

        <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-700">
  <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Court Dropdown */}
    <div className="space-y-2">
      <label htmlFor="court" className="block text-white font-semibold text-sm uppercase tracking-wide">
        Choose a Court
      </label>
      <div className="relative">
        <select
          id="court"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          className="w-full p-4 rounded-xl bg-neutral-900 text-white border-2 border-neutral-700 focus:outline-none focus:border-[#0097B2] focus:ring-2 focus:ring-[#0097B2]/20 transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value="all" className="bg-neutral-800">All Courts</option>
          {courts
            .filter((c) => c.status !== "Maintenance")
            .map((c) => (
              <option key={c.courtName} value={c.courtName} className="bg-neutral-800">
                {courtConfig[c.courtName]?.name || c.courtName}
              </option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    {/* Date Picker */}
    {/* Date Picker */}
<div className="space-y-2">
  <label htmlFor="date" className="block text-white font-semibold text-sm uppercase tracking-wide">
    Choose a Date
  </label>
  <div className="relative">
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      minDate={today}
      maxDate={maxDate}
      className="w-full p-4 rounded-xl bg-neutral-900 text-white border-2 border-neutral-700 focus:outline-none focus:border-[#0097B2] focus:ring-2 focus:ring-[#0097B2]/20 transition-all duration-300 cursor-pointer"
      placeholderText="Select a date"
      dateFormat="MMMM d, yyyy"
      onKeyDown={(e) => e.preventDefault()}
    />
    
    {/* Calendar icon on the right */}
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</div>

  </form>

  {/* Selection Display */}
  {(court || date) && (
    <div className="mt-8 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl border-2 border-neutral-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#0097B2]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Your Selection
      </h3>
      
      <div className="space-y-3">
        {court && (
          <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
            <div className="w-8 h-8 bg-[#0097B2] rounded-full flex items-center justify-center">
              {court !== "all" ? (
                courtConfig[court]?.icon || <span className="text-white text-sm">🏟</span>
              ) : (
                <span className="text-white text-sm">🏟</span>
              )}
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Selected Court</p>
              <p className="text-white font-semibold">
                {court === "all" 
                  ? "All Courts" 
                  : courtConfig[court]?.name || court
                }
              </p>
            </div>
          </div>
        )}
        
        {date && (
          <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
            <div className="w-8 h-8 bg-[#0097B2] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Selected Date</p>
              <p className="text-white font-semibold">{date.toDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</div>
      </div>

      {/* Booking Tickets */}
      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-12">
        <BookingTicketsList
          selectedDate={date}
          court={court}
          bookedSlots={bookedSlots}
          courts={courts}
        />
      </div>

      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
}

export default AvailableBooking;
