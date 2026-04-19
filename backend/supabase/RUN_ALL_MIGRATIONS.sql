-- ══════════════════════════════════════════════
-- JALANKAN SEMUA MIGRATIONS SEKALIGUS
-- Copy-paste SEMUA SQL ini ke Supabase SQL Editor
-- Klik RUN satu kali saja
-- ══════════════════════════════════════════════

-- MIGRATION 1: Course student count function
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

-- MIGRATION 2: Profile fields
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS bio      TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS website  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github   TEXT DEFAULT '';

-- MIGRATION 3: Lesson points tracking
CREATE TABLE IF NOT EXISTS lesson_points_awarded (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id  INTEGER NOT NULL,
  lesson_id  TEXT NOT NULL,
  points     INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_points_user_course_lesson 
ON lesson_points_awarded(user_id, course_id, lesson_id);

ALTER TABLE lesson_points_awarded ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson points"
  ON lesson_points_awarded FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert lesson points"
  ON lesson_points_awarded FOR INSERT
  WITH CHECK (true);

-- MIGRATION 4: Quiz points tracking
CREATE TABLE IF NOT EXISTS quiz_points_awarded (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id    TEXT NOT NULL,
  points     INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_points_user_quiz 
ON quiz_points_awarded(user_id, quiz_id);

ALTER TABLE quiz_points_awarded ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz points"
  ON quiz_points_awarded FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert quiz points"
  ON quiz_points_awarded FOR INSERT
  WITH CHECK (true);

-- MIGRATION 5: Notifications table
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

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- MIGRATION 6: Payment tables
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
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_sessions_user ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(stripe_subscription_id);

ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_sessions_own" ON payment_sessions
  FOR ALL USING (user_id = auth.uid()::UUID);

CREATE POLICY "payments_own" ON payments
  FOR ALL USING (user_id = auth.uid()::UUID);

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

CREATE POLICY "community_posts_public_read"
  ON community_posts FOR SELECT USING (true);

CREATE POLICY "community_posts_user_insert"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_posts_user_update"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "community_posts_user_delete"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "community_posts_service_update"
  ON community_posts FOR UPDATE
  USING (true);

CREATE TABLE IF NOT EXISTS community_likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_likes_read"   ON community_likes FOR SELECT USING (true);
CREATE POLICY "community_likes_insert" ON community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_likes_delete" ON community_likes FOR DELETE USING (auth.uid() = user_id);

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

CREATE POLICY "lesson_discussions_select" ON lesson_discussions
  FOR SELECT USING (true);

CREATE POLICY "lesson_discussions_insert" ON lesson_discussions
  FOR INSERT WITH CHECK (user_id = auth.uid()::UUID);

CREATE POLICY "lesson_discussions_delete" ON lesson_discussions
  FOR DELETE USING (user_id = auth.uid()::UUID);

CREATE POLICY "lesson_discussion_likes_all" ON lesson_discussion_likes
  FOR ALL USING (user_id = auth.uid()::UUID);

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

CREATE POLICY "bookmarks_own"           ON bookmarks           FOR ALL USING (user_id = auth.uid()::UUID);
CREATE POLICY "playground_sessions_own" ON playground_sessions FOR ALL USING (user_id = auth.uid()::UUID);
CREATE POLICY "user_preferences_own"    ON user_preferences    FOR ALL USING (user_id = auth.uid()::UUID);

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

CREATE POLICY "module_quiz_passed_own" ON module_quiz_passed
  FOR ALL USING (user_id = auth.uid()::UUID);

CREATE INDEX IF NOT EXISTS idx_module_quiz_passed_user
  ON module_quiz_passed(user_id, course_id);

-- ══════════════════════════════════════════════
-- SELESAI! Semua migrations sudah dijalankan
-- ══════════════════════════════════════════════
