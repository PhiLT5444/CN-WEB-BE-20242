require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
<<<<<<< HEAD
    password: process.env.DB_USER || 'admin',
    database: 'railway',
=======
    password: null,
    database: 'product_store',
>>>>>>> e66098d1d38ef60e0d4174fe94bdb287b1877f14
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
};
