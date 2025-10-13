const express = require("express");
const { registerStaff, loginStaff, getStaffs, deleteStaff, editStaff } = require("../controllers/staffAuthController");
const { protect, adminOnly } = require("../middleware/sessionMiddleware");

const router = express.Router();

// Register staff/admin (admin-only route)
router.post("/register", protect, adminOnly, registerStaff);

// Login staff/admin (public route)
router.post("/login", loginStaff);

// Get all staff (admin only)
router.get("/getStaffs", protect, adminOnly, getStaffs);

// Delete staff (admin only)
router.delete('/deleteStaff/:id', protect, adminOnly, deleteStaff);

// Edit staff (admin only)
router.put("/editStaff/:id", protect, adminOnly, editStaff);

module.exports = router;