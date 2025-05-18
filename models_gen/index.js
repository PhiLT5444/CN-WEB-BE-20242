"use strict";

require("dotenv").config();
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

// Khởi tạo sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Sử dụng init-models.js để khởi tạo các model và mối quan hệ
const initModels = require(path.join(__dirname, "init-models"));
const db = initModels(sequelize);

// Thêm sequelize và Sequelize vào object db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;