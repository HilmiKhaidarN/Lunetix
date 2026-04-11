// ══ DASHBOARD PAGE ══
const dbCourses = [
  { id:1, title:'Machine Learning Fundamentals', level:'Beginner',     progress:70, lessons:'12 / 18 lessons', bg:'linear-gradient(135deg,#1e1b4b,#312e81)', icon:'cpu',            color:'#a78bfa' },
  { id:2, title:'Python for AI',                 level:'Beginner',     progress:45, lessons:'8 / 20 lessons',  bg:'linear-gradient(135deg,#14532d,#166534)', icon:'code-2',         color:'#4ade80' },
  { id:3, title:'Deep Learning Essentials',      level:'Intermediate', progress:25, lessons:'6 / 24 lessons',  bg:'linear-gradient(135deg,#1e3a5f,#1e40af)', icon:'network',        color:'#60a5fa' },
  { id:4, title:'Natural Language Processing',   level:'Intermediate', progress:10, lessons:'2 / 22 lessons',  bg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', icon:'message-square', color:'#c084fc' },
];
const dbProgressBars = [
  { label:'Machine Learning', pct:70, color:'#a78bfa' },
  { label:'Deep Learning',    pct:40, color:'#60a5fa' },
  { label:'Python',           pct:80, color:'#4ade80' },
  { label:'Data Science',     pct:60, color:'#fbbf24' },
  { label:'NLP',              pct:20, color:'#f87171' },
];
const dbUpcoming = [
  { title:'Python for AI - Lesson 9',              time:'Tomorrow, 10:00 AM',    icon:'code-2',    bg:'rgba(16,185,129,0.15)', color:'#34d399', btn:'continue' },
  { title:'Quiz: Machine Learning Basics',          time:'May 20, 2:00 PM',       icon:'help-circle',bg:'rgba(124,58,237,0.15)',color:'#a78bfa', btn:'start' },
  { title:'Project Deadline: AI Chatbot Assistant', time:'May 22, 11:59 PM',      icon:'folder',    bg:'rgba(245,158,11,0.15)', color:'#fbbf24', btn:'view' },
];
const dbAchievements = [
  { title:'Quick Learner',   desc:'Complete 5 lessons in a day',  icon:'zap',          bg:'rgba(245,158,11,0.15)', color:'#fbbf24', done:true,  progress:'✓' },
  { title:'AI Explorer',     desc:'Try 3 different AI models',    icon:'cpu',          bg:'rgba(59,130,246,0.15)', color:'#60a5fa', done:false, progress:'2/3' },
  { title:'Quiz Master',     desc:'Score 90% on any quiz',        icon:'target',       bg:'rgba(124,58,237,0.15)', color:'#a78bfa', done:true,  progress:'✓' },
  { title:'Project Builder', desc:'Build your first project',     icon:'folder',       bg:'rgba(16,185,129,0.15)', color:'#34d399', done:true,  progress:'1/1' },
];
const dbRecentActivity = [
  { text:'Completed Deep Learning Basics',          xp:'+80 XP',  time:'2 hours ago', icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { text:'Code Commit: AI Chatbot Project',         xp:'+60 XP',  time:'5 hours ago', icon:'code-2',       bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { text:'Quiz Completed: Machine Learning Quiz',   xp:'+80 XP',  time:'Yesterday',   icon:'help-circle',  bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
  { text:'Project Published: Image Classifier',     xp:'+120 XP', time:'2 days ago',  icon:'folder',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
];
const dbStudyTips = [
  'Review material in spaced intervals to improve long-term retention.',
  'Practice coding every day, even just 15 minutes makes a big difference.',
  'Teach what you learn — explaining concepts solidifies your understanding.',
  'Build projects alongside courses to apply theory in practice.',
  'Focus on understanding concepts, not memorizing syntax.',
];

function initDashboard() {
  renderDbDynamicStats();
  renderDbCourses();
  renderDbProgressBars();
  renderDbUpcoming();
  renderDbMiniCalendar();
  renderDbAchievements();
  renderDbRecentActivity();
  renderDbStreak();
  renderDbStudyTip();
  setTimeout(() => {
    document.querySelectorAll('.db-progress-bar-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%');
    document.querySelectorAll('.progress-fill[data-width]').forEach(el => el.style.width = el.dataset.width + '%');
  }, 200);
  lucide.createIcons();
}

// Dynamic stats from real data
function renderDbDynamicStats() {
  const el = document.getElementById('db-stats-bar-dynamic'); if (!el) return;
  const projects = typeof getProjects === 'function' ? getProjects() : [];
  const scores   = store.get('quiz_scores', {});
  const avgScore = Object.keys(scores).length
    ? Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length)
    : 85;
  const completedProjects = projects.filter(p=>p.status==='completed').length;

  const stats = [
    { val:5,                label:'Courses in Progress', sub:'Keep going!',       icon:'book-open',    bg:'rgba(124,58,237,0.15)', color:'#a78bfa', trend:null,         page:'courses' },
    { val:12,               label:'Completed Lessons',   sub:'+2 this week',      icon:'check-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa', trend:'trending-up', page:'analytics' },
    { val:completedProjects||3, label:'Projects Built',  sub:'+1 this month',     icon:'code-2',       bg:'rgba(16,185,129,0.15)', color:'#34d399', trend:'trending-up', page:'projects' },
    { val:avgScore+'%',     label:'Avg. Quiz Score',     sub:'+5% this week',     icon:'target',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24', trend:'trending-up', page:'quizzes' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="db-stat-card" onclick="window.navigateTo&&navigateTo('${s.page}')" style="cursor:pointer">
      <div class="db-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i></div>
      <div class="db-stat-body">
        <div class="db-stat-val">${s.val}</div>
        <div class="db-stat-label">${s.label}</div>
        <div class="db-stat-sub" style="${s.trend?'color:var(--success)':''}">${s.sub}</div>
      </div>
      ${s.trend ? `<i data-lucide="${s.trend}" style="width:14px;height:14px;color:var(--success);margin-left:auto"></i>` : `<i data-lucide="arrow-right" style="width:14px;height:14px;color:var(--text-muted);margin-left:auto"></i>`}
    </div>`).join('');
  lucide.createIcons();
}

function renderDbCourses() {
  const el = document.getElementById('db-courses-row'); if (!el) return;
  el.innerHTML = dbCourses.map(c => `
    <div class="db-course-card" onclick="openCourse(${c.id})">
      <div class="db-course-thumb" style="background:${c.bg}">
        <i data-lucide="${c.icon}" style="width:44px;height:44px;color:${c.color}"></i>
        <div class="db-course-level-badge">${c.level}</div>
      </div>
      <div class="db-course-body">
        <div class="db-course-title">${c.title}</div>
        <div class="db-course-progress-row"><span>${c.progress}%</span></div>
        <div class="progress-bar" style="height:3px;margin-bottom:8px">
          <div class="progress-fill" data-width="${c.progress}" style="width:0%;background:${c.color}"></div>
        </div>
        <div class="db-course-footer">
          <div class="db-course-lessons">${c.lessons}</div>
          <button class="db-course-play"><i data-lucide="play" style="width:11px;height:11px;color:#fff;margin-left:1px"></i></button>
        </div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

function renderDbProgressBars() {
  const barsEl = document.getElementById('db-progress-bars');
  const statsEl = document.getElementById('db-progress-stats');
  const ringPct = document.getElementById('db-ring-pct');
  const ringOffset = document.getElementById('db-ring-offset');
  const period = document.getElementById('db-progress-period')?.value || 'week';

  // Different data per period
  const data = {
    week:  [{ label:'Machine Learning', pct:70, color:'#a78bfa' },{ label:'Deep Learning', pct:40, color:'#60a5fa' },{ label:'Python', pct:80, color:'#4ade80' },{ label:'Data Science', pct:60, color:'#fbbf24' },{ label:'NLP', pct:20, color:'#f87171' }],
    month: [{ label:'Machine Learning', pct:85, color:'#a78bfa' },{ label:'Deep Learning', pct:55, color:'#60a5fa' },{ label:'Python', pct:100, color:'#4ade80' },{ label:'Data Science', pct:70, color:'#fbbf24' },{ label:'NLP', pct:35, color:'#f87171' }],
  };
  const bars = data[period] || data.week;
  const overall = Math.round(bars.reduce((s,b)=>s+b.pct,0)/bars.length);
  const circumference = 251;
  const offset = circumference - (overall/100)*circumference;

  if (ringPct) ringPct.textContent = overall + '%';
  if (ringOffset) ringOffset.style.strokeDashoffset = offset;

  if (!barsEl) return;
  barsEl.innerHTML = bars.map(b => `
    <div class="db-progress-bar-row">
      <div class="db-progress-bar-label">${b.label}</div>
      <div class="db-progress-bar-track"><div class="db-progress-bar-fill" data-w="${b.pct}" style="width:0%;background:${b.color}"></div></div>
      <div class="db-progress-bar-pct">${b.pct}%</div>
    </div>`).join('');

  const timeData = { week:{ time:'24h 30m', lessons:18, pts:320 }, month:{ time:'96h 15m', lessons:72, pts:1250 } };
  const td = timeData[period];
  if (statsEl) statsEl.innerHTML = `
    <div class="db-ps-item"><div class="db-ps-val" style="color:#60a5fa">${td.time}</div><div class="db-ps-label">Time Learned</div></div>
    <div class="db-ps-item"><div class="db-ps-val" style="color:#34d399">${td.lessons}</div><div class="db-ps-label">Lessons Completed</div></div>
    <div class="db-ps-item"><div class="db-ps-val" style="color:#fbbf24">${td.pts}</div><div class="db-ps-label">Points Earned</div></div>`;

  setTimeout(() => document.querySelectorAll('.db-progress-bar-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%'), 100);
}

function renderDbUpcoming() {
  const el = document.getElementById('db-upcoming-list'); if (!el) return;
  el.innerHTML = dbUpcoming.map(u => `
    <div class="db-upcoming-item" onclick="window.navigateTo&&navigateTo('${u.btn==='continue'?'courses':u.btn==='start'?'quizzes':'projects'}')" style="cursor:pointer">
      <div class="db-upcoming-icon" style="background:${u.bg}"><i data-lucide="${u.icon}" style="width:14px;height:14px;color:${u.color}"></i></div>
      <div style="flex:1;min-width:0"><div class="db-upcoming-title">${u.title}</div><div class="db-upcoming-time">${u.time}</div></div>
      <button class="db-upcoming-btn ${u.btn}" onclick="event.stopPropagation();window.navigateTo&&navigateTo('${u.btn==='continue'?'courses':u.btn==='start'?'quizzes':'projects'}')">${u.btn.charAt(0).toUpperCase()+u.btn.slice(1)}</button>
    </div>`).join('');
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
  const eventDays = [today+1,today+3,today+6];
  const dayLabels = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  let cells = '';
  for (let i=0;i<firstDay;i++) cells+=`<div class="db-cal-day"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const isToday=d===today, hasEvent=eventDays.includes(d);
    cells+=`<div class="db-cal-day ${isToday?'today':''} ${hasEvent&&!isToday?'has-event':''}">${d}</div>`;
  }
  el.innerHTML = `<div class="db-calendar">
    <div class="db-cal-header"><span>${month} ${year}</span><div style="display:flex;gap:4px"><button style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px">‹</button><button style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px">›</button></div></div>
    <div class="db-cal-days">${dayLabels.map(d=>`<div class="db-cal-day-label">${d}</div>`).join('')}${cells}</div>
  </div>`;
}

function renderDbAchievements() {
  const el = document.getElementById('db-achievements-list'); if (!el) return;
  el.innerHTML = dbAchievements.map(a => `
    <div class="db-achievement-item" onclick="window.navigateTo&&navigateTo('certificates')" style="cursor:pointer">
      <div class="db-ach-icon" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:16px;height:16px;color:${a.color}"></i></div>
      <div style="flex:1"><div class="db-ach-title">${a.title}</div><div class="db-ach-desc">${a.desc}</div></div>
      <div class="db-ach-badge">${a.done
        ?`<div style="width:22px;height:22px;border-radius:50%;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center"><i data-lucide="check" style="width:12px;height:12px;color:#34d399"></i></div>`
        :`<span style="font-size:10px;color:var(--text-muted)">${a.progress}</span>`}</div>
    </div>`).join('');
  lucide.createIcons();
}

function renderDbRecentActivity() {
  const el = document.getElementById('db-recent-activity'); if (!el) return;
  el.innerHTML = dbRecentActivity.map(a => `
    <div class="db-recent-item" onclick="window.navigateTo&&navigateTo('analytics')" style="cursor:pointer">
      <div class="db-recent-dot" style="background:${a.bg}"><i data-lucide="${a.icon}" style="width:12px;height:12px;color:${a.color}"></i></div>
      <div style="flex:1"><div class="db-recent-text">${a.text}</div><div class="db-recent-time">${a.time}</div></div>
      <div class="db-recent-xp" style="color:${a.color}">${a.xp}</div>
    </div>`).join('');
  lucide.createIcons();
}

function renderDbStreak() {
  const el = document.getElementById('db-streak-dots'); if (!el) return;
  const session = getSession();
  const streak = session?.streak || 7;
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
