-- ══════════════════════════════════════════════
-- MIGRATION: Tambah tabel module_quiz_passed
-- Track status lulus quiz per modul per user
-- Jalankan di Supabase SQL Editor
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS module_quiz_passed (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL,
  module_index INTEGER NOT NULL,
  best_score   INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
  passed_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, module_index)
);

-- RLS
ALTER TABLE module_quiz_passed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "module_quiz_passed_own" ON module_quiz_passed
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Index
CREATE INDEX IF NOT EXISTS idx_module_quiz_passed_user
  ON module_quiz_passed(user_id, course_id);
