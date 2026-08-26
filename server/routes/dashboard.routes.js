const express = require('express');
const router = express.Router();
const { getMyPets, addPet, updateVitals, updatePet, deletePet, getVets, bookAppointment, getMyAppointments, addVaccine, addDocument } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');
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

// Apply protection to ALL routes in this file
router.use(protect);

router.route('/pets')
  .get(getMyPets)
  .post(upload.single('avatar'), addPet);

router.patch('/pets/:id/vitals', updateVitals);
router.route('/pets/:id').put(upload.single('avatar'), updatePet).delete(deletePet);

router.post('/pets/:id/vaccinations', addVaccine);
router.post('/pets/:id/documents', upload.single('document'), addDocument);



router.get('/vets', getVets);
router.route('/appointments')
  .get(getMyAppointments)
  .post(bookAppointment);

module.exports = router;



