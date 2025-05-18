const express = require('express');
const router = express.Router();
const orderController = require('../controllers/manage_order/order.controller');

// Lấy danh sách tất cả đơn hàng
router.get('/getAll', orderController.getAllListOrders)
router.get('/:user_id', orderController.getListOrders);

// Lấy chi tiết đơn hàng theo ID
router.get('/:order_id', orderController.getOrderById);

// Lấy danh sách đơn hàng chờ giao (pending delivery)
router.get('/status/pending-delivery', orderController.getPendingDeliveryOrders);

// Gán shipper cho đơn hàng
router.put('/:order_id/assign-shipper', orderController.assignShipper);

//Tạo đơn hàng
router.post('/create', orderController.createOrder)

// Hủy đơn hàng
router.put('/:order_id/cancel', orderController.cancelOrder);

// Cập nhật trạng thái đơn hàng
router.put('/:order_id/status', orderController.updateOrderStatus);

// Đánh dấu đơn hàng là thất bại
router.put('/:order_id/fail', orderController.markOrderAsFailed);

// Lấy danh sách đơn hàng của shipper (truyền shipper_id qua query)
router.get('/shipper/orders', orderController.getOrdersByShipper);

module.exports = router;