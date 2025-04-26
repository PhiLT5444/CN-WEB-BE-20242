'use strict';

// const db = require('../models');
// const { users, orders, invoices, payments } = db;

const sequelize = require('../config/database');
const initModels = require('../models_gen/init-models');
const models = initModels(sequelize);
const { orders, users, payments } = models;

/**
 * Service xử lý các chức năng liên quan đến thanh toán
 */
class PaymentService {
 
  /**
   * Giả lập thanh toán qua bên thứ ba
   * @param {string} order_id - ID của đơn hàng
   * @param {number} amount - Số tiền thanh toán
   * @param {string} payment_method - Phương thức thanh toán
   * @returns {Object} Kết quả thanh toán giả lập (success/fail)
   */
  async mockThirdPartyPayment(order_id, amount, payment_method) {
    const mockResponse = {
      success: Math.random() > 0.2,
      transaction_id: `TRANS_${Date.now()}`,
      message: Math.random() > 0.2 ? 'Payment successful' : 'Payment failed due to insufficient funds',
    };
    return mockResponse;
  }

  /**
   * Xử lý thanh toán cho đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @param {string} user_id - ID của người dùng
   * @param {string} payment_method - Phương thức thanh toán
   * @returns {Object} Kết quả xử lý thanh toán
   */
  async processPayment(order_id, user_id, payment_method) {
    try {
      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'pending') {
        throw new Error('Order is not in a payable state');
      }

      const paymentResult = await this.mockThirdPartyPayment(order_id, order.total_amount, payment_method);

      if (paymentResult.success) {
        order.status = 'paid';
        order.payment_status = 'paid';
        await order.save();

        await this.createPayment({
          order_id,
          user_id,
          amount: order.total_amount,
          payment_method,
          transaction_id: paymentResult.transaction_id,
          status: 'completed',
        });

        const invoice = await this.createInvoice(order_id, user_id);
        
        return {
          success: true,
          message: 'Payment successful',
          transaction_id: paymentResult.transaction_id,
          invoice_id: invoice.id,
        };
      } else {
        order.payment_status = 'failed';
        await order.save();
        throw new Error(paymentResult.message);
      }
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * Hủy thanh toán cho đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @returns {Object} Kết quả hủy thanh toán
   */
  async cancelPayment(order_id) {
    try {
      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.payment_status === 'paid') {
        throw new Error('Cannot cancel a completed payment');
      }

      order.status = 'canceled';
      order.payment_status = 'failed';
      await order.save();

      return { success: true, message: 'Payment cancelled successfully' };
    } catch (error) {
      throw new Error(`Payment cancellation failed: ${error.message}`);
    }
  }

  /**
   * Xác nhận thanh toán đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @param {string} transaction_id - ID giao dịch cần xác nhận
   * @returns {Object} Kết quả xác nhận thanh toán
   */
  async confirmPayment(order_id, transaction_id) {
    try {
      const payment = await payments.findOne({
        where: {
          order_id,
          transaction_id
        }
      });

      if (!payment) {
        throw new Error('Payment record not found');
      }

      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (payment.status === 'completed') {
        return { success: true, message: 'Payment confirmed', order };
      } else {
        throw new Error('Payment confirmation failed: Invalid transaction');
      }
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  /**
   * Tạo hóa đơn cho đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @param {string} user_id - ID của người dùng
   * @returns {Object} Hóa đơn mới được tạo
   */
  async createInvoice(order_id, user_id) {
    try {
      const order = await orders.findByPk(order_id, {
        include: ['orderitems']
      });
      
      if (!order) {
        throw new Error('Order not found');
      }

      const invoice = await invoices.create({
        order_id: order.id,
        user_id: user_id,
        items: JSON.stringify(order.orderitems),
        total_amount: order.total_amount,
      });

      return invoice;
    } catch (error) {
      throw new Error(`Invoice creation failed: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin chi tiết của hóa đơn
   * @param {string} invoice_id - ID của hóa đơn
   * @returns {Object} Thông tin chi tiết hóa đơn
   */
  async getInvoice(invoice_id) {
    try {
      const invoice = await invoices.findByPk(invoice_id, {
        include: [
          { model: orders, as: 'orders' },
          { model: users, as: 'users' }
        ]
      });
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return invoice;
    } catch (error) {
      throw new Error(`Failed to retrieve invoice: ${error.message}`);
    }
  }

  /**
   * Lấy danh sách tất cả các giao dịch thanh toán
   * @returns {Array} Danh sách các giao dịch
   */
  async getAllPayments() {
    try {
      const allPayments = await payments.findAll({
        include: [
          { model: orders, as: 'orders' },
          { model: users, as: 'users' }
        ],
        where: {
          is_deleted: false
        }
      });
      return allPayments;
    } catch (error) {
      throw new Error(`Failed to retrieve payments: ${error.message}`);
    }
  }

  /**
   * Tạo giao dịch thanh toán mới
   * @param {Object} paymentData - Dữ liệu giao dịch
   * @param {string} paymentData.order_id - ID đơn hàng
   * @param {string} paymentData.user_id - ID người dùng
   * @param {number} paymentData.amount - Số tiền thanh toán
   * @param {string} paymentData.payment_method - Phương thức thanh toán
   * @param {string} paymentData.transaction_id - ID giao dịch (tùy chọn)
   * @param {string} paymentData.status - Trạng thái giao dịch (tùy chọn)
   * @returns {Object} Giao dịch mới được tạo
   */
  async createPayment({ order_id, user_id, amount, payment_method, transaction_id, status }) {
    try {
      const payment = await payments.create({
        order_id,
        user_id,
        transaction_id: transaction_id || `TRANS_${Date.now()}`,
        amount,
        payment_method,
        status: status || 'pending',
      });
      
      return payment;
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();