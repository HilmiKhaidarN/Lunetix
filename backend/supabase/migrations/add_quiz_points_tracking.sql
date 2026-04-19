-- ══════════════════════════════════════════════
-- MIGRATION: Tracking poin quiz untuk prevent race condition
-- ══════════════════════════════════════════════

-- Tabel untuk track quiz mana yang sudah dapat poin
CREATE TABLE IF NOT EXISTS quiz_points_awarded (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id    TEXT NOT NULL,
  points     INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_quiz_points_user_quiz 
ON quiz_points_awarded(user_id, quiz_id);

-- RLS policies
ALTER TABLE quiz_points_awarded ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz points"
  ON quiz_points_awarded FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert quiz points"
  ON quiz_points_awarded FOR INSERT
  WITH CHECK (true);
