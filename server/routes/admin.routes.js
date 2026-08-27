const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All routes are protected and restricted to SUPER_ADMIN
router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.route('/stats').get(getDashboardStats);
router.route('/users').get(getAllUsers);
router.route('/users/:id/status').patch(updateUserStatus);

module.exports = router;
