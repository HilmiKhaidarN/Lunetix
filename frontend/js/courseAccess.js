// ══════════════════════════════════════════════
// COURSE ACCESS — Manajemen Akses Kursus
// ══════════════════════════════════════════════

const MAX_CLAIMS_FREE = 1;
const MAX_CLAIMS_PRO  = 2;
const ACCESS_DAYS_FREE = 90;
const ACCESS_DAYS_PRO  = 180;

// ── Helpers ──

function getTodayWIB() {
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibDate = new Date(Date.now() + wibOffset);
  return wibDate.toISOString().slice(0, 10);
}

function loadCourseAccessData() {
  const raw = store.get('courseAccess', {});
  if (typeof raw !== 'object' || raw === null) {
    store.set('courseAccess', {});
    return {};
  }
  return raw;
}

function saveCourseAccessData(data) {
  try {
    store.set('courseAccess', data);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Penyimpanan browser penuh. Harap bersihkan data browser.');
      console.error('[CourseAccess] localStorage quota exceeded:', e);
    }
    return false;
  }
}

function calculateExpiryDate(claimedAt, accountType) {
  const days = accountType === 'pro' ? ACCESS_DAYS_PRO : ACCESS_DAYS_FREE;
  const d = new Date(claimedAt);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ── Core Functions ──

/**
 * Mengklaim sebuah kursus untuk pengguna.
 * @param {string} userId
 * @param {number} courseId
 * @param {'free'|'pro'} accountType
 * @returns {{ success: boolean, error?: string }}
 */
function claimCourse(userId, courseId, accountType) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return { success: false, error: 'invalid_course' };

  const data = loadCourseAccessData();
  if (!data[userId]) data[userId] = {};

  const userClaims = data[userId];
  const claimCount = Object.keys(userClaims).length;
  const maxClaims = accountType === 'pro' ? MAX_CLAIMS_PRO : MAX_CLAIMS_FREE;

  if (userClaims[courseId]) return { success: false, error: 'already_claimed' };
  if (claimCount >= maxClaims) return { success: false, error: 'limit_reached' };

  const claimedAt = new Date().toISOString();
  const expiresAt = calculateExpiryDate(claimedAt, accountType);

  userClaims[courseId] = {
    courseId,
    claimedAt,
    expiresAt,
    status: 'active',
    accountTypeAtClaim: accountType,
  };

  const saved = saveCourseAccessData(data);
  if (!saved) return { success: false, error: 'storage_error' };
  return { success: true };
}

/**
 * Memeriksa apakah pengguna memiliki akses aktif ke kursus.
 * @param {string} userId
 * @param {number} courseId
 * @returns {{ hasAccess: boolean, status: 'active'|'expired'|'not_claimed', daysLeft?: number }}
 */
function checkCourseAccess(userId, courseId) {
  const data = loadCourseAccessData();
  const userClaims = data[userId] || {};
  const record = userClaims[courseId];

  if (!record) return { hasAccess: false, status: 'not_claimed' };

  const now = Date.now();
  const expires = new Date(record.expiresAt).getTime();

  if (now > expires) {
    // Update status to expired if not already
    if (record.status !== 'expired') {
      record.status = 'expired';
      saveCourseAccessData(data);
    }
    return { hasAccess: false, status: 'expired', daysLeft: 0 };
  }

  const daysLeft = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
  return { hasAccess: true, status: 'active', daysLeft };
}

/**
 * Memuat semua kursus yang diklaim oleh pengguna beserta statusnya.
 * @param {string} userId
 * @returns {Array}
 */
function getClaimedCourses(userId) {
  const data = loadCourseAccessData();
  const userClaims = data[userId] || {};
  return Object.values(userClaims);
}

/**
 * Memperbarui status akses semua kursus berdasarkan tanggal saat ini.
 * Dipanggil saat aplikasi dibuka.
 * @param {string} userId
 */
function refreshAccessStatuses(userId) {
  const data = loadCourseAccessData();
  const userClaims = data[userId] || {};
  let changed = false;

  Object.values(userClaims).forEach(record => {
    const now = Date.now();
    const expires = new Date(record.expiresAt).getTime();
    if (now > expires && record.status !== 'expired') {
      record.status = 'expired';
      changed = true;
    }
  });

  if (changed) saveCourseAccessData(data);
}

