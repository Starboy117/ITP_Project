const User = require("../models/userModel");
const Staff = require("../models/staffModel");

// @desc Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json({
      users,
      count: users.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Edit user profile admin
const editUsers = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive, phone, membershipType } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, isActive, phone, membershipType },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc Get user profile
const getUserProfile = async (req, res) => {
  try {
    let user;
    if (req.user.type === 'staff') {
      user = await Staff.findById(req.user._id).select("-password");
    } else {
      user = await User.findById(req.user._id).select("-password");
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update user profile (for users updating their own profile)
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user._id; // From session middleware

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email, 
        phone, 
        address 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc Delete a user
const deleteUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: deleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ Export all functions at once
module.exports = { 
  getUsers, 
  editUsers, 
  getUserProfile, 
  deleteUsers, 
  updateUserProfile 
};