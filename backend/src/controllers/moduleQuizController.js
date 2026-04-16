// ══════════════════════════════════════════════
// MODULE QUIZ CONTROLLER
// Mengelola status lulus quiz per modul
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

// GET /api/module-quiz/:courseId/status
// Ambil semua modul yang sudah lulus untuk kursus ini
async function getModuleQuizStatus(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.courseId);

  if (!courseId) return res.status(400).json({ error: 'courseId tidak valid.' });

  const { data, error } = await supabase
    .from('module_quiz_passed')
    .select('module_index, best_score, passed_at')
    .eq('user_id', userId)
    .eq('course_id', courseId);

  if (error) return res.status(500).json({ error: error.message });

  // Ubah ke map: { moduleIndex: { bestScore, passedAt } }
  const passedMap = {};
  (data || []).forEach(row => {
    passedMap[row.module_index] = {
      passed: true,
      bestScore: row.best_score,
      passedAt: row.passed_at,
    };
  });

  return res.json({ courseId, passedMap });
}

// POST /api/module-quiz/:courseId/:moduleIndex/pass
// Tandai modul sebagai lulus (dipanggil setelah quiz modul lulus)
async function markModulePassed(req, res) {
  const userId = req.user.id;
  const courseId = parseInt(req.params.courseId);
  const moduleIndex = parseInt(req.params.moduleIndex);
  const { score } = req.body;

  if (!courseId || isNaN(moduleIndex)) {
    return res.status(400).json({ error: 'courseId atau moduleIndex tidak valid.' });
  }
  if (score === undefined || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Skor tidak valid (0-100).' });
  }

  // Upsert — jika sudah ada, update best_score jika lebih tinggi
  const { data: existing } = await supabase
    .from('module_quiz_passed')
    .select('id, best_score')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('module_index', moduleIndex)
    .single();

  if (existing) {
    // Update best_score jika skor baru lebih tinggi
    if (score > existing.best_score) {
      await supabase
        .from('module_quiz_passed')
        .update({ best_score: Math.round(score) })
        .eq('id', existing.id);
    }
    return res.json({ success: true, moduleIndex, score: Math.round(score), alreadyPassed: true });
  }

  // Insert baru
  const { error } = await supabase
    .from('module_quiz_passed')
    .insert({
      user_id: userId,
      course_id: courseId,
      module_index: moduleIndex,
      best_score: Math.round(score),
    });

  if (error) return res.status(500).json({ error: error.message });

  // Kirim notifikasi
  const { createNotification } = require('./notificationsController');
  createNotification(userId, {
    icon: 'check-circle',
    iconBg: 'rgba(16,185,129,0.15)',
    iconColor: '#34d399',
    text: `Quiz Modul ${moduleIndex + 1} kursus #${courseId} lulus! Skor: ${Math.round(score)}%.`,
  }).catch(() => {});

  return res.status(201).json({ success: true, moduleIndex, score: Math.round(score), alreadyPassed: false });
}

module.exports = { getModuleQuizStatus, markModulePassed };
