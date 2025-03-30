const db = require('../models/index')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) =>{
        try{
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist){
                let user = await db.users.findOne({
                    attributes : ['email', 'role', 'password'],
                    where: {email : email}
                });
                if(user){
                    //compare password 
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        //raw: true;
                        let userObj = user.get({plain: true});
                        delete userObj.password;
                        userData.user = userObj;
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User is not found`
                }
            } 
            else{
                userData.errCode = 1;
                userData.errMessage = `Your's email is not exist in our system`
            }
            resolve(userData)
        }
        catch(e){
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise (async(resolve, reject)=>{
        try{
            let user = await db.users.findOne({
                where : {email : userEmail},
                // attributes: {
                //     include: ['email', 'role'],
                //     //exclude: []
                // }
            })
            if(user){
                resolve(true)
            }
            else{
                resolve(false)
            }
        }catch(e){
            reject(e);
        }
    })
}

// create account 

let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.users.create({
                username : data.username,
                email: data.email,
                password: hashPasswordFromBcrypt,
                role: data.role
            })
            resolve('ok create a new user succeed!')
        }catch(e){
            reject(e);
        }
    })
}

let hashUserPassword = (password) =>{
    return new Promise( async(resolve, reject) =>{
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e){
            reject(e);
        }
    })
}

module.exports ={
    handleUserLogin : handleUserLogin,
    createNewUser : createNewUser
}