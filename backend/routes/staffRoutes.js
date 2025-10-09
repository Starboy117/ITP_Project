const express = require("express");
const { registerStaff, loginStaff, getStaffs, deleteStaff, editStaff } = require("../controllers/staffAuthController");
const { protect, adminOnly } = require("../middleware/sessionMiddleware"); // ✅ import session middleware

const router = express.Router();

// Register staff/admin (admin-only route)
router.post("/register", registerStaff);

// Login staff/admin (public route)
router.post("/login", loginStaff);

router.get("/getStaffs", getStaffs);

router.delete('/deleteStaff/:id', deleteStaff);

router.put("/editStaff/:id", editStaff);

module.exports = router;
