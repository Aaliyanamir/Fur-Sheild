const express = require('express');
const router = express.Router();
const { getAdoptableAnimals, submitPublicAdoptionRequest, adoptPetDirect } = require('../controllers/adopt.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route to view adoptable animals
router.get('/', getAdoptableAnimals);

// Protected routes
router.post('/request', protect, submitPublicAdoptionRequest);
router.post('/:petId/adopt', protect, adoptPetDirect);

module.exports = router;

