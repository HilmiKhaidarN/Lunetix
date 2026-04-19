// ══ ANALYTICS ══

let anData = null; // Cache data dari API
let advancedAnalyticsData = null; // Cache advanced analytics

const anInsights = [
  { title:'Tips Belajar',   desc:'Belajar 30 menit setiap hari lebih efektif daripada sekali seminggu.', tag:'Konsisten', tagBg:'rgba(59,130,246,0.15)', tagColor:'#60a5fa', icon:'clock', iconBg:'rgba(59,130,246,0.15)', iconColor:'#60a5fa' },
  { title:'Rekomendasi',    desc:'Selesaikan kursus yang sudah diklaim sebelum mengambil yang baru.',     tag:'Fokus',     tagBg:'rgba(245,158,11,0.15)', tagColor:'#fbbf24', icon:'zap',   iconBg:'rgba(245,158,11,0.15)', iconColor:'#fbbf24' },
  { title:'Konsistensi',    desc:'Streak harian membantu membangun kebiasaan belajar yang kuat.',         tag:'Habit',     tagBg:'rgba(239,68,68,0.15)',  tagColor:'#f87171', icon:'flame', iconBg:'rgba(239,68,68,0.15)',  iconColor:'#f87171' },
];

async function renderAnalytics() {
  // Load data dari API
  try {
    anData = await AnalyticsAPI.getSummary();
    advancedAnalyticsData = await AnalyticsAPI.getAdvanced();
  } catch (e) {
    console.warn('[Analytics] API tidak tersedia, pakai data lokal.', e);
    anData = null;
    advancedAnalyticsData = generateFallbackAdvancedAnalytics();
  }

  renderAnStats();
  await renderAnCourseProgress();
  renderAnBarChart();
  renderAnStreak();
  renderAnDonut();
  renderAnLine();
  await renderAnRecent();
  renderAnInsights();
  renderAnRadar();
  
  // Render advanced analytics if available
  if (advancedAnalyticsData) {
    renderAdvancedAnalytics();
  }

  setTimeout(() => {
    document.querySelectorAll('.an-course-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%');
  }, 200);
}

