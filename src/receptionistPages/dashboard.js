import React, { useState, useEffect } from "react";
import Sidebar from "../staffPageComponents/sideBar";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);
  const [activeCourts, setActiveCourts] = useState(0); // ✅ active courts
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);

  // Fetch today's bookings
  useEffect(() => {
    const fetchTodayBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reservations/todayReservations",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await response.json();
        setBookings(data.bookings || []);
        setCount(data.count || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };
    fetchTodayBookings();
  }, []);

  // Fetch active courts
  useEffect(() => {
    const fetchActiveCourts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courts/getActiveCourts"
        );
        const data = await response.json();
        setActiveCourts(data.activeCount || 0); // set active courts count
      } catch (error) {
        console.error("Error fetching active courts:", error);
      }
    };
    fetchActiveCourts();
  }, []);

  // Fetch weekly bookings
  useEffect(() => {
    const fetchWeeklyBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/stats/weekly-bookings"
        );
        const data = await response.json();
        setWeeklyData(data);
      } catch (error) {
        console.error("Error fetching weekly bookings:", error);
        setWeeklyData([
          { day: "Sun", bookings: 0 },
          { day: "Mon", bookings: 0 },
          { day: "Tue", bookings: 0 },
          { day: "Wed", bookings: 0 },
          { day: "Thu", bookings: 0 },
          { day: "Fri", bookings: 0 },
          { day: "Sat", bookings: 0 },
        ]);
      }
    };
    fetchWeeklyBookings();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-neutral-800 shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-white">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-900">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 text-white">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="mt-1 text-sm text-gray-400">Overview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Today's Bookings"
            value={count}
            icon={CalendarDaysIcon}
            color="text-blue-400"
          />
          <StatCard
            title="Weekly Revenue"
            value="0"
            icon={CreditCardIcon}
            color="text-green-400"
          />
          <StatCard
            title="Active Courts"
            value={activeCourts} // ✅ dynamic active courts
            icon={BuildingOfficeIcon}
            color="text-amber-400"
          />
        </div>

        {/* Weekly Bookings Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-white mb-4">
              Weekly Bookings
            </h3>
            <BarChart width={400} height={250} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
              />
              <Bar dataKey="bookings" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">
              Today's Bookings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Booking activities
            </p>
          </div>
          <ul className="divide-y divide-gray-700">
            {bookings.map((booking) => (
              <li
                key={booking.bookingId}
                className="px-4 py-4 hover:bg-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-200">
                          {booking.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {booking.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {booking.courtName} • {booking.startTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-neutral-700 px-4 py-3 text-right">
            <Link to="/ReceptionistDashboard/bookings">
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                View all bookings →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
