// ══════════════════════════════════════════════
// QUIZ ACCESS — Batas Percobaan Quiz Harian
// ══════════════════════════════════════════════

const MAX_QUIZ_ATTEMPTS_PER_DAY = 5;
const QUIZ_PASS_THRESHOLD = 80;

// ── Helpers ──

function loadQuizAttemptData() {
  const raw = store.get('quizAttempts', {});
  if (typeof raw !== 'object' || raw === null) {
    store.set('quizAttempts', {});
    return {};
  }
  return raw;
}

function saveQuizAttemptData(data) {
  try {
    store.set('quizAttempts', data);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Penyimpanan browser penuh.');
      console.error('[QuizAccess] localStorage quota exceeded:', e);
    }
    return false;
  }
}

/**
 * Menghitung skor quiz berdasarkan jumlah benar dan total soal.
 * @param {number} correctAnswers
 * @param {number} totalQuestions
 * @returns {number} Skor 0-100
 */
function calculateQuizScore(correctAnswers, totalQuestions) {
  if (totalQuestions <= 0) return 0;
  const clamped = Math.max(0, Math.min(correctAnswers, totalQuestions));
  return Math.round((clamped / totalQuestions) * 100);
}

/**
 * Mengevaluasi apakah skor lulus.
 * @param {number} score
 * @returns {{ passed: boolean }}
 */
function evaluateQuizPass(score) {
  return { passed: score >= QUIZ_PASS_THRESHOLD };
}

/**
 * Mereset jumlah percobaan harian jika sudah melewati tengah malam WIB.
 * @param {string} userId
 * @param {string} quizId
 */
function resetDailyAttemptsIfNeeded(userId, quizId) {
  const data = loadQuizAttemptData();
  if (!data[userId]) return;
  const record = data[userId][quizId];
  if (!record) return;

  const today = getTodayWIB();
  if (record.lastAttemptDate !== today) {
    record.attemptsToday = 0;
    record.lastAttemptDate = today;
    saveQuizAttemptData(data);
  }
}

/**
 * Memeriksa apakah pengguna masih bisa mengerjakan quiz hari ini.
 * @param {string} userId
 * @param {string} quizId
 * @returns {{ canAttempt: boolean, attemptsToday: number, maxAttempts: number, resetAt?: string }}
 */
function checkQuizAttempt(userId, quizId) {
  resetDailyAttemptsIfNeeded(userId, quizId);

  const data = loadQuizAttemptData();
  const record = (data[userId] || {})[quizId];
  const attemptsToday = record ? record.attemptsToday : 0;
  const canAttempt = attemptsToday < MAX_QUIZ_ATTEMPTS_PER_DAY;

  // Hitung waktu reset (00:00 WIB besok)
  const wibOffset = 7 * 60 * 60 * 1000;
  const nowWib = new Date(Date.now() + wibOffset);
  const tomorrowWib = new Date(nowWib);
  tomorrowWib.setUTCDate(tomorrowWib.getUTCDate() + 1);
  tomorrowWib.setUTCHours(0 - 7, 0, 0, 0); // 00:00 WIB = 17:00 UTC hari sebelumnya
  const resetAt = new Date(tomorrowWib.getTime() - wibOffset).toISOString();

  return {
    canAttempt,
    attemptsToday,
    maxAttempts: MAX_QUIZ_ATTEMPTS_PER_DAY,
    resetAt,
  };
}

/**
 * Mencatat satu percobaan quiz yang telah dilakukan.
 * @param {string} userId
 * @param {string} quizId
 * @param {number} score - Skor dalam persen (0-100)
 * @returns {{ attemptsToday: number, passed: boolean, error?: string }}
 */
function recordQuizAttempt(userId, quizId, score) {
  const check = checkQuizAttempt(userId, quizId);
  if (!check.canAttempt) {
    return { attemptsToday: check.attemptsToday, passed: false, error: 'daily_limit_reached' };
  }

  // Clamp skor
  const clampedScore = Math.max(0, Math.min(100, score));
  const passed = clampedScore >= QUIZ_PASS_THRESHOLD;

  const data = loadQuizAttemptData();
  if (!data[userId]) data[userId] = {};

  const today = getTodayWIB();
  const existing = data[userId][quizId] || {
    attemptsToday: 0,
    lastAttemptDate: today,
    passed: false,
    bestScore: 0,
    scores: [],
  };

  existing.attemptsToday = (existing.lastAttemptDate === today ? existing.attemptsToday : 0) + 1;
  existing.lastAttemptDate = today;
  existing.scores = [...(existing.scores || []), clampedScore];
  existing.bestScore = Math.max(existing.bestScore || 0, clampedScore);
  if (passed) existing.passed = true;

  data[userId][quizId] = existing;
  saveQuizAttemptData(data);

  return { attemptsToday: existing.attemptsToday, passed };
}

/**
 * Mengambil status kelulusan quiz.
 * @param {string} userId
 * @param {string} quizId
 * @returns {{ passed: boolean, bestScore: number }}
 */
function getQuizPassStatus(userId, quizId) {
  resetDailyAttemptsIfNeeded(userId, quizId);
  const data = loadQuizAttemptData();
  const record = (data[userId] || {})[quizId];
  if (!record) return { passed: false, bestScore: 0 };
  return { passed: !!record.passed, bestScore: record.bestScore || 0 };
}
