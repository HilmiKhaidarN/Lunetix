// ══════════════════════════════════════════════
// API.JS — Centralized API client
// ══════════════════════════════════════════════

// Auto-detect: pakai /api (relative) di production Vercel,
// pakai localhost saat development lokal
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

/**
 * Helper fetch dengan auth token otomatis + auto refresh token
 */
let _isRefreshing = false;
let _refreshQueue = [];

async function apiFetch(endpoint, options = {}) {
  const session = getSession();
  const token = session?.token || null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  // Auto-refresh token jika 401 dan ada refresh token
  if (res.status === 401 && session?.refreshToken) {
    const newToken = await _tryRefreshToken(session.refreshToken);
    if (newToken) {
      // Retry dengan token baru
      const retryHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...(options.headers || {}),
      };
      const retryRes = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });
      const retryData = await retryRes.json();
      if (!retryRes.ok) {
        throw { status: retryRes.status, error: retryData.error || 'Request failed' };
      }
      return retryData;
    } else {
      // Refresh gagal, redirect ke login
      clearSession();
      window.location.href = '/login';
      throw { status: 401, error: 'Session expired. Silakan login ulang.' };
    }
  }

  if (!res.ok) {
    throw { status: res.status, error: data.error || 'Request failed' };
  }

  return data;
}

// Refresh token — hanya satu request sekaligus (prevent race condition)
async function _tryRefreshToken(refreshToken) {
  if (_isRefreshing) {
    // Tunggu request refresh yang sedang berjalan
    return new Promise(resolve => { _refreshQueue.push(resolve); });
  }

  _isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      _refreshQueue.forEach(fn => fn(null));
      _refreshQueue = [];
      return null;
    }

    const data = await res.json();
    const session = getSession();
    if (session) {
      session.token = data.token;
      session.refreshToken = data.refreshToken;
      session.expiresAt = data.expiresAt;
      // Sync user data terbaru
      if (data.user) {
        Object.assign(session, data.user);
      }
      setSession(session);
    }

    _refreshQueue.forEach(fn => fn(data.token));
    _refreshQueue = [];
    return data.token;
  } catch {
    _refreshQueue.forEach(fn => fn(null));
    _refreshQueue = [];
    return null;
  } finally {
    _isRefreshing = false;
  }
}

// ── Courses ──
const CoursesAPI = {
  getAll: () => apiFetch('/courses'),
  getById: (id) => apiFetch(`/courses/${id}`),
  claim: (id) => apiFetch(`/courses/${id}/claim`, { method: 'POST' }),
  getMyCourses: () => apiFetch('/courses/access/me'),
};

// ── Auth ──
const AuthAPI = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  refresh: (refreshToken) => apiFetch('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMe: () => apiFetch('/auth/me'),
  updateProfile: (body) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => apiFetch('/auth/password', { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Quiz ──
const QuizAPI = {
  getStatus: (quizId) => apiFetch(`/quiz/${quizId}/status`),
  recordAttempt: (quizId, score) => apiFetch(`/quiz/${quizId}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ score }),
  }),
};

// ── Lessons ──
const LessonsAPI = {
  getProgress: (courseId) => apiFetch(`/lessons/${courseId}/progress`),
  complete: (courseId, lessonId) => apiFetch(`/lessons/${courseId}/${lessonId}/complete`, {
    method: 'POST',
  }),
};

// ── Certificates ──
const CertificatesAPI = {
  getMine: () => apiFetch('/certificates'),
  issue: (courseId) => apiFetch(`/certificates/${courseId}`, { method: 'POST' }),
};

// ── Notifications ──
const NotificationsAPI = {
  getAll:      () => apiFetch('/notifications'),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PUT' }),
  markRead:    (id) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
};

// ── Community ──
const CommunityAPI = {
  getStats:   () => apiFetch('/community/stats'),
  getPosts:   (tag) => apiFetch(`/community/posts${tag && tag !== 'all' ? '?tag=' + encodeURIComponent(tag) : ''}`),
  createPost: (body) => apiFetch('/community/posts', { method: 'POST', body: JSON.stringify(body) }),
  toggleLike: (id) => apiFetch(`/community/posts/${id}/like`, { method: 'POST' }),
  deletePost: (id) => apiFetch(`/community/posts/${id}`, { method: 'DELETE' }),
};

// ── Module Quiz ──
const ModuleQuizAPI = {
  // Ambil semua modul yang sudah lulus untuk satu kursus
  getStatus: (courseId) => apiFetch(`/module-quiz/${courseId}/status`),
  // Tandai modul sebagai lulus
  markPassed: (courseId, moduleIndex, score) => apiFetch(
    `/module-quiz/${courseId}/${moduleIndex}/pass`,
    { method: 'POST', body: JSON.stringify({ score }) }
  ),
};

// ── Lesson Discussion ──
const DiscussionAPI = {
  getAll:    (courseId, lessonId) => apiFetch(`/lesson-discussion/${courseId}/${lessonId}`),
  create:    (courseId, lessonId, body, parentId) => apiFetch(
    `/lesson-discussion/${courseId}/${lessonId}`,
    { method: 'POST', body: JSON.stringify({ body, parentId: parentId || null }) }
  ),
  like:      (courseId, lessonId, postId) => apiFetch(
    `/lesson-discussion/${courseId}/${lessonId}/${postId}/like`,
    { method: 'POST' }
  ),
  delete:    (courseId, lessonId, postId) => apiFetch(
    `/lesson-discussion/${courseId}/${lessonId}/${postId}`,
    { method: 'DELETE' }
  ),
};

// ── Analytics ──
const AnalyticsAPI = {
  getSummary: () => apiFetch('/analytics/summary'),
};

// ── Playground ──
const PlaygroundAPI = {
  chat: (message, model, history) => apiFetch('/playground/chat', {
    method: 'POST',
    body: JSON.stringify({ message, model, history }),
  }),
};

// ── Bookmarks ──
const BookmarksAPI = {
  getAll:  () => apiFetch('/bookmarks'),
  add:     (data) => apiFetch('/bookmarks', { method: 'POST', body: JSON.stringify(data) }),
  remove:  (id) => apiFetch(`/bookmarks/${id}`, { method: 'DELETE' }),
};

// ── User Preferences ──
const PreferencesAPI = {
  getAll: () => apiFetch('/preferences'),
  get:    (key) => apiFetch(`/preferences/${key}`),
  set:    (key, value) => apiFetch(`/preferences/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
};

// ── Playground Sessions ──
const PlaygroundSessionsAPI = {
  getAll:  () => apiFetch('/playground/sessions'),
  create:  (data) => apiFetch('/playground/sessions', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data) => apiFetch(`/playground/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:  (id) => apiFetch(`/playground/sessions/${id}`, { method: 'DELETE' }),
};
