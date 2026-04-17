// ══════════════════════════════════════════════
// USER PREFERENCES CONTROLLER
// Simpan preferensi user (last lesson, dll)
// ══════════════════════════════════════════════
const supabase = require('../config/supabase');

// GET /api/preferences/:key
async function getPreference(req, res) {
  const userId = req.user.id;
  const { key } = req.params;
  const { data, error } = await supabase
    .from('user_preferences')
    .select('pref_value')
    .eq('user_id', userId)
    .eq('pref_key', key)
    .single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  return res.json({ value: data?.pref_value ?? null });
}

// PUT /api/preferences/:key
async function setPreference(req, res) {
  const userId = req.user.id;
  const { key } = req.params;
  const { value } = req.body;
  const { error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: userId, pref_key: key, pref_value: value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,pref_key' });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

// GET /api/preferences (semua)
async function getAllPreferences(req, res) {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('user_preferences')
    .select('pref_key, pref_value')
    .eq('user_id', userId);
  if (error) return res.status(500).json({ error: error.message });
  const prefs = {};
  (data || []).forEach(p => { prefs[p.pref_key] = p.pref_value; });
  return res.json({ preferences: prefs });
}

module.exports = { getPreference, setPreference, getAllPreferences };
