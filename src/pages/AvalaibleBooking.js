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

        <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-8">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Court Dropdown */}
            <div>
              <label htmlFor="court" className="block text-white mb-2">
                Choose a Court:
              </label>
              <select
                id="court"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0097B2] transition"
              >
                <option value="all">All Courts</option>
                {courts
                  .filter((c) => c.status !== "Maintenance")
                  .map((c) => (
                    <option key={c.courtName} value={c.courtName}>
                      {courtConfig[c.courtName]?.name || c.courtName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label htmlFor="date" className="block text-white mb-2">
                Choose a Date:
              </label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={today}
                maxDate={maxDate}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                placeholderText="Select a date"
              />
            </div>
          </form>

          {/* Selection Display */}
          {(court || date) && (
            <div className="mt-8 p-4 w-full bg-gray-900 rounded-lg text-gray-300 flex flex-col gap-2">
              {court && (
                <>
                  {court !== "all" && courtConfig[court]?.icon}
                  <p>
                    🏟 Court:{" "}
                    {court === "all"
                      ? "All Courts"
                      : courtConfig[court]?.name || court}
                  </p>
                </>
              )}
              {date && <p>📅 Date: {date.toDateString()}</p>}
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
