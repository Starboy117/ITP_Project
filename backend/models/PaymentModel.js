const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // restrict allowed values
      default: "Pending",
    },
  },
  {
    timestamps: true,  // adds createdAt & updatedAt automatically
    versionKey: false, // removes __v field
  }
);

// Optional: expose `id` instead of just `_id` in JSON responses
paymentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