// ── Stats Bar ──
function renderAnStats() {
  const el = document.getElementById('an-stats-bar'); if (!el) return;

  const totalLessons = anData?.totalLessons ?? 0;
  const activeCourses = anData?.activeCourses ?? 0;
  const totalQuizzes = anData?.totalQuizzes ?? 0;
  const avgScore = anData?.avgScore ?? 0;

  const stats = [
    { val: totalLessons,                    label:'Lesson Selesai',   trend: totalLessons ? '+' + totalLessons + ' total' : 'Mulai belajar!',         icon:'check-circle', bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val: activeCourses,                   label:'Kursus Aktif',     trend: activeCourses ? activeCourses + ' kursus' : 'Klaim kursus dulu!',         icon:'book-open',    bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    { val: totalQuizzes,                    label:'Quiz Dikerjakan',   trend: totalQuizzes ? totalQuizzes + ' quiz' : 'Belum ada quiz',                 icon:'help-circle',  bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val: avgScore ? avgScore + '%' : '-', label:'Rata-rata Skor',   trend: avgScore ? 'Keep it up!' : 'Coba quiz sekarang',                          icon:'target',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  ];

  el.innerHTML = stats.map(s => `<div class="an-stat-card">
    <div class="an-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i></div>
    <div style="flex:1"><div class="an-stat-val">${s.val}</div><div class="an-stat-label">${s.label}</div><div class="an-stat-trend">${s.trend}</div></div>
  </div>`).join('');
  lucide.createIcons();
}

// ── Bar Chart: Lesson per hari (7 hari terakhir) ──
function renderAnBarChart() {
  const chart = document.getElementById('an-bar-chart');
  const labelsEl = document.getElementById('an-bar-labels');
  if (!chart) return;

  const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const lessonsByDay = anData?.lessonsByDay || [];
  const maxCount = Math.max(...lessonsByDay.map(d => d.count), 1);

  chart.innerHTML = lessonsByDay.map((d, i) => {
    const pct = Math.max((d.count / maxCount) * 100, 4);
    const dayName = dayNames[new Date(d.date).getDay()];
    const isToday = i === lessonsByDay.length - 1;
    const color = isToday ? 'var(--accent)' : d.count > 0 ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.15)';
    return `
      <div class="an-bar-col">
        <div class="an-bar-val">${d.count > 0 ? d.count : ''}</div>
        <div class="an-bar" style="height:${pct}%;background:${color}">
          <div class="an-bar-tooltip">${d.count} lesson</div>
        </div>
      </div>`;
  }).join('');

  if (labelsEl) {
    labelsEl.innerHTML = lessonsByDay.map(d => {
      const dayName = dayNames[new Date(d.date).getDay()];
      return `<div class="an-bar-label" style="flex:1;text-align:center">${dayName}</div>`;
    }).join('');
  }

  const bestDayEl = document.getElementById('an-best-day');
  const peakEl    = document.getElementById('an-peak-time');
  const tipEl     = document.getElementById('an-productivity-tip');
  const totalWeek = anData?.totalLessonsThisWeek || 0;

  if (bestDayEl) bestDayEl.textContent = anData?.bestDay || '-';
  if (peakEl)   peakEl.textContent = totalWeek + ' lesson minggu ini';
  if (tipEl) {
    tipEl.innerHTML = totalWeek > 0
      ? `<i data-lucide="trending-up" style="width:12px;height:12px"></i> ${totalWeek} lesson diselesaikan minggu ini. Bagus!`
      : `<i data-lucide="info" style="width:12px;height:12px"></i> Mulai belajar untuk melihat statistik aktivitasmu!`;
    lucide.createIcons();
  }
}

// ── Course Progress ──
async function renderAnCourseProgress() {
  const el = document.getElementById('an-course-progress'); if (!el) return;
  const session = getSession();
  const colorMap = { 1:'#a78bfa', 2:'#4ade80', 3:'#60a5fa', 4:'#c084fc', 5:'#34d399', 6:'#818cf8', 7:'#f87171', 8:'#86efac' };
  const iconMap  = { 1:'brain-circuit', 2:'code-2', 3:'network', 4:'message-square-text', 5:'scan-eye', 6:'database', 7:'gamepad-2', 8:'shield-check' };
  const bgMap    = { 1:'rgba(124,58,237,0.15)', 2:'rgba(16,185,129,0.15)', 3:'rgba(59,130,246,0.15)', 4:'rgba(168,85,247,0.15)', 5:'rgba(16,185,129,0.15)', 6:'rgba(59,130,246,0.15)', 7:'rgba(239,68,68,0.15)', 8:'rgba(134,239,172,0.15)' };

  let rows = [];
  let overallPct = 0;

  try {
    const claimed = await getClaimedCoursesAsync(String(session?.id));
    for (const access of claimed) {
      const course = coursesData.find(c => c.id === access.courseId);
      if (!course) continue;
      const allLessons = getCourseAllLessons(access.courseId);
      let completed = [];
      try { completed = await getCompletedLessonsAsync(access.courseId); } catch(e) {}
      const pct = allLessons.length ? Math.round((completed.length / allLessons.length) * 100) : 0;
      rows.push({ name: course.title, pct, icon: iconMap[course.id] || 'book-open', bg: bgMap[course.id] || 'rgba(124,58,237,0.15)', color: colorMap[course.id] || '#a78bfa' });
    }
    overallPct = rows.length ? Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length) : 0;
  } catch(e) {}

  if (!rows.length) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada kursus aktif.</div>`;
  } else {
    el.innerHTML = rows.map(c => `<div class="an-course-row">
      <div class="an-course-icon" style="background:${c.bg}"><i data-lucide="${c.icon}" style="width:13px;height:13px;color:${c.color}"></i></div>
      <div class="an-course-name" title="${c.name}">${c.name}</div>
      <div class="an-course-track"><div class="an-course-fill" data-w="${c.pct}" style="width:0%;background:${c.color}"></div></div>
      <div class="an-course-pct">${c.pct}%</div>
    </div>`).join('');
  }

  // Update overall progress badge
  const overallEl = document.querySelector('.an-activity-card + .card .an-overall-pct');
  const overallBadge = document.getElementById('an-overall-badge');
  if (overallBadge) {
    overallBadge.textContent = overallPct + '%';
    overallBadge.style.background = overallPct >= 80 ? 'var(--success)' : overallPct >= 50 ? 'var(--accent)' : 'rgba(124,58,237,0.5)';
  }

  lucide.createIcons();
}

// ── Streak ──
function renderAnStreak() {
  const el = document.getElementById('an-streak-week'); if (!el) return;
  const session = getSession();
  const streak = anData?.currentStreak ?? session?.streak ?? 0;

  // Update streak value display
  const streakValEl = document.getElementById('an-streak-val');
  if (streakValEl) streakValEl.textContent = streak + (streak === 1 ? ' hari' : ' hari');

  const streakDays = anData?.streakDays || [];
  const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

  if (streakDays.length) {
    el.innerHTML = streakDays.map(d => {
      const dayName = dayNames[new Date(d.date).getDay()];
      const isToday = d.date === new Date(Date.now() + 7*60*60*1000).toISOString().slice(0,10);
      const cls = d.active ? (isToday ? 'today' : 'done') : 'miss';
      return `<div class="an-streak-day">
        <div class="an-streak-dot ${cls}">${d.active ? '<i data-lucide="check" style="width:14px;height:14px;color:#fff"></i>' : ''}</div>
        <div class="an-streak-day-label">${dayName}</div>
      </div>`;
    }).join('');
  } else {
    // Fallback: tampilkan berdasarkan streak count
    const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
    el.innerHTML = days.map((d, i) => `<div class="an-streak-day">
      <div class="an-streak-dot ${i < streak ? 'done' : 'miss'}">${i < streak ? '<i data-lucide="check" style="width:14px;height:14px;color:#fff"></i>' : ''}</div>
      <div class="an-streak-day-label">${d}</div>
    </div>`).join('');
  }
  lucide.createIcons();
}

// ── Donut: distribusi lesson per kursus ──
function renderAnDonut() {
  const canvas = document.getElementById('an-donut');
  const legend = document.getElementById('an-donut-legend');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx=60, cy=60, r=48, inner=32;
  ctx.clearRect(0,0,120,120);

  const lessonsByCourse = anData?.lessonsByCourse || {};
  const total = Object.values(lessonsByCourse).reduce((a,b) => a+b, 0);

  if (!total) {
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#12122a'; ctx.fill();
    if (legend) legend.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:11px;padding:8px">Data akan muncul setelah kamu mulai belajar.</div>`;
    return;
  }

  const colors = ['#a78bfa','#4ade80','#60a5fa','#c084fc','#34d399','#818cf8','#f87171','#86efac'];
  const courseNames = { 1:'ML', 2:'Python', 3:'Deep Learning', 4:'NLP', 5:'CV', 6:'Data Science', 7:'RL', 8:'AI Ethics' };

  let startAngle = -Math.PI / 2;
  const entries = Object.entries(lessonsByCourse).filter(([,v]) => v > 0);

  entries.forEach(([courseId, count], i) => {
    const slice = (count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    startAngle += slice;
  });

  // Inner circle
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#12122a'; ctx.fill();

  // Total text
  ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 13px Inter'; ctx.textAlign='center';
  ctx.fillText(total, cx, cy+2);
  ctx.font='9px Inter'; ctx.fillStyle='rgba(255,255,255,0.4)';
  ctx.fillText('lessons', cx, cy+13);

  // Legend
  if (legend) {
    legend.innerHTML = entries.slice(0,4).map(([courseId, count], i) => `
      <div class="an-donut-legend-item">
        <div class="an-donut-dot" style="background:${colors[i % colors.length]}"></div>
        <div class="an-donut-label">${courseNames[courseId] || 'Kursus ' + courseId}</div>
        <div class="an-donut-pct">${count}</div>
      </div>`).join('');
  }
}

