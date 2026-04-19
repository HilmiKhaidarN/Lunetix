const supabase = require('../config/supabase');
const { sanitizeHtml } = require('../utils/sanitize');

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password minimal 8 karakter.' });
  }

  // Daftarkan ke Supabase Auth (email verification required)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // User harus verifikasi email
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' });
    }
    return res.status(400).json({ error: authError.message });
  }

  // Simpan profil ke tabel users
  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    name,
    email,
    password_hash: '-', // Supabase Auth yang handle password
    avatar: name.charAt(0).toUpperCase(),
    account_type: 'free',
  });

  if (profileError) {
    return res.status(500).json({ error: 'Gagal menyimpan profil.' });
  }

  // Login otomatis setelah register
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    return res.status(500).json({ error: 'Register berhasil, silakan login.' });
  }

  return res.status(201).json({
    token: loginData.session.access_token,
    user: {
      id: authData.user.id,
      name,
      email,
      avatar: name.charAt(0).toUpperCase(),
      account_type: 'free',
    },
  });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ error: 'Email atau password salah.' });
  }

  // Ambil profil user
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, name, email, avatar, account_type, streak, points')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    return res.status(500).json({ error: 'Gagal mengambil profil user.' });
  }

  return res.json({
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at, // Unix timestamp
    user: profile,
  });
}

// POST /api/auth/refresh
async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token wajib diisi.' });
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) {
    return res.status(401).json({ error: 'Refresh token tidak valid atau sudah expired. Silakan login ulang.' });
  }

  // Ambil profil user (streak mungkin berubah)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, name, email, avatar, account_type, streak, points')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    return res.status(500).json({ error: 'Gagal mengambil profil user.' });
  }

  return res.json({
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    user: profile,
  });
}

// GET /api/auth/me
async function getMe(req, res) {
  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email, avatar, account_type, streak, points, joined_at')
    .eq('id', req.user.id)
    .single();

  return res.json({ user: profile });
}

// PUT /api/auth/profile
async function updateProfile(req, res) {
  const { name, bio, website, linkedin, github } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong.' });
  }

  // Validasi format URL
  const urlRegex = /^https?:\/\/.+/i;
  if (website && website.trim() && !urlRegex.test(website.trim())) {
    return res.status(400).json({ error: 'Format website tidak valid. Harus dimulai dengan http:// atau https://' });
  }
  if (linkedin && linkedin.trim() && !urlRegex.test(linkedin.trim())) {
    return res.status(400).json({ error: 'Format LinkedIn URL tidak valid. Harus dimulai dengan http:// atau https://' });
  }
  if (github && github.trim() && !urlRegex.test(github.trim())) {
    return res.status(400).json({ error: 'Format GitHub URL tidak valid. Harus dimulai dengan http:// atau https://' });
  }

  const updates = {
    name:       name.trim(),
    avatar:     name.trim().charAt(0).toUpperCase(),
    updated_at: new Date().toISOString(),
  };
  if (bio      !== undefined) updates.bio      = sanitizeHtml(bio.trim());
  if (website  !== undefined) updates.website  = website.trim();
  if (linkedin !== undefined) updates.linkedin = linkedin.trim();
  if (github   !== undefined) updates.github   = github.trim();

  const { data: profile, error: updateErr } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, name, email, avatar, account_type, streak, points, joined_at')
    .single();

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  return res.json({ success: true, user: profile });
}

// PUT /api/auth/password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password baru minimal 8 karakter.' });
  }

  // Verifikasi password lama dengan re-login
  const { error: verifyErr } = await supabase.auth.signInWithPassword({
    email: req.user.email,
    password: currentPassword,
  });
  if (verifyErr) {
    return res.status(401).json({ error: 'Password saat ini salah.' });
  }

  // Update password via Supabase Admin
  const { error: updateErr } = await supabase.auth.admin.updateUserById(req.user.id, {
    password: newPassword,
  });
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  return res.json({ success: true, message: 'Password berhasil diubah.' });
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email wajib diisi.' });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.SITE_URL || 'https://lunetix-rust.vercel.app'}/reset-password`,
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ success: true, message: 'Link reset password sudah dikirim ke email kamu.' });
}

module.exports = { register, login, refreshToken, getMe, updateProfile, changePassword, forgotPassword };
