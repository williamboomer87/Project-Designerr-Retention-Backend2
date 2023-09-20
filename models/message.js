// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Import your Sequelize instance
const Chat = require('./chat'); // Import the Chat model

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'messages', // Make sure this matches your actual table name
  timestamps: true,
});


module.exports = Message;
