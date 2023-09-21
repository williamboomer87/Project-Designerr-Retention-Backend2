// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Import your Sequelize instance

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(255), 
    allowNull: false,
  },
}, {
  tableName: 'payments', // Make sure this matches your actual table name
  timestamps: true,
});


module.exports = Payment;
