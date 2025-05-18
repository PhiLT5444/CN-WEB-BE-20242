const express = require('express');
const router = express.Router();
const cartController = require('../controllers/manage_cart/cart.controller');

// GET giỏ hàng
router.get("/:user_id", cartController.getCart);

// POST thêm sản phẩm vào giỏ
router.post("/add", cartController.addToCart);

// PUT cập nhật số lượng
router.put("/update", cartController.updateCartItem);

// DELETE sản phẩm khỏi giỏ
router.delete("/remove/:product_id", cartController.deleteCartItem);

// POST đặt hàng
router.post("/order", cartController.createOrder);

// GET lịch sử đơn hàng
router.get("/history/:user_id", cartController.getOrderHistory);

module.exports = router;