const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe, updateMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatar'), updateMe);

module.exports = router;

