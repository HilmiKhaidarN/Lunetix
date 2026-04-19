// ══════════════════════════════════════════════
// PAYMENT.JS — Stripe Integration & Upgrade Flow
// ══════════════════════════════════════════════

// Load Stripe
const stripe = Stripe(window.location.hostname === 'localhost' 
  ? 'pk_test_...' // Test key untuk development
  : 'pk_live_...' // Live key untuk production
);

let currentPlan = 'pro_monthly';
let currentPeriod = 'monthly';

// ── Upgrade Modal Logic ──
function showUpgradeModal() {
  const modal = document.getElementById('upgrade-modal');
  if (modal) {
    modal.style.display = 'flex';
    updateUpgradePricing();
  }
}

function closeUpgradeModal() {
  const modal = document.getElementById('upgrade-modal');
  if (modal) modal.style.display = 'none';
}

function setUpgradePeriod(period) {
  currentPeriod = period;
  document.querySelectorAll('.upgrade-period-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${period}`).classList.add('active');
  updateUpgradePricing();
}

function updateUpgradePricing() {
  const proPrice = document.getElementById('pro-price');
  const teamPrice = document.getElementById('team-price');
  
  if (currentPeriod === 'monthly') {
    if (proPrice) proPrice.innerHTML = 'Rp 99K<span>/bulan</span>';
    if (teamPrice) teamPrice.innerHTML = 'Rp 299K<span>/bulan</span>';
  } else {
    if (proPrice) proPrice.innerHTML = 'Rp 594K<span>/tahun</span>';
    if (teamPrice) teamPrice.innerHTML = 'Rp 1.8M<span>/tahun</span>';
  }
}

function startCheckout(planType) {
  const planId = planType === 'pro' 
    ? (currentPeriod === 'monthly' ? 'pro_monthly' : 'pro_yearly')
    : (currentPeriod === 'monthly' ? 'team_monthly' : 'team_yearly');
  
  currentPlan = planId;
  showCheckoutModal(planType);
}

// ── Checkout Modal ──
function showCheckoutModal(planType) {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;
  
  const title = document.getElementById('checkout-title');
  const subtitle = document.getElementById('checkout-subtitle');
  const planLabel = document.getElementById('co-plan-label');
  const planPrice = document.getElementById('co-plan-price');
  const total = document.getElementById('co-total');
  
  const plans = {
    pro_monthly: { name: 'Pro Plan (Monthly)', price: 'Rp 99.000' },
    pro_yearly: { name: 'Pro Plan (Yearly)', price: 'Rp 594.000' },
    team_monthly: { name: 'Team Plan (Monthly)', price: 'Rp 299.000' },
    team_yearly: { name: 'Team Plan (Yearly)', price: 'Rp 1.800.000' }
  };
  
  const plan = plans[currentPlan];
  if (title) title.textContent = `Upgrade to ${planType === 'pro' ? 'Pro' : 'Team'}`;
  if (subtitle) subtitle.textContent = `${plan.price} / ${currentPeriod === 'monthly' ? 'bulan' : 'tahun'}`;
  if (planLabel) planLabel.textContent = plan.name;
  if (planPrice) planPrice.textContent = plan.price;
  if (total) total.textContent = plan.price;
  
  // Populate user email
  const session = getSession();
  const emailInput = document.getElementById('co-email');
  const nameInput = document.getElementById('co-name');
  if (emailInput && session) emailInput.value = session.email || '';
  if (nameInput && session) nameInput.value = session.name || '';
  
  // Render payment methods
  renderPaymentMethods();
  
  modal.style.display = 'flex';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.style.display = 'none';
}

function renderPaymentMethods() {
  const container = document.getElementById('co-methods');
  if (!container) return;
  
  const methods = [
    { id: 'card', name: 'Kartu Kredit', icon: '💳' },
    { id: 'bank', name: 'Transfer Bank', icon: '🏦' }
  ];
  
  container.innerHTML = methods.map(m => `
    <div class="co-method ${m.id === 'card' ? 'active' : ''}" onclick="selectPaymentMethod('${m.id}')">
      <span>${m.icon}</span>
      <span style="font-size:11px">${m.name}</span>
    </div>
  `).join('');
}

function selectPaymentMethod(methodId) {
  document.querySelectorAll('.co-method').forEach(m => m.classList.remove('active'));
  document.querySelector(`.co-method[onclick*="${methodId}"]`).classList.add('active');
}

// ── Promo Code ──
const PROMO_CODES = {
  'LAUNCH50': { discount: 50, type: 'percent', description: '50% off first month' },
  'STUDENT20': { discount: 20, type: 'percent', description: '20% off for students' },
  'EARLY30': { discount: 30, type: 'percent', description: '30% early bird discount' }
};

function applyPromo() {
  const input = document.getElementById('co-promo');
  const msg = document.getElementById('co-promo-msg');
  const discountRow = document.getElementById('co-discount-row');
  const discountVal = document.getElementById('co-discount-val');
  const total = document.getElementById('co-total');
  const planPrice = document.getElementById('co-plan-price');
  
  if (!input || !msg) return;
  
  const code = input.value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  
  if (!promo) {
    msg.textContent = 'Kode promo tidak valid.';
    msg.style.color = 'var(--danger)';
    discountRow.style.display = 'none';
    total.textContent = planPrice.textContent;
    return;
  }
  
  msg.textContent = `✅ ${promo.description}`;
  msg.style.color = 'var(--success)';
  
  // Calculate discount
  const originalAmount = parseInt(planPrice.textContent.replace(/[^\d]/g, ''));
  const discountAmount = Math.round(originalAmount * promo.discount / 100);
  const finalAmount = originalAmount - discountAmount;
  
  discountVal.textContent = `-Rp ${discountAmount.toLocaleString()}`;
  total.textContent = `Rp ${finalAmount.toLocaleString()}`;
  discountRow.style.display = 'flex';
}

// ── Process Payment ──
async function processPayment() {
  const session = getSession();
  if (!session) {
    showToast('Silakan login terlebih dahulu.');
    return;
  }
  
  const name = document.getElementById('co-name')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();
  
  if (!name || !email) {
    showToast('Nama dan email wajib diisi.');
    return;
  }
  
  try {
    showToast('Membuat checkout session...');
    
    const { sessionId, url } = await PaymentAPI.createCheckoutSession(
      currentPlan,
      `${window.location.origin}/dashboard?payment=success`,
      `${window.location.origin}/dashboard?payment=cancelled`
    );
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
  } catch (error) {
    console.error('[Payment] Checkout error:', error);
    showToast('Gagal memproses pembayaran. Coba lagi.');
  }
}

// ── Subscription Management ──
async function loadSubscriptionInfo() {
  const session = getSession();
  if (!session) return;
  
  try {
    const data = await PaymentAPI.getSubscription();
    updateSubscriptionUI(data);
  } catch (error) {
    console.warn('[Payment] Failed to load subscription:', error);
  }
}

function updateSubscriptionUI(data) {
  // Update account type badge
  document.querySelectorAll('.badge').forEach(badge => {
    if (badge.textContent.includes('Free Plan')) {
      badge.textContent = data.accountType === 'pro' ? 'Pro Plan' : 
                         data.accountType === 'team' ? 'Team Plan' : 'Free Plan';
      badge.className = `badge ${data.accountType === 'free' ? 'badge-purple' : 'badge-gold'}`;
    }
  });
  
  // Update subscription status in settings
  const subStatus = document.getElementById('subscription-status');
  if (subStatus && data.subscription) {
    const sub = data.subscription;
    subStatus.innerHTML = `
      <div class="setting-item">
        <div class="setting-label">
          <span>Subscription Status</span>
          <span class="badge ${sub.status === 'active' ? 'badge-green' : 'badge-yellow'}">${sub.status}</span>
        </div>
        <div class="setting-desc">
          ${sub.status === 'active' 
            ? `Active until ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
            : 'Subscription inactive'
          }
        </div>
        ${sub.cancelAtPeriodEnd 
          ? '<div class="setting-desc" style="color:var(--warning)">Will cancel at period end</div>'
          : ''
        }
      </div>
    `;
  }
}

// ── Cancel/Reactivate Subscription ──
async function cancelSubscription() {
  if (!confirm('Yakin ingin membatalkan langganan? Kamu masih bisa akses fitur Pro sampai akhir periode billing.')) {
    return;
  }
  
  try {
    const result = await PaymentAPI.cancelSubscription();
    showToast('Langganan berhasil dibatalkan.');
    loadSubscriptionInfo();
  } catch (error) {
    showToast('Gagal membatalkan langganan.');
  }
}

async function reactivateSubscription() {
  try {
    await PaymentAPI.reactivateSubscription();
    showToast('Langganan berhasil diaktifkan kembali!');
    loadSubscriptionInfo();
  } catch (error) {
    showToast('Gagal mengaktifkan langganan.');
  }
}

// ── Handle Payment Success/Cancel ──
function handlePaymentResult() {
  const urlParams = new URLSearchParams(window.location.search);
  const payment = urlParams.get('payment');
  
  if (payment === 'success') {
    showToast('🎉 Pembayaran berhasil! Selamat datang di Pro!');
    // Refresh user session
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else if (payment === 'cancelled') {
    showToast('Pembayaran dibatalkan. Kamu bisa coba lagi kapan saja.');
  }
  
  // Clean URL
  if (payment) {
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url);
  }
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  handlePaymentResult();
  loadSubscriptionInfo();
});

// ── Export functions for global access ──
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.setUpgradePeriod = setUpgradePeriod;
window.startCheckout = startCheckout;
window.closeCheckoutModal = closeCheckoutModal;
window.applyPromo = applyPromo;
window.processPayment = processPayment;
window.cancelSubscription = cancelSubscription;
window.reactivateSubscription = reactivateSubscription;