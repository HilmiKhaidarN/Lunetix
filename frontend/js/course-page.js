// ══════════════════════════════════════════════
// COURSE PAGE — Halaman Belajar Kursus
// ══════════════════════════════════════════════

// ── Course Registry ──
const courseRegistry = {
  1: courseML,
  2: coursePythonAI,
  3: courseDeepLearning,
  4: courseNLP,
  5: courseComputerVision,
  6: courseDataScience,
  7: courseRL,
  8: courseAIEthics,
};

const courseNames = {
  1: 'Machine Learning Fundamentals',
  2: 'Python for AI',
  3: 'Deep Learning Essentials',
  4: 'Natural Language Processing',
  5: 'Computer Vision with Python',
  6: 'Data Science with AI',
  7: 'Reinforcement Learning',
  8: 'AI Ethics & Safety',
};

// ── State ──
let cpCourseId = null;
let cpContent = null;
let cpCompletedLessons = [];
let cpModuleQuizPassed = {}; // { moduleIndex: true/false }
let cpCurrentModuleIdx = 0;
let cpCurrentLessonIdx = 0; // index dalam modul
let cpCurrentType = 'lesson'; // 'lesson'

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();

  // Ambil courseId dari URL: /course/1
  const parts = window.location.pathname.split('/');
  cpCourseId = parseInt(parts[parts.length - 1]);

  if (!cpCourseId || !courseRegistry[cpCourseId]) {
    showCpError('Kursus tidak ditemukan.');
    return;
  }

  cpContent = courseRegistry[cpCourseId];

  // Cek akses
  const session = getSession();
  if (session && typeof checkCourseAccess === 'function') {
    const access = checkCourseAccess(String(session.id), cpCourseId);
    if (!access.hasAccess) {
      showCpError('Kamu belum memiliki akses ke kursus ini. Klaim terlebih dahulu di halaman Courses.');
      return;
    }
  }

  // Set judul
  document.title = `${courseNames[cpCourseId]} - Lunetix`;
  document.getElementById('cp-course-title').textContent = courseNames[cpCourseId];

  // Load progress
  await loadCpProgress();

  // Load module quiz status
  loadModuleQuizStatus();

  // Render sidebar
  renderCpSidebar();

  // Buka lesson pertama yang belum selesai, atau lesson pertama
  openFirstAvailableLesson();

  lucide.createIcons();
});

// ── Load Progress ──
async function loadCpProgress() {
  try {
    cpCompletedLessons = await getCompletedLessonsAsync(cpCourseId);
  } catch (e) {
    cpCompletedLessons = [];
  }
}

// ── Load Module Quiz Status ──
function loadModuleQuizStatus() {
  const key = `cp_mq_passed_${cpCourseId}`;
  const raw = store.get(key, {});
  cpModuleQuizPassed = (typeof raw === 'object' && raw !== null) ? raw : {};
}

function saveModuleQuizStatus() {
  const key = `cp_mq_passed_${cpCourseId}`;
  store.set(key, cpModuleQuizPassed);
}

// ── Get all lesson IDs flat ──
function getCpAllLessons() {
  const lessons = [];
  cpContent.curriculum.forEach((mod, mi) => {
    mod.lessons.forEach((l, li) => {
      lessons.push({ moduleIdx: mi, lessonIdx: li, lesson: l, id: getLessonId(mi, li) });
    });
  });
  return lessons;
}

function getLessonId(moduleIdx, lessonIdx) {
  const l = cpContent.curriculum[moduleIdx].lessons[lessonIdx];
  return `${cpCourseId}-m${moduleIdx}-l${lessonIdx}-${l.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30)}`;
}

// ── Check if module is unlocked ──
function isModuleUnlocked(moduleIdx) {
  if (moduleIdx === 0) return true;
  // Modul sebelumnya harus sudah lulus quiz modul
  return cpModuleQuizPassed[moduleIdx - 1] === true;
}

// ── Check if lesson is accessible ──
function isLessonAccessible(moduleIdx, lessonIdx) {
  if (!isModuleUnlocked(moduleIdx)) return false;
  if (lessonIdx === 0) return true;
  // Lesson sebelumnya harus sudah selesai
  const prevId = getLessonId(moduleIdx, lessonIdx - 1);
  return cpCompletedLessons.includes(prevId);
}

// ── Check if all lessons in module are done ──
function isModuleAllLessonsDone(moduleIdx) {
  const mod = cpContent.curriculum[moduleIdx];
  return mod.lessons.every((_, li) => {
    const id = getLessonId(moduleIdx, li);
    return cpCompletedLessons.includes(id);
  });
}

