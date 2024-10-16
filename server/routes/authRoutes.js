const express = require('express');
const { registerUser, loginUser, getUserProfile, getProviderProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.get('/providerProfile', getProviderProfile);

module.exports = router;
