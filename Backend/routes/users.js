const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');
const auth = require('../middleware/auth');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
