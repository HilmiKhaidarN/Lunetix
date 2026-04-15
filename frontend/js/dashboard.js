// â”€â”€ Dashboard Logic â”€â”€

// â”€â”€ Global Search â”€â”€
const searchIndex = [
  { title:'Machine Learning Fundamentals', type:'Kursus',    page:'courses',      icon:'book-open',    color:'#a78bfa' },
  { title:'Python for AI',                 type:'Kursus',    page:'courses',      icon:'book-open',    color:'#4ade80' },
  { title:'Deep Learning Essentials',      type:'Kursus',    page:'courses',      icon:'book-open',    color:'#60a5fa' },
  { title:'Natural Language Processing',   type:'Kursus',    page:'courses',      icon:'book-open',    color:'#c084fc' },
  { title:'Computer Vision with Python',   type:'Kursus',    page:'courses',      icon:'book-open',    color:'#34d399' },
  { title:'Dashboard',                     type:'Halaman',   page:'dashboard',    icon:'layout-dashboard', color:'#a78bfa' },
  { title:'AI Playground',                 type:'Halaman',   page:'playground',   icon:'cpu',          color:'#fbbf24' },
  { title:'Projects',                      type:'Halaman',   page:'projects',     icon:'folder',       color:'#34d399' },
  { title:'Quizzes',                       type:'Halaman',   page:'quizzes',      icon:'help-circle',  color:'#60a5fa' },
  { title:'Community',                     type:'Halaman',   page:'community',    icon:'users',        color:'#f97316' },
  { title:'Certificates',                  type:'Halaman',   page:'certificates', icon:'award',        color:'#fbbf24' },
  { title:'Analytics',                     type:'Halaman',   page:'analytics',    icon:'bar-chart',    color:'#a78bfa' },
  { title:'Bookmarks',                     type:'Halaman',   page:'bookmarks',    icon:'bookmark',     color:'#60a5fa' },
  { title:'Settings',                      type:'Halaman',   page:'settings',     icon:'settings',     color:'#34d399' },
  { title:'Machine Learning Basics Quiz',  type:'Quiz',      page:'quizzes',      icon:'help-circle',  color:'#a78bfa' },
  { title:'Python for AI Quiz',            type:'Quiz',      page:'quizzes',      icon:'help-circle',  color:'#4ade80' },
  { title:'Deep Learning Fundamentals Quiz',type:'Quiz',     page:'quizzes',      icon:'help-circle',  color:'#60a5fa' },
  { title:'Upgrade to Pro',                type:'Aksi',      page:'billing',      icon:'zap',          color:'#fbbf24' },
];

function showSearchSuggestions(q) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;
  if (!q.trim()) { dd.style.display = 'none'; return; }
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q.toLowerCase()) ||
    item.type.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);
  if (!results.length) {
    dd.innerHTML = `<div style="padding:16px;text-align:center;font-size:13px;color:var(--text-muted)">Tidak ada hasil untuk "${q}"</div>`;
    dd.style.display = 'block'; return;
  }
  dd.innerHTML = results.map(r => `
    <div onclick="searchGo('${r.page}','${r.title}')" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='var(--input-bg)'" onmouseout="this.style.background='transparent'">
      <div style="width:28px;height:28px;border-radius:8px;background:rgba(124,58,237,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <i data-lucide="${r.icon}" style="width:13px;height:13px;color:${r.color}"></i>
      </div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${r.title}</div>
        <div style="font-size:10px;color:var(--text-muted)">${r.type}</div>
      </div>
      <i data-lucide="arrow-right" style="width:12px;height:12px;color:var(--text-muted)"></i>
    </div>`).join('');
  dd.style.display = 'block';
  lucide.createIcons();
}

function searchGo(page, title) {
  document.getElementById('topbar-search').value = '';
  document.getElementById('search-dropdown').style.display = 'none';
  if (page === 'billing') { showUpgradeModal(); return; }
  if (window.navigateTo) navigateTo(page);
  showToast('Membuka: ' + title);
}

function handleTopbarSearch(e) {
  if (e.key === 'Escape') {
    document.getElementById('search-dropdown').style.display = 'none';
    e.target.value = '';
  }
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) searchGo('courses', q);
  }
}

// Close search on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('#topbar-search-wrap')) {
    const dd = document.getElementById('search-dropdown');
    if (dd) dd.style.display = 'none';
  }
});

// Keyboard shortcut Cmd/Ctrl+K
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('topbar-search')?.focus();
  }
});
// notifData diisi dari API
let notifData = [];

