require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running', time: new Date().toISOString() });
});


const reservationRoutes = require("./routes/reservationRoute");
app.use("/api/reservations", reservationRoutes);

const courtRoutes = require("./routes/courtRoute");
app.use("/api/courts",courtRoutes);

const statsRoutes = require("./routes/statRoute");
app.use("/api/stats",statsRoutes);



mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));



