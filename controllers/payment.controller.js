const Payment = require("../models/payment_model");

// Lấy tất cả các giao dịch thanh toán
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo thanh toán mới
exports.createPayment = async (req, res) => {
  try {
    const { order_id, user_id, amount, payment_method, transaction_id } =
      req.body;
    const payment = await Payment.create({
      order_id,
      user_id,
      amount,
      payment_method,
      transaction_id,
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật trạng thái thanh toán
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    await Payment.update({ payment_status }, { where: { id } });
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
