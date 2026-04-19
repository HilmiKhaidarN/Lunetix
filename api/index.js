// ══════════════════════════════════════════════
// api/index.js — Vercel Serverless Entry Point
// Express app di-wrap sebagai serverless function
// ══════════════════════════════════════════════

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ── HTTPS enforcement di production ──
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.status(403).json({ error: 'HTTPS required' });
  }
  next();
});

// ── Rate limiters ──
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login/register. Coba lagi dalam 15 menit.' },
});

// ── Middleware ──
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['https://lunetix-rust.vercel.app'];

// Helper: sanitize HTML untuk prevent XSS
function sanitizeHtml(str) {
  if (!str) return str;
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Izinkan localhost untuk development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} tidak diizinkan.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(globalLimiter);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lunetix API is running' });
});

// ── Routes ──
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth',              require('../backend/src/routes/auth'));
app.use('/api/courses',           require('../backend/src/routes/courses'));
app.use('/api/quiz',              require('../backend/src/routes/quiz'));
app.use('/api/module-quiz',       require('../backend/src/routes/moduleQuiz'));
app.use('/api/lessons',           require('../backend/src/routes/lessons'));
app.use('/api/lesson-discussion', require('../backend/src/routes/lessonDiscussion'));
app.use('/api/certificates',      require('../backend/src/routes/certificates'));
app.use('/api/notifications',     require('../backend/src/routes/notifications'));
app.use('/api/community',         require('../backend/src/routes/community'));
app.use('/api/basic-analytics',   require('../backend/src/routes/analytics'));
app.use('/api/analytics',         require('../backend/src/routes/advancedAnalytics'));
app.use('/api/playground',        require('../backend/src/routes/playground'));
app.use('/api/bookmarks',         require('../backend/src/routes/bookmarks'));
app.use('/api/preferences',       require('../backend/src/routes/preferences'));
app.use('/api/payment',           require('../backend/src/routes/payment'));
app.use('/api/video-lessons',     require('../backend/src/routes/videoLessons'));
app.use('/api/admin',             require('../backend/src/routes/admin'));

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
