-- ══════════════════════════════════════════════
-- Migration: tambah kolom profil ke tabel users
-- Jalankan di: Supabase > SQL Editor > New Query
-- ══════════════════════════════════════════════

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS bio      TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS website  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github   TEXT DEFAULT '';
