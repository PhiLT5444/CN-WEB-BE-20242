const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const cartRoutes = require("./routers/cart.router");
const paymentRoutes = require("./routers/payment.router");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/carts", cartRoutes);
app.use("/api/payments", paymentRoutes);

sequelize
  .sync()
  .then(() => console.log("✅ CSDL đã đồng bộ!"))
  .catch((err) => console.error("❌ Lỗi đồng bộ CSDL:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
