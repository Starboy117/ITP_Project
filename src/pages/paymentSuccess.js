import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import PaymentReceiptPDF from "../BookingAvailableComponents/PaymentReceiptPDF"; 
import BookingConfirmationPDF from "../BookingAvailableComponents/BookingConfirmationPDF";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const [booking, setBooking] = useState(null);

  // ===== Load Booking Data =====
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    let bookingData = location.state;
    if (!bookingData) {
      const savedBooking = localStorage.getItem("latestBooking");
      if (savedBooking) bookingData = JSON.parse(savedBooking);
    }

    if (!bookingData || !bookingData.bookingId) {
      navigate("/home", { replace: true });
      return;
    }

    setBooking(bookingData);
    localStorage.setItem("latestBooking", JSON.stringify(bookingData));
  }, [currentUser, location.state, navigate]);

  // ===== Send Email & SMS Automatically =====
  useEffect(() => {
    if (booking && booking.email && booking.phone) {
      const sendNotifications = async () => {
        try {
          // --- Generate Booking PDF ---
          const bookingPdfBlob = await pdf(
            <BookingConfirmationPDF booking={{
              bookingId: booking.bookingId,
              phone: booking.phone,
              courtName: booking.courtName,
              courtType: booking.courtType,
              date: booking.date,
              slot: booking.slot,
              name: booking.name,
              email: booking.email,
              status: booking.status,
            }} />
          ).toBlob();

          const reader = new FileReader();
          reader.readAsDataURL(bookingPdfBlob);
          reader.onloadend = async () => {
            const base64Pdf = reader.result;

            // --- Send Email ---
            await axios.post("http://localhost:5000/api/email/send-booking", {
              email: booking.email,
              pdf: base64Pdf,
              bookingId: booking.bookingId
            });
            console.log("Booking confirmation email sent!");

            // --- Send SMS ---
            await axios.post("http://localhost:5000/api/sms/send-sms", {
              phone: booking.phone.startsWith("+") ? booking.phone : `+${booking.phone}`,
              message: `Hi ${booking.name}, your booking ${booking.bookingId} for ${booking.date} at ${booking.slot} is confirmed. Check your email for confirmation`
            });
            console.log("Booking confirmation SMS sent!");
          };
        } catch (err) {
          console.error("Failed to send notifications:", err);
        }
      };

      sendNotifications();
    }
  }, [booking]);

  if (!booking) return null;

  const {
    bookingId,
    courtName,
    courtType,
    date,
    slot,
    name,
    phone,
    email,
    courtPrice,
    status,
    paymentSuccess,
  } = booking;

  const bookingDetails = { bookingId, phone, courtName, courtType, date, slot, name, email, status };
  const paymentDetails = { bookingId, name, email, courtPrice, status, paymentSuccess, paymentDate: new Date().toISOString() };

  return (
    <div className=" min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar />
      <div className="mt-20 flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        {/* Success/Failure Icon */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            paymentSuccess ? "bg-green-900/30" : "bg-red-900/30"
          }`}>
            {paymentSuccess ? (
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        <h1 className={`text-4xl font-bold ${paymentSuccess ? "text-green-500" : "text-red-500"}`}>
          {paymentSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        {/* Booking Details Card */}
        <div className="bg-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-4 border border-neutral-700">
          <h2 className="text-xl font-semibold text-center text-neutral-300 mb-4">
            Booking Details
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Booking ID:</span>
              <span className="font-semibold">{bookingId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Name:</span>
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Phone:</span>
              <span className="font-semibold">{phone}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Court:</span>
              <span className="font-semibold">{courtName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Date:</span>
              <span className="font-semibold">{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Time Slot:</span>
              <span className="font-semibold">{slot}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-700">
              <span className="text-neutral-400">Status:</span>
              <span className={`font-semibold ${
                status === 'Confirmed' ? 'text-green-400' : 
                status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {status}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-400">Total Paid:</span>
              <span className="font-bold text-lg text-green-400">LKR {courtPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <PDFDownloadLink
            document={<PaymentReceiptPDF payment={paymentDetails} />}
            fileName={`Payment_${bookingId}.pdf`}
            className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-lg hover:bg-[#007A8F] transition-all duration-300 hover:scale-105 text-center flex items-center justify-center gap-2"
          >
            {({ loading }) => (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loading ? "Generating PDF..." : "Download Payment Receipt"}
              </>
            )}
          </PDFDownloadLink>

          <PDFDownloadLink
            document={<BookingConfirmationPDF booking={bookingDetails} />}
            fileName={`Booking_${bookingId}.pdf`}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-white font-semibold shadow-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 text-center flex items-center justify-center gap-2"
          >
            {({ loading }) => (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loading ? "Generating PDF..." : "Download Booking Confirmation"}
              </>
            )}
          </PDFDownloadLink>

          {/* Home Button */}
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="px-6 py-3 bg-neutral-700 rounded-lg text-white font-semibold shadow-lg hover:bg-neutral-600 transition-all duration-300 hover:scale-105 text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Success Message */}
        {paymentSuccess && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center max-w-md">
            <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Payment completed successfully! Confirmation sent to your email and phone.
            </p>
          </div>
        )}
      </div>
      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
};

export default PaymentSuccessPage;