const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');

router.post('/register',        authController.register);
router.post('/login',           authController.login);
router.post('/refresh',         authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me',               authController.getMe);
router.put('/profile',          authController.updateProfile);
router.put('/password',         authController.changePassword);

module.exports = router;
