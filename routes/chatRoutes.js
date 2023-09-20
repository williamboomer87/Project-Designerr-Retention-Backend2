const express = require('express');
const router = express.Router();
const { imgUpload } = require('../controllers/chatController');
const { saveChat } = require('../controllers/chatController');
const { imgUploadValidate } = require('../validations/imgUploadValidate'); 
const { saveChtValidate } = require('../validations/saveChtValidate'); 


// image upload route
router.post('/upload_img', imgUploadValidate, imgUpload);

// save chat route
router.post('/save_chat', saveChtValidate, saveChat);


module.exports = router;
