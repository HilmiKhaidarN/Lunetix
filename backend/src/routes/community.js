const express = require('express');
const router  = express.Router();
const communityController = require('../controllers/communityController');
const { requireAuth } = require('../middleware/auth');

router.get('/stats',          communityController.getStats);           // public
router.get('/posts',          communityController.getPosts);           // public
router.post('/posts',         requireAuth, communityController.createPost);
router.post('/posts/:id/like',requireAuth, communityController.toggleLike);
router.delete('/posts/:id',   requireAuth, communityController.deletePost);

module.exports = router;