// ── Open first available lesson ──
function openFirstAvailableLesson() {
  // Cari lesson pertama yang belum selesai
  for (let mi = 0; mi < cpContent.curriculum.length; mi++) {
    if (!isModuleUnlocked(mi)) continue;
    const mod = cpContent.curriculum[mi];
    for (let li = 0; li < mod.lessons.length; li++) {
      const id = getLessonId(mi, li);
      if (!cpCompletedLessons.includes(id) && isLessonAccessible(mi, li)) {
        openLesson(mi, li);
        return;
      }
    }
  }
  // Semua selesai — buka lesson terakhir
  const lastMod = cpContent.curriculum.length - 1;
  const lastLesson = cpContent.curriculum[lastMod].lessons.length - 1;
  openLesson(lastMod, lastLesson);
}

// ── Render Sidebar ──
function renderCpSidebar() {
  const nav = document.getElementById('cp-curriculum-nav');
  const allLessons = getCpAllLessons();
  const totalLessons = allLessons.length;
  const doneLessons = allLessons.filter(l => cpCompletedLessons.includes(l.id)).length;
  const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  document.getElementById('cp-overall-bar').style.width = pct + '%';
  document.getElementById('cp-overall-pct').textContent = pct + '%';
  document.getElementById('cp-done-count').textContent = doneLessons;
  document.getElementById('cp-total-count').textContent = totalLessons;

  nav.innerHTML = cpContent.curriculum.map((mod, mi) => {
    const unlocked = isModuleUnlocked(mi);
    const allDone = isModuleAllLessonsDone(mi);
    const quizPassed = cpModuleQuizPassed[mi] === true;
    const isOpen = mi === cpCurrentModuleIdx;

    const statusIcon = !unlocked
      ? `<i data-lucide="lock" style="width:11px;height:11px"></i>`
      : allDone && quizPassed
        ? `<i data-lucide="check" style="width:11px;height:11px"></i>`
        : `<i data-lucide="play" style="width:11px;height:11px"></i>`;

    const statusClass = !unlocked ? 'locked' : (allDone && quizPassed) ? 'done' : 'active';

    const doneLessonsInMod = mod.lessons.filter((_, li) => cpCompletedLessons.includes(getLessonId(mi, li))).length;

    // Quiz modul
    const hasModuleQuiz = cpContent.moduleQuizzes && cpContent.moduleQuizzes[mi];
    let quizItemHtml = '';
    if (hasModuleQuiz) {
      const quizAvailable = unlocked && isModuleAllLessonsDone(mi);
      const quizClass = !unlocked ? 'locked' : quizPassed ? 'passed' : quizAvailable ? 'available' : 'locked';
      const quizIcon = quizPassed
        ? `<i data-lucide="check-circle" style="width:13px;height:13px;color:#34d399"></i>`
        : `<i data-lucide="brain" style="width:13px;height:13px"></i>`;
      const quizLabel = quizPassed ? 'Quiz Modul ✓' : 'Quiz Modul';
      quizItemHtml = `
        <div class="cp-quiz-item ${quizClass}" onclick="${quizAvailable || quizPassed ? `openModuleQuiz(${mi})` : 'showLockedQuizToast()'}">
          ${quizIcon}
          <span>${quizLabel}</span>
          ${!quizPassed && quizAvailable ? '<span style="font-size:10px;color:var(--accent-light);margin-left:auto">Wajib</span>' : ''}
        </div>
      `;
    }

    return `
      <div class="cp-module-item">
        <div class="cp-module-header ${isOpen ? 'open' : ''}" onclick="toggleCpModule(${mi})">
          <div class="cp-module-status ${statusClass}">${statusIcon}</div>
          <div class="cp-module-info">
            <div class="cp-module-name">${mod.title}</div>
            <div class="cp-module-meta">${doneLessonsInMod}/${mod.lessons.length} lesson</div>
          </div>
          <i data-lucide="chevron-down" class="cp-module-chevron" style="width:14px;height:14px"></i>
        </div>
        <div class="cp-lessons-list ${isOpen ? 'open' : ''}" id="cp-mod-list-${mi}">
          ${mod.lessons.map((l, li) => {
            const lessonId = getLessonId(mi, li);
            const isDone = cpCompletedLessons.includes(lessonId);
            const accessible = isLessonAccessible(mi, li);
            const isActive = mi === cpCurrentModuleIdx && li === cpCurrentLessonIdx;
            const cls = isActive ? 'active' : isDone ? 'done' : !accessible ? 'locked' : '';
            const checkHtml = isDone
              ? `<div class="cp-lesson-check done"><i data-lucide="check" style="width:8px;height:8px"></i></div>`
              : `<div class="cp-lesson-check"></div>`;
            const lockIcon = !accessible && !isDone
              ? `<i data-lucide="lock" style="width:10px;height:10px;color:var(--text-muted);margin-left:auto"></i>`
              : '';
            return `
              <div class="cp-lesson-item ${cls}" onclick="${accessible ? `openLesson(${mi}, ${li})` : 'showLockedLessonToast()'}">
                <span class="cp-lesson-icon">${l.icon}</span>
                <span class="cp-lesson-title">${l.title}</span>
                ${lockIcon || `<span class="cp-lesson-duration">${l.duration}</span>`}
                ${checkHtml}
              </div>
            `;
          }).join('')}
          ${quizItemHtml}
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ── Toggle Module ──
function toggleCpModule(mi) {
  const list = document.getElementById(`cp-mod-list-${mi}`);
  const header = list.previousElementSibling;
  const isOpen = list.classList.contains('open');
  list.classList.toggle('open', !isOpen);
  header.classList.toggle('open', !isOpen);
  lucide.createIcons();
}

// ── Open Lesson ──
function openLesson(moduleIdx, lessonIdx) {
  if (!isLessonAccessible(moduleIdx, lessonIdx)) {
    showLockedLessonToast();
    return;
  }

  cpCurrentModuleIdx = moduleIdx;
  cpCurrentLessonIdx = lessonIdx;
  cpCurrentType = 'lesson';

  const mod = cpContent.curriculum[moduleIdx];
  const lesson = mod.lessons[lessonIdx];
  const lessonId = getLessonId(moduleIdx, lessonIdx);
  const isDone = cpCompletedLessons.includes(lessonId);

  // Update breadcrumb
  document.getElementById('cp-mod-label').textContent = `Modul ${moduleIdx + 1}`;
  document.getElementById('cp-lesson-label').textContent = lesson.title;

  // Render content
  const area = document.getElementById('cp-content-area');
  const allLessons = getCpAllLessons();
  const flatIdx = allLessons.findIndex(l => l.moduleIdx === moduleIdx && l.lessonIdx === lessonIdx);
  const total = allLessons.length;

  // Tentukan konten materi berdasarkan modul
  const materiHtml = getModuleMateri(moduleIdx);

  area.innerHTML = `
    <div class="cp-lesson-content">
      <div class="cp-lesson-header">
        <div class="cp-lesson-type-badge">
          <i data-lucide="${getLessonTypeIcon(lesson.icon)}" style="width:12px;height:12px"></i>
          ${getLessonTypeName(lesson.icon)}
        </div>
        <h1>${lesson.title}</h1>
        <div class="cp-lesson-meta">
          <span><i data-lucide="clock" style="width:12px;height:12px"></i> ${lesson.duration}</span>
          <span><i data-lucide="book-open" style="width:12px;height:12px"></i> Lesson ${flatIdx + 1} dari ${total}</span>
          ${isDone ? '<span style="color:#34d399"><i data-lucide="check-circle" style="width:12px;height:12px"></i> Selesai</span>' : ''}
        </div>
      </div>

      <div class="cp-lesson-materi">
        ${materiHtml}
      </div>

      <div class="cp-complete-btn-wrap">
        <div style="font-size:13px;color:var(--text-muted)">
          ${isDone ? '✅ Lesson ini sudah kamu selesaikan' : 'Tandai lesson ini sebagai selesai untuk melanjutkan'}
        </div>
        <button class="cp-complete-btn ${isDone ? 'done' : ''}" id="cp-complete-btn"
          onclick="completeLesson(${moduleIdx}, ${lessonIdx})" ${isDone ? 'disabled' : ''}>
          ${isDone
            ? `<i data-lucide="check-circle" style="width:16px;height:16px"></i> Selesai`
            : `<i data-lucide="check" style="width:16px;height:16px"></i> Tandai Selesai`
          }
        </button>
      </div>

      <div id="cp-module-quiz-cta"></div>
    </div>
  `;

  // Cek apakah perlu tampilkan CTA quiz modul
  checkModuleQuizCTA(moduleIdx);

  // Update bottom nav
  updateCpBottomNav(flatIdx, total);

  // Update sidebar
  renderCpSidebar();

  // Buka modul di sidebar
  const modList = document.getElementById(`cp-mod-list-${moduleIdx}`);
  if (modList) {
    modList.classList.add('open');
    modList.previousElementSibling.classList.add('open');
  }

  // Scroll ke atas
  document.getElementById('cp-content-area').scrollTop = 0;

  lucide.createIcons();
}

// ── Get Materi per Modul ──
function getModuleMateri(moduleIdx) {
  // Bagi materi kursus ke modul-modul
  // Untuk sekarang tampilkan materi lengkap kursus (bisa dioptimasi per modul nanti)
  if (!cpContent.materi) {
    return `<div class="materi-section"><p style="color:var(--text-muted)">Materi sedang disiapkan.</p></div>`;
  }
  // Tampilkan materi lengkap dengan sumber
  const sourcesHtml = cpContent.sources ? `
    <div class="sources-section">
      <h3>📚 Sumber Referensi</h3>
      <ul>
        ${cpContent.sources.map(s => `<li>🔗 <a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join('')}
      </ul>
    </div>
  ` : '';
  return cpContent.materi + sourcesHtml;
}

// ── Lesson type helpers ──
function getLessonTypeIcon(icon) {
  if (icon === '▶️') return 'play-circle';
  if (icon === '📄') return 'file-text';
  if (icon === '💻') return 'code-2';
  return 'book-open';
}
function getLessonTypeName(icon) {
  if (icon === '▶️') return 'Video';
  if (icon === '📄') return 'Bacaan';
  if (icon === '💻') return 'Lab';
  return 'Materi';
}

// ── Complete Lesson ──
async function completeLesson(moduleIdx, lessonIdx) {
  const lessonId = getLessonId(moduleIdx, lessonIdx);
  const btn = document.getElementById('cp-complete-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }

  try {
    const result = await completeLessonAsync(cpCourseId, lessonId);
    if (result.completed || result.success !== false) {
      if (!cpCompletedLessons.includes(lessonId)) {
        cpCompletedLessons.push(lessonId);
      }
      // Update button
      if (btn) {
        btn.classList.add('done');
        btn.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px"></i> Selesai`;
        btn.disabled = true;
      }
      // Update header
      const metaEl = document.querySelector('.cp-lesson-meta');
      if (metaEl && !metaEl.querySelector('.done-badge')) {
        metaEl.insertAdjacentHTML('beforeend', '<span class="done-badge" style="color:#34d399"><i data-lucide="check-circle" style="width:12px;height:12px"></i> Selesai</span>');
      }
      // Update complete wrap text
      const wrapText = document.querySelector('.cp-complete-btn-wrap div');
      if (wrapText) wrapText.textContent = '✅ Lesson ini sudah kamu selesaikan';

      // Cek CTA quiz modul
      checkModuleQuizCTA(moduleIdx);

      // Update sidebar
      renderCpSidebar();
      lucide.createIcons();

      showCpToast('✅ Lesson selesai!');
    }
  } catch (e) {
    if (btn) { btn.disabled = false; btn.innerHTML = `<i data-lucide="check" style="width:16px;height:16px"></i> Tandai Selesai`; }
    showCpToast('Gagal menyimpan progress. Coba lagi.');
  }
}

// ── Check Module Quiz CTA ──
function checkModuleQuizCTA(moduleIdx) {
  const ctaEl = document.getElementById('cp-module-quiz-cta');
  if (!ctaEl) return;

  const hasQuiz = cpContent.moduleQuizzes && cpContent.moduleQuizzes[moduleIdx];
  if (!hasQuiz) { ctaEl.innerHTML = ''; return; }

  const allDone = isModuleAllLessonsDone(moduleIdx);
  const quizPassed = cpModuleQuizPassed[moduleIdx] === true;

  if (quizPassed) {
    ctaEl.innerHTML = `
      <div class="cp-module-quiz-cta" style="border-color:rgba(52,211,153,0.3);background:rgba(52,211,153,0.06)">
        <div style="font-size:32px;margin-bottom:8px">🎉</div>
        <h3 style="color:#34d399">Quiz Modul ${moduleIdx + 1} Lulus!</h3>
        <p>Kamu sudah lulus quiz modul ini. Modul berikutnya sudah terbuka.</p>
        ${moduleIdx < cpContent.curriculum.length - 1
          ? `<button class="btn btn-primary" onclick="openLesson(${moduleIdx + 1}, 0)">Lanjut ke Modul ${moduleIdx + 2} →</button>`
          : `<button class="btn btn-primary" onclick="openFinalQuiz()">🏆 Kerjakan Quiz Akhir Kursus</button>`
        }
      </div>
    `;
  } else if (allDone) {
    ctaEl.innerHTML = `
      <div class="cp-module-quiz-cta">
        <div style="font-size:32px;margin-bottom:8px">🧠</div>
        <h3>Selesaikan Quiz Modul ${moduleIdx + 1}</h3>
        <p>Kamu sudah menyelesaikan semua lesson di modul ini! Kerjakan quiz untuk membuka modul berikutnya.</p>
        <button class="btn btn-primary" onclick="openModuleQuiz(${moduleIdx})">
          <i data-lucide="brain" style="width:14px;height:14px"></i>
          Mulai Quiz Modul (5 soal)
        </button>
      </div>
    `;
  } else {
    ctaEl.innerHTML = '';
  }
  lucide.createIcons();
}

// ── Open Module Quiz ──
function openModuleQuiz(moduleIdx) {
  const url = `/course/${cpCourseId}/module/${moduleIdx}/quiz`;
  window.location.href = url;
}

// ── Open Final Quiz ──
function openFinalQuiz() {
  window.location.href = `/course/${cpCourseId}/quiz`;
}

// ── Navigate prev/next ──
function cpNavigate(dir) {
  const allLessons = getCpAllLessons();
  const flatIdx = allLessons.findIndex(l => l.moduleIdx === cpCurrentModuleIdx && l.lessonIdx === cpCurrentLessonIdx);

  if (dir === 'prev' && flatIdx > 0) {
    const prev = allLessons[flatIdx - 1];
    openLesson(prev.moduleIdx, prev.lessonIdx);
  } else if (dir === 'next' && flatIdx < allLessons.length - 1) {
    const next = allLessons[flatIdx + 1];
    if (isLessonAccessible(next.moduleIdx, next.lessonIdx)) {
      openLesson(next.moduleIdx, next.lessonIdx);
    } else {
      // Cek apakah perlu quiz modul dulu
      const prevModIdx = next.moduleIdx - 1;
      if (!cpModuleQuizPassed[prevModIdx]) {
        showCpToast('⚠️ Selesaikan quiz modul terlebih dahulu untuk membuka modul berikutnya.');
        checkModuleQuizCTA(cpCurrentModuleIdx);
      } else {
        showCpToast('⚠️ Selesaikan lesson sebelumnya terlebih dahulu.');
      }
    }
  }
}

// ── Update Bottom Nav ──
function updateCpBottomNav(flatIdx, total) {
  const prevBtn = document.getElementById('cp-prev-btn');
  const nextBtn = document.getElementById('cp-next-btn');
  const center = document.getElementById('cp-bottom-center');

  if (prevBtn) prevBtn.disabled = flatIdx === 0;

  const allLessons = getCpAllLessons();
  const isLast = flatIdx === total - 1;

  if (nextBtn) {
    if (isLast) {
      nextBtn.innerHTML = `🏆 Quiz Akhir <i data-lucide="arrow-right" style="width:14px;height:14px"></i>`;
      nextBtn.onclick = openFinalQuiz;
    } else {
      nextBtn.innerHTML = `Selanjutnya <i data-lucide="arrow-right" style="width:14px;height:14px"></i>`;
      nextBtn.onclick = () => cpNavigate('next');
    }
  }

  if (center) {
    center.textContent = `${flatIdx + 1} / ${total}`;
  }

  lucide.createIcons();
}

// ── Toggle Sidebar Mobile ──
function toggleCpSidebar() {
  document.getElementById('cp-sidebar').classList.toggle('open');
}

// ── Toast ──
function showCpToast(msg) {
  if (typeof showToast === 'function') { showToast(msg); return; }
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e1e3a;border:1px solid rgba(124,58,237,0.4);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999;animation:cpFadeIn 0.2s ease';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function showLockedLessonToast() {
  showCpToast('🔒 Selesaikan lesson sebelumnya terlebih dahulu.');
}
function showLockedQuizToast() {
  showCpToast('🔒 Selesaikan semua lesson di modul ini terlebih dahulu.');
}

// ── Error Screen ──
function showCpError(msg) {
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;background:var(--bg-primary);color:var(--text-primary);font-family:Inter,sans-serif">
      <div style="font-size:48px;margin-bottom:16px">⚠️</div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Oops!</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px">${msg}</p>
      <a href="/dashboard" style="padding:10px 24px;background:var(--accent);color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Kembali ke Dashboard</a>
    </div>
  `;
}
