const { Reservation, findBookings, findTodayBookings } = require("../models/reservationModel");


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


    if (!name) return res.status(400).json({ error: "Name is required." });
    if (!phone) return res.status(400).json({ error: "Phone number is required." });
    if (!email) return res.status(400).json({ error: "Email is required." });
    if (!courtName) return res.status(400).json({ error: "Court name is required." });
    if (!date) return res.status(400).json({ error: "Date is required." });
    if (!startTime) return res.status(400).json({ error: "Start time is required." });
    if (!endTime) return res.status(400).json({ error: "End time is required." });

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

   

    const bookingId = await generateBookingId();
    if (!bookingId) return res.status(500).json({ error: "Failed to generate booking ID." });


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






const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json({
      reservations,
      count: reservations.length  
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



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

const getTodayReservations = async (req, res) => {
  try {
    const today = new Date();
    const bookings = await findTodayBookings(today);

    res.json({
      bookings,
      count: bookings.length  
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




const updateReservation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, email, phone, courtName, date, startTime, endTime, status } = req.body;

   
    if (!bookingId) {
      return res.status(400).json({ error: "Reservation ID is required." });
    }


    if (!name) return res.status(400).json({ error: "Name is required." });
    if (!email) return res.status(400).json({ error: "Email is required." });
    if (!phone) return res.status(400).json({ error: "Phone number is required." });
    if (!courtName) return res.status(400).json({ error: "Court name is required." });
    if (!date) return res.status(400).json({ error: "Date is required." });
    if (!startTime) return res.status(400).json({ error: "Start time is required." });
    if (!endTime) return res.status(400).json({ error: "End time is required." });

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone number must be 7–15 digits." });
    }

   
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return res.status(400).json({ error: "Date must be today or in the future." });
    }


    const reservation = await Reservation.findById(bookingId);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    const existing = await Reservation.findOne({
      _id: { $ne: bookingId },
      date,
      courtName,
      startTime,
    });

    if (existing) {
      return res.status(400).json({ error: "This court is already booked at that time." });
    }

   
    
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







// Delete reservation by ID
const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Reservation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

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
      { bookingId },          // find by custom bookingId
      { status: "Confirmed" },// update status
      { new: true }           // return updated document
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation confirmed successfully",
      reservation,
    });
  } catch (err) {
    console.error("Error confirming reservation:", err);
    res.status(500).json({ message: "Server error" });
  }
};








module.exports = { addReservation, checkReservations, getTodayReservations,getAllReservations, updateReservation, deleteReservation, confirmReservation  };

