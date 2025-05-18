const { where } = require('sequelize');
const sequelize = require('../config/database');
const initModels = require('../models_gen/init-models');
const models = initModels(sequelize);
const {users} = models;
const {Op} = require('sequelize');
// const db = require('../models/index')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);
const crypto = require('crypto')
const sendMail = require('../utils/sendMail');
const { resolve } = require('path');
const { rejects } = require('assert');

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) =>{
        try{
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist){
                let user = await users.findOne({
                    //attributes : ['email', 'role', 'password', 'id'],
                    where: {
                        email : email,
                    }
                });
                if(user){
                    //compare password 
                    if(user.status == 'banned'){
                        userData.errCode = 4;
                        userData.errMessage = 'Bạn đang bị áp dụng lệnh cấm';
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
            let user = await users.findOne({
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
            let user1 = await users.findOne({
                where: {email: data.email}
            });
            let user2 = await users.findOne({
                where: {username: data.username}
            })
            // let user3 = await users.findOne({
            //     where : {phone_number: data.phone_number}
            // })
            if(user1){
                resolve({
                    errCode: 3,
                    errMessage: 'Email này đã được sử dụng',
                });
            }
            else{
                if(user2){
                    resolve({
                        errCode: 2,
                        errMessage: 'Tên tài khoản này đã được sử dụng',
                    });
                }
                else{
                    // if(user3){
                    //     resolve({
                    //         errCode: 1,
                    //         errMessage: 'Số điện thoại này đã được sử dụng', 
                    //     });
                    // }
                    //else{   
                        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                        await users.create({
                        username : data.username,
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        role: data.role,
                        full_name: data.full_name,
                        gender: data.gender,
                        address: data.address,
                        phone_number: data.phone_number,
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Tạo tài khoản thành công',
                        });
                    //}
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
            const activeUser = await models.users.count({
                where: {
                    status : 'active',
                }
            })
            const bannedUser = await models.users.count({
                where: {
                    status : 'banned',
                }
            })
            let users = await models.users.findAll({
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
            let user = await users.findOne({
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
            let user = await users.findOne({
                where: {id: userId},
            })
            if(user){
                let user1 = await users.findOne({
                    where: {
                        username: data.username,
                        id: { [Op.ne]: userId },
                    }
                })
                // let user2 = await users.findOne({
                //     where: {
                //         phone_number: data.phone_number,
                //         id: { [Op.ne]: userId },
                //     }
                // })
                if(user1){
                    resolve({
                        errCode: 2,
                        errMessage: "Tên người dùng đã được sử dụng"
                    });
                }
                else{
                    // if(user2){
                    //     resolve({
                    //         errCode: 3,
                    //         errMessage: "Số điện thoại này đã được sử dụng"
                    //     });
                    // }
                    //else{
                        //console.log(user)
                        user.username = data.username || user.username;
                        user.full_name = data.full_name || user.full_name;
                        user.gender = data.gender || user.gender;
                        user.address = data.address || user.address;
                        user.phone_number = data.phone_number || user.phone_number;
                        await user.save();
                        resolve({
                            errCode : 0,
                            errMessage: 'Cập nhật thành công'
                        });
                    //}
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
            let user = await users.findOne({
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
            let user = await users.findOne({
                where: {id : userId}
            })
            if(user){
                if(user.status === 'banned'){
                    return resolve({
                        errCode: 2,
                        errMessage: 'The user was banned'
                    })
                }
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

let unBanUser = (userId) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let user = await users.findOne({
                where: {id : userId}
            })
            if(user){
                user.status = 'active';
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
            const user = await users.findOne({
                where: {id : userId}
            });
            if(user){
                const isMatch = await bcrypt.compare(oldPW, user.password);
                if(!isMatch){
                    resolve({
                        errCode : 2,
                        errMessage: 'Sai mật khẩu'
                    })
                }
                else{
                    if(newPW !== confirmPW){
                       resolve({
                            errCode : 3,
                            errMessage: 'Mật khẩu xác nhận không khớp!'
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

//forgot password 
let forgotPassword = (email) =>{
    return new Promise(async(resolve, reject) => {
        try{
            const user = await users.findOne({
                where: {email: email}
            })
            if(!user){
                resolve({
                    errCode: 1,
                    errMessage: "Email không tồn tại"
                })
            }
            else{
                const token = crypto.randomBytes(32).toString("hex");
                user.resetToken = token;
                user.tokenExpire = Date.now() + 1000 * 60 * 15;
                await user.save();

                const resetLink = `http://localhost:3000/reset-password?token=${token}`
                await sendMail(email, "Reset mật khẩu", `Link đặt lại mật khẩu: ${resetLink}`);

                resolve({
                    errCode: 0,
                    errMessage: "Yêu cầu đặt lại mật khẩu đã được gửi tới email của bạn"
                })
            }
        }
        catch(err){
            reject(err);
        }
    })
}

let resetPassword = (token, newPassword) => {
    return new Promise(async(resolve, reject) => {
        try{
            const user = await users.findOne({
                where:{
                    resetToken: token,
                    tokenExpire: { [Op.gt]: new Date() }
                }
            });

            if(!user){
                resolve({
                    errCode: 1,
                    errMessage: "Token không hợp lệ hoặc đã hết hạn"
                })
            }
            user.password = await bcrypt.hash(newPassword, salt);
            user.resetToken = null;
            user.tokenExpire = null;
            await user.save();
            
            resolve({
                errCode: 0,
                errMessage: "Đặt lại mật khẩu thành công"
            })
        }
        catch(e){
            reject(e);
        }
    })
}

let getInfo = (userId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let userData = {};
            let user = await users.findOne({
                where: {id: userId}
            })
            if(user){
                userData.errCode = 0;
                userData.errMessage = 'OK';
                userData.user = {
                    full_name: user.full_name,
                    address: user.address,
                    phone_number: user.phone_number,
                }
            }
            else{
                userData.errCode = 1;
                userData.errMessage = "Không tồn tại người dùng"
            }
            resolve(userData);
        }
        catch(e){
            reject(e);
        }
    })
}

let getShipperList = () => {
    return new Promise(async(resolve, rejects) => {
        try{
            let shipper = await models.users.findAll({
                raw: true,
                where : {role : 'shipper'},
                attributes: ['username', 'phone_number', 'address'],
            });
            resolve(shipper);
        }
        catch(e){
            rejects(e);
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
    unBanUser: unBanUser,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    getInfo: getInfo,
    getShipperList: getShipperList,
}