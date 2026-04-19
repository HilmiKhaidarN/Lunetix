require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lunetix API is running' });
});

// Routes
app.use('/api/auth',              require('./routes/auth'));
app.use('/api/courses',           require('./routes/courses'));
app.use('/api/quiz',              require('./routes/quiz'));
app.use('/api/lessons',           require('./routes/lessons'));
app.use('/api/certificates',      require('./routes/certificates'));
app.use('/api/payment',           require('./routes/payment'));
app.use('/api/video-lessons',     require('./routes/videoLessons'));
app.use('/api/analytics',         require('./routes/advancedAnalytics'));
app.use('/api/admin',             require('./routes/admin'));
app.use('/api/bookmarks',         require('./routes/bookmarks'));
app.use('/api/community',         require('./routes/community'));
app.use('/api/lesson-discussion', require('./routes/lessonDiscussion'));
app.use('/api/module-quiz',       require('./routes/moduleQuiz'));
app.use('/api/notifications',     require('./routes/notifications'));
app.use('/api/playground',        require('./routes/playground'));
app.use('/api/preferences',       require('./routes/preferences'));
app.use('/api/basic-analytics',   require('./routes/analytics'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Lunetix API running on http://localhost:${PORT}`);
});
