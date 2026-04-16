// -- QUIZZES --
// QUIZZES
// ----------------------------------------------
const quizBank = [
  { id:'ml-basics', title:'Machine Learning Basics', desc:'Test your understanding of ML concepts.', icon:'cpu', iconBg:'linear-gradient(135deg,#1e1b4b,#312e81)', iconColor:'#a78bfa', category:'Machine Learning', questions:10, time:'15 min', difficulty:'Beginner', pts:100,
    qs:[
      {q:'Apa itu Machine Learning?',opts:['Pemrograman eksplisit','Komputer belajar dari data tanpa diprogram eksplisit','Jenis database','Bahasa pemrograman'],ans:1},
      {q:'Mana yang termasuk Supervised Learning?',opts:['K-Means','PCA','Linear Regression','DBSCAN'],ans:2},
      {q:'Apa itu overfitting?',opts:['Model terlalu sederhana','Model hafal training tapi buruk di data baru','Model tidak bisa dilatih','Model terlalu cepat'],ans:1},
      {q:'Metrik untuk dataset imbalanced?',opts:['Accuracy','F1-Score','MSE','R-squared'],ans:1},
      {q:'Fungsi Cross-Validation?',opts:['Mempercepat training','Evaluasi model lebih robust','Mengurangi dataset','Meningkatkan akurasi otomatis'],ans:1},
      {q:'Algoritma cocok untuk klasifikasi teks?',opts:['Linear Regression','Naive Bayes','K-Means','PCA'],ans:1},
      {q:'Apa itu feature scaling?',opts:['Menambah fitur baru','Normalisasi skala fitur agar seragam','Menghapus fitur','Membuat model lebih besar'],ans:1},
      {q:'Random Forest adalah contoh dari?',opts:['Single model','Ensemble method','Unsupervised learning','Reinforcement learning'],ans:1},
      {q:'Apa itu confusion matrix?',opts:['Matriks kebingungan','Tabel performa model klasifikasi','Teknik visualisasi','Metode training'],ans:1},
      {q:'Perbedaan precision dan recall?',opts:['Tidak ada','Precision: ketepatan positif, Recall: kelengkapan deteksi positif','Precision lebih penting','Recall hanya untuk regresi'],ans:1},
    ]},
  { id:'python-ai', title:'Python for AI', desc:'Test your Python skills for AI development.', icon:'code-2', iconBg:'linear-gradient(135deg,#14532d,#166534)', iconColor:'#4ade80', category:'Machine Learning', questions:8, time:'20 min', difficulty:'Beginner', pts:150,
    qs:[
      {q:'Library Python untuk komputasi array numerik?',opts:['Pandas','Matplotlib','NumPy','Seaborn'],ans:2},
      {q:'Output: np.array([1,2,3]).shape?',opts:['(1,3)','(3,)','[3]','3'],ans:1},
      {q:'Fungsi Pandas untuk statistik deskriptif?',opts:['df.info()','df.describe()','df.head()','df.shape'],ans:1},
      {q:'Apa itu Broadcasting dalam NumPy?',opts:['Kirim data ke server','Operasi array shape berbeda otomatis','Siarkan hasil','Kompresi data'],ans:1},
      {q:'Library paling populer untuk deep learning?',opts:['Scikit-learn','Pandas','TensorFlow/PyTorch','Matplotlib'],ans:2},
      {q:'Cara membaca CSV dengan Pandas?',opts:['pd.open_csv()','pd.read_csv()','pd.load_csv()','pd.import_csv()'],ans:1},
      {q:'Apa itu list comprehension?',opts:['Cara membuat list panjang','Sintaks ringkas untuk membuat list dari iterable','Fungsi bawaan','Tipe data baru'],ans:1},
      {q:'Fungsi train_test_split?',opts:['Melatih model','Membagi dataset menjadi training dan testing','Menguji model','Membagi fitur'],ans:1},
    ]},
  { id:'dl-basics', title:'Deep Learning Fundamentals', desc:'Challenge yourself with deep learning concepts.', icon:'network', iconBg:'linear-gradient(135deg,#1e3a5f,#1e40af)', iconColor:'#60a5fa', category:'Deep Learning', questions:10, time:'30 min', difficulty:'Intermediate', pts:200,
    qs:[
      {q:'Fungsi activation function?',opts:['Mempercepat training','Menambahkan non-linearitas','Mengurangi ukuran model','Inisialisasi weights'],ans:1},
      {q:'Apa itu Backpropagation?',opts:['Forward pass data','Algoritma hitung gradient & update weights','Teknik regularisasi','Inisialisasi weights'],ans:1},
      {q:'Mengapa LSTM lebih baik dari RNN biasa?',opts:['Lebih cepat','Memory cell mengatasi vanishing gradient','Lebih sedikit parameter','Tidak perlu training'],ans:1},
      {q:'Apa itu Transfer Learning?',opts:['Pindah data antar server','Gunakan model pre-trained untuk task baru','Kompresi model','Augmentasi data'],ans:1},
      {q:'Yang membedakan Transformer dari RNN?',opts:['Lebih banyak layer','Self-Attention Mechanism','Penggunaan CNN','Batch size lebih besar'],ans:1},
      {q:'Apa itu Dropout?',opts:['Menghapus data','Mematikan neuron acak saat training untuk regularisasi','Teknik optimasi','Jenis activation function'],ans:1},
      {q:'Apa itu Batch Normalization?',opts:['Normalisasi ukuran batch','Normalisasi aktivasi layer untuk mempercepat training','Teknik augmentasi','Metode inisialisasi'],ans:1},
      {q:'Optimizer paling populer saat ini?',opts:['SGD','RMSprop','Adam','Adagrad'],ans:2},
      {q:'Apa itu vanishing gradient?',opts:['Gradient terlalu besar','Gradient mengecil eksponensial saat backprop di layer dalam','Gradient hilang dari memori','Teknik regularisasi'],ans:1},
      {q:'CNN cocok untuk data apa?',opts:['Time series','Teks','Gambar/data grid','Tabular'],ans:2},
    ]},
  { id:'nlp-basics', title:'Natural Language Processing', desc:'Test your NLP knowledge and text processing skills.', icon:'message-square', iconBg:'linear-gradient(135deg,#3b1f5e,#6d28d9)', iconColor:'#c084fc', category:'NLP', questions:8, time:'25 min', difficulty:'Intermediate', pts:150,
    qs:[
      {q:'Apa itu Tokenization?',opts:['Enkripsi teks','Memecah teks menjadi unit kecil','Menerjemahkan teks','Mengompres teks'],ans:1},
      {q:'Perbedaan TF-IDF vs Bag of Words?',opts:['TF-IDF lebih lambat','TF-IDF mempertimbangkan frekuensi di seluruh dokumen','BoW lebih akurat','Tidak ada perbedaan'],ans:1},
      {q:'Keunggulan Word2Vec dibanding BoW?',opts:['Lebih cepat','Menangkap makna semantik antar kata','Lebih sedikit memori','Tidak perlu training'],ans:1},
      {q:'Apa itu Named Entity Recognition?',opts:['Mengenali nama file','Identifikasi entitas (orang, tempat, org) dalam teks','Memberi nama model','Teknik tokenisasi'],ans:1},
      {q:'Apa itu RAG?',opts:['Teknik training baru','Gabungkan retrieval dokumen dengan generasi LLM','Jenis tokenizer','Metode fine-tuning'],ans:1},
      {q:'BERT adalah model jenis apa?',opts:['Autoregressive decoder','Bidirectional encoder','CNN untuk teks','RNN biasa'],ans:1},
      {q:'Apa itu stop words?',opts:['Kata yang menghentikan program','Kata umum yang sering dihapus saat preprocessing','Kata kunci penting','Kata asing'],ans:1},
      {q:'Perbedaan stemming dan lemmatization?',opts:['Tidak ada','Stemming potong akhiran kasar, lemmatization kembalikan ke bentuk dasar kamus','Lemmatization lebih cepat','Stemming lebih akurat'],ans:1},
    ]},
  { id:'cv-basics', title:'Computer Vision Basics', desc:'Test your understanding of CV concepts.', icon:'eye', iconBg:'linear-gradient(135deg,#1c3a2e,#065f46)', iconColor:'#34d399', category:'Computer Vision', questions:5, time:'10 min', difficulty:'Beginner', pts:120,
    qs:[
      {q:'Berapa channel gambar RGB?',opts:['1','2','3','4'],ans:2},
      {q:'Fungsi Pooling Layer dalam CNN?',opts:['Menambah parameter','Mengurangi dimensi spatial','Meningkatkan resolusi','Menambah channel'],ans:1},
      {q:'YOLO terkenal karena?',opts:['Akurasi tertinggi','Kecepatan real-time detection','Ukuran model kecil','Mudah dilatih'],ans:1},
      {q:'Apa itu Transfer Learning dalam CV?',opts:['Pindah gambar antar server','Gunakan model pre-trained ImageNet untuk task baru','Augmentasi data','Kompresi gambar'],ans:1},
      {q:'Library Python paling populer untuk CV?',opts:['Pandas','NumPy','OpenCV','Matplotlib'],ans:2},
    ]},
];

