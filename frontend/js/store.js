// ══════════════════════════════════════════════
// STORE.JS — Shared helpers (load FIRST)
// ══════════════════════════════════════════════

const store = {
  get: (k, def) => JSON.parse(localStorage.getItem('lx_' + k) || JSON.stringify(def)),
  set: (k, v)   => localStorage.setItem('lx_' + k, JSON.stringify(v)),
};

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1a3e;border:1px solid var(--border-accent);color:#fff;padding:12px 24px;border-radius:8px;font-size:13px;z-index:9999;transition:opacity 0.3s;pointer-events:none';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.style.opacity = '0', 3000);
}
