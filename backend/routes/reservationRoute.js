const express = require("express");
const router = express.Router();
const { getAllReservations, checkReservations, addReservation, getTodayReservations, updateReservation, deleteReservation,confirmReservation } = require("../controllers/reservationController");

router.get("/getAllReservation", getAllReservations);
router.post("/check", checkReservations);
router.post("/addBookings",addReservation );
router.get("/todayReservations",getTodayReservations);
router.post("/updateReservation/:bookingId", updateReservation);
router.delete('/deleteReservation/:id', deleteReservation);
router.patch("/confirmBooking/:bookingId", confirmReservation);

module.exports = router;
