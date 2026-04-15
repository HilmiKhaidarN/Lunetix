const supabase = require('../config/supabase');

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter.' });
  }

  // Daftarkan ke Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
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
  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email, avatar, account_type, streak, points')
    .eq('id', data.user.id)
    .single();

  return res.json({
    token: data.session.access_token,
    user: profile,
  });
}

// GET /api/auth/me
async function getMe(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email, avatar, account_type, streak, points, joined_at')
    .eq('id', user.id)
    .single();

  return res.json({ user: profile });
}

// PUT /api/auth/profile
async function updateProfile(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  const { name, bio, website, linkedin, github } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong.' });
  }

  const updates = {
    name: name.trim(),
    avatar: name.trim().charAt(0).toUpperCase(),
    updated_at: new Date().toISOString(),
  };
  if (bio      !== undefined) updates.bio      = bio;
  if (website  !== undefined) updates.website  = website;
  if (linkedin !== undefined) updates.linkedin = linkedin;
  if (github   !== undefined) updates.github   = github;

  const { data: profile, error: updateErr } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select('id, name, email, avatar, account_type, streak, points, joined_at')
    .single();

  if (updateErr) return res.status(500).json({ error: updateErr.message });

  return res.json({ success: true, user: profile });
}

// PUT /api/auth/password
async function changePassword(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
  }

  // Verifikasi password lama dengan re-login
  const { error: verifyErr } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyErr) {
    return res.status(401).json({ error: 'Password saat ini salah.' });
  }

  // Update password via Supabase Admin
  const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  return res.json({ success: true, message: 'Password berhasil diubah.' });
}

module.exports = { register, login, getMe, updateProfile, changePassword };
