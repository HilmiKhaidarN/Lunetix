// ══════════════════════════════════════════════
// API.JS — Centralized API client
// ══════════════════════════════════════════════

const API_BASE = 'http://localhost:3000/api';

/**
 * Helper fetch dengan auth token otomatis
 */
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

  if (!res.ok) {
    throw { status: res.status, error: data.error || 'Request failed' };
  }

  return data;
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
  getMe: () => apiFetch('/auth/me'),
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
