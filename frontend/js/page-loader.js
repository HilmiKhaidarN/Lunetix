// ══════════════════════════════════════════════
// PAGE-LOADER.JS — Load HTML partials via fetch
// ══════════════════════════════════════════════

const pageCache = {};

async function loadPage(pageId) {
  // Return from cache if already loaded
  if (pageCache[pageId]) return pageCache[pageId];

  try {
    const res = await fetch(`../html/pages/page-${pageId}.html`);
    if (!res.ok) throw new Error(`Failed to load page-${pageId}.html`);
    const html = await res.text();
    pageCache[pageId] = html;
    return html;
  } catch (e) {
    console.warn(`Could not load page-${pageId}.html:`, e.message);
    return `<div class="page active" id="page-${pageId}" style="padding:40px;text-align:center;color:var(--text-muted)">
      <i data-lucide="alert-circle" style="width:40px;height:40px;margin-bottom:12px"></i>
      <p>Halaman tidak dapat dimuat.</p>
    </div>`;
  }
}

async function injectPage(pageId, container) {
  const html = await loadPage(pageId);
  // Check if page already injected
  if (document.getElementById('page-' + pageId)) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  container.appendChild(wrapper.firstElementChild || wrapper);
  // Re-run lucide on new content
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Preload all pages in background after initial load
async function preloadAllPages(container) {
  const pages = ['dashboard','courses','playground','projects','quizzes',
                  'community','certificates','analytics','bookmarks','settings'];
  for (const p of pages) {
    await injectPage(p, container);
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
