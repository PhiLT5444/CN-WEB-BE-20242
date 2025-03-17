// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Đọc biến môi trường từ .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Thay đổi nếu dùng database khác (postgres, sqlite,...)
    logging: false, // Tắt log SQL (tùy chọn)
  }
);

module.exports = sequelize;