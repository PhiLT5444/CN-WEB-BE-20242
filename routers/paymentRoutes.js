'use strict';

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route xử lý yêu cầu thanh toán
// POST /api/payments/process
// Body: { order_id, user_id, payment_method }
router.post('/process', paymentController.processPayment);

// Route xử lý hủy thanh toán
// POST /api/payments/cancel
// Body: { order_id }
router.post('/cancel', paymentController.cancelPayment);

// Route xác nhận thanh toán đã hoàn tất
// GET /api/payments/confirm?order_id=xxx&transaction_id=yyy
router.get('/confirm', paymentController.confirmPayment);

// Route lấy thông tin chi tiết hóa đơn
// GET /api/invoices/:invoice_id
router.get('/invoices/:invoice_id', paymentController.getInvoice);

// Route lấy danh sách tất cả các giao dịch thanh toán
// GET /api/payments
router.get('/', paymentController.getAllPayments);

// Route tạo một giao dịch thanh toán mới
// POST /api/payments
// Body: { order_id, user_id, amount, payment_method }
router.post('/', paymentController.createPayment);

// Route kiểm tra trạng thái thanh toán của đơn hàng
// GET /api/payments/status/:order_id
router.get('/status/:order_id', paymentController.checkPaymentStatus);

// Route xử lý yêu cầu hoàn tiền cho đơn hàng
// POST /api/payments/refund
// Body: { order_id, reason }
router.post('/refund', paymentController.refundPayment);

module.exports = router;
