'use strict';

const db = require('../models_gen');
const { users, orders, payments } = db;

// Vì invoices.js chưa được chuyển sang models_gen nên cần xác định
let invoices;
try {
  invoices = db.invoices; // Thử lấy từ models_gen nếu đã được thêm vào
} catch (error) {
  invoices = require('../models').invoices; // Nếu không có, sử dụng từ models cũ
}

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
        // Cập nhật trạng thái đơn hàng
        await orders.update({
          status: 'paid',
          payment_status: 'paid'
        }, {
          where: { id: order_id }
        });

        // Tạo giao dịch thanh toán
        await this.createPayment({
          order_id,
          user_id,
          amount: order.total_amount,
          payment_method,
          transaction_id: paymentResult.transaction_id,
          payment_status: 'successful',
        });

        const invoice = await this.createInvoice(order_id, user_id);
        
        return {
          success: true,
          message: 'Payment successful',
          transaction_id: paymentResult.transaction_id,
          invoice_id: invoice.id,
        };
      } else {
        // Cập nhật trạng thái đơn hàng khi thanh toán thất bại
        await orders.update({
          payment_status: 'failed'
        }, {
          where: { id: order_id }
        });
        
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

      // Cập nhật trạng thái đơn hàng khi hủy thanh toán
      await orders.update({
        status: 'canceled',
        payment_status: 'failed'
      }, {
        where: { id: order_id }
      });

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
          transaction_id,
          is_deleted: false
        }
      });

      if (!payment) {
        throw new Error('Payment record not found');
      }

      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (payment.payment_status === 'successful') {
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
        include: [{
          model: db.orderdetails,
          as: 'orderdetails'
        }]
      });
      
      if (!order) {
        throw new Error('Order not found');
      }

      const invoice = await invoices.create({
        order_id: order.id,
        user_id: user_id,
        items: JSON.stringify(order.orderdetails),
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
      const invoice = await invoices.findByPk(invoice_id);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Lấy thêm thông tin liên quan
      const order = await orders.findByPk(invoice.order_id);
      const user = await users.findByPk(invoice.user_id);

      // Kết hợp dữ liệu
      return {
        ...invoice.toJSON(),
        order,
        user
      };
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
        where: {
          is_deleted: false
        },
        include: [
          { 
            model: orders,
            as: 'order'
          },
          { 
            model: users,
            as: 'user'
          }
        ]
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
   * @param {string} paymentData.transaction_id - ID giao dịch
   * @param {string} paymentData.payment_status - Trạng thái giao dịch
   * @returns {Object} Giao dịch mới được tạo
   */
  async createPayment({ order_id, user_id, amount, payment_method, transaction_id, payment_status }) {
    try {
      const payment = await payments.create({
        order_id,
        user_id,
        amount,
        payment_method,
        transaction_id: transaction_id || `TRANS_${Date.now()}`,
        payment_status: payment_status || 'pending',
      });
      
      return payment;
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán của đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @returns {Object} Thông tin trạng thái thanh toán
   */
  async checkPaymentStatus(order_id) {
    try {
      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      const payment = await payments.findOne({
        where: {
          order_id,
          is_deleted: false
        },
        order: [['createdAt', 'DESC']]
      });

      return {
        order_status: order.status,
        payment_status: order.payment_status,
        payment_details: payment || null
      };
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  /**
   * Hoàn tiền cho đơn hàng
   * @param {string} order_id - ID của đơn hàng
   * @param {string} reason - Lý do hoàn tiền
   * @returns {Object} Kết quả hoàn tiền
   */
  async refundPayment(order_id, reason) {
    try {
      const order = await orders.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.payment_status !== 'paid') {
        throw new Error('Cannot refund an unpaid order');
      }

      const payment = await payments.findOne({
        where: {
          order_id,
          payment_status: 'successful',
          is_deleted: false
        }
      });

      if (!payment) {
        throw new Error('No successful payment found for this order');
      }

      // Giả lập hoàn tiền - trong thực tế sẽ gọi API của cổng thanh toán
      const refundResult = {
        success: true,
        refund_id: `REFUND_${Date.now()}`,
        message: 'Refund processed successfully'
      };

      if (refundResult.success) {
        // Cập nhật trạng thái đơn hàng
        await orders.update({
          status: 'canceled',
          payment_status: 'refunded'
        }, {
          where: { id: order_id }
        });

        // Tạo giao dịch hoàn tiền
        await payments.create({
          order_id,
          user_id: payment.user_id,
          amount: -payment.amount, // Số tiền âm để thể hiện hoàn tiền
          payment_method: payment.payment_method,
          transaction_id: refundResult.refund_id,
          payment_status: 'successful',
          refund_reason: reason
        });

        return {
          success: true,
          message: 'Refund processed successfully',
          refund_id: refundResult.refund_id
        };
      } else {
        throw new Error('Refund processing failed');
      }
    } catch (error) {
      throw new Error(`Refund failed: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();