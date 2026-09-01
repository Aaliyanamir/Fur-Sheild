const express = require('express');
const router = express.Router();
const {
  getApprovedArticles,
  getAllArticles,
  createArticle,
  updateArticleStatus,
  deleteArticle
} = require('../controllers/article.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public route to view approved articles
router.get('/', getApprovedArticles);

// Protected routes
router.post('/', protect, createArticle);
router.get('/admin', protect, authorize('SUPER_ADMIN', 'SYSTEM_ADMIN'), getAllArticles);
router.patch('/:id/status', protect, authorize('SUPER_ADMIN', 'SYSTEM_ADMIN'), updateArticleStatus);
router.delete('/:id', protect, deleteArticle);

module.exports = router;
