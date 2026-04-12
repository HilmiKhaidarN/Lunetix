// ══════════════════════════════════════════════
// CERTIFICATE ACCESS — Penerbitan Sertifikat
// ══════════════════════════════════════════════

// ── Helpers ──

function loadCertificateData() {
  const raw = store.get('certificates', {});
  if (typeof raw !== 'object' || raw === null) {
    store.set('certificates', {});
    return {};
  }
  return raw;
}

function saveCertificateData(data) {
  try {
    store.set('certificates', data);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Penyimpanan browser penuh.');
      console.error('[CertificateAccess] localStorage quota exceeded:', e);
    }
    return false;
  }
}

function generateCredentialId(courseId, year, seq) {
  const course = coursesData.find(c => c.id === courseId);
  const code = course
    ? course.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
    : 'CRS';
  return `LTX-${code}-${year}-${String(seq).padStart(3, '0')}`;
}

// ── Core Functions ──

/**
 * Memeriksa apakah pengguna memenuhi syarat untuk mendapatkan sertifikat.
 * @param {string} userId
 * @param {number} courseId
 * @returns {{ eligible: boolean, allLessonsDone: boolean, quizPassed: boolean }}
 */
function checkCertificateEligibility(userId, courseId) {
  const allLessonsDone = isAllLessonsCompleted(userId, courseId);

  // Cari quizId yang sesuai dengan courseId
  const course = coursesData.find(c => c.id === courseId);
  let quizPassed = false;
  if (course) {
    // Cari quiz yang berkaitan dengan kursus ini di quizBank
    const relatedQuiz = quizBank.find(q =>
      q.title.toLowerCase().includes(course.title.split(' ')[0].toLowerCase()) ||
      q.category === course.category
    );
    if (relatedQuiz) {
      const session = getSession();
      const uid = userId || (session ? String(session.id) : null);
      if (uid) {
        const status = getQuizPassStatus(uid, relatedQuiz.id);
        quizPassed = status.passed;
      }
    }
  }

  return {
    eligible: allLessonsDone && quizPassed,
    allLessonsDone,
    quizPassed,
  };
}

/**
 * Menerbitkan sertifikat dan menyimpannya ke localStorage.
 * @param {string} userId
 * @param {number} courseId
 * @returns {{ success: boolean, certificate?: object, error?: string }}
 */
function issueCertificate(userId, courseId) {
  const eligibility = checkCertificateEligibility(userId, courseId);
  if (!eligibility.eligible) {
    return { success: false, error: 'not_eligible' };
  }

  const data = loadCertificateData();
  if (!data[userId]) data[userId] = [];

  // Idempoten: jika sudah ada sertifikat untuk kursus ini, kembalikan yang ada
  const existing = data[userId].find(c => c.courseId === courseId);
  if (existing) return { success: true, certificate: existing };

  const session = getSession();
  const userName = session ? session.name : 'Pengguna';
  const course = coursesData.find(c => c.id === courseId);
  const courseTitle = course ? course.title : 'Kursus';
  const year = new Date().getFullYear();
  const seq = (data[userId].length || 0) + 1;

  const certificate = {
    id: `cert_${courseId}_${userId}_${Date.now()}`,
    courseId,
    courseTitle,
    userName,
    issuedAt: new Date().toISOString(),
    credentialId: generateCredentialId(courseId, year, seq),
  };

  data[userId].push(certificate);
  const saved = saveCertificateData(data);
  if (!saved) return { success: false, error: 'storage_error' };

  return { success: true, certificate };
}

/**
 * Mengambil sertifikat yang telah diterbitkan untuk pengguna.
 * @param {string} userId
 * @returns {Array}
 */
function getIssuedCertificates(userId) {
  const data = loadCertificateData();
  return data[userId] || [];
}

/**
 * Render tombol sertifikat di UI course-detail berdasarkan eligibility.
 * @param {string} userId
 * @param {number} courseId
 */
function renderCertificateButton(userId, courseId) {
  const container = document.getElementById('cd-cert-section');
  if (!container) return;

  const eligibility = checkCertificateEligibility(userId, courseId);
  const issued = getIssuedCertificates(userId).find(c => c.courseId === courseId);

  if (issued) {
    container.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:8px">🏆</div>
        <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:4px">Sertifikat Diterbitkan!</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:16px">ID: ${issued.credentialId}</div>
        <button class="btn btn-primary" style="padding:10px 24px;font-size:13px"
          onclick="downloadCert('${issued.courseTitle}','${issued.userName}','${new Date(issued.issuedAt).toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'})}','${issued.credentialId}')">
          Lihat Sertifikat
        </button>
      </div>`;
    return;
  }

  const missingItems = [];
  if (!eligibility.allLessonsDone) missingItems.push('Selesaikan semua lesson');
  if (!eligibility.quizPassed) missingItems.push('Lulus quiz (min. 80%)');

  container.innerHTML = `
    <div style="padding:20px">
      <div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:12px">🎓 Sertifikat Penyelesaian</div>
      ${missingItems.length ? `
        <div style="margin-bottom:16px">
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:8px">Syarat yang belum terpenuhi:</div>
          ${missingItems.map(item => `
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#f87171;margin-bottom:4px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              ${item}
            </div>`).join('')}
        </div>
        <button class="btn btn-outline" style="width:100%;padding:10px;font-size:13px;opacity:0.5;cursor:not-allowed" disabled>
          Generate Sertifikat
        </button>
      ` : `
        <button class="btn btn-primary" style="width:100%;padding:10px;font-size:13px"
          onclick="handleGenerateCertificate('${userId}', ${courseId})">
          Generate Sertifikat 🎉
        </button>
      `}
    </div>`;
}

function handleGenerateCertificate(userId, courseId) {
  const result = issueCertificate(userId, courseId);
  if (result.success) {
    showToast('🎓 Sertifikat berhasil diterbitkan!');
    renderCertificateButton(userId, courseId);
    // Buka sertifikat langsung
    const cert = result.certificate;
    downloadCert(
      cert.courseTitle,
      cert.userName,
      new Date(cert.issuedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      cert.credentialId
    );
  } else {
    showToast('Gagal menerbitkan sertifikat. Pastikan semua syarat terpenuhi.');
  }
}
