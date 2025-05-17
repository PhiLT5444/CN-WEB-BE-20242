const cartService = require("../../services/CartService");

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await cartService.getListCarts(userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;
        const item = await cartService.addProductToCart(
            userId,
            product_id,
            quantity
        );
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;
        const item = await cartService.updateQuantity(
            userId,
            product_id,
            quantity
        );
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.params;
        const result = await cartService.deleteProductFromCart(
            userId,
            product_id
        );
        res.json({ success: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingMethod, paymentMethod } = req.body;
        const order = await cartService.order(
            userId,
            shippingMethod,
            paymentMethod
        );
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await cartService.getHistoryOrder(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
