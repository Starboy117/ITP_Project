const express = require("express");
const router = express.Router();
const {addCourt,getAllCourts} = require("../controllers/courtController");

router.post("/addCourt",addCourt);
router.get("/getAllCourts",getAllCourts);

module.exports = router;