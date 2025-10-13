const express = require("express");
const router = express.Router();
const {addCourt,getAllCourts,updateCourt,deleteCourt,getActiveCourts,getCourtByName} = require("../controllers/courtController");

router.post("/addCourt",addCourt);
router.get("/getAllCourts",getAllCourts);
router.put("/updateCourt/:courtId",updateCourt);
router.delete("/deleteCourt/:id", deleteCourt);
router.get("/getActiveCourts",getActiveCourts);
router.get("/name/:courtName", getCourtByName);



module.exports = router;