import { useLocation } from "react-router-dom";

const BookingDetails = () => {
  const location = useLocation();
  const { slot, selectedDate, court } = location.state || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p>Court: {court}</p>
      <p>Date: {selectedDate?.toLocaleDateString()}</p>
      <p>Slot: {slot}</p>
    </div>
  );
};

export default BookingDetails;
