
const express = require("express");
const router = express.Router();
const { getWeeklyBookings } = require("../controllers/statController");

router.get("/weekly-bookings", getWeeklyBookings);

module.exports = router;
