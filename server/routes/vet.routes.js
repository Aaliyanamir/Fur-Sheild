const express = require('express');
const router = express.Router();
const { getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment } = require('../controllers/vet.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Apply protection and RBAC to ALL routes in this file
router.use(protect);
router.use(authorize('VET'));

router.get('/queue', getQueue);
router.patch('/queue/:id/status', updateAppointmentStatus);
router.patch('/queue/:id/vitals', updateVitalsAndNotes);
router.post('/queue', createAppointment);
router.delete('/queue/:id', deleteAppointment);

module.exports = router;
