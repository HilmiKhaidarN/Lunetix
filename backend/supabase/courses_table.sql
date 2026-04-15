-- ══════════════════════════════════════════════
-- TABLE: courses
-- Memindahkan coursesData dari courses.js ke Supabase
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS courses (
  id           INTEGER PRIMARY KEY,
  title        TEXT NOT NULL,
  level        TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category     TEXT NOT NULL,
  thumb_icon   TEXT DEFAULT 'book-open',
  thumb_bg     TEXT DEFAULT '',
  thumb_color  TEXT DEFAULT '',
  duration     TEXT DEFAULT '',
  students     TEXT DEFAULT '0',
  rating       NUMERIC(2,1) DEFAULT 0.0,
  status       TEXT DEFAULT 'start' CHECK (status IN ('start', 'continue', 'coming')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Semua user bisa baca courses (public read)
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (true);

-- Hanya service role yang bisa insert/update/delete
CREATE POLICY "courses_service_write" ON courses
  FOR ALL USING (auth.role() = 'service_role');

-- Index
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- ── Insert semua data kursus ──
INSERT INTO courses (id, title, level, category, thumb_icon, thumb_bg, thumb_color, duration, students, rating, status) VALUES
(1, 'Machine Learning Fundamentals', 'Beginner',     'Machine Learning', 'brain-circuit',      'linear-gradient(135deg,#1e1b4b,#312e81)', '#a78bfa', '8h 30m',  '2.1k', 4.8, 'start'),
(2, 'Python for AI',                 'Beginner',     'Machine Learning', 'code-2',             'linear-gradient(135deg,#14532d,#166534)', '#4ade80', '6h 15m',  '3.4k', 4.9, 'start'),
(3, 'Deep Learning Essentials',      'Intermediate', 'Deep Learning',    'network',            'linear-gradient(135deg,#1e3a5f,#1e40af)', '#60a5fa', '12h 45m', '1.8k', 4.7, 'start'),
(4, 'Natural Language Processing',   'Intermediate', 'NLP',              'message-square-text','linear-gradient(135deg,#3b1f5e,#6d28d9)', '#c084fc', '10h 20m', '1.2k', 4.6, 'start'),
(5, 'Computer Vision with Python',   'Beginner',     'Computer Vision',  'scan-eye',           'linear-gradient(135deg,#1c3a2e,#065f46)', '#34d399', '9h 10m',  '2.5k', 4.8, 'start'),
(6, 'Data Science with AI',          'Beginner',     'Data Science',     'database',           'linear-gradient(135deg,#1c2a4a,#1e3a8a)', '#818cf8', '11h 50m', '4.1k', 4.9, 'start'),
(7, 'Reinforcement Learning',        'Advanced',     'Deep Learning',    'gamepad-2',          'linear-gradient(135deg,#3b1a1a,#7f1d1d)', '#f87171', '15h 30m', '890',  4.7, 'coming'),
(8, 'AI Ethics & Safety',            'Beginner',     'Data Science',     'shield-check',       'linear-gradient(135deg,#1a2e1a,#14532d)', '#86efac', '5h 20m',  '1.5k', 4.5, 'coming')
ON CONFLICT (id) DO NOTHING;
