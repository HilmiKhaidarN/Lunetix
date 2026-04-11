// ══ CERTIFICATES ══

const certData = [
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    status: 'earned',
    issued: 'January 2024',
    credId: 'LTX-MLF-2024-001',
    bg: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)',
    desc: 'Has successfully completed the course and demonstrated understanding of core machine learning concepts.',
  },
  {
    id: 2,
    title: 'Python for AI',
    status: 'earned',
    issued: 'February 2024',
    credId: 'LTX-PYAI-2024-002',
    bg: 'linear-gradient(135deg,#064e3b 0%,#065f46 50%,#064e3b 100%)',
    desc: 'Has successfully completed the course and demonstrated proficiency in Python for AI development.',
  },
  {
    id: 3,
    title: 'Deep Learning Essentials',
    status: 'progress',
    issued: null,
    credId: null,
    bg: 'linear-gradient(135deg,#1e3a5f 0%,#1e40af 50%,#1e3a5f 100%)',
    progress: 25,
    lessons: '6/24',
    desc: 'Complete all lessons and the final quiz to unlock this certificate.',
  },
];

const certJourney = [
  { title: 'First Step',        desc: 'Complete your first lesson',  date: 'May 10, 2024', done: true  },
  { title: 'Quick Learner',     desc: 'Finish 5 lessons',            date: 'May 12, 2024', done: true  },
  { title: 'Course Completed',  desc: 'Earn your first certificate', date: 'May 15, 2024', done: true  },
  { title: 'Keep Going!',       desc: 'Earn 5 more certificates',    date: '3/5',           done: false },
];

let certActiveFilter = 'all';

