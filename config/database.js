const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE || 'commercial_store',
  username: process.env.MYSQL_USERNAME || 'root',
  password: null,
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
