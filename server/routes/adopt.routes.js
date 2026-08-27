const express = require('express');
const router = express.Router();
const { getAdoptableAnimals, submitPublicAdoptionRequest } = require('../controllers/adopt.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route to view adoptable animals
router.get('/', getAdoptableAnimals);

// Protected route to submit request (so we can link userId)
router.post('/request', protect, submitPublicAdoptionRequest);

module.exports = router;
