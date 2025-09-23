require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.use("/api/reservations", require("./routes/reservationRoute"));
app.use("/api/courts", require("./routes/courtRoute"));
app.use("/api/stats", require("./routes/statRoute"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/shop", require("./routes/shopRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/equipments", require("./routes/equipmentRoutes"));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running',
    message: 'Shop & Court Management API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// ===== DATABASE CONNECTION =====
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopmanagement', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
