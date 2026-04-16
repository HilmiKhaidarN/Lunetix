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

  // Update streak jika belum ada aktivitas hari ini
  await updateUserStreak(userId);

  // Ambil semua lesson yang sudah selesai
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId);

  // Ambil streak terbaru
  const { data: user } = await supabase
    .from('users')
    .select('streak')
    .eq('id', userId)
    .single();

  return res.json({
    success: true,
    completedLessons: progress.map(p => p.lesson_id),
    streak: user?.streak || 0,
  });
}

// Helper: update streak user
async function updateUserStreak(userId) {
  const { data: user } = await supabase
    .from('users')
    .select('streak, updated_at')
    .eq('id', userId)
    .single();

  if (!user) return;

  const now = new Date();
  const lastActivity = new Date(user.updated_at);
  
  // Hitung selisih hari (WIB timezone)
  const wibOffset = 7 * 60 * 60 * 1000;
  const todayWIB = new Date(now.getTime() + wibOffset).toISOString().slice(0, 10);
  const lastWIB = new Date(lastActivity.getTime() + wibOffset).toISOString().slice(0, 10);

  if (todayWIB === lastWIB) {
    // Sudah ada aktivitas hari ini, tidak update streak
    return;
  }

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000 + wibOffset).toISOString().slice(0, 10);
  
  let newStreak = 1;
  if (lastWIB === yesterday) {
    // Aktivitas kemarin, lanjutkan streak
    newStreak = (user.streak || 0) + 1;
  }
  // Jika lebih dari 1 hari tidak aktif, reset ke 1

  // Update streak dan updated_at
  await supabase
    .from('users')
    .update({ streak: newStreak, updated_at: now.toISOString() })
    .eq('id', userId);

  // Kirim notifikasi streak
  const { createNotification } = require('./notificationsController');
  createNotification(userId, {
    icon: 'flame',
    iconBg: 'rgba(239,68,68,0.15)',
    iconColor: '#f97316',
    text: `🔥 <strong>Learning Streak: ${newStreak} hari</strong> berturut-turut! Keep it up!`,
  }).catch(() => {});
}

module.exports = { getProgress, completeLesson };
