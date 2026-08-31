const express = require('express');
const router = express.Router();
const { sendChat } = require('../controllers/chat.controller');

router.post('/', sendChat);

module.exports = router;
