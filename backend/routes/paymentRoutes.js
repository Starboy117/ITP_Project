const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Get all
router.get("/", paymentController.getAllPayments);

// Get by ID
router.get("/:id", paymentController.getPaymentById);

// Add new
router.post("/addPayment", paymentController.addPayment);

// Update
router.put("/:id", paymentController.updatePayment);

// Delete
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
