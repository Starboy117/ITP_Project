const User = require("../models/userModel");
const Staff = require("../models/staffModel");

// @desc Get all users (Admin only)
// @desc Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // exclude passwords
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

// // @desc Update user profile
// const updateUserProfile = async (req, res) => {
//   try {
//     let user;
//     if (req.user.type === 'staff') {
//       user = await Staff.findById(req.user._id);
//     } else {
//       user = await User.findById(req.user._id);
//     }
    
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;

//     const updatedUser = await user.save();
//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @desc Admin update user
// const adminUpdateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     let user = await User.findById(id);
//     let userType = 'user';

//     if (!user) {
//       user = await Staff.findById(id);
//       userType = 'staff';
//     }

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.name = updateData.name || user.name;
//     user.email = updateData.email || user.email;
//     user.phone = updateData.phone || user.phone;

//     if (userType === 'user') {
//       user.role = updateData.role || user.role;
//       user.isActive = updateData.isActive !== undefined ? updateData.isActive : user.isActive;
//       user.membershipType = updateData.membershipType || user.membershipType;
//     } else {
//       user.role = updateData.role || user.role;
//     }

//     const updatedUser = await user.save();
//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ success: false, message: "Error updating user: " + err.message });
//   }
// };

// @desc Delete a user
const deleteUsers = async (req, res) => {
  const { id } = req.params; // get user ID from URL

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
module.exports = { getUsers, editUsers, getUserProfile, deleteUsers };
