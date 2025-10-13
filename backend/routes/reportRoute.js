const express = require("express");
const router = express.Router();
const { generateReport, getFinancialSummary, getPeakHours } = require("../controllers/reportController");

router.get("/report", generateReport);


module.exports = router;