async function loadNotifications() {
  const session = getSession();
  if (!session) return;
  try {
    const data = await NotificationsAPI.getAll();
    notifData = data.notifications.map(n => ({
      id:        n.id,
      icon:      n.icon,
      iconBg:    n.icon_bg,
      iconColor: n.icon_color,
      text:      n.text,
      time:      timeAgo(n.created_at),
      unread:    !n.is_read,
    }));
  } catch (err) {
    // Fallback: notif kosong jika API tidak tersedia
    console.warn('[Notif] API tidak tersedia.', err);
    notifData = [];
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'Baru saja';
  if (m < 60)  return m + ' menit lalu';
  const h = Math.floor(m / 60);
  if (h < 24)  return h + ' jam lalu';
  const d = Math.floor(h / 24);
  if (d < 7)   return d + ' hari lalu';
  return Math.floor(d / 7) + ' minggu lalu';
}

function renderNotifList() {
  const el = document.getElementById('notif-list'); if (!el) return;
  const unreadCount = notifData.filter(n => n.unread).length;
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = unreadCount > 0 ? 'block' : 'none';

  if (!notifData.length) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">Belum ada notifikasi.</div>';
    return;
  }

  el.innerHTML = notifData.map(n => {
    return <div class="notif-item " onclick="markNotifRead('')">
      <div class="notif-icon" style="background:">
        <i data-lucide="" style="width:14px;height:14px;color:"></i>
      </div>
      <div style="flex:1">
        <div class="notif-text"></div>
        <div class="notif-time"></div>
      </div>
      
    </div>;
  }).join('');
  lucide.createIcons();
}

function markNotifRead(id) {
  const n = notifData.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifList();
  NotificationsAPI.markRead(id).catch(() => {});
}

function markAllRead() {
  notifData.forEach(n => n.unread = false);
  renderNotifList();
  NotificationsAPI.markAllRead().catch(() => {});
  showToast('Semua notifikasi ditandai dibaca.');
}
  const dd = document.getElementById('notif-dropdown');
  const pd = document.getElementById('profile-dropdown');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  closeAllDropdowns();
  if (!isOpen) { dd.style.display = 'block'; loadNotifications().then(renderNotifList); lucide.createIcons(); }
}

function toggleProfileDropdown() {
  const dd = document.getElementById('profile-dropdown');
  const nd = document.getElementById('notif-dropdown');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  closeAllDropdowns();
  if (!isOpen) { dd.style.display = 'block'; lucide.createIcons(); }
}

function closeAllDropdowns() {
  const nd = document.getElementById('notif-dropdown');
  const pd = document.getElementById('profile-dropdown');
  if (nd) nd.style.display = 'none';
  if (pd) pd.style.display = 'none';
}

function doLogout() {
  closeAllDropdowns();
  clearSession();
  window.location.href = '/login';
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#tb-notif-wrap') && !e.target.closest('#tb-profile-wrap')) {
    closeAllDropdowns();
  }
});

// Make navigateTo global so dropdowns can call it
window.navigateTo = null; // will be set in DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  const session = getSession();

  // Sync session dari API jika ada token (background, non-blocking)
  if (session?.token) {
    fetch('http://localhost:3000/api/auth/me', {
      headers: { Authorization: `Bearer ${session.token}` }
    })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data?.user) setSession({ ...data.user, token: session.token });
    })
    .catch(() => {});
  }
  document.querySelectorAll('.user-avatar').forEach(el => el.textContent = session.avatar || session.name.charAt(0));
  document.querySelectorAll('.user-streak').forEach(el => el.textContent = session.streak || 7);
  document.querySelectorAll('.user-points').forEach(el => el.textContent = (session.points || 1250).toLocaleString());

  // Topbar email
  const tbEmail = document.getElementById('tb-email');
  if (tbEmail) tbEmail.textContent = session.email || '';

  // Greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';
  const greetEl = document.getElementById('greeting');
  if (greetEl) greetEl.textContent = `${greeting}, ${session.name}! ðŸ‘‹`;

  // Navigation â€” pages already in DOM, just show/hide
  const navItems = document.querySelectorAll('.nav-item[data-page]');

  const pageTitles = {
    dashboard:'Dashboard', courses:'All Courses', playground:'AI Playground',
    projects:'Projects', quizzes:'Quizzes', community:'Community',
    certificates:'Certificates', analytics:'Analytics', bookmarks:'Bookmarks', settings:'Settings'
  };

  function navigateTo(pageId) {
    closeAllDropdowns();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    const targetNav  = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetPage) targetPage.classList.add('active');
    if (targetNav)  targetNav.classList.add('active');

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = pageTitles[pageId] || pageId;

    if (typeof initPage === 'function') initPage(pageId);
    lucide.createIcons();
    closeSidebar();
  }

  // Expose globally
  window.navigateTo = navigateTo;

  navItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Sidebar mobile
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuToggle) menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  });

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Logout button (settings page)
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 300);

  // Apply stored avatar image if exists
  const avatarImg = store.get('avatar_img', null);
  if (avatarImg) {
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.style.backgroundImage = `url(${avatarImg})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    });
  }

  // Init notification dot
  renderNotifList();

  // Init course access system (refresh statuses, check expiry notifications)
  if (typeof initCourseAccess === 'function') initCourseAccess();

  // Show claim popup for new users who haven't claimed a course yet
  const isNewUser = new URLSearchParams(window.location.search).get('new') === '1';
  if (typeof showClaimPopup === 'function') {
    if (isNewUser) {
      // Langsung tampilkan popup untuk user baru
      setTimeout(showClaimPopup, 500);
    } else {
      showClaimPopup();
    }
  }

  // Default page
  navigateTo('dashboard');
  if (typeof initDashboard === 'function') initDashboard();
});


