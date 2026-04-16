// ══════════════════════════════════════════════
// LESSON DISCUSSION — Discussion per Lesson
// Threaded: komentar + reply 1 level
// ══════════════════════════════════════════════

let ldCourseId = null;
let ldLessonId = null;
let ldReplyingTo = null; // { id, authorName }

// ── Init: dipanggil saat lesson dibuka ──
function initLessonDiscussion(courseId, lessonId) {
  ldCourseId = courseId;
  ldLessonId = lessonId;
  ldReplyingTo = null;
  renderDiscussionPanel();
}

// ── Render panel discussion ──
async function renderDiscussionPanel() {
  const panel = document.getElementById('ld-panel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="ld-header">
      <div class="ld-title">
        <i data-lucide="message-circle" style="width:16px;height:16px;color:var(--accent-light)"></i>
        Diskusi Lesson
      </div>
      <span class="ld-count" id="ld-count">...</span>
    </div>

    <!-- Form komentar baru -->
    <div class="ld-compose" id="ld-compose">
      <div class="ld-compose-avatar" id="ld-compose-avatar">?</div>
      <div class="ld-compose-body">
        <div class="ld-reply-to" id="ld-reply-to" style="display:none"></div>
        <textarea class="ld-textarea" id="ld-textarea"
          placeholder="Tulis pertanyaan atau komentar tentang lesson ini..."
          rows="3" oninput="ldAutoResize(this)"></textarea>
        <div class="ld-compose-actions">
          <button class="ld-cancel-reply" id="ld-cancel-reply" style="display:none" onclick="ldCancelReply()">
            Batal Reply
          </button>
          <button class="btn btn-primary" style="padding:7px 18px;font-size:12px" onclick="ldSubmit()">
            <i data-lucide="send" style="width:12px;height:12px"></i> Kirim
          </button>
        </div>
      </div>
    </div>

    <!-- List komentar -->
    <div class="ld-list" id="ld-list">
      <div class="ld-loading">
        <i data-lucide="loader" style="width:16px;height:16px;animation:spin 1s linear infinite"></i>
        Memuat diskusi...
      </div>
    </div>
  `;

  // Set avatar user
  const session = getSession();
  const avatarEl = document.getElementById('ld-compose-avatar');
  if (avatarEl && session) {
    avatarEl.textContent = session.avatar || session.name?.charAt(0)?.toUpperCase() || '?';
  }

  lucide.createIcons();
  await ldLoadComments();
}

// ── Load komentar dari API ──
async function ldLoadComments() {
  const listEl = document.getElementById('ld-list');
  const countEl = document.getElementById('ld-count');
  if (!listEl) return;

  try {
    const data = await DiscussionAPI.getAll(ldCourseId, ldLessonId);
    const { comments, total } = data;

    if (countEl) countEl.textContent = total + ' komentar';

    if (!comments.length) {
      listEl.innerHTML = `
        <div class="ld-empty">
          <i data-lucide="message-circle" style="width:32px;height:32px;opacity:0.3;margin-bottom:8px"></i>
          <div>Belum ada diskusi.</div>
          <div style="font-size:11px;margin-top:4px">Jadilah yang pertama bertanya!</div>
        </div>`;
      lucide.createIcons();
      return;
    }

    listEl.innerHTML = comments.map(c => ldRenderComment(c)).join('');
    lucide.createIcons();
  } catch (err) {
    listEl.innerHTML = `<div class="ld-empty" style="color:var(--danger)">Gagal memuat diskusi.</div>`;
    console.warn('[Discussion] Error:', err);
  }
}

// ── Render satu komentar + replies ──
function ldRenderComment(c) {
  const session = getSession();
  const isOwn = session && c.user_id === session.id;
  const timeStr = ldTimeAgo(c.created_at);

  const repliesHtml = (c.replies || []).map(r => ldRenderReply(r)).join('');

  return `
    <div class="ld-comment" id="ld-c-${c.id}">
      <div class="ld-comment-avatar">${c.author_avatar || c.author_name?.charAt(0)?.toUpperCase() || '?'}</div>
      <div class="ld-comment-body">
        <div class="ld-comment-header">
          <span class="ld-comment-author">${escapeHtml(c.author_name)}</span>
          <span class="ld-comment-time">${timeStr}</span>
          ${isOwn ? `<button class="ld-delete-btn" onclick="ldDelete('${c.id}', false)" title="Hapus">
            <i data-lucide="trash-2" style="width:11px;height:11px"></i>
          </button>` : ''}
        </div>
        <div class="ld-comment-text">${escapeHtml(c.body).replace(/\n/g, '<br>')}</div>
        <div class="ld-comment-actions">
          <button class="ld-action-btn ${c.liked ? 'liked' : ''}" onclick="ldLike('${c.id}', this)">
            <i data-lucide="heart" style="width:12px;height:12px"></i>
            <span class="ld-like-count">${c.likes || 0}</span>
          </button>
          <button class="ld-action-btn" onclick="ldStartReply('${c.id}', '${escapeHtml(c.author_name)}')">
            <i data-lucide="corner-down-right" style="width:12px;height:12px"></i>
            Reply
          </button>
          ${c.replies?.length ? `<span class="ld-reply-count">${c.replies.length} reply</span>` : ''}
        </div>
        ${repliesHtml ? `<div class="ld-replies">${repliesHtml}</div>` : ''}
      </div>
    </div>
  `;
}

// ── Render satu reply ──
function ldRenderReply(r) {
  const session = getSession();
  const isOwn = session && r.user_id === session.id;
  const timeStr = ldTimeAgo(r.created_at);

  return `
    <div class="ld-reply" id="ld-c-${r.id}">
      <div class="ld-comment-avatar" style="width:28px;height:28px;font-size:11px">${r.author_avatar || r.author_name?.charAt(0)?.toUpperCase() || '?'}</div>
      <div class="ld-comment-body">
        <div class="ld-comment-header">
          <span class="ld-comment-author">${escapeHtml(r.author_name)}</span>
          <span class="ld-comment-time">${timeStr}</span>
          ${isOwn ? `<button class="ld-delete-btn" onclick="ldDelete('${r.id}', true)" title="Hapus">
            <i data-lucide="trash-2" style="width:11px;height:11px"></i>
          </button>` : ''}
        </div>
        <div class="ld-comment-text">${escapeHtml(r.body).replace(/\n/g, '<br>')}</div>
        <div class="ld-comment-actions">
          <button class="ld-action-btn ${r.liked ? 'liked' : ''}" onclick="ldLike('${r.id}', this)">
            <i data-lucide="heart" style="width:12px;height:12px"></i>
            <span class="ld-like-count">${r.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Submit komentar/reply ──
async function ldSubmit() {
  const textarea = document.getElementById('ld-textarea');
  const body = textarea?.value.trim();
  if (!body) { ldShowToast('Tulis komentar dulu!'); return; }

  const session = getSession();
  if (!session) { ldShowToast('Login dulu untuk berkomentar.'); return; }

  const btn = document.querySelector('#ld-compose .btn');
  if (btn) { btn.disabled = true; btn.innerHTML = `<i data-lucide="loader" style="width:12px;height:12px"></i> Mengirim...`; lucide.createIcons(); }

  try {
    await DiscussionAPI.create(ldCourseId, ldLessonId, body, ldReplyingTo?.id || null);
    if (textarea) textarea.value = '';
    ldCancelReply();
    ldShowToast('Komentar berhasil dikirim!');
    await ldLoadComments();
  } catch (err) {
    ldShowToast(err?.error || 'Gagal mengirim komentar.');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = `<i data-lucide="send" style="width:12px;height:12px"></i> Kirim`; lucide.createIcons(); }
  }
}

// ── Like/unlike ──
async function ldLike(postId, btn) {
  const session = getSession();
  if (!session) { ldShowToast('Login dulu untuk like.'); return; }

  try {
    const result = await DiscussionAPI.like(ldCourseId, ldLessonId, postId);
    btn.classList.toggle('liked', result.liked);
    const countEl = btn.querySelector('.ld-like-count');
    if (countEl) countEl.textContent = result.likes;
    lucide.createIcons();
  } catch (err) {
    ldShowToast('Gagal like.');
  }
}

// ── Delete ──
async function ldDelete(postId, isReply) {
  if (!confirm('Hapus komentar ini?')) return;
  try {
    await DiscussionAPI.delete(ldCourseId, ldLessonId, postId);
    ldShowToast('Komentar dihapus.');
    await ldLoadComments();
  } catch (err) {
    ldShowToast('Gagal menghapus.');
  }
}

// ── Start reply ──
function ldStartReply(parentId, authorName) {
  ldReplyingTo = { id: parentId, authorName };

  const replyToEl = document.getElementById('ld-reply-to');
  const cancelBtn = document.getElementById('ld-cancel-reply');
  const textarea  = document.getElementById('ld-textarea');

  if (replyToEl) {
    replyToEl.style.display = 'flex';
    replyToEl.innerHTML = `
      <i data-lucide="corner-down-right" style="width:12px;height:12px;color:var(--accent-light)"></i>
      <span>Membalas <strong>${escapeHtml(authorName)}</strong></span>
    `;
    lucide.createIcons();
  }
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (textarea) {
    textarea.placeholder = `Balas komentar ${authorName}...`;
    textarea.focus();
  }

  // Scroll ke form
  document.getElementById('ld-compose')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Cancel reply ──
function ldCancelReply() {
  ldReplyingTo = null;
  const replyToEl = document.getElementById('ld-reply-to');
  const cancelBtn = document.getElementById('ld-cancel-reply');
  const textarea  = document.getElementById('ld-textarea');

  if (replyToEl) replyToEl.style.display = 'none';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (textarea) textarea.placeholder = 'Tulis pertanyaan atau komentar tentang lesson ini...';
}

// ── Auto resize textarea ──
function ldAutoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

// ── Time ago helper ──
function ldTimeAgo(dateStr) {
  if (typeof timeAgo === 'function') return timeAgo(dateStr);
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

// ── Escape HTML ──
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Toast ──
function ldShowToast(msg) {
  if (typeof showToast === 'function') { showToast(msg); return; }
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e1e3a;border:1px solid rgba(124,58,237,0.4);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
