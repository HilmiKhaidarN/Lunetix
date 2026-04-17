// ══════════════════════════════════════════════
// AUTH.JS — Authentication (API + localStorage fallback)
// ══════════════════════════════════════════════

const SESSION_KEY = 'lunetix_session';
// Auto-detect: pakai /api (relative) di production Vercel,
// pakai localhost saat development lokal
// Gunakan nama berbeda untuk menghindari konflik dengan api.js di dashboard
const AUTH_API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

// ── Session helpers ──

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function requireAuth() {
  if (!getSession()) {
    window.location.href = '/login';
  }
}

function requireGuest() {
  if (getSession()) {
    window.location.href = '/dashboard';
  }
}

// ── Login ──
async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl  = document.getElementById('error-msg');
  const btn      = e.target.querySelector('button[type="submit"]');

  if (!email || !password) {
    showError(errorEl, 'Isi email dan password dulu ya.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    const res = await fetch(`${AUTH_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(errorEl, data.error || 'Email atau password salah.');
      return;
    }

    // Simpan session dengan token
    setSession({
      ...data.user,
      token: data.token,
      refreshToken: data.refreshToken || null,
      expiresAt: data.expiresAt || null,
      avatar: data.user.avatar || data.user.name?.charAt(0).toUpperCase(),
    });

    window.location.href = '/dashboard';

  } catch (err) {
    // Fallback: coba login lokal jika API tidak tersedia
    console.warn('[Auth] API tidak tersedia, coba login lokal.', err);
    _handleLoginLocal(email, password, errorEl);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Log In <i data-lucide="arrow-right" style="width:15px;height:15px"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function _handleLoginLocal(email, password, errorEl) {
  const users = JSON.parse(localStorage.getItem('lunetix_users') || '[]');
  const user  = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showError(errorEl, 'Email atau password salah. Coba lagi.');
    return;
  }
  const { password: _, ...safe } = user;
  setSession(safe);
  window.location.href = '/dashboard';
}

// ── Register ──
async function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('fullname').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm-password').value;
  const terms    = document.getElementById('terms').checked;
  const errorEl  = document.getElementById('error-msg');
  const btn      = e.target.querySelector('button[type="submit"]');

  // Validasi client-side
  if (!name || !email || !password || !confirm) {
    showError(errorEl, 'Semua field wajib diisi.');
    return;
  }
  if (password.length < 6) {
    showError(errorEl, 'Password minimal 6 karakter.');
    return;
  }
  if (password !== confirm) {
    showError(errorEl, 'Password dan konfirmasi tidak cocok.');
    return;
  }
  if (!terms) {
    showError(errorEl, 'Kamu harus setuju dengan Terms of Service.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const res = await fetch(`${AUTH_API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(errorEl, data.error || 'Gagal membuat akun.');
      return;
    }

    // Simpan session dengan token
    setSession({
      ...data.user,
      token: data.token,
      refreshToken: data.refreshToken || null,
      expiresAt: data.expiresAt || null,
      avatar: data.user.avatar || name.charAt(0).toUpperCase(),
    });

    window.location.href = '/dashboard?new=1';

  } catch (err) {
    // Fallback: register lokal jika API tidak tersedia
    console.warn('[Auth] API tidak tersedia, register lokal.', err);
    _handleRegisterLocal(name, email, password, errorEl);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Create Account <i data-lucide="arrow-right" style="width:15px;height:15px"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function _handleRegisterLocal(name, email, password, errorEl) {
  const users = JSON.parse(localStorage.getItem('lunetix_users') || '[]');
  if (users.find(u => u.email === email)) {
    showError(errorEl, 'Email sudah terdaftar. Coba login.');
    return;
  }
  const newUser = {
    id: Date.now(),
    name, email, password,
    avatar: name.charAt(0).toUpperCase(),
    account_type: 'free',
    streak: 0, points: 0,
    joinedAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem('lunetix_users', JSON.stringify(users));
  const { password: _, ...safe } = newUser;
  setSession(safe);
  window.location.href = '/dashboard?new=1';
}

// ── UI helpers ──

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-lucide="eye-off" style="width:15px;height:15px"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-lucide="eye" style="width:15px;height:15px"></i>';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}


// ── Auto Token Refresh ──
// Cek dan refresh token sebelum expired
// Dipanggil saat halaman load dan setiap 10 menit

const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 menit
const TOKEN_REFRESH_THRESHOLD = 5 * 60;         // Refresh jika sisa < 5 menit (dalam detik)

async function refreshTokenIfNeeded() {
  const session = getSession();
  if (!session?.token || !session?.refreshToken) return;

  // Cek apakah token akan expired dalam 5 menit
  if (session.expiresAt) {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = session.expiresAt - now;
    if (timeLeft > TOKEN_REFRESH_THRESHOLD) return; // Masih aman
  }

  try {
    const res = await fetch(`${AUTH_API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!res.ok) {
      // Refresh token expired — paksa logout
      console.warn('[Auth] Refresh token expired, logging out.');
      clearSession();
      window.location.href = '/login';
      return;
    }

    const data = await res.json();

    // Update session dengan token baru
    setSession({
      ...session,
      ...data.user,
      token: data.token,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    });

    console.log('[Auth] Token refreshed successfully.');
  } catch (err) {
    console.warn('[Auth] Gagal refresh token:', err);
  }
}

// Jalankan auto-refresh saat halaman load
if (typeof window !== 'undefined') {
  // Refresh segera saat load
  document.addEventListener('DOMContentLoaded', () => {
    refreshTokenIfNeeded();
    // Refresh setiap 10 menit
    setInterval(refreshTokenIfNeeded, TOKEN_REFRESH_INTERVAL);
  });
}
