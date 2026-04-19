// ══════════════════════════════════════════════
// ADMIN DASHBOARD — Management Interface
// ══════════════════════════════════════════════

let adminData = null;
let currentUsersPage = 1;
let usersSearchQuery = '';

// ── Admin API ──
const AdminAPI = {
  getDashboard: () => apiFetch('/admin/dashboard'),
  getUsers: (page = 1, search = '') => apiFetch(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`),
  updateUser: (id, data) => apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),
  getAnalytics: () => apiFetch('/admin/analytics')
};

// ── Initialize Admin Dashboard ──
async function initAdminDashboard() {
  const session = getSession();
  if (!session) {
    window.location.href = '/login';
    return;
  }

  // Update admin user info
  const adminUserName = document.getElementById('admin-user-name');
  const adminUserAvatar = document.querySelector('.admin-user-avatar');
  if (adminUserName) adminUserName.textContent = session.name;
  if (adminUserAvatar) adminUserAvatar.textContent = session.avatar || session.name.charAt(0);

  // Setup navigation
  setupAdminNavigation();

  // Load dashboard data
  await loadDashboardData();
  
  // Navigate to dashboard by default
  navigateToPage('dashboard');
}

function setupAdminNavigation() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      navigateToPage(page);
    });
  });
}

function navigateToPage(pageId) {
  // Update navigation
  document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

  // Update pages
  document.querySelectorAll('.admin-page').forEach(page => page.classList.remove('active'));
  document.getElementById(`admin-page-${pageId}`)?.classList.add('active');

  // Update header
  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your platform' },
    users: { title: 'User Management', subtitle: 'Manage platform users' },
    courses: { title: 'Course Management', subtitle: 'Manage courses and content' },
    payments: { title: 'Payment Management', subtitle: 'Monitor transactions and revenue' },
    analytics: { title: 'Analytics', subtitle: 'Platform insights and metrics' },
    settings: { title: 'Settings', subtitle: 'Platform configuration' }
  };

  const pageInfo = titles[pageId] || { title: pageId, subtitle: '' };
  document.getElementById('admin-page-title').textContent = pageInfo.title;
  document.getElementById('admin-page-subtitle').textContent = pageInfo.subtitle;

  // Load page-specific data
  loadPageData(pageId);
}

async function loadPageData(pageId) {
  switch (pageId) {
    case 'dashboard':
      await loadDashboardData();
      break;
    case 'users':
      await loadUsersData();
      break;
    case 'courses':
      loadCoursesData();
      break;
    case 'payments':
      loadPaymentsData();
      break;
    case 'analytics':
      await loadAnalyticsData();
      break;
  }
}

// ── Dashboard Data ──
async function loadDashboardData() {
  try {
    adminData = await AdminAPI.getDashboard();
    renderDashboardStats();
    renderRecentUsers();
    renderTopCourses();
    renderCharts();
  } catch (error) {
    console.error('[Admin] Failed to load dashboard:', error);
    showToast('Failed to load dashboard data.');
    // Load fallback data
    adminData = generateFallbackAdminData();
    renderDashboardStats();
    renderRecentUsers();
    renderTopCourses();
  }
}

function renderDashboardStats() {
  const container = document.getElementById('admin-stats-grid');
  if (!container || !adminData) return;

  const stats = adminData.stats;
  const statsCards = [
    {
      icon: 'users',
      iconBg: 'rgba(59,130,246,0.15)',
      iconColor: '#60a5fa',
      value: stats.totalUsers.toLocaleString(),
      label: 'Total Users',
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: 'user-check',
      iconBg: 'rgba(16,185,129,0.15)',
      iconColor: '#34d399',
      value: stats.activeUsers.toLocaleString(),
      label: 'Active Users',
      change: '+8%',
      changeType: 'positive'
    },
    {
      icon: 'book-open',
      iconBg: 'rgba(124,58,237,0.15)',
      iconColor: '#a78bfa',
      value: stats.totalCourses.toLocaleString(),
      label: 'Total Courses',
      change: '+2',
      changeType: 'positive'
    },
    {
      icon: 'credit-card',
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: '#fbbf24',
      value: `Rp ${Math.round(stats.totalPayments.revenue / 1000)}K`,
      label: 'Revenue',
      change: '+24%',
      changeType: 'positive'
    }
  ];

  container.innerHTML = statsCards.map(stat => `
    <div class="admin-stat-card">
      <div class="admin-stat-icon" style="background:${stat.iconBg}">
        <i data-lucide="${stat.icon}" style="width:24px;height:24px;color:${stat.iconColor}"></i>
      </div>
      <div class="admin-stat-content">
        <div class="admin-stat-value">${stat.value}</div>
        <div class="admin-stat-label">${stat.label}</div>
        <div class="admin-stat-change ${stat.changeType}">${stat.change}</div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function renderRecentUsers() {
  const container = document.getElementById('recent-users-table');
  if (!container || !adminData?.recentUsers) return;

  const users = adminData.recentUsers;
  
  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Account Type</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:24px;height:24px;background:linear-gradient(135deg,#7c3aed,#9d5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:600">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="font-weight:600;font-size:12px">${user.name}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${user.email}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge ${user.account_type === 'pro' ? 'badge-gold' : 'badge-purple'}" style="font-size:10px">
                ${user.account_type}
              </span>
            </td>
            <td style="font-size:12px;color:var(--text-muted)">
              ${new Date(user.joined_at).toLocaleDateString()}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderTopCourses() {
  const container = document.getElementById('top-courses-table');
  if (!container || !adminData?.topCourses) return;

  const courses = adminData.topCourses;
  
  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Students</th>
        </tr>
      </thead>
      <tbody>
        ${courses.map(course => `
          <tr>
            <td>
              <div style="font-weight:600;font-size:12px">${course.name}</div>
            </td>
            <td style="font-size:12px">
              ${course.students} students
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCharts() {
  if (!adminData?.revenueStats) return;

  // Revenue Chart
  const revenueCtx = document.getElementById('revenue-chart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: adminData.revenueStats.map(r => r.month),
        datasets: [{
          label: 'Revenue',
          data: adminData.revenueStats.map(r => r.revenue / 1000), // Convert to K
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124,58,237,0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'Rp ' + value + 'K';
              }
            }
          }
        }
      }
    });
  }

  // User Growth Chart (placeholder data)
  const userGrowthCtx = document.getElementById('user-growth-chart');
  if (userGrowthCtx) {
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        signups: Math.floor(Math.random() * 10) + 1
      };
    });

    new Chart(userGrowthCtx, {
      type: 'bar',
      data: {
        labels: last30Days.map(d => d.date),
        datasets: [{
          label: 'New Signups',
          data: last30Days.map(d => d.signups),
          backgroundColor: 'rgba(59,130,246,0.8)',
          borderColor: '#3b82f6',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// ── Users Management ──
async function loadUsersData() {
  try {
    const data = await AdminAPI.getUsers(currentUsersPage, usersSearchQuery);
    renderUsersTable(data.users);
    renderUsersPagination(data.pagination);
  } catch (error) {
    console.error('[Admin] Failed to load users:', error);
    showToast('Failed to load users data.');
  }
}

function renderUsersTable(users) {
  const container = document.getElementById('users-table');
  if (!container) return;

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Account Type</th>
          <th>Status</th>
          <th>Points</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#9d5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="font-weight:600;font-size:13px">${user.name}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${user.email}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge ${user.account_type === 'pro' ? 'badge-gold' : user.account_type === 'team' ? 'badge-blue' : 'badge-purple'}" style="font-size:10px">
                ${user.account_type}
              </span>
            </td>
            <td>
              <span class="badge ${user.subscription_status === 'active' ? 'badge-green' : 'badge-gray'}" style="font-size:10px">
                ${user.subscription_status || 'inactive'}
              </span>
            </td>
            <td style="font-size:12px">${(user.points || 0).toLocaleString()}</td>
            <td style="font-size:12px;color:var(--text-muted)">
              ${new Date(user.joined_at).toLocaleDateString()}
            </td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="admin-btn-sm" onclick="editUser('${user.id}')" title="Edit">
                  <i data-lucide="edit-2" style="width:12px;height:12px"></i>
                </button>
                <button class="admin-btn-sm admin-btn-danger" onclick="deleteUserConfirm('${user.id}')" title="Delete">
                  <i data-lucide="trash-2" style="width:12px;height:12px"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  lucide.createIcons();
}

function renderUsersPagination(pagination) {
  const container = document.getElementById('users-pagination');
  if (!container) return;

  const { page, pages, total } = pagination;
  
  container.innerHTML = `
    <button class="admin-pagination-btn" ${page <= 1 ? 'disabled' : ''} onclick="changeUsersPage(${page - 1})">
      <i data-lucide="chevron-left" style="width:12px;height:12px"></i>
    </button>
    
    ${Array.from({length: Math.min(pages, 5)}, (_, i) => {
      const pageNum = Math.max(1, page - 2) + i;
      if (pageNum > pages) return '';
      return `
        <button class="admin-pagination-btn ${pageNum === page ? 'active' : ''}" onclick="changeUsersPage(${pageNum})">
          ${pageNum}
        </button>
      `;
    }).join('')}
    
    <button class="admin-pagination-btn" ${page >= pages ? 'disabled' : ''} onclick="changeUsersPage(${page + 1})">
      <i data-lucide="chevron-right" style="width:12px;height:12px"></i>
    </button>
    
    <span style="margin-left:16px;font-size:12px;color:var(--text-muted)">
      ${total} total users
    </span>
  `;

  lucide.createIcons();
}

function changeUsersPage(page) {
  currentUsersPage = page;
  loadUsersData();
}

function searchUsers(query) {
  usersSearchQuery = query;
  currentUsersPage = 1;
  loadUsersData();
}

// ── User Actions ──
function editUser(userId) {
  showToast('Edit user functionality coming soon!');
}

async function deleteUserConfirm(userId) {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    return;
  }

  try {
    await AdminAPI.deleteUser(userId);
    showToast('User deleted successfully.');
    loadUsersData();
  } catch (error) {
    console.error('[Admin] Delete user error:', error);
    showToast('Failed to delete user.');
  }
}

// ── Other Page Loaders ──
function loadCoursesData() {
  const container = document.getElementById('admin-courses-grid');
  if (!container) return;

  // Static course data for now
  const courses = [
    { id: 1, title: 'Machine Learning Fundamentals', students: 1250, status: 'active' },
    { id: 2, title: 'Python for AI', students: 980, status: 'active' },
    { id: 3, title: 'Deep Learning Essentials', students: 750, status: 'active' },
    { id: 4, title: 'Natural Language Processing', students: 620, status: 'active' },
    { id: 5, title: 'Computer Vision with Python', students: 540, status: 'active' },
    { id: 6, title: 'Data Science with AI', students: 430, status: 'active' },
    { id: 7, title: 'Reinforcement Learning', students: 320, status: 'active' },
    { id: 8, title: 'AI Ethics & Safety', students: 280, status: 'active' }
  ];

  container.innerHTML = courses.map(course => `
    <div class="admin-course-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
        <h4 style="font-size:14px;font-weight:600;color:var(--text-primary)">${course.title}</h4>
        <span class="badge badge-green" style="font-size:10px">${course.status}</span>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
        ${course.students} students enrolled
      </div>
      <div style="display:flex;gap:8px">
        <button class="admin-btn admin-btn-outline" style="padding:6px 12px;font-size:11px">
          <i data-lucide="edit-2" style="width:12px;height:12px"></i>
          Edit
        </button>
        <button class="admin-btn admin-btn-outline" style="padding:6px 12px;font-size:11px">
          <i data-lucide="bar-chart" style="width:12px;height:12px"></i>
          Analytics
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function loadPaymentsData() {
  const container = document.getElementById('payments-table');
  if (!container) return;

  // Sample payments data
  const payments = [
    { id: 'pay_1', user: 'John Doe', amount: 99000, plan: 'Pro Monthly', status: 'succeeded', date: '2024-01-15' },
    { id: 'pay_2', user: 'Jane Smith', amount: 594000, plan: 'Pro Yearly', status: 'succeeded', date: '2024-01-14' },
    { id: 'pay_3', user: 'Bob Wilson', amount: 99000, plan: 'Pro Monthly', status: 'failed', date: '2024-01-13' },
  ];

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>User</th>
          <th>Amount</th>
          <th>Plan</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map(payment => `
          <tr>
            <td style="font-family:monospace;font-size:11px">${payment.id}</td>
            <td style="font-size:12px">${payment.user}</td>
            <td style="font-size:12px;font-weight:600">Rp ${payment.amount.toLocaleString()}</td>
            <td style="font-size:12px">${payment.plan}</td>
            <td>
              <span class="badge ${payment.status === 'succeeded' ? 'badge-green' : payment.status === 'failed' ? 'badge-red' : 'badge-yellow'}" style="font-size:10px">
                ${payment.status}
              </span>
            </td>
            <td style="font-size:12px;color:var(--text-muted)">
              ${new Date(payment.date).toLocaleDateString()}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function loadAnalyticsData() {
  try {
    const analytics = await AdminAPI.getAnalytics();
    renderPlatformAnalytics(analytics);
  } catch (error) {
    console.error('[Admin] Failed to load analytics:', error);
    showToast('Failed to load analytics data.');
  }
}

function renderPlatformAnalytics(analytics) {
  const ctx = document.getElementById('platform-analytics-chart');
  if (!ctx || !analytics) return;

  // Sample analytics chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Free Users', 'Pro Users', 'Team Users'],
      datasets: [{
        data: [70, 25, 5],
        backgroundColor: [
          'rgba(124,58,237,0.8)',
          'rgba(245,158,11,0.8)',
          'rgba(59,130,246,0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// ── Utility Functions ──
function refreshData() {
  const currentPage = document.querySelector('.admin-page.active').id.replace('admin-page-', '');
  loadPageData(currentPage);
  showToast('Data refreshed!');
}

function exportUsers() {
  showToast('Export functionality coming soon!');
}

function showAddCourseModal() {
  showToast('Add course functionality coming soon!');
}

function filterPayments(status) {
  showToast(`Filtering payments by: ${status}`);
}

function doLogout() {
  clearSession();
  window.location.href = '/login';
}

function generateFallbackAdminData() {
  return {
    stats: {
      totalUsers: 1250,
      activeUsers: 890,
      totalCourses: 8,
      totalPayments: { count: 156, revenue: 15600000 }
    },
    recentUsers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', account_type: 'pro', joined_at: '2024-01-15T10:00:00Z' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', account_type: 'free', joined_at: '2024-01-14T15:30:00Z' },
      { id: '3', name: 'Bob Wilson', email: 'bob@example.com', account_type: 'pro', joined_at: '2024-01-13T09:15:00Z' }
    ],
    topCourses: [
      { courseId: 1, name: 'Machine Learning Fundamentals', students: 450 },
      { courseId: 2, name: 'Python for AI', students: 380 },
      { courseId: 3, name: 'Deep Learning Essentials', students: 320 }
    ],
    revenueStats: [
      { month: 'Aug 2024', revenue: 2400000 },
      { month: 'Sep 2024', revenue: 2800000 },
      { month: 'Oct 2024', revenue: 3200000 },
      { month: 'Nov 2024', revenue: 3600000 },
      { month: 'Dec 2024', revenue: 4200000 },
      { month: 'Jan 2025', revenue: 4800000 }
    ]
  };
}

// Add small button styles
const style = document.createElement('style');
style.textContent = `
  .admin-btn-sm {
    padding: 4px 6px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .admin-btn-sm:hover {
    background: var(--input-bg);
    color: var(--text-primary);
  }
  .admin-btn-danger:hover {
    background: var(--danger);
    color: #fff;
    border-color: var(--danger);
  }
`;
document.head.appendChild(style);