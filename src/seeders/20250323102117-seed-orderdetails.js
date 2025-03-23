'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderdetails', [{
      order_id: 1,
      product_id: 1,
      quantity: 2,
      price: 50.25,
      total_price: 100.50,
      is_deleted: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }])
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
