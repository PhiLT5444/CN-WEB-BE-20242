const express = require("express");
const bodyParser = require("body-parser");
const cartRoutes = require("./routes/cart.router");
const paymentRoutes = require("./routes/payment.router");

const app = express();
app.use(bodyParser.json());

app.use("/api/carts", cartRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("Server is running"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
