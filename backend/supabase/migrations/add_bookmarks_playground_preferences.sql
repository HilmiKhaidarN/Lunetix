-- ══════════════════════════════════════════════
-- MIGRATION: Bookmarks, Playground Sessions, User Preferences
-- Jalankan di Supabase SQL Editor
-- ══════════════════════════════════════════════

-- ── TABLE: bookmarks ──
CREATE TABLE IF NOT EXISTS bookmarks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL,        -- course id, lesson id, dll
  item_type    TEXT NOT NULL,        -- 'course', 'lesson', 'article', 'quiz'
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

-- ── TABLE: playground_sessions ──
CREATE TABLE IF NOT EXISTS playground_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  model        TEXT DEFAULT 'gpt4o',
  messages     JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE: user_preferences ──
CREATE TABLE IF NOT EXISTS user_preferences (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pref_key     TEXT NOT NULL,
  pref_value   JSONB,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pref_key)
);

-- RLS
ALTER TABLE bookmarks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE playground_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_own"           ON bookmarks           FOR ALL USING (user_id = auth.uid()::UUID);
CREATE POLICY "playground_sessions_own" ON playground_sessions FOR ALL USING (user_id = auth.uid()::UUID);
CREATE POLICY "user_preferences_own"    ON user_preferences    FOR ALL USING (user_id = auth.uid()::UUID);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user       ON bookmarks(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_playground_user      ON playground_sessions(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user      ON user_preferences(user_id, pref_key);
