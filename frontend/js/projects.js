// -- PROJECTS --
// PROJECTS
// ----------------------------------------------
const defaultProjects = [
  { id:1, name:'AI Image Classifier',  category:'Deep Learning',    desc:'A deep learning model to classify images into 10 different categories.', stack:['Python','TensorFlow'], status:'completed', progress:92, date:'2024-01-15', thumbBg:'linear-gradient(135deg,#1e1b4b,#312e81)', thumbIcon:'cpu',         thumbColor:'#a78bfa' },
  { id:2, name:'Sentiment Analyzer',   category:'NLP',              desc:'Analyze text sentiment using NLP and transformer models.',               stack:['Python','PyTorch'],    status:'active',    progress:65, date:'2024-02-20', thumbBg:'linear-gradient(135deg,#064e3b,#065f46)', thumbIcon:'message-square',thumbColor:'#34d399' },
  { id:3, name:'Chatbot Assistant',    category:'NLP',              desc:'An intelligent chatbot built with LLMs and conversational memory.',      stack:['Python','OpenAI API'], status:'completed', progress:100,date:'2024-03-05', thumbBg:'linear-gradient(135deg,#1e3a5f,#1e40af)', thumbIcon:'cpu',         thumbColor:'#60a5fa' },
  { id:4, name:'Sales Predictor',      category:'Machine Learning', desc:'Predict sales trends using machine learning regression models.',         stack:['Python','Scikit-learn'],status:'active',   progress:40, date:'2024-03-20', thumbBg:'linear-gradient(135deg,#1a2e1a,#14532d)', thumbIcon:'trending-up', thumbColor:'#4ade80' },
  { id:5, name:'Object Detection',     category:'Computer Vision',  desc:'Real-time object detection with YOLOv8 and OpenCV.',                    stack:['Python','YOLOv8'],     status:'completed', progress:88, date:'2024-04-01', thumbBg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', thumbIcon:'eye',         thumbColor:'#c084fc' },
];
const exploreProjects = [
  { title:'Weather Forecast',      author:'Sarah Lee',  desc:'Predict weather using time series analysis.', icon:'cloud',        bg:'rgba(59,130,246,0.15)',  color:'#60a5fa', rating:4.8, views:125 },
  { title:'Handwritten OCR',       author:'John Doe',   desc:'Recognize handwritten digits using CNN.',     icon:'pen-tool',     bg:'rgba(168,85,247,0.15)', color:'#c084fc', rating:4.6, views:98  },
  { title:'Stock Price Predictor', author:'Mia Chen',   desc:'Forecast stock prices with LSTM networks.',  icon:'trending-up',  bg:'rgba(16,185,129,0.15)', color:'#34d399', rating:4.7, views:196 },
  { title:'AI Voice Assistant',    author:'David Kim',  desc:'Voice assistant with speech recognition.',   icon:'mic',          bg:'rgba(245,158,11,0.15)', color:'#fbbf24', rating:4.9, views:203 },
];
const projActivity = [
  { text:'Project completed: AI Image Classifier', pts:'+160 pts', time:'2 hours ago', color:'#34d399' },
  { text:'Code committed: Sentiment Analyzer',     pts:'+30 pts',  time:'5 hours ago', color:'#60a5fa' },
  { text:'Milestone reached: Chatbot Assistant',   pts:'+200 pts', time:'1 day ago',   color:'#a78bfa' },
  { text:'New project created: Sales Predictor',   pts:'+50 pts',  time:'2 days ago',  color:'#fbbf24' },
];
const projEarnItems = [
  { label:'Complete a project', pts:'+100 pts', icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { label:'Share your project', pts:'+50 pts',  icon:'share-2',      bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { label:'Get upvoted',        pts:'+10 pts/upvote', icon:'thumbs-up', bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
];

function getProjects() { return store.get('projects', defaultProjects); }
function saveProjects(p) { store.set('projects', p); }

function renderProjects(filter='all') {
  renderProjStats(); renderProjCards(filter); renderProjExplore(); renderProjActivity(); renderProjEarn();
}
function renderProjStats() {
  const el = document.getElementById('proj-stats-bar'); if (!el) return;
  const projects = getProjects();
  const session = getSession();
  const stats = [
    { val:projects.length,                                    label:'Total Projects', icon:'folder',       bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val:projects.filter(p=>p.status==='active').length,     label:'In Progress',    icon:'clock',        bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
    { val:projects.filter(p=>p.status==='completed').length,  label:'Completed',      icon:'check-circle', bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val:(session?.points||1200).toLocaleString(),           label:'Total Points',   icon:'star',         bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  ];
  el.innerHTML = stats.map(s=>`<div class="proj-stat-card"><div class="proj-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:22px;height:22px;color:${s.color}"></i></div><div><div class="proj-stat-val">${s.val}</div><div class="proj-stat-label">${s.label}</div></div></div>`).join('');
  lucide.createIcons();
}
function renderProjCards(filter='all') {
  const grid = document.getElementById('projects-grid'); if (!grid) return;
  let projects = getProjects();
  if (filter==='active') projects = projects.filter(p=>p.status==='active');
  else if (filter==='completed') projects = projects.filter(p=>p.status==='completed');
  const stackColors = { 'Python':'#3b82f6','TensorFlow':'#f97316','PyTorch':'#ef4444','Scikit-learn':'#f59e0b','OpenCV':'#10b981','YOLOv8':'#8b5cf6','OpenAI API':'#06b6d4' };
  const cards = projects.map(p=>`
    <div class="proj-card-new">
      <div class="proj-card-thumb" style="background:${p.thumbBg}">
        <i data-lucide="${p.thumbIcon}" style="width:52px;height:52px;color:${p.thumbColor};opacity:0.9"></i>
        <div class="proj-card-status-badge ${p.status}"><i data-lucide="${p.status==='completed'?'check-circle':'clock'}" style="width:10px;height:10px"></i> ${p.status==='completed'?'Completed':'In Progress'}</div>
        <button class="proj-card-menu" onclick="event.stopPropagation();projMenu(${p.id})">?</button>
      </div>
      <div class="proj-card-body">
        <div class="proj-card-title">${p.name}</div>
        <div class="proj-card-desc">${p.desc}</div>
        <div class="proj-card-stack">${p.stack.map(s=>`<span class="proj-stack-tag" style="color:${stackColors[s]||'#a0a0c0'}"><i data-lucide="code-2" style="width:9px;height:9px"></i> ${s}</span>`).join('')}</div>
        <div class="proj-card-progress"><div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div><div class="proj-card-pct">${p.progress}%</div></div>
      </div>
    </div>`).join('');
  const addCard = `<div class="proj-card-add" onclick="showNewProjectModal()"><div class="proj-card-add-icon"><i data-lucide="plus" style="width:22px;height:22px"></i></div><div class="proj-card-add-title">New Project</div><div class="proj-card-add-sub">Start building something amazing.</div><button class="btn btn-primary" style="padding:8px 20px;font-size:12px;margin-top:4px" onclick="event.stopPropagation();showNewProjectModal()">Create Project</button></div>`;
  grid.innerHTML = cards + addCard;
  lucide.createIcons();
}
function renderProjExplore() {
  const el = document.getElementById('proj-explore-grid'); if (!el) return;
  el.innerHTML = exploreProjects.map(p=>`
    <div class="proj-explore-card">
      <div class="proj-explore-thumb" style="background:${p.bg}"><i data-lucide="${p.icon}" style="width:20px;height:20px;color:${p.color}"></i></div>
      <div class="proj-explore-title">${p.title}</div>
      <div class="proj-explore-author" style="display:flex;align-items:center;gap:4px"><i data-lucide="user" style="width:10px;height:10px"></i> ${p.author}</div>
      <div class="proj-explore-desc">${p.desc}</div>
      <div class="proj-explore-meta"><span>? ${p.rating}</span><span><i data-lucide="eye" style="width:10px;height:10px"></i> ${p.views}</span></div>
    </div>`).join('');
  lucide.createIcons();
}
function renderProjActivity() {
  const el = document.getElementById('proj-activity-list'); if (!el) return;
  el.innerHTML = projActivity.map(a=>`<div class="proj-activity-item"><div class="proj-activity-dot" style="background:${a.color}20"><i data-lucide="zap" style="width:12px;height:12px;color:${a.color}"></i></div><div style="flex:1"><div class="proj-activity-text">${a.text}</div><div class="proj-activity-time">${a.time}</div></div><div class="proj-activity-pts" style="color:${a.color}">${a.pts}</div></div>`).join('');
  lucide.createIcons();
}
function renderProjEarn() {
  const el = document.getElementById('proj-earn-list'); if (!el) return;
  el.innerHTML = projEarnItems.map(e=>`<div class="proj-earn-item"><div class="proj-earn-icon" style="background:${e.bg}"><i data-lucide="${e.icon}" style="width:14px;height:14px;color:${e.color}"></i></div><div class="proj-earn-label">${e.label}</div><div class="proj-earn-pts">${e.pts}</div></div>`).join('');
  lucide.createIcons();
}
function filterProjects(f, btn) {
  document.querySelectorAll('.proj-ftab').forEach(t=>t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProjCards(f);
}
function projMenu(id) {
  const choice = prompt('1. Mark as Completed\n2. Delete\n\nKetik nomor:');
  if (choice==='2') deleteProject(id);
  else if (choice==='1') toggleProjectStatus(id);
}
function showNewProjectModal() {
  const m = document.getElementById('new-project-modal');
  if (m) { m.style.display='flex'; lucide.createIcons(); }
}
function closeNewProjectModal() {
  const m = document.getElementById('new-project-modal');
  if (m) m.style.display='none';
}
function createProject() {
  const name  = document.getElementById('proj-name')?.value.trim();
  const cat   = document.getElementById('proj-cat')?.value;
  const stack = document.getElementById('proj-stack')?.value.trim();
  const desc  = document.getElementById('proj-desc')?.value.trim();
  if (!name) { showToast('Nama project wajib diisi.'); return; }
  const thumbMap = {
    'Machine Learning':{'bg':'linear-gradient(135deg,#1e1b4b,#312e81)','icon':'cpu','color':'#a78bfa'},
    'Deep Learning':   {'bg':'linear-gradient(135deg,#1e3a5f,#1e40af)','icon':'network','color':'#60a5fa'},
    'NLP':             {'bg':'linear-gradient(135deg,#3b1f5e,#6d28d9)','icon':'message-square','color':'#c084fc'},
    'Computer Vision': {'bg':'linear-gradient(135deg,#1c3a2e,#065f46)','icon':'eye','color':'#34d399'},
    'Data Science':    {'bg':'linear-gradient(135deg,#1c2a4a,#1e3a8a)','icon':'database','color':'#818cf8'},
    'Reinforcement Learning':{'bg':'linear-gradient(135deg,#3b1a1a,#7f1d1d)','icon':'gamepad','color':'#f87171'},
  };
  const thumb = thumbMap[cat] || thumbMap['Machine Learning'];
  const stackArr = stack ? stack.split(',').map(s=>s.trim()).filter(Boolean) : [cat];
  const projects = getProjects();
  projects.unshift({ id:Date.now(), name, category:cat, desc:desc||'No description.', stack:stackArr, status:'active', progress:0, date:new Date().toISOString().split('T')[0], thumbBg:thumb.bg, thumbIcon:thumb.icon, thumbColor:thumb.color });
  saveProjects(projects);
  closeNewProjectModal();
  ['proj-name','proj-desc','proj-stack'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  renderProjects();
  showToast('Project berhasil dibuat! ??');
}
function deleteProject(id) {
  if (!confirm('Hapus project ini?')) return;
  saveProjects(getProjects().filter(p=>p.id!==id));
  renderProjects();
  showToast('Project dihapus.');
}
function toggleProjectStatus(id) {
  const projects = getProjects();
  const p = projects.find(x=>x.id===id);
  if (p) { p.status = p.status==='active'?'completed':'active'; if(p.status==='completed') p.progress=100; }
  saveProjects(projects);
  renderProjects();
}

