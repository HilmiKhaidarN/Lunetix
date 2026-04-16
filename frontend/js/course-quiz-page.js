// ══════════════════════════════════════════════
// COURSE QUIZ PAGE — Quiz Modul & Quiz Akhir Kursus
// ══════════════════════════════════════════════

const cqCourseRegistry = {
  1: courseML,
  2: coursePythonAI,
  3: courseDeepLearning,
  4: courseNLP,
  5: courseComputerVision,
  6: courseDataScience,
  7: courseRL,
  8: courseAIEthics,
};

const cqCourseNames = {
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
let cqCourseId = null;
let cqModuleIdx = null; // null = final quiz
let cqIsFinal = false;
let cqQuestions = [];
let cqCurrentQ = 0;
let cqAnswers = {}; // { qIdx: selectedOpt }
let cqScore = 0;
let cqContent = null;

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();

  // Parse URL:
  // /course/1/quiz           → final quiz
  // /course/1/module/2/quiz  → module quiz
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);

  // parts: ['course', '1', 'quiz'] or ['course', '1', 'module', '2', 'quiz']
  cqCourseId = parseInt(parts[1]);

  if (parts.includes('module')) {
    const modIdx = parts.indexOf('module');
    cqModuleIdx = parseInt(parts[modIdx + 1]);
    cqIsFinal = false;
  } else {
    cqIsFinal = true;
    cqModuleIdx = null;
  }

  if (!cqCourseId || !cqCourseRegistry[cqCourseId]) {
    showCqError('Kursus tidak ditemukan.');
    return;
  }

  cqContent = cqCourseRegistry[cqCourseId];

  // Set back button
  document.getElementById('cq-back-btn').onclick = () => {
    window.location.href = `/course/${cqCourseId}`;
  };

  // Load questions
  if (cqIsFinal) {
    cqQuestions = cqContent.finalQuiz || [];
    document.title = `Quiz Akhir — ${cqCourseNames[cqCourseId]} - Lunetix`;
    document.getElementById('cq-title').textContent = 'Quiz Akhir Kursus';
    document.getElementById('cq-subtitle').textContent = cqCourseNames[cqCourseId];
  } else {
    const modQuizzes = cqContent.moduleQuizzes || [];
    const modQuiz = modQuizzes.find(mq => mq.moduleIndex === cqModuleIdx);
    cqQuestions = modQuiz ? modQuiz.questions : [];
    const modTitle = cqContent.curriculum[cqModuleIdx]?.title || `Modul ${cqModuleIdx + 1}`;
    document.title = `Quiz ${modTitle} - Lunetix`;
    document.getElementById('cq-title').textContent = `Quiz ${modTitle}`;
    document.getElementById('cq-subtitle').textContent = cqCourseNames[cqCourseId];
  }

  if (!cqQuestions.length) {
    showCqError('Quiz tidak tersedia untuk bagian ini.');
    return;
  }

  // Cek attempt limit
  const quizId = cqIsFinal ? `final-${cqCourseId}` : `module-${cqCourseId}-${cqModuleIdx}`;
  const attemptStatus = await checkQuizAttemptAsync(quizId);

  document.getElementById('cq-attempt-info').textContent =
    `${attemptStatus.attemptsToday}/${MAX_QUIZ_ATTEMPTS_PER_DAY} percobaan hari ini`;

  if (!attemptStatus.canAttempt) {
    renderCqLimitScreen(attemptStatus);
    return;
  }

  // Cek apakah sudah pernah lulus (untuk module quiz) — cek API dulu
  if (!cqIsFinal) {
    const session = getSession();
    if (session?.token) {
      try {
        const statusData = await ModuleQuizAPI.getStatus(cqCourseId);
        const modStatus = statusData.passedMap?.[cqModuleIdx];
        if (modStatus?.passed) {
          // Sync ke localStorage
          const key = `cp_mq_passed_${cqCourseId}`;
          const existing = store.get(key, {});
          existing[cqModuleIdx] = true;
          store.set(key, existing);
          // Tampilkan already passed screen dengan data dari API
          renderCqAlreadyPassed({ passed: true, bestScore: modStatus.bestScore, attemptsToday: attemptStatus.attemptsToday });
          return;
        }
      } catch (e) {
        // Fallback ke localStorage
        const key = `cp_mq_passed_${cqCourseId}`;
        const local = store.get(key, {});
        if (local[cqModuleIdx] === true) {
          renderCqAlreadyPassed({ passed: true, bestScore: attemptStatus.bestScore, attemptsToday: attemptStatus.attemptsToday });
          return;
        }
      }
    } else if (attemptStatus.passed) {
      renderCqAlreadyPassed(attemptStatus);
      return;
    }
  }

  // Render intro
  renderCqIntro(attemptStatus);
  lucide.createIcons();
});

