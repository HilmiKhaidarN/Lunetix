// ══════════════════════════════════════════════
// QUIZ ACCESS — Batas Percobaan Quiz Harian (API + localStorage fallback)
// ══════════════════════════════════════════════

const MAX_QUIZ_ATTEMPTS_PER_DAY = 5;
const QUIZ_PASS_THRESHOLD = 80;

// ── Pure helpers (tidak butuh API) ──

function getTodayWIB() {
  const wibOffset = 7 * 60 * 60 * 1000;
  return new Date(Date.now() + wibOffset).toISOString().slice(0, 10);
}

function calculateQuizScore(correctAnswers, totalQuestions) {
  if (totalQuestions <= 0) return 0;
  return Math.round((Math.max(0, Math.min(correctAnswers, totalQuestions)) / totalQuestions) * 100);
}

function evaluateQuizPass(score) {
  return { passed: score >= QUIZ_PASS_THRESHOLD };
}

// ── localStorage fallback helpers ──

function _loadQuizData() {
  const raw = store.get('quizAttempts', {});
  return (typeof raw === 'object' && raw !== null) ? raw : {};
}

function _saveQuizData(data) {
  try { store.set('quizAttempts', data); return true; }
  catch (e) { console.error('[QuizAccess] storage error:', e); return false; }
}

// ── API-first functions ──

/**
 * Memeriksa apakah pengguna masih bisa mengerjakan quiz hari ini.
 * Coba API dulu, fallback ke localStorage.
 */
async function checkQuizAttemptAsync(quizId) {
  const session = getSession();
  if (!session?.token) return _checkQuizAttemptLocal(String(session?.id), quizId);

  try {
    const data = await QuizAPI.getStatus(quizId);
    return {
      canAttempt: data.canAttempt,
      attemptsToday: data.attemptsToday,
      maxAttempts: data.maxAttempts,
      passed: data.passed,
      bestScore: data.bestScore,
    };
  } catch (err) {
    console.warn('[QuizAccess] API tidak tersedia, pakai localStorage.', err);
    return _checkQuizAttemptLocal(String(session.id), quizId);
  }
}

/**
 * Mencatat percobaan quiz ke API.
 * Fallback ke localStorage jika API tidak tersedia.
 */
async function recordQuizAttemptAsync(quizId, score) {
  const session = getSession();
  const clampedScore = Math.max(0, Math.min(100, score));

  if (!session?.token) return _recordQuizAttemptLocal(String(session?.id), quizId, clampedScore);

  try {
    const data = await QuizAPI.recordAttempt(quizId, clampedScore);
    // Sync ke localStorage juga
    _recordQuizAttemptLocal(String(session.id), quizId, clampedScore);
    return data;
  } catch (err) {
    if (err?.error === 'daily_limit_reached') {
      return { attemptsToday: MAX_QUIZ_ATTEMPTS_PER_DAY, passed: false, error: 'daily_limit_reached' };
    }
    console.warn('[QuizAccess] API tidak tersedia, pakai localStorage.', err);
    return _recordQuizAttemptLocal(String(session.id), quizId, clampedScore);
  }
}

// ── localStorage fallback implementations ──

function _checkQuizAttemptLocal(userId, quizId) {
  const data = _loadQuizData();
  const record = (data[userId] || {})[quizId];
  const today = getTodayWIB();

  // Reset jika hari berbeda
  if (record && record.lastAttemptDate !== today) {
    record.attemptsToday = 0;
    record.lastAttemptDate = today;
    _saveQuizData(data);
  }

  const attemptsToday = record ? record.attemptsToday : 0;
  return {
    canAttempt: attemptsToday < MAX_QUIZ_ATTEMPTS_PER_DAY,
    attemptsToday,
    maxAttempts: MAX_QUIZ_ATTEMPTS_PER_DAY,
    passed: record?.passed || false,
    bestScore: record?.bestScore || 0,
  };
}

function _recordQuizAttemptLocal(userId, quizId, score) {
  const check = _checkQuizAttemptLocal(userId, quizId);
  if (!check.canAttempt) {
    return { attemptsToday: check.attemptsToday, passed: false, error: 'daily_limit_reached' };
  }

  const passed = score >= QUIZ_PASS_THRESHOLD;
  const data = _loadQuizData();
  if (!data[userId]) data[userId] = {};

  const today = getTodayWIB();
  const existing = data[userId][quizId] || {
    attemptsToday: 0, lastAttemptDate: today,
    passed: false, bestScore: 0, scores: [],
  };

  existing.attemptsToday = (existing.lastAttemptDate === today ? existing.attemptsToday : 0) + 1;
  existing.lastAttemptDate = today;
  existing.scores = [...(existing.scores || []), score];
  existing.bestScore = Math.max(existing.bestScore || 0, score);
  if (passed) existing.passed = true;

  data[userId][quizId] = existing;
  _saveQuizData(data);

  return { attemptsToday: existing.attemptsToday, passed };
}

// ── Sync wrappers (untuk kompatibilitas kode lama) ──

function checkQuizAttempt(userId, quizId) {
  return _checkQuizAttemptLocal(userId, quizId);
}

function recordQuizAttempt(userId, quizId, score) {
  return _recordQuizAttemptLocal(userId, quizId, score);
}

function getQuizPassStatus(userId, quizId) {
  const data = _loadQuizData();
  const record = (data[userId] || {})[quizId];
  if (!record) return { passed: false, bestScore: 0 };
  return { passed: !!record.passed, bestScore: record.bestScore || 0 };
}

function resetDailyAttemptsIfNeeded(userId, quizId) {
  _checkQuizAttemptLocal(userId, quizId); // sudah handle reset di dalamnya
}
