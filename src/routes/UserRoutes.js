const express = require('express')
const UserController = require('../controllers/UserController')
const {isSelf, authenticate, roleRequired} = require('../middleware/auth')
let router = express.Router();

let userRoutes = (app) => {
    router.post('/api/login', UserController.handleLogin) // login
    router.post('/api/createUser', UserController.createUser) // to create your account and create others account by admin
    
    router.get('/api/getAllUser',authenticate, roleRequired('admin'), UserController.displayAllUser) // for admin function
    router.get('/api/getUserById/:id',authenticate, UserController.getEditInformation) // get user info by id /

    router.put('/api/userUpdate/:id',authenticate, isSelf, UserController.updateUser) // update user information
    router.post('/api/userDelete/:id',authenticate, roleRequired('admin'), UserController.deleteUser) // delete user 

    return app.use("/", router);
}

module.exports = userRoutes