const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// @desc Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
        membershipType: user.membershipType || 'basic',
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// @desc Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isActive === false) {
      return res.status(400).json({ success: false, message: "Account is deactivated" });
    }

    // Save user info in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
      membershipType: user.membershipType || 'basic',
      isAdmin: user.role === 'admin', // optional
      type: 'user'
    };

    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