// Category counts dihitung dari quizBank yang ada
const quizCategories = [
  { name:'Machine Learning', icon:'cpu',           bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
  { name:'Deep Learning',    icon:'network',       bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { name:'NLP',              icon:'message-square',bg:'rgba(168,85,247,0.15)', color:'#c084fc' },
  { name:'Computer Vision',  icon:'eye',           bg:'rgba(16,185,129,0.15)', color:'#34d399' },
  { name:'AI Ethics',        icon:'shield',        bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
].map(cat => ({
  ...cat,
  count: quizBank.filter(q => q.category === cat.name).length,
}));

let activeQuiz = null, quizCurrentQ = 0, quizScore = 0, quizAnswered = {}, activeQzCat = 'all';

function renderQuizCards() { renderQuizPage(); }
function renderQuizPage() { renderQzStats(); renderQzCategories(); renderQzList(); renderQzRecentActivity(); }

function renderQzStats() {
  const el = document.getElementById('qz-stats-bar'); if (!el) return;
  const scores = store.get('quiz_scores', {});
  const completed = Object.keys(scores).length;
  const avgScore = completed ? Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/completed) : 0;
  const session = getSession();
  const stats = [
    { val: avgScore ? avgScore + '%' : '-', label:'Avg. Score',        badge: null, icon:'target',       bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
    { val: completed || 0,                  label:'Quizzes Completed',  badge: null, icon:'check-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    { val: session?.streak || 0,            label:'Day Streak',         badge: null, icon:'flame',        bg:'rgba(239,68,68,0.15)',  color:'#f87171' },
    { val: (session?.points || 0).toLocaleString(), label:'Total Points', badge: null, icon:'star',       bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  ];
  el.innerHTML = stats.map(s=>`<div class="qz-stat-card"><div class="qz-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:22px;height:22px;color:${s.color}"></i></div><div><div style="display:flex;align-items:baseline;gap:8px"><div class="qz-stat-val">${s.val}</div>${s.badge?`<div class="qz-stat-badge">${s.badge}</div>`:''}</div><div class="qz-stat-label">${s.label}</div></div></div>`).join('');
  lucide.createIcons();
}
function renderQzCategories() {
  const el = document.getElementById('qz-cat-row'); if (!el) return;
  el.innerHTML = quizCategories.map(c=>`<div class="qz-cat-card ${activeQzCat===c.name?'active':''}" onclick="filterQzCat('${c.name}')"><div class="qz-cat-icon" style="background:${c.bg}"><i data-lucide="${c.icon}" style="width:22px;height:22px;color:${c.color}"></i></div><div class="qz-cat-name">${c.name}</div><div class="qz-cat-count">${c.count} Quizzes</div></div>`).join('');
  lucide.createIcons();
}
function filterQzCat(cat) { activeQzCat = activeQzCat===cat?'all':cat; renderQzCategories(); renderQzList(); }
function filterQuizList(f, btn) { document.querySelectorAll('.qz-ftab').forEach(t=>t.classList.remove('active')); btn.classList.add('active'); renderQzList(); }
function renderQzList() {
  const el = document.getElementById('qz-list'); if (!el) return;
  const scores = store.get('quiz_scores', {});
  const list = activeQzCat==='all' ? quizBank : quizBank.filter(q=>q.category===activeQzCat);
  el.innerHTML = list.map(q => {
    const score = scores[q.id]; const done = score !== undefined;
    return `<div class="qz-item" onclick="startQuiz('${q.id}')">
      <div class="qz-item-thumb" style="background:${q.iconBg}"><i data-lucide="${q.icon}" style="width:26px;height:26px;color:${q.iconColor}"></i></div>
      <div style="flex:1;min-width:0">
        <div class="qz-item-title">${q.title}</div>
        <div class="qz-item-desc">${q.desc}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px">
          <span class="badge ${q.difficulty==='Beginner'?'badge-green':'badge-purple'}" style="font-size:10px">${q.difficulty}</span>
          ${done?`<div style="display:flex;align-items:center;gap:6px;flex:1;max-width:140px"><div class="progress-bar" style="height:4px;flex:1"><div class="progress-fill" style="width:${score}%"></div></div><span style="font-size:10px;color:var(--text-muted)">${score}%</span></div>`:''}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin-left:16px;flex-shrink:0">
        <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px"><i data-lucide="help-circle" style="width:11px;height:11px"></i> ${q.questions} Questions</span>
        <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px"><i data-lucide="clock" style="width:11px;height:11px"></i> ${q.time}</span>
        <span class="qz-pts">+ ${q.pts} pts</span>
      </div>
      <div style="margin-left:14px;flex-shrink:0"><button class="btn btn-primary" style="padding:8px 18px;font-size:12px" onclick="event.stopPropagation();startQuiz('${q.id}')">${done?'Retry':'Start Quiz'}</button></div>
    </div>`;
  }).join('');
  lucide.createIcons();
}
function renderQzRecentActivity() {
  const el = document.getElementById('qz-recent-activity'); if (!el) return;
  const scores = store.get('quiz_scores', {});
  if (!Object.keys(scores).length) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada aktivitas quiz.</div>`;
    return;
  }
  const colors = ['#34d399','#a78bfa','#60a5fa','#fbbf24'];
  el.innerHTML = Object.entries(scores).map(([id, score], i) => {
    const quiz = quizBank.find(q => q.id === id);
    const color = colors[i % colors.length];
    return `<div class="qz-recent-item">
      <div class="qz-recent-dot" style="background:${color}20"><i data-lucide="zap" style="width:12px;height:12px;color:${color}"></i></div>
      <div style="flex:1"><div class="qz-recent-text">Scored ${score}% on ${quiz?.title || id}</div></div>
      <div class="qz-recent-pts" style="color:${color}">Best: ${score}%</div>
    </div>`;
  }).join('');
  lucide.createIcons();
}
function startQuiz(id) {
  activeQuiz = quizBank.find(q=>q.id===id); if (!activeQuiz) return;

  // Cek batas percobaan harian via API
  const session = getSession();
  if (session) {
    checkQuizAttemptAsync(id).then(status => {
      if (!status.canAttempt) {
        showToast(`Quiz terkunci. Batas ${status.maxAttempts}x percobaan hari ini tercapai. Coba lagi besok!`);
        return;
      }
      _startQuizPlay();
    });
  } else {
    _startQuizPlay();
  }
}

function _startQuizPlay() {
  quizCurrentQ=0; quizScore=0; quizAnswered={};
  document.getElementById('quiz-list-view').style.display='none';
  document.getElementById('quiz-play-view').style.display='block';
  document.getElementById('quiz-play-title').textContent=activeQuiz.title;
  document.getElementById('quiz-play-subtitle').textContent=`${activeQuiz.questions} soal � ${activeQuiz.time} � ${activeQuiz.pts} pts`;
  renderQuizQuestion();
}
function renderQuizQuestion() {
  const q = activeQuiz.qs[quizCurrentQ]; const total = activeQuiz.qs.length;
  document.getElementById('quiz-play-progress').style.width=((quizCurrentQ/total)*100)+'%';
  document.getElementById('quiz-play-content').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span style="font-size:12px;color:var(--text-muted)">Soal ${quizCurrentQ+1} dari ${total}</span>
      <span style="font-size:12px;color:var(--accent-light);font-weight:600">Skor: ${quizScore}</span>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="quiz-play-q">${q.q}</div>
      ${q.opts.map((opt,i)=>`<button class="quiz-play-option" onclick="answerQuizPlay(${i},${q.ans})" id="qopt-${i}" style="display:flex;align-items:center"><span style="width:26px;height:26px;border-radius:50%;background:var(--input-bg);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:10px;flex-shrink:0">${String.fromCharCode(65+i)}</span>${opt}</button>`).join('')}
      <div id="quiz-feedback" style="display:none;margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px"></div>
    </div>
    <div class="quiz-play-nav" id="quiz-nav" style="display:none">
      <span style="font-size:13px;color:var(--text-muted)">${quizCurrentQ+1} / ${total}</span>
      <button class="btn btn-primary" style="padding:10px 24px;font-size:13px" onclick="nextQuizQ()">${quizCurrentQ+1<total?'Next ?':'See Results'}</button>
    </div>`;
}
function answerQuizPlay(selected, correct) {
  if (quizAnswered[quizCurrentQ]!==undefined) return;
  quizAnswered[quizCurrentQ]=selected;
  const isCorrect = selected===correct;
  if (isCorrect) quizScore++;
  document.querySelectorAll('.quiz-play-option').forEach((btn,i)=>{ btn.disabled=true; if(i===correct) btn.classList.add('correct'); else if(i===selected) btn.classList.add('wrong'); });
  const fb = document.getElementById('quiz-feedback');
  fb.style.display='block';
  fb.style.background=isCorrect?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)';
  fb.style.border=`1px solid ${isCorrect?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`;
  fb.style.color=isCorrect?'#34d399':'#fca5a5';
  fb.innerHTML=isCorrect?'? Benar!':`? Salah. Jawaban benar: <strong>${String.fromCharCode(65+correct)}. ${activeQuiz.qs[quizCurrentQ].opts[correct]}</strong>`;
  document.getElementById('quiz-nav').style.display='flex';
}
function nextQuizQ() { quizCurrentQ++; if(quizCurrentQ>=activeQuiz.qs.length){showQuizFinalResult();return;} renderQuizQuestion(); }
function showQuizFinalResult() {
  const total=activeQuiz.qs.length; const pct=Math.round((quizScore/total)*100);
  const scores=store.get('quiz_scores',{}); const isNew=!scores[activeQuiz.id]||pct>scores[activeQuiz.id];
  if(isNew){scores[activeQuiz.id]=pct;store.set('quiz_scores',scores);}

  // Catat percobaan ke API (async, non-blocking)
  const session = getSession();
  if (session) {
    recordQuizAttemptAsync(activeQuiz.id, pct).then(result => {
      if (result?.error === 'daily_limit_reached') {
        showToast('Batas percobaan hari ini tercapai.');
      }
    }).catch(() => {});
  }
  document.getElementById('quiz-play-progress').style.width='100%';
  document.getElementById('quiz-play-content').innerHTML=`<div class="card" style="text-align:center;padding:40px 24px">
    <div style="font-size:60px;margin-bottom:16px">${pct>=80?'??':pct>=60?'??':'??'}</div>
    <div style="font-size:32px;font-weight:700;margin-bottom:4px">${quizScore}/${total}</div>
    <div style="font-size:24px;color:var(--accent-light);font-weight:700;margin-bottom:8px">${pct}%</div>
    ${isNew?'<div class="badge badge-green" style="margin-bottom:12px;display:inline-block">New Best Score!</div>':''}
    <div style="font-size:14px;color:var(--text-secondary);margin-bottom:8px">${pct>=80?'Luar biasa!':pct>=60?'Bagus! Terus tingkatkan.':'Yuk pelajari lagi materinya.'}</div>
    <div style="font-size:13px;color:var(--accent-light);font-weight:600;margin-bottom:24px">+${Math.round(activeQuiz.pts*pct/100)} pts earned</div>
    <div style="display:flex;gap:10px;justify-content:center">
      <button class="btn btn-outline" style="padding:10px 24px" onclick="startQuiz('${activeQuiz.id}')">Try Again</button>
      <button class="btn btn-primary" style="padding:10px 24px" onclick="exitQuizPlay()">Done</button>
    </div></div>`;
}
function exitQuizPlay() {
  activeQuiz=null;
  document.getElementById('quiz-list-view').style.display='block';
  document.getElementById('quiz-play-view').style.display='none';
  renderQuizPage();
}


// Load more quizzes (show all categories)
function loadMoreQuizzes(btn) {
  activeQzCat = 'all';
  renderQzCategories();
  renderQzList();
  btn.style.display = 'none';
  showToast('Semua quiz ditampilkan!');
}
