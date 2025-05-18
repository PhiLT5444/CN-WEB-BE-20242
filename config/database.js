const { Sequelize } = require("sequelize");
require("dotenv").config();
// Lưu ý sửa database.js và config.json ở mỗi máy local khác nhau!
const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE || "product_store",
  username: process.env.MYSQL_USERNAME || "root",
  password: "841639647172n",
  host: process.env.MYSQL_HOST || "127.0.0.1",
  dialect: "mysql",
  port: process.env.MYSQL_PORT || 3306,
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Kết nối MySQL thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MySQL:", err));

module.exports = sequelize;
