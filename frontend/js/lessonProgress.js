// ══════════════════════════════════════════════
// LESSON PROGRESS — Penyelesaian Lesson Berurutan (API + localStorage fallback)
// ══════════════════════════════════════════════

// ── localStorage fallback helpers ──

function _loadLessonData() {
  const raw = store.get('lessonProgress', {});
  return (typeof raw === 'object' && raw !== null) ? raw : {};
}

function _saveLessonData(data) {
  try { store.set('lessonProgress', data); return true; }
  catch (e) { console.error('[LessonProgress] storage error:', e); return false; }
}

/**
 * Mengambil daftar semua lessonId dari sebuah kursus.
 * Format ID harus sama dengan yang dipakai di course-page.js:
 * `${courseId}-m${moduleIdx}-l${lessonIdx}-${titleSlug}`
 */
function getCourseAllLessons(courseId) {
  // Coba dari courseRegistry dulu (tersedia di halaman course-detail)
  let curriculum = null;

  if (typeof courseRegistry !== 'undefined' && courseRegistry[courseId]) {
    curriculum = courseRegistry[courseId].curriculum;
  }

  // Fallback: coba dari objek kursus langsung
  if (!curriculum) {
    const courseObjects = {
      1: typeof courseML !== 'undefined' ? courseML : null,
      2: typeof coursePythonAI !== 'undefined' ? coursePythonAI : null,
      3: typeof courseDeepLearning !== 'undefined' ? courseDeepLearning : null,
      4: typeof courseNLP !== 'undefined' ? courseNLP : null,
      5: typeof courseComputerVision !== 'undefined' ? courseComputerVision : null,
      6: typeof courseDataScience !== 'undefined' ? courseDataScience : null,
      7: typeof courseRL !== 'undefined' ? courseRL : null,
      8: typeof courseAIEthics !== 'undefined' ? courseAIEthics : null,
    };
    const content = courseObjects[courseId];
    if (content?.curriculum) curriculum = content.curriculum;
  }

  if (!curriculum) return [];

  // Generate lesson IDs dengan format yang sama seperti course-page.js
  const lessons = [];
  curriculum.forEach((mod, mi) => {
    mod.lessons.forEach((l, li) => {
      // Format: `${courseId}-m${moduleIdx}-l${lessonIdx}-${titleSlug}`
      const titleSlug = l.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 30);
      const lessonId = `${courseId}-m${mi}-l${li}-${titleSlug}`;
      lessons.push(lessonId);
    });
  });
  return lessons;
}

// ── API-first functions ──

/**
 * Mengambil daftar lesson yang sudah selesai dari API.
 * Fallback ke localStorage.
 */
async function getCompletedLessonsAsync(courseId) {
  const session = getSession();
  if (!session?.token) return _getCompletedLessonsLocal(String(session?.id), courseId);

  try {
    const data = await LessonsAPI.getProgress(courseId);
    // Sync ke localStorage
    _syncCompletedLessonsToLocal(String(session.id), courseId, data.completedLessons);
    return data.completedLessons;
  } catch (err) {
    console.warn('[LessonProgress] API tidak tersedia, pakai localStorage.', err);
    return _getCompletedLessonsLocal(String(session.id), courseId);
  }
}

/**
 * Menandai lesson sebagai selesai via API.
 * Fallback ke localStorage.
 */
async function completeLessonAsync(courseId, lessonId) {
  const session = getSession();
  if (!session?.token) return _completeLessonLocal(String(session?.id), courseId, lessonId);

  try {
    const data = await LessonsAPI.complete(courseId, lessonId);
    // Sync ke localStorage
    _syncCompletedLessonsToLocal(String(session.id), courseId, data.completedLessons);

    const allLessons = getCourseAllLessons(courseId);
    const idx = allLessons.indexOf(lessonId);
    const nextLessonId = idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
    const courseCompleted = allLessons.every(id => data.completedLessons.includes(id));

    return { completed: true, nextLessonId, courseCompleted };
  } catch (err) {
    console.warn('[LessonProgress] API tidak tersedia, pakai localStorage.', err);
    return _completeLessonLocal(String(session.id), courseId, lessonId);
  }
}

// ── localStorage sync helper ──

function _syncCompletedLessonsToLocal(userId, courseId, completedLessons) {
  const data = _loadLessonData();
  if (!data[userId]) data[userId] = {};
  data[userId][courseId] = {
    completedLessons,
    lastCompletedAt: new Date().toISOString(),
    allCompleted: completedLessons.length === getCourseAllLessons(courseId).length,
  };
  _saveLessonData(data);
}

// ── localStorage fallback implementations ──

function _getCompletedLessonsLocal(userId, courseId) {
  const data = _loadLessonData();
  const record = (data[userId] || {})[courseId];
  return record ? (record.completedLessons || []) : [];
}

function _completeLessonLocal(userId, courseId, lessonId) {
  const access = isLessonAccessible(userId, courseId, lessonId);
  if (!access.accessible) return { completed: false, courseCompleted: false };

  const data = _loadLessonData();
  if (!data[userId]) data[userId] = {};
  if (!data[userId][courseId]) {
    data[userId][courseId] = { completedLessons: [], lastCompletedAt: null, allCompleted: false };
  }

  const record = data[userId][courseId];
  if (!record.completedLessons.includes(lessonId)) {
    record.completedLessons.push(lessonId);
    record.lastCompletedAt = new Date().toISOString();
  }

  const allLessons = getCourseAllLessons(courseId);
  record.allCompleted = allLessons.every(id => record.completedLessons.includes(id));
  _saveLessonData(data);

  const idx = allLessons.indexOf(lessonId);
  const nextLessonId = idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
  return { completed: true, nextLessonId, courseCompleted: record.allCompleted };
}

// ── Sync wrappers (kompatibilitas kode lama) ──

function getCompletedLessons(userId, courseId) {
  return _getCompletedLessonsLocal(userId, courseId);
}

function completeLesson(userId, courseId, lessonId) {
  return _completeLessonLocal(userId, courseId, lessonId);
}

function isLessonAccessible(userId, courseId, lessonId) {
  const allLessons = getCourseAllLessons(courseId);
  if (!allLessons.length) return { accessible: false, reason: 'invalid_lesson' };

  const lessonIndex = allLessons.indexOf(lessonId);
  if (lessonIndex === -1) return { accessible: false, reason: 'invalid_lesson' };
  if (lessonIndex === 0) return { accessible: true };

  const completed = _getCompletedLessonsLocal(userId, courseId);
  const prevLessonId = allLessons[lessonIndex - 1];
  return completed.includes(prevLessonId)
    ? { accessible: true }
    : { accessible: false, reason: 'previous_not_completed' };
}

function isAllLessonsCompleted(userId, courseId) {
  const allLessons = getCourseAllLessons(courseId);
  if (!allLessons.length) return false;
  const completed = _getCompletedLessonsLocal(userId, courseId);
  return allLessons.every(id => completed.includes(id));
}
