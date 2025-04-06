const express = require("express");
const {
  getAllPayments,
  createPayment,
  updatePaymentStatus,
} = require("../controllers/payment.controller");
const router = express.Router();
/**
 * @swagger
 * /api/payments:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Lấy danh sách thanh toán
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", getAllPayments);
/**
 * @swagger
 * /api/payments:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Tạo thanh toán mới
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 */
router.post("/", createPayment);
/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     tags:
 *       - Payment
 *     summary: Cập nhật trạng thái thanh toán
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của thanh toán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã cập nhật thành công
 */
router.put("/:id", updatePaymentStatus);

module.exports = router;
