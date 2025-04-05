// services/paymentService.js
const Order = require('../models/orderModel'); // Mô hình Order trong cơ sở dữ liệu
const Invoice = require('../models/invoiceModel'); // Mô hình Invoice (hóa đơn)

class PaymentService {
  // Giả lập cổng thanh toán bên thứ ba
  async mockThirdPartyPayment(orderId, amount, paymentMethod) {
    // Giả lập phản hồi từ cổng thanh toán (MoMo, ZaloPay, v.v.)
    // Trong thực tế, bạn sẽ gọi API của MoMo/ZaloPay ở đây
    const mockResponse = {
      success: Math.random() > 0.2, // 80% khả năng thanh toán thành công
      transactionId: `TRANS_${Date.now()}`,
      message: Math.random() > 0.2 ? 'Payment successful' : 'Payment failed due to insufficient funds',
    };

    return mockResponse;
  }

  // Thực hiện thanh toán (Use Case: Thực hiện thanh toán)
  async processPayment(orderId, userId, paymentMethod) {
    try {
      // Tìm đơn hàng trong cơ sở dữ liệu
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Kiểm tra trạng thái đơn hàng
      if (order.status !== 'pending') {
        throw new Error('Order is not in a payable state');
      }

      // Giả lập gọi cổng thanh toán bên thứ ba
      const paymentResult = await this.mockThirdPartyPayment(orderId, order.totalAmount, paymentMethod);

      if (paymentResult.success) {
        // Cập nhật trạng thái đơn hàng
        order.status = 'paid';
        order.paymentStatus = 'completed';
        order.transactionId = paymentResult.transactionId;
        await order.save();

        // Tạo hóa đơn điện tử (Use Case: Tạo hóa đơn điện tử)
        const invoice = await this.createInvoice(orderId, userId);

        return {
          success: true,
          message: 'Payment successful',
          transactionId: paymentResult.transactionId,
          invoiceId: invoice._id,
        };
      } else {
        // Thanh toán thất bại
        order.paymentStatus = 'failed';
        await order.save();
        throw new Error(paymentResult.message);
      }
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  // Hủy thanh toán (Use Case: Hủy thanh toán)
  async cancelPayment(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'paid') {
        throw new Error('Cannot cancel a completed payment');
      }

      order.status = 'cancelled';
      order.paymentStatus = 'cancelled';
      await order.save();

      return { success: true, message: 'Payment cancelled successfully' };
    } catch (error) {
      throw new Error(`Payment cancellation failed: ${error.message}`);
    }
  }

  // Xác nhận thanh toán (Use Case: Xác nhận thanh toán)
  async confirmPayment(orderId, transactionId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Giả lập xác nhận từ cổng thanh toán
      if (order.transactionId === transactionId && order.paymentStatus === 'completed') {
        return { success: true, message: 'Payment confirmed', order };
      } else {
        throw new Error('Payment confirmation failed: Invalid transaction');
      }
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  // Tạo hóa đơn điện tử (Use Case: Tạo hóa đơn điện tử)
  async createInvoice(orderId, userId) {
    try {
      const order = await Order.findById(orderId).populate('items');
      if (!order) {
        throw new Error('Order not found');
      }

      const invoice = new Invoice({
        orderId: order._id,
        userId: userId,
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt: new Date(),
      });

      await invoice.save();
      return invoice;
    } catch (error) {
      throw new Error(`Invoice creation failed: ${error.message}`);
    }
  }

  // Xem hóa đơn (Use Case: Xem hóa đơn)
  async getInvoice(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId).populate('orderId userId');
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      return invoice;
    } catch (error) {
      throw new Error(`Failed to retrieve invoice: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();