const db = require('../models/index')

let getOrderList = async (req, res) => {
    try{
        let data = await db.orders.findAll()
        return res.send(data)
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    getOrderList : getOrderList, 
}