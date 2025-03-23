const express = require('express');
const connectDB = require('./config/connectDB');
const orderRoutes = require('./routes/OrdersRoutes')

require('dotenv').config();
let app = express();

orderRoutes(app)

connectDB();

let port = process.env.PORT || 5005;

app.listen(port, () =>{
    console.log("The web is running on the port: " + port)
})