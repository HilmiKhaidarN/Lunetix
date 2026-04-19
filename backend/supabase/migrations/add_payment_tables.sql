-- ══════════════════════════════════════════════
-- PAYMENT SYSTEM TABLES
-- ══════════════════════════════════════════════

-- ── TABLE: payment_sessions ──
-- Menyimpan Stripe checkout sessions
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

-- ── TABLE: payments ──
-- Menyimpan history pembayaran
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

-- ── TABLE: notifications (extend existing) ──
-- Tambah kolom untuk payment notifications
-- NOTE: Jalankan migration add_notifications_table.sql SEBELUM file ini!
-- ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';

-- ── Update users table untuk subscription info ──
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(stripe_subscription_id);

-- ── RLS Policies ──
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_sessions_own" ON payment_sessions
  FOR ALL USING (user_id = auth.uid()::UUID);

CREATE POLICY "payments_own" ON payments
  FOR ALL USING (user_id = auth.uid()::UUID);