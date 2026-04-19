// ══════════════════════════════════════════════
// VIDEO LESSONS CONTROLLER
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

// GET /api/video-lessons/:courseId
async function getVideoLessons(req, res) {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Check if user has access to this course
    const { data: access } = await supabase
      .from('course_access')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (!access) {
      return res.status(403).json({ error: 'Course access required.' });
    }

    // Get video lessons for this course
    const { data: lessons, error } = await supabase
      .from('video_lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get user's video progress
    const { data: progress } = await supabase
      .from('video_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    // Merge progress data with lessons
    const lessonsWithProgress = lessons.map(lesson => {
      const userProgress = progress?.find(p => p.lesson_id === lesson.id);
      return {
        ...lesson,
        watched: !!userProgress,
        watchTime: userProgress?.watch_time || 0,
        completed: userProgress?.completed || false,
        lastWatchedAt: userProgress?.last_watched_at
      };
    });

    return res.json({ lessons: lessonsWithProgress });

  } catch (error) {
    console.error('[VideoLessons] Get lessons error:', error);
    return res.status(500).json({ error: 'Failed to get video lessons.' });
  }
}

// POST /api/video-lessons/:courseId/:lessonId/progress
async function updateVideoProgress(req, res) {
  const { courseId, lessonId } = req.params;
  const { watchTime, duration, completed } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (typeof watchTime !== 'number' || watchTime < 0) {
      return res.status(400).json({ error: 'Invalid watch time.' });
    }

    // Check course access
    const { data: access } = await supabase
      .from('course_access')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (!access) {
      return res.status(403).json({ error: 'Course access required.' });
    }

    // Verify lesson exists
    const { data: lesson } = await supabase
      .from('video_lessons')
      .select('id, duration')
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .single();

    if (!lesson) {
      return res.status(404).json({ error: 'Video lesson not found.' });
    }

    // Calculate completion based on watch time (80% threshold)
    const isCompleted = completed || (watchTime >= (lesson.duration * 0.8));

    // Upsert progress
    const { data: progressData, error } = await supabase
      .from('video_progress')
      .upsert({
        user_id: userId,
        course_id: parseInt(courseId),
        lesson_id: lessonId,
        watch_time: watchTime,
        completed: isCompleted,
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id,lesson_id'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Award points for first completion
    if (isCompleted && !progressData.completed) {
      const points = 25; // Points per video lesson
      await supabase.rpc('add_user_points', {
        p_user_id: userId,
        p_points: points,
        p_source: 'video_lesson',
        p_source_id: `${courseId}_${lessonId}`
      });
    }

    return res.json({
      success: true,
      progress: progressData,
      pointsAwarded: isCompleted && !progressData.completed ? 25 : 0
    });

  } catch (error) {
    console.error('[VideoLessons] Update progress error:', error);
    return res.status(500).json({ error: 'Failed to update video progress.' });
  }
}

// GET /api/video-lessons/:courseId/stats
async function getVideoStats(req, res) {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Get total lessons count
    const { count: totalLessons } = await supabase
      .from('video_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    // Get completed lessons count
    const { count: completedLessons } = await supabase
      .from('video_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('completed', true);

    // Get total watch time
    const { data: progressData } = await supabase
      .from('video_progress')
      .select('watch_time')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    const totalWatchTime = progressData?.reduce((sum, p) => sum + (p.watch_time || 0), 0) || 0;

    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return res.json({
      totalLessons: totalLessons || 0,
      completedLessons: completedLessons || 0,
      progressPercentage,
      totalWatchTime: Math.round(totalWatchTime), // in seconds
      totalWatchTimeFormatted: formatDuration(totalWatchTime)
    });

  } catch (error) {
    console.error('[VideoLessons] Get stats error:', error);
    return res.status(500).json({ error: 'Failed to get video stats.' });
  }
}

// Helper function to format duration
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

module.exports = {
  getVideoLessons,
  updateVideoProgress,
  getVideoStats
};