const express = require("express");
const router = express.Router();
const {addCourt,getAllCourts,updateCourt,deleteCourt,getActiveCourts} = require("../controllers/courtController");

router.post("/addCourt",addCourt);
router.get("/getAllCourts",getAllCourts);
router.put("/updateCourt/:courtId",updateCourt);
router.delete("/deleteCourt/:id", deleteCourt);
router.get("/getActiveCourts",getActiveCourts);



module.exports = router;