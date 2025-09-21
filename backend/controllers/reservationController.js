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

const updateReservationId = async (req,res) => {

  let {bookingId} = req.body;

  if(!bookingId){
    res.status(500).json({ message: err.message });

  }

  try{


  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: err.message });

  }
}




const updateReservation = async (req, res) => {
  try {
    const { bookingId } = req.params; // URL param
    const updateData = req.body; // new data

    if (!bookingId) {
      return res.status(400).json({ error: "Reservation ID is required." });
    }

    // Find the reservation to update
    const reservation = await Reservation.findById(bookingId);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    // Check if the new slot is already booked
    const reservations = await Reservation.find({
      _id: { $ne: bookingId }, // exclude current reservation
      date: updateData.date,
      courtName: updateData.courtName,
      startTime: updateData.startTime,
    });

    if (reservations.length > 0) {
      return res.status(400).json({ error: "This court is already booked at that time." });
    }


    reservation.name = updateData.name || reservation.name;
    reservation.email = updateData.email || reservation.email;
    reservation.phone = updateData.phone || reservation.phone;
    reservation.courtName = updateData.courtName || reservation.courtName;
    reservation.date = updateData.date || reservation.date;
    reservation.startTime = updateData.startTime || reservation.startTime;
    reservation.endTime = updateData.endTime || reservation.endTime;
    reservation.status = updateData.status || reservation.status;

    const updatedReservation = await reservation.save();

    res.status(200).json({ reservation: updatedReservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: error.message });
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






module.exports = { addReservation, checkReservations, getTodayReservations,getAllReservations, updateReservation, deleteReservation  };

