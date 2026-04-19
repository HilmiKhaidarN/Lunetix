const supabase = require('../config/supabase');

// GET /api/notifications
async function getNotifications(req, res) {
  const userId = req.user.id;
  const { limit = 20, offset = 0 } = req.query;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ notifications: data });
}

// PUT /api/notifications/read-all
async function markAllRead(req, res) {
  const userId = req.user.id;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ success: true });
}

// PUT /api/notifications/:id/read
async function markOneRead(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ success: true });
}

// Helper: buat notifikasi sistem (dipanggil dari controller lain)
async function createNotification(userId, { icon, iconBg, iconColor, text }) {
  await supabase.from('notifications').insert({
    user_id:    userId,
    icon:       icon       || 'bell',
    icon_bg:    iconBg     || 'rgba(124,58,237,0.15)',
    icon_color: iconColor  || '#a78bfa',
    text,
  });
}

module.exports = { getNotifications, markAllRead, markOneRead, createNotification };
