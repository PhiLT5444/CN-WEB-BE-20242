const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("credit_card", "paypal", "momo", "vnpay"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "successful", "failed"),
      defaultValue: "pending",
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

// Thiết lập quan hệ với Order & User
// const Order = require("./Order");
// const User = require("./User");

// Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });
// Payment.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Payment;
