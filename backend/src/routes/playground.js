const express = require('express');
const router  = express.Router();
const playgroundController = require('../controllers/playgroundController');
const sessionsController   = require('../controllers/playgroundSessionsController');
const { requireAuth } = require('../middleware/auth');

// POST /api/playground/chat
router.post('/chat', requireAuth, playgroundController.chat);

// Sessions
router.get('/sessions',      requireAuth, sessionsController.getSessions);
router.post('/sessions',     requireAuth, sessionsController.createSession);
router.put('/sessions/:id',  requireAuth, sessionsController.updateSession);
router.delete('/sessions/:id', requireAuth, sessionsController.deleteSession);

module.exports = router;
