const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const userRoutes = require('./routers/user.router');
const orderRoutes = require('./routers/order.router');
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

//API user
app.use('/api/users', userRoutes);

//API order
app.use('/api/order', orderRoutes)

// Kết nối database
sequelize.sync()
  .then(() => console.log('✅ CSDL đã đồng bộ!'))
  .catch(err => console.error('❌ Lỗi đồng bộ CSDL:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
