const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/sessionMiddleware"); // ✅ Import protect if you want to reuse
const router = express.Router();

// Register & Login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ New route: Check if logged in
router.get("/check", (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      loggedIn: true,
      userId: req.session.userId,
    });
  } else {
    return res.json({ loggedIn: false });
  }
});

module.exports = router;
