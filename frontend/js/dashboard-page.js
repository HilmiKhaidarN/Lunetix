// ══ DASHBOARD PAGE ══

const dbStudyTips = [
  'Review material in spaced intervals to improve long-term retention.',
  'Practice coding every day, even just 15 minutes makes a big difference.',
  'Teach what you learn — explaining concepts solidifies your understanding.',
  'Build projects alongside courses to apply theory in practice.',
  'Focus on understanding concepts, not memorizing syntax.',
];

async function initDashboard() {
  try {
    await renderDbDynamicStats();
    await renderDbCourses();
    renderDbProgressBars();
    renderDbUpcoming();
    renderDbMiniCalendar();
    renderDbAchievements();
    await renderDbRecentActivity();
    renderDbStreak();
    renderDbStudyTip();
    setTimeout(() => {
      document.querySelectorAll('.db-progress-bar-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%');
      document.querySelectorAll('.progress-fill[data-width]').forEach(el => el.style.width = el.dataset.width + '%');
    }, 200);
    lucide.createIcons();
  } catch(err) {
    console.error('[Dashboard] Error:', err);
    // Render minimal fallback supaya tidak blank
    const statsEl = document.getElementById('db-stats-bar-dynamic');
    if (statsEl) statsEl.innerHTML = '';
    const coursesEl = document.getElementById('db-courses-row');
    if (coursesEl) coursesEl.innerHTML = `<div style="padding:20px;color:var(--text-muted);font-size:13px">Gagal memuat data. Coba refresh halaman.</div>`;
    renderDbMiniCalendar();
    renderDbStudyTip();
    lucide.createIcons();
  }
}

