const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const userRoutes = require('./routers/user.router');

dotenv.config();
const app = express();
app.use(express.json());

// Sử dụng các router tại đây
app.use('/api/users', userRoutes);

// Kết nối database
sequelize.sync()
  .then(() => console.log('✅ CSDL đã đồng bộ!'))
  .catch(err => console.error('❌ Lỗi đồng bộ CSDL:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
