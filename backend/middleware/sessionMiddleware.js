const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('../models/userModel');
const Staff = require('../models/staffModel');

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false
  }
});

// Populate req.user from session
const protect = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      // Check both User and Staff collections
      const user = await User.findById(req.session.userId) || await Staff.findById(req.session.userId);
      if (!user) return res.status(401).json({ message: 'Not authorized, please log in' });

      req.user = user; // attach user object for controllers
      next();
    } else {
      res.status(401).json({ message: 'Not authorized, please log in' });
    }
  } catch (err) {
    console.error('Protect middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin-only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { sessionMiddleware, protect, adminOnly };
