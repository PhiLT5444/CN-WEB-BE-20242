const db = require('../models/index')

let getOrderDetailList = async(req, res) => {
    try{
        let data = await db.orderdetails.findAll()
        return res.send(data)
    }catch(e){
        return res.send(e)
    }
}
module.exports = {
    getOrderDetailList : getOrderDetailList,
}