// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SETTINGS.JS â€” All settings tab logic
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const ST_ACCENT_COLORS = [
  { color:'#7c3aed', name:'Purple' },
  { color:'#3b82f6', name:'Blue' },
  { color:'#10b981', name:'Green' },
  { color:'#f59e0b', name:'Amber' },
  { color:'#ef4444', name:'Red' },
  { color:'#ec4899', name:'Pink' },
  { color:'#06b6d4', name:'Cyan' },
  { color:'#8b5cf6', name:'Violet' },
];

const ST_NOTIF_EMAIL = [
  { key:'notif_course_update',  label:'Course Updates',      desc:'New lessons and course announcements', def:true },
  { key:'notif_quiz_result',    label:'Quiz Results',        desc:'When your quiz is graded',             def:true },
  { key:'notif_cert_earned',    label:'Certificate Earned',  desc:'When you complete a course',           def:true },
  { key:'notif_community',      label:'Community Replies',   desc:'When someone replies to your post',    def:false },
  { key:'notif_weekly_digest',  label:'Weekly Digest',       desc:'Summary of your weekly progress',      def:true },
  { key:'notif_promotions',     label:'Promotions & Offers', desc:'Special deals and new features',       def:false },
];

const ST_NOTIF_PUSH = [
  { key:'push_streak',     label:'Streak Reminder',  desc:'Daily reminder to keep your streak alive', def:true },
  { key:'push_deadline',   label:'Deadline Alerts',  desc:'Upcoming project and quiz deadlines',      def:true },
  { key:'push_new_course', label:'New Courses',      desc:'When new courses are published',           def:false },
];

const ST_TOPICS = ['Machine Learning','Deep Learning','NLP','Computer Vision','Data Science','Reinforcement Learning','AI Ethics','Python','TensorFlow','PyTorch'];
const ST_SPEEDS = ['0.75x','1x','1.25x','1.5x','2x'];

