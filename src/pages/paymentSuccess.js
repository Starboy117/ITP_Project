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
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <h1 className={`text-4xl font-bold ${paymentSuccess ? "text-green-600" : "text-red-500"}`}>
          {paymentSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        <div className="bg-neutral-800 rounded-xl shadow-lg p-6 w-full max-w-md space-y-2">
          <p>Booking ID: {bookingId}</p>
          <p>Name: {name}</p>
          <p>Phone: {phone}</p>
          <p>Court: {courtName}</p>
          <p>Date: {new Date(date).toLocaleDateString()}</p>
          <p>Time Slot: {slot}</p>
          <p>Status: {status}</p>
          <p>Total Paid: LKR {courtPrice}</p>
        </div>

        <PDFDownloadLink
          document={<PaymentReceiptPDF payment={paymentDetails} />}
          fileName={`Payment_${bookingId}.pdf`}
          className="px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition text-center"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Payment PDF")}
        </PDFDownloadLink>

        <PDFDownloadLink
          document={<BookingConfirmationPDF booking={bookingDetails} />}
          fileName={`Booking_${bookingId}.pdf`}
          className="px-6 py-3 bg-yellow-500 rounded-lg text-white font-semibold shadow-md hover:bg-yellow-600 transition text-center"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Booking PDF")}
        </PDFDownloadLink>
      </div>
      <footer className="p-4 mt-12">
        <CopyrightFooter />
      </footer>
    </div>
  );
};

export default PaymentSuccessPage;
