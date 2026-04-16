// -- PROJECTS --

const projEarnItems = [
  { label:'Complete a project', pts:'+100 pts', icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { label:'Share your project', pts:'+50 pts',  icon:'share-2',      bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { label:'Get upvoted',        pts:'+10 pts/upvote', icon:'thumbs-up', bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
];

// Projects disimpan di localStorage — mulai kosong untuk user baru
function getProjects() { return store.get('projects', []); }
function saveProjects(p) { store.set('projects', p); }

function renderProjects(filter='all') {
  renderProjStats();
  renderProjCards(filter);
  renderProjExplore();
  renderProjActivity();
  renderProjEarn();
}

function renderProjStats() {
  const el = document.getElementById('proj-stats-bar'); if (!el) return;
  const projects = getProjects();
  const session = getSession();
  const stats = [
    { val: projects.length,                                   label:'Total Projects', icon:'folder',       bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val: projects.filter(p=>p.status==='active').length,    label:'In Progress',    icon:'clock',        bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
    { val: projects.filter(p=>p.status==='completed').length, label:'Completed',      icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val: (session?.points || 0).toLocaleString(),           label:'Total Points',   icon:'star',         bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="proj-stat-card">
      <div class="proj-stat-icon" style="background:${s.bg}">
        <i data-lucide="${s.icon}" style="width:22px;height:22px;color:${s.color}"></i>
      </div>
      <div>
        <div class="proj-stat-val">${s.val}</div>
        <div class="proj-stat-label">${s.label}</div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

function renderProjCards(filter='all') {
  const grid = document.getElementById('projects-grid'); if (!grid) return;
  let projects = getProjects();
  if (filter === 'active')    projects = projects.filter(p => p.status === 'active');
  else if (filter === 'completed') projects = projects.filter(p => p.status === 'completed');

  const stackColors = {
    'Python':'#3b82f6','TensorFlow':'#f97316','PyTorch':'#ef4444',
    'Scikit-learn':'#f59e0b','OpenCV':'#10b981','YOLOv8':'#8b5cf6','OpenAI API':'#06b6d4'
  };

  const addCard = `
    <div class="proj-card-add" onclick="showNewProjectModal()">
      <div class="proj-card-add-icon"><i data-lucide="plus" style="width:22px;height:22px"></i></div>
      <div class="proj-card-add-title">New Project</div>
      <div class="proj-card-add-sub">Start building something amazing.</div>
      <button class="btn btn-primary" style="padding:8px 20px;font-size:12px;margin-top:4px" onclick="event.stopPropagation();showNewProjectModal()">Create Project</button>
    </div>`;

  if (!projects.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
        <i data-lucide="folder" style="width:40px;height:40px;margin-bottom:12px;opacity:0.4"></i>
        <div style="font-size:14px;margin-bottom:16px">Belum ada project. Mulai buat yang pertama!</div>
        <button class="btn btn-primary" style="padding:10px 24px;font-size:13px" onclick="showNewProjectModal()">
          <i data-lucide="plus" style="width:14px;height:14px"></i> Buat Project
        </button>
      </div>` + addCard;
    lucide.createIcons();
    return;
  }

  const cards = projects.map(p => `
    <div class="proj-card-new">
      <div class="proj-card-thumb" style="background:${p.thumbBg}">
        <i data-lucide="${p.thumbIcon}" style="width:52px;height:52px;color:${p.thumbColor};opacity:0.9"></i>
        <div class="proj-card-status-badge ${p.status}">
          <i data-lucide="${p.status === 'completed' ? 'check-circle' : 'clock'}" style="width:10px;height:10px"></i>
          ${p.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
        <button class="proj-card-menu" onclick="event.stopPropagation();projMenu(${p.id})">⋯</button>
      </div>
      <div class="proj-card-body">
        <div class="proj-card-title">${p.name}</div>
        <div class="proj-card-desc">${p.desc}</div>
        <div class="proj-card-stack">
          ${p.stack.map(s => `<span class="proj-stack-tag" style="color:${stackColors[s] || '#a0a0c0'}">
            <i data-lucide="code-2" style="width:9px;height:9px"></i> ${s}
          </span>`).join('')}
        </div>
        <div class="proj-card-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
          <div class="proj-card-pct">${p.progress}%</div>
        </div>
      </div>
    </div>`).join('');

  grid.innerHTML = cards + addCard;
  lucide.createIcons();
}

function renderProjExplore() {
  const el = document.getElementById('proj-explore-grid'); if (!el) return;
  // Explore projects akan diisi dari komunitas di masa depan
  el.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);font-size:12px">
      <i data-lucide="compass" style="width:28px;height:28px;margin-bottom:8px;opacity:0.4"></i>
      <div>Explore projects dari komunitas akan segera hadir.</div>
    </div>`;
  lucide.createIcons();
}

function renderProjActivity() {
  const el = document.getElementById('proj-activity-list'); if (!el) return;
  const projects = getProjects();

  // Ambil 4 project terbaru sebagai activity
  const recent = [...projects]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  if (!recent.length) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada aktivitas.</div>`;
    return;
  }

  const colors = ['#34d399','#60a5fa','#a78bfa','#fbbf24'];
  el.innerHTML = recent.map((p, i) => `
    <div class="proj-activity-item">
      <div class="proj-activity-dot" style="background:${colors[i % colors.length]}20">
        <i data-lucide="${p.status === 'completed' ? 'check-circle' : 'clock'}" style="width:12px;height:12px;color:${colors[i % colors.length]}"></i>
      </div>
      <div style="flex:1">
        <div class="proj-activity-text">${p.status === 'completed' ? 'Completed' : 'In Progress'}: ${p.name}</div>
        <div class="proj-activity-time">${p.date}</div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

function renderProjEarn() {
  const el = document.getElementById('proj-earn-list'); if (!el) return;
  el.innerHTML = projEarnItems.map(e => `
    <div class="proj-earn-item">
      <div class="proj-earn-icon" style="background:${e.bg}">
        <i data-lucide="${e.icon}" style="width:14px;height:14px;color:${e.color}"></i>
      </div>
      <div class="proj-earn-label">${e.label}</div>
      <div class="proj-earn-pts">${e.pts}</div>
    </div>`).join('');
  lucide.createIcons();
}

function filterProjects(f, btn) {
  document.querySelectorAll('.proj-ftab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProjCards(f);
}

function projMenu(id) {
  const choice = prompt('1. Mark as Completed\n2. Delete\n\nKetik nomor:');
  if (choice === '2') deleteProject(id);
  else if (choice === '1') toggleProjectStatus(id);
}

function showNewProjectModal() {
  const m = document.getElementById('new-project-modal');
  if (m) { m.style.display = 'flex'; lucide.createIcons(); }
}

function closeNewProjectModal() {
  const m = document.getElementById('new-project-modal');
  if (m) m.style.display = 'none';
}

function createProject() {
  const name  = document.getElementById('proj-name')?.value.trim();
  const cat   = document.getElementById('proj-cat')?.value;
  const stack = document.getElementById('proj-stack')?.value.trim();
  const desc  = document.getElementById('proj-desc')?.value.trim();
  if (!name) { showToast('Nama project wajib diisi.'); return; }

  const thumbMap = {
    'Machine Learning':       { bg:'linear-gradient(135deg,#1e1b4b,#312e81)', icon:'cpu',            color:'#a78bfa' },
    'Deep Learning':          { bg:'linear-gradient(135deg,#1e3a5f,#1e40af)', icon:'network',        color:'#60a5fa' },
    'NLP':                    { bg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', icon:'message-square', color:'#c084fc' },
    'Computer Vision':        { bg:'linear-gradient(135deg,#1c3a2e,#065f46)', icon:'eye',            color:'#34d399' },
    'Data Science':           { bg:'linear-gradient(135deg,#1c2a4a,#1e3a8a)', icon:'database',       color:'#818cf8' },
    'Reinforcement Learning': { bg:'linear-gradient(135deg,#3b1a1a,#7f1d1d)', icon:'gamepad',        color:'#f87171' },
  };
  const thumb = thumbMap[cat] || thumbMap['Machine Learning'];
  const stackArr = stack ? stack.split(',').map(s => s.trim()).filter(Boolean) : [cat];

  const projects = getProjects();
  projects.unshift({
    id:        Date.now(),
    name,
    category:  cat,
    desc:      desc || 'No description.',
    stack:     stackArr,
    status:    'active',
    progress:  0,
    date:      new Date().toISOString().split('T')[0],
    thumbBg:   thumb.bg,
    thumbIcon: thumb.icon,
    thumbColor:thumb.color,
  });
  saveProjects(projects);
  closeNewProjectModal();
  ['proj-name','proj-desc','proj-stack'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderProjects();
  showToast('Project berhasil dibuat!');
}

function deleteProject(id) {
  if (!confirm('Hapus project ini?')) return;
  saveProjects(getProjects().filter(p => p.id !== id));
  renderProjects();
  showToast('Project dihapus.');
}

function toggleProjectStatus(id) {
  const projects = getProjects();
  const p = projects.find(x => x.id === id);
  if (p) {
    p.status = p.status === 'active' ? 'completed' : 'active';
    if (p.status === 'completed') p.progress = 100;
  }
  saveProjects(projects);
  renderProjects();
}