// ── Line Chart: Quiz score history ──
function renderAnLine() {
  const canvas = document.getElementById('an-line'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w=canvas.width, h=canvas.height;
  const pad={t:14,r:14,b:14,l:24}, cw=w-pad.l-pad.r, ch=h-pad.t-pad.b;
  ctx.clearRect(0,0,w,h);

  // Grid lines
  [0,50,100].forEach(v => {
    const y=pad.t+ch-(v/100)*ch;
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='9px Inter'; ctx.fillText(v+'%',0,y+3);
  });

  const history = anData?.quizScoreHistory || [];
  const scoreValues = history.map(h => h.score);

  if (!scoreValues.length) {
    ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='11px Inter'; ctx.textAlign='center';
    ctx.fillText('Belum ada data quiz', w/2, h/2);
    return;
  }

  const pts = scoreValues.map((s,i)=>({
    x: pad.l+(i/(Math.max(scoreValues.length-1,1)))*cw,
    y: pad.t+ch-(s/100)*ch
  }));

  // Area fill
  const grad=ctx.createLinearGradient(0,pad.t,0,h);
  grad.addColorStop(0,'rgba(124,58,237,0.3)'); grad.addColorStop(1,'rgba(124,58,237,0)');
  ctx.beginPath(); ctx.moveTo(pts[0].x,h);
  pts.forEach(p=>ctx.lineTo(p.x,p.y)); ctx.lineTo(pts[pts.length-1].x,h); ctx.closePath();
  ctx.fillStyle=grad; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2; ctx.lineJoin='round';
  pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke();

  // Dots
  pts.forEach((p,i) => {
    ctx.beginPath(); ctx.arc(p.x,p.y,i===pts.length-1?5:3,0,Math.PI*2);
    ctx.fillStyle=i===pts.length-1?'#fff':'#9d5cf6'; ctx.fill();
  });

  // Trend indicator
  if (scoreValues.length >= 2) {
    const first = scoreValues.slice(0, Math.ceil(scoreValues.length/2));
    const last  = scoreValues.slice(Math.ceil(scoreValues.length/2));
    const avgFirst = first.reduce((a,b)=>a+b,0)/first.length;
    const avgLast  = last.reduce((a,b)=>a+b,0)/last.length;
    const diff = Math.round(avgLast - avgFirst);
    const trendEl = document.querySelector('#an-line + div .an-trend-val');
    if (trendEl) {
      trendEl.textContent = (diff >= 0 ? '+' : '') + diff + '% Tren';
      trendEl.style.color = diff >= 0 ? 'var(--success)' : 'var(--danger)';
    }
  }
}

// ── Recent Activity ──
async function renderAnRecent() {
  const el = document.getElementById('an-recent-list'); if (!el) return;
  let activities = [];
  try {
    const data = await NotificationsAPI.getAll();
    activities = data.notifications.map(n => ({
      text:  n.text,
      time:  timeAgo(n.created_at),
      icon:  n.icon,
      bg:    n.icon_bg,
      color: n.icon_color,
    }));
  } catch(e) {}

  if (!activities.length) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">Belum ada aktivitas.</div>`;
    return;
  }

  el.innerHTML = activities.map(a => `<div class="an-recent-item">
    <div class="an-recent-dot" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:12px;height:12px;color:${a.color}"></i></div>
    <div class="an-recent-text">${a.text}</div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <div class="an-recent-time">${a.time}</div>
    </div>
  </div>`).join('');
  lucide.createIcons();
}

