const Cart = require("../models/cart_model");

// Lấy tất cả Cart
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm sản phẩm vào Cart
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const cart = await Cart.create({ user_id, product_id, quantity });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm khỏi Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    await Cart.destroy({ where: { user_id, product_id } });
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
