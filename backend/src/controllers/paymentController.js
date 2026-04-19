// ══════════════════════════════════════════════
// PAYMENT CONTROLLER — Stripe Integration
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    amount: 99000, // Rp 99K
    currency: 'idr',
    interval: 'month',
    name: 'Pro Monthly'
  },
  pro_yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    amount: 594000, // Rp 594K (40% discount)
    currency: 'idr',
    interval: 'year',
    name: 'Pro Yearly'
  },
  team_monthly: {
    priceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
    amount: 299000, // Rp 299K
    currency: 'idr',
    interval: 'month',
    name: 'Team Monthly'
  }
};

// POST /api/payment/create-checkout-session
async function createCheckoutSession(req, res) {
  const { planId, successUrl, cancelUrl } = req.body;
  const userId = req.user.id;

  if (!planId || !PLANS[planId]) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    // Get user profile
    const { data: user } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const plan = PLANS[planId];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: plan.priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: user.email,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
        userName: user.name
      },
      success_url: successUrl || `${process.env.SITE_URL}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.SITE_URL}/dashboard?payment=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        metadata: {
          userId,
          planId
        }
      }
    });

    // Save checkout session to database
    await supabase.from('payment_sessions').insert({
      user_id: userId,
      session_id: session.id,
      plan_id: planId,
      amount: plan.amount,
      currency: plan.currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    return res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('[Payment] Checkout session error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}

// POST /api/payment/webhook
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('[Payment] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      
      default:
        console.log(`[Payment] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Payment] Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session) {
  const userId = session.client_reference_id;
  const planId = session.metadata.planId;
  const subscriptionId = session.subscription;

  // Update user to pro account
  await supabase
    .from('users')
    .update({
      account_type: planId.startsWith('team') ? 'team' : 'pro',
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscriptionId,
      subscription_status: 'active',
      subscription_plan: planId,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  // Update payment session status
  await supabase
    .from('payment_sessions')
    .update({
      status: 'completed',
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscriptionId,
      completed_at: new Date().toISOString()
    })
    .eq('session_id', session.id);

  // Create payment record
  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_intent_id: session.payment_intent,
    stripe_subscription_id: subscriptionId,
    amount: session.amount_total,
    currency: session.currency,
    status: 'succeeded',
    plan_id: planId,
    created_at: new Date().toISOString()
  });

  // Add welcome notification
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'upgrade',
    title: 'Welcome to Pro!',
    message: `Selamat! Akun kamu sudah upgrade ke ${PLANS[planId].name}. Nikmati semua fitur premium!`,
    icon: 'zap',
    icon_bg: 'rgba(245,158,11,0.15)',
    icon_color: '#fbbf24',
    created_at: new Date().toISOString()
  });

  console.log(`[Payment] User ${userId} upgraded to ${planId}`);
}

async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId;
  const planId = subscription.metadata.planId;

  if (!userId) return;

  // Record payment
  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_intent_id: invoice.payment_intent,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    plan_id: planId,
    created_at: new Date().toISOString()
  });

  // Ensure user account is still active
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  console.log(`[Payment] Recurring payment succeeded for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
}

async function handleSubscriptionCancelled(subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      account_type: 'free',
      subscription_status: 'cancelled',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  // Add notification
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'subscription',
    title: 'Subscription Cancelled',
    message: 'Langganan Pro kamu telah dibatalkan. Kamu masih bisa akses fitur Pro sampai akhir periode billing.',
    icon: 'alert-circle',
    icon_bg: 'rgba(239,68,68,0.15)',
    icon_color: '#f87171',
    created_at: new Date().toISOString()
  });

  console.log(`[Payment] Subscription cancelled for user ${userId}`);
}

// GET /api/payment/subscription
async function getSubscription(req, res) {
  const userId = req.user.id;

  try {
    const { data: user } = await supabase
      .from('users')
      .select('account_type, subscription_status, subscription_plan, stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let subscription = null;
    if (user.stripe_subscription_id) {
      try {
        subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
      } catch (err) {
        console.warn('[Payment] Failed to fetch Stripe subscription:', err.message);
      }
    }

    // Get payment history
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    return res.json({
      accountType: user.account_type,
      subscriptionStatus: user.subscription_status,
      subscriptionPlan: user.subscription_plan,
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      } : null,
      payments: payments || []
    });

  } catch (error) {
    console.error('[Payment] Get subscription error:', error);
    return res.status(500).json({ error: 'Failed to get subscription info.' });
  }
}

// POST /api/payment/cancel-subscription
async function cancelSubscription(req, res) {
  const userId = req.user.id;

  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription found.' });
    }

    // Cancel at period end (don't cancel immediately)
    const subscription = await stripe.subscriptions.update(
      user.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    return res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current billing period.',
      cancelAt: new Date(subscription.current_period_end * 1000)
    });

  } catch (error) {
    console.error('[Payment] Cancel subscription error:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
}

// POST /api/payment/reactivate-subscription
async function reactivateSubscription(req, res) {
  const userId = req.user.id;

  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_subscription_id) {
      return res.status(404).json({ error: 'No subscription found.' });
    }

    // Remove cancel_at_period_end
    await stripe.subscriptions.update(
      user.stripe_subscription_id,
      { cancel_at_period_end: false }
    );

    return res.json({
      success: true,
      message: 'Subscription reactivated successfully.'
    });

  } catch (error) {
    console.error('[Payment] Reactivate subscription error:', error);
    return res.status(500).json({ error: 'Failed to reactivate subscription.' });
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getSubscription,
  cancelSubscription,
  reactivateSubscription
};