// ── Insights ──
function renderAnInsights() {
  const el = document.getElementById('an-insights-grid'); if (!el) return;

  // Dynamic insights berdasarkan data real
  const insights = [...anInsights];
  const streak = anData?.currentStreak || 0;
  const avgScore = anData?.avgScore || 0;
  const totalLessons = anData?.totalLessons || 0;

  if (streak >= 3) {
    insights.unshift({ title:'Streak Bagus!', desc:`Kamu sudah belajar ${streak} hari berturut-turut. Pertahankan!`, tag:'🔥 Streak', tagBg:'rgba(239,68,68,0.15)', tagColor:'#f87171', icon:'flame', iconBg:'rgba(239,68,68,0.15)', iconColor:'#f87171' });
  }
  if (avgScore >= 80) {
    insights.unshift({ title:'Quiz Master', desc:`Rata-rata skor quiz kamu ${avgScore}%. Luar biasa!`, tag:'⭐ Top', tagBg:'rgba(245,158,11,0.15)', tagColor:'#fbbf24', icon:'star', iconBg:'rgba(245,158,11,0.15)', iconColor:'#fbbf24' });
  }

  el.innerHTML = insights.slice(0,3).map(ins => `<div class="an-insight-card">
    <div class="an-insight-icon" style="background:${ins.iconBg}"><i data-lucide="${ins.icon}" style="width:16px;height:16px;color:${ins.iconColor}"></i></div>
    <div class="an-insight-title">${ins.title}</div>
    <div class="an-insight-desc">${ins.desc}</div>
    <span class="an-insight-tag" style="background:${ins.tagBg};color:${ins.tagColor}">${ins.tag}</span>
  </div>`).join('');
  lucide.createIcons();
}

