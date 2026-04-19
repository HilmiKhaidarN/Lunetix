-- ══════════════════════════════════════════════
-- LUNETIX LMS - DATABASE DEPLOYMENT ORDER
-- ══════════════════════════════════════════════
-- PENTING: Jalankan file SQL ini di Supabase SQL Editor
-- dengan urutan yang BENAR untuk menghindari error!
-- ══════════════════════════════════════════════

-- STEP 1: Jalankan schema utama (WAJIB PERTAMA)
-- File: backend/supabase/schema.sql
-- Membuat: users, course_access, lesson_progress, quiz_attempts, certificates, notification_state

-- STEP 2: Jalankan migrations dalam urutan ini:

-- 2.1 Courses table (diperlukan oleh banyak fitur)
-- File: backend/supabase/migrations/add_courses_table.sql

-- 2.2 Course student count function
-- File: backend/supabase/migrations/add_course_student_count_function.sql

-- 2.3 Profile fields
-- File: backend/supabase/migrations/add_profile_fields.sql

-- 2.4 Points tracking
-- File: backend/supabase/migrations/add_lesson_points_tracking.sql
-- File: backend/supabase/migrations/add_quiz_points_tracking.sql

-- 2.5 Notifications (HARUS SEBELUM payment_tables!)
-- File: backend/supabase/migrations/add_notifications_table.sql

-- 2.6 Payment system (membutuhkan notifications table)
-- File: backend/supabase/migrations/add_payment_tables.sql

-- 2.7 Video lessons
-- File: backend/supabase/migrations/add_video_lessons.sql

-- 2.8 Community features
-- File: backend/supabase/migrations/add_community_posts_table.sql
-- File: backend/supabase/migrations/add_lesson_discussions_table.sql

-- 2.9 User features
-- File: backend/supabase/migrations/add_bookmarks_playground_preferences.sql
-- File: backend/supabase/migrations/add_module_quiz_passed_table.sql

-- ══════════════════════════════════════════════
-- VERIFIKASI: Cek semua tabel sudah dibuat
-- ══════════════════════════════════════════════
-- Jalankan query ini untuk memastikan semua tabel ada:

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected tables (22 total):
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
-- TROUBLESHOOTING
-- ══════════════════════════════════════════════

-- Jika ada error "relation does not exist":
-- 1. Pastikan schema.sql sudah dijalankan
-- 2. Periksa urutan migration (notifications SEBELUM payment_tables)
-- 3. Jalankan ulang migration yang error

-- Jika ada error "constraint violation" untuk account_type:
-- 1. Pastikan schema.sql sudah diupdate dengan constraint baru
-- 2. Constraint sekarang: CHECK (account_type IN ('free', 'pro', 'admin'))

-- Jika ada error RLS policy:
-- 1. Pastikan auth.uid() berfungsi
-- 2. Gunakan service_role key untuk operasi admin
