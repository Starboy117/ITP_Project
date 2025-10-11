const express = require("express");
const { protect} = require("../middleware/sessionMiddleware");
const {
  getUsers,
  getUserProfile,
  editUsers,
  adminUpdateUser,
  deleteUsers
} = require("../controllers/userController");

const router = express.Router();

// Admin-only routes
router.get("/getUsers", getUsers);
router.put("/editUsers/:id", editUsers);
router.delete("/deleteUser/:id", deleteUsers);

// User routes (protected but not admin-only)
// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);

module.exports = router;
