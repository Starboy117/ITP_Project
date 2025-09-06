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

// connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

