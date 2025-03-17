// src/app.js
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Sử dụng routes
app.use('/api', userRoutes);

// Đồng bộ database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Error syncing database:', err);
});

module.exports = app;