const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const productRoutes = require("./routers/product.router");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routers/user.router");
const orderRoutes = require("./routers/order.router");
const paymentRoutes = require("./routers/paymentRoutes");
const cartRoutes = require("./routers/cart.router");
const cors = require("cors");
const {authenticate} = require('./middleware/auth');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

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
app.use("/api/payment", paymentRoutes);

//API quản lý giỏ hàng
app.use("/api/cart", cartRoutes);

sequelize
    .sync()
    .then(() => console.log("✅ CSDL đã đồng bộ!"))
    .catch((err) => console.error("❌ Lỗi đồng bộ CSDL:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
