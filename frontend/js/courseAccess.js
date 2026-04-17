// ══════════════════════════════════════════════
// COURSE ACCESS — Manajemen Akses Kursus (API + localStorage fallback)
// ══════════════════════════════════════════════

const MAX_CLAIMS_FREE  = 1;
const MAX_CLAIMS_PRO   = 2;
const ACCESS_DAYS_FREE = 90;
const ACCESS_DAYS_PRO  = 180;

// ── localStorage helpers ──

function loadCourseAccessData() {
  const raw = store.get('courseAccess', {});
  return (typeof raw === 'object' && raw !== null) ? raw : {};
}

function saveCourseAccessData(data) {
  try { store.set('courseAccess', data); return true; }
  catch (e) {
    if (e.name === 'QuotaExceededError') showToast('Penyimpanan browser penuh.');
    return false;
  }
}

function calculateExpiryDate(claimedAt, accountType) {
  const days = accountType === 'pro' ? ACCESS_DAYS_PRO : ACCESS_DAYS_FREE;
  const d = new Date(claimedAt);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function _syncClaimedCoursesToLocal(userId, apiCourses) {
  const data = loadCourseAccessData();
  if (!data[userId]) data[userId] = {};
  apiCourses.forEach(c => {
    data[userId][c.course_id] = {
      courseId:          c.course_id,
      claimedAt:         c.claimed_at,
      expiresAt:         c.expires_at,
      status:            c.status,
      accountTypeAtClaim: c.account_type_at_claim,
    };
  });
  saveCourseAccessData(data);
}

// ── API-first: klaim kursus ──

async function claimCourseAsync(courseId) {
  const session = getSession();
  if (!session?.token) return _claimCourseLocal(String(session?.id), courseId, session?.account_type || 'free');

  try {
    const data = await CoursesAPI.claim(courseId);
    // Sync ke localStorage
    const userId = String(session.id);
    const localData = loadCourseAccessData();
    if (!localData[userId]) localData[userId] = {};
    localData[userId][courseId] = {
      courseId,
      claimedAt:          data.access.claimed_at,
      expiresAt:          data.access.expires_at,
      status:             'active',
      accountTypeAtClaim: data.access.account_type_at_claim,
    };
    saveCourseAccessData(localData);
    return { success: true };
  } catch (err) {
    if (err?.error === 'already_claimed') return { success: false, error: 'already_claimed' };
    if (err?.error === 'limit_reached')   return { success: false, error: 'limit_reached' };
    console.warn('[CourseAccess] API tidak tersedia, klaim lokal.', err);
    return _claimCourseLocal(String(session.id), courseId, session?.account_type || 'free');
  }
}

// ── API-first: ambil kursus yang diklaim ──

async function getClaimedCoursesAsync(userId) {
  const session = getSession();
  if (!session?.token) return getClaimedCourses(userId);

  try {
    const data = await CoursesAPI.getMyCourses();
    _syncClaimedCoursesToLocal(userId, data.courses);
    return data.courses.map(c => ({
      courseId:          c.course_id,
      claimedAt:         c.claimed_at,
      expiresAt:         c.expires_at,
      status:            c.status,
      accountTypeAtClaim: c.account_type_at_claim,
    }));
  } catch (err) {
    console.warn('[CourseAccess] API tidak tersedia, pakai localStorage.', err);
    return getClaimedCourses(userId);
  }
}

// ── localStorage fallback ──

function _claimCourseLocal(userId, courseId, accountType) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return { success: false, error: 'invalid_course' };

  const data = loadCourseAccessData();
  if (!data[userId]) data[userId] = {};

  const userClaims = data[userId];
  const maxClaims  = accountType === 'pro' ? MAX_CLAIMS_PRO : MAX_CLAIMS_FREE;

  if (userClaims[courseId])                    return { success: false, error: 'already_claimed' };
  if (Object.keys(userClaims).length >= maxClaims) return { success: false, error: 'limit_reached' };

  const claimedAt = new Date().toISOString();
  userClaims[courseId] = {
    courseId, claimedAt,
    expiresAt:          calculateExpiryDate(claimedAt, accountType),
    status:             'active',
    accountTypeAtClaim: accountType,
  };

  return saveCourseAccessData(data) ? { success: true } : { success: false, error: 'storage_error' };
}

