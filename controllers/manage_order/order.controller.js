const Order = require("../../models/order.model");
const OrderDetail = require("../../models/order_detail.model");

Order.hasMany(OrderDetail, {
    foreignKey: "order_id",
    as: "order_details",
});
OrderDetail.belongsTo(Order, {
    foreignKey: "order_id",
    as: "order",
});

exports.getListOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: 3 },
            include: [
                {
                    model: OrderDetail,
                    as: "order_details",
                },
            ],
            order: [["created_at", "DESC"]],
        });

        res.status(200).json(orders);
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

        const order = await Order.findOne({
            where: { id: order_id },
            include: [
                {
                    model: OrderDetail,
                    as: "order_details",
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
        const order = await Order.findByPk(orderId);
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
        const orders = await Order.findAll({ where: { status: "processing" } });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.assignShipper = async (req, res) => {
    const { orderId } = req.params;
    const { shipper_id } = req.body;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

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
        const orders = await Order.findAll({
            where: { shipper_id, status: "processing" },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

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
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = "failed";
        await order.save();

        res.json({ message: "Order marked as failed", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
