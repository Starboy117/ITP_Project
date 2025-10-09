const Staff = require("../models/staffModel")
const bcrypt = require("bcryptjs");

// Register staff or admin
exports.registerStaff = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Staff already exists" });
    }

    const staff = await Staff.create({ name, email, password, phone, role });

    res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      user: {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login staff or admin
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email }).select("+password");
    if (!staff) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await staff.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Save staff info in session
    req.session.user = {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone,
      isAdmin: staff.role === 'admin', // optional
      type: 'staff'
    };

    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find(); // exclude passwords if you store them
    res.json({
      staffs,
      count: staffs.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteStaff = async (req, res) => {
  const { id } = req.params; // get staff ID from URL

  try {
    const deleted = await Staff.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({
      message: 'Staff member deleted successfully',
      deletedStaff: deleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.editStaff = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive, phone, position } = req.body;

  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { name, email, role, isActive, phone, position },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      staff: updatedStaff
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
