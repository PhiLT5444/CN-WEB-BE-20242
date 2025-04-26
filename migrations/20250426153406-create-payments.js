'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('credit_card','paypal','momo','vnpay'),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('pending','successful','failed'),
        allowNull: true,
        defaultValue: 'pending',
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }    
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};
