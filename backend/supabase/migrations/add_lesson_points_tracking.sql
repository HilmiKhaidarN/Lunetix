-- ══════════════════════════════════════════════
-- MIGRATION: Tracking poin lesson untuk prevent double points
-- ══════════════════════════════════════════════

-- Tabel untuk track lesson mana yang sudah dapat poin
CREATE TABLE IF NOT EXISTS lesson_points_awarded (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id  INTEGER NOT NULL,
  lesson_id  TEXT NOT NULL,
  points     INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_lesson_points_user_course_lesson 
ON lesson_points_awarded(user_id, course_id, lesson_id);

-- RLS policies
ALTER TABLE lesson_points_awarded ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson points"
  ON lesson_points_awarded FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert lesson points"
  ON lesson_points_awarded FOR INSERT
  WITH CHECK (true);
