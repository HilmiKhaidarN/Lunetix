// ══════════════════════════════════════════════
// COURSE DETAIL MODAL LOGIC
// ══════════════════════════════════════════════

// Map course id → content object
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

let activeQuizAnswers = {};

function openCourse(id) {
  const course = coursesData.find(c => c.id === id);
  const content = courseRegistry[id];

  if (!course) return;
  if (course.status === 'coming') {
    showToast(`"${course.title}" akan segera hadir! 🚀`);
    return;
  }
  if (!content) {
    showToast('Konten kursus sedang disiapkan.');
    return;
  }

  // Cek akses kursus
  const session = getSession();
  if (session && typeof checkCourseAccess === 'function') {
    const userId = String(session.id);
    const access = checkCourseAccess(userId, id);
    if (!access.hasAccess) {
      if (access.status === 'expired') {
        showToast(`⏰ Akses kursus "${course.title}" telah berakhir. Upgrade ke Pro untuk melanjutkan.`);
        if (typeof showUpgradeModal === 'function') showUpgradeModal();
        return;
      }
      if (access.status === 'not_claimed') {
        showToast(`🔒 Klaim kursus ini terlebih dahulu untuk mengakses materi.`);
        return;
      }
    }
  }

  buildModal(course, content);
  document.getElementById('course-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
  document.getElementById('course-modal').classList.remove('open');
  document.body.style.overflow = '';
  activeQuizAnswers = {};
}

function buildModal(course, content) {
  const modal = document.getElementById('course-modal');

  // Hero
  modal.querySelector('.cd-hero-emoji').innerHTML = `<i data-lucide="${course.thumbIcon}" style="width:52px;height:52px;color:${course.thumbColor}"></i>`;
  modal.querySelector('.cd-hero h1').textContent = course.title;
  modal.querySelector('.cd-hero p').textContent = getCourseDescription(course.id);
  modal.querySelector('.cd-meta-level').innerHTML = `<i data-lucide="bar-chart" style="width:13px;height:13px"></i> ${course.level}`;
  modal.querySelector('.cd-meta-duration').innerHTML = `<i data-lucide="clock" style="width:13px;height:13px"></i> ${course.duration}`;
  modal.querySelector('.cd-meta-students').innerHTML = `<i data-lucide="users" style="width:13px;height:13px"></i> ${course.students} students`;
  modal.querySelector('.cd-meta-rating').innerHTML = `<i data-lucide="star" style="width:13px;height:13px;color:#eab308"></i> ${course.rating}`;

  // Curriculum
  buildCurriculum(content.curriculum);

  // Materi
  document.getElementById('cd-materi').innerHTML = content.materi || '<p style="color:var(--text-muted)">Materi sedang disiapkan.</p>';

  // Inject sources into materi
  injectSources(content.sources);

  // Quiz
  buildQuiz(content.quiz);

  // Certificate
  const session = getSession();
  if (session && typeof renderCertificateButton === 'function') {
    renderCertificateButton(String(session.id), course.id);
  }

  // Reset to first tab
  switchCDTab('curriculum');
  lucide.createIcons();
}

function buildCurriculum(curriculum) {
  const container = document.getElementById('cd-curriculum');
  container.innerHTML = curriculum.map((mod, mi) => `
    <div class="curriculum-module">
      <div class="curriculum-module-title" onclick="toggleModule(${mi})">
        <span><i data-lucide="folder" style="width:14px;height:14px;margin-right:6px;vertical-align:middle"></i>${mod.title}</span>
        <span class="mod-meta">${mod.lessons.length} lessons · ${calcModDuration(mod.lessons)}</span>
      </div>
      <div class="curriculum-lessons" id="mod-${mi}">
        ${mod.lessons.map(l => `
          <div class="lesson-item">
            <span class="lesson-icon">${l.icon}</span>
            <span>${l.title}</span>
            <span class="lesson-duration">${l.duration}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function calcModDuration(lessons) {
  const total = lessons.reduce((sum, l) => {
    const m = parseInt(l.duration);
    return sum + (isNaN(m) ? 0 : m);
  }, 0);
  return total >= 60 ? `${Math.floor(total/60)}h ${total%60}m` : `${total} min`;
}

function toggleModule(idx) {
  const el = document.getElementById('mod-' + idx);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function injectSources(sources) {
  if (!sources || !sources.length) return;
  const sourceContainers = document.querySelectorAll('#cd-materi [id$="-sources"]');
  const html = sources.map(s =>
    `<li>🔗 <a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`
  ).join('');
  sourceContainers.forEach(el => el.innerHTML = html);
}

function buildQuiz(quizData) {
  const container = document.getElementById('cd-quiz');
  if (!quizData || !quizData.length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">Quiz belum tersedia.</p>';
    return;
  }
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:15px;margin-bottom:4px">🧠 Quiz: Uji Pemahamanmu</h3>
      <p style="font-size:13px;color:var(--text-secondary)">${quizData.length} pertanyaan · Klik jawaban untuk memeriksa</p>
    </div>
    ${quizData.map((q, qi) => `
      <div class="quiz-item" id="quiz-${qi}">
        <div class="quiz-q">${qi + 1}. ${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <button class="quiz-option" onclick="answerQuiz(${qi}, ${oi}, ${q.answer})">
              ${String.fromCharCode(65+oi)}. ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('')}
    <div id="quiz-result" style="display:none;margin-top:20px;text-align:center;padding:20px;background:var(--bg-card);border-radius:var(--radius);border:1px solid var(--border)"></div>
    <button class="btn btn-outline" style="margin-top:12px;width:100%" onclick="resetQuiz()">
      <i data-lucide="rotate-ccw" style="width:14px;height:14px"></i> Reset Quiz
    </button>
  `;
}

function answerQuiz(qi, selected, correct) {
  if (activeQuizAnswers[qi] !== undefined) return; // already answered
  activeQuizAnswers[qi] = selected;

  const item = document.getElementById('quiz-' + qi);
  const buttons = item.querySelectorAll('.quiz-option');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });

  // Check if all answered
  const quizItems = document.querySelectorAll('.quiz-item');
  if (Object.keys(activeQuizAnswers).length === quizItems.length) {
    showQuizResult(quizItems.length);
  }
}

function showQuizResult(total) {
  const correct = Object.entries(activeQuizAnswers).filter(([qi, ans]) => {
    const item = document.getElementById('quiz-' + qi);
    const correctBtn = item.querySelector('.quiz-option.correct');
    const buttons = item.querySelectorAll('.quiz-option');
    return Array.from(buttons).indexOf(correctBtn) === ans;
  }).length;

  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
  const msg = pct >= 80 ? 'Luar biasa!' : pct >= 60 ? 'Bagus, terus belajar!' : 'Yuk pelajari lagi materinya!';

  const result = document.getElementById('quiz-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div style="font-size:36px;margin-bottom:8px">${emoji}</div>
    <div style="font-size:20px;font-weight:700;margin-bottom:4px">${correct}/${total} Benar (${pct}%)</div>
    <div style="font-size:13px;color:var(--text-secondary)">${msg}</div>
  `;
}

function resetQuiz() {
  activeQuizAnswers = {};
  const quizItems = document.querySelectorAll('.quiz-item');
  quizItems.forEach(item => {
    item.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('correct', 'wrong');
    });
  });
  const result = document.getElementById('quiz-result');
  if (result) result.style.display = 'none';
}

function switchCDTab(tab) {
  document.querySelectorAll('.cd-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cd-section').forEach(s => s.classList.remove('active'));
  document.querySelector(`.cd-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('cd-' + tab).classList.add('active');
}

function getCourseDescription(id) {
  const descs = {
    1: 'Pelajari fondasi Machine Learning dari nol: algoritma klasik, evaluasi model, dan feature engineering dengan Python & Scikit-learn.',
    2: 'Kuasai Python untuk AI: NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, dan PyTorch dalam satu kursus komprehensif.',
    3: 'Dari neural network dasar hingga Transformer modern: CNN, LSTM, BERT, dan Generative AI dengan implementasi praktis.',
    4: 'Pahami cara mesin memproses bahasa manusia: dari tokenization hingga Large Language Models dan RAG.',
    5: 'Bangun sistem computer vision dengan OpenCV, CNN, YOLO, dan face recognition menggunakan Python.',
    6: 'Kuasai data science end-to-end: statistik, EDA, feature engineering, visualisasi, dan deployment.',
    7: 'Pelajari RL dari Q-Learning hingga PPO — algoritma yang digunakan AlphaGo dan ChatGPT.',
    8: 'Pahami bias, fairness, explainability, dan safety dalam AI untuk membangun sistem yang bertanggung jawab.',
  };
  return descs[id] || '';
}

// showToast is defined in store.js

// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('course-modal');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeCourseModal();
    });
  }
});

