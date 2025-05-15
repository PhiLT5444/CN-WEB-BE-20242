const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const productRoutes = require("./routers/product.router");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routers/user.router");
const orderRoutes = require("./routers/order.router");
//Import route thanh toán
const paymentRoutes = require("./routers/paymentRoutes");

dotenv.config();
const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
  },
  apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//API product
app.use("/api/products", productRoutes);
//API user
app.use("/api/users", userRoutes);

//API order
app.use("/api/orders", orderRoutes);

//API thanh toán - tích hợp module thanh toán
app.use("/api/payments", paymentRoutes);

sequelize
  .sync()
  .then(() => console.log("✅ CSDL đã đồng bộ!"))
  .catch((err) => console.error("❌ Lỗi đồng bộ CSDL:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
