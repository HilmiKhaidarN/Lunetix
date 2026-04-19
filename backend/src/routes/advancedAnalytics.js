// ══════════════════════════════════════════════
// ADVANCED ANALYTICS ROUTES
// ══════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getAdvancedAnalytics } = require('../controllers/advancedAnalyticsController');

// All routes require authentication
router.use(requireAuth);

// GET /api/analytics/advanced
router.get('/advanced', getAdvancedAnalytics);

module.exports = router;