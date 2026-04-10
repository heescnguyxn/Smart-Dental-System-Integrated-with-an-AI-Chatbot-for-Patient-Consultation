const express = require('express');
const router = express.Router();
const reviewCtrl = require('../Controller/ReviewController');
const auth = require('../middleware/auth');

router.post('/', auth, reviewCtrl.createReview);
router.get('/doctor/:doctorId', reviewCtrl.getReviewsByDoctor);

module.exports = router;

