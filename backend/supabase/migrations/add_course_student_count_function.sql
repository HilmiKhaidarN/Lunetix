-- ══════════════════════════════════════════════
-- MIGRATION: SQL Function untuk hitung student count per course
-- Optimasi query getAllCourses
-- ══════════════════════════════════════════════

-- Function untuk hitung jumlah students per course dengan GROUP BY
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

-- Grant execute permission ke anon role (untuk API calls)
GRANT EXECUTE ON FUNCTION get_course_student_counts() TO anon;
GRANT EXECUTE ON FUNCTION get_course_student_counts() TO authenticated;
