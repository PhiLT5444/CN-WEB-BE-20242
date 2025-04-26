require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: null,
    database: process.env.DB_NAME || 'product_store',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
};