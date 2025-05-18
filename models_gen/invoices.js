const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invoices', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        // Đảm bảo chuyển đổi chuỗi JSON thành đối tượng khi truy xuất
        const value = this.getDataValue('items');
        return value ? JSON.parse(value) : null;
      },
      set(value) {
        // Đảm bảo chuyển đổi đối tượng thành chuỗi JSON khi lưu trữ
        this.setDataValue('items', JSON.stringify(value));
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'invoices',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};