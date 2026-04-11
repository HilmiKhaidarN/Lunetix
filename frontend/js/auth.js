// ── Local Auth (localStorage) ──

const USERS_KEY = 'lunetix_users';
const SESSION_KEY = 'lunetix_session';

// Seed default user
function seedDefaultUser() {
  const users = getUsers();
  if (!users.find(u => u.email === 'demo@lunetix.ai')) {
    users.push({
      id: 1,
      name: 'Arman',
      email: 'demo@lunetix.ai',
      password: 'demo1234',
      avatar: 'A',
      streak: 7,
      points: 1250,
      joinedAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function setSession(user) {
  const { password, ...safe } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function requireAuth() {
  if (!getSession()) {
    window.location.href = 'login.html';
  }
}

function requireGuest() {
  if (getSession()) {
    window.location.href = 'dashboard.html';
  }
}

// ── Login ──
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error-msg');

  if (!email || !password) {
    showError(errorEl, 'Isi email dan password dulu ya.');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showError(errorEl, 'Email atau password salah. Coba lagi.');
    return;
  }

  setSession(user);
  window.location.href = 'dashboard.html';
}

// ── Register ──
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password').value;
  const terms = document.getElementById('terms').checked;
  const errorEl = document.getElementById('error-msg');

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

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showError(errorEl, 'Email sudah terdaftar. Coba login.');
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    avatar: name.charAt(0).toUpperCase(),
    streak: 0,
    points: 0,
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setSession(newUser);
  window.location.href = 'dashboard.html';
}

function showError(el, msg) {
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
  lucide.createIcons();
}

// ── Init ──
seedDefaultUser();

