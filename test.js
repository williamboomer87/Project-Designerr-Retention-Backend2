const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const { body, validationResult } = require('express-validator'); 

const app = express();
const port = 8080;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const validateKey = [
  body('key').notEmpty().withMessage('Key field is required')
];

app.post('/upload', upload.single('image'), validateKey,  (req, res) => {

  const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
  const { key } = req.body;

  // Configure AWS
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
  const params = {
    Bucket: 'designerimgbucket',
    Key: `${subfolder}/${uuidv4()}-${file.originalname}`, // Include the subfolder path in the Key
    Body: file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    console.log('Image uploaded successfully:', data.Location);
    return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: data.Location });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
