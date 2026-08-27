const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');

router.use(protect); // All routes require authentication

router.route('/')
  .get(getUserNotifications);

router.route('/mark-all-read')
  .put(markAllAsRead);

router.route('/:id/read')
  .patch(markAsRead);

module.exports = router;
