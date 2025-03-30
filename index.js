const express = require('express');
const connectDB = require('./config/connectDB');
const orderRoutes = require('./routes/OrdersRoutes')
const orderDetailRoutes = require('./routes/OrderDetailRoutes')

require('dotenv').config();
let app = express();

orderRoutes(app);
orderDetailRoutes(app);


connectDB();

let port = process.env.PORT || 5005;

app.listen(port, () =>{
    console.log("The web is running on the port: " + port)
})