'use strict';

// const db = require('../models_gen');
// const { users, orders, payments } = db;
const sequelize = require('../config/database');
const initModels = require('../models_gen/init-models');
const models = initModels(sequelize);
const {users, orders, payments} = models;
const {Op} = require('sequelize');
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
    if (!order || order.is_deleted) {
      throw new Error('Order not found or has been deleted');
    }
    if ( order.payment_status !== 'pending') {
      throw new Error('Order is not in a payable state');
    }

    const paymentResult = await this.mockThirdPartyPayment(order_id, order.total_amount, payment_method);

    const result = await sequelize.transaction(async (t) => {
      if (paymentResult.success) {
        await orders.update(
          { status: 'processing', payment_status: 'paid' },
          { where: { id: order_id }, transaction: t }
        );
        await payments.create(
          {
            order_id,
            user_id,
            amount: order.total_amount,
            payment_method,
            payment_status: 'paid',
            transaction_id: paymentResult.transaction_id,
            created_at: new Date(),
            updated_at: new Date()
          },
          { transaction: t }
        );
        const invoice = await this.createInvoice(order_id, user_id, t);
        return {
          success: true,
          message: 'Payment successful',
          transaction_id: paymentResult.transaction_id,
          invoice_id: invoice.id,
        };
      } else {
        await orders.update(
          { payment_status: 'failed' },
          { where: { id: order_id }, transaction: t }
        );
        await payments.create(
          {
            order_id,
            user_id,
            amount: order.total_amount,
            payment_method,
            payment_status: 'failed',
            transaction_id: paymentResult.transaction_id || `failed-${Date.now()}`,
            created_at: new Date(),
            updated_at: new Date()
          },
          { transaction: t }
        );
        throw new Error(paymentResult.message);
      }
    });

    return result;
  } catch (error) {
    console.error(`Payment processing error: ${error.message}`);
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
      // fix lần 1
      if (payment.payment_status === 'pending') {
            await payment.update({ payment_status: 'successful' });
            await orders.update(
                { payment_status: 'paid', status: 'paid' },
                { where: { id: order_id } }
            );
            return { success: true, message: 'Payment confirmed', order };
        } else {
            throw new Error('Payment cannot be confirmed: Invalid status');
        }
    } catch (error) {
        throw new Error(`Payment confirmation failed: ${error.message}`);
    }
}

 /**
 * Tạo hóa đơn cho đơn hàng
 * @param {string} order_id - ID của đơn hàng
 * @param {string} user_id - ID của người dùng
 * @param {Object} transaction - Transaction object từ Sequelize (optional)
 * @returns {Object} Hóa đơn mới được tạo
 */
async createInvoice(order_id, user_id, transaction = null) {
  try {
    const order = await orders.findByPk(order_id, {
      attributes: ['id', 'total_amount'],
      include: [{
        model: models.orderdetails,
        as: 'orderdetails',
        attributes: ['id', 'product_id', 'quantity', 'price', 'total_price'],
        where: { is_deleted: 0 },
        required: false
      }],
      transaction
    });

    if (!order || order.is_deleted) {
      throw new Error('Order not found or has been deleted');
    }

    const orderDetailsData = order.orderdetails.map(detail => ({
      id: detail.id,
      product_id: detail.product_id,
      quantity: detail.quantity,
      price: detail.price,
      total_price: detail.total_price || (detail.price * detail.quantity)
    }));

    const invoice = await models.invoices.create(
      {
        order_id: order.id,
        user_id,
        items: JSON.stringify(orderDetailsData),
        total_amount: order.total_amount,
        created_at: new Date(),
        updated_at: new Date()
      },
      { transaction }
    );

    return invoice;
  } catch (error) {
    console.error(`Invoice creation error: ${error.message}`);
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