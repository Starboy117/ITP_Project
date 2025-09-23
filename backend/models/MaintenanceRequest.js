// models/MaintenanceRequest.js
const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  equipment: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  date: { type: Date, default: Date.now },
  contactInfo: String,
  imageURL: String // store URL after uploading
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
