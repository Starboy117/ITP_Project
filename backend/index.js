import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { sessionMiddleware } from './middleware/sessionMiddleware.js';
import { cancelPendingBookings } from './controllers/reservationController.js'; // adjust path


// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reservationRoutes from './routes/reservationRoute.js';
import courtRoutes from './routes/courtRoute.js';
import staffRoutes from './routes/staffRoutes.js';
import statsRoutes from './routes/statRoute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import emailRouter from "./routes/emailRoute.js";
import smsRouter from "./routes/smsRoute.js"

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running',
    message: 'API is running!',
    timestamp: new Date().toISOString()
  });
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);


// ===== ERROR HANDLING =====
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

// ===== DATABASE CONNECTION & SERVER START =====
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopmanagement', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

      cancelPendingBookings();
    });

  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// ===== GRACEFUL SHUTDOWN =====
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