// ── Sync wrappers (kompatibilitas kode lama) ──

function claimCourse(userId, courseId, accountType) {
  return _claimCourseLocal(userId, courseId, accountType);
}

function getClaimedCourses(userId) {
  const data = loadCourseAccessData();
  return Object.values(data[userId] || {});
}

function checkCourseAccess(userId, courseId) {
  const data  = loadCourseAccessData();
  const record = (data[userId] || {})[courseId];
  if (!record) return { hasAccess: false, status: 'not_claimed' };

  const now     = Date.now();
  const expires = new Date(record.expiresAt).getTime();

  if (now > expires) {
    if (record.status !== 'expired') {
      record.status = 'expired';
      saveCourseAccessData(data);
    }
    return { hasAccess: false, status: 'expired', daysLeft: 0 };
  }

  const daysLeft = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
  return { hasAccess: true, status: 'active', daysLeft };
}

function refreshAccessStatuses(userId) {
  const data = loadCourseAccessData();
  let changed = false;
  Object.values(data[userId] || {}).forEach(record => {
    if (Date.now() > new Date(record.expiresAt).getTime() && record.status !== 'expired') {
      record.status = 'expired';
      changed = true;
    }
  });
  if (changed) saveCourseAccessData(data);
}

// ── Popup klaim kursus ──

let _selectedClaimCourseId = null;

function showClaimPopup() {
  const session = getSession();
  if (!session) return;

  // Jika sudah pernah klaim sebelumnya (flag di localStorage), skip
  if (store.get('has_claimed_course', false)) return;

  // Cek via API dulu, lalu tampilkan popup jika belum klaim
  getClaimedCoursesAsync(String(session.id)).then(claimed => {
    if (claimed.length > 0) {
      // Sudah punya kursus, set flag dan skip
      store.set('has_claimed_course', true);
      return;
    }
    _renderClaimPopup(session);
  }).catch(() => {
    const claimed = getClaimedCourses(String(session.id));
    if (claimed.length > 0) {
      store.set('has_claimed_course', true);
      return;
    }
    _renderClaimPopup(session);
  });
}

