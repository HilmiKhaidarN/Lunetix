// ══════════════════════════════════════════════
// UI HELPERS — Loading, Error, Offline handling
// ══════════════════════════════════════════════

// Global loading overlay
function showLoading(message = 'Loading...') {
  let overlay = document.getElementById('global-loading');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-loading';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px';
    overlay.innerHTML = `
      <div style="width:40px;height:40px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite"></div>
      <div id="loading-text" style="color:#fff;font-size:14px;font-weight:500"></div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `;
    document.body.appendChild(overlay);
  }
  document.getElementById('loading-text').textContent = message;
  overlay.style.display = 'flex';
}

function hideLoading() {
  const overlay = document.getElementById('global-loading');
  if (overlay) overlay.style.display = 'none';
}

// Global error toast
function showErrorToast(message, duration = 5000) {
  let toast = document.getElementById('error-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'error-toast';
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#dc2626;color:#fff;padding:14px 20px;border-radius:12px;font-size:14px;z-index:99998;box-shadow:0 8px 24px rgba(220,38,38,0.3);display:none;max-width:400px;animation:slideIn 0.3s ease';
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span id="error-toast-text"></span>
      </div>
      <style>@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}</style>
    `;
    document.body.appendChild(toast);
  }
  document.getElementById('error-toast-text').textContent = message;
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.display = 'none'; }, duration);
}

// Offline detection
let isOnline = navigator.onLine;

function checkOnlineStatus() {
  if (!navigator.onLine && isOnline) {
    // Baru offline
    isOnline = false;
    showErrorToast('⚠️ Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.', 10000);
  } else if (navigator.onLine && !isOnline) {
    // Baru online lagi
    isOnline = true;
    showToast('✅ Koneksi internet kembali normal.');
  }
}

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

// Enhanced fetch dengan error handling & loading
async function safeFetch(url, options = {}, showLoadingIndicator = false) {
  if (showLoadingIndicator) showLoading();
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('[safeFetch] Error:', error);
    
    if (!navigator.onLine) {
      showErrorToast('Tidak ada koneksi internet. Cek koneksi kamu dan coba lagi.');
    } else {
      showErrorToast(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    }
    
    return { success: false, error: error.message };
  } finally {
    if (showLoadingIndicator) hideLoading();
  }
}

// Expose globally
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showErrorToast = showErrorToast;
window.safeFetch = safeFetch;
