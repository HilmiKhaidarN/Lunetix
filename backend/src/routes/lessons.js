const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');
const { requireAuth } = require('../middleware/auth');

router.get('/:courseId/progress',       requireAuth, lessonsController.getProgress);
router.post('/:courseId/:lessonId/complete', requireAuth, lessonsController.completeLesson);

module.exports = router;
