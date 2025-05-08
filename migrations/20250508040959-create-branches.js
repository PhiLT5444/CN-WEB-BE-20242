'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('branches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    });

    // Thêm index PRIMARY nếu cần thiết (Sequelize đã tự tạo khi primaryKey=true)
    await queryInterface.addIndex('branches', ['id'], {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('branches');
  }
};
