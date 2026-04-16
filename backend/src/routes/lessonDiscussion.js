const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/lessonDiscussionController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET  /api/lesson-discussion/:courseId/:lessonId
router.get('/:courseId/:lessonId',              optionalAuth, ctrl.getDiscussions);

// POST /api/lesson-discussion/:courseId/:lessonId
router.post('/:courseId/:lessonId',             requireAuth,  ctrl.createComment);

// POST /api/lesson-discussion/:courseId/:lessonId/:postId/like
router.post('/:courseId/:lessonId/:postId/like',requireAuth,  ctrl.toggleLike);

// DELETE /api/lesson-discussion/:courseId/:lessonId/:postId
router.delete('/:courseId/:lessonId/:postId',   requireAuth,  ctrl.deleteComment);

module.exports = router;
