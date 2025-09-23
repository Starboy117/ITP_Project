const express = require("express");
const router = express.Router();

const inquiryController = require("../controllers/inquiryController");

// GET all inquiries
router.get("/", inquiryController.getAllInquiries);

// POST a new inquiry
router.post("/addInquiry", inquiryController.addInquiry);

// Get by ID
router.get("/:id", inquiryController.getInquiryById);

// PUT update inquiry by ID
router.put("/:id", inquiryController.updateInquiry);

// DELETE inquiry by ID
router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
