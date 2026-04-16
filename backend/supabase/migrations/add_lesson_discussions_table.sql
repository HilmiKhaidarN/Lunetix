-- ══════════════════════════════════════════════
-- MIGRATION: Tambah tabel lesson_discussions & lesson_discussion_likes
-- Discussion per lesson (threaded: komentar + reply 1 level)
-- Jalankan di Supabase SQL Editor
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS lesson_discussions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL,
  lesson_id    TEXT NOT NULL,       -- format: "1-m0-l2-..."
  parent_id    UUID REFERENCES lesson_discussions(id) ON DELETE CASCADE, -- NULL = komentar, non-NULL = reply
  author_name  TEXT NOT NULL,
  author_avatar TEXT DEFAULT '',
  body         TEXT NOT NULL,
  likes        INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_discussion_likes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES lesson_discussions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

-- RLS
ALTER TABLE lesson_discussions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_discussion_likes  ENABLE ROW LEVEL SECURITY;

-- Semua user bisa baca diskusi
CREATE POLICY "lesson_discussions_select" ON lesson_discussions
  FOR SELECT USING (true);

-- Hanya pemilik yang bisa insert/update/delete miliknya
CREATE POLICY "lesson_discussions_insert" ON lesson_discussions
  FOR INSERT WITH CHECK (user_id = auth.uid()::UUID);

CREATE POLICY "lesson_discussions_delete" ON lesson_discussions
  FOR DELETE USING (user_id = auth.uid()::UUID);

-- Likes: semua bisa insert/delete miliknya
CREATE POLICY "lesson_discussion_likes_all" ON lesson_discussion_likes
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lesson_disc_lesson
  ON lesson_discussions(course_id, lesson_id, parent_id, created_at);

CREATE INDEX IF NOT EXISTS idx_lesson_disc_likes
  ON lesson_discussion_likes(post_id, user_id);
