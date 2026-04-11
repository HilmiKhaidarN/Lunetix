// ══ BOOKMARKS ══

const defaultBookmarks = [
  { id:1, title:'Machine Learning Fundamentals', sub:'Deep Learning Essentials', type:'course',      category:'Machine Learning', time:'2 hari lalu',   progress:70, bg:'linear-gradient(135deg,#1e1b4b,#312e81)', icon:'cpu',           iconColor:'#a78bfa', typeColor:'#a78bfa', typeBg:'rgba(124,58,237,0.2)' },
  { id:2, title:'Python for AI',                 sub:'Kursus · Beginner',        type:'course',      category:'Machine Learning', time:'5 hari lalu',   progress:45, bg:'linear-gradient(135deg,#14532d,#166534)', icon:'code-2',        iconColor:'#4ade80', typeColor:'#4ade80', typeBg:'rgba(16,185,129,0.2)' },
  { id:3, title:'Backpropagation Explained',     sub:'Deep Learning Essentials', type:'lesson',      category:'Deep Learning',    time:'1 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#1e3a5f,#1e40af)', icon:'play-circle',   iconColor:'#60a5fa', typeColor:'#60a5fa', typeBg:'rgba(59,130,246,0.2)' },
  { id:4, title:'Sentiment Analysis API',        sub:'GitHub',                   type:'project',     category:'NLP',              time:'1 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', icon:'folder',        iconColor:'#c084fc', typeColor:'#c084fc', typeBg:'rgba(168,85,247,0.2)' },
  { id:5, title:'Tips Belajar Deep Learning',    sub:'Community',                type:'discussion',  category:'Deep Learning',    time:'3 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#7f1d1d,#dc2626)', icon:'message-circle',iconColor:'#f87171', typeColor:'#f87171', typeBg:'rgba(239,68,68,0.2)' },
  { id:6, title:'Intro to Neural Networks',      sub:'Deep Learning Essentials', type:'lesson',      category:'Deep Learning',    time:'3 hari lalu',   progress:0,  bg:'linear-gradient(135deg,#1e3a5f,#1e40af)', icon:'play-circle',   iconColor:'#60a5fa', typeColor:'#60a5fa', typeBg:'rgba(59,130,246,0.2)' },
  { id:7, title:'Computer Vision Roadmap 2024',  sub:'Community Post',           type:'article',     category:'Computer Vision',  time:'1 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#1c3a2e,#065f46)', icon:'file-text',     iconColor:'#34d399', typeColor:'#34d399', typeBg:'rgba(16,185,129,0.2)' },
  { id:8, title:'Image Classifier with CNN',     sub:'Computer Vision',          type:'project',     category:'Computer Vision',  time:'2 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#1c3a2e,#065f46)', icon:'folder',        iconColor:'#34d399', typeColor:'#34d399', typeBg:'rgba(16,185,129,0.2)' },
  { id:9, title:'Attention Mechanism in Transformer', sub:'NLP Advanced',        type:'lesson',      category:'NLP',              time:'3 minggu lalu', progress:0,  bg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', icon:'play-circle',   iconColor:'#c084fc', typeColor:'#c084fc', typeBg:'rgba(168,85,247,0.2)' },
];

const bmTypeLabels = { course:'Kursus', lesson:'Pelajaran', article:'Artikel', project:'Proyek', quiz:'Quiz', discussion:'Diskusi' };
const bmWeekActivity = [3,5,2,7,4,8,6];
const bmWeekLabels   = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];

let bmActiveFilter = 'all';
let bmSearchQuery  = '';
let bmListTab      = 'all';

function getBmItems() { return store.get('bookmarks_v2', defaultBookmarks); }
function saveBmItems(b) { store.set('bookmarks_v2', b); }

function renderBookmarks() {
  renderBmStats();
  renderBmCards();
  renderBmList();
  renderBmChart();
  renderBmCategories();
}

