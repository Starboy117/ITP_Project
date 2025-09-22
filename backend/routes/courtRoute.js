const express = require("express");
const router = express.Router();
const {addCourt,getAllCourts,updateCourt,deleteCourt} = require("../controllers/courtController");

router.post("/addCourt",addCourt);
router.get("/getAllCourts",getAllCourts);
router.put("/updateCourt/:courtId",updateCourt);
router.delete("/deleteCourt/:id", deleteCourt);



module.exports = router;