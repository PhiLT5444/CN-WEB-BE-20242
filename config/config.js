require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: 'Phongnguyen@80', // Mỗi máy local là khác nhau!
    database: 'product_store',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
};
