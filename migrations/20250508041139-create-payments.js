'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('credit_card','paypal','momo','vnpay'),
        allowNull: false
      },
      payment_status: {
        type: Sequelize.ENUM('pending','successful','failed'),
        allowNull: true,
        defaultValue: 'pending'
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Indexes
    await queryInterface.addIndex('payments', ['order_id'], {
      name: 'order_id',
      using: 'BTREE'
    });
    await queryInterface.addIndex('payments', ['user_id'], {
      name: 'user_id',
      using: 'BTREE'
    });
    await queryInterface.addIndex('payments', ['transaction_id'], {
      name: 'transaction_id',
      unique: true,
      using: 'BTREE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
