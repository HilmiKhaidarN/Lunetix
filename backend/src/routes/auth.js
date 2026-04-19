const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Public routes
router.post('/register',        authController.register);
router.post('/login',           authController.login);
router.post('/refresh',         authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes — requireAuth injects req.user
router.get('/me',      requireAuth, authController.getMe);
router.put('/profile', requireAuth, authController.updateProfile);
router.put('/password',requireAuth, authController.changePassword);

module.exports = router;
