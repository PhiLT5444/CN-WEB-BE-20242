'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payments', [
      {
        order_id: 1,
        user_id: 1,
        amount: 200.00,
        payment_method: 'credit_card',
        payment_status: 'successful',
        transaction_id: 'TXN000001',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 2,
        user_id: 2,
        amount: 150.00,
        payment_method: 'paypal',
        payment_status: 'pending',
        transaction_id: 'TXN000002',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 1,
        user_id: 1,
        amount: 50.00,
        payment_method: 'momo',
        payment_status: 'failed',
        transaction_id: 'TXN000003',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 2,
        user_id: 2,
        amount: 300.00,
        payment_method: 'vnpay',
        payment_status: 'successful',
        transaction_id: 'TXN000004',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 2,
        user_id: 2,
        amount: 120.00,
        payment_method: 'credit_card',
        payment_status: 'successful',
        transaction_id: 'TXN000005',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
