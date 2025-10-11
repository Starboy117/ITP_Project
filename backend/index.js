import 'dotenv/config'; // equivalent to require('dotenv').config()
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import reservationRoutes from './routes/reservationRoute.js';
import courtRoutes from './routes/courtRoute.js';
import statsRoutes from './routes/statRoute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running', time: new Date().toISOString() });
});

// Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
