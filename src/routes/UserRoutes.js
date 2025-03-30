const express = require('express')
const UserController = require('../controllers/UserController')

let router = express.Router();

let userRoutes = (app) => {
    router.post('/api/login', UserController.handleLogin)
    router.post('/api/create', UserController.createUser)

    return app.use("/", router);
}

module.exports = userRoutes