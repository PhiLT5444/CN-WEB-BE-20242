const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Khóa chính
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Khóa chính
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "carts",
    timestamps: false,
  }
);

// Thiết lập quan hệ với User & Product
const User = require("./User");
const Product = require("./Product");

Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = Cart;
