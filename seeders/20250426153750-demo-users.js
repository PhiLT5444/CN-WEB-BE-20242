'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin01',
        email: 'admin01@example.com',
        password: '123456',  // Bản test, chưa mã hóa
        role: 'admin',
        status: 'active',
        is_deleted: false,
        address: 'Hanoi, Vietnam',
        gender: 'male',
        full_name: 'Admin User 01',
        phone_number: '0909000001',
        resetToken: null,
        tokenExpire: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'customer01',
        email: 'customer01@example.com',
        password: '123456',
        role: 'customer',
        status: 'active',
        is_deleted: false,
        address: 'Hanoi, Vietnam',
        gender: 'female',
        full_name: 'Customer 01',
        phone_number: '0909000002',
        resetToken: null,
        tokenExpire: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add thêm nhiều user nếu cần
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