// ── Radar: Skill Mastery dari quiz scores ──
function renderAnRadar() {
  const canvas = document.getElementById('an-radar'); if (!canvas) return;
  const ctx=canvas.getContext('2d'), cx=100, cy=100, r=75;

  const bestScores = anData?.bestScores || {};
  const skills = [
    { label:'ML',           val: (bestScores['ml-basics']  || bestScores['final-1'] || 0) / 100 },
    { label:'Python',       val: (bestScores['python-ai']  || bestScores['final-2'] || 0) / 100 },
    { label:'Deep Learning',val: (bestScores['dl-basics']  || bestScores['final-3'] || 0) / 100 },
    { label:'NLP',          val: (bestScores['nlp-basics'] || bestScores['final-4'] || 0) / 100 },
    { label:'Data Science', val: (bestScores['final-6']    || 0) / 100 },
    { label:'CV',           val: (bestScores['cv-basics']  || bestScores['final-5'] || 0) / 100 },
  ];

  const n = skills.length;
  ctx.clearRect(0,0,200,200);

  // Grid
  [0.25,0.5,0.75,1.0].forEach(scale => {
    ctx.beginPath();
    skills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*scale, y=cy+Math.sin(a)*r*scale; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
  });

  // Axes
  skills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.stroke(); });

  // Data polygon
  ctx.beginPath();
  skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*Math.max(s.val,0.05), y=cy+Math.sin(a)*r*Math.max(s.val,0.05); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.closePath(); ctx.fillStyle='rgba(124,58,237,0.35)'; ctx.fill(); ctx.strokeStyle='#9d5cf6'; ctx.lineWidth=2; ctx.stroke();

  // Dots
  skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*Math.max(s.val,0.05),cy+Math.sin(a)*r*Math.max(s.val,0.05),3,0,Math.PI*2); ctx.fillStyle='#a78bfa'; ctx.fill(); });

  // Labels
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='10px Inter'; ctx.textAlign='center';
  skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.fillText(s.label,cx+Math.cos(a)*(r+14),cy+Math.sin(a)*(r+14)+3); });
}

