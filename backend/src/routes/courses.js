const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { requireAuth } = require('../middleware/auth');

router.get('/',           coursesController.getAllCourses);
router.get('/:id',        coursesController.getCourseById);
router.post('/:id/claim', requireAuth, coursesController.claimCourse);
router.get('/access/me',  requireAuth, coursesController.getMyCourses);

module.exports = router;
