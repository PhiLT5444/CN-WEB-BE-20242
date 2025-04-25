// const { config } = require('dotenv');
const userService = require('../services/userService')
const jwt = require('jsonwebtoken')
require('dotenv').config();

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // if(!email || !password){
    //     return res.status(400).json({
    //         errCode: 1,
    //         message: 'Missing inputs parameter!'
    //     })
    // }

    let userData = await userService.handleUserLogin(email, password);
    //console.log(userData)
    if(userData.errCode == 0){
        const payload = {
            id: userData.user.id,
            role: userData.user.role
        };

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {expiresIn: '2h'});
        console.log(token)
        return res.status(200).json({
            message: userData.errMessage, 
            token,
            user: userData.user,
        })
    }
    else{
        return res.status(404).json({
            message: userData.errMessage,
        })
    }
}

let createUser = async(req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message);
}

let displayAllUser = async(req, res) => {
    let data = await userService.getAllUser();
    console.log(data)
    return res.status(200).json({
        data
    })
}

let getEditInformation  = async(req, res) => {
    let userId = req.user.id;
    console.log(userId)

    // Ham danh gia obj tra ve {} hay la cac du lieu
    const isEmptyObject = (obj) => Object.keys(obj).length === 0;

    if(userId){
        let userData = await userService.getUserInfoById(userId)
        //console.log(userData)
        if(isEmptyObject(userData)){
            return res.status(404).json({
                errMessage: '404 Not Found!'
            })
        }
        else{
            return res.status(200).json({
                userData
            })
        }
    }
    else{
        return res.status(500).json({
            errMessage: 'The id query is empty'
        })
    }
}

let updateUser = async(req, res) =>{
    let userId = req.user.id;
    // console.log('the id number is: ')
    // console.log(req.params.id)
    const result = await userService.updateUserData(userId, req.body);
    //return res.status(200).json(result);
    return res.status(200).json(result);
}

let deleteUser = async(req, res)=>{
    let id = req.params.id;
    const result = await userService.deleteUserById(id);
    //return res.send('Delete the user succeed')
    //return res.status(200).json(result);
    if(result.errCode == 1){
        return res.status(404).json(result);
    }
    return res.status(200).json(result)
}

let getPunishmentOnUser = async(req, res)=>{
    let id = req.params.id;
    const result = await userService.banUser(id);
    if(result.errCode == 1){
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}

let unBanUser = async(req, res)=>{

    let id = req.params.id;
    const result = await userService.unBanUser(id);
    if(result.errCode == 1){
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}

let changePassword = async(req, res)=>{
    // let oldPW = req.body.currentPassword;
    // let newPW = req.body.newPassword;
    // let confirmPW = req.body.confirmPW;
    let {oldPW, newPW, confirmPW} = req.body;
    //let id = req.params.id;
    id = req.user.id;
    const result = await userService.changeYourPassword(id, oldPW, newPW, confirmPW);
    if(result.errCode != 0){
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}
//forgot pasword
let forgotPassword = async(req, res)=>{
    const inputEmail = req.body.email;
    const result = userService.forgotPassword(inputEmail);
    if(result.errCode === 1){
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}

let resetPassword = async(req, res) => {
    const {token, newPassword} = req.body;
    const result = userService.resetPassword(token, newPassword);
    if(result.errCode === 1){
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}

module.exports = {
    handleLogin: handleLogin,
    createUser: createUser,
    displayAllUser : displayAllUser,
    getEditInformation: getEditInformation, 
    updateUser: updateUser,
    deleteUser: deleteUser,
    getPunishmentOnUser: getPunishmentOnUser,
    changePassword: changePassword,
    unBanUser: unBanUser,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
}