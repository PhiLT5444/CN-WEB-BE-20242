'use strict';

/** @type {import('sequelize-cli').Migration} */
// npx sequelize-cli db:seed:all
// npx sequelize-cli db:seed:undo --seed name-of-file.js
// npx sequelize-cli db:seed:undo:all

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [{
      user_id: 1,
      total_amount: 150.50,
      status: 'processing',
      shipping_address: '10 Phan Boi Chau',
      payment_status: 'paid',
      is_deleted: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 2,
      total_amount: 250.50,
      status: 'processing',
      shipping_address: '18 ngach 26/9 Do Quang',
      payment_status: 'paid',
      is_deleted: 0,
      created_at: new Date(),
      updated_at: new Date()
    }]);
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
