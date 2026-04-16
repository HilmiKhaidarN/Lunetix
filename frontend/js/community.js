// -- COMMUNITY --

const trendingTags = ['#MachineLearning','#PyTorch','#BERT','#YOLOv8','#DataScience','#Python','#NLP','#CNN','#LLM','#RAG'];
let cmActiveFilter = 'all';

// Posts disimpan di localStorage sebagai cache, API sebagai sumber utama
function getPosts() { return store.get('posts', []); }
function savePosts(p) { store.set('posts', p); }

async function renderCommunity() {
  await renderCmStats();
  await renderFeed();
  renderLeaderboard();
  renderTrendingTags();
  const session = getSession();
  const av = document.getElementById('cm-post-avatar');
  if (av && session) av.textContent = session.avatar || session.name?.charAt(0) || 'U';
}

async function renderCmStats() {
  const el = document.getElementById('cm-stats-bar'); if (!el) return;

  // Tampilkan loading dulu
  el.innerHTML = `<div style="color:var(--text-muted);font-size:12px;padding:8px">Memuat statistik...</div>`;

  try {
    const data = await CommunityAPI.getStats();
    const stats = [
      { val: data.totalUsers.toLocaleString(), label:'Members',     trend:'Total pengguna',    icon:'users',          bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
      { val: data.postsToday.toLocaleString(), label:'Posts Today', trend:'Post hari ini',     icon:'message-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
      { val: data.totalPosts.toLocaleString(), label:'Total Posts', trend:'Semua diskusi',     icon:'zap',            bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
      { val: '—',                              label:'Challenges',  trend:'Segera hadir',      icon:'trophy',         bg:'rgba(16,185,129,0.15)', color:'#34d399' },
    ];
    el.innerHTML = stats.map(s => `
      <div class="cm-stat-card">
        <div class="cm-stat-icon" style="background:${s.bg}">
          <i data-lucide="${s.icon}" style="width:18px;height:18px;color:${s.color}"></i>
        </div>
        <div style="flex:1">
          <div class="cm-stat-val">${s.val}</div>
          <div class="cm-stat-label">${s.label}</div>
          <div class="cm-stat-trend">${s.trend}</div>
        </div>
      </div>`).join('');
  } catch (err) {
    // Fallback: sembunyikan stats jika API gagal
    el.innerHTML = '';
  }
  lucide.createIcons();
}

function filterCommunity(tag, btn) {
  document.querySelectorAll('.cm-ftab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  cmActiveFilter = tag;
  renderFeed();
}

async function renderFeed() {
  const feed = document.getElementById('community-feed'); if (!feed) return;
  feed.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px">Memuat posts...</div>`;

  try {
    const data = await CommunityAPI.getPosts(cmActiveFilter);
    const posts = data.posts;
    // Simpan ke cache
    savePosts(posts);

    if (!posts.length) {
      feed.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          <i data-lucide="message-circle" style="width:40px;height:40px;margin-bottom:12px;opacity:0.4"></i>
          <div style="font-size:14px;margin-bottom:8px">Belum ada post.</div>
          <div style="font-size:12px">Jadilah yang pertama berbagi!</div>
        </div>`;
      lucide.createIcons();
      return;
    }

    _renderPostsHTML(feed, posts);
  } catch (err) {
    // Fallback ke cache localStorage
    console.warn('[Community] API tidak tersedia, pakai cache.', err);
    const cached = getPosts();
    if (cached.length) {
      _renderPostsHTML(feed, cached);
    } else {
      feed.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px">Gagal memuat posts.</div>`;
    }
  }
}

function _renderPostsHTML(feed, posts) {
  const session = getSession();
  feed.innerHTML = posts.map(p => `
    <div class="cm-post-card" data-id="${p.id}">
      <div class="cm-post-header">
        <div class="cm-post-avatar" style="background:linear-gradient(135deg,#7c3aed,#9d5cf6)">${p.author_avatar || p.author_name?.charAt(0) || 'U'}</div>
        <div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="cm-post-author">${p.author_name}</span>
            <span class="cm-post-time">${timeAgo(p.created_at)}</span>
          </div>
        </div>
        <span class="cm-post-tag" style="background:${p.tag_bg};color:${p.tag_color}">${p.tag}</span>
        <div class="cm-post-actions-right">
          ${session && p.user_id === session.id
            ? `<button class="cm-post-icon-btn" onclick="deleteCommunityPost('${p.id}')"><i data-lucide="trash-2" style="width:14px;height:14px;color:var(--danger)"></i></button>`
            : `<button class="cm-post-icon-btn"><i data-lucide="bookmark" style="width:14px;height:14px"></i></button>`
          }
        </div>
      </div>
      <div class="cm-post-title">${p.title}</div>
      <div class="cm-post-body">${p.body.replace(/\n/g, '<br>')}</div>
      <div class="cm-post-footer">
        <button class="cm-post-action ${p.liked ? 'liked' : ''}" onclick="likePost('${p.id}')">
          <i data-lucide="heart" style="width:13px;height:13px"></i> ${p.likes}
        </button>
        <button class="cm-post-action">
          <i data-lucide="message-circle" style="width:13px;height:13px"></i> ${p.replies} Replies
        </button>
        <button class="cm-post-action">
          <i data-lucide="share-2" style="width:13px;height:13px"></i> Share
        </button>
      </div>
    </div>`).join('');
  lucide.createIcons();
}

async function likePost(id) {
  const session = getSession();
  if (!session) { showToast('Login dulu untuk like post.'); return; }
  try {
    const result = await CommunityAPI.toggleLike(id);
    // Update UI lokal
    const card = document.querySelector(`.cm-post-card[data-id="${id}"]`);
    if (card) {
      const btn = card.querySelector('.cm-post-action');
      const posts = getPosts();
      const p = posts.find(x => x.id === id);
      if (p) {
        p.liked = result.liked;
        p.likes += result.liked ? 1 : -1;
        savePosts(posts);
        btn.classList.toggle('liked', result.liked);
        btn.innerHTML = `<i data-lucide="heart" style="width:13px;height:13px"></i> ${p.likes}`;
        lucide.createIcons();
      }
    }
  } catch (err) {
    showToast('Gagal like post.');
  }
}

async function deleteCommunityPost(id) {
  if (!confirm('Hapus post ini?')) return;
  try {
    await CommunityAPI.deletePost(id);
    showToast('Post dihapus.');
    renderFeed();
  } catch (err) {
    showToast('Gagal menghapus post.');
  }
}

function renderLeaderboard() {
  const el = document.getElementById('leaderboard-list'); if (!el) return;
  el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Leaderboard akan segera hadir.</div>`;
}

function renderTrendingTags() {
  const el = document.getElementById('trending-tags'); if (!el) return;
  el.innerHTML = `<div class="cm-tag-grid">${trendingTags.map(t => `<span class="cm-tag">${t}</span>`).join('')}</div>`;
}

function showPostForm() {
  const f = document.getElementById('post-form'); if (!f) return;
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') document.getElementById('post-input')?.focus();
}

function hidePostForm() {
  const f = document.getElementById('post-form');
  if (f) f.style.display = 'none';
}

async function submitPost() {
  const input = document.getElementById('post-input');
  const tagEl = document.getElementById('post-tag');
  const body = input?.value.trim();
  if (!body) { showToast('Tulis sesuatu dulu!'); return; }

  const session = getSession();
  if (!session) { showToast('Login dulu untuk posting.'); return; }

  const tag = tagEl?.value || 'General';
  const title = body.split('\n')[0].slice(0, 80);

  try {
    await CommunityAPI.createPost({ tag, title, body });
    if (input) input.value = '';
    hidePostForm();
    showToast('Post berhasil dipublikasikan!');
    renderFeed();
    renderCmStats();
  } catch (err) {
    showToast('Gagal memposting. Coba lagi.');
  }
}
