// ══════════════════════════════════════════════
// ADVANCED ANALYTICS CONTROLLER
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

// GET /api/analytics/advanced
async function getAdvancedAnalytics(req, res) {
  const userId = req.user.id;

  try {
    // Parallel queries untuk performa
    const [
      learningStats,
      timeAnalytics,
      performanceMetrics,
      streakAnalytics,
      courseProgress,
      skillsProgress
    ] = await Promise.all([
      getLearningStats(userId),
      getTimeAnalytics(userId),
      getPerformanceMetrics(userId),
      getStreakAnalytics(userId),
      getCourseProgressAnalytics(userId),
      getSkillsProgress(userId)
    ]);

    return res.json({
      learningStats,
      timeAnalytics,
      performanceMetrics,
      streakAnalytics,
      courseProgress,
      skillsProgress,
      recommendations: await generateRecommendations(userId)
    });

  } catch (error) {
    console.error('[Analytics] Advanced analytics error:', error);
    return res.status(500).json({ error: 'Failed to get advanced analytics.' });
  }
}

async function getLearningStats(userId) {
  // Total learning time, sessions, etc.
  const { data: videoProgress } = await supabase
    .from('video_progress')
    .select('watch_time, created_at')
    .eq('user_id', userId);

  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('completed_at')
    .eq('user_id', userId);

  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('attempted_at, score')
    .eq('user_id', userId);

  const totalVideoTime = videoProgress?.reduce((sum, v) => sum + (v.watch_time || 0), 0) || 0;
  const totalLessons = lessonProgress?.length || 0;
  const totalQuizzes = quizAttempts?.length || 0;
  const avgQuizScore = quizAttempts?.length 
    ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
    : 0;

  return {
    totalVideoTime: Math.round(totalVideoTime / 60), // in minutes
    totalLessons,
    totalQuizzes,
    avgQuizScore,
    totalSessions: (videoProgress?.length || 0) + (lessonProgress?.length || 0)
  };
}

async function getTimeAnalytics(userId) {
  // Learning time per day/week/month
  const { data: activities } = await supabase
    .from('lesson_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  // Group by day
  const dailyActivity = {};
  activities?.forEach(activity => {
    const date = new Date(activity.completed_at).toISOString().split('T')[0];
    dailyActivity[date] = (dailyActivity[date] || 0) + 1;
  });

  // Get last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    last7Days.push({
      date,
      activity: dailyActivity[date] || 0
    });
  }

  return {
    dailyActivity: last7Days,
    weeklyTotal: last7Days.reduce((sum, day) => sum + day.activity, 0),
    mostActiveDay: last7Days.reduce((max, day) => day.activity > max.activity ? day : max, last7Days[0])
  };
}

async function getPerformanceMetrics(userId) {
  // Quiz performance over time
  const { data: quizzes } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, score, attempted_at')
    .eq('user_id', userId)
    .order('attempted_at');

  // Group by quiz and get best scores
  const quizPerformance = {};
  quizzes?.forEach(quiz => {
    if (!quizPerformance[quiz.quiz_id]) {
      quizPerformance[quiz.quiz_id] = {
        attempts: 0,
        bestScore: 0,
        scores: []
      };
    }
    quizPerformance[quiz.quiz_id].attempts++;
    quizPerformance[quiz.quiz_id].bestScore = Math.max(quizPerformance[quiz.quiz_id].bestScore, quiz.score);
    quizPerformance[quiz.quiz_id].scores.push(quiz.score);
  });

  // Calculate improvement trend
  const improvementTrend = Object.values(quizPerformance).map(perf => {
    if (perf.scores.length < 2) return 0;
    const first = perf.scores[0];
    const last = perf.scores[perf.scores.length - 1];
    return last - first;
  });

  const avgImprovement = improvementTrend.length 
    ? Math.round(improvementTrend.reduce((sum, imp) => sum + imp, 0) / improvementTrend.length)
    : 0;

  return {
    quizPerformance,
    avgImprovement,
    totalAttempts: quizzes?.length || 0,
    strongSubjects: Object.entries(quizPerformance)
      .filter(([_, perf]) => perf.bestScore >= 80)
      .map(([quizId]) => quizId),
    needsImprovement: Object.entries(quizPerformance)
      .filter(([_, perf]) => perf.bestScore < 60)
      .map(([quizId]) => quizId)
  };
}

