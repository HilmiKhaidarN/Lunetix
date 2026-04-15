-- ══════════════════════════════════════════════
-- LUNETIX LMS — Supabase Schema
-- ══════════════════════════════════════════════
-- Jalankan file ini di Supabase SQL Editor
-- supabase.com > project > SQL Editor > New Query

-- ── Enable UUID extension ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════
-- TABLE 1: users
-- Menggantikan: lunetix_users di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar        TEXT DEFAULT '',
  account_type  TEXT DEFAULT 'free' CHECK (account_type IN ('free', 'pro')),
  streak        INTEGER DEFAULT 0,
  points        INTEGER DEFAULT 0,
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════
-- TABLE 2: course_access
-- Menggantikan: lx_courseAccess di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS course_access (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id            INTEGER NOT NULL,
  claimed_at           TIMESTAMPTZ DEFAULT NOW(),
  expires_at           TIMESTAMPTZ NOT NULL,
  status               TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  account_type_at_claim TEXT DEFAULT 'free' CHECK (account_type_at_claim IN ('free', 'pro')),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ══════════════════════════════════════════════
-- TABLE 3: lesson_progress
-- Menggantikan: lx_lessonProgress di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lesson_progress (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id         INTEGER NOT NULL,
  lesson_id         TEXT NOT NULL,
  completed_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- ══════════════════════════════════════════════
-- TABLE 4: quiz_attempts
-- Menggantikan: lx_quizAttempts di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id          TEXT NOT NULL,
  score            INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed           BOOLEAN DEFAULT FALSE,
  attempted_at     TIMESTAMPTZ DEFAULT NOW()
);

-- View: ringkasan quiz per user per quiz (untuk cek batas harian & best score)
CREATE OR REPLACE VIEW quiz_attempt_summary AS
SELECT
  user_id,
  quiz_id,
  COUNT(*) FILTER (
    WHERE attempted_at::DATE = (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE
  ) AS attempts_today,
  MAX(score) AS best_score,
  BOOL_OR(passed) AS passed
FROM quiz_attempts
GROUP BY user_id, quiz_id;

-- ══════════════════════════════════════════════
-- TABLE 5: certificates
-- Menggantikan: lx_certificates di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS certificates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id     INTEGER NOT NULL,
  course_title  TEXT NOT NULL,
  user_name     TEXT NOT NULL,
  credential_id TEXT UNIQUE NOT NULL,
  issued_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ══════════════════════════════════════════════
-- TABLE 6: notification_state
-- Menggantikan: lx_notificationState di localStorage
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notification_state (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notif_key   TEXT NOT NULL,  -- format: "{courseId}_{type}" e.g. "1_7days"
  shown_date  DATE NOT NULL,  -- tanggal terakhir notif ditampilkan (WIB)
  UNIQUE(user_id, notif_key)
);

-- ══════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Setiap user hanya bisa akses data miliknya sendiri
-- ══════════════════════════════════════════════

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_access       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_state  ENABLE ROW LEVEL SECURITY;

-- Users: hanya bisa lihat & update data sendiri
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid()::UUID);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid()::UUID);

-- Course access: hanya milik sendiri
CREATE POLICY "course_access_own" ON course_access
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Lesson progress: hanya milik sendiri
CREATE POLICY "lesson_progress_own" ON lesson_progress
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Quiz attempts: hanya milik sendiri
CREATE POLICY "quiz_attempts_own" ON quiz_attempts
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Certificates: hanya milik sendiri
CREATE POLICY "certificates_own" ON certificates
  FOR ALL USING (user_id = auth.uid()::UUID);

-- Notification state: hanya milik sendiri
CREATE POLICY "notification_state_own" ON notification_state
  FOR ALL USING (user_id = auth.uid()::UUID);

-- ══════════════════════════════════════════════
-- INDEXES — untuk performa query
-- ══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_course_access_user     ON course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_course_access_status   ON course_access(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user   ON lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user     ON quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_date     ON quiz_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_certificates_user      ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_state_user       ON notification_state(user_id);

-- ══════════════════════════════════════════════
-- FUNCTION: auto update updated_at on users
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
