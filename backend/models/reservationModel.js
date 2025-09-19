const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  userId: { type: String, required: true, default: "U000" },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  courtName: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
});

// Model
const Reservation = mongoose.model("Reservation", reservationSchema);


async function findBookings(courtName, date) {
  const inputDate = new Date(date);
  const start = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 0, 0, 0);
  const end   = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59);

  let reservations;

  if (courtName === "all") {
    // All courts
    reservations = await Reservation.find({
      date: { $gte: start, $lte: end }
    });
  } else {
    // Specific court
    reservations = await Reservation.find({
      courtName: courtName,
      date: { $gte: start, $lte: end }
    });
  }

  // Return array of objects with courtName + slot
  return reservations.map(b => ({
    courtName: b.courtName,
    slot: `${b.startTime} - ${b.endTime}`
  }));
}

module.exports = { Reservation, findBookings };
