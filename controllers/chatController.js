const { validationResult } = require('express-validator');
require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Chat = require('../models/chat');
const Message = require('../models/message');

const saveChat = async (req, res) => {
  const { token, prompt, imageUrl } = req.body;

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const newChat = await Chat.create({
      user_id: userId,
      prompt: prompt,
    });

    const newChatId = newChat.id;

    const newMessage1 = await Message.create({
      chat_id: newChatId,
      image_url: null,
      content: "User:" + prompt,
    });

    (async () => {
      // Replace with your image URL
      const uploadedUrl = await uploadImageToS3(imageUrl);

      if (uploadedUrl !== null) {
        console.log('Uploaded URL:', uploadedUrl);
        const newMessage2 = await Message.create({
          chat_id: newChatId,
          image_url: uploadedUrl,
          content: "AI: Noted on that... Please wait in a bit, Thanks!",
        });
      } else {
        console.log('Image upload failed.');
      }
    })();

    const newMessage3 = await Message.create({
      chat_id: newChatId,
      image_url: null,
      content: "AI: Thank you for waiting! Kindly see the results below",
    });


    // console.log('User ID:', userId);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle JWT error
      return res.status(400).json({
        success: false, errors: {
          "jwt error": 'Invalid JWT token: ' + error.message
        }
      });
    } else {
      // Handle other errors
      return res.status(400).json({
        success: false, errors: {
          "jwt error": 'Error: ' + error.message
        }
      });
    }
  }

  return res.status(200).json({ success: true });
};


const uploadImageToS3 = async (imageUrl) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'us-east-1', // Set your desired AWS region
  });

  const s3 = new AWS.S3();

  try {
    const uniqueName = `image_${Date.now()}.png`;

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const params = {
      Bucket: 'designerimgbucket',
      Key: uniqueName,
      Body: imageBuffer,
    };

    const data = await s3.upload(params).promise();
    console.log('Image uploaded successfully:', data.Location);

    return data.Location; // Return the uploaded URL
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return null; // Return null in case of an error
  }
};

const imgUpload = async (req, res) => {

  const { imageUrl } = req.body;

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  // Set your AWS access key ID and secret access key
  AWS.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'us-east-1', // Set your desired AWS region
  });

  const s3 = new AWS.S3();

  // Define a unique name for the image in S3
  const uniqueName = `image_${Date.now()}.png`;

  // Download the image using axios
  await axios.get(imageUrl, { responseType: 'arraybuffer' })
    .then(response => {
      const imageBuffer = Buffer.from(response.data, 'binary');

      const params = {
        Bucket: 'designerimgbucket',
        Key: uniqueName, // Use the unique name as the key (filename) in S3
        Body: imageBuffer, // Use the image buffer as the Body
      };

      s3.upload(params, (err, data) => {
        if (err) {
          res.status(500).json({ success: false, error: err });
        } else {
          console.log('Image uploaded successfully:', data.Location);
          res.status(200).json({ success: true, data: { imageUrl: data.Location } });
        }
      });
    })
    .catch(error => {
      res.status(500).json({ success: false, error: error });
    });
};



module.exports = {
  imgUpload,
  saveChat,
};
