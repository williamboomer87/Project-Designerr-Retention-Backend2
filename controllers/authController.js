// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const Payment = require('../models/payment');
require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');


// Sign-up controller
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ success: false, errors: errorMessages });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email address is already registered.' });
    }
    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    const userData = {
      name: user.name,
      email: user.email,
    };


    res.status(201).json({ success: true, data: { user: userData, token } });
  } catch (error) {
    let errorMessage = '';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map((err) => err.message).join(', ');
    } else {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, error: errorMessage });
  }
};

// Sign-in controller
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ success: false, errors: errorMessages });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ success: false, error: 'No user with email' });
    }

    // Compare passwords

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    const userData = {
      name: user.name,
      email: user.email,
    };


    res.status(200).json({ success: true, data: { user: userData, token } });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ success: false, errors: errorMessages });
    }

    const { token } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    // const user = await User.findByPk(userId);
    const user = await User.findByPk(userId, {
      include: [{ model: Payment }],
    });
    if (!user) {
      return res.status(400).json({ success: false, errors: "No user for this id" });
    }

    res.status(200).json({ success: true, user: user });


  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const updateProfile = async (req, res) => {
  try {

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ success: false, errors: errorMessages });
    }

    const { token, name, email, password } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const userUpdates = {
      name: name,
      email: email
    };
    
    

    if (password) {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      userUpdates.password = hashedPassword;
    }

    const [numAffectedRows] = await User.update(userUpdates, {
      where: { id: userId },
      individualHooks: true,
    });

    if (numAffectedRows > 0) {
      res.status(200).json({ success: true, message: "User updated successfully." });
    } else {
      res.status(404).json({ success: false, error: "User not found." });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const updateProfileNotifications = async (req, res) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const { token, newsUpdates, tipsTutorials, userResearch, reminders } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ success: false, errors: "No user for this id" });
    }

    const userUpdates = {
      news_updates: newsUpdates,
      tips_tutorials: tipsTutorials,
      user_research: userResearch,
      reminders: reminders,
    };

    const [numAffectedRows] = await User.update(userUpdates, {
      where: { id: userId },
      individualHooks: true,
    });

    if (numAffectedRows > 0) {
      res.status(200).json({ success: true, message: "User updated successfully." });
    } else {
      res.status(404).json({ success: false, error: "User not found." });
    }
  } catch (error) {
    
  }
}


const updateProfileImg = async (req, res) => {

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const { token } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ success: false, errors: "No user for this id" });
    }

    AWS.config.update({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: 'us-east-1', // Set your desired AWS region
    });
    var s3 = new AWS.S3();

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const subfolder = 'profile_images'; // Specify the subfolder name

    const originalname = file.originalname;
    const extension = originalname.slice(originalname.lastIndexOf('.'));
    const customFileName = 'user_' + userId + extension;

    const params = {
      Bucket: 'designerimgbucket',
      Key: `${subfolder}/${customFileName}`, // Include the subfolder path in the Key
      Body: file.buffer,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).json({ error: 'Image upload failed' });
      }

      user.image = data.Location;
      user.save();

      console.log('Image uploaded successfully:', data.Location);
      return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: data.Location });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

  // Configure AWS
  // const image = req.file;
  // if(image){
  //   res.status(200).json({ success: true, message: "Profile image updated successfully." });
  // }else{
  //   res.status(404).json({ success: false, error: "Error occured. Please login again and try or connect an admin" });
  // }
}

module.exports = {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  updateProfileImg,
  updateProfileNotifications
};