async function getStreakAnalytics(userId) {
  // Detailed streak analysis
  const { data: activities } = await supabase
    .from('lesson_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .order('completed_at');

  if (!activities?.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakHistory: [],
      streakCalendar: {}
    };
  }

  // Calculate streaks
  const dates = activities.map(a => new Date(a.completed_at).toISOString().split('T')[0]);
  const uniqueDates = [...new Set(dates)].sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Check if streak is current
  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    currentStreak = 1;
    
    // Count backwards from today/yesterday
    const startDate = uniqueDates.includes(today) ? today : yesterday;
    const startIndex = uniqueDates.indexOf(startDate);
    
    for (let i = startIndex - 1; i >= 0; i--) {
      const currentDate = new Date(uniqueDates[i + 1]);
      const prevDate = new Date(uniqueDates[i]);
      const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const prevDate = new Date(uniqueDates[i - 1]);
    const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Create calendar data (last 90 days)
  const streakCalendar = {};
  for (let i = 89; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    streakCalendar[date] = dates.filter(d => d === date).length;
  }

  return {
    currentStreak,
    longestStreak,
    streakCalendar,
    totalActiveDays: uniqueDates.length
  };
}

async function getCourseProgressAnalytics(userId) {
  // Detailed course progress
  const { data: courseAccess } = await supabase
    .from('course_access')
    .select('course_id, claimed_at')
    .eq('user_id', userId);

  if (!courseAccess?.length) {
    return { courses: [] };
  }

  const courseAnalytics = [];

  for (const access of courseAccess) {
    const courseId = access.course_id;

    // Get lesson progress
    const { data: lessons } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    // Get video progress
    const { data: videos } = await supabase
      .from('video_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    // Get quiz attempts for this course
    const { data: quizzes } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId);

    const courseQuizzes = quizzes?.filter(q => {
      // Map quiz IDs to courses (simplified)
      const quizCourseMap = {
        'ml-basics': 1,
        'python-ai': 2,
        'dl-basics': 3,
        'nlp-basics': 4,
        'cv-basics': 5
      };
      return quizCourseMap[q.quiz_id] === courseId;
    }) || [];

    courseAnalytics.push({
      courseId,
      lessonsCompleted: lessons?.length || 0,
      videosWatched: videos?.filter(v => v.completed).length || 0,
      totalVideoTime: Math.round((videos?.reduce((sum, v) => sum + (v.watch_time || 0), 0) || 0) / 60),
      quizzesTaken: courseQuizzes.length,
      avgQuizScore: courseQuizzes.length 
        ? Math.round(courseQuizzes.reduce((sum, q) => sum + q.score, 0) / courseQuizzes.length)
        : 0,
      claimedAt: access.claimed_at,
      timeSpent: calculateCourseTimeSpent(lessons, videos)
    });
  }

  return { courses: courseAnalytics };
}

async function getSkillsProgress(userId) {
  // Skills assessment based on completed content
  const { data: quizzes } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, score')
    .eq('user_id', userId);

  const skillsMap = {
    'Machine Learning': ['ml-basics'],
    'Python Programming': ['python-ai'],
    'Deep Learning': ['dl-basics'],
    'Natural Language Processing': ['nlp-basics'],
    'Computer Vision': ['cv-basics']
  };

  const skills = {};

  Object.entries(skillsMap).forEach(([skill, quizIds]) => {
    const relevantQuizzes = quizzes?.filter(q => quizIds.includes(q.quiz_id)) || [];
    const avgScore = relevantQuizzes.length
      ? Math.round(relevantQuizzes.reduce((sum, q) => sum + q.score, 0) / relevantQuizzes.length)
      : 0;

    let level = 'Beginner';
    if (avgScore >= 90) level = 'Expert';
    else if (avgScore >= 75) level = 'Advanced';
    else if (avgScore >= 60) level = 'Intermediate';

    skills[skill] = {
      score: avgScore,
      level,
      quizzesTaken: relevantQuizzes.length
    };
  });

  return skills;
}

async function generateRecommendations(userId) {
  // AI-powered learning recommendations
  const { data: user } = await supabase
    .from('users')
    .select('account_type')
    .eq('id', userId)
    .single();

  const { data: quizzes } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, score')
    .eq('user_id', userId);

  const recommendations = [];

  // Analyze weak areas
  const weakQuizzes = quizzes?.filter(q => q.score < 60) || [];
  if (weakQuizzes.length > 0) {
    recommendations.push({
      type: 'improvement',
      title: 'Focus on Weak Areas',
      description: 'Retake quizzes where you scored below 60% to strengthen your understanding.',
      action: 'Review Content',
      priority: 'high'
    });
  }

  // Suggest next course
  const completedCourses = new Set();
  quizzes?.forEach(q => {
    if (q.score >= 70) {
      const courseMap = { 'ml-basics': 1, 'python-ai': 2, 'dl-basics': 3, 'nlp-basics': 4, 'cv-basics': 5 };
      const courseId = courseMap[q.quiz_id];
      if (courseId) completedCourses.add(courseId);
    }
  });

  if (completedCourses.has(1) && !completedCourses.has(3)) {
    recommendations.push({
      type: 'next_course',
      title: 'Ready for Deep Learning',
      description: 'You\'ve mastered ML basics. Time to dive into Deep Learning!',
      action: 'Start Course',
      priority: 'medium'
    });
  }

  // Streak motivation
  const { data: recentActivity } = await supabase
    .from('lesson_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .gte('completed_at', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString());

  if (!recentActivity?.length) {
    recommendations.push({
      type: 'motivation',
      title: 'Keep Your Streak Alive',
      description: 'You haven\'t studied in 2 days. Complete a lesson to maintain your progress!',
      action: 'Study Now',
      priority: 'medium'
    });
  }

  return recommendations;
}

function calculateCourseTimeSpent(lessons, videos) {
  // Estimate time spent on course
  const lessonTime = (lessons?.length || 0) * 15; // 15 min per lesson
  const videoTime = Math.round((videos?.reduce((sum, v) => sum + (v.watch_time || 0), 0) || 0) / 60);
  return lessonTime + videoTime;
}

module.exports = {
  getAdvancedAnalytics
};