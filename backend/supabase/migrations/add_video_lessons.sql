-- ══════════════════════════════════════════════
-- VIDEO LESSONS SYSTEM
-- ══════════════════════════════════════════════

-- ── TABLE: video_lessons ──
-- Menyimpan data video lessons per course
CREATE TABLE IF NOT EXISTS video_lessons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id     INTEGER NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  video_url     TEXT NOT NULL,
  thumbnail_url TEXT,
  duration      INTEGER NOT NULL, -- in seconds
  order_index   INTEGER NOT NULL,
  is_free       BOOLEAN DEFAULT FALSE, -- true jika bisa diakses tanpa claim course
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: video_progress ──
-- Menyimpan progress menonton video per user
CREATE TABLE IF NOT EXISTS video_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id       INTEGER NOT NULL,
  lesson_id       UUID NOT NULL REFERENCES video_lessons(id) ON DELETE CASCADE,
  watch_time      INTEGER DEFAULT 0, -- in seconds
  completed       BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_video_lessons_course ON video_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_video_lessons_order ON video_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_video_progress_user ON video_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_lesson ON video_progress(lesson_id);

-- ── RLS Policies ──
ALTER TABLE video_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

-- Video lessons: semua user bisa lihat (akses control di aplikasi)
CREATE POLICY "video_lessons_select_all" ON video_lessons
  FOR SELECT USING (true);

-- Video progress: hanya milik sendiri
CREATE POLICY "video_progress_own" ON video_progress
  FOR ALL USING (user_id = auth.uid()::UUID);

-- ── Sample Video Lessons Data ──
-- Insert sample video lessons untuk setiap course

-- Course 1: Machine Learning Fundamentals
INSERT INTO video_lessons (course_id, title, description, video_url, thumbnail_url, duration, order_index, is_free) VALUES
(1, 'Introduction to Machine Learning', 'Pengenalan konsep dasar Machine Learning dan aplikasinya dalam kehidupan sehari-hari.', 'https://www.youtube.com/embed/ukzFI9rgwfU', 'https://img.youtube.com/vi/ukzFI9rgwfU/maxresdefault.jpg', 900, 1, true),
(1, 'Types of Machine Learning', 'Memahami perbedaan Supervised, Unsupervised, dan Reinforcement Learning.', 'https://www.youtube.com/embed/f_uwKZIAeM0', 'https://img.youtube.com/vi/f_uwKZIAeM0/maxresdefault.jpg', 720, 2, false),
(1, 'Linear Regression Explained', 'Deep dive ke algoritma Linear Regression dengan contoh praktis.', 'https://www.youtube.com/embed/7ArmBVF2dCs', 'https://img.youtube.com/vi/7ArmBVF2dCs/maxresdefault.jpg', 1080, 3, false),
(1, 'Classification vs Regression', 'Memahami kapan menggunakan classification dan regression.', 'https://www.youtube.com/embed/TJveOYsK6MY', 'https://img.youtube.com/vi/TJveOYsK6MY/maxresdefault.jpg', 600, 4, false);

