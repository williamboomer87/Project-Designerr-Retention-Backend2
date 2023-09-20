const multer = require('multer');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
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

const uploadMiddleware = upload.single('image');

module.exports = uploadMiddleware;
