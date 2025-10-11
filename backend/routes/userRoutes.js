const express = require("express");
const { protect } = require("../middleware/sessionMiddleware");
const {
  getUsers,
  getUserProfile,
  editUsers,
  deleteUsers,
  updateUserProfile
} = require("../controllers/userController");

const router = express.Router();

// Admin-only routes (without middleware for now)
router.get("/getUsers", getUsers);
router.put("/editUsers/:id", editUsers);
router.delete("/deleteUser/:id", deleteUsers);

// User profile routes (users updating their own profile)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;