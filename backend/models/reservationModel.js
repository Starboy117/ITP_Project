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
module.exports = { Reservation };

// async function findBookings(courtId, date) {

//   const start = new Date(date);
//   start.setHours(0,0,0,0);

//   const end = new Date(date);
//   end.setHours(23,59,59,999);

//   const reservations = await Reservation.find({
//     courtId: courtId,
//     date: { $gte: start, $lte: end }
//   });

//   return reservations.map(b => `${b.startTime} - ${b.endTime}`);
// }

// module.exports = { Reservation, findBookings };
