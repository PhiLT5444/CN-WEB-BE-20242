const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const cartRoutes = require("./routers/cart.router");
const paymentRoutes = require("./routers/payment.router");
const productRoutes = require("./routers/product.router");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

app.use("/api/carts", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);

sequelize
  .sync()
  .then(() => console.log("✅ CSDL đã đồng bộ!"))
  .catch((err) => console.error("❌ Lỗi đồng bộ CSDL:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
