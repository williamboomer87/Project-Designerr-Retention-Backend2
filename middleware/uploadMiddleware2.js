const multer = require('multer');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');


aws.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'us-east-1', // Set your desired AWS region
});

const s3 = new aws.S3();
const bucketName = 'designerimgbucket'; // Replace with your S3 bucket name

const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read', // Set the appropriate ACL for your use case
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        try {
            const { token } = req.body;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken.userId;

            const originalname = file.originalname;
            const extension = originalname.slice(originalname.lastIndexOf('.'));
            const customFileName = 'user_' + userId + extension;
            cb(null, customFileName);
        } catch (error) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        try {
            const { token } = req.body;

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken.userId;

            cb(null, true);
        } catch (error) {
            cb(null, false);
        }
    }
});

const uploadMiddleware2 = upload.single('image');

module.exports = uploadMiddleware2;