// ── Stats dari data real ──
async function renderDbDynamicStats() {
  const el = document.getElementById('db-stats-bar-dynamic'); if (!el) return;
  const session = getSession();

  // Ambil kursus yang diklaim
  let claimedCount = 0;
  let completedLessonsCount = 0;
  try {
    const claimed = await getClaimedCoursesAsync(String(session?.id));
    claimedCount = claimed.filter(c => c.status === 'active').length;
    // Hitung total lesson selesai dari semua kursus
    for (const c of claimed) {
      const completed = await getCompletedLessonsAsync(c.courseId);
      completedLessonsCount += completed.length;
    }
  } catch (e) {}

  const scores = store.get('quiz_scores', {});
  const avgScore = Object.keys(scores).length
    ? Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
    : 0;

  const stats = [
    { val: claimedCount || 0,         label:'Courses Active',      sub: claimedCount ? 'Keep going!' : 'Klaim kursus dulu!', icon:'book-open',    bg:'rgba(124,58,237,0.15)', color:'#a78bfa', page:'courses' },
    { val: completedLessonsCount || 0, label:'Completed Lessons',   sub: completedLessonsCount ? '+' + completedLessonsCount + ' total' : 'Mulai belajar!', icon:'check-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa', page:'analytics' },
    { val: Object.keys(scores).length || 0, label:'Quizzes Taken',  sub: avgScore ? 'Avg ' + avgScore + '%' : 'Belum ada quiz', icon:'help-circle',  bg:'rgba(16,185,129,0.15)', color:'#34d399', page:'quizzes' },
    { val: avgScore ? avgScore + '%' : '-', label:'Avg. Quiz Score', sub: avgScore ? 'Keep it up!' : 'Coba quiz sekarang', icon:'target',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24', page:'quizzes' },
  ];

  el.innerHTML = stats.map(s => `
    <div class="db-stat-card" onclick="window.navigateTo&&navigateTo('${s.page}')" style="cursor:pointer">
      <div class="db-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i></div>
      <div class="db-stat-body">
        <div class="db-stat-val">${s.val}</div>
        <div class="db-stat-label">${s.label}</div>
        <div class="db-stat-sub">${s.sub}</div>
      </div>
      <i data-lucide="arrow-right" style="width:14px;height:14px;color:var(--text-muted);margin-left:auto"></i>
    </div>`).join('');
  lucide.createIcons();
}

// ── Courses dari kursus yang diklaim user ──
async function renderDbCourses() {
  const el = document.getElementById('db-courses-row'); if (!el) return;
  const session = getSession();

  let claimed = [];
  try {
    claimed = await getClaimedCoursesAsync(String(session?.id));
    claimed = claimed.filter(c => c.status === 'active');
  } catch (e) {}

  if (!claimed.length) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted)">
      <i data-lucide="book-open" style="width:32px;height:32px;margin-bottom:12px;opacity:0.4"></i>
      <div style="font-size:13px">Belum ada kursus aktif.</div>
      <button class="btn btn-primary" style="margin-top:12px;padding:8px 20px;font-size:12px" onclick="navigateTo('courses')">Lihat Kursus</button>
    </div>`;
    lucide.createIcons();
    return;
  }

  const rows = [];
  for (const access of claimed) {
    const course = coursesData.find(c => c.id === access.courseId);
    if (!course) continue;
    const allLessons = getCourseAllLessons(access.courseId);
    let completed = [];
    try { completed = await getCompletedLessonsAsync(access.courseId); } catch(e) {}
    const progress = allLessons.length ? Math.round((completed.length / allLessons.length) * 100) : 0;
    rows.push({ course, progress, completed: completed.length, total: allLessons.length });
  }

  el.innerHTML = rows.map(({ course: c, progress, completed, total }) => `
    <div class="db-course-card" onclick="openCourse(${c.id})">
      <div class="db-course-thumb" style="background:${c.thumbBg}">
        <i data-lucide="${c.thumbIcon}" style="width:44px;height:44px;color:${c.thumbColor}"></i>
        <div class="db-course-level-badge">${c.level}</div>
      </div>
      <div class="db-course-body">
        <div class="db-course-title">${c.title}</div>
        <div class="db-course-progress-row"><span>${progress}%</span></div>
        <div class="progress-bar" style="height:3px;margin-bottom:8px">
          <div class="progress-fill" data-width="${progress}" style="width:0%;background:${c.thumbColor}"></div>
        </div>
        <div class="db-course-footer">
          <div class="db-course-lessons">${completed} / ${total} lessons</div>
          <button class="db-course-play"><i data-lucide="play" style="width:11px;height:11px;color:#fff;margin-left:1px"></i></button>
        </div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

// ── Progress bars dari kursus yang diklaim ──
async function renderDbProgressBars() {
  const barsEl   = document.getElementById('db-progress-bars');
  const statsEl  = document.getElementById('db-progress-stats');
  const ringPct  = document.getElementById('db-ring-pct');
  const ringOffset = document.getElementById('db-ring-offset');
  const session  = getSession();

  let claimed = [];
  try { claimed = await getClaimedCoursesAsync(String(session?.id)); } catch(e) {}
  claimed = claimed.filter(c => c.status === 'active');

  const bars = [];
  const colorMap = { 1:'#a78bfa', 2:'#4ade80', 3:'#60a5fa', 4:'#c084fc', 5:'#34d399', 6:'#818cf8' };

  for (const access of claimed) {
    const course = coursesData.find(c => c.id === access.courseId);
    if (!course) continue;
    const allLessons = getCourseAllLessons(access.courseId);
    let completed = [];
    try { completed = await getCompletedLessonsAsync(access.courseId); } catch(e) {}
    const pct = allLessons.length ? Math.round((completed.length / allLessons.length) * 100) : 0;
    bars.push({ label: course.title.split(' ').slice(0,2).join(' '), pct, color: colorMap[course.id] || '#a78bfa' });
  }

  const overall = bars.length ? Math.round(bars.reduce((s,b)=>s+b.pct,0)/bars.length) : 0;
  const circumference = 251;
  const offset = circumference - (overall/100)*circumference;

  if (ringPct) ringPct.textContent = overall + '%';
  if (ringOffset) ringOffset.style.strokeDashoffset = offset;

  if (!barsEl) return;

  if (!bars.length) {
    barsEl.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada kursus aktif.</div>`;
    if (statsEl) statsEl.innerHTML = '';
    return;
  }

  barsEl.innerHTML = bars.map(b => `
    <div class="db-progress-bar-row">
      <div class="db-progress-bar-label">${b.label}</div>
      <div class="db-progress-bar-track"><div class="db-progress-bar-fill" data-w="${b.pct}" style="width:0%;background:${b.color}"></div></div>
      <div class="db-progress-bar-pct">${b.pct}%</div>
    </div>`).join('');

  const totalLessons = bars.length;
  const session2 = getSession();
  if (statsEl) statsEl.innerHTML = `
    <div class="db-ps-item"><div class="db-ps-val" style="color:#60a5fa">${overall}%</div><div class="db-ps-label">Overall Progress</div></div>
    <div class="db-ps-item"><div class="db-ps-val" style="color:#34d399">${bars.length}</div><div class="db-ps-label">Active Courses</div></div>
    <div class="db-ps-item"><div class="db-ps-val" style="color:#fbbf24">${session2?.points || 0}</div><div class="db-ps-label">Points Earned</div></div>`;

  setTimeout(() => document.querySelectorAll('.db-progress-bar-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%'), 100);
}

// ── Upcoming: kosong jika tidak ada data real ──
function renderDbUpcoming() {
  const el = document.getElementById('db-upcoming-list'); if (!el) return;
  el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">
    <i data-lucide="calendar" style="width:24px;height:24px;margin-bottom:8px;opacity:0.4"></i>
    <div>Belum ada jadwal mendatang.</div>
  </div>`;
  lucide.createIcons();
}

function renderDbMiniCalendar() {
  const el = document.getElementById('db-mini-calendar'); if (!el) return;
  const now = new Date();
  const month = now.toLocaleString('default',{month:'long'});
  const year = now.getFullYear();
  const today = now.getDate();
  const firstDay = new Date(now.getFullYear(),now.getMonth(),1).getDay();
  const daysInMonth = new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const dayLabels = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  let cells = '';
  for (let i=0;i<firstDay;i++) cells+=`<div class="db-cal-day"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const isToday = d === today;
    cells+=`<div class="db-cal-day ${isToday?'today':''}">${d}</div>`;
  }
  el.innerHTML = `<div class="db-calendar">
    <div class="db-cal-header"><span>${month} ${year}</span></div>
    <div class="db-cal-days">${dayLabels.map(d=>`<div class="db-cal-day-label">${d}</div>`).join('')}${cells}</div>
  </div>`;
}

// ── Achievements: kosong untuk user baru ──
function renderDbAchievements() {
  const el = document.getElementById('db-achievements-list'); if (!el) return;
  const scores = store.get('quiz_scores', {});
  const achievements = [];

  // Cek achievement berdasarkan data real
  if (Object.keys(scores).length > 0) {
    achievements.push({ title:'First Quiz', desc:'Completed your first quiz', icon:'help-circle', bg:'rgba(124,58,237,0.15)', color:'#a78bfa', done:true });
  }
  const bestScore = Object.values(scores).length ? Math.max(...Object.values(scores)) : 0;
  if (bestScore >= 90) {
    achievements.push({ title:'Quiz Master', desc:'Score 90%+ on a quiz', icon:'target', bg:'rgba(245,158,11,0.15)', color:'#fbbf24', done:true });
  }

  if (!achievements.length) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">
      <i data-lucide="award" style="width:24px;height:24px;margin-bottom:8px;opacity:0.4"></i>
      <div>Selesaikan kursus & quiz untuk dapat achievement.</div>
    </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = achievements.map(a => `
    <div class="db-achievement-item">
      <div class="db-ach-icon" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:16px;height:16px;color:${a.color}"></i></div>
      <div style="flex:1"><div class="db-ach-title">${a.title}</div><div class="db-ach-desc">${a.desc}</div></div>
      <div class="db-ach-badge"><div style="width:22px;height:22px;border-radius:50%;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center"><i data-lucide="check" style="width:12px;height:12px;color:#34d399"></i></div></div>
    </div>`).join('');
  lucide.createIcons();
}

// ── Recent Activity dari notifikasi API ──
async function renderDbRecentActivity() {
  const el = document.getElementById('db-recent-activity'); if (!el) return;
  const session = getSession();
  if (!session) { el.innerHTML = ''; return; }

  let activities = [];
  try {
    const data = await NotificationsAPI.getAll();
    activities = data.notifications.slice(0, 4).map(n => ({
      text:  n.text,
      time:  timeAgo(n.created_at),
      icon:  n.icon,
      bg:    n.icon_bg,
      color: n.icon_color,
    }));
  } catch(e) {}

  if (!activities.length) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">
      <i data-lucide="activity" style="width:24px;height:24px;margin-bottom:8px;opacity:0.4"></i>
      <div>Belum ada aktivitas.</div>
    </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = activities.map(a => `
    <div class="db-recent-item" onclick="window.navigateTo&&navigateTo('analytics')" style="cursor:pointer">
      <div class="db-recent-dot" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:12px;height:12px;color:${a.color}"></i></div>
      <div style="flex:1"><div class="db-recent-text">${a.text}</div><div class="db-recent-time">${a.time}</div></div>
    </div>`).join('');
  lucide.createIcons();
}

// ── Streak dari session ──
function renderDbStreak() {
  const el = document.getElementById('db-streak-dots'); if (!el) return;
  const session = getSession();
  const streak = session?.streak || 0;
  const titleEl = document.getElementById('db-streak-title');
  if (titleEl) titleEl.textContent = streak + ' Day Streak';
  const days = ['SAT','SUN','MON','TUE','WED','THU','FRI'];
  el.innerHTML = `<div class="db-streak-dots">${days.map((d,i)=>`
    <div style="text-align:center">
      <div class="db-streak-dot ${i < streak ? 'active' : 'miss'}">${i < streak ? '🔥' : ''}</div>
      <div style="font-size:9px;color:var(--text-muted);margin-top:3px">${d}</div>
    </div>`).join('')}</div>`;
}

function renderDbStudyTip() {
  const el = document.getElementById('db-study-tip'); if (!el) return;
  el.textContent = dbStudyTips[Math.floor(Math.random()*dbStudyTips.length)];
}
