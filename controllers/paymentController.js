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
   * @param {string} req.body.payment_method - Phương thức thanh toán (ví dụ: 'credit_card', 'paypal', 'momo', 'vnpay')
   * @param {Object} res - Response object
   * @returns {Object} Kết quả thanh toán với thông tin giao dịch và hóa đơn
   */
  async processPayment(req, res) {
    try {
      const { order_id, user_id, payment_method, transaction_id } = req.body;
      
      // Kiểm tra dữ liệu đầu vào
      if (!order_id || !user_id || !payment_method ) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields for payment processing' 
        });
      }
      
      const result = await PaymentService.processPayment(order_id, user_id, payment_method);
      
      res.status(200).json(result);
    } catch (error) {
      console.error(`Payment controller error: ${error.message}`);
      // Phân biệt lỗi client và lỗi server để trả về status code phù hợp
      if (error.message.includes('not found') || 
          error.message.includes('not in a payable state') ||
          error.message.includes('Missing required fields')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    
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
      
      if (!order_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Order ID is required' 
        });
      }
      
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
      
      if (!order_id || !transaction_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Order ID and transaction ID are required' 
        });
      }
      
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
      
      if (!invoice_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invoice ID is required' 
        });
      }
      
      const invoice = await PaymentService.getInvoice(invoice_id);
      
      res.status(200).json({ success: true, invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Lấy danh sách tất cả các giao dịch thanh toán của users
   * 
   * @route GET /api/payments
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Danh sách các giao dịch thanh toán
   */
  async getAllPayments(req, res) {
    try {
      const user_id = req.query.user_id;  // lấy user_id từ query string, vd: /api/payments?user_id=3

      // Kiểm tra user_id có tồn tại và là số hợp lệ
    if (!user_id || isNaN(user_id) || user_id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid or missing user_id parameter' });
    }
      const payments = await PaymentService.getAllPayments(parseInt(user_id));
      
      // Kiểm tra nếu không có giao dịch nào
    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: 'No payments found for this user' });
    }
    
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
      const { order_id, user_id, amount, payment_method, payment_status } = req.body;

      if (!order_id || !user_id || !amount || !payment_method) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: order_id, user_id, amount, and payment_method are required' 
        });
      }

      const payment = await PaymentService.createPayment({ 
        order_id, 
        user_id, 
        amount, 
        payment_method,
        payment_status
      });
      // fix lần 1
      res.status(201).json({ success: true, order_id, amount, payment_method /*,transaction_id: payment.transaction_id*/, 
            message: 'Payment created successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán của đơn hàng
   * 
   * @route GET /api/payments/status/:order_id
   * @param {Object} req - Request object
   * @param {Object} req.params - Tham số đường dẫn
   * @param {string} req.params.order_id - ID của đơn hàng cần kiểm tra
   * @param {Object} res - Response object
   * @returns {Object} Thông tin trạng thái thanh toán
   */
  async checkPaymentStatus(req, res) {
    try {
      const { order_id } = req.params;
      
      if (!order_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Order ID is required' 
        });
      }
      
      const statusInfo = await PaymentService.checkPaymentStatus(order_id);
      
      res.status(200).json({ success: true, ...statusInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Xử lý yêu cầu hoàn tiền cho đơn hàng
   * 
   * @route POST /api/payments/refund
   * @param {Object} req - Request object
   * @param {Object} req.body - Dữ liệu từ client
   * @param {string} req.body.order_id - ID của đơn hàng cần hoàn tiền
   * @param {string} req.body.reason - Lý do hoàn tiền
   * @param {Object} res - Response object
   * @returns {Object} Kết quả hoàn tiền
   */
  async refundPayment(req, res) {
    try {
      const { order_id, reason } = req.body;
      
      if (!order_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Order ID is required' 
        });
      }
      
      const result = await PaymentService.refundPayment(order_id, reason || 'Customer requested refund');
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PaymentController();