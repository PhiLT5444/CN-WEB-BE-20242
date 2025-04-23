'use strict';

/**
 * Controller xử lý các yêu cầu HTTP liên quan đến thanh toán
 * Làm cầu nối giữa client và PaymentService, xử lý request/response
 */
const PaymentService = require('../services/paymentService');

class PaymentController {
  /**
   * Xử lý yêu cầu thanh toán đơn hàng
   * 
   * @route POST /api/payments/process
   * @param {Object} req - Request object
   * @param {Object} req.body - Dữ liệu từ client
   * @param {string} req.body.order_id - ID của đơn hàng cần thanh toán
   * @param {string} req.body.user_id - ID của người dùng thực hiện thanh toán
   * @param {string} req.body.payment_method - Phương thức thanh toán (ví dụ: 'credit_card', 'paypal')
   * @param {Object} res - Response object
   * @returns {Object} Kết quả thanh toán với thông tin giao dịch và hóa đơn
   */
  async processPayment(req, res) {
    try {
      const { order_id, user_id, payment_method } = req.body;
      
      const result = await PaymentService.processPayment(order_id, user_id, payment_method);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Xử lý yêu cầu hủy thanh toán
   * 
   * @route POST /api/payments/cancel
   * @param {Object} req - Request object
   * @param {Object} req.body - Dữ liệu từ client
   * @param {string} req.body.order_id - ID của đơn hàng cần hủy thanh toán
   * @param {Object} res - Response object
   * @returns {Object} Kết quả hủy thanh toán
   */
  async cancelPayment(req, res) {
    try {
      const { order_id } = req.body;
      
      const result = await PaymentService.cancelPayment(order_id);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Xác nhận thanh toán đã hoàn tất
   * 
   * @route GET /api/payments/confirm
   * @param {Object} req - Request object
   * @param {Object} req.query - Tham số query
   * @param {string} req.query.order_id - ID của đơn hàng
   * @param {string} req.query.transaction_id - ID giao dịch cần xác nhận
   * @param {Object} res - Response object
   * @returns {Object} Kết quả xác nhận thanh toán
   */
  async confirmPayment(req, res) {
    try {
      const { order_id, transaction_id } = req.query;
      
      const result = await PaymentService.confirmPayment(order_id, transaction_id);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Lấy thông tin chi tiết của hóa đơn
   * 
   * @route GET /api/invoices/:invoice_id
   * @param {Object} req - Request object
   * @param {Object} req.params - Tham số đường dẫn
   * @param {string} req.params.invoice_id - ID của hóa đơn cần lấy
   * @param {Object} res - Response object
   * @returns {Object} Thông tin chi tiết của hóa đơn
   */
  async getInvoice(req, res) {
    try {
      const { invoice_id } = req.params;
      
      const invoice = await PaymentService.getInvoice(invoice_id);
      
      res.status(200).json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Lấy danh sách tất cả các giao dịch thanh toán
   * 
   * @route GET /api/payments
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Danh sách các giao dịch thanh toán
   */
  async getAllPayments(req, res) {
    try {
      const payments = await PaymentService.getAllPayments();
      
      res.status(200).json({ success: true, payments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Tạo một giao dịch thanh toán mới
   * 
   * @route POST /api/payments
   * @param {Object} req - Request object
   * @param {Object} req.body - Dữ liệu từ client
   * @param {string} req.body.order_id - ID của đơn hàng
   * @param {string} req.body.user_id - ID của người dùng
   * @param {number} req.body.amount - Số tiền thanh toán
   * @param {string} req.body.payment_method - Phương thức thanh toán
   * @param {Object} res - Response object
   * @returns {Object} Thông tin giao dịch mới được tạo
   */
  async createPayment(req, res) {
    try {
      const { order_id, user_id, amount, payment_method } = req.body;

      if (!order_id || !user_id || !amount || !payment_method) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const payment = await PaymentService.createPayment({ 
        order_id, 
        user_id, 
        amount, 
        payment_method 
      });
      
      res.status(201).json({ success: true, payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PaymentController();