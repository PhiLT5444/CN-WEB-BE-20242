const { where } = require('sequelize');
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
                    //attributes : ['email', 'role', 'password', 'id'],
                    where: {
                        email : email,
                    }
                });
                if(user){
                    //compare password 
                    if(user.status == 'banned'){
                        userData.errCode = 4;
                        userData.errMessage = 'You are banned!';
                    }
                    else{
                        let check = await bcrypt.compare(password, user.password);
                        if(check){
                            userData.errCode = 0;
                            userData.errMessage = 'OK';
                            //raw: true;
                            // delete password for user api 
                            // let userObj = user.get({plain: true});
                            // delete userObj.password;
                            // userData.user = userObj;
                            // userData.id = user.id;
                            // userData.role = user.role;
                            userData.user = {
                                id: user.id,
                                role: user.role,
                                email: user.email,
                                username: user.username,
                                full_name: user.full_name,
                                gender: user.gender,
                                address: user.address,
                                phone_number: user.phone_number,
                            }
                        }else{
                            userData.errCode = 3;
                            userData.errMessage = 'Tài khoản hoặc mật khẩu không đúng!';
                        }
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `Tài khoản hoặc mật khẩu không đúng!`
                }
            } 
            else{
                userData.errCode = 1;
                userData.errMessage = `Tài khoản hoặc mật khẩu không đúng!`;
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
            let user1 = await db.users.findOne({
                where: {email: data.email}
            });
            let user2 = await db.users.findOne({
                where: {username: data.username}
            })
            let user3 = await db.users.findOne({
                where : {phone_number: data.phone_number}
            })
            if(user1){
                resolve({
                    errCode: 3,
                    errMessage: 'This email was used!',
                });
            }
            else{
                if(user2){
                    resolve({
                        errCode: 2,
                        errMessage: 'This username was used!',
                    });
                }
                else{
                    if(user3){
                        resolve({
                            errCode: 1,
                            errMessage: 'This phone number was used!', 
                        });
                    }
                    else{   
                        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                        await db.users.create({
                        username : data.username,
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        //role: data.role,
                        full_name: data.full_name,
                        gender: data.gender,
                        address: data.address,
                        phone_number: data.phone_number,
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'ok create a new user succeed!',
                        });
                    }
                }
            }
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

// getAllUser
let getAllUser = () => {
    return new Promise(async(resolve, reject) =>{
        try{
            const activeUser = await db.users.count({
                where: {
                    status : 'active',
                }
            })
            const bannedUser = await db.users.count({
                where: {
                    status : 'banned',
                }
            })
            let users = await db.users.findAll({
                raw: true,
                attributes: {exclude: ['password']},
            });
            /* Cach 2
            let users = await db.users.findAll();
            let cleanUser = users.map(user => {
                let obj = user.get({plain : true});
                delete obj.password;
                return obj;
                });
            resolve(cleanUser)
            */
            resolve({
                activeUser: activeUser,
                bannedUser: bannedUser,
                users
            })
        }catch(e){
            reject(e);
        }
    })
}

//get user by Id
let getUserInfoById = (userId) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.users.findOne({
                where : {id : userId},
                raw : true,
                attributes: {exclude: ['password']},
            })
            if(user){
                resolve(user)
            }else{
                resolve({})
            }
        }catch(e){
            reject(e);
        }
    })
}

let updateUserData = (userId, data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.users.findOne({
                where: {id: userId},
            })
            if(user){
                let user1 = await db.users.findOne({
                    where: {
                        username: data.username,
                        id: { [db.Sequelize.Op.ne]: userId },
                    }
                })
                let user2 = await db.users.findOne({
                    where: {
                        phone_number: data.phone_number,
                        id: { [db.Sequelize.Op.ne]: userId },
                    }
                })
                if(user1){
                    resolve({
                        errCode: 2,
                        errMessage: "This username was used!"
                    });
                }
                else{
                    if(user2){
                        resolve({
                            errCode: 3,
                            errMessage: "This phone number was used!"
                        });
                    }
                    else{
                        console.log(user)
                        user.username = data.username || user.username;
                        user.full_name = data.full_name || user.full_name;
                        user.gender = data.gender || user.gender;
                        user.address = data.address || user.address;
                        user.phone_number = data.phone_number || user.phone_number;
                        await user.save();
                        resolve({
                            errCode : 0,
                            errMessage: 'Updated successfully!'
                        });
                    }
                }
            }
            else{
                resolve({
                    errCode : 1,
                    errMessage: 'User not found!'
                });
            }
        }catch(e){
            reject(e);
        }
    })
}

let deleteUserById = (userId)=>{
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.users.findOne({
                where: {id: userId}
            })
            if(user){
                await user.destroy();
                resolve({
                    errCode: 0,
                    errMessage: `Deleted Successfully!`
                });
            }   
            else{
                resolve({
                    errCode: 1,
                    errMessage: `User not found!`
                });
            }
        }catch(e){
            reject(e)
        }
    })
}

let banUser = (userId) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let user = await db.users.findOne({
                where: {id : userId}
            })
            if(user){
                user.status = 'banned';
                await user.save();
                return resolve({
                    errCode: 0,
                    errMessage: 'Done!',
                })
            }
            else{
                return resolve({
                    errCode: 1,
                    errMessage: 'User not found!',
                })
            }
        }catch(e){
            reject(e);
        }
    })
}

let changeYourPassword = (userId, oldPW, newPW, confirmPW) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const user = await db.users.findOne({
                where: {id : userId}
            });
            if(user){
                const isMatch = await bcrypt.compare(oldPW, user.password);
                if(!isMatch){
                    resolve({
                        errCode : 2,
                        errMessage: 'Wrong password'
                    })
                }
                else{
                    if(newPW !== confirmPW){
                       resolve({
                            errCode : 3,
                            errMessage: 'confirmPW is different from newPW'
                       })
                    }
                    else{
                        const hashedNewPW = await bcrypt.hash(newPW, salt);
                        await user.update({
                            password: hashedNewPW
                        });
                        resolve({
                            errCode: 0,
                            errMessage: 'Successfully!'
                        })
                    }
                }
            }
            else{
                resolve({
                    errCode : 1,
                    errMessage: 'User not found!'
                })
            }
        }
        catch(err){
            reject(err);
        }
    })
}
module.exports ={
    handleUserLogin : handleUserLogin,
    createNewUser : createNewUser,
    getAllUser : getAllUser,
    getUserInfoById : getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
    banUser: banUser,
    changeYourPassword: changeYourPassword,
}