// ── SVG helpers (no emoji, no lucide dependency inside card visuals) ──
const SVG = {
  check:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  lock:   '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  lockSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  moon:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.8)" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  award:  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
  eye:    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  dl:     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  arrow:  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  print:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  close:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

// ── Main render ──
function renderCertificates() {
  renderCertStats();
  renderCertGrid();
  renderCertJourney();
}

function renderCertStats() {
  const el = document.getElementById('cert-stats-bar');
  if (!el) return;
  const earned = certData.filter(c => c.status === 'earned').length;
  const stats = [
    { val: earned,    label: 'Certificates Earned', sub: '+1 this month',      icon: 'award',  bg: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
    { val: '450',     label: 'Total XP Earned',     sub: '+120 this month',    icon: 'star',   bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    { val: '2',       label: 'In Progress',          sub: 'Keep learning!',     icon: 'clock',  bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    { val: 'Top 15%', label: 'Rank',                 sub: 'Among all learners', icon: 'trophy', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="cert-stat-card">
      <div class="cert-stat-icon" style="background:${s.bg}">
        <i data-lucide="${s.icon}" style="width:20px;height:20px;color:${s.color}"></i>
      </div>
      <div>
        <div class="cert-stat-val">${s.val}</div>
        <div class="cert-stat-label">${s.label}</div>
        <div class="cert-stat-sub">${s.sub}</div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

function filterCerts(f, btn) {
  document.querySelectorAll('.cert-ftab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  certActiveFilter = f;
  renderCertGrid();
}

function renderCertGrid() {
  const grid = document.getElementById('cert-grid');
  if (!grid) return;
  const session = getSession();
  const name = session ? session.name : 'Arman';
  let list = certActiveFilter === 'all' ? certData : certData.filter(c => c.status === certActiveFilter);
  grid.innerHTML = list.map(c => {
    if (c.status === 'earned')    return renderEarnedCert(c, name);
    if (c.status === 'progress')  return renderProgressCert(c);
    return renderLockedCert(c);
  }).join('');
  lucide.createIcons();
}

function renderEarnedCert(c, name) {
  return `<div class="cert-card-wrap">
    <div class="cert-visual" onclick="previewCert(${c.id})" title="Click to preview">
      <div class="cert-visual-inner" style="background:${c.bg}">
        <div style="position:absolute;inset:6px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;pointer-events:none"></div>
        <div class="cert-verified-badge" style="color:#34d399">
          ${SVG.check} Verified
        </div>
        <div class="cert-logo">${SVG.moon} LUNETIX ${SVG.moon}</div>
        <div class="cert-course-name">${c.title}</div>
        <div class="cert-certifies">THIS CERTIFIES THAT</div>
        <div class="cert-recipient">${name}</div>
        <div class="cert-desc">${c.desc}</div>
        <div class="cert-footer-row">
          <div class="cert-date-col">
            <div class="cert-date-label">DATE</div>
            <div class="cert-date-val">${c.issued}</div>
          </div>
          <div class="cert-seal" style="background:rgba(124,58,237,0.2);border-color:rgba(124,58,237,0.4)">
            ${SVG.award}
          </div>
          <div class="cert-sig-col">
            <div class="cert-sig-name" style="font-size:13px;color:rgba(255,255,255,0.9)">Hilmi Khaidar N</div>
            <div class="cert-sig-title">FOUNDER &amp; CEO</div>
          </div>
        </div>
      </div>
    </div>
    <div class="cert-card-info">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div class="cert-card-title">${c.title}</div>
        <span class="cert-status-badge earned" style="display:flex;align-items:center;gap:4px">${SVG.check} Earned</span>
      </div>
      <div class="cert-card-meta">Issued ${c.issued} &middot; No Expiry</div>
      <div class="cert-card-id">Credential ID: ${c.credId}</div>
      <div class="cert-card-actions">
        <button class="btn btn-outline" style="padding:6px 14px;font-size:11px;display:flex;align-items:center;gap:5px" onclick="previewCert(${c.id})">
          ${SVG.eye} Preview
        </button>
        <button class="btn btn-primary" style="padding:6px 14px;font-size:11px;display:flex;align-items:center;gap:5px" onclick="downloadCert('${c.title}','${name}','${c.issued}','${c.credId}')">
          ${SVG.dl} Download
        </button>
      </div>
    </div>
  </div>`;
}

function renderProgressCert(c) {
  return `<div class="cert-card-wrap">
    <div class="cert-visual" style="cursor:default">
      <div class="cert-visual-inner" style="background:${c.bg}">
        <div style="position:absolute;inset:6px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;pointer-events:none"></div>
        <div class="cert-logo" style="opacity:0.4">${SVG.moon} LUNETIX ${SVG.moon}</div>
        <div class="cert-course-name" style="opacity:0.5">${c.title}</div>
        <div class="cert-locked-overlay">
          ${SVG.lock}
          <p>Complete all lessons and the final quiz to unlock this certificate.</p>
          <div style="margin-top:10px;font-size:11px;color:var(--accent-light)">${c.progress}% Complete &middot; ${c.lessons} lessons</div>
        </div>
      </div>
    </div>
    <div class="cert-card-info">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div class="cert-card-title">${c.title}</div>
        <span class="cert-status-badge progress">In Progress</span>
      </div>
      <div class="cert-progress-info">
        <div class="cert-progress-row"><span>Progress</span><span>${c.progress}%</span></div>
        <div class="progress-bar" style="height:4px;margin-bottom:6px">
          <div class="progress-fill" style="width:${c.progress}%"></div>
        </div>
        <div style="font-size:10px;color:var(--text-muted)">${c.lessons} lessons &middot; ~6h left</div>
      </div>
      <div class="cert-card-actions" style="margin-top:10px">
        <button class="btn btn-primary btn-full" style="padding:7px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px"
          onclick="window.navigateTo&&navigateTo('courses')">
          Continue Learning ${SVG.arrow}
        </button>
      </div>
    </div>
  </div>`;
}

function renderLockedCert(c) {
  return `<div class="cert-card-wrap" style="opacity:0.6">
    <div class="cert-visual" style="cursor:default">
      <div class="cert-visual-inner" style="background:${c.bg}">
        <div class="cert-locked-overlay">
          ${SVG.lock}
          <p>Complete prerequisites to unlock</p>
        </div>
      </div>
    </div>
    <div class="cert-card-info">
      <div class="cert-card-title">${c.title}</div>
      <span class="cert-status-badge locked">Locked</span>
    </div>
  </div>`;
}

function renderCertJourney() {
  const el = document.getElementById('cert-journey');
  if (!el) return;
  el.innerHTML = `<div class="cert-journey-row">${certJourney.map(j => `
    <div class="cert-journey-step">
      <div class="cert-journey-dot ${j.done ? 'done' : 'pending'}">
        ${j.done
          ? '<i data-lucide="check" style="width:16px;height:16px;color:#fff"></i>'
          : SVG.lockSm}
      </div>
      <div class="cert-journey-title">${j.title}</div>
      <div class="cert-journey-date">${j.date}</div>
    </div>`).join('')}</div>`;
  lucide.createIcons();
}

function previewCert(id) {
  const c = certData.find(x => x.id === id);
  if (!c || c.status !== 'earned') return;
  const session = getSession();
  downloadCert(c.title, session ? session.name : 'Arman', c.issued, c.credId, true);
}

function downloadCert(title, name, date, credId, previewOnly) {
  var w = window.open('', '_blank');
  var html = '<!DOCTYPE html><html><head>'
    + '<meta charset="UTF-8">'
    + '<title>Certificate - ' + title + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Inter:wght@400;600&display=swap" rel="stylesheet">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box}'
    + 'body{background:#0a0a1a;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;padding:20px}'
    + '.cert{width:860px;max-width:100%;padding:50px 60px;background:linear-gradient(135deg,#0f0f2a 0%,#1a1a3e 40%,#0f0f2a 100%);border:2px solid #7c3aed;border-radius:16px;position:relative;overflow:hidden;text-align:center}'
    + '.cert::before{content:"";position:absolute;inset:8px;border:1px solid rgba(124,58,237,.3);border-radius:10px;pointer-events:none}'
    + '.corner{position:absolute;width:40px;height:40px;border-color:#7c3aed;border-style:solid;opacity:.6}'
    + '.tl{top:20px;left:20px;border-width:2px 0 0 2px}.tr{top:20px;right:20px;border-width:2px 2px 0 0}'
    + '.bl{bottom:20px;left:20px;border-width:0 0 2px 2px}.br{bottom:20px;right:20px;border-width:0 2px 2px 0}'
    + '.logo{font-family:Cinzel,serif;font-size:13px;letter-spacing:4px;color:#a78bfa;margin-bottom:6px;display:flex;align-items:center;justify-content:center;gap:8px}'
    + '.cert-type{font-family:Cinzel,serif;font-size:11px;letter-spacing:6px;color:rgba(255,255,255,.4);margin-bottom:20px;text-transform:uppercase}'
    + '.course-title{font-family:Cinzel,serif;font-size:28px;font-weight:700;color:#fff;margin-bottom:16px;line-height:1.2}'
    + '.certifies-text{font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.4);margin-bottom:8px;text-transform:uppercase}'
    + '.recipient{font-family:"Great Vibes",cursive;font-size:48px;background:linear-gradient(135deg,#fbbf24,#f97316);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}'
    + '.desc{font-size:12px;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.6}'
    + '.divider{width:200px;height:1px;background:linear-gradient(90deg,transparent,#7c3aed,transparent);margin:0 auto 24px}'
    + '.footer-row{display:flex;align-items:flex-end;justify-content:space-between;padding:0 20px}'
    + '.footer-col{text-align:center}'
    + '.footer-label{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.3);text-transform:uppercase;margin-bottom:4px}'
    + '.footer-val{font-size:12px;color:rgba(255,255,255,.7);font-weight:600}'
    + '.seal{width:70px;height:70px;border-radius:50%;background:rgba(124,58,237,.2);border:2px solid rgba(124,58,237,.5);display:flex;align-items:center;justify-content:center;margin:0 auto}'
    + '.sig-name{font-family:"Great Vibes",cursive;font-size:22px;color:rgba(255,255,255,.85);margin-bottom:2px}'
    + '.sig-line{width:120px;height:1px;background:rgba(255,255,255,.2);margin:4px auto}'
    + '.sig-title{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.3);text-transform:uppercase}'
    + '.cred-id{font-size:9px;color:rgba(255,255,255,.2);font-family:monospace;margin-top:20px}'
    + '.verified{display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);border-radius:20px;padding:4px 14px;font-size:10px;color:#34d399;margin-bottom:16px}'
    + '.actions{margin-top:24px;display:flex;gap:12px;justify-content:center}'
    + '.btn{padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:8px}'
    + '.btn-primary{background:linear-gradient(135deg,#7c3aed,#9d5cf6);color:#fff}'
    + '.btn-outline{background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7)}'
    + '@media print{body{background:#fff}.actions{display:none}}'
    + '</style></head><body>'
    + '<div class="cert">'
    + '<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>'
    + '<div class="logo">'
    + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    + ' LUNETIX'
    + '</div>'
    + '<div class="cert-type">Certificate of Completion</div>'
    + '<div class="verified">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
    + ' Verified Certificate'
    + '</div>'
    + '<div class="course-title">' + title + '</div>'
    + '<div class="certifies-text">This certifies that</div>'
    + '<div class="recipient">' + name + '</div>'
    + '<div class="desc">Has successfully completed the course and demonstrated mastery of the subject matter with excellence.</div>'
    + '<div class="divider"></div>'
    + '<div class="footer-row">'
    + '<div class="footer-col">'
    + '<div class="footer-label">Date Issued</div><div class="footer-val">' + date + '</div>'
    + '<div class="footer-label" style="margin-top:8px">Credential ID</div>'
    + '<div class="footer-val" style="font-family:monospace;font-size:10px">' + (credId || 'LTX-2024-XXX') + '</div>'
    + '</div>'
    + '<div class="footer-col">'
    + '<div class="seal"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>'
    + '<div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:6px;letter-spacing:1px">OFFICIAL SEAL</div>'
    + '</div>'
    + '<div class="footer-col">'
    + '<div class="sig-name">Hilmi Khaidar N</div>'
    + '<div class="sig-line"></div>'
    + '<div class="sig-title">Founder &amp; CEO &mdash; Lunetix</div>'
    + '</div>'
    + '</div>'
    + '<div class="cred-id">lunetix.ai/verify/' + (credId || 'LTX-2024-XXX') + '</div>'
    + '</div>'
    + '<div class="actions">'
    + '<button class="btn btn-primary" onclick="window.print()">'
    + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
    + ' Print / Save as PDF'
    + '</button>'
    + '<button class="btn btn-outline" onclick="window.close()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    + ' Close'
    + '</button>'
    + '</div>'
    + '</body></html>';
  w.document.write(html);
  w.document.close();
}

function downloadAllCerts() {
  var session = getSession();
  var earned = certData.filter(function(c) { return c.status === 'earned'; });
  if (!earned.length) { showToast('Belum ada sertifikat yang diperoleh.'); return; }
  earned.forEach(function(c, i) {
    setTimeout(function() {
      downloadCert(c.title, session ? session.name : 'Arman', c.issued, c.credId);
    }, i * 600);
  });
  showToast('Membuka ' + earned.length + ' sertifikat...');
}

function shareCertProfile() {
  var session = getSession();
  var name = session ? session.name.toLowerCase().replace(/\s+/g, '-') : 'user';
  navigator.clipboard.writeText('https://lunetix.ai/profile/' + name)
    .then(function() { showToast('Profile link copied! Share it anywhere'); });
}

function copyCertLink() {
  navigator.clipboard.writeText('https://lunetix.ai/verify/LTX-MLF-2024-001')
    .then(function() { showToast('Certificate link copied!'); });
}

function renderCertJourney() {
  var el = document.getElementById('cert-journey');
  if (!el) return;
  var lockIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var checkIcon = '<i data-lucide="check" style="width:16px;height:16px;color:#fff"></i>';
  el.innerHTML = '<div class="cert-journey-row">'
    + certJourney.map(function(j) {
        return '<div class="cert-journey-step">'
          + '<div class="cert-journey-dot ' + (j.done ? 'done' : 'pending') + '">'
          + (j.done ? checkIcon : lockIcon)
          + '</div>'
          + '<div class="cert-journey-title">' + j.title + '</div>'
          + '<div class="cert-journey-date">' + j.date + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
  lucide.createIcons();
}
