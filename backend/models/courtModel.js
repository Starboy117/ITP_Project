const mongoose = require("mongoose");


const courtSchema = new mongoose.Schema({
  courtId: { type: String, required: true }, // Unique Court ID
  courtName: { type: String, required: true }, // e.g., Badminton Court 1
  courtType: { type: String, required: true }, // e.g., Badminton, Tennis
  hourlyRate: { type: Number, required: true }, // Price per hour
  status: { type: String, required: true, default: "Available" }, // Available / Maintenance
  capacity: { type: Number, required: true }, // Number of players allowed
  location: { type: String }, // Optional, e.g., Building A
  description: { type: String }, // Court details
  imageUrl: { type: String }, // Store image path or URL
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
courtSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Court", courtSchema);
