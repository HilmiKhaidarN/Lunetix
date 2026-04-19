// ══════════════════════════════════════════════
// PAYMENT ROUTES
// ══════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createCheckoutSession,
  handleWebhook,
  getSubscription,
  cancelSubscription,
  reactivateSubscription
} = require('../controllers/paymentController');

// Webhook endpoint (no auth required, Stripe will send raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-checkout-session', requireAuth, createCheckoutSession);
router.get('/subscription', requireAuth, getSubscription);
router.post('/cancel-subscription', requireAuth, cancelSubscription);
router.post('/reactivate-subscription', requireAuth, reactivateSubscription);

module.exports = router;