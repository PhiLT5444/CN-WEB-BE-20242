
const sequelize = require('../../config/database');
const initModels = require('../../models_gen/init-models');
const models = initModels(sequelize);
const { orders, orderdetails } = models;

exports.getListOrders = async (req, res) => {
    try {
        const order_list = await orders.findAll({
            where: { user_id: 3 },
            include: [
                {
                    model: orderdetails,
                    as: "orderdetails",
                },
            ],
            order: [["created_at", "DESC"]],
        });

        res.status(200).json(order_list);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Đã có lỗi xảy ra khi lấy danh sách đơn hàng.",
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order_id = req.params.order_id;

        const order = await orders.findOne({
            where: { id: order_id },
            include: [
                {
                    model: orderdetails,
                    as: "orderdetails",
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orders.findByPk(orderId);
        if (!order)
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        order.status = "canceled";
        await order.save();

        res.json({ message: "Hủy đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingDeliveryOrders = async (req, res) => {
    try {
        const orders_process = await orders.findAll({ where: { status: "processing" } });
        res.json(orders_process);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.assignShipper = async (req, res) => {
    const { orderId } = req.params;
    const { shipper_id } = req.body;
    try {
        const order = await orders.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        order.shipper_id = shipper_id;
        order.status = "processing"; // Giao hàng
        await order.save();

        res.json({ message: "Shipper assigned", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrdersByShipper = async (req, res) => {
    const { shipper_id } = req.query;
    try {
        const orders_by_shipper = await orders.findAll({
            where: { shipper_id, status: "processing" },
        });
        res.json(orders_by_shipper);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await orders.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markOrderAsFailed = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orders.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        order.status = "failed";
        await order.save();

        res.json({ message: "Order marked as failed", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    const { user_id, shipping_address, payment_method, cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    try {
        const total_amount = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        // Tạo đơn hàng
        const newOrder = await orders.create({
            user_id,
            shipping_address,
            payment_status: "pending",
            status: "pending",
            total_amount,
        });

        // Tạo các chi tiết đơn hàng
        const orderDetailsData = cartItems.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            total_price: item.price * item.quantity,
        }));

        await orderdetails.bulkCreate(orderDetailsData);

        res.status(201).json({ message: "Tạo đơn hàng thành công", order_id: newOrder.id });
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn hàng" });
    }
};

