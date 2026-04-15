const supabase = require('../config/supabase');

const PASS_THRESHOLD = 80;

function generateCredentialId(courseId, courseTitle, year, seq) {
  const code = courseTitle
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4);
  return `LTX-${code}-${year}-${String(seq).padStart(3, '0')}`;
}

// GET /api/certificates
async function getMyCertificates(req, res) {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ certificates: data });
}

// POST /api/certificates/:courseId
async function issueCertificate(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.courseId);

  // Cek apakah sudah ada sertifikat (idempoten)
  const { data: existing } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (existing) return res.json({ success: true, certificate: existing });

  // Cek semua lesson selesai
  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('id', courseId)
    .single();

  if (!course) return res.status(404).json({ error: 'Kursus tidak ditemukan.' });

  // Cek quiz lulus
  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('passed')
    .eq('user_id', userId)
    .eq('passed', true);

  const quizPassed = quizAttempts && quizAttempts.length > 0;
  if (!quizPassed) {
    return res.status(403).json({ error: 'not_eligible', reason: 'Quiz belum lulus (min. 80%).' });
  }

  // Ambil nama user
  const { data: profile } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single();

  const userName = profile?.name || 'Pengguna';
  const year = new Date().getFullYear();

  // Hitung sequence
  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const credentialId = generateCredentialId(courseId, course.title, year, (count || 0) + 1);

  const { data: cert, error: insertErr } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: courseId,
      course_title: course.title,
      user_name: userName,
      credential_id: credentialId,
    })
    .select()
    .single();

  if (insertErr) return res.status(500).json({ error: insertErr.message });
  return res.status(201).json({ success: true, certificate: cert });
}

module.exports = { getMyCertificates, issueCertificate };
