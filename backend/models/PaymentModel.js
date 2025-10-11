const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: String,
      ref: "Booking", // assuming you have a Booking model
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String, // e.g. "card", "upi", "paypal"
    },
    transactionId: {
      type: String, // Stripe PaymentIntent ID or charge ID
    },
    receiptUrl: {
      type: String, // Stripe receipt link
    },
    description: {
      type: String, // e.g. "Court Booking", "Room Reservation"
    },
    metadata: {
      type: Object, // store extra details if needed
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

paymentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