// ── Export Report ──
function exportReport() {
  const session = getSession();
  const totalLessons = anData?.totalLessons || 0;
  const avgScore = anData?.avgScore || 0;
  const streak = anData?.currentStreak || session?.streak || 0;
  const totalQuizzes = anData?.totalQuizzes || 0;

  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Analytics Report - Lunetix</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#333}
    h1{color:#7c3aed;margin-bottom:4px}
    .subtitle{color:#666;font-size:13px;margin-bottom:24px}
    .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0}
    .stat{background:#f8f7ff;border:1px solid #e5e0ff;border-radius:8px;padding:14px;text-align:center}
    .stat-val{font-size:22px;font-weight:700;color:#7c3aed}
    .stat-label{font-size:11px;color:#666;margin-top:4px}
    .footer{text-align:center;color:#999;font-size:11px;margin-top:32px;border-top:1px solid #eee;padding-top:16px}
    @media print{.no-print{display:none}}
  </style></head><body>
  <h1>Analytics Report</h1>
  <div class="subtitle">Generated for ${session?.name || 'Learner'} &middot; ${new Date().toLocaleDateString('id-ID',{dateStyle:'long'})}</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-val">${totalLessons}</div><div class="stat-label">Lesson Selesai</div></div>
    <div class="stat"><div class="stat-val">${totalQuizzes}</div><div class="stat-label">Quiz Dikerjakan</div></div>
    <div class="stat"><div class="stat-val">${avgScore ? avgScore + '%' : '-'}</div><div class="stat-label">Rata-rata Skor</div></div>
    <div class="stat"><div class="stat-val">${streak}</div><div class="stat-label">Day Streak</div></div>
  </div>
  <div class="footer">Lunetix AI Learning Platform &middot; lunetix.ai</div>
  <div class="no-print" style="text-align:center;margin-top:20px">
    <button onclick="window.print()" style="background:#7c3aed;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px">Print / Save PDF</button>
  </div></body></html>`);
  w.document.close();
}

// ── Advanced Analytics Functions ──
function renderAdvancedAnalytics() {
  if (!advancedAnalyticsData) return;
  
  // Add advanced analytics section to page if not exists
  const analyticsPage = document.getElementById('page-analytics');
  if (!analyticsPage) return;
  
  let advancedSection = document.getElementById('advanced-analytics-section');
  if (!advancedSection) {
    advancedSection = document.createElement('div');
    advancedSection.id = 'advanced-analytics-section';
    advancedSection.innerHTML = `
      <div style="margin-top:32px">
        <div class="section-header" style="margin-bottom:20px">
          <h3 style="font-size:18px;font-weight:700">Advanced Analytics</h3>
          <p style="font-size:13px;color:var(--text-muted)">Deep insights into your learning patterns</p>
        </div>
        
        <div class="advanced-analytics-grid">
          <!-- Learning Stats -->
          <div class="card" style="grid-column:span 2">
            <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">Learning Overview</h4>
            <div id="analytics-learning-stats"></div>
          </div>
          
          <!-- Time Analytics -->
          <div class="card" style="grid-column:span 2">
            <div id="analytics-time-chart"></div>
          </div>
          
          <!-- Performance Metrics -->
          <div class="card">
            <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">Performance</h4>
            <div id="analytics-performance"></div>
          </div>
          
          <!-- Skills Progress -->
          <div class="card" style="grid-column:span 3">
            <div id="analytics-skills"></div>
          </div>
          
          <!-- Recommendations -->
          <div class="card" style="grid-column:span 2">
            <div id="analytics-recommendations"></div>
          </div>
        </div>
      </div>`;
    analyticsPage.appendChild(advancedSection);
  }
  
  renderLearningStats();
  renderTimeAnalytics();
  renderPerformanceMetrics();
  renderSkillsProgress();
  renderRecommendations();
}

function renderLearningStats() {
  const container = document.getElementById('analytics-learning-stats');
  if (!container || !advancedAnalyticsData) return;
  
  const stats = advancedAnalyticsData.learningStats;
  container.innerHTML = `
    <div class="analytics-stats-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
      <div class="analytics-stat-card" style="text-align:center;padding:16px;background:var(--input-bg);border-radius:12px">
        <div class="analytics-stat-icon" style="width:40px;height:40px;margin:0 auto 8px;background:rgba(124,58,237,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center">
          <i data-lucide="clock" style="width:20px;height:20px;color:#a78bfa"></i>
        </div>
        <div class="analytics-stat-value" style="font-size:20px;font-weight:700;color:var(--text-primary)">${stats.totalVideoTime}m</div>
        <div class="analytics-stat-label" style="font-size:12px;color:var(--text-muted)">Video Time</div>
      </div>
      
      <div class="analytics-stat-card" style="text-align:center;padding:16px;background:var(--input-bg);border-radius:12px">
        <div class="analytics-stat-icon" style="width:40px;height:40px;margin:0 auto 8px;background:rgba(59,130,246,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center">
          <i data-lucide="book-open" style="width:20px;height:20px;color:#60a5fa"></i>
        </div>
        <div class="analytics-stat-value" style="font-size:20px;font-weight:700;color:var(--text-primary)">${stats.totalLessons}</div>
        <div class="analytics-stat-label" style="font-size:12px;color:var(--text-muted)">Lessons</div>
      </div>
      
      <div class="analytics-stat-card" style="text-align:center;padding:16px;background:var(--input-bg);border-radius:12px">
        <div class="analytics-stat-icon" style="width:40px;height:40px;margin:0 auto 8px;background:rgba(245,158,11,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center">
          <i data-lucide="brain" style="width:20px;height:20px;color:#fbbf24"></i>
        </div>
        <div class="analytics-stat-value" style="font-size:20px;font-weight:700;color:var(--text-primary)">${stats.avgQuizScore}%</div>
        <div class="analytics-stat-label" style="font-size:12px;color:var(--text-muted)">Quiz Score</div>
      </div>
      
      <div class="analytics-stat-card" style="text-align:center;padding:16px;background:var(--input-bg);border-radius:12px">
        <div class="analytics-stat-icon" style="width:40px;height:40px;margin:0 auto 8px;background:rgba(16,185,129,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center">
          <i data-lucide="activity" style="width:20px;height:20px;color:#34d399"></i>
        </div>
        <div class="analytics-stat-value" style="font-size:20px;font-weight:700;color:var(--text-primary)">${stats.totalSessions}</div>
        <div class="analytics-stat-label" style="font-size:12px;color:var(--text-muted)">Sessions</div>
      </div>
    </div>`;
  
  lucide.createIcons();
}

function renderTimeAnalytics() {
  const container = document.getElementById('analytics-time-chart');
  if (!container || !advancedAnalyticsData) return;
  
  const timeData = advancedAnalyticsData.timeAnalytics;
  const maxActivity = Math.max(...timeData.dailyActivity.map(d => d.activity), 1);
  
  container.innerHTML = `
    <div class="analytics-chart-header" style="margin-bottom:16px">
      <h4 style="font-size:14px;font-weight:600">Daily Activity (Last 7 Days)</h4>
      <div class="analytics-chart-meta" style="font-size:12px;color:var(--text-muted)">
        <span>Weekly Total: ${timeData.weeklyTotal} activities</span>
      </div>
    </div>
    <div class="analytics-time-chart" style="display:flex;align-items:end;gap:8px;height:120px;padding:0 8px">
      ${timeData.dailyActivity.map(day => {
        const height = Math.max((day.activity / maxActivity) * 80, 4);
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        
        return `
          <div class="analytics-time-bar" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="analytics-bar-container" style="height:80px;display:flex;align-items:end;width:100%">
              <div class="analytics-bar" style="width:100%;height:${height}px;background:linear-gradient(135deg,#7c3aed,#60a5fa);border-radius:4px 4px 0 0" title="${day.activity} activities"></div>
            </div>
            <div class="analytics-bar-label" style="font-size:10px;color:var(--text-muted)">${dayName}</div>
            <div class="analytics-bar-value" style="font-size:11px;font-weight:600;color:var(--text-primary)">${day.activity}</div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderPerformanceMetrics() {
  const container = document.getElementById('analytics-performance');
  if (!container || !advancedAnalyticsData) return;
  
  const perf = advancedAnalyticsData.performanceMetrics;
  const streak = advancedAnalyticsData.streakAnalytics;
  
  container.innerHTML = `
    <div class="analytics-performance-grid" style="display:grid;gap:16px">
      <div class="analytics-performance-card" style="padding:16px;background:var(--input-bg);border-radius:8px">
        <h5 style="font-size:13px;font-weight:600;margin-bottom:8px">Quiz Performance</h5>
        <div class="analytics-performance-stat" style="margin-bottom:8px">
          <span class="analytics-perf-value" style="font-size:18px;font-weight:700;color:${perf.avgImprovement >= 0 ? 'var(--success)' : 'var(--danger)'}">${perf.avgImprovement > 0 ? '+' : ''}${perf.avgImprovement}%</span>
          <span class="analytics-perf-label" style="font-size:11px;color:var(--text-muted);display:block">Average Improvement</span>
        </div>
        <div class="analytics-performance-details" style="font-size:11px;color:var(--text-muted)">
          <div>Strong: ${perf.strongSubjects.length} subjects</div>
          <div>Needs work: ${perf.needsImprovement.length} subjects</div>
        </div>
      </div>
      
      <div class="analytics-performance-card" style="padding:16px;background:var(--input-bg);border-radius:8px">
        <h5 style="font-size:13px;font-weight:600;margin-bottom:8px">Learning Consistency</h5>
        <div class="analytics-performance-stat" style="margin-bottom:8px">
          <span class="analytics-perf-value" style="font-size:18px;font-weight:700;color:var(--accent-light)">${streak.currentStreak}</span>
          <span class="analytics-perf-label" style="font-size:11px;color:var(--text-muted);display:block">Day Streak</span>
        </div>
        <div class="analytics-performance-details" style="font-size:11px;color:var(--text-muted)">
          <div>Longest: ${streak.longestStreak} days</div>
          <div>Active days: ${streak.totalActiveDays}</div>
        </div>
      </div>
    </div>`;
}

function renderSkillsProgress() {
  const container = document.getElementById('analytics-skills');
  if (!container || !advancedAnalyticsData) return;
  
  const skills = advancedAnalyticsData.skillsProgress;
  
  container.innerHTML = `
    <div class="analytics-skills-header" style="margin-bottom:16px">
      <h4 style="font-size:14px;font-weight:600">Skills Assessment</h4>
      <p style="font-size:12px;color:var(--text-muted)">Based on your quiz performance and completed content</p>
    </div>
    <div class="analytics-skills-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
      ${Object.entries(skills).map(([skill, data]) => {
        const levelColor = {
          'Beginner': '#6b7280',
          'Intermediate': '#fbbf24', 
          'Advanced': '#60a5fa',
          'Expert': '#34d399'
        }[data.level];
        
        return `
          <div class="analytics-skill-card" style="padding:12px;background:var(--input-bg);border-radius:8px">
            <div class="analytics-skill-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span class="analytics-skill-name" style="font-size:12px;font-weight:600">${skill}</span>
              <span class="analytics-skill-level" style="font-size:10px;color:${levelColor};background:${levelColor}20;padding:2px 6px;border-radius:4px">${data.level}</span>
            </div>
            <div class="analytics-skill-progress" style="margin-bottom:6px">
              <div class="analytics-skill-bar" style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden">
                <div class="analytics-skill-fill" style="width:${data.score}%;height:100%;background:${levelColor};transition:width 0.5s ease"></div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
                <span class="analytics-skill-score" style="font-size:11px;font-weight:600">${data.score}%</span>
                <span class="analytics-skill-meta" style="font-size:10px;color:var(--text-muted)">${data.quizzesTaken} quiz${data.quizzesTaken !== 1 ? 'es' : ''}</span>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderRecommendations() {
  const container = document.getElementById('analytics-recommendations');
  if (!container || !advancedAnalyticsData) return;
  
  const recommendations = advancedAnalyticsData.recommendations;
  
  if (!recommendations.length) {
    container.innerHTML = `
      <div class="analytics-no-recommendations" style="text-align:center;padding:24px">
        <i data-lucide="check-circle" style="width:32px;height:32px;color:var(--success);margin-bottom:8px"></i>
        <p style="font-size:14px;margin-bottom:4px">Great job! No specific recommendations at this time.</p>
        <p style="font-size:12px;color:var(--text-muted)">Keep up the excellent work!</p>
      </div>`;
    lucide.createIcons();
    return;
  }
  
  container.innerHTML = `
    <div class="analytics-recommendations-header" style="margin-bottom:16px">
      <h4 style="font-size:14px;font-weight:600">AI Recommendations</h4>
      <p style="font-size:12px;color:var(--text-muted)">Personalized suggestions to improve your learning</p>
    </div>
    <div class="analytics-recommendations-list" style="display:flex;flex-direction:column;gap:12px">
      ${recommendations.map(rec => {
        const priorityColor = {
          'high': '#f87171',
          'medium': '#fbbf24',
          'low': '#60a5fa'
        }[rec.priority];
        
        const iconMap = {
          'improvement': 'trending-up',
          'next_course': 'arrow-right',
          'motivation': 'zap'
        };
        
        return `
          <div class="analytics-recommendation-card" style="display:flex;gap:12px;padding:12px;background:var(--input-bg);border-radius:8px;border-left:3px solid ${priorityColor}">
            <div class="analytics-rec-icon" style="width:32px;height:32px;background:rgba(124,58,237,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i data-lucide="${iconMap[rec.type] || 'lightbulb'}" style="width:16px;height:16px;color:#a78bfa"></i>
            </div>
            <div class="analytics-rec-content" style="flex:1">
              <div class="analytics-rec-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <h5 style="font-size:13px;font-weight:600">${rec.title}</h5>
                <span class="analytics-rec-priority" style="font-size:10px;color:${priorityColor};text-transform:uppercase;font-weight:600">${rec.priority}</span>
              </div>
              <p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">${rec.description}</p>
              <button class="btn btn-outline" style="padding:4px 12px;font-size:11px">
                ${rec.action}
              </button>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  
  lucide.createIcons();
}

function generateFallbackAdvancedAnalytics() {
  // Fallback data when API is not available
  return {
    learningStats: {
      totalVideoTime: 120,
      totalLessons: 15,
      totalQuizzes: 8,
      avgQuizScore: 75,
      totalSessions: 23
    },
    timeAnalytics: {
      dailyActivity: [
        { date: '2024-01-01', activity: 2 },
        { date: '2024-01-02', activity: 1 },
        { date: '2024-01-03', activity: 3 },
        { date: '2024-01-04', activity: 0 },
        { date: '2024-01-05', activity: 2 },
        { date: '2024-01-06', activity: 4 },
        { date: '2024-01-07', activity: 1 }
      ],
      weeklyTotal: 13
    },
    performanceMetrics: {
      avgImprovement: 15,
      strongSubjects: ['ml-basics', 'python-ai'],
      needsImprovement: ['dl-basics']
    },
    streakAnalytics: {
      currentStreak: 5,
      longestStreak: 12,
      totalActiveDays: 28
    },
    skillsProgress: {
      'Machine Learning': { score: 85, level: 'Advanced', quizzesTaken: 3 },
      'Python Programming': { score: 92, level: 'Expert', quizzesTaken: 2 },
      'Deep Learning': { score: 65, level: 'Intermediate', quizzesTaken: 1 },
      'Natural Language Processing': { score: 45, level: 'Beginner', quizzesTaken: 1 },
      'Computer Vision': { score: 0, level: 'Beginner', quizzesTaken: 0 }
    },
    recommendations: [
      {
        type: 'improvement',
        title: 'Focus on NLP Fundamentals',
        description: 'Your NLP quiz score is below average. Review the tokenization and preprocessing lessons.',
        action: 'Review Content',
        priority: 'high'
      },
      {
        type: 'next_course',
        title: 'Ready for Advanced ML',
        description: 'You\'ve mastered the basics! Consider taking the Advanced Machine Learning course.',
        action: 'Explore Course',
        priority: 'medium'
      }
    ]
  };
}