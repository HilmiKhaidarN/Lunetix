// ══════════════════════════════════════════════
// ADMIN CONTROLLER — Admin Dashboard & Management
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

// Middleware to check admin access
async function requireAdmin(req, res, next) {
  const userId = req.user.id;
  
  try {
    const { data: user } = await supabase
      .from('users')
      .select('email, account_type')
      .eq('id', userId)
      .single();

    // Check if user is admin (you can customize this logic)
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    const isAdmin = adminEmails.includes(user.email) || user.account_type === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify admin access.' });
  }
}

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  try {
    // Parallel queries for dashboard stats
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalQuizzes,
      totalPayments,
      recentUsers,
      topCourses,
      revenueStats
    ] = await Promise.all([
      getTotalUsers(),
      getActiveUsers(),
      getTotalCourses(),
      getTotalQuizzes(),
      getTotalPayments(),
      getRecentUsers(),
      getTopCourses(),
      getRevenueStats()
    ]);

    return res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalQuizzes,
        totalPayments
      },
      recentUsers,
      topCourses,
      revenueStats
    });

  } catch (error) {
    console.error('[Admin] Dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to get dashboard stats.' });
  }
}

async function getTotalUsers() {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getActiveUsers() {
  // Users who have activity in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: activeUserIds } = await supabase
    .from('lesson_progress')
    .select('user_id')
    .gte('completed_at', sevenDaysAgo);

  const uniqueActiveUsers = new Set(activeUserIds?.map(u => u.user_id) || []);
  return uniqueActiveUsers.size;
}

async function getTotalCourses() {
  // Count courses from static data (since courses are not in database)
  return 8; // We have 8 courses
}

async function getTotalQuizzes() {
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('quiz_id');
  
  const uniqueQuizzes = new Set(attempts?.map(a => a.quiz_id) || []);
  return uniqueQuizzes.size;
}

async function getTotalPayments() {
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded');

  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  return {
    count: payments?.length || 0,
    revenue: totalRevenue
  };
}

async function getRecentUsers() {
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, account_type, joined_at')
    .order('joined_at', { ascending: false })
    .limit(10);

  return users || [];
}

async function getTopCourses() {
  // Get course access counts
  const { data: courseAccess } = await supabase
    .from('course_access')
    .select('course_id');

  const courseCounts = {};
  courseAccess?.forEach(access => {
    courseCounts[access.course_id] = (courseCounts[access.course_id] || 0) + 1;
  });

  // Map to course names
  const courseNames = {
    1: 'Machine Learning Fundamentals',
    2: 'Python for AI',
    3: 'Deep Learning Essentials',
    4: 'Natural Language Processing',
    5: 'Computer Vision with Python',
    6: 'Data Science with AI',
    7: 'Reinforcement Learning',
    8: 'AI Ethics & Safety'
  };

  const topCourses = Object.entries(courseCounts)
    .map(([courseId, count]) => ({
      courseId: parseInt(courseId),
      name: courseNames[courseId] || `Course ${courseId}`,
      students: count
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 5);

  return topCourses;
}

async function getRevenueStats() {
  // Get payments by month
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'succeeded')
    .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at');

  // Group by month
  const monthlyRevenue = {};
  payments?.forEach(payment => {
    const month = new Date(payment.created_at).toISOString().slice(0, 7); // YYYY-MM
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
  });

  // Get last 6 months
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toISOString().slice(0, 7);
    const monthName = date.toLocaleDateString('en', { month: 'short', year: 'numeric' });
    
    last6Months.push({
      month: monthName,
      revenue: monthlyRevenue[month] || 0
    });
  }

  return last6Months;
}

// GET /api/admin/users
async function getUsers(req, res) {
  const { page = 1, limit = 20, search = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('users')
      .select('id, name, email, account_type, subscription_status, streak, points, joined_at, updated_at')
      .order('joined_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    return res.json({
      users: users || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('[Admin] Get users error:', error);
    return res.status(500).json({ error: 'Failed to get users.' });
  }
}

// PUT /api/admin/users/:id
async function updateUser(req, res) {
  const { id } = req.params;
  const { account_type, subscription_status, points, streak } = req.body;

  try {
    const updates = {};
    if (account_type) updates.account_type = account_type;
    if (subscription_status) updates.subscription_status = subscription_status;
    if (typeof points === 'number') updates.points = points;
    if (typeof streak === 'number') updates.streak = streak;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, user });

  } catch (error) {
    console.error('[Admin] Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user.' });
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'User deleted successfully.' });

  } catch (error) {
    console.error('[Admin] Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
}

// GET /api/admin/analytics
async function getAnalytics(req, res) {
  try {
    const [
      userGrowth,
      coursePopularity,
      quizPerformance,
      paymentAnalytics
    ] = await Promise.all([
      getUserGrowthAnalytics(),
      getCoursePopularityAnalytics(),
      getQuizPerformanceAnalytics(),
      getPaymentAnalytics()
    ]);

    return res.json({
      userGrowth,
      coursePopularity,
      quizPerformance,
      paymentAnalytics
    });

  } catch (error) {
    console.error('[Admin] Analytics error:', error);
    return res.status(500).json({ error: 'Failed to get analytics.' });
  }
}

async function getUserGrowthAnalytics() {
  // Get user registrations by day for last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: users } = await supabase
    .from('users')
    .select('joined_at')
    .gte('joined_at', thirtyDaysAgo)
    .order('joined_at');

  // Group by day
  const dailySignups = {};
  users?.forEach(user => {
    const date = new Date(user.joined_at).toISOString().split('T')[0];
    dailySignups[date] = (dailySignups[date] || 0) + 1;
  });

  // Fill missing days with 0
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    last30Days.push({
      date,
      signups: dailySignups[date] || 0
    });
  }

  return last30Days;
}

