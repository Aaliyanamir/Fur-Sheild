const express = require('express');
const router = express.Router();
const { getPipeline, updateAnimalStatus, addIntake } = require('../controllers/shelter.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Apply protection and RBAC to ALL routes in this file
router.use(protect);
router.use(authorize('SHELTER_ADMIN'));

router.get('/pipeline', getPipeline);
router.patch('/pipeline/:id/status', updateAnimalStatus);
router.post('/intake', addIntake);

module.exports = router;
