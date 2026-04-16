// ══════════════════════════════════════════════
// api/index.js — Vercel Serverless Entry Point
// Express app di-wrap sebagai serverless function
// ══════════════════════════════════════════════

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

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
app.use(cors({
  origin: '*',
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
app.use('/api/auth',          require('../backend/src/routes/auth'));
app.use('/api/courses',       require('../backend/src/routes/courses'));
app.use('/api/quiz',          require('../backend/src/routes/quiz'));
app.use('/api/module-quiz',   require('../backend/src/routes/moduleQuiz'));
app.use('/api/lessons',       require('../backend/src/routes/lessons'));
app.use('/api/certificates',  require('../backend/src/routes/certificates'));
app.use('/api/notifications', require('../backend/src/routes/notifications'));
app.use('/api/community',     require('../backend/src/routes/community'));

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