async function getCoursePopularityAnalytics() {
  const { data: courseAccess } = await supabase
    .from('course_access')
    .select('course_id, claimed_at');

  const courseStats = {};
  courseAccess?.forEach(access => {
    const courseId = access.course_id;
    if (!courseStats[courseId]) {
      courseStats[courseId] = { claims: 0, recentClaims: 0 };
    }
    courseStats[courseId].claims++;
    
    // Count recent claims (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (new Date(access.claimed_at).getTime() > sevenDaysAgo) {
      courseStats[courseId].recentClaims++;
    }
  });

  return courseStats;
}

async function getQuizPerformanceAnalytics() {
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, score, attempted_at');

  const quizStats = {};
  attempts?.forEach(attempt => {
    const quizId = attempt.quiz_id;
    if (!quizStats[quizId]) {
      quizStats[quizId] = { attempts: 0, totalScore: 0, scores: [] };
    }
    quizStats[quizId].attempts++;
    quizStats[quizId].totalScore += attempt.score;
    quizStats[quizId].scores.push(attempt.score);
  });

  // Calculate averages and pass rates
  Object.keys(quizStats).forEach(quizId => {
    const stats = quizStats[quizId];
    stats.avgScore = Math.round(stats.totalScore / stats.attempts);
    stats.passRate = Math.round((stats.scores.filter(s => s >= 70).length / stats.attempts) * 100);
  });

  return quizStats;
}

async function getPaymentAnalytics() {
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, plan_id, created_at, status');

  const analytics = {
    totalRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
    planBreakdown: {},
    monthlyRevenue: {}
  };

  payments?.forEach(payment => {
    if (payment.status === 'succeeded') {
      analytics.totalRevenue += payment.amount;
      analytics.successfulPayments++;
      
      // Plan breakdown
      const planId = payment.plan_id;
      if (!analytics.planBreakdown[planId]) {
        analytics.planBreakdown[planId] = { count: 0, revenue: 0 };
      }
      analytics.planBreakdown[planId].count++;
      analytics.planBreakdown[planId].revenue += payment.amount;
      
      // Monthly revenue
      const month = new Date(payment.created_at).toISOString().slice(0, 7);
      analytics.monthlyRevenue[month] = (analytics.monthlyRevenue[month] || 0) + payment.amount;
    } else {
      analytics.failedPayments++;
    }
  });

  return analytics;
}

module.exports = {
  requireAdmin,
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAnalytics
};