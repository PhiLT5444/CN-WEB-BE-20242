const userService = require('../services/userService')
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let createUser = async(req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message);
    //console.log(req.body)
    return res.send('created successfully')
}

let displayAllUser = async(req, res) => {
    let data = await userService.getAllUser();
    console.log(data)
    return res.status(200).json({
        data
    })
}
module.exports = {
    handleLogin: handleLogin,
    createUser: createUser,
    displayAllUser : displayAllUser,
}