// â”€â”€ Main init â”€â”€
function initSettings() {
  const session = getSession();
  if (!session) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('settings-name-input', session.name);
  set('settings-email-input', session.email);

  const sidebarEmail = document.getElementById('st-sidebar-email');
  if (sidebarEmail) sidebarEmail.textContent = session.email || '';

  document.querySelectorAll('.user-name').forEach(el => el.textContent = session.name || 'User');
  document.querySelectorAll('.user-avatar').forEach(el => el.textContent = session.avatar || session.name?.charAt(0) || 'U');

  const prefs = store.get('prefs', {});
  stSetToggle('toggle-notif',      prefs.notif !== false);
  stSetToggle('toggle-reminder',   prefs.reminder !== false);
  stSetToggle('toggle-quiz',       prefs.quiz !== false);
  stSetToggle('toggle-community',  prefs.community || false);

  stRenderAccentColors('st-color-row');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// â”€â”€ Tab switcher â”€â”€
function switchSettingsTab(tab, btn) {
  document.querySelectorAll('.st-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.st-section').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  const section = document.getElementById('st-' + tab);
  if (section) {
    section.classList.add('active');
    if (tab === 'account')       stInitAccount();
    if (tab === 'notifications') stInitNotifications();
    if (tab === 'preferences')   stInitPreferences();
    if (tab === 'privacy')       stInitPrivacy();
    if (tab === 'billing')       stInitBilling();
    if (tab === 'appearance')    stInitAppearance();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// â”€â”€ Toggle helper â”€â”€
function stSetToggle(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.on = on ? 'true' : 'false';
}

function togglePref(key) {
  const prefs = store.get('prefs', {});
  prefs[key] = !prefs[key];
  store.set('prefs', prefs);
  stSetToggle('toggle-' + key, prefs[key]);
  showToast((prefs[key] ? 'Enabled' : 'Disabled') + ': ' + key.replace(/_/g,' '));
}

// â”€â”€ Save profile â”€â”€
function saveSettings() {
  const name = document.getElementById('settings-name-input')?.value.trim();
  if (!name) { showToast('Nama tidak boleh kosong.'); return; }
  const users = getUsers();
  const session = getSession();
  const user = users.find(u => u.email === session.email);
  if (user) {
    user.name = name;
    user.avatar = name.charAt(0).toUpperCase();
    saveUsers(users);
    setSession(user);
    document.querySelectorAll('.user-name').forEach(el => el.textContent = name);
    document.querySelectorAll('.user-avatar').forEach(el => el.textContent = user.avatar);
    showToast('Profil berhasil disimpan! âœ“');
  }
}

// â”€â”€ ACCOUNT TAB â”€â”€
function stInitAccount() {
  const session = getSession();
  if (!session) return;
  const users = getUsers();
  const user = users.find(u => u.email === session.email) || session;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('acc-name', user.name);
  set('acc-email', user.email);
  set('acc-username', (user.name || '').toLowerCase().replace(/\s+/g,'_'));
  set('acc-bio', user.bio || '');
  set('acc-website', user.website || '');
  set('acc-linkedin', user.linkedin || '');
  set('acc-github', user.github || '');
}

function saveAccountInfo() {
  const name     = document.getElementById('acc-name')?.value.trim();
  const bio      = document.getElementById('acc-bio')?.value.trim();
  const website  = document.getElementById('acc-website')?.value.trim();
  const linkedin = document.getElementById('acc-linkedin')?.value.trim();
  const github   = document.getElementById('acc-github')?.value.trim();
  if (!name) { showToast('Nama tidak boleh kosong.'); return; }
  const session = getSession();
  const users = getUsers();
  const user = users.find(u => u.email === session.email);
  if (user) {
    Object.assign(user, { name, bio, website, linkedin, github, avatar: name.charAt(0).toUpperCase() });
    saveUsers(users);
    setSession(user);
    document.querySelectorAll('.user-name').forEach(el => el.textContent = name);
    document.querySelectorAll('.user-avatar').forEach(el => el.textContent = user.avatar);
  }
  showToast('Account info saved! âœ“');
}

// â”€â”€ NOTIFICATIONS TAB â”€â”€
function stInitNotifications() {
  const prefs = store.get('prefs', {});
  const render = (listId, items) => {
    const el = document.getElementById(listId);
    if (!el) return;
    el.innerHTML = items.map(item => {
      const on = prefs[item.key] !== undefined ? prefs[item.key] : item.def;
      return `<div class="st-pref-item">
        <div style="flex:1">
          <div class="st-pref-label">${item.label}</div>
          <div class="st-pref-sub">${item.desc}</div>
        </div>
        <div class="toggle-switch" id="toggle-${item.key}" onclick="togglePref('${item.key}')" data-on="${on}">
          <div class="toggle-thumb"></div>
        </div>
      </div>`;
    }).join('');
  };
  render('notif-email-list', ST_NOTIF_EMAIL);
  render('notif-push-list', ST_NOTIF_PUSH);
  const qs = store.get('quiet_start','22:00');
  const qe = store.get('quiet_end','08:00');
  const qsEl = document.getElementById('quiet-start');
  const qeEl = document.getElementById('quiet-end');
  if (qsEl) qsEl.value = qs;
  if (qeEl) qeEl.value = qe;
}

function saveNotifSchedule() {
  const qs = document.getElementById('quiet-start')?.value;
  const qe = document.getElementById('quiet-end')?.value;
  store.set('quiet_start', qs);
  store.set('quiet_end', qe);
  showToast('Quiet hours saved: ' + qs + ' â€“ ' + qe + ' âœ“');
}

// â”€â”€ PREFERENCES TAB â”€â”€
function stInitPreferences() {
  const prefs = store.get('prefs', {});
  const savedGoal = store.get('daily_goal', 60);
  const goalEl = document.getElementById('pref-daily-goal');
  const goalVal = document.getElementById('pref-goal-val');
  if (goalEl) goalEl.value = savedGoal;
  if (goalVal) goalVal.textContent = savedGoal + ' min';

  const timeSlots = ['Morning (6-9 AM)','Afternoon (12-3 PM)','Evening (6-9 PM)','Night (9-12 PM)'];
  const savedSlots = store.get('pref_time_slots', ['Evening (6-9 PM)']);
  const slotsEl = document.getElementById('pref-time-slots');
  if (slotsEl) slotsEl.innerHTML = timeSlots.map(t =>
    `<button class="cert-ftab ${savedSlots.includes(t)?'active':''}" onclick="stToggleTimeSlot('${t}',this)">${t}</button>`
  ).join('');

  const savedSpeed = store.get('pref_speed','1x');
  const speedEl = document.getElementById('pref-speed-btns');
  if (speedEl) speedEl.innerHTML = ST_SPEEDS.map(s =>
    `<button class="st-font-btn ${s===savedSpeed?'active':''}" onclick="stSetSpeed('${s}',this)">${s}</button>`
  ).join('');

  stSetToggle('toggle-autoplay',   prefs.autoplay !== false);
  stSetToggle('toggle-subtitles',  prefs.subtitles || false);

  const langEl = document.getElementById('pref-lang');
  if (langEl) langEl.value = store.get('pref_lang','id');

  const savedTopics = store.get('pref_topics', ['Machine Learning','Python','Deep Learning']);
  const topicsEl = document.getElementById('pref-topics');
  if (topicsEl) topicsEl.innerHTML = ST_TOPICS.map(t => {
    const active = savedTopics.includes(t);
    return `<button class="cm-tag ${active?'active':''}" style="${active?'border-color:var(--accent);color:var(--accent-light);background:rgba(124,58,237,0.1)':''}"
      onclick="stToggleTopic('${t}',this)">${t}</button>`;
  }).join('');
}

function stToggleTimeSlot(slot, btn) {
  btn.classList.toggle('active');
  const slots = store.get('pref_time_slots', []);
  const idx = slots.indexOf(slot);
  if (idx === -1) slots.push(slot); else slots.splice(idx, 1);
  store.set('pref_time_slots', slots);
}

function stSetSpeed(speed, btn) {
  document.querySelectorAll('#pref-speed-btns .st-font-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  store.set('pref_speed', speed);
  showToast('Playback speed: ' + speed);
}

function stToggleTopic(topic, btn) {
  const topics = store.get('pref_topics', []);
  const idx = topics.indexOf(topic);
  if (idx === -1) {
    topics.push(topic);
    btn.style.cssText = 'border-color:var(--accent);color:var(--accent-light);background:rgba(124,58,237,0.1)';
  } else {
    topics.splice(idx, 1);
    btn.style.cssText = '';
  }
  store.set('pref_topics', topics);
}

function savePreferences() {
  const goal = document.getElementById('pref-daily-goal')?.value;
  const lang = document.getElementById('pref-lang')?.value;
  store.set('daily_goal', parseInt(goal) || 60);
  store.set('pref_lang', lang);
  showToast('Preferences saved! âœ“');
}

function saveTopics() { showToast('Topics saved! âœ“'); }

// â”€â”€ PRIVACY & SECURITY TAB â”€â”€
function stInitPrivacy() {
  const sessions = [
    { device:'Chrome on Windows', location:'Jakarta, ID', time:'Active now',  current:true,  icon:'monitor' },
    { device:'Safari on iPhone',  location:'Jakarta, ID', time:'2 hours ago', current:false, icon:'smartphone' },
    { device:'Firefox on MacOS',  location:'Bandung, ID', time:'3 days ago',  current:false, icon:'monitor' },
  ];
  const el = document.getElementById('active-sessions-list');
  if (!el) return;
  el.innerHTML = sessions.map(s => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="width:36px;height:36px;border-radius:8px;background:var(--input-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <i data-lucide="${s.icon}" style="width:16px;height:16px;color:var(--text-secondary)"></i>
      </div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">${s.device}</div>
        <div style="font-size:10px;color:var(--text-muted)">${s.location} Â· ${s.time}</div>
      </div>
      ${s.current
        ? '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;background:rgba(16,185,129,0.15);color:#34d399">Current</span>'
        : '<button style="font-size:11px;color:var(--danger);background:none;border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:4px 10px;cursor:pointer" onclick="stRevokeSession(this)">Revoke</button>'}
    </div>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function stRevokeSession(btn) {
  btn.closest('div[style*="border-bottom"]')?.remove();
  showToast('Session revoked.');
}

function checkPwStrength(pw) {
  const bar = document.getElementById('pw-strength-fill');
  const label = document.getElementById('pw-strength-label');
  if (!bar || !label) return;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { pct:0,   color:'transparent', text:'' },
    { pct:25,  color:'#ef4444',     text:'Weak' },
    { pct:50,  color:'#f59e0b',     text:'Fair' },
    { pct:75,  color:'#3b82f6',     text:'Good' },
    { pct:100, color:'#10b981',     text:'Strong' },
  ];
  const lvl = levels[score];
  bar.style.width = lvl.pct + '%';
  bar.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
}

function togglePwField(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.innerHTML = input.type === 'password'
    ? '<i data-lucide="eye" style="width:14px;height:14px"></i>'
    : '<i data-lucide="eye-off" style="width:14px;height:14px"></i>';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function changePassword() {
  const current = document.getElementById('pw-current')?.value;
  const newPw   = document.getElementById('pw-new')?.value;
  const confirm = document.getElementById('pw-confirm')?.value;
  if (!current || !newPw || !confirm) { showToast('Semua field wajib diisi.'); return; }
  const session = getSession();
  const users = getUsers();
  const user = users.find(u => u.email === session.email);
  if (!user || user.password !== current) { showToast('Password saat ini salah.'); return; }
  if (newPw.length < 6) { showToast('Password baru minimal 6 karakter.'); return; }
  if (newPw !== confirm) { showToast('Konfirmasi password tidak cocok.'); return; }
  user.password = newPw;
  saveUsers(users);
  ['pw-current','pw-new','pw-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showToast('Password berhasil diubah! âœ“');
}

function setup2FA() {
  const code = Math.floor(100000 + Math.random() * 900000);
  alert('Two-Factor Authentication\n\nBackup code: ' + code + '\n\nSimpan kode ini di tempat aman.');
  showToast('2FA setup initiated!');
}

function setupSMS2FA() {
  const phone = prompt('Masukkan nomor HP (contoh: +628123456789):');
  if (phone) showToast('SMS 2FA akan dikirim ke ' + phone);
}

function deactivateAccount() {
  if (confirm('Akun kamu akan dinonaktifkan sementara. Lanjutkan?')) {
    showToast('Akun dinonaktifkan...');
    setTimeout(() => { clearSession(); window.location.href = '/login'; }, 2000);
  }
}

function confirmDeleteAccount() {
  if (confirm('Hapus akun permanen? Semua data akan hilang.')) {
    clearSession();
    localStorage.clear();
    window.location.href = '/login';
  }
}

// â”€â”€ BILLING TAB â”€â”€
function stInitBilling() {
  const plans = [
    {
      name:'Free', price:'Rp 0', period:'/bulan', current:true, disabled:true,
      features:['Semua kursus gratis','Quiz harian terbatas','Proyek publik','Sertifikat standar'],
      btnText:'Current Plan',
    },
    {
      name:'Pro', price:'Rp 99K', period:'/bulan', current:false, disabled:false,
      features:['Semua kursus + premium','Quiz unlimited','AI Playground penuh','Sertifikat premium','Analytics lanjutan','Priority support'],
      btnText:'Upgrade Now',
    },
  ];
  const el = document.getElementById('billing-plans');
  if (el) el.innerHTML = plans.map(p => `
    <div style="background:var(--input-bg);border:1px solid ${p.current?'var(--border)':'var(--accent)'};border-radius:10px;padding:16px">
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">${p.name}</div>
      <div style="font-size:20px;font-weight:800;color:${p.current?'var(--text-primary)':'var(--accent-light)'}">${p.price}<span style="font-size:11px;font-weight:400;color:var(--text-muted)">${p.period}</span></div>
      <div style="margin:10px 0;display:flex;flex-direction:column;gap:5px">
        ${p.features.map(f=>`<div style="font-size:11px;color:var(--text-secondary);display:flex;align-items:center;gap:5px"><i data-lucide="check" style="width:11px;height:11px;color:#34d399;flex-shrink:0"></i>${f}</div>`).join('')}
      </div>
      <button class="btn ${p.current?'btn-outline':'btn-primary'} btn-full" style="padding:8px;font-size:12px;margin-top:8px;${p.disabled?'opacity:0.5;cursor:not-allowed':''}" ${p.disabled?'disabled':''} onclick="${p.disabled?'':'showToast(\'Redirecting to payment...\')'}">
        ${p.btnText}
      </button>
    </div>
  `).join('');

  const histEl = document.getElementById('billing-history');
  if (histEl) histEl.innerHTML = `
    <div style="text-align:center;padding:24px;color:var(--text-muted)">
      <i data-lucide="file-text" style="width:32px;height:32px;margin-bottom:8px;opacity:0.4"></i>
      <div style="font-size:13px">No billing history yet.</div>
    </div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function addPaymentMethod() {
  const methods = ['Credit/Debit Card','GoPay','OVO','DANA','Bank Transfer'];
  const choice = prompt('Pilih metode:\n' + methods.map((m,i)=>`${i+1}. ${m}`).join('\n') + '\n\nKetik nomor:');
  if (choice && methods[parseInt(choice)-1]) showToast(methods[parseInt(choice)-1] + ' added!');
}

// â”€â”€ APPEARANCE TAB â”€â”€
function stInitAppearance() {
  stRenderAccentColors('app-color-row');

  const savedFont = store.get('font_size','medium');
  const fontEl = document.getElementById('app-font-row');
  if (fontEl) fontEl.innerHTML = [
    {size:'small',label:'A-'},{size:'medium',label:'A'},{size:'large',label:'A+'}
  ].map(f =>
    `<button class="st-font-btn ${f.size===savedFont?'active':''}" onclick="stSetFontSize('${f.size}',this)">${f.label}</button>`
  ).join('');

  const savedTheme = store.get('theme','dark');
  ['light','dark','system'].forEach(t => {
    const el = document.getElementById('app-theme-'+t);
    if (el) el.classList.toggle('active', t===savedTheme);
  });

  const prefs = store.get('prefs',{});
  stSetToggle('toggle-compact',        prefs.compact || false);
  stSetToggle('toggle-upgrade-banner', prefs.upgrade_banner !== false);
  stSetToggle('toggle-animations',     prefs.animations !== false);
  stSetToggle('toggle-reduce-motion',  prefs.reduce_motion || false);
}

function stRenderAccentColors(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const saved = store.get('accent_color','#7c3aed');
  el.innerHTML = ST_ACCENT_COLORS.map(c =>
    `<div class="st-color-dot ${c.color===saved?'active':''}" style="background:${c.color}" title="${c.name}" onclick="stSetAccentColor('${c.color}')"></div>`
  ).join('');
}

function stSetAccentColor(color) {
  store.set('accent_color', color);
  document.documentElement.style.setProperty('--accent', color);
  stRenderAccentColors('st-color-row');
  stRenderAccentColors('app-color-row');
  showToast('Accent color updated!');
}

function setTheme(theme) {
  store.set('theme', theme);
  ['light','dark','system'].forEach(t => {
    const el = document.getElementById('theme-'+t) || document.getElementById('app-theme-'+t);
    if (el) el.classList.toggle('active', t===theme);
  });
  if (theme === 'light') showToast('Light mode akan tersedia di versi Pro!');
  else showToast('Theme: ' + theme.charAt(0).toUpperCase() + theme.slice(1));
}

function stSetFontSize(size, btn) {
  document.querySelectorAll('#app-font-row .st-font-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sizes = { small:'13px', medium:'14px', large:'16px' };
  document.documentElement.style.fontSize = sizes[size];
  store.set('font_size', size);
  const preview = document.getElementById('app-font-preview');
  if (preview) preview.style.fontSize = sizes[size];
  showToast('Font size: ' + size);
}

// alias for general tab
function setFontSize(size) {
  const btn = document.querySelector('.st-font-btn');
  stSetFontSize(size, btn || document.createElement('button'));
}

function renderAccentColors() { stRenderAccentColors('st-color-row'); }
function setAccentColor(color) { stSetAccentColor(color); }

// â•â• EXTRA SETTINGS ACTIONS â•â•

function triggerAvatarUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Ukuran foto maksimal 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Store as data URL and show as background
      store.set('avatar_img', ev.target.result);
      document.querySelectorAll('.user-avatar').forEach(el => {
        el.style.backgroundImage = `url(${ev.target.result})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
      });
      showToast('Foto profil berhasil diupdate! âœ“');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function downloadUserData() {
  const session = getSession();
  const data = {
    profile: session,
    bookmarks: store.get('bookmarks_v2', []),
    projects: store.get('projects', []),
    quiz_scores: store.get('quiz_scores', {}),
    preferences: store.get('prefs', {}),
    exported_at: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lunetix-data-${session?.name?.toLowerCase().replace(/\s+/g,'-') || 'user'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data berhasil diunduh! âœ“');
}

function connectSocialAccount(provider) {
  const session = getSession();
  const key = 'connected_' + provider.toLowerCase();
  const isConnected = store.get(key, false);
  if (isConnected) {
    if (confirm(`Disconnect akun ${provider}?`)) {
      store.set(key, false);
      showToast(`${provider} disconnected.`);
      stInitAccount();
    }
  } else {
    // Simulate OAuth flow
    showToast(`Menghubungkan ke ${provider}...`);
    setTimeout(() => {
      store.set(key, true);
      showToast(`${provider} berhasil terhubung! âœ“`);
      stInitAccount();
    }, 1500);
  }
}

function showRedeemModal() {
  const code = prompt('Masukkan kode redeem kamu:\n\n(Coba: LUNETIX20, BELAJAR50, NEWUSER)');
  if (!code) return;
  const validCodes = { 'LUNETIX20':'20% diskon Pro Plan', 'BELAJAR50':'50% diskon Pro Plan', 'NEWUSER':'30% diskon untuk pengguna baru', 'FREEMONTH':'1 bulan Pro gratis' };
  const reward = validCodes[code.toUpperCase().trim()];
  if (reward) {
    showToast(`ðŸŽ‰ Kode valid! Reward: ${reward}`);
    store.set('promo_code', code.toUpperCase().trim());
  } else {
    showToast('âŒ Kode tidak valid atau sudah digunakan.');
  }
}

function showHelpCenter() {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Help Center - Lunetix</title>
  <style>
    body{font-family:'Inter',sans-serif;background:#0a0a1a;color:#fff;padding:40px;max-width:800px;margin:0 auto}
    h1{color:#a78bfa;margin-bottom:8px}
    .sub{color:#6060a0;margin-bottom:32px;font-size:14px}
    .faq{background:#12122a;border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:20px;margin-bottom:14px;cursor:pointer}
    .faq h3{font-size:14px;font-weight:600;margin-bottom:0;display:flex;justify-content:space-between}
    .faq p{font-size:13px;color:#a0a0c0;margin-top:10px;line-height:1.6;display:none}
    .faq.open p{display:block}
    .contact{background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(157,92,246,0.08));border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:24px;margin-top:24px;text-align:center}
    .btn{background:linear-gradient(135deg,#7c3aed,#9d5cf6);color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600}
  </style></head><body>
  <h1>ðŸŒ™ Help Center</h1>
  <div class="sub">Temukan jawaban untuk pertanyaan umum tentang Lunetix</div>
  ${[
    ['Bagaimana cara memulai belajar?','Pilih kursus dari halaman Courses, klik Start, dan ikuti materi secara berurutan. Setiap kursus memiliki video, materi teks, dan quiz.'],
    ['Bagaimana cara mendapatkan sertifikat?','Selesaikan semua lesson dalam kursus dan lulus quiz akhir dengan skor minimal 70%. Sertifikat akan otomatis tersedia di halaman Certificates.'],
    ['Apa perbedaan Free dan Pro Plan?','Free Plan memberikan akses ke semua kursus gratis dan quiz terbatas. Pro Plan membuka semua kursus premium, AI Playground penuh, analytics lanjutan, dan sertifikat premium.'],
    ['Bagaimana cara reset password?','Pergi ke Settings > Privacy & Security > Change Password. Masukkan password lama dan password baru minimal 6 karakter.'],
    ['Apakah materi bisa diakses offline?','Fitur download offline tersedia untuk pengguna Pro. Upgrade ke Pro untuk mengakses fitur ini.'],
    ['Bagaimana cara menghubungi support?','Kirim email ke support@lunetix.ai atau gunakan form di bawah ini. Tim kami akan merespons dalam 24 jam.'],
  ].map(([q,a])=>`<div class="faq" onclick="this.classList.toggle('open')"><h3>${q} <span>+</span></h3><p>${a}</p></div>`).join('')}
  <div class="contact">
    <h3 style="margin-bottom:8px">Masih butuh bantuan?</h3>
    <p style="color:#a0a0c0;font-size:13px;margin-bottom:16px">Tim support kami siap membantu kamu</p>
    <button class="btn" onclick="window.location.href='mailto:support@lunetix.ai'">ðŸ“§ Email Support</button>
  </div>
  </body></html>`);
  w.document.close();
}

// â”€â”€ Certificate Share â”€â”€
function shareCertToLinkedIn() {
  const session = getSession();
  const text = encodeURIComponent(`I just earned a certificate from Lunetix AI Learning Platform! ðŸŽ“ #AI #MachineLearning #Lunetix`);
  const url = encodeURIComponent('https://lunetix.ai');
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  showToast('Membuka LinkedIn untuk share...');
}

function shareCertToTwitter() {
  const session = getSession();
  const text = encodeURIComponent(`Just earned my AI certificate from @Lunetix! ðŸš€ Learning Machine Learning & Deep Learning. #AI #MachineLearning #Lunetix`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  showToast('Membuka Twitter/X untuk share...');
}

// â”€â”€ Bookmark Filter Panel â”€â”€
function toggleBmFilterPanel() {
  const existing = document.getElementById('bm-filter-panel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.id = 'bm-filter-panel';
  panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:24px;z-index:300;min-width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.5)';
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-size:15px;font-weight:600">Filter Bookmark</h3>
      <button onclick="document.getElementById('bm-filter-panel').remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:18px">âœ•</button>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:8px">Kategori</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px" id="bm-fp-cats">
        ${['Semua','Machine Learning','Deep Learning','NLP','Computer Vision','Data Science'].map(c=>`<button class="cert-ftab" onclick="applyBmFilter('${c}',this)">${c}</button>`).join('')}
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:8px">Urutkan</label>
      <select id="bm-fp-sort" style="width:100%;background:var(--input-bg);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:#fff;font-size:13px;outline:none">
        <option>Terbaru</option><option>Terlama</option><option>A-Z</option><option>Z-A</option>
      </select>
    </div>
    <button class="btn btn-primary btn-full" onclick="applyBmFilterAndClose()" style="padding:10px">Terapkan Filter</button>
  `;
  document.body.appendChild(panel);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function applyBmFilter(cat, btn) {
  document.querySelectorAll('#bm-fp-cats .cert-ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function applyBmFilterAndClose() {
  const activeBtn = document.querySelector('#bm-fp-cats .cert-ftab.active');
  const cat = activeBtn?.textContent || 'Semua';
  document.getElementById('bm-filter-panel')?.remove();
  if (typeof renderBookmarks === 'function') renderBookmarks();
  showToast(`Filter diterapkan: ${cat}`);
}

