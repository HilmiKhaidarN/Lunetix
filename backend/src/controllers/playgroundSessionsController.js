// ══════════════════════════════════════════════
// PLAYGROUND SESSIONS CONTROLLER
// ══════════════════════════════════════════════
const supabase = require('../config/supabase');

// GET /api/playground/sessions
async function getSessions(req, res) {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('playground_sessions')
    .select('id, title, model, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ sessions: data });
}

// POST /api/playground/sessions
async function createSession(req, res) {
  const userId = req.user.id;
  const { title, model, messages } = req.body;
  const { data, error } = await supabase
    .from('playground_sessions')
    .insert({ user_id: userId, title: (title||'New Session').slice(0,100), model: model||'gpt4o', messages: messages||[] })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ session: data });
}

// PUT /api/playground/sessions/:id
async function updateSession(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, messages } = req.body;
  const { error } = await supabase
    .from('playground_sessions')
    .update({ title: title?.slice(0,100), messages, updated_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', userId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

// DELETE /api/playground/sessions/:id
async function deleteSession(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabase.from('playground_sessions').delete().eq('id', id).eq('user_id', userId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

module.exports = { getSessions, createSession, updateSession, deleteSession };
