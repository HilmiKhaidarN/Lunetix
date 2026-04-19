-- ══════════════════════════════════════════════
-- Migration: tabel notifications per user
-- Jalankan di: Supabase > SQL Editor > New Query
-- ══════════════════════════════════════════════

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

-- Index untuk query cepat per user
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role bisa insert (untuk sistem generate notif)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
