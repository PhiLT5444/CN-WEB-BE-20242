'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending','processing','completed','canceled'),
        allowNull: true,
        defaultValue: 'pending',
      },
      shipping_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('pending','paid','failed'),
        allowNull: true,
        defaultValue: 'pending',
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
