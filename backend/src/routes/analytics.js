const express = require('express');
const router  = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

// GET /api/analytics/summary
router.get('/summary', requireAuth, analyticsController.getSummary);

module.exports = router;
