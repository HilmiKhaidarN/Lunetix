// ══ UPGRADE & CHECKOUT LOGIC ══

const upgradePrices = {
  monthly: { pro: 99000,  team: 299000 },
  yearly:  { pro: 59000,  team: 179000 },  // per bulan, dibayar tahunan
};
const promoCodes = {
  'LUNETIX20': 20,
  'BELAJAR50': 50,
  'NEWUSER':   30,
};

let upgradePeriod = 'monthly';
let checkoutPlan  = 'pro';
let selectedMethod = '';
let appliedDiscount = 0;

function showUpgradeModal() {
  const m = document.getElementById('upgrade-modal');
  if (m) { m.style.display = 'flex'; lucide.createIcons(); }
}
function closeUpgradeModal() {
  const m = document.getElementById('upgrade-modal');
  if (m) m.style.display = 'none';
}

function setUpgradePeriod(period) {
  upgradePeriod = period;
  document.querySelectorAll('.upgrade-period-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + period)?.classList.add('active');

  const prices = upgradePrices[period];
  const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
  const suffix = period === 'yearly' ? '/bulan (bayar tahunan)' : '/bulan';

  const proEl = document.getElementById('pro-price');
  const teamEl = document.getElementById('team-price');
  if (proEl)  proEl.innerHTML  = `${fmt(prices.pro)}<span>${suffix}</span>`;
  if (teamEl) teamEl.innerHTML = `${fmt(prices.team)}<span>${suffix}</span>`;
}

function startCheckout(plan) {
  checkoutPlan = plan;
  appliedDiscount = 0;
  selectedMethod = '';

  const prices = upgradePrices[upgradePeriod];
  const price = prices[plan];
  const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
  const planLabel = plan === 'pro' ? 'Pro' : 'Team';
  const periodLabel = upgradePeriod === 'monthly' ? 'Monthly' : 'Yearly';

  // Pre-fill email
  const session = getSession();
  const emailEl = document.getElementById('co-email');
  const nameEl  = document.getElementById('co-name');
  if (emailEl && session) emailEl.value = session.email || '';
  if (nameEl  && session) nameEl.value  = session.name  || '';

  // Set labels
  const titleEl    = document.getElementById('checkout-title');
  const subtitleEl = document.getElementById('checkout-subtitle');
  const planLabelEl = document.getElementById('co-plan-label');
  const planPriceEl = document.getElementById('co-plan-price');
  const totalEl    = document.getElementById('co-total');
  if (titleEl)     titleEl.textContent    = `Upgrade to ${planLabel}`;
  if (subtitleEl)  subtitleEl.textContent = `${fmt(price)} / bulan`;
  if (planLabelEl) planLabelEl.textContent = `${planLabel} Plan (${periodLabel})`;
  if (planPriceEl) planPriceEl.textContent = fmt(price);
  if (totalEl)     totalEl.textContent    = fmt(price);

  // Reset promo
  const promoInput = document.getElementById('co-promo');
  const promoMsg   = document.getElementById('co-promo-msg');
  const discRow    = document.getElementById('co-discount-row');
  if (promoInput) promoInput.value = '';
  if (promoMsg)   promoMsg.textContent = '';
  if (discRow)    discRow.style.display = 'none';

  // Render payment methods
  renderPaymentMethods();

  closeUpgradeModal();
  const cm = document.getElementById('checkout-modal');
  if (cm) { cm.style.display = 'flex'; lucide.createIcons(); }
}

function closeCheckoutModal() {
  const m = document.getElementById('checkout-modal');
  if (m) m.style.display = 'none';
}

function renderPaymentMethods() {
  const el = document.getElementById('co-methods'); if (!el) return;
  const methods = [
    { id:'card',     label:'💳 Kartu Kredit/Debit' },
    { id:'gopay',    label:'📱 GoPay' },
    { id:'ovo',      label:'📱 OVO' },
    { id:'dana',     label:'📱 DANA' },
    { id:'transfer', label:'🏦 Transfer Bank' },
    { id:'qris',     label:'📷 QRIS' },
  ];
  el.innerHTML = methods.map(m => `
    <button class="co-method-btn ${selectedMethod===m.id?'active':''}" onclick="selectMethod('${m.id}')">
      ${m.label}
    </button>`).join('');
}

function selectMethod(id) {
  selectedMethod = id;
  renderPaymentMethods();
}

function applyPromo() {
  const code  = document.getElementById('co-promo')?.value.trim().toUpperCase();
  const msg   = document.getElementById('co-promo-msg');
  const discRow = document.getElementById('co-discount-row');
  const discVal = document.getElementById('co-discount-val');
  const totalEl = document.getElementById('co-total');
  if (!code) return;

  const pct = promoCodes[code];
  if (!pct) {
    if (msg) { msg.textContent = '❌ Kode promo tidak valid.'; msg.style.color = 'var(--danger)'; }
    return;
  }

  const price = upgradePrices[upgradePeriod][checkoutPlan];
  appliedDiscount = Math.round(price * pct / 100);
  const total = price - appliedDiscount;
  const fmt = n => 'Rp ' + n.toLocaleString('id-ID');

  if (msg)     { msg.textContent = `✓ Diskon ${pct}% berhasil diterapkan!`; msg.style.color = 'var(--success)'; }
  if (discRow) { discRow.style.display = 'flex'; }
  if (discVal) discVal.textContent = '-' + fmt(appliedDiscount);
  if (totalEl) totalEl.textContent = fmt(total);
}

function processPayment() {
  const name  = document.getElementById('co-name')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();

  if (!name)  { showToast('Nama lengkap wajib diisi.'); return; }
  if (!email) { showToast('Email wajib diisi.'); return; }
  if (!selectedMethod) { showToast('Pilih metode pembayaran dulu.'); return; }

  const price = upgradePrices[upgradePeriod][checkoutPlan];
  const total = price - appliedDiscount;
  const fmt   = n => 'Rp ' + n.toLocaleString('id-ID');
  const methodLabels = { card:'Kartu Kredit', gopay:'GoPay', ovo:'OVO', dana:'DANA', transfer:'Transfer Bank', qris:'QRIS' };

  closeCheckoutModal();

  // Simulate processing
  showToast('Memproses pembayaran...');
  setTimeout(() => {
    showPaymentSuccess(name, fmt(total), methodLabels[selectedMethod] || selectedMethod);
  }, 1500);
}

function showPaymentSuccess(name, amount, method) {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Pembayaran Berhasil - Lunetix</title>
  <style>
    body{font-family:'Inter',sans-serif;background:#0a0a1a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
    .box{background:linear-gradient(135deg,#0f0f2a,#1a1a3e);border:1px solid rgba(124,58,237,0.4);border-radius:20px;padding:48px 40px;text-align:center;max-width:480px;width:100%}
    .icon{font-size:64px;margin-bottom:16px}
    h1{font-size:24px;font-weight:800;margin-bottom:8px;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    p{color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin-bottom:6px}
    .detail{background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin:20px 0;text-align:left}
    .detail-row{display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px}
    .detail-row:last-child{margin-bottom:0;font-weight:700;color:#a78bfa}
    .btn{display:inline-block;background:linear-gradient(135deg,#7c3aed,#9d5cf6);color:#fff;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:none;margin-top:8px;text-decoration:none}
    .btn:hover{opacity:0.9}
  </style></head><body>
  <div class="box">
    <div class="icon">🎉</div>
    <h1>Pembayaran Berhasil!</h1>
    <p>Selamat ${name}! Akun kamu telah diupgrade ke <strong style="color:#a78bfa">Pro Plan</strong>.</p>
    <p>Semua fitur premium sekarang aktif.</p>
    <div class="detail">
      <div class="detail-row"><span>Nama</span><span>${name}</span></div>
      <div class="detail-row"><span>Metode</span><span>${method}</span></div>
      <div class="detail-row"><span>Total Dibayar</span><span>${amount}</span></div>
      <div class="detail-row"><span>Status</span><span style="color:#34d399">✓ Berhasil</span></div>
    </div>
    <button class="btn" onclick="window.close()">Kembali ke Lunetix</button>
    <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:16px">Invoice akan dikirim ke email kamu · lunetix.ai</div>
  </div>
  </body></html>`);
  w.document.close();
  showToast('🎉 Upgrade berhasil! Selamat datang di Pro!');
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  const upgradeModal  = document.getElementById('upgrade-modal');
  const checkoutModal = document.getElementById('checkout-modal');
  if (e.target === upgradeModal)  closeUpgradeModal();
  if (e.target === checkoutModal) closeCheckoutModal();
});
