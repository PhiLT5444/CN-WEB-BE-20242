const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateUser = require('../middleware/ValidateUser');

router.post('/add', validateUser, userController.createUser);
router.get('/', userController.getAllUser)

module.exports = router;
