import express from "express";
import {
  getAllPayments,
  getPaymentById,
  addPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/addPayment", addPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
