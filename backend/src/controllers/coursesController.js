const supabase = require('../config/supabase');

const ACCESS_DAYS = { free: 90, pro: 180 };
const MAX_CLAIMS  = { free: 1,  pro: 2  };

// GET /api/courses
async function getAllCourses(req, res) {
  // Ambil semua kursus
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('id');

  if (error) return res.status(500).json({ error: error.message });

  // Hitung jumlah students real dari course_access per kursus
  const { data: accessCounts } = await supabase
    .from('course_access')
    .select('course_id');

  // Buat map: course_id → jumlah unique students
  const studentMap = {};
  (accessCounts || []).forEach(row => {
    studentMap[row.course_id] = (studentMap[row.course_id] || 0) + 1;
  });

  // Inject students real ke setiap kursus, hapus rating dummy
  const result = courses.map(c => ({
    ...c,
    students: studentMap[c.id] || 0,
    rating:   undefined, // hapus rating dummy
  }));

  return res.json({ courses: result });
}

// GET /api/courses/:id
async function getCourseById(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Kursus tidak ditemukan.' });

  // Hitung students real
  const { count } = await supabase
    .from('course_access')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id);

  return res.json({ course: { ...data, students: count || 0, rating: undefined } });
}

// POST /api/courses/:id/claim
async function claimCourse(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.id);

  // Cek kursus valid
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, status')
    .eq('id', courseId)
    .single();

  if (courseErr || !course) return res.status(404).json({ error: 'invalid_course' });
  if (course.status === 'coming') return res.status(400).json({ error: 'Kursus belum tersedia.' });

  // Ambil profil user untuk account_type
  const { data: profile } = await supabase
    .from('users')
    .select('account_type')
    .eq('id', userId)
    .single();

  const accountType = profile?.account_type || 'free';
  const maxClaims = MAX_CLAIMS[accountType];

  // Cek jumlah klaim saat ini
  const { data: existing, error: existErr } = await supabase
    .from('course_access')
    .select('id, course_id')
    .eq('user_id', userId);

  if (existErr) return res.status(500).json({ error: existErr.message });

  if (existing.find(c => c.course_id === courseId)) {
    return res.status(409).json({ error: 'already_claimed' });
  }
  if (existing.length >= maxClaims) {
    return res.status(403).json({ error: 'limit_reached' });
  }

  // Hitung tanggal kedaluwarsa
  const claimedAt = new Date();
  const expiresAt = new Date(claimedAt);
  expiresAt.setDate(expiresAt.getDate() + ACCESS_DAYS[accountType]);

  const { data: access, error: insertErr } = await supabase
    .from('course_access')
    .insert({
      user_id: userId,
      course_id: courseId,
      claimed_at: claimedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'active',
      account_type_at_claim: accountType,
    })
    .select()
    .single();

  if (insertErr) return res.status(500).json({ error: insertErr.message });
  return res.status(201).json({ success: true, access });
}

// GET /api/courses/access/me
async function getMyCourses(req, res) {
  const userId = req.user.id;
  const now = new Date().toISOString();

  // Auto-expire kursus yang sudah lewat tanggal
  await supabase
    .from('course_access')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active')
    .lt('expires_at', now);

  const { data, error } = await supabase
    .from('course_access')
    .select('*, courses(title, thumb_icon, thumb_bg, thumb_color, level, category, duration)')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ courses: data });
}

module.exports = { getAllCourses, getCourseById, claimCourse, getMyCourses };
