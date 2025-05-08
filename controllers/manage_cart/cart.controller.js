const sequelize = require("../../config/database");
const initModels = require("../../models_gen/init-models");
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

exports.getListCarts = async () => {};
exports.addProductToCart = async () => {};
exports.updateQuantity = async () => {};
exports.deleteProductFromCart = async () => {};
exports.order = async () => {};
exports.getHistoryOrder = async () => {};
