// ══════════════════════════════════════════════
// LESSON PROGRESS — Penyelesaian Lesson Berurutan
// ══════════════════════════════════════════════

// ── Helpers ──

function loadLessonProgressData() {
  const raw = store.get('lessonProgress', {});
  if (typeof raw !== 'object' || raw === null) {
    store.set('lessonProgress', {});
    return {};
  }
  return raw;
}

function saveLessonProgressData(data) {
  try {
    store.set('lessonProgress', data);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Penyimpanan browser penuh.');
      console.error('[LessonProgress] localStorage quota exceeded:', e);
    }
    return false;
  }
}

/**
 * Mengambil daftar semua lesson dari sebuah kursus (dari courseRegistry).
 * @param {number} courseId
 * @returns {string[]} Array lessonId berurutan
 */
function getCourseAllLessons(courseId) {
  const content = courseRegistry[courseId];
  if (!content || !content.curriculum) return [];
  const lessons = [];
  content.curriculum.forEach(mod => {
    mod.lessons.forEach(l => {
      // Buat lessonId dari title jika tidak ada id
      const lessonId = l.id || (courseId + '-' + l.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
      lessons.push(lessonId);
    });
  });
  return lessons;
}

// ── Core Functions ──

/**
 * Mengambil daftar lesson yang telah diselesaikan dalam sebuah kursus.
 * @param {string} userId
 * @param {number} courseId
 * @returns {string[]} Array lessonId yang sudah selesai
 */
function getCompletedLessons(userId, courseId) {
  const data = loadLessonProgressData();
  const record = (data[userId] || {})[courseId];
  return record ? (record.completedLessons || []) : [];
}

/**
 * Memeriksa apakah sebuah lesson dapat diakses oleh pengguna.
 * @param {string} userId
 * @param {number} courseId
 * @param {string} lessonId
 * @returns {{ accessible: boolean, reason?: string }}
 */
function isLessonAccessible(userId, courseId, lessonId) {
  const allLessons = getCourseAllLessons(courseId);
  if (!allLessons.length) return { accessible: false, reason: 'invalid_lesson' };

  const lessonIndex = allLessons.indexOf(lessonId);
  if (lessonIndex === -1) return { accessible: false, reason: 'invalid_lesson' };

  // Lesson pertama selalu accessible
  if (lessonIndex === 0) return { accessible: true };

  // Lesson lain hanya accessible jika lesson sebelumnya sudah selesai
  const completed = getCompletedLessons(userId, courseId);
  const prevLessonId = allLessons[lessonIndex - 1];
  if (completed.includes(prevLessonId)) {
    return { accessible: true };
  }

  return { accessible: false, reason: 'previous_not_completed' };
}

/**
 * Memeriksa apakah semua lesson dalam kursus telah diselesaikan.
 * @param {string} userId
 * @param {number} courseId
 * @returns {boolean}
 */
function isAllLessonsCompleted(userId, courseId) {
  const allLessons = getCourseAllLessons(courseId);
  if (!allLessons.length) return false;
  const completed = getCompletedLessons(userId, courseId);
  return allLessons.every(id => completed.includes(id));
}

/**
 * Menandai sebuah lesson sebagai selesai dan membuka lesson berikutnya.
 * @param {string} userId
 * @param {number} courseId
 * @param {string} lessonId
 * @returns {{ completed: boolean, nextLessonId?: string, courseCompleted: boolean }}
 */
function completeLesson(userId, courseId, lessonId) {
  const access = isLessonAccessible(userId, courseId, lessonId);
  if (!access.accessible) {
    return { completed: false, courseCompleted: false };
  }

  const data = loadLessonProgressData();
  if (!data[userId]) data[userId] = {};
  if (!data[userId][courseId]) {
    data[userId][courseId] = {
      completedLessons: [],
      lastCompletedAt: null,
      allCompleted: false,
    };
  }

  const record = data[userId][courseId];

  // Idempoten: jika sudah selesai, kembalikan state saat ini
  if (record.completedLessons.includes(lessonId)) {
    const allLessons = getCourseAllLessons(courseId);
    const idx = allLessons.indexOf(lessonId);
    const nextLessonId = idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
    return { completed: true, nextLessonId, courseCompleted: record.allCompleted };
  }

  record.completedLessons.push(lessonId);
  record.lastCompletedAt = new Date().toISOString();

  const allLessons = getCourseAllLessons(courseId);
  const allDone = allLessons.every(id => record.completedLessons.includes(id));
  record.allCompleted = allDone;

  saveLessonProgressData(data);

  const idx = allLessons.indexOf(lessonId);
  const nextLessonId = idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;

  return { completed: true, nextLessonId, courseCompleted: allDone };
}
