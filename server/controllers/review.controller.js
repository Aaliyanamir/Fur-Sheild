const Review = require('../models/Review');

const getReviews = async (req, res) => {
  try {
    const { targetId } = req.params;
    const reviews = await Review.find({ targetId }).populate('user', 'name avatarUrl').sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { targetId, targetModel, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, targetId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this entity.' });
    }

    const review = await Review.create({
      user: req.user._id,
      targetId,
      targetModel,
      rating,
      comment
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, addReview };
