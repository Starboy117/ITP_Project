import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import BookingModal from "../staffPageComponents/BookingModel";
import Sidebar from "../staffPageComponents/sideBar";

const Bookings = () => {
  const [reservations, setBookings] = useState([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Notification component
  const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
      <div
        className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300 ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        <span>{message}</span>
        <button className="ml-4 font-bold" onClick={onClose}>
          X
        </button>
      </div>
    );
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Save booking (Create or Update)
  const handleSaveBooking = async (formData) => {
    try {
      let response, data;

      if (selectedBooking) {
        response = await fetch(
          `http://localhost:5000/api/reservations/updateReservation/${selectedBooking._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/reservations/addBookings",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include", // <--- include cookies/session
          }
        );
      }

      data = await response.json();

      if (response.ok) {
        const bookingData = data.reservation || data;
        if (selectedBooking) {
          setBookings((prev) =>
            prev.map((b) => (b._id === selectedBooking._id ? bookingData : b))
          );
          showNotification("Booking updated successfully!", "success");
        } else {
          setBookings((prev) => [...prev, bookingData]);
          showNotification("Booking created successfully!", "success");
        }
        setShowModal(false);
        setSelectedBooking(null);
      } else {
        showNotification(data.error || "Something went wrong.", "error");
      }
    } catch (error) {
      showNotification(error.message || "Server error.", "error");
    }
  };

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reservations/getAllReservation"
        );
        const data = await response.json();
        setBookings(data.reservations || []);
        setCount(data.count || 0);
        setLoading(false);
      } catch (error) {
        showNotification("Error fetching bookings.", "error");
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  // Filtered reservations
  const filteredReservations = reservations.filter((booking) => {
    if (!booking) return false;
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courtName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      booking.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setShowModal(true);
  };

  // Open delete modal
  const confirmDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  // Perform deletion
  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/deleteReservation/${bookingToDelete._id}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        setBookings((prev) =>
          prev.filter((b) => b._id !== bookingToDelete._id)
        );
        showNotification(
          data.message || "Booking deleted successfully!",
          "success"
        );
      } else {
        showNotification(data.message || "Failed to delete booking.", "error");
      }
    } catch (error) {
      showNotification(
        error.message || "Server error while deleting booking.",
        "error"
      );
    } finally {
      setBookingToDelete(null);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading bookings...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <Sidebar />

      <div className="flex-1 space-y-6 p-6 ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">Bookings Management</h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage all court bookings and reservations
            </p>
          </div>
          <button
            onClick={handleNewBooking}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Booking
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-md leading-5 bg-neutral-900 border border-neutral-700 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-neutral-700">
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {filteredReservations.map((b) => (
                <tr key={b._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {b.bookingId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {b.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {b.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {b.phone || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {b.courtName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {b.date ? new Date(b.date).toLocaleDateString() : "-"} •{" "}
                    {b.startTime || "-"} - {b.endTime || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        b.status === "Confirmed"
                          ? "bg-green-900 text-green-300"
                          : b.status === "Pending"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {b.status || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditBooking(b)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteBooking(b)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Modal */}
        {showModal && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setShowModal(false)}
            onSave={handleSaveBooking}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && bookingToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-sm text-center">
              <h2 className="text-xl font-bold mb-4 text-white">
                Delete Booking?
              </h2>
              <p className="mb-6 text-gray-300">
                Are you sure you want to delete booking for{" "}
                <strong>{bookingToDelete.name}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBooking}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
