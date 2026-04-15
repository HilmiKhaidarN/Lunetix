// ══════════════════════════════════════════════
// api/index.js — Vercel Serverless Entry Point
// Express app di-wrap sebagai serverless function
// ══════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lunetix API is running' });
});

// ── Routes ──
app.use('/api/auth',         require('../backend/src/routes/auth'));
app.use('/api/courses',      require('../backend/src/routes/courses'));
app.use('/api/quiz',         require('../backend/src/routes/quiz'));
app.use('/api/lessons',      require('../backend/src/routes/lessons'));
app.use('/api/certificates', require('../backend/src/routes/certificates'));

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
