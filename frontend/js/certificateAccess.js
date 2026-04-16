// ══════════════════════════════════════════════
// CERTIFICATE ACCESS — Penerbitan Sertifikat (API + localStorage fallback)
// ══════════════════════════════════════════════

// ── localStorage helpers ──

function loadCertificateData() {
  const raw = store.get('certificates', {});
  return (typeof raw === 'object' && raw !== null) ? raw : {};
}

function saveCertificateData(data) {
  try { store.set('certificates', data); return true; }
  catch (e) { console.error('[CertificateAccess] storage error:', e); return false; }
}

function _generateCredentialIdLocal(courseId, year, seq) {
  const course = coursesData.find(c => c.id === courseId);
  const code = course
    ? course.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
    : 'CRS';
  return `LTX-${code}-${year}-${String(seq).padStart(3, '0')}`;
}

function _syncCertificatesToLocal(userId, apiCerts) {
  const data = loadCertificateData();
  data[userId] = apiCerts.map(c => ({
    id:           c.id,
    courseId:     c.course_id,
    courseTitle:  c.course_title,
    userName:     c.user_name,
    issuedAt:     c.issued_at,
    credentialId: c.credential_id,
  }));
  saveCertificateData(data);
}

// ── Eligibility check (sync, pakai localStorage) ──

function checkCertificateEligibility(userId, courseId) {
  const allLessonsDone = isAllLessonsCompleted(userId, courseId);

  // Cek quiz akhir kursus sudah lulus (format: "final-{courseId}")
  const finalQuizId = `final-${courseId}`;
  const finalQuizStatus = getQuizPassStatus(userId, finalQuizId);
  const quizPassed = finalQuizStatus.passed;

  return { eligible: allLessonsDone && quizPassed, allLessonsDone, quizPassed };
}

// ── API-first: ambil sertifikat ──

async function getIssuedCertificatesAsync(userId) {
  const session = getSession();
  if (!session?.token) return getIssuedCertificates(userId);

  try {
    const data = await CertificatesAPI.getMine();
    _syncCertificatesToLocal(userId, data.certificates);
    return data.certificates.map(c => ({
      id:           c.id,
      courseId:     c.course_id,
      courseTitle:  c.course_title,
      userName:     c.user_name,
      issuedAt:     c.issued_at,
      credentialId: c.credential_id,
    }));
  } catch (err) {
    console.warn('[CertificateAccess] API tidak tersedia, pakai localStorage.', err);
    return getIssuedCertificates(userId);
  }
}

// ── API-first: terbitkan sertifikat ──

async function issueCertificateAsync(userId, courseId) {
  const session = getSession();
  if (!session?.token) return _issueCertificateLocal(userId, courseId);

  try {
    const data = await CertificatesAPI.issue(courseId);
    // Sync ke localStorage
    const cert = {
      id:           data.certificate.id,
      courseId:     data.certificate.course_id,
      courseTitle:  data.certificate.course_title,
      userName:     data.certificate.user_name,
      issuedAt:     data.certificate.issued_at,
      credentialId: data.certificate.credential_id,
    };
    const localData = loadCertificateData();
    if (!localData[userId]) localData[userId] = [];
    const exists = localData[userId].find(c => c.courseId === courseId);
    if (!exists) localData[userId].push(cert);
    saveCertificateData(localData);
    return { success: true, certificate: cert };
  } catch (err) {
    if (err?.error === 'not_eligible') return { success: false, error: 'not_eligible' };
    console.warn('[CertificateAccess] API tidak tersedia, pakai localStorage.', err);
    return _issueCertificateLocal(userId, courseId);
  }
}

// ── localStorage fallback ──

function _issueCertificateLocal(userId, courseId) {
  const eligibility = checkCertificateEligibility(userId, courseId);
  if (!eligibility.eligible) return { success: false, error: 'not_eligible' };

  const data = loadCertificateData();
  if (!data[userId]) data[userId] = [];

  const existing = data[userId].find(c => c.courseId === courseId);
  if (existing) return { success: true, certificate: existing };

  const session  = getSession();
  const course   = coursesData.find(c => c.id === courseId);
  const year     = new Date().getFullYear();
  const seq      = (data[userId].length || 0) + 1;

  const certificate = {
    id:           `cert_${courseId}_${userId}_${Date.now()}`,
    courseId,
    courseTitle:  course?.title || 'Kursus',
    userName:     session?.name || 'Pengguna',
    issuedAt:     new Date().toISOString(),
    credentialId: _generateCredentialIdLocal(courseId, year, seq),
  };

  data[userId].push(certificate);
  return saveCertificateData(data) ? { success: true, certificate } : { success: false, error: 'storage_error' };
}

// ── Sync wrappers (kompatibilitas kode lama) ──

function issueCertificate(userId, courseId) {
  return _issueCertificateLocal(userId, courseId);
}

function getIssuedCertificates(userId) {
  return loadCertificateData()[userId] || [];
}

// ── UI: render tombol sertifikat di course-detail ──

function renderCertificateButton(userId, courseId) {
  const container = document.getElementById('cd-cert-section');
  if (!container) return;

  // Load dari API dulu
  getIssuedCertificatesAsync(userId).then(certs => {
    const issued = certs.find(c => c.courseId === courseId);
    const eligibility = checkCertificateEligibility(userId, courseId);
    _renderCertButtonUI(container, issued, eligibility, userId, courseId);
  }).catch(() => {
    const issued = getIssuedCertificates(userId).find(c => c.courseId === courseId);
    const eligibility = checkCertificateEligibility(userId, courseId);
    _renderCertButtonUI(container, issued, eligibility, userId, courseId);
  });
}

function _renderCertButtonUI(container, issued, eligibility, userId, courseId) {
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
  if (!eligibility.quizPassed)     missingItems.push('Lulus quiz akhir kursus (min. 80%)');

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
  const btn = event?.target;
  if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }

  issueCertificateAsync(userId, courseId).then(result => {
    if (result.success) {
      showToast('🎓 Sertifikat berhasil diterbitkan!');
      renderCertificateButton(userId, courseId);
      const cert = result.certificate;
      downloadCert(
        cert.courseTitle, cert.userName,
        new Date(cert.issuedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        cert.credentialId
      );
    } else {
      showToast('Gagal menerbitkan sertifikat. Pastikan semua syarat terpenuhi.');
      if (btn) { btn.disabled = false; btn.textContent = 'Generate Sertifikat 🎉'; }
    }
  });
}
