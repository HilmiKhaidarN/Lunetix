-- ══════════════════════════════════════════════
-- QUERY UNTUK CEK SEMUA TABEL DI SUPABASE
-- Copy-paste query ini ke Supabase SQL Editor
-- ══════════════════════════════════════════════

-- 1. CEK SEMUA TABEL (harus ada 22 tabel)
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected tables:
-- 1. bookmarks
-- 2. certificates
-- 3. community_likes
-- 4. community_posts
-- 5. course_access
-- 6. courses
-- 7. lesson_discussion_likes
-- 8. lesson_discussions
-- 9. lesson_points_awarded
-- 10. lesson_progress
-- 11. module_quiz_passed
-- 12. notification_state
-- 13. notifications
-- 14. payment_sessions
-- 15. payments
-- 16. playground_sessions
-- 17. quiz_attempts
-- 18. quiz_points_awarded
-- 19. user_preferences
-- 20. users
-- 21. video_lessons
-- 22. video_progress

-- ══════════════════════════════════════════════
-- 2. CEK KOLOM TABEL USERS (pastikan account_type support 'admin')
-- ══════════════════════════════════════════════
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ══════════════════════════════════════════════
-- 3. CEK CONSTRAINT account_type
-- ══════════════════════════════════════════════
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND conname LIKE '%account_type%';

-- Expected: CHECK (account_type IN ('free', 'pro', 'admin'))

-- ══════════════════════════════════════════════
-- 4. CEK JUMLAH DATA DI SETIAP TABEL
-- ══════════════════════════════════════════════
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'course_access', COUNT(*) FROM course_access
UNION ALL
SELECT 'lesson_progress', COUNT(*) FROM lesson_progress
UNION ALL
SELECT 'quiz_attempts', COUNT(*) FROM quiz_attempts
UNION ALL
SELECT 'certificates', COUNT(*) FROM certificates
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'community_posts', COUNT(*) FROM community_posts
UNION ALL
SELECT 'video_lessons', COUNT(*) FROM video_lessons
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
ORDER BY table_name;

-- ══════════════════════════════════════════════
-- 5. CEK RLS POLICIES (Row Level Security)
-- ══════════════════════════════════════════════
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ══════════════════════════════════════════════
-- 6. CEK INDEXES
-- ══════════════════════════════════════════════
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ══════════════════════════════════════════════
-- 7. CEK FOREIGN KEYS
-- ══════════════════════════════════════════════
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ══════════════════════════════════════════════
-- 8. CEK FUNCTIONS
-- ══════════════════════════════════════════════
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_course_student_counts', 'update_updated_at')
ORDER BY routine_name;

-- ══════════════════════════════════════════════
-- 9. QUICK HEALTH CHECK
-- ══════════════════════════════════════════════
DO $$ 
DECLARE
  table_count INTEGER;
  expected_count INTEGER := 22;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  IF table_count = expected_count THEN
    RAISE NOTICE '✅ SUCCESS: Found % tables (expected %)', table_count, expected_count;
  ELSE
    RAISE WARNING '⚠️ WARNING: Found % tables, expected %', table_count, expected_count;
  END IF;
END $$;
