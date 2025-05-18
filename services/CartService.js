const sequelize = require("../config/database");
const initModels = require("../models_gen/init-models");
const models = initModels(sequelize);
const {
    branches,
    carts,
    categories,
    orderdetails,
    orders,
    payments,
    products,
    shipping,
    users,
} = models;

exports.getListCarts = async (userId) => {
    return await carts.findAll({
        where: { user_id: userId },
        include: [{ model: products, as: "product" }],
    });
};

exports.getListAllCarts = async () => {
    return await carts.findAll({
        include: [{ model: products, as: "product" }],
    });
};

exports.addProductToCart = async (userId, productId, quantity) => {
    const [cartItem, created] = await carts.findOrCreate({
        where: { user_id: userId, product_id: productId },
        defaults: { quantity },
    });

    if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
    }

    return cartItem;
};
exports.updateQuantity = async (userId, productId, quantity) => {
    const cartItem = await carts.findOne({
        where: { user_id: userId, product_id: productId },
    });
    if (!cartItem) throw new Error("Sản phẩm không tồn tại trong giỏ");

    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
};
exports.deleteProductFromCart = async (userId, productId) => {
    const result = await carts.destroy({
        where: { user_id: userId, product_id: productId },
    });
    return result > 0;
};
exports.order = async (userId, shippingMethod, paymentMethod) => {
    const cartItems = await carts.findAll({ where: { user_id: userId } });
    if (!cartItems.length) throw new Error("Giỏ hàng trống");

    const totalAmount = await Promise.all(
        cartItems.map(async (item) => {
            const product = await products.findByPk(item.product_id);
            return parseFloat(product.price) * item.quantity;
        })
    ).then((prices) => prices.reduce((acc, curr) => acc + curr, 0));

    const newOrder = await orders.create({
        user_id: userId,
        status: "pending",
        total_amount: totalAmount,
    });

    for (const item of cartItems) {
        await orderdetails.create({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: (await products.findByPk(item.product_id)).price,
        });
    }

    await shipping.create({
        order_id: newOrder.id,
        method: shippingMethod,
        status: "pending",
    });

    await payments.create({
        order_id: newOrder.id,
        user_id: userId,
        amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: "pending",
        transaction_id: `TXN-${Date.now()}-${userId}`,
    });

    await carts.destroy({ where: { user_id: userId } });

    return newOrder;
};

exports.getHistoryOrder = async (userId) => {
    return await orders.findAll({
        where: { user_id: userId },
        include: [
            {
                model: orderdetails,
                as: "orderdetails",
                include: [{ model: products, as: "product" }],
            },
            { model: payments, as: "payments" },
            { model: shipping, as: "shippings" },
        ],
    });
};
