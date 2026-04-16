-- ══════════════════════════════════════════════
-- Migration: tabel community_posts
-- Jalankan di: Supabase > SQL Editor > New Query
-- ══════════════════════════════════════════════

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

-- Index
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id   ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created   ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tag       ON community_posts(tag);

-- RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Semua user bisa baca posts
CREATE POLICY "community_posts_public_read"
  ON community_posts FOR SELECT USING (true);

-- User hanya bisa insert post sendiri
CREATE POLICY "community_posts_user_insert"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User hanya bisa update/delete post sendiri
CREATE POLICY "community_posts_user_update"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "community_posts_user_delete"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bisa update (untuk likes counter)
CREATE POLICY "community_posts_service_update"
  ON community_posts FOR UPDATE
  USING (true);

-- Tabel likes untuk tracking siapa yang like
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
