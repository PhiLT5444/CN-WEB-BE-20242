'use strict';

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 1.Route xử lý yêu cầu thanh toán
// POST /api/payments/process
// Body: { order_id, user_id, payment_method }
router.post('/process', paymentController.processPayment);

// 2.Route xử lý hủy thanh toán
// POST /api/payments/cancel
// Body: { order_id }
router.post('/cancel', paymentController.cancelPayment);

// 3.Route xác nhận thanh toán đã hoàn tất
// GET /api/payments/confirm?order_id=xxx&transaction_id=yyy
router.get('/confirm', paymentController.confirmPayment);

// 4.Route lấy thông tin chi tiết hóa đơn
// GET /api/invoices/:invoice_id
router.get('/invoices/:invoice_id', paymentController.getInvoice);

// 4.1 Lấy hóa đơn theo order_id
// GET /api/invoices?order_id=xxx
router.get('/invoices', paymentController.getInvoiceByOrderId);


// 5.Route lấy danh sách tất cả các giao dịch thanh toán của user từ trước tới nay
// GET /api/payments?user_id=xxx
router.get('/', paymentController.getAllPayments);

// 5.1. Route lấy danh sách các giao dịch thanh toán theo bộ lọc tùy chọn
// GET /api/payments/filter?user_id=...&order_id=...&payment_status=...
router.get('/filter', paymentController.getFilteredPayments);


//fix lần 1
// 6.Route tạo một giao dịch thanh toán mới
// POST /api/payments/create
// Body: { order_id, user_id, amount, payment_method }
router.post('/create', paymentController.createPayment);

// 7.Route kiểm tra trạng thái thanh toán của đơn hàng
// GET /api/payments/status/:order_id
router.get('/status/:order_id', paymentController.checkPaymentStatus);

// 8.Route xử lý yêu cầu hoàn tiền cho đơn hàng
// POST /api/payments/refund
// Body: { order_id, reason }
router.post('/refund', paymentController.refundPayment);

module.exports = router;
