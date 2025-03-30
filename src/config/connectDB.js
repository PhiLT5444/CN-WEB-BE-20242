const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('commercial_store', 'root', null,{
    // ten, root password 
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

let connectDB = async() => {
    try{
        await sequelize.authenticate();
        console.log('Sucessfully');
    } catch(error){
        console.error('Unable to connect to the database', error);
    }
}

module.exports = connectDB