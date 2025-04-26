'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        user_id: 1,  // giả định user ID=1
        total_amount: 200.00,
        status: 'pending',
        shipping_address: 'Hanoi',
        payment_status: 'pending',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        total_amount: 150.00,
        status: 'processing',
        shipping_address: 'HCM City',
        payment_status: 'paid',
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
