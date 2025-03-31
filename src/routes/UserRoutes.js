const express = require('express')
const UserController = require('../controllers/UserController')

let router = express.Router();

let userRoutes = (app) => {
    router.post('/api/login', UserController.handleLogin) // login
    router.post('/api/create', UserController.createUser) // to create your account and create others account by admin
    router.get('/api/getAllUser', UserController.displayAllUser) // for admin function
    router.get('/api/getUserById', UserController.getEditInformation) // get user info by Id /api/getUserById/:id

    router.put('/api/userUpdate/:id', UserController.updateUser) // update user information

    return app.use("/", router);
}

module.exports = userRoutes