const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getAdoptableAnimals, 
  listUserPetForAdoption, 
  getMyAdoptionListings, 
  updateMyListingStatus, 
  deleteMyListing, 
  submitPublicAdoptionRequest, 
  adoptPetDirect 
} = require('../controllers/adopt.controller');
const { protect } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `adoption-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Public route to view adoptable & adopted animals
router.get('/', getAdoptableAnimals);

// Protected routes
router.post('/list-pet', protect, upload.single('avatar'), listUserPetForAdoption);
router.get('/my-listings', protect, getMyAdoptionListings);
router.patch('/my-listings/:id/status', protect, updateMyListingStatus);
router.delete('/my-listings/:id', protect, deleteMyListing);
router.post('/request', protect, submitPublicAdoptionRequest);
router.post('/:petId/adopt', protect, adoptPetDirect);

module.exports = router;

