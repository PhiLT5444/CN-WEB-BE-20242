// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/process', paymentController.processPayment);
router.post('/cancel', paymentController.cancelPayment);
router.get('/confirm', paymentController.confirmPayment);
router.get('/invoice/:invoiceId', paymentController.getInvoice);

module.exports = router;