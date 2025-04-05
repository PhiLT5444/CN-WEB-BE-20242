// controllers/paymentController.js
const PaymentService = require('../services/paymentService');

class PaymentController {
  async processPayment(req, res) {
    try {
      const { orderId, userId, paymentMethod } = req.body;
      const result = await PaymentService.processPayment(orderId, userId, paymentMethod);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async cancelPayment(req, res) {
    try {
      const { orderId } = req.body;
      const result = await PaymentService.cancelPayment(orderId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async confirmPayment(req, res) {
    try {
      const { orderId, transactionId } = req.query;
      const result = await PaymentService.confirmPayment(orderId, transactionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const invoice = await PaymentService.getInvoice(invoiceId);
      res.status(200).json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PaymentController();