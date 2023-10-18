const express = require('express');
const router = express.Router();
const { imgUpload, saveChat, prevoiusChats } = require('../controllers/chatController');
const { imgUploadValidate } = require('../validations/imgUploadValidate'); 
const { saveChtValidate } = require('../validations/saveChtValidate'); 
const { prevoiusChatsValidate } = require('../validations/prevoiusChatsValidate'); 



// image upload route
router.post('/upload_img', imgUploadValidate, imgUpload);

// save chat route
router.post('/save_chat', saveChtValidate, saveChat);

// save chat route
router.post('/prevoius_chats', prevoiusChatsValidate, prevoiusChats);


module.exports = router;
