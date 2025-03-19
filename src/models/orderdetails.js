'use strict';
const {
  Model,
  DATE
} = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderDetails.belongsTo(models.Orders, {foreignKey: 'orderId'});
      OrderDetails.belongsTo(models.Products, {foreignKey: 'productId'});
    }
  }
  OrderDetails.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'OrderDetails',
    timestamps: true,
  });
  return OrderDetails;
};