// ══════════════════════════════════════════════
// NOTIFICATION ACCESS — Notifikasi Kedaluwarsa
// ══════════════════════════════════════════════

// ── Helpers ──

function loadNotificationState() {
  const raw = store.get('notificationState', {});
  if (typeof raw !== 'object' || raw === null) {
    store.set('notificationState', {});
    return {};
  }
  return raw;
}

function saveNotificationState(data) {
  try {
    store.set('notificationState', data);
    return true;
  } catch (e) {
    console.error('[NotificationAccess] localStorage error:', e);
    return false;
  }
}

/**
 * Memeriksa apakah notifikasi tertentu sudah ditampilkan hari ini (WIB).
 * @param {string} userId
 * @param {string} notifKey - Format: "{courseId}_{type}" e.g. "1_7days"
 * @returns {boolean}
 */
function wasNotificationShownToday(userId, notifKey) {
  const data = loadNotificationState();
  const userState = data[userId] || {};
  const lastShown = userState[notifKey];
  if (!lastShown) return false;
  return lastShown === getTodayWIB();
}

/**
 * Menandai notifikasi sebagai sudah ditampilkan hari ini.
 * @param {string} userId
 * @param {string} notifKey
 */
function markNotificationShown(userId, notifKey) {
  const data = loadNotificationState();
  if (!data[userId]) data[userId] = {};
  data[userId][notifKey] = getTodayWIB();
  saveNotificationState(data);
}

/**
 * Menampilkan banner notifikasi kedaluwarsa di atas halaman.
 * @param {string} message
 * @param {'warning'|'danger'|'info'} type
 */
function showExpiryBanner(message, type) {
  // Hapus banner lama jika ada
  const existing = document.getElementById('expiry-banner');
  if (existing) existing.remove();

  const colors = {
    warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24', icon: '⚠️' },
    danger:  { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#f87171', icon: '🔴' },
    info:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#60a5fa', icon: 'ℹ️' },
  };
  const c = colors[type] || colors.info;

  const banner = document.createElement('div');
  banner.id = 'expiry-banner';
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:9998;
    background:${c.bg};border-bottom:1px solid ${c.border};
    padding:10px 20px;display:flex;align-items:center;justify-content:space-between;
    font-size:13px;color:${c.text};backdrop-filter:blur(8px);
  `;
  banner.innerHTML = `
    <span>${c.icon} ${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:${c.text};cursor:pointer;font-size:16px;padding:0 4px;line-height:1">×</button>
  `;
  document.body.prepend(banner);

  // Auto-dismiss setelah 8 detik
  setTimeout(() => { if (banner.parentElement) banner.remove(); }, 8000);
}

/**
 * Memeriksa dan menampilkan notifikasi kedaluwarsa yang relevan.
 * Dipanggil saat aplikasi dibuka.
 * @param {string} userId
 */
function checkExpiryNotifications(userId) {
  const claimedCourses = getClaimedCourses(userId);
  if (!claimedCourses.length) return;

  const now = Date.now();

  claimedCourses.forEach(record => {
    const courseId = record.courseId;
    const course = coursesData.find(c => c.id === courseId);
    const courseName = course ? course.title : `Kursus #${courseId}`;
    const expires = new Date(record.expiresAt).getTime();
    const diffMs = expires - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (record.status === 'expired' || diffMs <= 0) {
      // Kursus sudah expired
      const key = `${courseId}_expired`;
      if (!wasNotificationShownToday(userId, key)) {
        showExpiryBanner(
          `Akses kursus "<strong>${courseName}</strong>" telah berakhir. <a href="#" onclick="showUpgradeModal&&showUpgradeModal();return false;" style="color:inherit;text-decoration:underline">Upgrade ke Pro</a> untuk akses lebih lama.`,
          'danger'
        );
        markNotificationShown(userId, key);
      }
    } else if (diffDays <= 1) {
      // 1 hari lagi
      const key = `${courseId}_1day`;
      if (!wasNotificationShownToday(userId, key)) {
        showExpiryBanner(
          `⏰ Akses kursus "<strong>${courseName}</strong>" akan berakhir dalam <strong>1 hari</strong>!`,
          'danger'
        );
        markNotificationShown(userId, key);
      }
    } else if (diffDays <= 7) {
      // 7 hari lagi
      const key = `${courseId}_7days`;
      if (!wasNotificationShownToday(userId, key)) {
        showExpiryBanner(
          `Akses kursus "<strong>${courseName}</strong>" akan berakhir dalam <strong>${diffDays} hari</strong>.`,
          'warning'
        );
        markNotificationShown(userId, key);
      }
    }
  });
}
