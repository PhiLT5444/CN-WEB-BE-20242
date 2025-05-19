var DataTypes = require("sequelize").DataTypes;
var _branches = require("./branches");
var _carts = require("./carts");
var _categories = require("./categories");
var _invoices = require("./invoices"); // Thêm import model invoices
var _orderdetails = require("./orderdetails");
var _orders = require("./orders");
var _payments = require("./payments");
var _products = require("./products");
var _shipping = require("./shipping");
var _users = require("./users");

function initModels(sequelize) {
    var branches = _branches(sequelize, DataTypes);
    var carts = _carts(sequelize, DataTypes);
    var categories = _categories(sequelize, DataTypes);
    var invoices = _invoices(sequelize, DataTypes); // Khởi tạo model invoices
    var orderdetails = _orderdetails(sequelize, DataTypes);
    var orders = _orders(sequelize, DataTypes);
    var payments = _payments(sequelize, DataTypes);
    var products = _products(sequelize, DataTypes);
    var shipping = _shipping(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);

    products.belongsToMany(users, {
        as: "user_id_users",
        through: carts,
        foreignKey: "product_id",
        otherKey: "user_id",
    });
    users.belongsToMany(products, {
        as: "product_id_products",
        through: carts,
        foreignKey: "user_id",
        otherKey: "product_id",
    });
    products.belongsTo(branches, { as: "branch", foreignKey: "branch_id" });
    branches.hasMany(products, { as: "products", foreignKey: "branch_id" });
    products.belongsTo(categories, {
        as: "category",
        foreignKey: "category_id",
    });
    categories.hasMany(products, { as: "products", foreignKey: "category_id" });
    orderdetails.belongsTo(orders, { as: "order", foreignKey: "order_id" });
    orders.hasMany(orderdetails, {
        as: "orderdetails",
        foreignKey: "order_id",
    });
    payments.belongsTo(orders, { as: "order", foreignKey: "order_id" });
    orders.hasMany(payments, { as: "payments", foreignKey: "order_id" });
    shipping.belongsTo(orders, { as: "order", foreignKey: "order_id" });
    orders.hasMany(shipping, { as: "shippings", foreignKey: "order_id" });
    carts.belongsTo(products, { as: "product", foreignKey: "product_id" });
    products.hasMany(carts, { as: "carts", foreignKey: "product_id" });
    orderdetails.belongsTo(products, {
        as: "product",
        foreignKey: "product_id",
    });
    products.hasMany(orderdetails, {
        as: "orderdetails",
        foreignKey: "product_id",
    });
    carts.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(carts, { as: "carts", foreignKey: "user_id" });
    orders.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(orders, { as: "orders", foreignKey: "user_id" });
    payments.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(payments, { as: "payments", foreignKey: "user_id" });

    // Thiết lập quan hệ cho invoices
    invoices.belongsTo(orders, { as: "order", foreignKey: "order_id" });
    orders.hasMany(invoices, { as: "invoices", foreignKey: "order_id" });
    invoices.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(invoices, { as: "invoices", foreignKey: "user_id" });

    orders.belongsTo(users, { as: "shipper", foreignKey: "shipper_id" });
    users.hasMany(orders, { as: "assigned_orders", foreignKey: "shipper_id" });

    return {
        branches,
        carts,
        categories,
        invoices, // Thêm invoices vào đối tượng trả về
        orderdetails,
        orders,
        payments,
        products,
        shipping,
        users,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
