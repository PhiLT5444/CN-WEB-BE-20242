const express = require('express');
const orderController = require('../controllers/OrderController')

let router = express.Router();

let orderRoutes = (app) =>{
    router.get('/test', orderController.getOrderList)

    return app.use("/", router);
}

module.exports = orderRoutes;