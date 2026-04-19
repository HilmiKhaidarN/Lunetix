const supabase = require('../config/supabase');

const POINTS_PER_LESSON    = 10;
const POINTS_PER_MODULE_QUIZ = 50;
const POINTS_PER_FINAL_QUIZ  = 100;

// ── Helper: tambah poin ke user ──
async function addPoints(userId, points, reason) {
  // Increment points
  const { data: user } = await supabase
    .from('users')
    .select('points')
    .eq('id', userId)
    .single();

  const newPoints = (user?.points || 0) + points;

  await supabase
    .from('users')
    .update({ points: newPoints })
    .eq('id', userId);

  // Kirim notifikasi
  const { createNotification } = require('./notificationsController');
  createNotification(userId, {
    icon: 'star',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: '#fbbf24',
    text: `⭐ <strong>+${points} poin</strong> — ${reason}`,
  }).catch(() => {});

  return newPoints;
}

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

  // Insert lesson progress (idempoten)
  const { error: insertErr } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
    }, { onConflict: 'user_id,course_id,lesson_id', ignoreDuplicates: true });

  if (insertErr) return res.status(500).json({ error: insertErr.message });

  // Update streak jika belum ada aktivitas hari ini
  await updateUserStreak(userId);

  // Cek apakah sudah pernah dapat poin untuk lesson ini (atomic check via unique constraint)
  const { data: alreadyAwarded, error: checkErr } = await supabase
    .from('lesson_points_awarded')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('lesson_id', lessonId)
    .single();

  let pointsEarned = 0;
  // Hanya beri poin jika belum pernah dapat (first-time completion)
  if (!alreadyAwarded && !checkErr) {
    // Insert ke tracking table (akan fail jika race condition karena UNIQUE constraint)
    const { error: trackErr } = await supabase
      .from('lesson_points_awarded')
      .insert({ user_id: userId, course_id: courseId, lesson_id: lessonId, points: POINTS_PER_LESSON });

    // Jika insert berhasil (tidak ada race condition), tambah poin
    if (!trackErr) {
      await addPoints(userId, POINTS_PER_LESSON, `Menyelesaikan lesson di kursus #${courseId}`);
      pointsEarned = POINTS_PER_LESSON;
    }
  }

  // Ambil semua lesson yang sudah selesai
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId);

  // Ambil data user terbaru
  const { data: user } = await supabase
    .from('users')
    .select('streak, points')
    .eq('id', userId)
    .single();

  return res.json({
    success: true,
    completedLessons: progress.map(p => p.lesson_id),
    streak: user?.streak || 0,
    points: user?.points || 0,
    pointsEarned,
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
