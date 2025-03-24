const express = require('express');
const orderController = require('../controllers/OrderController')

let router = express.Router();

let orderRoutes = (app) =>{
    router.get('/orderlist', orderController.getOrderList)

    return app.use("/", router);
}

module.exports = orderRoutes;