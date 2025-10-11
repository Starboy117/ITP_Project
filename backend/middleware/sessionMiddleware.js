const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('../models/userModel');
const Staff = require('../models/staffModel');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
});

// Populate req.user from session
const protect = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      // Check if it's a staff user
      if (req.session.user.type === 'staff') {
        const staff = await Staff.findById(req.session.user.id);
        if (!staff) return res.status(401).json({ message: 'Not authorized, please log in' });
        req.user = staff;
      } else {
        // Regular user
        const user = await User.findById(req.session.user.id);
        if (!user) return res.status(401).json({ message: 'Not authorized, please log in' });
        req.user = user;
      }
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
  if (req.user && (req.user.role === 'admin' || req.session.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

// Staff-only routes (admin or staff)
const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff' || req.session.user.role === 'admin' || req.session.user.role === 'staff')) {
    next();
  } else {
    res.status(403).json({ message: 'Staff access only' });
  }
};

module.exports = { sessionMiddleware, protect, adminOnly, staffOnly };