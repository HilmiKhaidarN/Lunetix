const supabase = require('../config/supabase');

const MAX_ATTEMPTS_PER_DAY = 5;
const PASS_THRESHOLD = 80;

function getTodayWIB() {
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibDate = new Date(Date.now() + wibOffset);
  return wibDate.toISOString().slice(0, 10);
}

// GET /api/quiz/:quizId/status
async function getQuizStatus(req, res) {
  const userId = req.user.id;
  const { quizId } = req.params;
  const today = getTodayWIB();

  // Hitung percobaan hari ini (WIB)
  const { data: attempts, error } = await supabase
    .from('quiz_attempts')
    .select('id, score, passed, attempted_at')
    .eq('user_id', userId)
    .eq('quiz_id', quizId);

  if (error) return res.status(500).json({ error: error.message });

  const todayAttempts = attempts.filter(a => {
    const wibDate = new Date(new Date(a.attempted_at).getTime() + 7 * 60 * 60 * 1000);
    return wibDate.toISOString().slice(0, 10) === today;
  });

  const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score)) : 0;
  const passed = attempts.some(a => a.passed);
  const attemptsToday = todayAttempts.length;
  const canAttempt = attemptsToday < MAX_ATTEMPTS_PER_DAY;

  return res.json({
    canAttempt,
    attemptsToday,
    maxAttempts: MAX_ATTEMPTS_PER_DAY,
    bestScore,
    passed,
  });
}

// POST /api/quiz/:quizId/attempt
async function recordAttempt(req, res) {
  const userId = req.user.id;
  const { quizId } = req.params;
  const { score } = req.body;

  if (score === undefined || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Skor tidak valid (0-100).' });
  }

  // Cek batas harian
  const today = getTodayWIB();
  const { data: todayAttempts, error: checkErr } = await supabase
    .from('quiz_attempts')
    .select('id, attempted_at')
    .eq('user_id', userId)
    .eq('quiz_id', quizId);

  if (checkErr) return res.status(500).json({ error: checkErr.message });

  const todayCount = todayAttempts.filter(a => {
    const wibDate = new Date(new Date(a.attempted_at).getTime() + 7 * 60 * 60 * 1000);
    return wibDate.toISOString().slice(0, 10) === today;
  }).length;

  if (todayCount >= MAX_ATTEMPTS_PER_DAY) {
    return res.status(429).json({ error: 'daily_limit_reached', attemptsToday: todayCount });
  }

  const passed = score >= PASS_THRESHOLD;

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score: Math.round(score),
      passed,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({
    success: true,
    attemptsToday: todayCount + 1,
    passed,
    score: Math.round(score),
  });
}

module.exports = { getQuizStatus, recordAttempt };
