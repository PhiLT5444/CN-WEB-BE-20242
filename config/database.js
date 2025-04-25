const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'product_store',
  username: process.env.MYSQL_USERNAME || 'root',
  password: 'admin',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  dialect: 'mysql',
  port: process.env.MYSQL_PORT || 3306,
  logging: false, 
  define: {
    freezeTableName: true, 
    underscored: true, 
  }
});

sequelize.authenticate()
  .then(() => console.log('✅ Kết nối MySQL thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối MySQL:', err));

module.exports = sequelize;