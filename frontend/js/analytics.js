// ══ ANALYTICS ══
const anData = {
  week:  { bars:[1.5,2.0,0.5,3.0,2.5,3.55,1.0], labels:['Sen','Sel','Rab','Kam','Jum','Sab','Min'], bestDay:'Sabtu', peakTime:'3h 45m', tip:'Kamu lebih produktif 25% dibandingkan rata-rata pengguna lain!' },
  month: { bars:[12,18,8,22,15,28,10,20,14,25,9,30], labels:['1','5','8','10','12','15','18','20','22','25','28','30'], bestDay:'15 Apr', peakTime:'28h', tip:'Bulan ini kamu belajar 47h 32m total. Luar biasa!' },
};
const anCourses = [
  { name:'Machine Learning Fundamentals', pct:100, icon:'cpu',            bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
  { name:'Python for AI',                 pct:100, icon:'code-2',         bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { name:'Deep Learning Essentials',      pct:25,  icon:'network',        bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { name:'Natural Language Processing',   pct:10,  icon:'message-square', bg:'rgba(168,85,247,0.15)', color:'#c084fc' },
  { name:'Computer Vision Mastery',       pct:60,  icon:'eye',            bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
];
const anRecentActivities = [
  { text:'Menyelesaikan kursus Python for AI',                      xp:'+120 XP', time:'2 jam lalu',   icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { text:'Mengerjakan Quiz: Deep Learning Fundamentals — Skor 80%', xp:'+80 XP',  time:'5 jam lalu',   icon:'help-circle',  bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
  { text:'Membuka materi | LSTM & Recurrent Networks',              xp:'+40 XP',  time:'1 hari lalu',  icon:'book-open',    bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { text:'Membuat project: Sentiment Analysis API',                 xp:'+150 XP', time:'2 hari lalu',  icon:'folder',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  { text:'Menyelesaikan kursus Machine Learning Fundamentals',      xp:'+200 XP', time:'5 hari lalu',  icon:'award',        bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { text:'Bergabung dengan Lunetix',                                xp:'+30 XP',  time:'2 minggu lalu',icon:'users',        bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
];
const anInsights = [
  { title:'Kekuatan Terbesar', desc:'Kamu kuat di Machine Learning! Tingkatkan momentum belajarmu.', tag:'Top Skill',  tagBg:'rgba(16,185,129,0.15)', tagColor:'#34d399', icon:'zap',        iconBg:'rgba(16,185,129,0.15)', iconColor:'#34d399' },
  { title:'Rekomendasi',       desc:'Coba fokus lebih ke Deep Learning untuk meningkatkan skill-mu.', tag:'Disarankan', tagBg:'rgba(245,158,11,0.15)', tagColor:'#fbbf24', icon:'zap',        iconBg:'rgba(245,158,11,0.15)', iconColor:'#fbbf24' },
  { title:'Tips Belajar',      desc:'Belajar 30 menit setiap hari lebih efektif daripada sekali seminggu.', tag:'Konsisten', tagBg:'rgba(59,130,246,0.15)', tagColor:'#60a5fa', icon:'clock', iconBg:'rgba(59,130,246,0.15)', iconColor:'#60a5fa' },
];
const anDonutData = [
  { label:'Machine Learning', pct:35, time:'16h 40m', color:'#a78bfa' },
  { label:'Python',           pct:25, time:'11h 50m', color:'#34d399' },
  { label:'Deep Learning',    pct:20, time:'9h 30m',  color:'#60a5fa' },
  { label:'NLP',              pct:10, time:'4h 45m',  color:'#fbbf24' },
  { label:'Lainnya',          pct:10, time:'4h 47m',  color:'#f87171' },
];
const anSkills = [
  { label:'Machine Learning', val:0.90 }, { label:'Python',    val:0.80 },
  { label:'Deep Learning',    val:0.40 }, { label:'NLP',       val:0.30 },
  { label:'Data Science',     val:0.60 }, { label:'Computer Vision', val:0.55 },
];
const anLineScores = [45,55,62,70,68,75,80,82,85];

function renderAnalytics() {
  renderAnStats(); renderAnBarChart(); renderAnCourseProgress();
  renderAnStreak(); renderAnDonut(); renderAnLine();
  renderAnRecent(); renderAnInsights(); renderAnRadar();
  setTimeout(() => document.querySelectorAll('.an-course-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%'), 200);
}

function renderAnStats() {
  const el = document.getElementById('an-stats-bar'); if (!el) return;
  const stats = [
    { val:'47h 32m', label:'Total Jam Belajar', trend:'12% dari minggu lalu', icon:'clock',        bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val:'12',      label:'Kursus Selesai',    trend:'2 dari bulan lalu',    icon:'check-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    { val:'8',       label:'Quiz Dikerjakan',   trend:'3 dari minggu lalu',   icon:'help-circle',  bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val:'82%',     label:'Rata-rata Skor',    trend:'5% dari minggu lalu',  icon:'target',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  ];
  el.innerHTML = stats.map(s => `<div class="an-stat-card">
    <div class="an-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i></div>
    <div style="flex:1"><div class="an-stat-val">${s.val}</div><div class="an-stat-label">${s.label}</div><div class="an-stat-trend">+${s.trend}</div></div>
    <svg width="50" height="28" viewBox="0 0 50 28" style="opacity:0.7"><polyline points="0,22 10,18 20,20 30,10 40,14 50,6" fill="none" stroke="${s.color}" stroke-width="1.5"/></svg>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnBarChart() {
  const period = document.getElementById('an-period')?.value || 'week';
  const d = anData[period] || anData.week;
  const chart = document.getElementById('an-bar-chart');
  const labelsEl = document.getElementById('an-bar-labels');
  if (!chart) return;
  const max = Math.max(...d.bars);
  chart.innerHTML = d.bars.map((h, i) => {
    const isMax = h === max;
    const bg = isMax ? 'var(--accent)' : `rgba(124,58,237,${0.2 + (h/max)*0.5})`;
    return `<div class="an-bar-col"><div class="an-bar-val">${h}h</div><div class="an-bar" style="height:${Math.max((h/max)*100,4)}%;background:${bg}"><div class="an-bar-tooltip">${h}h</div></div></div>`;
  }).join('');
  if (labelsEl) labelsEl.innerHTML = d.labels.map(l => `<div class="an-bar-label" style="flex:1;text-align:center">${l}</div>`).join('');
  const bestEl = document.getElementById('an-best-day');
  const peakEl = document.getElementById('an-peak-time');
  const tipEl  = document.getElementById('an-productivity-tip');
  if (bestEl) bestEl.textContent = d.bestDay;
  if (peakEl) peakEl.textContent = d.peakTime;
  if (tipEl)  tipEl.innerHTML = '<i data-lucide="trending-up" style="width:12px;height:12px"></i> ' + d.tip;
  lucide.createIcons();
}

function renderAnCourseProgress() {
  const el = document.getElementById('an-course-progress'); if (!el) return;
  el.innerHTML = anCourses.map(c => `<div class="an-course-row">
    <div class="an-course-icon" style="background:${c.bg}"><i data-lucide="${c.icon}" style="width:13px;height:13px;color:${c.color}"></i></div>
    <div class="an-course-name" title="${c.name}">${c.name}</div>
    <div class="an-course-track"><div class="an-course-fill" data-w="${c.pct}" style="width:0%;background:${c.color}"></div></div>
    <div class="an-course-pct">${c.pct}%</div>
  </div>`).join('');
  lucide.createIcons();
}

function renderAnStreak() {
  const el = document.getElementById('an-streak-week'); if (!el) return;
  const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const done = [true,true,true,true,true,true,false];
  el.innerHTML = days.map((d, i) => `<div class="an-streak-day">
    <div class="an-streak-dot ${done[i]?'done':'miss'}">${done[i]?'<i data-lucide="check" style="width:14px;height:14px;color:#fff"></i>':''}</div>
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
  let angle = -Math.PI/2;
  ctx.clearRect(0,0,120,120);
  anDonutData.forEach(d => {
    const slice = (d.pct/100)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+slice); ctx.closePath();
    ctx.fillStyle = d.color; ctx.fill(); angle += slice;
  });
  ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#12122a'; ctx.fill();
  if (legend) legend.innerHTML = anDonutData.map(d => `<div class="an-donut-legend-item">
    <div class="an-donut-dot" style="background:${d.color}"></div>
    <div class="an-donut-label">${d.label}</div>
    <div class="an-donut-pct">${d.pct}%</div>
    <div class="an-donut-time">(${d.time})</div>
  </div>`).join('');
}

function renderAnLine() {
  const canvas = document.getElementById('an-line'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w=canvas.width, h=canvas.height, scores=anLineScores;
  const pad={t:14,r:14,b:14,l:24}, cw=w-pad.l-pad.r, ch=h-pad.t-pad.b;
  ctx.clearRect(0,0,w,h);
  [0,50,100].forEach(v => {
    const y=pad.t+ch-(v/100)*ch;
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='9px Inter'; ctx.fillText(v+'%',0,y+3);
  });
  const pts = scores.map((s,i)=>({ x:pad.l+(i/(scores.length-1))*cw, y:pad.t+ch-(s/100)*ch }));
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
    if (i===pts.length-1) {
      ctx.fillStyle='rgba(124,58,237,0.9)'; ctx.beginPath();
      ctx.roundRect(p.x-14,p.y-22,28,16,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='bold 9px Inter'; ctx.textAlign='center';
      ctx.fillText(scores[i]+'%',p.x,p.y-11); ctx.textAlign='left';
    }
  });
}

function renderAnRecent() {
  const el = document.getElementById('an-recent-list'); if (!el) return;
  el.innerHTML = anRecentActivities.map(a => `<div class="an-recent-item">
    <div class="an-recent-dot" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:12px;height:12px;color:${a.color}"></i></div>
    <div class="an-recent-text">${a.text}</div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
      <div class="an-recent-xp" style="color:${a.color}">${a.xp}</div>
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
  const ctx=canvas.getContext('2d'), cx=100, cy=100, r=75, n=anSkills.length;
  ctx.clearRect(0,0,200,200);
  [0.25,0.5,0.75,1.0].forEach(scale => {
    ctx.beginPath();
    anSkills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*scale, y=cy+Math.sin(a)*r*scale; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.closePath(); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.stroke();
  });
  anSkills.forEach((_,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.stroke(); });
  const avg=[0.65,0.60,0.55,0.50,0.58,0.52];
  ctx.beginPath(); avg.forEach((v,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*v, y=cy+Math.sin(a)*r*v; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.closePath(); ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1; ctx.stroke();
  ctx.beginPath(); anSkills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; const x=cx+Math.cos(a)*r*s.val, y=cy+Math.sin(a)*r*s.val; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.closePath(); ctx.fillStyle='rgba(124,58,237,0.35)'; ctx.fill(); ctx.strokeStyle='#9d5cf6'; ctx.lineWidth=2; ctx.stroke();
  anSkills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*s.val,cy+Math.sin(a)*r*s.val,3,0,Math.PI*2); ctx.fillStyle='#a78bfa'; ctx.fill(); });
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='10px Inter'; ctx.textAlign='center';
  anSkills.forEach((s,i)=>{ const a=(i/n)*Math.PI*2-Math.PI/2; ctx.fillText(s.label,cx+Math.cos(a)*(r+14),cy+Math.sin(a)*(r+14)+3); });
}

function exportReport() {
  const session = getSession();
  const w = window.open('','_blank');
  w.document.write('<!DOCTYPE html><html><head><title>Analytics Report</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{color:#7c3aed}.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0}.stat{background:#f8f7ff;border:1px solid #e5e0ff;border-radius:8px;padding:14px;text-align:center}.stat-val{font-size:22px;font-weight:700;color:#7c3aed}.stat-label{font-size:11px;color:#666;margin-top:4px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#7c3aed;color:#fff;padding:8px 12px;text-align:left;font-size:12px}td{padding:8px 12px;border-bottom:1px solid #eee;font-size:12px}.footer{text-align:center;color:#999;font-size:11px;margin-top:32px;border-top:1px solid #eee;padding-top:16px}@media print{.no-print{display:none}}</style></head><body>');
  w.document.write('<h1>Analytics Report</h1><p style="color:#666">Generated for '+(session?.name||'Learner')+' &middot; '+new Date().toLocaleDateString('id-ID',{dateStyle:'long'})+'</p>');
  w.document.write('<div class="stat-row"><div class="stat"><div class="stat-val">47h 32m</div><div class="stat-label">Total Jam Belajar</div></div><div class="stat"><div class="stat-val">12</div><div class="stat-label">Kursus Selesai</div></div><div class="stat"><div class="stat-val">8</div><div class="stat-label">Quiz Dikerjakan</div></div><div class="stat"><div class="stat-val">82%</div><div class="stat-label">Rata-rata Skor</div></div></div>');
  w.document.write('<h3>Course Progress</h3><table><tr><th>Kursus</th><th>Progress</th></tr>'+anCourses.map(c=>'<tr><td>'+c.name+'</td><td>'+c.pct+'%</td></tr>').join('')+'</table>');
  w.document.write('<h3>Recent Activity</h3><table><tr><th>Aktivitas</th><th>XP</th><th>Waktu</th></tr>'+anRecentActivities.map(a=>'<tr><td>'+a.text+'</td><td>'+a.xp+'</td><td>'+a.time+'</td></tr>').join('')+'</table>');
  w.document.write('<div class="footer">Lunetix AI Learning Platform &middot; lunetix.ai</div><div class="no-print" style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#7c3aed;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px">Print / Save PDF</button></div></body></html>');
  w.document.close();
}
