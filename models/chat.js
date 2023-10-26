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
  chatkey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prompt: {
    type: DataTypes.STRING,
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

Chat.hasMany(Message, { foreignKey: 'chat_id' });

module.exports = Chat;