// ── Render Intro ──
function renderCqIntro(attemptStatus) {
  const main = document.getElementById('cq-main');
  const totalQ = cqQuestions.length;
  const passScore = QUIZ_PASS_THRESHOLD;
  const attemptsLeft = MAX_QUIZ_ATTEMPTS_PER_DAY - attemptStatus.attemptsToday;

  main.innerHTML = `
    <div class="cq-intro">
      <div class="cq-intro-icon">
        <i data-lucide="brain" style="width:36px;height:36px;color:var(--accent-light)"></i>
      </div>
      <h2>${cqIsFinal ? '🏆 Quiz Akhir Kursus' : '🧠 Quiz Modul'}</h2>
      <p>
        ${cqIsFinal
          ? `Uji pemahaman kamu atas seluruh materi kursus <strong>${cqCourseNames[cqCourseId]}</strong>. Kamu perlu skor minimal ${passScore}% untuk mendapatkan sertifikat.`
          : `Uji pemahaman kamu atas materi modul ini. Kamu perlu skor minimal ${passScore}% untuk membuka modul berikutnya.`
        }
      </p>
      <div class="cq-intro-stats">
        <div class="cq-intro-stat">
          <div class="val">${totalQ}</div>
          <div class="lbl">Soal</div>
        </div>
        <div class="cq-intro-stat">
          <div class="val">${passScore}%</div>
          <div class="lbl">Nilai Lulus</div>
        </div>
        <div class="cq-intro-stat">
          <div class="val">${attemptsLeft}</div>
          <div class="lbl">Sisa Percobaan</div>
        </div>
        ${attemptStatus.bestScore > 0 ? `
          <div class="cq-intro-stat">
            <div class="val">${attemptStatus.bestScore}%</div>
            <div class="lbl">Skor Terbaik</div>
          </div>
        ` : ''}
      </div>
      <button class="btn btn-primary" style="padding:14px 40px;font-size:15px;font-weight:700" onclick="startCqQuiz()">
        <i data-lucide="play" style="width:16px;height:16px"></i>
        Mulai Quiz
      </button>
    </div>
  `;
  lucide.createIcons();
}

// ── Start Quiz ──
function startCqQuiz() {
  cqCurrentQ = 0;
  cqAnswers = {};
  cqScore = 0;
  renderCqQuestion();
}

