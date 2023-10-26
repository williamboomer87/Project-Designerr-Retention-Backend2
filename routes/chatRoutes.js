const express = require('express');
const router = express.Router();
const { imgUpload, saveChat, prevoiusChats, getPromptImg, getChat } = require('../controllers/chatController');
const { imgUploadValidate } = require('../validations/imgUploadValidate'); 
const { saveChtValidate } = require('../validations/saveChtValidate'); 
const { prevoiusChatsValidate } = require('../validations/prevoiusChatsValidate'); 
const { getPromptImgValidate } = require('../validations/getPromptImgValidate');
const { getChtValidate } = require('../validations/getChtValidate');



// image upload route
router.post('/upload_img', imgUploadValidate, imgUpload);

// save chat route
router.post('/save_chat', saveChtValidate, saveChat);

// save chat route (Get chat by chat key)
router.post('/get_chat', getChtValidate, getChat);

// Get chats  for a user (Get user_id from token)
router.post('/prevoius_chats', prevoiusChatsValidate, prevoiusChats);

router.post('/get_prompt_img', getPromptImgValidate, getPromptImg);

module.exports = router;
