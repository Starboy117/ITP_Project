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

  // Force start and end in local time
  const start = new Date(inputDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(inputDate);
  end.setHours(23, 59, 59, 999);

  let reservations;

  if (courtName === "all") {
    reservations = await Reservation.find({
      date: { $gte: start, $lte: end }
    });
  } else {
    reservations = await Reservation.find({
      courtName: courtName,
      date: { $gte: start, $lte: end }
    });
  }

  return reservations.map(b => ({
    courtName: b.courtName,
    slot: `${b.startTime} - ${b.endTime}`
  }));
}


async function findTodayBookings(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  let reservations = await Reservation.find({
    date: { $gte: start, $lte: end }
  });

  return reservations;
}






module.exports = { Reservation, findBookings, findTodayBookings };
