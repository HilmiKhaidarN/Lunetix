// ══════════════════════════════════════════════
// VIDEO LESSONS ROUTES
// ══════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getVideoLessons,
  updateVideoProgress,
  getVideoStats
} = require('../controllers/videoLessonsController');

// All routes require authentication
router.use(requireAuth);

// GET /api/video-lessons/:courseId
router.get('/:courseId', getVideoLessons);

// POST /api/video-lessons/:courseId/:lessonId/progress
router.post('/:courseId/:lessonId/progress', updateVideoProgress);

// GET /api/video-lessons/:courseId/stats
router.get('/:courseId/stats', getVideoStats);

module.exports = router;