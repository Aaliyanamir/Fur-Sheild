const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);

module.exports = router;
