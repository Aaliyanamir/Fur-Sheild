const express = require('express');
const router = express.Router();
const { getQueue, updateAppointmentStatus, updateVitalsAndNotes, createAppointment, deleteAppointment, updateWalkin } = require('../controllers/vet.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Apply protection and RBAC to ALL routes in this file
router.use(protect);
router.use(authorize('VET'));

router.get('/queue', getQueue);
router.patch('/queue/:id/status', updateAppointmentStatus);
router.patch('/queue/:id/vitals', updateVitalsAndNotes);
router.patch('/queue/:id/walkin', upload.fields([{ name: 'petAvatar' }, { name: 'ownerAvatar' }]), updateWalkin);
router.post('/queue', upload.fields([{ name: 'petAvatar' }, { name: 'ownerAvatar' }]), createAppointment);
router.delete('/queue/:id', deleteAppointment);

module.exports = router;
