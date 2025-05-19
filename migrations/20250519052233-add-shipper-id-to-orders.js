'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'shipper_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // 👈 Nếu bạn có bảng 'shippers'
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'shipper_id');
  }
};