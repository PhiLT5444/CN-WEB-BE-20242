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

let getEditInformation  = async(req, res) => {
    let userId = req.query.id;
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
    let userId = req.params.id;
    // console.log('the id number is: ')
    // console.log(req.params.id)
    const result = await userService.updateUserData(userId, req.body);
    return res.status(200).json(result);
}
module.exports = {
    handleLogin: handleLogin,
    createUser: createUser,
    displayAllUser : displayAllUser,
    getEditInformation: getEditInformation, 
    updateUser: updateUser,
}