import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PaymentReceiptPDF from "../BookingAvailableComponents/PaymentReceiptPDF"; 
import BookingConfirmationPDF from "../BookingAvailableComponents/BookingConfirmationPDF";
import Navbar from "../HomeComponents/Navbar";
import CopyrightFooter from "../BookingAvailableComponents/CopyrightFooter";
import { useEffect, useState } from "react";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // 1️⃣ Try getting booking from state
    let bookingData = location.state;

    // 2️⃣ If state is empty (page reload), get from localStorage
    if (!bookingData) {
      const savedBooking = localStorage.getItem("latestBooking");
      if (savedBooking) {
        bookingData = JSON.parse(savedBooking);
      }
    }

    // 3️⃣ If still no booking info, redirect to home
    if (!bookingData || !bookingData.bookingId) {
      navigate("/home", { replace: true });
      return;
    }

    // 4️⃣ Set booking state
    setBooking(bookingData);

    // 5️⃣ Save to localStorage so reload keeps it
    localStorage.setItem("latestBooking", JSON.stringify(bookingData));
  }, [location.state, navigate]);

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
