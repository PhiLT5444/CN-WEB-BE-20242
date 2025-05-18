const cartService = require("../../services/CartService");

exports.getCart = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const data = await cartService.getListCarts(user_id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }
        const item = await cartService.addProductToCart(
            user_id,
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
        const user_id = req.body.user_id;
        console.log(user_id);
        const { product_id, quantity } = req.body;
        const item = await cartService.updateQuantity(
            user_id,
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
        const { user_id } = req.body;
        const { product_id } = req.params;
        const result = await cartService.deleteProductFromCart(
            user_id,
            product_id
        );
        res.json({ success: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { user_id, shippingMethod, paymentMethod } = req.body;
        const order = await cartService.order(
            user_id,
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
        const user_id = req.user.id;
        const orders = await cartService.getHistoryOrder(user_id);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