// ── Stats ──
function renderBmStats() {
  const el = document.getElementById('bm-stats-bar'); if (!el) return;
  const items = getBmItems();
  const courses  = items.filter(b=>b.type==='course').length;
  const lessons  = items.filter(b=>b.type==='lesson').length;
  const totalMin = items.length * 22;
  const h = Math.floor(totalMin/60), m = totalMin%60;
  const stats = [
    { val:items.length, label:'Total Bookmark',    trend:'+3 dari minggu lalu', icon:'bookmark',     bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val:courses,      label:'Kursus Disimpan',   trend:'+2 dari minggu lalu', icon:'book-open',    bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    { val:lessons,      label:'Pelajaran Disimpan',trend:'+4 dari minggu lalu', icon:'play-circle',  bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    { val:`${h}h ${m}m`,label:'Waktu yang Dihemat',trend:'+1h dari minggu lalu',icon:'clock',        bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="bm-stat-card">
      <div class="bm-stat-icon" style="background:${s.bg}">
        <i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i>
      </div>
      <div style="flex:1">
        <div class="bm-stat-val">${s.val}</div>
        <div class="bm-stat-label">${s.label}</div>
        <div class="bm-stat-trend">${s.trend}</div>
      </div>
      <svg width="50" height="28" viewBox="0 0 50 28" style="opacity:0.6">
        <polyline points="0,22 10,18 20,20 30,10 40,14 50,6" fill="none" stroke="${s.color}" stroke-width="1.5"/>
      </svg>
    </div>`).join('');
  lucide.createIcons();
}

// ── Featured Cards ──
function renderBmCards() {
  const el = document.getElementById('bm-cards-row'); if (!el) return;
  let items = getBmItems();
  if (bmActiveFilter !== 'all') items = items.filter(b => b.type === bmActiveFilter);
  const featured = items.slice(0, 6);

  if (!featured.length) {
    el.innerHTML = `<div style="padding:40px;color:var(--text-muted);font-size:13px">Belum ada bookmark untuk kategori ini.</div>`;
    return;
  }

  el.innerHTML = featured.map(b => `
    <div class="bm-card">
      <div class="bm-card-thumb" style="background:${b.bg}">
        <i data-lucide="${b.icon}" style="width:40px;height:40px;color:${b.iconColor};z-index:1;position:relative"></i>
        <div class="bm-card-type-badge" style="background:${b.typeBg};color:${b.typeColor}">${bmTypeLabels[b.type]||b.type}</div>
        <button class="bm-card-remove" onclick="event.stopPropagation();removeBookmark(${b.id})" title="Hapus">
          <i data-lucide="x" style="width:10px;height:10px"></i>
        </button>
      </div>
      <div class="bm-card-body">
        <div class="bm-card-title">${b.title}</div>
        <div class="bm-card-sub">${b.sub}</div>
        ${b.progress > 0 ? `
          <div class="bm-card-progress">
            <div class="progress-bar"><div class="progress-fill" style="width:${b.progress}%"></div></div>
            <div class="bm-card-pct">${b.progress}%</div>
          </div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:3px">${b.progress}% Selesai</div>
        ` : ''}
        <div class="bm-card-footer">
          <div class="bm-card-time">${b.time}</div>
          <button class="bm-card-action" onclick="event.stopPropagation();showToast('Membuka ${b.title}...')">
            <i data-lucide="external-link" style="width:11px;height:11px;color:#a78bfa"></i>
          </button>
        </div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

// ── List View ──
function renderBmList() {
  const el = document.getElementById('bm-list'); if (!el) return;
  let items = getBmItems();
  if (bmActiveFilter !== 'all') items = items.filter(b => b.type === bmActiveFilter);
  if (bmSearchQuery) items = items.filter(b => b.title.toLowerCase().includes(bmSearchQuery) || b.category.toLowerCase().includes(bmSearchQuery));
  if (bmListTab === 'recent') items = items.slice(0, 4);

  if (!items.length) {
    el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <i data-lucide="search" style="width:32px;height:32px;margin-bottom:8px;opacity:0.4"></i>
      <p style="font-size:13px">Tidak ada bookmark ditemukan.</p>
    </div>`;
    lucide.createIcons(); return;
  }

  el.innerHTML = items.map(b => `
    <div class="bm-row" onclick="showToast('Membuka: ${b.title}')">
      <div class="bm-row-icon" style="background:${b.typeBg}">
        <i data-lucide="${b.icon}" style="width:16px;height:16px;color:${b.iconColor}"></i>
      </div>
      <div style="flex:2;min-width:0">
        <div class="bm-row-title">${b.title}</div>
        <div class="bm-row-sub">${b.sub}</div>
      </div>
      <div style="flex:1">
        <span class="bm-type-badge" style="background:${b.typeBg};color:${b.typeColor}">
          <i data-lucide="${b.icon}" style="width:10px;height:10px"></i>
          ${bmTypeLabels[b.type]||b.type}
        </span>
      </div>
      <div style="flex:1;font-size:12px;color:var(--text-secondary)">${b.category}</div>
      <div style="flex:1;font-size:11px;color:var(--text-muted)">${b.time}</div>
      <div style="flex:0.5;display:flex;justify-content:flex-end;gap:4px">
        <button class="bm-row-btn" onclick="event.stopPropagation();showToast('Membuka ${b.title}')" title="Buka">
          <i data-lucide="external-link" style="width:13px;height:13px"></i>
        </button>
        <button class="bm-row-btn" onclick="event.stopPropagation();removeBookmark(${b.id})" title="Hapus">
          <i data-lucide="trash-2" style="width:13px;height:13px;color:var(--danger)"></i>
        </button>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

// ── Sidebar Chart ──
function renderBmChart() {
  const chart  = document.getElementById('bm-chart');
  const labels = document.getElementById('bm-chart-labels');
  const tip    = document.getElementById('bm-chart-tip');
  if (!chart) return;
  const max = Math.max(...bmWeekActivity);
  const maxDay = bmWeekLabels[bmWeekActivity.indexOf(max)];
  chart.innerHTML = bmWeekActivity.map((v, i) => {
    const isMax = v === max;
    return `<div class="bm-chart-bar" style="height:${Math.max((v/max)*100,8)}%;background:${isMax?'var(--accent)':'rgba(124,58,237,0.25)'}"></div>`;
  }).join('');
  if (labels) labels.innerHTML = bmWeekLabels.map(l => `<div class="bm-chart-label">${l}</div>`).join('');
  if (tip) tip.textContent = `Bookmark terbanyak pada ${maxDay}`;
}

// ── Sidebar Categories ──
function renderBmCategories() {
  const el = document.getElementById('bm-categories'); if (!el) return;
  const items = getBmItems();
  const catMap = {};
  items.forEach(b => { catMap[b.category] = (catMap[b.category]||0) + 1; });
  const sorted = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const catIcons = { 'Deep Learning':'network', 'Machine Learning':'cpu', 'NLP':'message-square', 'Computer Vision':'eye', 'Data Science':'database', 'Python':'code-2' };
  const catColors = { 'Deep Learning':'#60a5fa', 'Machine Learning':'#a78bfa', 'NLP':'#c084fc', 'Computer Vision':'#34d399', 'Data Science':'#818cf8', 'Python':'#4ade80' };
  const catBgs = { 'Deep Learning':'rgba(59,130,246,0.15)', 'Machine Learning':'rgba(124,58,237,0.15)', 'NLP':'rgba(168,85,247,0.15)', 'Computer Vision':'rgba(16,185,129,0.15)', 'Data Science':'rgba(129,140,248,0.15)', 'Python':'rgba(74,222,128,0.15)' };
  el.innerHTML = sorted.map(([cat, count]) => `
    <div class="bm-cat-item">
      <div class="bm-cat-icon" style="background:${catBgs[cat]||'rgba(124,58,237,0.15)'}">
        <i data-lucide="${catIcons[cat]||'folder'}" style="width:13px;height:13px;color:${catColors[cat]||'#a78bfa'}"></i>
      </div>
      <div class="bm-cat-name">${cat}</div>
      <div class="bm-cat-count">${count}</div>
    </div>`).join('');
  lucide.createIcons();
}

// ── Actions ──
function filterBookmarks(type, btn) {
  document.querySelectorAll('.bm-ftab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  bmActiveFilter = type;
  renderBmCards();
  renderBmList();
}

function switchBmListTab(tab, btn) {
  document.querySelectorAll('.bm-ltab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  bmListTab = tab;
  renderBmList();
}

function searchBookmarks(q) {
  bmSearchQuery = q.toLowerCase();
  renderBmList();
}

function removeBookmark(id) {
  const items = getBmItems().filter(b => b.id !== id);
  saveBmItems(items);
  renderBookmarks();
  showToast('Bookmark dihapus.');
}

function showAddBookmarkModal() {
  const m = document.getElementById('add-bookmark-modal');
  if (m) { m.style.display = 'flex'; lucide.createIcons(); }
}
function closeAddBookmarkModal() {
  const m = document.getElementById('add-bookmark-modal');
  if (m) m.style.display = 'none';
}

function addBookmarkItem() {
  const title    = document.getElementById('bm-title')?.value.trim();
  const type     = document.getElementById('bm-type')?.value;
  const category = document.getElementById('bm-category')?.value;
  const desc     = document.getElementById('bm-desc')?.value.trim();
  if (!title) { showToast('Judul wajib diisi.'); return; }

  const typeConfig = {
    course:     { icon:'book-open',     iconColor:'#a78bfa', typeColor:'#a78bfa', typeBg:'rgba(124,58,237,0.2)', bg:'linear-gradient(135deg,#1e1b4b,#312e81)' },
    lesson:     { icon:'play-circle',   iconColor:'#60a5fa', typeColor:'#60a5fa', typeBg:'rgba(59,130,246,0.2)',  bg:'linear-gradient(135deg,#1e3a5f,#1e40af)' },
    article:    { icon:'file-text',     iconColor:'#34d399', typeColor:'#34d399', typeBg:'rgba(16,185,129,0.2)',  bg:'linear-gradient(135deg,#064e3b,#065f46)' },
    project:    { icon:'folder',        iconColor:'#fbbf24', typeColor:'#fbbf24', typeBg:'rgba(245,158,11,0.2)',  bg:'linear-gradient(135deg,#451a03,#92400e)' },
    quiz:       { icon:'help-circle',   iconColor:'#c084fc', typeColor:'#c084fc', typeBg:'rgba(168,85,247,0.2)',  bg:'linear-gradient(135deg,#3b1f5e,#6d28d9)' },
    discussion: { icon:'message-circle',iconColor:'#f87171', typeColor:'#f87171', typeBg:'rgba(239,68,68,0.2)',   bg:'linear-gradient(135deg,#7f1d1d,#dc2626)' },
  };
  const cfg = typeConfig[type] || typeConfig.course;

  const items = getBmItems();
  items.unshift({
    id: Date.now(), title, sub: desc || category, type, category,
    time: 'Baru saja', progress: 0,
    ...cfg
  });
  saveBmItems(items);
  closeAddBookmarkModal();
  ['bm-title','bm-desc'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  renderBookmarks();
  showToast('Bookmark berhasil ditambahkan! 🔖');
}

// Legacy compat
function toggleBookmark(courseId) {
  const items = getBmItems();
  const idx = items.findIndex(b => b.id === courseId);
  if (idx === -1) {
    showToast('Gunakan tombol Tambah Bookmark untuk menyimpan.');
  } else {
    items.splice(idx, 1);
    saveBmItems(items);
    renderBookmarks();
    showToast('Dihapus dari Bookmarks.');
  }
}
