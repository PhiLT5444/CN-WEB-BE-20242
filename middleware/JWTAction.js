const jwt = require('jsonwebtoken');
require('dotenv').config();

const createJWT = () =>{
    //let token = jwt.sign({foo : 'bar'}, 'secret');
    let payload = {name: 'tuanninh', address: 'Hanoi'}
    let key = process.env.JWT_SECRET;
    let token = null;
    try{        
        token = jwt.sign(payload, key);
    }catch(e){
        console.log(e);
    }
    return token;
}

const verifyToken = (token)=>{
    let key = process.env.JWT_SECRET;
    let data = null;
    jwt.verify(token, key, function(err, decoded){
        if(err){
            console.log(err)
            return data;
        }
        return decoded
    });
}

module.exports = {
    createJWT, verifyToken
}