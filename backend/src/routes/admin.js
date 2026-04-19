// ══════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  requireAdmin,
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAnalytics
} = require('../controllers/adminController');

// All routes require authentication and admin access
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;