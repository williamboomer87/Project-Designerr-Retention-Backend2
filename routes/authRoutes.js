const express = require('express');
const router = express.Router();
const { signUp, signIn, getProfile, updateProfile, updateProfileImg, updateProfileNotifications } = require('../controllers/authController');
const { body } = require('express-validator');
const { validateSignUp } = require('../validations/signupValidate'); 
const { validateSignIn } = require('../validations/signinValidate');
const { validateProfile } = require('../validations/validateProfile');
const { validateProfileUpdate } = require('../validations/validateProfileUpdate');
const { updateProfileImgValidate } = require('../validations/updateProfileImgValidate');
const { validateProfileNotifications } = require('../validations/validateProfileNotifications');
const uploadMiddleware = require('../middleware/uploadMiddleware'); 
const multer = require('multer');


// Sign-up route
router.post('/signup', validateSignUp, signUp);

// Sign-in route
router.post('/login', validateSignIn, signIn);

// Get profile route
router.post('/profile', validateProfile, getProfile);

// Update profile route
router.put('/update_profile', validateProfileUpdate, updateProfile);

// Update profile img

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/update_profile_img', upload.single('image'), updateProfileImgValidate, updateProfileImg);

// Get profile route
router.post('/update_profile_notifications', validateProfileNotifications, updateProfileNotifications);

module.exports = router;
