const express = require('express');
const router = express.Router();
const moduleQuizController = require('../controllers/moduleQuizController');
const { requireAuth } = require('../middleware/auth');

// GET  /api/module-quiz/:courseId/status
router.get('/:courseId/status', requireAuth, moduleQuizController.getModuleQuizStatus);

// POST /api/module-quiz/:courseId/:moduleIndex/pass
router.post('/:courseId/:moduleIndex/pass', requireAuth, moduleQuizController.markModulePassed);

module.exports = router;
