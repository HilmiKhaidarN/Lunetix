-- ══════════════════════════════════════════════
-- JALANKAN MIGRATIONS YANG BELUM ADA SAJA
-- Untuk database yang sudah partial setup
-- ══════════════════════════════════════════════

-- Drop existing policies jika ada konflik (opsional, hati-hati!)
-- DROP POLICY IF EXISTS "Users can view own lesson points" ON lesson_points_awarded;
-- DROP POLICY IF EXISTS "Service role can insert lesson points" ON lesson_points_awarded;

-- MIGRATION 1: Course student count function (safe to re-run)
CREATE OR REPLACE FUNCTION get_course_student_counts()
RETURNS TABLE (course_id INTEGER, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    course_id::INTEGER,
    COUNT(*)::BIGINT as count
  FROM course_access
  GROUP BY course_id;
$$;

GRANT EXECUTE ON FUNCTION get_course_student_counts() TO anon;
GRANT EXECUTE ON FUNCTION get_course_student_counts() TO authenticated;

-- MIGRATION 2: Profile fields (safe to re-run)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS bio      TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS website  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github   TEXT DEFAULT '';

-- MIGRATION 3: Lesson points tracking
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'lesson_points_awarded') THEN
    CREATE TABLE lesson_points_awarded (
      id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id  INTEGER NOT NULL,
      lesson_id  TEXT NOT NULL,
      points     INTEGER NOT NULL,
      awarded_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, course_id, lesson_id)
    );

    CREATE INDEX idx_lesson_points_user_course_lesson 
    ON lesson_points_awarded(user_id, course_id, lesson_id);

    ALTER TABLE lesson_points_awarded ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lesson_points_awarded' 
    AND policyname = 'Users can view own lesson points'
  ) THEN
    CREATE POLICY "Users can view own lesson points"
      ON lesson_points_awarded FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lesson_points_awarded' 
    AND policyname = 'Service role can insert lesson points'
  ) THEN
    CREATE POLICY "Service role can insert lesson points"
      ON lesson_points_awarded FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- MIGRATION 4: Quiz points tracking
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'quiz_points_awarded') THEN
    CREATE TABLE quiz_points_awarded (
      id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_id    TEXT NOT NULL,
      points     INTEGER NOT NULL,
      awarded_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, quiz_id)
    );

    CREATE INDEX idx_quiz_points_user_quiz 
    ON quiz_points_awarded(user_id, quiz_id);

    ALTER TABLE quiz_points_awarded ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_points_awarded' 
    AND policyname = 'Users can view own quiz points'
  ) THEN
    CREATE POLICY "Users can view own quiz points"
      ON quiz_points_awarded FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_points_awarded' 
    AND policyname = 'Service role can insert quiz points'
  ) THEN
    CREATE POLICY "Service role can insert quiz points"
      ON quiz_points_awarded FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- MIGRATION 5: Notifications (safe to re-run structure)
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT DEFAULT 'general',
  icon       TEXT NOT NULL DEFAULT 'bell',
  icon_bg    TEXT NOT NULL DEFAULT 'rgba(124,58,237,0.15)',
  icon_color TEXT NOT NULL DEFAULT '#a78bfa',
  text       TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- MIGRATION 6: Payment tables (safe to re-run structure)
CREATE TABLE IF NOT EXISTS payment_sessions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id            TEXT UNIQUE NOT NULL,
  plan_id               TEXT NOT NULL,
  amount                INTEGER NOT NULL,
  currency              TEXT DEFAULT 'idr',
  status                TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  completed_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS payments (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id  TEXT,
  stripe_subscription_id    TEXT,
  amount                    INTEGER NOT NULL,
  currency                  TEXT DEFAULT 'idr',
  status                    TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending', 'refunded')),
  plan_id                   TEXT NOT NULL,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_sessions_user ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(stripe_subscription_id);

ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- MIGRATION 7: Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '',
  tag         TEXT NOT NULL DEFAULT 'General',
  tag_color   TEXT DEFAULT '#a78bfa',
  tag_bg      TEXT DEFAULT 'rgba(124,58,237,0.15)',
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  likes       INTEGER DEFAULT 0,
  replies     INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id   ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created   ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tag       ON community_posts(tag);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS community_likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- MIGRATION 8: Lesson discussions
CREATE TABLE IF NOT EXISTS lesson_discussions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL,
  lesson_id    TEXT NOT NULL,
  parent_id    UUID REFERENCES lesson_discussions(id) ON DELETE CASCADE,
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

ALTER TABLE lesson_discussions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_discussion_likes  ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_lesson_disc_lesson
  ON lesson_discussions(course_id, lesson_id, parent_id, created_at);

CREATE INDEX IF NOT EXISTS idx_lesson_disc_likes
  ON lesson_discussion_likes(post_id, user_id);

-- MIGRATION 9: Bookmarks, Playground, Preferences
CREATE TABLE IF NOT EXISTS bookmarks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL,
  item_type    TEXT NOT NULL,
  title        TEXT NOT NULL,
  sub          TEXT DEFAULT '',
  category     TEXT DEFAULT '',
  icon         TEXT DEFAULT 'bookmark',
  icon_color   TEXT DEFAULT '#a78bfa',
  icon_bg      TEXT DEFAULT 'rgba(124,58,237,0.15)',
  thumb_bg     TEXT DEFAULT 'linear-gradient(135deg,#1e1b4b,#312e81)',
  type_color   TEXT DEFAULT '#a78bfa',
  type_bg      TEXT DEFAULT 'rgba(124,58,237,0.2)',
  progress     INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

CREATE TABLE IF NOT EXISTS playground_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  model        TEXT DEFAULT 'gpt4o',
  messages     JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pref_key     TEXT NOT NULL,
  pref_value   JSONB,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pref_key)
);

ALTER TABLE bookmarks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE playground_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences    ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bookmarks_user       ON bookmarks(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_playground_user      ON playground_sessions(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user      ON user_preferences(user_id, pref_key);

-- MIGRATION 10: Module quiz passed
CREATE TABLE IF NOT EXISTS module_quiz_passed (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL,
  module_index INTEGER NOT NULL,
  best_score   INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
  passed_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, module_index)
);

ALTER TABLE module_quiz_passed ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_module_quiz_passed_user
  ON module_quiz_passed(user_id, course_id);

-- ══════════════════════════════════════════════
-- SELESAI! Migrations yang belum ada sudah dibuat
-- ══════════════════════════════════════════════
