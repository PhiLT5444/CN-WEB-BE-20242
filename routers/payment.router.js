const express = require("express");
const {
  getAllPayments,
  createPayment,
  updatePaymentStatus,
} = require("../controllers/payment.controller");
const router = express.Router();

router.get("/", getAllPayments);
router.post("/", createPayment);
router.put("/:id", updatePaymentStatus);

module.exports = router;
