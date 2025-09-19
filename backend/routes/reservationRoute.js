const express = require("express");
const router = express.Router();
const { getAllReservations, checkReservations, addReservation } = require("../controllers/reservationController");

// router.get("/getReservation", getAllReservations);
router.post("/check", checkReservations);
router.post("/addBookings",addReservation );

module.exports = router;
