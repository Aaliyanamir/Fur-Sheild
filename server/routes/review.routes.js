const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/:targetId', getReviews);
router.post('/', protect, addReview);

module.exports = router;
