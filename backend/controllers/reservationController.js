const { Reservation, findBookings, findTodayBookings } = require("../models/reservationModel");
const cron = require("node-cron"); 

// Generate a new booking ID
async function generateBookingId() {
  const lastReservation = await Reservation.findOne().sort({ bookingId: -1 });
  if (!lastReservation) return "B00001";

  const lastNumber = parseInt(lastReservation.bookingId.substring(1), 10);
  const newNumber = lastNumber + 1;
  return "B" + String(newNumber).padStart(5, "0");
}

// Add a new reservation
const addReservation = async (req, res) => {
  try {
    // ✅ Get userId from session instead of request body
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in." });

    const { name, phone, email, courtName, date, startTime, endTime, status } = req.body;

    // ✅ Validate inputs
    if (!name) return res.status(400).json({ error: "Name is required." });
    if (!phone) return res.status(400).json({ error: "Phone number is required." });
    if (!email) return res.status(400).json({ error: "Email is required." });
    if (!courtName) return res.status(400).json({ error: "Court name is required." });
    if (!date) return res.status(400).json({ error: "Date is required." });
    if (!startTime) return res.status(400).json({ error: "Start time is required." });
    if (!endTime) return res.status(400).json({ error: "End time is required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format." });

    // ✅ Generate booking ID
    const bookingId = await generateBookingId();
    if (!bookingId) return res.status(500).json({ error: "Failed to generate booking ID." });

    // ✅ Create reservation
    const reservation = new Reservation({
      bookingId,
      userId, // from session
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


// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json({ reservations, count: reservations.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check reservations for a court on a given date
const checkReservations = async (req, res) => {
  let { courtName, date } = req.body;
  if (!courtName || !date) return res.status(400).json({ message: "Missing date or court type" });

  courtName = courtName.trim();

  try {
    const bookings = await findBookings(courtName, date);
    res.json({ bookedSlots: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get today's reservations
const getTodayReservations = async (req, res) => {
  try {
    const today = new Date();
    const bookings = await findTodayBookings(today);
    res.json({ bookings, count: bookings.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, email, phone, courtName, date, startTime, endTime, status } = req.body;

    if (!bookingId) return res.status(400).json({ error: "Reservation ID is required." });
    if (!name || !email || !phone || !courtName || !date || !startTime || !endTime)
      return res.status(400).json({ error: "All fields are required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format." });

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ error: "Phone number must be 7–15 digits." });

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(bookingDate.getTime()) || bookingDate < today)
      return res.status(400).json({ error: "Date must be today or in the future." });

    const reservation = await Reservation.findById(bookingId);
    if (!reservation) return res.status(404).json({ error: "Reservation not found." });

    const existing = await Reservation.findOne({
      _id: { $ne: bookingId },
      date,
      courtName,
      startTime,
    });

    if (existing) return res.status(400).json({ error: "This court is already booked at that time." });

    // Update fields
    reservation.name = name;
    reservation.email = email;
    reservation.phone = phone;
    reservation.courtName = courtName;
    reservation.date = date;
    reservation.startTime = startTime;
    reservation.endTime = endTime;
    reservation.status = status || reservation.status;

    const updatedReservation = await reservation.save();

    res.status(200).json({
      message: "Reservation updated successfully.",
      reservation: updatedReservation,
    });

  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Confirm reservation by bookingId
const confirmReservation = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { bookingId },
      { status: "Confirmed" },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    res.status(200).json({
      message: "Reservation confirmed successfully",
      reservation,
    });
  } catch (err) {
    console.error("Error confirming reservation:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id; // from session middleware
    const bookings = await Reservation.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// make sure to import cron at the top
const cancelPendingBookings = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 1); // bookings for tomorrow

    try {
      const pendingBookings = await Reservation.find({
        status: "Pending", // match your status in addReservation
        date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) }
      });

      for (let booking of pendingBookings) {
        booking.status = "Cancelled";
        await booking.save();
        console.log(`Booking ${booking.bookingId} cancelled because payment not done one day before booking date.`);
      }

      console.log(`Checked and cancelled pending bookings for ${targetDate.toDateString()}.`);
    } catch (err) {
      console.error("Error cancelling bookings:", err);
    }
  });
};


// Cancel a booking by bookingId
const cancelBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params; // get bookingId from URL

    if (!bookingId) return res.status(400).json({ message: "Booking ID is required." });

    // Find the booking
    const booking = await Reservation.findOne({ bookingId });

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    // Cancel it
    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      message: `Booking ${bookingId} has been cancelled successfully.`,
      booking
    });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
  addReservation,
  checkReservations,
  getTodayReservations,
  getAllReservations,
  updateReservation,
  deleteReservation,
  confirmReservation,
  getUserBookings,
  cancelPendingBookings,
  cancelBookingById
};
