// ── Courses Data & Filter ──

const coursesData = [
  { id: 1, title: 'Machine Learning Fundamentals', level: 'Beginner', category: 'Machine Learning', thumbIcon: 'brain-circuit', thumbBg: 'linear-gradient(135deg,#1e1b4b,#312e81)', thumbColor: '#a78bfa', duration: '8h 30m', students: '2.1k', rating: 4.8, progress: 70, status: 'continue' },
  { id: 2, title: 'Python for AI', level: 'Beginner', category: 'Machine Learning', thumbIcon: 'code-2', thumbBg: 'linear-gradient(135deg,#14532d,#166534)', thumbColor: '#4ade80', duration: '6h 15m', students: '3.4k', rating: 4.9, progress: 45, status: 'continue' },
  { id: 3, title: 'Deep Learning Essentials', level: 'Intermediate', category: 'Deep Learning', thumbIcon: 'network', thumbBg: 'linear-gradient(135deg,#1e3a5f,#1e40af)', thumbColor: '#60a5fa', duration: '12h 45m', students: '1.8k', rating: 4.7, progress: 25, status: 'continue' },
  { id: 4, title: 'Natural Language Processing', level: 'Intermediate', category: 'NLP', thumbIcon: 'message-square-text', thumbBg: 'linear-gradient(135deg,#3b1f5e,#6d28d9)', thumbColor: '#c084fc', duration: '10h 20m', students: '1.2k', rating: 4.6, progress: 0, status: 'start' },
  { id: 5, title: 'Computer Vision with Python', level: 'Beginner', category: 'Computer Vision', thumbIcon: 'scan-eye', thumbBg: 'linear-gradient(135deg,#1c3a2e,#065f46)', thumbColor: '#34d399', duration: '9h 10m', students: '2.5k', rating: 4.8, progress: 0, status: 'start' },
  { id: 6, title: 'Data Science with AI', level: 'Beginner', category: 'Data Science', thumbIcon: 'database', thumbBg: 'linear-gradient(135deg,#1c2a4a,#1e3a8a)', thumbColor: '#818cf8', duration: '11h 50m', students: '4.1k', rating: 4.9, progress: 0, status: 'start' },
  { id: 7, title: 'Reinforcement Learning', level: 'Advanced', category: 'Deep Learning', thumbIcon: 'gamepad-2', thumbBg: 'linear-gradient(135deg,#3b1a1a,#7f1d1d)', thumbColor: '#f87171', duration: '15h 30m', students: '890', rating: 4.7, progress: 0, status: 'coming' },
  { id: 8, title: 'AI Ethics & Safety', level: 'Beginner', category: 'Data Science', thumbIcon: 'shield-check', thumbBg: 'linear-gradient(135deg,#1a2e1a,#14532d)', thumbColor: '#86efac', duration: '5h 20m', students: '1.5k', rating: 4.5, progress: 0, status: 'coming' },
];

let activeLevel = 'All';
let activeCategory = 'All';
let searchQuery = '';

function renderCourses() {
  const container = document.getElementById('courses-grid');
  if (!container) return;

  // Ambil status klaim pengguna
  const session = getSession();
  const userId = session ? String(session.id) : null;
  const claimedMap = {};
  if (userId && typeof getClaimedCourses === 'function') {
    getClaimedCourses(userId).forEach(c => { claimedMap[c.courseId] = c; });
  }

  let filtered = coursesData.filter(c => {
    const matchLevel = activeLevel === 'All' || c.level === activeLevel;
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">🔍</div>
      <p>Kursus tidak ditemukan</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const claimed = claimedMap[c.id];
    const isExpired = claimed && claimed.status === 'expired';
    const isClaimed = claimed && !isExpired;
    const isLocked = !claimed && c.status !== 'coming';

    let statusBadge = '';
    let lockOverlay = '';
    if (isClaimed) {
      statusBadge = `<span class="badge badge-green" style="font-size:10px">✓ Diklaim</span>`;
    } else if (isExpired) {
      statusBadge = `<span class="badge badge-yellow" style="font-size:10px">⏰ Kedaluwarsa</span>`;
    } else if (isLocked) {
      lockOverlay = `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);border-radius:6px;padding:4px 8px;font-size:10px;color:rgba(255,255,255,0.7);display:flex;align-items:center;gap:4px"><i data-lucide="lock" style="width:10px;height:10px"></i> Terkunci</div>`;
    }

    const btnLabel = c.status === 'coming' ? 'Coming Soon'
      : isExpired ? 'Akses Berakhir'
      : isClaimed ? (c.progress > 0 ? 'Continue' : 'Start')
      : 'Lihat Preview';

    return `
    <div class="course-card" onclick="openCourse(${c.id})" style="position:relative">
      <div class="course-thumb" style="background:${c.thumbBg};position:relative">
        <i data-lucide="${c.thumbIcon}" style="width:48px;height:48px;color:${c.thumbColor}"></i>
        ${lockOverlay}
      </div>
      <div class="course-body">
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          <span class="badge badge-purple">${c.category}</span>
          <span class="badge ${c.level === 'Beginner' ? 'badge-green' : c.level === 'Advanced' ? 'badge-yellow' : 'badge-purple'}">${c.level}</span>
          ${statusBadge}
        </div>
        <h4>${c.title}</h4>
        <div class="course-level">⭐ ${c.rating} · ${c.students} students</div>
        ${c.progress > 0 && isClaimed ? `
          <div class="course-progress-label">
            <span>Progress</span><span>${c.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" data-width="${c.progress}" style="width:${c.progress}%"></div>
          </div>
        ` : ''}
        <div class="course-meta">
          <span>⏱️ ${c.duration}</span>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:11px" onclick="event.stopPropagation();openCourse(${c.id})">
            ${btnLabel}
          </button>
        </div>
      </div>
    </div>
  `}).join('');
  lucide.createIcons();
}

// openCourse is defined in course-detail.js (opens modal with full content)

function initCourses() {
  // Level tabs
  document.querySelectorAll('.level-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeLevel = tab.dataset.level;
      renderCourses();
    });
  });

  // Category filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.cat;
      renderCourses();
    });
  });

  // Search
  const searchInput = document.getElementById('courses-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderCourses();
    });
  }

  renderCourses();
}

document.addEventListener('DOMContentLoaded', initCourses);

