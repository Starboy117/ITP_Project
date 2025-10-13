const express = require("express");
const router = express.Router();
const { 
  getAllReservations, 
  checkReservations, 
  addReservation, 
  getTodayReservations, 
  updateReservation, 
  deleteReservation,
  confirmReservation,
  getUserBookings, 
  cancelBookingById
} = require("../controllers/reservationController");

const { protect } = require("../middleware/sessionMiddleware");

// Public routes
router.get("/getAllReservation", getAllReservations);
router.post("/check", checkReservations);
router.get("/todayReservations", getTodayReservations);
router.post("/updateReservation/:bookingId", updateReservation);
router.delete('/deleteReservation/:id', deleteReservation);
router.patch("/confirmBooking/:bookingId", confirmReservation);
// Cancel a booking by ID (protected route)
router.patch("/cancel/:bookingId", cancelBookingById);


// ✅ Protected routes
router.post("/addBookings", protect, addReservation); // add protect middleware
router.get("/user", protect, getUserBookings);

module.exports = router;
