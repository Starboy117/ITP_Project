const Payment = require("../models/PaymentModel");

// ✅ Get all payments (always 200, return empty array if none)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    return res.status(200).json({ payments }); // empty array is OK
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get payment by ID
const getPaymentById = async (req, res) => {
  const paymentId = req.params.id;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json({ payment });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch payment", error: err.message });
  }
};

// ✅ Add new payment (only amount + status from frontend form)
const addPayment = async (req, res) => {
  const { amount, status } = req.body;

  try {
    const payment = new Payment({ amount, status });
    const savedPayment = await payment.save();
    return res.status(201).json({ payment: savedPayment });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", error: err.message });
    }
    return res.status(500).json({ message: "Unable to add payment", error: err.message });
  }
};

// ✅ Update payment by ID
const updatePayment = async (req, res) => {
  const paymentId = req.params.id;
  const { amount, status } = req.body;

  try {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { amount, status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ payment });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", error: err.message });
    }
    return res.status(500).json({ message: "Unable to update payment", error: err.message });
  }
};

// ✅ Delete payment by ID
const deletePayment = async (req, res) => {
  const paymentId = req.params.id;

  try {
    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete payment", error: err.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  addPayment,
  updatePayment,
  deletePayment,
};
