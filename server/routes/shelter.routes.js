const express = require('express');
const router = express.Router();
const { getPipeline, updateAnimalStatus, addIntake, updateAnimal, deleteAnimal, addDailyLog, submitAdoptionRequest, getAdoptionRequests, updateAdoptionRequestStatus } = require('../controllers/shelter.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `shelter-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Apply protection and RBAC to ALL routes in this file
router.use(protect);
router.use(authorize('SHELTER_ADMIN'));

router.get('/pipeline', getPipeline);
router.patch('/pipeline/:id/status', updateAnimalStatus);
router.patch('/pipeline/:id', upload.single('avatar'), updateAnimal);
router.delete('/pipeline/:id', deleteAnimal);
router.post('/intake', upload.single('avatar'), addIntake);


router.route('/pipeline/:id/logs').post(addDailyLog);
router.route('/adoption-requests').post(submitAdoptionRequest).get(getAdoptionRequests);
router.route('/adoption-requests/:id/status').patch(updateAdoptionRequestStatus);

module.exports = router;
