// ══════════════════════════════════════════════
// LUNETIX — Loading Screen Manager
// ══════════════════════════════════════════════

(function() {
  // ── Inject loading screen HTML ──
  function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'lunetix-loader';
    loader.innerHTML = `
      <div class="loader-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
      <div class="loader-name">Lunetix</div>
      <div class="loader-spinner"></div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
    return loader;
  }

  // ── Inject page transition overlay ──
  function createTransition() {
    const t = document.createElement('div');
    t.id = 'page-transition';
    t.innerHTML = `
      <div class="loader-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
      <div class="loader-spinner"></div>
    `;
    document.body.appendChild(t);
    return t;
  }

  // ── Hide initial loader ──
  function hideLoader() {
    const loader = document.getElementById('lunetix-loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }

  // ── Show page transition ──
  window.showPageTransition = function() {
    const t = document.getElementById('page-transition');
    if (t) t.classList.add('show');
  };

  // ── Hide page transition ──
  window.hidePageTransition = function() {
    const t = document.getElementById('page-transition');
    if (t) {
      t.classList.remove('show');
    }
  };

  // ── Init on DOM ready ──
  document.addEventListener('DOMContentLoaded', function() {
    createLoader();
    createTransition();

    // Hide loader after page is ready
    // Minimum 800ms untuk efek yang terasa
    const minTime = 800;
    const startTime = Date.now();

    function tryHide() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(hideLoader, remaining);
    }

    // Hide setelah window load atau timeout 3s
    if (document.readyState === 'complete') {
      tryHide();
    } else {
      window.addEventListener('load', tryHide);
      // Fallback: hide setelah 3 detik
      setTimeout(hideLoader, 3000);
    }
  });
})();
