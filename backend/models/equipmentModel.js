const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },  // for equipment images
  status: { 
    type: String, 
    enum: ["Available", "In Use", "Under Maintenance", "Damaged"], 
    default: "Available" 
  },
  purchaseDate: { type: Date, default: Date.now },
  lastMaintenance: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Equipment", equipmentSchema);