-- Course 2: Python for AI
INSERT INTO video_lessons (course_id, title, description, video_url, thumbnail_url, duration, order_index, is_free) VALUES
(2, 'Python Basics for AI', 'Setup Python environment dan library essential untuk AI.', 'https://www.youtube.com/embed/rfscVS0vtbw', 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg', 1200, 1, true),
(2, 'NumPy for Data Science', 'Menguasai NumPy untuk operasi array dan komputasi numerik.', 'https://www.youtube.com/embed/QUT1VHiLmmI', 'https://img.youtube.com/vi/QUT1VHiLmmI/maxresdefault.jpg', 900, 2, false),
(2, 'Pandas Data Manipulation', 'Data cleaning dan manipulation menggunakan Pandas.', 'https://www.youtube.com/embed/vmEHCJofslg', 'https://img.youtube.com/vi/vmEHCJofslg/maxresdefault.jpg', 1080, 3, false),
(2, 'Matplotlib Visualization', 'Membuat visualisasi data yang menarik dengan Matplotlib.', 'https://www.youtube.com/embed/3Xc3CA655Y4', 'https://img.youtube.com/vi/3Xc3CA655Y4/maxresdefault.jpg', 720, 4, false);

-- Course 3: Deep Learning Essentials
INSERT INTO video_lessons (course_id, title, description, video_url, thumbnail_url, duration, order_index, is_free) VALUES
(3, 'Neural Networks Fundamentals', 'Memahami cara kerja neural networks dari dasar.', 'https://www.youtube.com/embed/aircAruvnKk', 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg', 1140, 1, true),
(3, 'Backpropagation Algorithm', 'Deep dive ke algoritma backpropagation untuk training neural networks.', 'https://www.youtube.com/embed/Ilg3gGewQ5U', 'https://img.youtube.com/vi/Ilg3gGewQ5U/maxresdefault.jpg', 1020, 2, false),
(3, 'Convolutional Neural Networks', 'Memahami CNN untuk computer vision tasks.', 'https://www.youtube.com/embed/FmpDIaiMIeA', 'https://img.youtube.com/vi/FmpDIaiMIeA/maxresdefault.jpg', 900, 3, false),
(3, 'Transfer Learning', 'Menggunakan pre-trained models untuk project sendiri.', 'https://www.youtube.com/embed/yofjFQddwHE', 'https://img.youtube.com/vi/yofjFQddwHE/maxresdefault.jpg', 780, 4, false);

-- Course 4: Natural Language Processing
INSERT INTO video_lessons (course_id, title, description, video_url, thumbnail_url, duration, order_index, is_free) VALUES
(4, 'NLP Introduction', 'Pengenalan Natural Language Processing dan aplikasinya.', 'https://www.youtube.com/embed/X2vAabgKiuM', 'https://img.youtube.com/vi/X2vAabgKiuM/maxresdefault.jpg', 840, 1, true),
(4, 'Text Preprocessing', 'Teknik preprocessing text: tokenization, stemming, lemmatization.', 'https://www.youtube.com/embed/nxhCyeRR75Q', 'https://img.youtube.com/vi/nxhCyeRR75Q/maxresdefault.jpg', 720, 2, false),
(4, 'Word Embeddings', 'Memahami Word2Vec, GloVe, dan modern embeddings.', 'https://www.youtube.com/embed/ERibwqs9p38', 'https://img.youtube.com/vi/ERibwqs9p38/maxresdefault.jpg', 960, 3, false),
(4, 'Transformer Architecture', 'Deep dive ke Transformer dan attention mechanism.', 'https://www.youtube.com/embed/iDulhoQ2pro', 'https://img.youtube.com/vi/iDulhoQ2pro/maxresdefault.jpg', 1200, 4, false);

-- Course 5: Computer Vision with Python
INSERT INTO video_lessons (course_id, title, description, video_url, thumbnail_url, duration, order_index, is_free) VALUES
(5, 'Computer Vision Basics', 'Pengenalan computer vision dan OpenCV.', 'https://www.youtube.com/embed/oXlwWbU8l2o', 'https://img.youtube.com/vi/oXlwWbU8l2o/maxresdefault.jpg', 900, 1, true),
(5, 'Image Processing Techniques', 'Filtering, edge detection, dan image enhancement.', 'https://www.youtube.com/embed/SjaOj7vB-iI', 'https://img.youtube.com/vi/SjaOj7vB-iI/maxresdefault.jpg', 1080, 2, false),
(5, 'Object Detection with YOLO', 'Implementasi YOLO untuk real-time object detection.', 'https://www.youtube.com/embed/ag3DLKsl2vk', 'https://img.youtube.com/vi/ag3DLKsl2vk/maxresdefault.jpg', 1200, 3, false),
(5, 'Face Recognition Project', 'Build face recognition system dari scratch.', 'https://www.youtube.com/embed/sz25xxF_AVE', 'https://img.youtube.com/vi/sz25xxF_AVE/maxresdefault.jpg', 1440, 4, false);

-- ── Function: Update updated_at on video_lessons ──
CREATE TRIGGER video_lessons_updated_at
  BEFORE UPDATE ON video_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();