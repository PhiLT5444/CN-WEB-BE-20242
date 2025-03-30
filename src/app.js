const express = require('express');
const connectDB = require('./config/connectDB');
const orderRoutes = require('./routes/OrdersRoutes')
const orderDetailRoutes = require('./routes/OrderDetailRoutes')
const userRoutes = require('./routes/UserRoutes')

require('dotenv').config();
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// orderRoutes(app);
// orderDetailRoutes(app);
userRoutes(app);

connectDB();

let port = process.env.PORT || 5050;

app.listen(port, () =>{
    console.log("The web is running on the port: " + port)
})