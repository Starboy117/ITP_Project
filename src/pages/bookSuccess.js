import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingConfirmationPDF from "../BookingAvailableComponents/BookingConfirmationPDF";
import { useAuth } from "../context/AuthContext"; // ✅ import AuthContext

const BookingSuccess = () => {
  const { currentUser } = useAuth(); // ✅ get logged-in user
  const location = useLocation();
  const navigate = useNavigate();

  const {
    bookingId,
    courtName,
    courtType,
    courtPrice,
    date,
    slot,
    name,
    phone,
    email,
    status,
  } = location.state || {};

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const bookingDate = new Date(date);
  const paymentDeadline = new Date(bookingDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 1);
  const deadlineText = paymentDeadline.toLocaleDateString();

  const booking = {
    bookingId,
    userId: currentUser?._id || "U00000", // ✅ include logged-in userId
    courtName,
    courtType,
    date,
    slot,
    name,
    phone,
    email,
    status,
    courtPrice,
  };

  // Auto redirect to payment page if booking is today or yesterday
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = bookingDate.toDateString() === today.toDateString();
    const isYesterday = bookingDate.toDateString() === yesterday.toDateString();

    if ((isToday || isYesterday) && currentUser) {
      navigate("/pay", { state: booking });
    }
  }, [bookingDate, navigate, currentUser]);

  // Prevent back navigation to this page
  useEffect(() => {
    const handlePopState = () => navigate("/home", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  if (!currentUser) return null; // ✅ block render if not logged in

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="max-w-2xl w-full mx-auto bg-neutral-800 rounded-2xl shadow-lg p-6 relative space-y-4">
        {/* Close Button */}
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500 transition"
          title="Close"
        >
          ×
        </button>

        <h1 className="text-4xl font-bold text-green-700 text-center">
          Confirm Booking!
        </h1>

        <div className="space-y-1">
          <p>Booking ID: {bookingId}</p>
          <p>Name: {name}</p>
          <p>Court: {courtName}</p>
          <p>Date: {bookingDate.toDateString()}</p>
          <p>Time Slot: {slot}</p>
        </div>

        <p className="mt-4 text-red-500 font-semibold text-center">
          ⚠ Please complete the payment before <strong>{deadlineText}</strong> to avoid cancellation.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <PDFDownloadLink
            document={<BookingConfirmationPDF booking={booking} />}
            fileName={`Booking_${bookingId}.pdf`}
            className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition text-center"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>

          <button
            onClick={() =>
              navigate("/pay", { state: booking }) // ✅ send userId to payment page
            }
            className="px-6 py-3 bg-yellow-600 rounded-lg text-white font-semibold shadow-md hover:bg-yellow-700 transition w-full"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