// ── Render Question ──
function renderCqQuestion() {
  const main = document.getElementById('cq-main');
  const q = cqQuestions[cqCurrentQ];
  const total = cqQuestions.length;
  const pct = Math.round((cqCurrentQ / total) * 100);

  main.innerHTML = `
    <div class="cq-progress-wrap">
      <div class="cq-progress-header">
        <span>Soal ${cqCurrentQ + 1} dari ${total}</span>
        <span>${pct}% selesai</span>
      </div>
      <div class="cq-progress-bar">
        <div class="cq-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="cq-question-card">
      <div class="cq-question-num">Soal ${cqCurrentQ + 1}</div>
      <div class="cq-question-text">${q.q}</div>
      <div class="cq-options" id="cq-options">
        ${q.opts.map((opt, oi) => `
          <button class="cq-option" onclick="selectCqOption(${oi})" id="cq-opt-${oi}">
            <span class="cq-opt-letter">${String.fromCharCode(65 + oi)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="cq-feedback" id="cq-feedback"></div>
    </div>

    <div class="cq-nav">
      <div style="font-size:12px;color:var(--text-muted)">
        ${cqCurrentQ + 1} / ${total}
      </div>
      <button class="btn btn-primary" id="cq-next-btn" onclick="cqNextQuestion()" style="display:none">
        ${cqCurrentQ < total - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil'}
      </button>
    </div>
  `;
  lucide.createIcons();
}

// ── Select Option ──
function selectCqOption(selectedOpt) {
  if (cqAnswers[cqCurrentQ] !== undefined) return; // sudah dijawab

  const q = cqQuestions[cqCurrentQ];
  cqAnswers[cqCurrentQ] = selectedOpt;

  const isCorrect = selectedOpt === q.ans;
  if (isCorrect) cqScore++;

  // Disable semua option
  const opts = document.querySelectorAll('.cq-option');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    else if (i === selectedOpt && !isCorrect) btn.classList.add('wrong');
  });

  // Feedback
  const fb = document.getElementById('cq-feedback');
  if (fb) {
    fb.className = `cq-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
    fb.innerHTML = isCorrect
      ? `<i data-lucide="check-circle" style="width:16px;height:16px"></i> Benar! Jawaban yang tepat.`
      : `<i data-lucide="x-circle" style="width:16px;height:16px"></i> Kurang tepat. Jawaban yang benar: <strong>${String.fromCharCode(65 + q.ans)}. ${q.opts[q.ans]}</strong>`;
  }

  // Tampilkan tombol next
  const nextBtn = document.getElementById('cq-next-btn');
  if (nextBtn) nextBtn.style.display = 'flex';

  lucide.createIcons();
}

// ── Next Question ──
function cqNextQuestion() {
  if (cqCurrentQ < cqQuestions.length - 1) {
    cqCurrentQ++;
    renderCqQuestion();
  } else {
    finishCqQuiz();
  }
}

// ── Finish Quiz ──
async function finishCqQuiz() {
  const total = cqQuestions.length;
  const correct = cqScore;
  const score = calculateQuizScore(correct, total);
  const { passed } = evaluateQuizPass(score);

  const quizId = cqIsFinal ? `final-${cqCourseId}` : `module-${cqCourseId}-${cqModuleIdx}`;

  // Record attempt
  try {
    await recordQuizAttemptAsync(quizId, score);
  } catch (e) {
    console.warn('Gagal record attempt:', e);
  }

  // Jika module quiz dan lulus, simpan status ke API + localStorage
  if (!cqIsFinal && passed) {
    const key = `cp_mq_passed_${cqCourseId}`;
    const existing = store.get(key, {});
    existing[cqModuleIdx] = true;
    store.set(key, existing);

    // Simpan ke API juga
    const session = getSession();
    if (session?.token) {
      try {
        await ModuleQuizAPI.markPassed(cqCourseId, cqModuleIdx, score);
      } catch (e) {
        console.warn('[ModuleQuiz] Gagal simpan ke API, tersimpan di localStorage.', e);
      }
    }
  }

  renderCqResult(score, correct, total, passed);
}

// ── Render Result ──
function renderCqResult(score, correct, total, passed) {
  const main = document.getElementById('cq-main');
  const emoji = score >= 90 ? '🏆' : score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚';
  const msg = score >= 90 ? 'Luar biasa! Sempurna!'
    : score >= 80 ? 'Selamat! Kamu lulus!'
    : score >= 60 ? 'Hampir! Coba lagi untuk lulus.'
    : 'Yuk pelajari lagi materinya dan coba lagi.';

  const passedBadge = passed
    ? `<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);border-radius:20px;color:#34d399;font-size:13px;font-weight:600;margin-bottom:16px">
        <i data-lucide="check-circle" style="width:14px;height:14px"></i> Lulus!
       </div>`
    : `<div style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:20px;color:#f87171;font-size:13px;font-weight:600;margin-bottom:16px">
        <i data-lucide="x-circle" style="width:14px;height:14px"></i> Belum Lulus
       </div>`;

  // Action buttons
  let actionBtns = '';
  if (passed) {
    if (cqIsFinal) {
      actionBtns = `
        <button class="btn btn-primary" onclick="window.location.href='/dashboard'">
          <i data-lucide="award" style="width:14px;height:14px"></i> Klaim Sertifikat
        </button>
        <button class="btn btn-outline" onclick="window.location.href='/course/${cqCourseId}'">
          Kembali ke Kursus
        </button>
      `;
    } else {
      const nextModIdx = cqModuleIdx + 1;
      const hasNextMod = nextModIdx < cqContent.curriculum.length;
      actionBtns = `
        ${hasNextMod
          ? `<button class="btn btn-primary" onclick="window.location.href='/course/${cqCourseId}'">
              <i data-lucide="arrow-right" style="width:14px;height:14px"></i> Lanjut ke Modul ${nextModIdx + 1}
             </button>`
          : `<button class="btn btn-primary" onclick="window.location.href='/course/${cqCourseId}/quiz'">
              <i data-lucide="award" style="width:14px;height:14px"></i> Quiz Akhir Kursus
             </button>`
        }
        <button class="btn btn-outline" onclick="window.location.href='/course/${cqCourseId}'">
          Kembali ke Kursus
        </button>
      `;
    }
  } else {
    actionBtns = `
      <button class="btn btn-primary" onclick="retryQuiz()">
        <i data-lucide="rotate-ccw" style="width:14px;height:14px"></i> Coba Lagi
      </button>
      <button class="btn btn-outline" onclick="window.location.href='/course/${cqCourseId}'">
        Pelajari Lagi
      </button>
    `;
  }

  main.innerHTML = `
    <div class="cq-result">
      <div class="cq-result-emoji">${emoji}</div>
      ${passedBadge}
      <div class="cq-score-big">${score}%</div>
      <div class="cq-result-msg">${msg}</div>
      <div class="cq-result-stats">
        <div class="cq-result-stat">
          <div class="val" style="color:#34d399">${correct}</div>
          <div class="lbl">Benar</div>
        </div>
        <div class="cq-result-stat">
          <div class="val" style="color:#f87171">${total - correct}</div>
          <div class="lbl">Salah</div>
        </div>
        <div class="cq-result-stat">
          <div class="val">${total}</div>
          <div class="lbl">Total Soal</div>
        </div>
        <div class="cq-result-stat">
          <div class="val" style="color:${passed ? '#34d399' : '#f87171'}">${QUIZ_PASS_THRESHOLD}%</div>
          <div class="lbl">Nilai Lulus</div>
        </div>
      </div>
      <div class="cq-result-actions">
        ${actionBtns}
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ── Retry ──
function retryQuiz() {
  cqCurrentQ = 0;
  cqAnswers = {};
  cqScore = 0;
  renderCqQuestion();
}

// ── Limit Screen ──
function renderCqLimitScreen(attemptStatus) {
  const main = document.getElementById('cq-main');
  main.innerHTML = `
    <div class="cq-limit-screen">
      <div style="font-size:56px;margin-bottom:16px">⏰</div>
      <h3>Batas Percobaan Harian Tercapai</h3>
      <p>Kamu sudah mencapai batas ${MAX_QUIZ_ATTEMPTS_PER_DAY} percobaan hari ini. Coba lagi besok!</p>
      ${attemptStatus.bestScore > 0 ? `<p style="color:var(--accent-light);font-weight:600">Skor terbaik kamu: ${attemptStatus.bestScore}%</p>` : ''}
      <button class="btn btn-outline" onclick="window.location.href='/course/${cqCourseId}'">
        Kembali ke Kursus
      </button>
    </div>
  `;
}

// ── Already Passed Screen ──
function renderCqAlreadyPassed(attemptStatus) {
  const main = document.getElementById('cq-main');
  const nextModIdx = cqModuleIdx + 1;
  const hasNextMod = nextModIdx < cqContent.curriculum.length;

  main.innerHTML = `
    <div class="cq-result" style="padding-top:60px">
      <div class="cq-result-emoji">🎉</div>
      <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);border-radius:20px;color:#34d399;font-size:13px;font-weight:600;margin-bottom:16px">
        <i data-lucide="check-circle" style="width:14px;height:14px"></i> Sudah Lulus
      </div>
      <h2>Kamu sudah lulus quiz ini!</h2>
      <p class="cq-result-msg">Skor terbaik: <strong style="color:var(--accent-light)">${attemptStatus.bestScore}%</strong></p>
      <div class="cq-result-actions">
        ${hasNextMod
          ? `<button class="btn btn-primary" onclick="window.location.href='/course/${cqCourseId}'">
              Lanjut ke Modul ${nextModIdx + 1} →
             </button>`
          : `<button class="btn btn-primary" onclick="window.location.href='/course/${cqCourseId}/quiz'">
              Quiz Akhir Kursus →
             </button>`
        }
        <button class="btn btn-outline" onclick="retryQuiz()">
          Coba Lagi (Latihan)
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ── Error Screen ──
function showCqError(msg) {
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;background:var(--bg-primary);color:var(--text-primary);font-family:Inter,sans-serif">
      <div style="font-size:48px;margin-bottom:16px">⚠️</div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Oops!</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px">${msg}</p>
      <a href="/dashboard" style="padding:10px 24px;background:var(--accent);color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Kembali ke Dashboard</a>
    </div>
  `;
}
