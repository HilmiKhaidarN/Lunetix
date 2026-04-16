// ══════════════════════════════════════════════
// LESSON DISCUSSION CONTROLLER
// Discussion per lesson (threaded: komentar + reply)
// ══════════════════════════════════════════════

const supabase = require('../config/supabase');

// GET /api/lesson-discussion/:courseId/:lessonId
// Ambil semua komentar + reply untuk satu lesson
async function getDiscussions(req, res) {
  const { courseId, lessonId } = req.params;
  const userId = req.user?.id;

  // Ambil semua post (komentar + reply) untuk lesson ini
  const { data, error } = await supabase
    .from('lesson_discussions')
    .select('*, lesson_discussion_likes(user_id)')
    .eq('course_id', parseInt(courseId))
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  // Pisahkan komentar (parent_id = null) dan reply
  const comments = [];
  const replyMap = {};

  data.forEach(post => {
    const liked = userId ? post.lesson_discussion_likes.some(l => l.user_id === userId) : false;
    const clean = { ...post, liked, lesson_discussion_likes: undefined };

    if (!post.parent_id) {
      clean.replies = [];
      comments.push(clean);
      replyMap[post.id] = clean;
    }
  });

  // Attach replies ke parent
  data.forEach(post => {
    if (post.parent_id && replyMap[post.parent_id]) {
      const liked = userId ? post.lesson_discussion_likes.some(l => l.user_id === userId) : false;
      replyMap[post.parent_id].replies.push({ ...post, liked, lesson_discussion_likes: undefined });
    }
  });

  return res.json({ comments, total: data.length });
}

// POST /api/lesson-discussion/:courseId/:lessonId
// Buat komentar baru atau reply
async function createComment(req, res) {
  const userId = req.user.id;
  const { courseId, lessonId } = req.params;
  const { body, parentId } = req.body;

  if (!body || !body.trim()) {
    return res.status(400).json({ error: 'Komentar tidak boleh kosong.' });
  }
  if (body.trim().length > 1000) {
    return res.status(400).json({ error: 'Komentar maksimal 1000 karakter.' });
  }

  // Cek akses kursus
  const { data: access } = await supabase
    .from('course_access')
    .select('status')
    .eq('user_id', userId)
    .eq('course_id', parseInt(courseId))
    .single();

  if (!access || access.status === 'expired') {
    return res.status(403).json({ error: 'Kamu belum memiliki akses ke kursus ini.' });
  }

  // Jika reply, pastikan parent ada dan bukan reply dari reply
  if (parentId) {
    const { data: parent } = await supabase
      .from('lesson_discussions')
      .select('id, parent_id')
      .eq('id', parentId)
      .single();

    if (!parent) return res.status(404).json({ error: 'Komentar parent tidak ditemukan.' });
    if (parent.parent_id) return res.status(400).json({ error: 'Tidak bisa reply ke reply.' });
  }

  // Ambil profil user
  const { data: profile } = await supabase
    .from('users')
    .select('name, avatar')
    .eq('id', userId)
    .single();

  const { data, error } = await supabase
    .from('lesson_discussions')
    .insert({
      user_id:       userId,
      course_id:     parseInt(courseId),
      lesson_id:     lessonId,
      parent_id:     parentId || null,
      author_name:   profile?.name || 'User',
      author_avatar: profile?.avatar || '',
      body:          body.trim(),
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ comment: { ...data, liked: false, replies: [] } });
}

// POST /api/lesson-discussion/:courseId/:lessonId/:postId/like
// Toggle like pada komentar atau reply
async function toggleLike(req, res) {
  const userId = req.user.id;
  const { postId } = req.params;

  // Cek apakah sudah like
  const { data: existing } = await supabase
    .from('lesson_discussion_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from('lesson_discussion_likes').delete()
      .eq('post_id', postId).eq('user_id', userId);
  } else {
    // Like
    await supabase.from('lesson_discussion_likes').insert({ post_id: postId, user_id: userId });
  }

  // Hitung ulang likes
  const { count } = await supabase
    .from('lesson_discussion_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  await supabase.from('lesson_discussions')
    .update({ likes: count || 0 })
    .eq('id', postId);

  return res.json({ liked: !existing, likes: count || 0 });
}

// DELETE /api/lesson-discussion/:courseId/:lessonId/:postId
// Hapus komentar/reply milik sendiri
async function deleteComment(req, res) {
  const userId = req.user.id;
  const { postId } = req.params;

  const { error } = await supabase
    .from('lesson_discussions')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
}

module.exports = { getDiscussions, createComment, toggleLike, deleteComment };
