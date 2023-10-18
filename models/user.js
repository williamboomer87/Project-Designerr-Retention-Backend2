const { DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/dbConfig');
const Payment = require('./payment'); 
const Chat = require('./chat'); 

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name field is required.',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'email field is required.',
      },
      isEmail: {
        msg: 'Invalid email address.',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password field is required.',
      },
    },
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  image: {
    type: DataTypes.TEXT, 
    allowNull: true, 
  },
  news_updates: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  tips_tutorials: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  user_research: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  reminders: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
}, {
  tableName: 'users', // Specify the table name explicitly
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hashSync(user.password, 10);
  user.password = hashedPassword;
});

User.hasMany(Payment, { foreignKey: 'user_id' }); 

User.hasMany(Chat, { foreignKey: 'user_id' });

// Hash the password before saving the user
// User.beforeUpdate(async (user) => {
//   if (user.changed('password')) {
//     const hashedPassword = await bcrypt.hashSync(user.password, 10);
//     user.password = hashedPassword;
//   }
// });

module.exports = User;
