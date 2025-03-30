'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: '$2b$10$exampleHashedPassword1234567890', // ví dụ: hash bằng bcrypt
        role: 'admin',
        status: 'active',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2b$10$exampleHashForJohn', // ví dụ hash
        role: 'customer',
        status: 'active',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
