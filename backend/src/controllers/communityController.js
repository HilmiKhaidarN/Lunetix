const supabase = require('../config/supabase');

// Helper: sanitize HTML untuk prevent XSS
function sanitizeHtml(str) {
  if (!str) return str;
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// GET /api/community/stats
async function getStats(req, res) {
  try {
    // Hitung total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Hitung posts hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: postsToday } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());

    // Hitung total posts
    const { count: totalPosts } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true });

    return res.json({
      totalUsers:  totalUsers  || 0,
      postsToday:  postsToday  || 0,
      totalPosts:  totalPosts  || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// GET /api/community/posts
async function getPosts(req, res) {
  const { tag, limit = 20, offset = 0 } = req.query;

  let query = supabase
    .from('community_posts')
    .select('*, community_likes(user_id)')
    .order('created_at', { ascending: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  if (tag && tag !== 'all') {
    query = query.eq('tag', tag);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  // Tambahkan info apakah user sudah like
  const userId = req.user?.id;
  const posts = data.map(p => ({
    ...p,
    liked: userId ? p.community_likes.some(l => l.user_id === userId) : false,
    community_likes: undefined,
  }));

  return res.json({ posts });
}

// POST /api/community/posts
async function createPost(req, res) {
  const userId = req.user.id;
  const { tag, title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title dan body wajib diisi.' });
  }

  // Sanitize input untuk prevent XSS
  const sanitizedTitle = sanitizeHtml(title.trim());
  const sanitizedBody = sanitizeHtml(body.trim());

  if (sanitizedTitle.length > 120) {
    return res.status(400).json({ error: 'Title maksimal 120 karakter.' });
  }
  if (sanitizedBody.length > 5000) {
    return res.status(400).json({ error: 'Body maksimal 5000 karakter.' });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('name, avatar')
    .eq('id', userId)
    .single();

  const tagColors = {
    'Machine Learning': { color: '#a78bfa', bg: 'rgba(124,58,237,0.15)' },
    'Deep Learning':    { color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
    'NLP':              { color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
    'Computer Vision':  { color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
    'Data Science':     { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
    'General':          { color: '#a78bfa', bg: 'rgba(124,58,237,0.15)' },
  };
  const tc = tagColors[tag] || tagColors['General'];

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id:       userId,
      author_name:   profile?.name || 'User',
      author_avatar: profile?.avatar || '',
      tag:           tag || 'General',
      tag_color:     tc.color,
      tag_bg:        tc.bg,
      title:         sanitizedTitle,
      body:          sanitizedBody,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ post: { ...data, liked: false } });
}

// POST /api/community/posts/:id/like
async function toggleLike(req, res) {
  const userId = req.user.id;
  const { id: postId } = req.params;

  // Cek apakah sudah like
  const { data: existing } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', userId);
    // Hitung ulang likes setelah unlike
    const { count } = await supabase.from('community_likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    await supabase.from('community_posts').update({ likes: count || 0 }).eq('id', postId);
    return res.json({ liked: false });
  } else {
    // Like
    await supabase.from('community_likes').insert({ post_id: postId, user_id: userId });
    const { count } = await supabase.from('community_likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    await supabase.from('community_posts').update({ likes: count || 0 }).eq('id', postId);
    return res.json({ liked: true });
  }
}

// DELETE /api/community/posts/:id
async function deletePost(req, res) {
  const userId = req.user.id;
  const { id: postId } = req.params;

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

module.exports = { getStats, getPosts, createPost, toggleLike, deletePost };
