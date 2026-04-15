// ══ ANALYTICS ══

const anInsights = [
  { title:'Tips Belajar',   desc:'Belajar 30 menit setiap hari lebih efektif daripada sekali seminggu.', tag:'Konsisten', tagBg:'rgba(59,130,246,0.15)', tagColor:'#60a5fa', icon:'clock', iconBg:'rgba(59,130,246,0.15)', iconColor:'#60a5fa' },
  { title:'Rekomendasi',    desc:'Selesaikan kursus yang sudah diklaim sebelum mengambil yang baru.',     tag:'Fokus',     tagBg:'rgba(245,158,11,0.15)', tagColor:'#fbbf24', icon:'zap',   iconBg:'rgba(245,158,11,0.15)', iconColor:'#fbbf24' },
];

async function renderAnalytics() {
  await renderAnStats();
  await renderAnCourseProgress();
  renderAnBarChart();
  renderAnStreak();
  renderAnDonut();
  renderAnLine();
  await renderAnRecent();
  renderAnInsights();
  renderAnRadar();
  setTimeout(() => document.querySelectorAll('.an-course-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%'), 200);
}

async function renderAnStats() {
  const el = document.getElementById('an-stats-bar'); if (!el) return;
  const session = getSession();
  const scores = store.get('quiz_scores', {});
  const avgScore = Object.keys(scores).length
    ? Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
    : 0;

  let completedLessons = 0;
  let activeCourses = 0;
  try {
    const claimed = await getClaimedCoursesAsync(String(session?.id));
    activeCourses = claimed.filter(c => c.status === 'active').length;
    for (const c of claimed) {
      const done = await getCompletedLessonsAsync(c.courseId);
      completedLessons += done.length;
    }
  } catch(e) {}

  const stats = [
    { val: completedLessons || 0, label:'Lesson Selesai',   trend: completedLessons ? '+' + completedLessons + ' total' : 'Mulai belajar!', icon:'check-circle', bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val: activeCourses || 0,    label:'Kursus Aktif',     trend: activeCourses ? activeCourses + ' kursus' : 'Klaim kursus dulu!',         icon:'book-open',    bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    { val: Object.keys(scores).length || 0, label:'Quiz Dikerjakan', trend: Object.keys(scores).length ? Object.keys(scores).length + ' quiz' : 'Belum ada quiz', icon:'help-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val: avgScore ? avgScore + '%' : '-', label:'Rata-rata Skor',  trend: avgScore ? 'Best: ' + Math.max(...Object.values(scores)) + '%' : 'Coba quiz sekarang', icon:'target', bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  ];
  el.innerHTML = stats.map(s => `<div class="an-stat-card">
    <div class="an-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i></div>
    <div style="flex:1"><div class="an-stat-val">${s.val}</div><div class="an-stat-label">${s.label}</div><div class="an-stat-trend">${s.trend}</div></div>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnBarChart() {
  // Chart kosong untuk user baru — tidak ada data waktu belajar yang real
  const chart = document.getElementById('an-bar-chart');
  const labelsEl = document.getElementById('an-bar-labels');
  if (!chart) return;
  const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const bars = [0,0,0,0,0,0,0];
  chart.innerHTML = bars.map((h, i) => `
    <div class="an-bar-col">
      <div class="an-bar-val">${h}h</div>
      <div class="an-bar" style="height:4%;background:rgba(124,58,237,0.2)"><div class="an-bar-tooltip">${h}h</div></div>
    </div>`).join('');
  if (labelsEl) labelsEl.innerHTML = days.map(l => `<div class="an-bar-label" style="flex:1;text-align:center">${l}</div>`).join('');
  const bestEl = document.getElementById('an-best-day');
  const peakEl = document.getElementById('an-peak-time');
  const tipEl  = document.getElementById('an-productivity-tip');
  if (bestEl) bestEl.textContent = '-';
  if (peakEl) peakEl.textContent = '0h';
  if (tipEl)  tipEl.innerHTML = 'Mulai belajar untuk melihat statistik waktu belajarmu!';
}

async function renderAnCourseProgress() {
  const el = document.getElementById('an-course-progress'); if (!el) return;
  const session = getSession();
  const colorMap = { 1:'#a78bfa', 2:'#4ade80', 3:'#60a5fa', 4:'#c084fc', 5:'#34d399', 6:'#818cf8' };
  const iconMap  = { 1:'cpu', 2:'code-2', 3:'network', 4:'message-square', 5:'scan-eye', 6:'database' };
  const bgMap    = { 1:'rgba(124,58,237,0.15)', 2:'rgba(16,185,129,0.15)', 3:'rgba(59,130,246,0.15)', 4:'rgba(168,85,247,0.15)', 5:'rgba(16,185,129,0.15)', 6:'rgba(59,130,246,0.15)' };

  let rows = [];
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
  } catch(e) {}

  if (!rows.length) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada kursus aktif.</div>`;
    return;
  }

  el.innerHTML = rows.map(c => `<div class="an-course-row">
    <div class="an-course-icon" style="background:${c.bg}"><i data-lucide="${c.icon}" style="width:13px;height:13px;color:${c.color}"></i></div>
    <div class="an-course-name" title="${c.name}">${c.name}</div>
    <div class="an-course-track"><div class="an-course-fill" data-w="${c.pct}" style="width:0%;background:${c.color}"></div></div>
    <div class="an-course-pct">${c.pct}%</div>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnStreak() {
  const el = document.getElementById('an-streak-week'); if (!el) return;
  const session = getSession();
  const streak = session?.streak || 0;
  const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  el.innerHTML = days.map((d, i) => `<div class="an-streak-day">
    <div class="an-streak-dot ${i < streak ? 'done' : 'miss'}">${i < streak ? '<i data-lucide="check" style="width:14px;height:14px;color:#fff"></i>' : ''}</div>
    <div class="an-streak-day-label">${d}</div>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnDonut() {
  const canvas = document.getElementById('an-donut');
  const legend = document.getElementById('an-donut-legend');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx=60, cy=60, r=48, inner=32;
  ctx.clearRect(0,0,120,120);
  // Kosong — gambar lingkaran abu-abu
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#12122a'; ctx.fill();
  if (legend) legend.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:11px;padding:8px">Data akan muncul setelah kamu mulai belajar.</div>`;
}

function renderAnLine() {
  const canvas = document.getElementById('an-line'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scores = store.get('quiz_scores', {});
  const scoreValues = Object.values(scores);
  const w=canvas.width, h=canvas.height;
  const pad={t:14,r:14,b:14,l:24}, cw=w-pad.l-pad.r, ch=h-pad.t-pad.b;
  ctx.clearRect(0,0,w,h);
  [0,50,100].forEach(v => {
    const y=pad.t+ch-(v/100)*ch;
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='9px Inter'; ctx.fillText(v+'%',0,y+3);
  });
  if (!scoreValues.length) {
    ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='11px Inter'; ctx.textAlign='center';
    ctx.fillText('Belum ada data quiz', w/2, h/2);
    return;
  }
  const pts = scoreValues.map((s,i)=>({ x:pad.l+(i/(Math.max(scoreValues.length-1,1)))*cw, y:pad.t+ch-(s/100)*ch }));
  const grad=ctx.createLinearGradient(0,pad.t,0,h);
  grad.addColorStop(0,'rgba(124,58,237,0.3)'); grad.addColorStop(1,'rgba(124,58,237,0)');
  ctx.beginPath(); ctx.moveTo(pts[0].x,h);
  pts.forEach(p=>ctx.lineTo(p.x,p.y)); ctx.lineTo(pts[pts.length-1].x,h); ctx.closePath();
  ctx.fillStyle=grad; ctx.fill();
  ctx.beginPath(); ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2; ctx.lineJoin='round';
  pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke();
  pts.forEach((p,i) => {
    ctx.beginPath(); ctx.arc(p.x,p.y,i===pts.length-1?5:3,0,Math.PI*2);
    ctx.fillStyle=i===pts.length-1?'#fff':'#9d5cf6'; ctx.fill();
  });
}

async function renderAnRecent() {
  const el = document.getElementById('an-recent-list'); if (!el) return;
  const session = getSession();
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

function renderAnInsights() {
  const el = document.getElementById('an-insights-grid'); if (!el) return;
  el.innerHTML = anInsights.map(ins => `<div class="an-insight-card">
    <div class="an-insight-icon" style="background:${ins.iconBg}"><i data-lucide="${ins.icon}" style="width:16px;height:16px;color:${ins.iconColor}"></i></div>
    <div class="an-insight-title">${ins.title}</div>
    <div class="an-insight-desc">${ins.desc}</div>
    <span class="an-insight-tag" style="background:${ins.tagBg};color:${ins.tagColor}">${ins.tag}</span>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnRadar() {
  const canvas = document.getElementById('an-radar'); if (!canvas) return;
  const ctx=canvas.getContext('2d'), cx=100, cy=100, r=75;
  const skills = [
    { label:'Machine Learning', val:0 }, { label:'Python', val:0 },
    { label:'Deep Learning', val:0 },    { label:'NLP', val:0 },
    { label:'Data Science', val:0 },     { label:'Computer Vision', val:0 },
  ];
  // Isi nilai dari quiz scores
  const scores = store.get('quiz_scores', {});
  if (scores['ml-basics'])  skills[0].val = scores['ml-basics'] / 100;
  if (scores['python-ai'])  skills[1].val = scores['python-ai'] / 100;
  if (scores['dl-basics'])  skills[2].val = scores['dl-basics'] / 100;
  if (scores['nlp-basics']) skills[3].val = scores['nlp-basics'] / 100;
  if (scores['cv-basics'])  skills[5].val = scores['cv-basics'] / 100;

  const n = skills.length;
  ctx.clearRect(0,0,200,200);
  [0.25,0.5,0.75,1.0].forEach(scale => {
    ctx.beginPath();
    skills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*scale, y=cy+Math.sin(a)*r*scale; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
  });
  skills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.stroke(); });
  ctx.beginPath(); skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*s.val, y=cy+Math.sin(a)*r*s.val; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.closePath(); ctx.fillStyle='rgba(124,58,237,0.35)'; ctx.fill(); ctx.strokeStyle='#9d5cf6'; ctx.lineWidth=2; ctx.stroke();
  skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*s.val,cy+Math.sin(a)*r*s.val,3,0,Math.PI*2); ctx.fillStyle='#a78bfa'; ctx.fill(); });
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='10px Inter'; ctx.textAlign='center';
  skills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.fillText(s.label,cx+Math.cos(a)*(r+14),cy+Math.sin(a)*(r+14)+3); });
}

function exportReport() {
  const session = getSession();
  const scores = store.get('quiz_scores', {});
  const avgScore = Object.keys(scores).length
    ? Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
    : 0;
  const w = window.open('','_blank');
  w.document.write('<!DOCTYPE html><html><head><title>Analytics Report</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{color:#7c3aed}.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0}.stat{background:#f8f7ff;border:1px solid #e5e0ff;border-radius:8px;padding:14px;text-align:center}.stat-val{font-size:22px;font-weight:700;color:#7c3aed}.stat-label{font-size:11px;color:#666;margin-top:4px}.footer{text-align:center;color:#999;font-size:11px;margin-top:32px;border-top:1px solid #eee;padding-top:16px}@media print{.no-print{display:none}}</style></head><body>');
  w.document.write('<h1>Analytics Report</h1><p style="color:#666">Generated for '+(session?.name||'Learner')+' &middot; '+new Date().toLocaleDateString('id-ID',{dateStyle:'long'})+'</p>');
  w.document.write('<div class="stat-row"><div class="stat"><div class="stat-val">'+Object.keys(scores).length+'</div><div class="stat-label">Quiz Dikerjakan</div></div><div class="stat"><div class="stat-val">'+(avgScore||'-')+'%</div><div class="stat-label">Rata-rata Skor</div></div></div>');
  w.document.write('<div class="footer">Lunetix AI Learning Platform &middot; lunetix.ai</div><div class="no-print" style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#7c3aed;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px">Print / Save PDF</button></div></body></html>');
  w.document.close();
}
