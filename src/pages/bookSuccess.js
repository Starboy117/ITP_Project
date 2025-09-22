import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingConfirmationPDF from "../BookingAvailableComponents/BookingConfirmationPDF";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, courtName, courtType, date, slot, name, phone, email, status } = location.state || {};

  const booking = { bookingId, courtName, courtType, date, slot, name, phone, email, status };

  const bookingDate = new Date(date);
  const paymentDeadline = new Date(bookingDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 1);
  const deadlineText = paymentDeadline.toLocaleDateString();

  useEffect(() => {
    const handlePopState = () => navigate("/home", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

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

        <h1 className="text-4xl font-bold text-green-700 text-center">Booking Confirmed!</h1>

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
            onClick={() => navigate("#", { replace: true })}
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
