const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('-------------------')
console.log(process.env.DB_DIALECT)
console.log('-------------------')


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);


module.exports = sequelize;


// postgres://tvmqfksz:td8O8J5AmoJYXwbcYspn8enku78pCJ85@tyke.db.elephantsql.com/tvmqfksz