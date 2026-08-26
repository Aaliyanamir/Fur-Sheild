const express = require('express');
const router = express.Router();
const { getMyPets, addPet, updateVitals } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

// Apply protection to ALL routes in this file
router.use(protect);

router.route('/pets')
  .get(getMyPets)
  .post(addPet);

router.patch('/pets/:id/vitals', updateVitals);

module.exports = router;
