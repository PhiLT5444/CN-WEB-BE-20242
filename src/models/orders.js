'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orders.belongsTo(models.Users, {foreignKey: 'user_id'});
    }
  }
  Orders.init({
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status:{
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'canceled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('pending','paid', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Orders',
    timestamps: true,
  });
  return Orders;
};