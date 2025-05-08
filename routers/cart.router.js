const express = require('express');
const router = express.Router();
const cartController = require('../controllers/manage_cart/cart.controller');

// Lấy danh sách giỏ hàng
router.get('/', cartController.getListCarts);

// Thêm sản phẩm vào giỏ hàng
router.post('/', cartController.addProductToCart);

// Cập nhật số lượng sản phẩm
router.put('/:product_id', cartController.updateQuantity);

// Gán shipper cho đơn hàng
router.delete('/:product_id', cartController.deleteProductFromCart);

// Đặt hàng
router.post('/orders', cartController.order);

// Xem lịch sử đặt hàng
router.put('/orders/history', cartController.getHistoryOrder);

module.exports = router;