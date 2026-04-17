// ══════════════════════════════════════════════
// BOOKMARKS CONTROLLER
// ══════════════════════════════════════════════
const supabase = require('../config/supabase');

// GET /api/bookmarks
async function getBookmarks(req, res) {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ bookmarks: data });
}

// POST /api/bookmarks
async function addBookmark(req, res) {
  const userId = req.user.id;
  const { item_id, item_type, title, sub, category, icon, icon_color, icon_bg, thumb_bg, type_color, type_bg, progress } = req.body;
  if (!item_id || !item_type || !title) return res.status(400).json({ error: 'item_id, item_type, title wajib diisi.' });

  const { data, error } = await supabase
    .from('bookmarks')
    .upsert({ user_id: userId, item_id, item_type, title, sub: sub||'', category: category||'', icon: icon||'bookmark', icon_color: icon_color||'#a78bfa', icon_bg: icon_bg||'rgba(124,58,237,0.15)', thumb_bg: thumb_bg||'linear-gradient(135deg,#1e1b4b,#312e81)', type_color: type_color||'#a78bfa', type_bg: type_bg||'rgba(124,58,237,0.2)', progress: progress||0 }, { onConflict: 'user_id,item_id,item_type' })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ bookmark: data });
}

// DELETE /api/bookmarks/:id
async function removeBookmark(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', userId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

module.exports = { getBookmarks, addBookmark, removeBookmark };
