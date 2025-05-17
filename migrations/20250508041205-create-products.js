'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
