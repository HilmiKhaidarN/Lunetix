const supabase = require('../config/supabase');

// GET /api/lessons/:courseId/progress
async function getProgress(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.courseId);

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .order('completed_at');

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    courseId,
    completedLessons: data.map(d => d.lesson_id),
  });
}

// POST /api/lessons/:courseId/:lessonId/complete
async function completeLesson(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.courseId);
  const { lessonId } = req.params;

  // Cek akses kursus aktif
  const { data: access, error: accessErr } = await supabase
    .from('course_access')
    .select('status')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (accessErr || !access) {
    return res.status(403).json({ error: 'Kursus belum diklaim.' });
  }
  if (access.status === 'expired') {
    return res.status(403).json({ error: 'Akses kursus telah berakhir.' });
  }

  // Insert (idempoten — ON CONFLICT DO NOTHING)
  const { error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
    }, { onConflict: 'user_id,course_id,lesson_id' });

  if (error) return res.status(500).json({ error: error.message });

  // Ambil semua lesson yang sudah selesai
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId);

  return res.json({
    success: true,
    completedLessons: progress.map(p => p.lesson_id),
  });
}

module.exports = { getProgress, completeLesson };
