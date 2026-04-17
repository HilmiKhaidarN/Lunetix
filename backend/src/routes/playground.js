const express = require('express');
const router  = express.Router();
const playgroundController = require('../controllers/playgroundController');
const { requireAuth } = require('../middleware/auth');

// POST /api/playground/chat
router.post('/chat', requireAuth, playgroundController.chat);

module.exports = router;
