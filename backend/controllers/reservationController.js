const { Reservation, findBookings } = require("../models/reservationModel");


async function generateBookingId() {
  const lastReservation = await Reservation.findOne().sort({ bookingId: -1 });
  if (!lastReservation) return "B00001";

  const lastNumber = parseInt(lastReservation.bookingId.substring(1), 10);
  const newNumber = lastNumber + 1;
  return "B" + String(newNumber).padStart(5, "0");
}

const addReservation = async (req, res) => {
  try {
    const { userId, name, phone, email, courtName, date, startTime, endTime, status } = req.body;

    const bookingId = await generateBookingId();

    if (!name || !phone || !email || !courtName || !date || !startTime || !endTime || !bookingId) {
      return res.status(400).json({ error: "Inputs cannot be null." });
    }

    

    const reservation = new Reservation({
      bookingId,
      userId: userId || "U000",
      name,
      phone,
      email,
      courtName,
      date,
      startTime,
      endTime,
      status: status || "Pending"
    });

    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);

  } catch (err) {
    console.error("Error adding reservation:", err);
    res.status(500).json({ error: err.message });
  }
};





// const getAllReservations = async (req, res) => {
//   try {
//     const reservations = await Reservation.find();
//     res.json(reservations);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



const checkReservations = async (req, res) => {
  let { courtName, date } = req.body;

  console.log("Received:", courtName, date);

  if (!courtName || !date) {
    return res.status(400).json({ message: "Missing date or court type" });
  }

  courtName = courtName.trim(); // ✅ trim spaces

  try {
    const bookings = await findBookings(courtName, date);
    res.json({ bookedSlots: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = { addReservation, checkReservations };

