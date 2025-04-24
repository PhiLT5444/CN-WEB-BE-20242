const express = require('express')
const UserController = require('../controllers/UserController')
const {authenticate, roleRequired} = require('../middleware/auth')
const router = express.Router()

router.post('/login', UserController.handleLogin) // login
router.post('/createUser', UserController.createUser) // to create your account and create others account by admin
// log out : delete token will be implemented in client-side (front-end)
router.post('/changePassword', authenticate, UserController.changePassword) //update your password

router.get('/getAllUser',authenticate, roleRequired('admin'), UserController.displayAllUser) // for admin function
router.get('/getProfile',authenticate, UserController.getEditInformation) // get user info by id 

router.post('/userUpdate',authenticate, UserController.updateUser) // update user information
//forgot password ??? 
    
router.post('/punish/:id', authenticate, roleRequired('admin'), UserController.getPunishmentOnUser); //ban user
router.post('/userDelete/:id',authenticate, roleRequired('admin'), UserController.deleteUser) // delete user 

module.exports = router;