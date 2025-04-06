const express = require("express");
const bodyParser = require("body-parser");
const cartRoutes = require("./routes/cart.router");
const paymentRoutes = require("./routes/payment.router");

const app = express();
app.use(bodyParser.json());

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
  },
  apis: ["./routes/*.js"], // Adjust the path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/carts", cartRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("Server is running"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
