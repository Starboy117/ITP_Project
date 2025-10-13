import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../HomeComponents/Navbar";
import Footer from "../BookingAvailableComponents/CopyrightFooter";

export default function ViewBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, type: "", message: "", bookingId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reservations/user", {
          withCredentials: true,
        });

        const bookingsWithPrice = await Promise.all(
          res.data.bookings.map(async (b) => {
            try {
              const courtRes = await axios.get(
                `http://localhost:5000/api/courts/name/${encodeURIComponent(b.courtName)}`
              );
              const slot = b.slot || (b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : "");
              return { ...b, courtPrice: courtRes.data.court.hourlyRate, slot };
            } catch (err) {
              console.error("Error fetching court price for", b.courtName, err);
              const slot = b.slot || (b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : "");
              return { ...b, courtPrice: "N/A", slot };
            }
          })
        );

        setBookings(bookingsWithPrice);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case "confirmed":
        return `${baseStyles} bg-green-500/20 text-green-400 border border-green-500/30`;
      case "pending":
        return `${baseStyles} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case "cancelled":
        return `${baseStyles} bg-red-500/20 text-red-400 border border-red-500/30`;
      default:
        return `${baseStyles} bg-gray-500/20 text-white border border-gray-500/30`;
    }
  };

  const confirmCancelBooking = (bookingId) => {
    setModal({ open: true, type: "confirm", message: "Are you sure you want to cancel this booking?", bookingId });
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/reservations/cancel/${bookingId}`,
        {},
        { withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b))
      );
      setModal({ open: true, type: "success", message: "Booking cancelled successfully!" });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setModal({ open: true, type: "error", message: "Failed to cancel booking." });
    }
  };

  const isPastBooking = (b) => {
    const now = new Date();
    const bookingDate = new Date(b.date);

    if (b.startTime) {
      const parts = b.startTime.split(" ");
      if (parts.length === 2) {
        let [time, meridian] = parts;
        let [hours, minutes] = time.split(":").map(Number);

        if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

        bookingDate.setHours(hours, minutes, 0, 0);
      }
    }

    return now >= bookingDate;
  };

  const SkeletonLoader = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-gray-800/50 p-6 rounded-xl animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex flex-col pb-5">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0097B2] to-teal-400 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-gray-400 text-lg">Manage and view all your court reservations</p>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No bookings found</h3>
            <p className="text-gray-500">You haven't made any reservations yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => {
              const past = isPastBooking(b);
              return (
                <div
                  key={b._id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#0097B2]/30 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-[#0097B2] transition-colors duration-300">
                      {b.courtName}
                    </h2>
                    <span className={getStatusStyles(b.status)}>{b.status}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">
                        {new Date(b.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <span className="font-medium">Time Slot:</span>
                      <span className="ml-2">{b.slot}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <span className="font-medium">Price:</span>
                      <span className="ml-2">Rs. {b.courtPrice}</span>
                    </div>
                  </div>

                  {!past && b.status.toLowerCase() === "pending" && (
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => navigate("/pay", { state: b })}
                        className="flex-1 bg-gradient-to-r from-[#0097B2] to-teal-400 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => confirmCancelBooking(b.bookingId)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-80 text-center">
            <p className="text-white mb-6">{modal.message}</p>

            {modal.type === "confirm" ? (
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => cancelBooking(modal.bookingId)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setModal({ open: false, type: "", message: "", bookingId: null })}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModal({ open: false, type: "", message: "", bookingId: null })}
                className="bg-teal-500 text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
