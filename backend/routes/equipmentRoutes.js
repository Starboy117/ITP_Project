const express = require("express");
const router = express.Router();
const {
  getEquipments,
  addEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controllers/equipmentController");

// CRUD routes
router.get("/", getEquipments);
router.post("/", addEquipment);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

module.exports = router;
