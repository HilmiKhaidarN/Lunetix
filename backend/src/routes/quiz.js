const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middleware/auth');

router.get('/:quizId/status',  requireAuth, quizController.getQuizStatus);
router.post('/:quizId/attempt',requireAuth, quizController.recordAttempt);

module.exports = router;
