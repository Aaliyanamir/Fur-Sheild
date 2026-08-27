const express = require('express');
const router = express.Router();
const { getVetAppointments, updateAppointment, getVerifiedVets, bookAppointment, getUserAppointments } = require('../controllers/vet.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public route to get Vets for booking
router.get('/list', getVerifiedVets);

// User routes
router.post('/appointments', protect, bookAppointment);
router.get('/appointments/me', protect, getUserAppointments);

// Vet specific routes
router.get('/appointments', protect, authorize('VET'), getVetAppointments);
router.put('/appointments/:id', protect, authorize('VET'), updateAppointment);

module.exports = router;
