import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jsPDF } from "jspdf";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, court, date, slot, name, phone, email, status } = location.state || {};

  const bookingDate = new Date(date);
  const paymentDeadline = new Date(bookingDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 1);
  const deadlineText = paymentDeadline.toLocaleDateString();

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Redirect to booking-available if user presses back
      navigate("/home", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(0, 151, 178);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Confirmation", 105, 23, { align: "center" });

    let y = 50;
    const fields = [
      { label: "Booking ID", value: bookingId },
      { label: "Name", value: name },
      { label: "Phone", value: phone },
      { label: "Email", value: email },
      { label: "Court", value: court },
      { label: "Date", value: bookingDate.toLocaleDateString() },
      { label: "Time Slot", value: slot },
      { label: "Payment Status", value: status },
    ];

    fields.forEach(field => {
      doc.setDrawColor(0, 151, 178);
      doc.setFillColor(230, 245, 250);
      doc.roundedRect(15, y - 6, 180, 10, 2, 2, "F");

      doc.setTextColor(0, 102, 128);
      doc.setFont("helvetica", "bold");
      doc.text(`${field.label}:`, 20, y);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(`${field.value}`, 80, y);

      y += 15;
    });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text(
      `⚠ Please complete the payment before ${deadlineText} to avoid cancellation.`,
      20,
      y + 10
    );

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Thank you for booking with us!", 105, y + 30, { align: "center" });

    doc.save(`Booking_${bookingId}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-6 relative">
        {/* Cross inside container */}
        <button
          onClick={() => navigate("/booking-available", { replace: true })}
          className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500 transition"
          title="Close"
        >
          ×
        </button>

        <h1 className="text-4xl font-bold mb-4 text-green-700 text-center">Booking Confirmed!</h1>
        <p className="mb-2">Booking ID: {bookingId}</p>
        <p className="mb-2">Court: {court}</p>
        <p className="mb-2">Date: {bookingDate.toLocaleDateString()}</p>
        <p className="mb-2">Time Slot: {slot}</p>

        <p className="mt-4 mb-4 text-red-500 font-semibold text-center">
          ⚠ Please complete the payment before <strong>{deadlineText}</strong> to avoid cancellation.
        </p>

        <button
          onClick={downloadPDF}
          className="mt-2 px-6 py-3 bg-[#0097B2] rounded-lg text-white font-semibold shadow-md hover:bg-[#007A8F] transition w-full"
        >
          Download PDF
        </button>

        <button
          onClick={() => navigate("/booking-available", { replace: true })}
          className="mt-2 px-6 py-3 bg-yellow-600 rounded-lg text-white font-semibold shadow-md hover:bg-yellow-700 transition w-full"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