function _renderClaimPopup(session) {
  let overlay = document.getElementById('claim-popup-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'claim-popup-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';

  const availableCourses = coursesData.filter(c => c.status !== 'coming');

  overlay.innerHTML = `
    <div style="background:#ffffff;border-radius:24px;padding:32px 28px 24px;max-width:480px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.2)">
      
      <!-- Header -->
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:48px;margin-bottom:12px">🎓</div>
        <h2 style="font-size:20px;font-weight:700;color:#1d1d1f;margin-bottom:6px;letter-spacing:-0.03em">Choose a Course to Continue Learning</h2>
        <p style="font-size:13px;color:#6e6e73">Select the course you want to continue working on:</p>
      </div>

      <!-- Course List -->
      <div id="claim-course-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
        ${availableCourses.map(c => {
          const lessonCount = (() => {
            const courseObjects = {1:typeof courseML!=='undefined'?courseML:null,2:typeof coursePythonAI!=='undefined'?coursePythonAI:null,3:typeof courseDeepLearning!=='undefined'?courseDeepLearning:null,4:typeof courseNLP!=='undefined'?courseNLP:null,5:typeof courseComputerVision!=='undefined'?courseComputerVision:null,6:typeof courseDataScience!=='undefined'?courseDataScience:null,7:typeof courseRL!=='undefined'?courseRL:null,8:typeof courseAIEthics!=='undefined'?courseAIEthics:null};
            const content = courseObjects[c.id];
            if (!content?.curriculum) return 0;
            return content.curriculum.reduce((sum, mod) => sum + mod.lessons.length, 0);
          })();
          return `
          <div class="claim-course-item" data-id="${c.id}" onclick="selectClaimCourse(${c.id})"
            style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;border:1.5px solid #e5e5ea;cursor:pointer;transition:all 0.15s;background:#fff">
            <div style="width:44px;height:44px;border-radius:12px;background:${c.thumbBg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i data-lucide="${c.thumbIcon}" style="width:22px;height:22px;color:${c.thumbColor}"></i>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:600;color:#1d1d1f;letter-spacing:-0.01em">${escHtml(c.title)}</div>
              <div style="font-size:12px;color:#6e6e73;margin-top:2px">${c.level} · ${lessonCount || '?'} lessons</div>
            </div>
            <div class="claim-check" style="width:24px;height:24px;border-radius:50%;border:2px solid #d1d1d6;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s"></div>
          </div>`;
        }).join('')}
      </div>

      <!-- Button -->
      <button id="claim-confirm-btn" onclick="confirmClaimCourse()" disabled
        style="width:100%;padding:14px;border-radius:980px;background:#e5e5ea;color:#aeaeb2;font-size:15px;font-weight:600;border:none;cursor:not-allowed;transition:all 0.2s;letter-spacing:-0.01em">
        Continue Learning
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  lucide.createIcons();
}

function selectClaimCourse(courseId) {
  _selectedClaimCourseId = courseId;
  document.querySelectorAll('.claim-course-item').forEach(el => {
    const isSelected = parseInt(el.dataset.id) === courseId;
    el.style.borderColor = isSelected ? '#0071e3' : '#e5e5ea';
    el.style.background  = isSelected ? '#f0f7ff' : '#fff';
    const check = el.querySelector('.claim-check');
    if (check) {
      check.style.background  = isSelected ? '#0071e3' : 'transparent';
      check.style.borderColor = isSelected ? '#0071e3' : '#d1d1d6';
      check.innerHTML = isSelected
        ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '';
    }
  });
  const btn = document.getElementById('claim-confirm-btn');
  if (btn) {
    btn.disabled = false;
    btn.style.background = '#1d1d1f';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
  }
}

function confirmClaimCourse() {
  if (!_selectedClaimCourseId) return;
  const session = getSession();
  if (!session) return;

  const btn = document.getElementById('claim-confirm-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }

  claimCourseAsync(_selectedClaimCourseId).then(result => {
    if (result.success) {
      const course = coursesData.find(c => c.id === _selectedClaimCourseId);
      document.getElementById('claim-popup-overlay')?.remove();
      _selectedClaimCourseId = null;
      // Tandai bahwa user sudah pernah klaim — cegah popup muncul lagi
      store.set('has_claimed_course', true);
      showToast(`🎉 Kursus "${course?.title}" berhasil diklaim! Selamat belajar.`);
      refreshAccessStatuses(String(session.id));
      checkExpiryNotifications(String(session.id));
      if (typeof renderCourses === 'function') renderCourses();
      if (typeof initDashboard === 'function') initDashboard();
    } else {
      const msg = result.error === 'limit_reached' ? 'Batas klaim kursus tercapai.'
        : result.error === 'already_claimed' ? 'Kursus sudah diklaim.'
        : 'Gagal mengklaim kursus. Coba lagi.';
      showToast(msg);
      if (btn) { btn.disabled = false; btn.textContent = 'Continue Learning'; btn.style.background = '#1d1d1f'; btn.style.color = '#fff'; btn.style.cursor = 'pointer'; }
    }
  });
}

// ── Init saat app dibuka ──

function initCourseAccess() {
  const session = getSession();
  if (!session) return;
  const userId = String(session.id);

  // Sync dari API ke localStorage di background
  getClaimedCoursesAsync(userId).then(() => {
    refreshAccessStatuses(userId);
    checkExpiryNotifications(userId);
  }).catch(() => {
    refreshAccessStatuses(userId);
    checkExpiryNotifications(userId);
  });
}
