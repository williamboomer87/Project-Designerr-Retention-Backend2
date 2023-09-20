// models/Chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Import your Sequelize instance
const Message = require('./message'); 

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prompt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'chats', // Make sure this matches your actual table name
  timestamps: true,
});


module.exports = Chat;
