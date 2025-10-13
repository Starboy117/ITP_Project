import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingConfirmationPDF from "../BookingAvailableComponents/BookingConfirmationPDF";
import { useAuth } from "../context/AuthContext";

const BookingSuccess = () => {
  const { currentUser } = useAuth();
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
    userId: currentUser?._id || "U00000",
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

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-4">
      <div className="max-w-2xl w-full mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-8 relative space-y-6 border border-neutral-700">
        {/* Close Button */}
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-700 rounded-full text-white text-lg font-bold hover:bg-red-500 transition-all duration-300 hover:scale-110"
          title="Close"
        >
          ×
        </button>

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-green-500 text-center mb-2">
          Booking Confirmed!
        </h1>

        {/* Booking Details Card */}
        <div className="bg-neutral-750 rounded-xl p-6 space-y-3 border border-neutral-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Booking ID</p>
              <p className="font-semibold text-white">{bookingId}</p>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Name</p>
              <p className="font-semibold text-white">{name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Court</p>
              <p className="font-semibold text-white">{courtName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Date</p>
              <p className="font-semibold text-white">{bookingDate.toDateString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Time Slot</p>
              <p className="font-semibold text-white">{slot}</p>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">Amount</p>
              <p className="font-semibold text-green-400">LKR{courtPrice}</p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
          <p className="text-red-400 font-semibold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Complete payment before <strong className="text-white">{deadlineText}</strong> to avoid cancellation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <PDFDownloadLink
            document={<BookingConfirmationPDF booking={booking} />}
            fileName={`Booking_${bookingId}.pdf`}
            className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-lg hover:bg-[#007A8F] transition-all duration-300 hover:scale-105 text-center flex items-center justify-center gap-2"
          >
            {({ loading }) => (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loading ? "Generating PDF..." : "Download Confirmation"}
              </>
            )}
          </PDFDownloadLink>

          <button
            onClick={() => navigate("/pay", { state: booking })}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg text-white font-semibold shadow-lg hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 hover:scale-105 w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;