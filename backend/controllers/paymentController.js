import Payment from "../models/PaymentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    return res.status(200).json({ payments }); // empty array is OK
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get payment by ID
export const getPaymentById = async (req, res) => {
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





export const addPayment = async (req, res) => {
  // ✅ Get userId from session
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not logged in." });
  }

  const { amount, currency } = req.body;

  console.log("AddPayment called with:", { amount, currency, userId });

  // ✅ Validate required fields
  if (!amount || !currency) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // ✅ Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    if (!paymentIntent?.client_secret) {
      console.error("PaymentIntent creation failed", paymentIntent);
      return res.status(500).json({ message: "Failed to create PaymentIntent" });
    }

    // ✅ Save payment record in MongoDB
    const payment = new Payment({
      userId,
      amount,
      currency,
      status: "Paid",
      transactionId: paymentIntent.id,
    });

    const savedPayment = await payment.save();

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      payment: savedPayment,
    });
  } catch (err) {
    console.error("Stripe / MongoDB error:", err);
    return res.status(500).json({ message: "Unable to add payment", error: err.message });
  }
};




// ✅ Update payment by ID
export const updatePayment = async (req, res) => {
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
export const deletePayment = async (req, res) => {
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
