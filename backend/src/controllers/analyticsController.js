// ══════════════════════════════════════════════
// ANALYTICS CONTROLLER
// Data real untuk halaman analytics
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

function getTodayWIB() {
  const wibOffset = 7 * 60 * 60 * 1000;
  return new Date(Date.now() + wibOffset).toISOString().slice(0, 10);
}

function getDateWIB(date) {
  const wibOffset = 7 * 60 * 60 * 1000;
  return new Date(new Date(date).getTime() + wibOffset).toISOString().slice(0, 10);
}

// GET /api/analytics/summary
// Ringkasan lengkap untuk halaman analytics
async function getSummary(req, res) {
  const userId = req.user.id;

  try {
    // 1. Lesson progress
    const { data: lessons } = await supabase
      .from('lesson_progress')
      .select('course_id, lesson_id, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    // 2. Quiz attempts
    const { data: quizAttempts } = await supabase
      .from('quiz_attempts')
      .select('quiz_id, score, passed, attempted_at')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: true });

    // 3. User profile (streak, points)
    const { data: user } = await supabase
      .from('users')
      .select('streak, points, updated_at')
      .eq('id', userId)
      .single();

    // 4. Course access
    const { data: courseAccess } = await supabase
      .from('course_access')
      .select('course_id, status, claimed_at')
      .eq('user_id', userId);

    // ── Hitung lesson per hari (7 hari terakhir) ──
    const today = getTodayWIB();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const wibDate = getDateWIB(d);
      last7Days.push(wibDate);
    }

    const lessonsByDay = {};
    last7Days.forEach(d => { lessonsByDay[d] = 0; });
    (lessons || []).forEach(l => {
      const day = getDateWIB(l.completed_at);
      if (lessonsByDay[day] !== undefined) lessonsByDay[day]++;
    });

    // ── Hitung quiz scores per waktu ──
    const quizScoreHistory = (quizAttempts || []).map(a => ({
      date: getDateWIB(a.attempted_at),
      score: a.score,
      quizId: a.quiz_id,
      passed: a.passed,
    }));

    // ── Best quiz score per quiz ──
    const bestScores = {};
    (quizAttempts || []).forEach(a => {
      if (!bestScores[a.quiz_id] || a.score > bestScores[a.quiz_id]) {
        bestScores[a.quiz_id] = a.score;
      }
    });

    // ── Avg score ──
    const allScores = Object.values(bestScores);
    const avgScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // ── Lesson per kursus ──
    const lessonsByCourse = {};
    (lessons || []).forEach(l => {
      if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = 0;
      lessonsByCourse[l.course_id]++;
    });

    // ── Streak harian (7 hari) ──
    const streakDays = last7Days.map(d => ({
      date: d,
      active: (lessons || []).some(l => getDateWIB(l.completed_at) === d) ||
              (quizAttempts || []).some(a => getDateWIB(a.attempted_at) === d),
    }));

    // ── Most productive day ──
    const maxLessons = Math.max(...Object.values(lessonsByDay), 0);
    const bestDayDate = maxLessons > 0
      ? Object.entries(lessonsByDay).find(([, v]) => v === maxLessons)?.[0]
      : null;
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const bestDayName = bestDayDate
      ? dayNames[new Date(bestDayDate).getDay()]
      : '-';

    return res.json({
      // Stats bar
      totalLessons:    (lessons || []).length,
      activeCourses:   (courseAccess || []).filter(c => c.status === 'active').length,
      totalQuizzes:    Object.keys(bestScores).length,
      avgScore,

      // Streak
      currentStreak:   user?.streak || 0,
      streakDays,

      // Lesson activity per hari (7 hari)
      lessonsByDay: last7Days.map(d => ({
        date: d,
        count: lessonsByDay[d] || 0,
      })),
      bestDay: bestDayName,
      totalLessonsThisWeek: Object.values(lessonsByDay).reduce((a, b) => a + b, 0),

      // Quiz performance trend
      quizScoreHistory: quizScoreHistory.slice(-20), // 20 attempt terakhir

      // Lesson per kursus
      lessonsByCourse,

      // Best scores per quiz
      bestScores,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getSummary };
