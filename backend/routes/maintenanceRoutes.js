// routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const MaintenanceRequest = require('../models/MaintenanceRequest');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new request
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, equipment, priority, contactInfo } = req.body;
    const imageURL = req.file ? `/uploads/${req.file.filename}` : '';
    const newRequest = new MaintenanceRequest({ title, description, equipment, priority, contactInfo, imageURL });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: 'Server error while creating request' });
  }
});

// Update status
router.put('/:id', async (req, res) => {
  try {
    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error updating request' });
  }
});

// Delete request
router.delete('/:id', async (req, res) => {
  try {
    await MaintenanceRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting request' });
  }
});

// Download CSV report
router.get('/download', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find();
    const csvContent = [
      ['ID', 'Title', 'Equipment', 'Priority', 'Status', 'Date'],
      ...requests.map(r => [r._id, r.title, r.equipment, r.priority, r.status, r.date.toISOString().split('T')[0]])
    ].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="maintenance_requests.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: 'Error generating CSV' });
  }
});

module.exports = router;
