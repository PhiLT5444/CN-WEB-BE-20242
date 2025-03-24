const express = require('express');
const OrderDetailController = require('../controllers/OrderDetailController')

let router = express.Router();

let orderDetailRoutes = (app) => {
    router.get("/orderdetaillist", OrderDetailController.getOrderDetailList)

    return app.use("/", router);
}

module.exports = orderDetailRoutes