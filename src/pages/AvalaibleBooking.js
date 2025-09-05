import React, { useState } from "react";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingTicket from "../BookingAvailableComponents/BookingTicket";
import { BookingTicketsList } from "../BookingAvailableComponents/BookingTicket";

function AvailableBooking() {
  const [court, setCourt] = useState("all");

  // Set default date to today
  const today = new Date();
  const [date, setDate] = useState(today);

  // Limit date selection: today → today + 30 days
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Navbar />

      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-24">
        <h1 className="text-3xl font-bold text-center text-white mb-10 tracking-wide">
          Available Courts
        </h1>

        <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-8">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <option value="futsal1">Futsal Court 1</option>
                <option value="futsal2">Futsal Court 2</option>
                <option value="volleyball">Volleyball Court</option>
                <option value="beach">Beach Volleyball Court</option>
                <option value="badmintonFamily">Badminton Family Court</option>
                <option value="badminton1">Badminton Court 1</option>
                <option value="badminton2">Badminton Court 2</option>
                <option value="basketball">Basketball Court</option>
                <option value="tableTennis">Table Tennis Room</option>
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

          {(court || date) && (
            <div className="mt-8 p-4 w-full bg-gray-900 rounded-lg text-gray-300">
              <h2 className="text-lg font-semibold text-white mb-2">
                Your Selection:
              </h2>
              {court && (
                <p>🏟 Court: {court === "all" ? "All Courts" : court}</p>
              )}

              {date && <p>📅 Date: {date.toDateString()}</p>}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              className="px-6 py-3 bg-[#0097B2] text-white rounded-lg shadow-md hover:bg-[#007A8F] transition"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 sm:px-12 lg:px-24 mt-24">
  <BookingTicketsList selectedDate={date} court={court} />
</div>


      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
}

export default AvailableBooking;
