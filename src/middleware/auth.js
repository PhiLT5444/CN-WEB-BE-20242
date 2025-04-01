const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.users;
require('dotenv').config();

//middleware for authenticate 
const authenticate = async(req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'You are not login!'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        const user = await User.findOne({
            where:{
                id: decoded.id, 
                status: 'active',
            },
        });
        if(!user){
            return res.status(403).json({message: 'This account is invalid!'})
        }
        req.user = user; // user from DB
        next();
    }
    catch(e){
        console.error(e);
        return res.status(403).json({message: 'Token is invalid or expired!'})
    }
}

//middleware for role (admin/ customer)
const roleRequired = (requireRole)=>{
    return (req, res, next) =>{
        if(!req.user){
            return res.status(401).json({message: 'User is not validate!'});
        }

        if(req.user.role !== requireRole){
            return res.status(403).json({message: `You are not a '${requireRole}'`});
        }
        next();
    };
}

// For your self (update information, check your order list )
const isSelf = (req, res, next)=>{
    const id = parseInt(req.params.id || req.body.id);
    if(!req.user || req.user.id !== id){
        return res.status(403).json({message: `You are not allowed at this activity! `})
    }
    next();
}

//Middle for many roles

// const rolesAllowed = (roles = [])=>{
//     return (req, res, next)=>{
//         if(!req.user || !roles.includes(req.user.role)){
//             return res.status(403).json({message: `You are not allowed!`});
//         }
//         next();
//     }
// }

module.exports = {
    isSelf, 
    authenticate, 
    roleRequired,
}