/**
 * Menampilkan popup klaim kursus setelah registrasi.
 * Popup tidak dapat ditutup sebelum pengguna memilih kursus.
 */
function showClaimPopup() {
  const session = getSession();
  if (!session) return;

  // Cek apakah sudah pernah klaim
  const claimed = getClaimedCourses(String(session.id));
  if (claimed.length > 0) return;

  // Buat overlay popup
  let overlay = document.getElementById('claim-popup-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'claim-popup-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';

  const availableCourses = coursesData.filter(c => c.status !== 'coming');
  const accountType = session.accountType || 'free';

  overlay.innerHTML = `
    <div style="background:var(--bg-card,#1a1a3e);border:1px solid var(--border-accent,rgba(124,58,237,0.4));border-radius:16px;padding:32px;max-width:560px;width:100%;max-height:80vh;overflow-y:auto">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:36px;margin-bottom:8px">🎓</div>
        <h2 style="font-size:20px;font-weight:700;color:#fff;margin-bottom:8px">Selamat Datang, ${escHtml(session.name)}!</h2>
        <p style="font-size:13px;color:rgba(255,255,255,0.6)">Pilih <strong>1 kursus gratis</strong> untuk mulai belajar sekarang.</p>
      </div>
      <div id="claim-course-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        ${availableCourses.map(c => `
          <div class="claim-course-item" data-id="${c.id}" onclick="selectClaimCourse(${c.id})"
            style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s">
            <div style="width:40px;height:40px;border-radius:8px;background:${c.thumbBg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i data-lucide="${c.thumbIcon}" style="width:20px;height:20px;color:${c.thumbColor}"></i>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:#fff">${escHtml(c.title)}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5)">${c.level} · ${c.duration}</div>
            </div>
            <div class="claim-check" style="width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,0.2);flex-shrink:0"></div>
          </div>
        `).join('')}
      </div>
      <button id="claim-confirm-btn" onclick="confirmClaimCourse()" disabled
        style="width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#9d5cf6);color:#fff;font-size:14px;font-weight:600;border:none;cursor:not-allowed;opacity:0.5;transition:all 0.2s">
        Mulai Belajar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  lucide.createIcons();
}

let _selectedClaimCourseId = null;

function selectClaimCourse(courseId) {
  _selectedClaimCourseId = courseId;

  document.querySelectorAll('.claim-course-item').forEach(el => {
    const isSelected = parseInt(el.dataset.id) === courseId;
    el.style.borderColor = isSelected ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.1)';
    el.style.background = isSelected ? 'rgba(124,58,237,0.15)' : 'transparent';
    const check = el.querySelector('.claim-check');
    if (check) {
      check.style.background = isSelected ? '#7c3aed' : 'transparent';
      check.style.borderColor = isSelected ? '#7c3aed' : 'rgba(255,255,255,0.2)';
      check.innerHTML = isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
    }
  });

  const btn = document.getElementById('claim-confirm-btn');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
}

function confirmClaimCourse() {
  if (!_selectedClaimCourseId) return;
  const session = getSession();
  if (!session) return;

  const accountType = session.accountType || 'free';
  const result = claimCourse(String(session.id), _selectedClaimCourseId, accountType);

  if (result.success) {
    const course = coursesData.find(c => c.id === _selectedClaimCourseId);
    const overlay = document.getElementById('claim-popup-overlay');
    if (overlay) overlay.remove();
    _selectedClaimCourseId = null;
    showToast(`🎉 Kursus "${course?.title}" berhasil diklaim! Selamat belajar.`);
    // Refresh notifikasi & status
    refreshAccessStatuses(String(session.id));
    checkExpiryNotifications(String(session.id));
  } else {
    showToast('Gagal mengklaim kursus. Coba lagi.');
  }
}

// ── Inisialisasi saat app dibuka ──
function initCourseAccess() {
  const session = getSession();
  if (!session) return;
  const userId = String(session.id);
  refreshAccessStatuses(userId);
  checkExpiryNotifications(userId);
}
