// ══════════════════════════════════════════════
// KURSUS 8: AI ETHICS & SAFETY
// ══════════════════════════════════════════════

const courseAIEthics = {
  id: 8,
  curriculum: [
    {
      title: "Modul 1: Fondasi Etika AI",
      lessons: [
        { icon: "▶️", title: "Mengapa Etika AI Penting?", duration: "15 min" },
        { icon: "▶️", title: "Prinsip-Prinsip AI yang Bertanggung Jawab", duration: "20 min" },
        { icon: "📄", title: "Regulasi AI: EU AI Act, GDPR, dan Kebijakan Global", duration: "18 min" },
        { icon: "▶️", title: "Kasus Nyata: Ketika AI Gagal", duration: "22 min" },
      ]
    },
    {
      title: "Modul 2: Bias & Fairness dalam AI",
      lessons: [
        { icon: "▶️", title: "Jenis-Jenis Bias dalam ML", duration: "20 min" },
        { icon: "▶️", title: "Mengukur Fairness: Metrik dan Trade-off", duration: "22 min" },
        { icon: "▶️", title: "Teknik Mitigasi Bias", duration: "20 min" },
        { icon: "💻", title: "Lab: Deteksi Bias dengan Fairlearn", duration: "35 min" },
      ]
    },
    {
      title: "Modul 3: Transparansi & Explainability",
      lessons: [
        { icon: "▶️", title: "Black Box vs Interpretable Models", duration: "18 min" },
        { icon: "▶️", title: "LIME & SHAP: Menjelaskan Prediksi Model", duration: "25 min" },
        { icon: "▶️", title: "Model Cards & Datasheets", duration: "15 min" },
        { icon: "💻", title: "Lab: SHAP Values untuk Random Forest", duration: "35 min" },
      ]
    },
    {
      title: "Modul 4: AI Safety & Privacy",
      lessons: [
        { icon: "▶️", title: "Adversarial Attacks & Robustness", duration: "22 min" },
        { icon: "▶️", title: "Privacy-Preserving ML: Federated Learning, DP", duration: "20 min" },
        { icon: "▶️", title: "AI Alignment Problem", duration: "22 min" },
        { icon: "▶️", title: "Masa Depan AI yang Aman dan Bermanfaat", duration: "20 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa yang dimaksud dengan 'algorithmic bias'?", options: ["Bug dalam kode", "Ketidakadilan sistematis dalam output model akibat data atau desain yang bias", "Model yang terlalu lambat", "Kesalahan dalam deployment"], answer: 1 },
    { q: "Apa itu SHAP dalam konteks Explainable AI?", options: ["Teknik training baru", "Metode untuk menjelaskan kontribusi setiap fitur terhadap prediksi model", "Jenis neural network", "Metrik evaluasi"], answer: 1 },
    { q: "Apa itu Federated Learning?", options: ["Training model di satu server besar", "Training model di perangkat lokal tanpa mengirim data ke server pusat", "Teknik augmentasi data", "Metode kompresi model"], answer: 1 },
    { q: "Apa yang dimaksud dengan 'AI Alignment'?", options: ["Menyejajarkan layer neural network", "Memastikan AI bertindak sesuai dengan nilai dan tujuan manusia", "Teknik optimasi", "Metode evaluasi model"], answer: 1 },
    { q: "Regulasi AI mana yang dikeluarkan oleh Uni Eropa?", options: ["AI Safety Act", "EU AI Act", "Digital AI Regulation", "European ML Policy"], answer: 1 },
  ],
  sources: [
    { label: "TheAIInternship – AI Ethics & Responsible AI Guide 2025", url: "https://theaiinternship.com/blog/ai-ethics-responsible-ai-development-guide-2025/" },
    { label: "Clay Global – Key Ethical Issues in AI", url: "https://clay.global/blog/ai-guide/ethical-issues-in-ai" },
    { label: "FutureInsights – Understanding Bias, Fairness, and Responsible AI", url: "https://www.futureinsights.com/ai-ethics-guide-bias-fairness-2026/" },
    { label: "ZenVanRiel – Understanding Responsible AI Development", url: "https://zenvanriel.nl/ai-engineer-blog/understanding-responsible-ai-development/" },
    { label: "Superblocks – What is Responsible AI? 6 Principles", url: "https://www.superblocks.com/blog/responsible-ai" },
    { label: "SubrosaCyber – Responsible AI Governance Framework", url: "https://subrosacyber.com/en/blog/what-is-responsible-ai-governance" },
    { label: "AIPRomptsx – Responsible AI Use Guide 2026", url: "https://aipromptsx.com/blog/ai-safety-ethics-guide" },
    { label: "Microsoft Fairlearn Documentation", url: "https://fairlearn.org/" },
    { label: "SHAP Official Documentation", url: "https://shap.readthedocs.io/" },
  ]
};

courseAIEthics.materi = `
<div class="materi-section">
  <h2>⚖️ Mengapa Etika AI Penting?</h2>
  <p>AI semakin banyak digunakan untuk membuat keputusan yang berdampak besar pada kehidupan manusia — siapa yang mendapat pinjaman bank, siapa yang diterima kerja, siapa yang dibebaskan dari penjara. Ketika sistem AI membuat keputusan yang salah atau tidak adil, konsekuensinya bisa sangat serius.</p>
  <ul>
    <li><strong>COMPAS (2016):</strong> Algoritma prediksi recidivism yang digunakan pengadilan AS terbukti dua kali lebih sering salah memprediksi orang kulit hitam sebagai "berisiko tinggi" dibanding orang kulit putih.</li>
    <li><strong>Amazon Hiring Tool (2018):</strong> Amazon menonaktifkan tool rekrutmen AI-nya karena terbukti bias terhadap perempuan — dilatih pada resume historis yang didominasi laki-laki.</li>
    <li><strong>Facial Recognition:</strong> Studi MIT menemukan error rate hingga 34% untuk wajah perempuan berkulit gelap, vs 0.8% untuk laki-laki berkulit terang.</li>
    <li><strong>GPT Hallucination:</strong> LLM dapat menghasilkan informasi yang terdengar meyakinkan tapi sepenuhnya salah — berbahaya di konteks medis atau hukum.</li>
  </ul>
  <div class="info-box warn">
    ⚠️ <strong>Penting:</strong> AI tidak secara inheren objektif. AI mencerminkan bias yang ada dalam data training dan keputusan desain yang dibuat oleh manusia.
  </div>
</div>

<div class="materi-section">
  <h2>🏛️ Prinsip-Prinsip Responsible AI</h2>
  <p>Berbagai organisasi (Google, Microsoft, EU, UNESCO) telah menetapkan prinsip-prinsip untuk pengembangan AI yang bertanggung jawab. Meskipun ada variasi, prinsip-prinsip inti yang muncul berulang kali adalah:</p>
  <ul>
    <li><strong>Fairness (Keadilan):</strong> AI tidak boleh mendiskriminasi berdasarkan ras, gender, usia, atau karakteristik lain yang dilindungi. Output harus adil di semua kelompok demografis.</li>
    <li><strong>Transparency (Transparansi):</strong> Proses pengambilan keputusan AI harus dapat dijelaskan dan dipahami oleh pengguna dan pemangku kepentingan.</li>
    <li><strong>Accountability (Akuntabilitas):</strong> Harus ada mekanisme yang jelas untuk melacak dan mengatasi kesalahan atau dampak negatif dari sistem AI.</li>
    <li><strong>Privacy (Privasi):</strong> Data pengguna harus dilindungi. AI tidak boleh mengumpulkan atau menggunakan data secara berlebihan atau tanpa persetujuan.</li>
    <li><strong>Safety & Reliability (Keamanan):</strong> Sistem AI harus bekerja dengan andal dan aman, terutama dalam aplikasi kritis (medis, transportasi, infrastruktur).</li>
    <li><strong>Inclusiveness (Inklusivitas):</strong> AI harus dirancang untuk memberdayakan semua orang, termasuk kelompok yang terpinggirkan.</li>
    <li><strong>Human Oversight (Pengawasan Manusia):</strong> Manusia harus tetap dalam kontrol, terutama untuk keputusan berisiko tinggi.</li>
  </ul>

  <h3>Regulasi AI Global</h3>
  <ul>
    <li><strong>EU AI Act (2024):</strong> Regulasi AI pertama di dunia yang komprehensif. Mengklasifikasikan sistem AI berdasarkan risiko (unacceptable, high, limited, minimal) dan menetapkan persyaratan berbeda untuk setiap kategori.</li>
    <li><strong>GDPR:</strong> Regulasi privasi data Eropa yang mencakup "right to explanation" — pengguna berhak mendapat penjelasan atas keputusan otomatis yang mempengaruhi mereka.</li>
    <li><strong>US Executive Order on AI (2023):</strong> Mewajibkan safety testing untuk model AI yang paling kuat sebelum deployment publik.</li>
    <li><strong>China AI Regulations:</strong> Regulasi untuk generative AI dan deep synthesis (deepfake).</li>
  </ul>
</div>

<div class="materi-section">
  <h2>⚡ Bias dalam Machine Learning</h2>
  <h3>Jenis-Jenis Bias</h3>
  <ul>
    <li><strong>Historical Bias:</strong> Data training mencerminkan ketidakadilan historis. Contoh: data rekrutmen historis yang bias terhadap gender tertentu.</li>
    <li><strong>Representation Bias:</strong> Kelompok tertentu kurang terwakili dalam data training. Contoh: dataset wajah yang didominasi orang kulit putih.</li>
    <li><strong>Measurement Bias:</strong> Cara data dikumpulkan atau dilabeli tidak konsisten antar kelompok.</li>
    <li><strong>Aggregation Bias:</strong> Model dilatih pada populasi gabungan tapi digunakan untuk subkelompok spesifik yang memiliki karakteristik berbeda.</li>
    <li><strong>Deployment Bias:</strong> Model digunakan dalam konteks yang berbeda dari konteks training.</li>
    <li><strong>Feedback Loop Bias:</strong> Prediksi model mempengaruhi data masa depan, memperkuat bias awal. Contoh: polisi lebih banyak patroli di area yang diprediksi berisiko tinggi → lebih banyak penangkapan di sana → model semakin yakin area itu berisiko tinggi.</li>
  </ul>

  <h3>Mengukur Fairness</h3>
  <div class="code-block"><span class="kw">from</span> fairlearn.metrics <span class="kw">import</span> MetricFrame, demographic_parity_difference
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Evaluasi fairness model kredit</span>
metric_frame = MetricFrame(
    metrics=accuracy_score,
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features  <span class="cm"># misal: gender, ras</span>
)

<span class="fn">print</span>(<span class="str">"Akurasi per kelompok:"</span>)
<span class="fn">print</span>(metric_frame.by_group)

<span class="fn">print</span>(<span class="str">f"\nDemographic Parity Difference: {demographic_parity_difference(y_test, y_pred, sensitive_features=sensitive_features):.4f}"</span>)
<span class="cm"># Semakin mendekati 0, semakin adil</span></div>

  <h3>Teknik Mitigasi Bias</h3>
  <ul>
    <li><strong>Pre-processing:</strong> Perbaiki bias di data sebelum training — resampling, reweighting, data augmentation untuk kelompok yang kurang terwakili.</li>
    <li><strong>In-processing:</strong> Tambahkan fairness constraint ke objective function selama training.</li>
    <li><strong>Post-processing:</strong> Sesuaikan threshold prediksi per kelompok untuk mencapai fairness yang diinginkan.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> fairlearn.reductions <span class="kw">import</span> ExponentiatedGradient, DemographicParity
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># Mitigasi bias dengan Exponentiated Gradient</span>
base_estimator = LogisticRegression()
mitigator = ExponentiatedGradient(
    base_estimator,
    constraints=DemographicParity()
)
mitigator.fit(X_train, y_train, sensitive_features=sensitive_train)
y_pred_fair = mitigator.predict(X_test)</div>
</div>

<div class="materi-section">
  <h2>🔍 Explainable AI (XAI)</h2>
  <p>Explainable AI adalah bidang yang berfokus pada membuat keputusan model ML dapat dipahami oleh manusia. Penting untuk kepercayaan, debugging, regulasi, dan deteksi bias.</p>

  <h3>SHAP (SHapley Additive exPlanations)</h3>
  <p>SHAP menggunakan konsep dari game theory (Shapley values) untuk menghitung kontribusi setiap fitur terhadap prediksi individual. Memberikan penjelasan yang konsisten dan akurat secara matematis.</p>
  <div class="code-block"><span class="kw">import</span> shap
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

model = RandomForestClassifier(n_estimators=<span class="num">100</span>).fit(X_train, y_train)

<span class="cm"># Hitung SHAP values</span>
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

<span class="cm"># Summary plot — fitur mana yang paling penting?</span>
shap.summary_plot(shap_values[<span class="num">1</span>], X_test, feature_names=feature_names)

<span class="cm"># Force plot — jelaskan satu prediksi</span>
shap.force_plot(
    explainer.expected_value[<span class="num">1</span>],
    shap_values[<span class="num">1</span>][<span class="num">0</span>],
    X_test.iloc[<span class="num">0</span>],
    feature_names=feature_names
)

<span class="cm"># Waterfall plot</span>
shap.waterfall_plot(shap.Explanation(
    values=shap_values[<span class="num">1</span>][<span class="num">0</span>],
    base_values=explainer.expected_value[<span class="num">1</span>],
    data=X_test.iloc[<span class="num">0</span>],
    feature_names=feature_names
))</div>

  <h3>LIME (Local Interpretable Model-agnostic Explanations)</h3>
  <p>LIME menjelaskan prediksi individual dengan membangun model linear sederhana di sekitar titik data tersebut. Model-agnostic — bekerja untuk model apapun.</p>
  <div class="code-block"><span class="kw">import</span> lime
<span class="kw">import</span> lime.lime_tabular

explainer = lime.lime_tabular.LimeTabularExplainer(
    X_train.values,
    feature_names=feature_names,
    class_names=[<span class="str">'Ditolak'</span>, <span class="str">'Disetujui'</span>],
    mode=<span class="str">'classification'</span>
)

<span class="cm"># Jelaskan prediksi untuk satu sampel</span>
exp = explainer.explain_instance(
    X_test.iloc[<span class="num">0</span>].values,
    model.predict_proba,
    num_features=<span class="num">10</span>
)
exp.show_in_notebook()</div>
</div>

<div class="materi-section">
  <h2>🔒 AI Safety & Privacy</h2>
  <h3>Adversarial Attacks</h3>
  <p>Adversarial examples adalah input yang sengaja dimodifikasi dengan perturbasi kecil (tidak terlihat oleh manusia) untuk menipu model AI. Ancaman serius untuk aplikasi keamanan kritis.</p>
  <ul>
    <li><strong>FGSM (Fast Gradient Sign Method):</strong> Tambahkan perturbasi kecil searah gradient loss untuk memaksimalkan error model.</li>
    <li><strong>PGD (Projected Gradient Descent):</strong> Versi iteratif FGSM yang lebih kuat.</li>
    <li><strong>Adversarial Training:</strong> Latih model dengan adversarial examples untuk meningkatkan robustness.</li>
  </ul>

  <h3>Privacy-Preserving ML</h3>
  <ul>
    <li><strong>Federated Learning:</strong> Model dilatih di perangkat lokal (smartphone, rumah sakit) tanpa data pernah meninggalkan perangkat. Hanya gradient yang dikirim ke server pusat. Digunakan oleh Google untuk keyboard prediction.</li>
    <li><strong>Differential Privacy:</strong> Tambahkan noise yang dikalibrasi ke data atau gradient untuk memberikan jaminan matematis bahwa informasi individu tidak bisa diekstrak dari model.</li>
    <li><strong>Homomorphic Encryption:</strong> Komputasi pada data terenkripsi tanpa perlu mendekripsi — masih sangat lambat untuk praktis.</li>
    <li><strong>Secure Multi-Party Computation:</strong> Beberapa pihak bisa bersama-sama menghitung fungsi dari data mereka tanpa mengungkapkan data masing-masing.</li>
  </ul>
  <div class="code-block"><span class="cm"># Differential Privacy dengan TensorFlow Privacy</span>
<span class="cm"># pip install tensorflow-privacy</span>
<span class="kw">import</span> tensorflow <span class="kw">as</span> tf
<span class="kw">from</span> tensorflow_privacy.privacy.optimizers.dp_optimizer_keras <span class="kw">import</span> DPKerasSGDOptimizer

<span class="cm"># DP-SGD: SGD dengan differential privacy guarantee</span>
optimizer = DPKerasSGDOptimizer(
    l2_norm_clip=<span class="num">1.0</span>,       <span class="cm"># gradient clipping</span>
    noise_multiplier=<span class="num">1.1</span>,   <span class="cm"># noise level</span>
    num_microbatches=<span class="num">256</span>,
    learning_rate=<span class="num">0.01</span>
)

model.compile(optimizer=optimizer, loss=<span class="str">'sparse_categorical_crossentropy'</span>, metrics=[<span class="str">'accuracy'</span>])</div>

  <h3>AI Alignment Problem</h3>
  <p>Salah satu tantangan terbesar dalam AI jangka panjang: bagaimana memastikan sistem AI yang sangat cerdas bertindak sesuai dengan nilai dan tujuan manusia?</p>
  <ul>
    <li><strong>Reward Hacking:</strong> AI menemukan cara untuk memaksimalkan reward yang tidak sesuai dengan tujuan sebenarnya. Contoh klasik: robot pembersih yang belajar menutup matanya agar tidak "melihat" kotoran.</li>
    <li><strong>Instrumental Convergence:</strong> AI yang sangat cerdas cenderung mengembangkan sub-goals tertentu (self-preservation, resource acquisition) terlepas dari tujuan utamanya.</li>
    <li><strong>RLHF sebagai Solusi Parsial:</strong> Melatih AI berdasarkan feedback manusia membantu alignment, tapi tidak sempurna — manusia bisa dimanipulasi atau memiliki preferensi yang tidak konsisten.</li>
    <li><strong>Constitutional AI (Anthropic):</strong> Melatih AI dengan prinsip-prinsip eksplisit dan self-critique untuk meningkatkan keamanan.</li>
  </ul>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="ethics-sources"></ul>
</div>
`;

// ══════════════════════════════════════════════
// QUIZ PER MODUL — AI ETHICS & SAFETY
// Sumber: InterviewNode ML Ethics Questions (interviewnode.com/post/machine-learning-interview-questions-on-ethics-fairness-and-explainability),
//         Databricks SHAP Fairlearn (databricks.com/blog/mitigating-bias-machine-learning-shap-and-fairlearn),
//         MDPI AI Bias Survey (mdpi.com/2413-4155/6/1/3)
// ══════════════════════════════════════════════
courseAIEthics.moduleQuizzes = [
  {
    moduleIndex: 0,
    moduleTitle: "Modul 1: Fondasi Etika AI",
    questions: [
      {
        q: "Mengapa etika AI menjadi semakin penting saat ini?",
        opts: ["Karena AI terlalu mahal", "Karena AI semakin banyak digunakan untuk keputusan yang berdampak besar pada kehidupan manusia", "Karena AI tidak akurat", "Karena AI membutuhkan terlalu banyak data"],
        ans: 1
      },
      {
        q: "Kasus COMPAS (2016) menunjukkan masalah apa dalam AI?",
        opts: ["Model terlalu lambat", "Algoritma prediksi recidivism terbukti bias rasial — lebih sering salah memprediksi orang kulit hitam sebagai berisiko tinggi", "Model tidak akurat secara keseluruhan", "Model terlalu mahal untuk dioperasikan"],
        ans: 1
      },
      {
        q: "Prinsip 'Transparency' dalam Responsible AI berarti...",
        opts: ["AI harus gratis untuk semua", "Proses pengambilan keputusan AI harus dapat dijelaskan dan dipahami", "AI harus open source", "AI tidak boleh menyimpan data"],
        ans: 1
      },
      {
        q: "EU AI Act (2024) mengklasifikasikan sistem AI berdasarkan...",
        opts: ["Harga dan kompleksitas", "Tingkat risiko (unacceptable, high, limited, minimal)", "Negara pembuatnya", "Jumlah pengguna"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan 'Human Oversight' dalam prinsip Responsible AI?",
        opts: ["Manusia harus menulis semua kode AI", "Manusia harus tetap dalam kontrol, terutama untuk keputusan berisiko tinggi", "AI tidak boleh digunakan tanpa pengawasan 24 jam", "Semua keputusan AI harus disetujui manusia"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 1,
    moduleTitle: "Modul 2: Bias & Fairness dalam AI",
    questions: [
      {
        q: "Apa yang dimaksud dengan 'Historical Bias' dalam ML?",
        opts: ["Bug dalam kode lama", "Data training mencerminkan ketidakadilan historis yang ada di masyarakat", "Model yang sudah usang", "Kesalahan dalam preprocessing"],
        ans: 1
      },
      {
        q: "Amazon menonaktifkan tool rekrutmen AI-nya pada 2018 karena...",
        opts: ["Terlalu lambat", "Terbukti bias terhadap perempuan karena dilatih pada resume historis yang didominasi laki-laki", "Terlalu mahal", "Tidak akurat secara keseluruhan"],
        ans: 1
      },
      {
        q: "Demographic Parity sebagai metrik fairness berarti...",
        opts: ["Semua kelompok mendapat akurasi yang sama", "Tingkat prediksi positif harus sama di semua kelompok demografis", "Model harus dilatih dengan data seimbang", "Semua kelompok harus memiliki jumlah data yang sama"],
        ans: 1
      },
      {
        q: "Teknik mitigasi bias 'Pre-processing' dilakukan...",
        opts: ["Setelah model di-deploy", "Sebelum training — memperbaiki bias di data (resampling, reweighting)", "Selama training dengan constraint", "Setelah prediksi dengan threshold adjustment"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan 'Feedback Loop Bias'?",
        opts: ["Bug dalam feedback form", "Prediksi model mempengaruhi data masa depan, memperkuat bias awal secara siklikal", "Bias yang muncul dari feedback pengguna", "Kesalahan dalam evaluasi model"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 2,
    moduleTitle: "Modul 3: Transparansi & Explainability",
    questions: [
      {
        q: "Apa yang dimaksud dengan 'Black Box' model dalam ML?",
        opts: ["Model yang berjalan di server tersembunyi", "Model yang membuat prediksi tanpa penjelasan yang dapat dipahami manusia (misal: deep neural network)", "Model yang tidak akurat", "Model yang hanya bisa diakses oleh admin"],
        ans: 1
      },
      {
        q: "SHAP (SHapley Additive exPlanations) menggunakan konsep dari bidang apa?",
        opts: ["Statistik klasik", "Game theory (Shapley values) untuk menghitung kontribusi setiap fitur", "Teori informasi", "Optimasi konveks"],
        ans: 1
      },
      {
        q: "Apa perbedaan SHAP dan LIME?",
        opts: ["Tidak ada perbedaan", "SHAP memberikan penjelasan global yang konsisten secara matematis, LIME memberikan penjelasan lokal per prediksi dengan model linear sederhana", "LIME lebih akurat dari SHAP", "SHAP hanya untuk tree-based models"],
        ans: 1
      },
      {
        q: "Mengapa Explainable AI (XAI) penting dalam konteks regulasi seperti GDPR?",
        opts: ["Untuk mempercepat model", "GDPR memberikan 'right to explanation' — pengguna berhak mendapat penjelasan atas keputusan otomatis yang mempengaruhi mereka", "Untuk mengurangi biaya komputasi", "Untuk meningkatkan akurasi model"],
        ans: 1
      },
      {
        q: "Model Cards digunakan untuk...",
        opts: ["Menyimpan model ke cloud", "Mendokumentasikan performa model, batasan, dan pertimbangan etika secara transparan", "Mengoptimasi hyperparameter", "Membuat visualisasi model"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 3,
    moduleTitle: "Modul 4: AI Safety & Privacy",
    questions: [
      {
        q: "Adversarial Examples adalah...",
        opts: ["Contoh data yang sulit untuk model", "Input yang sengaja dimodifikasi dengan perturbasi kecil untuk menipu model AI", "Data training yang berkualitas buruk", "Contoh dari domain yang berbeda"],
        ans: 1
      },
      {
        q: "Federated Learning menjaga privasi dengan cara...",
        opts: ["Mengenkripsi semua data", "Model dilatih di perangkat lokal — hanya gradient yang dikirim ke server, data tidak pernah meninggalkan perangkat", "Menghapus data setelah training", "Menggunakan data sintetis"],
        ans: 1
      },
      {
        q: "Differential Privacy memberikan jaminan apa?",
        opts: ["Model 100% akurat", "Jaminan matematis bahwa informasi individu tidak bisa diekstrak dari model atau output statistik", "Data selalu terenkripsi", "Model tidak bisa di-hack"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan 'AI Alignment Problem'?",
        opts: ["Masalah teknis dalam menyejajarkan layer neural network", "Tantangan memastikan sistem AI yang sangat cerdas bertindak sesuai dengan nilai dan tujuan manusia", "Masalah kompatibilitas software", "Kesulitan dalam deployment AI"],
        ans: 1
      }
    ]
  }
];

// ══════════════════════════════════════════════
// QUIZ AKHIR KURSUS — AI ETHICS & SAFETY (20 Soal)
// Sumber: InterviewNode ML Ethics (interviewnode.com/post/machine-learning-interview-questions-on-ethics-fairness-and-explainability),
//         Databricks SHAP Fairlearn (databricks.com/blog/mitigating-bias-machine-learning-shap-and-fairlearn),
//         MDPI AI Bias Survey (mdpi.com/2413-4155/6/1/3)
// ══════════════════════════════════════════════
courseAIEthics.finalQuiz = [
  { q: "Apa yang dimaksud dengan 'algorithmic bias'?", opts: ["Bug dalam kode", "Ketidakadilan sistematis dalam output model akibat data atau desain yang bias", "Model yang terlalu lambat", "Kesalahan dalam deployment"], ans: 1 },
  { q: "Apa itu SHAP dalam Explainable AI?", opts: ["Teknik training baru", "Metode untuk menjelaskan kontribusi setiap fitur terhadap prediksi model", "Jenis neural network", "Metrik evaluasi"], ans: 1 },
  { q: "Apa itu Federated Learning?", opts: ["Training model di satu server besar", "Training model di perangkat lokal tanpa mengirim data ke server pusat", "Teknik augmentasi data", "Metode kompresi model"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'AI Alignment'?", opts: ["Menyejajarkan layer neural network", "Memastikan AI bertindak sesuai dengan nilai dan tujuan manusia", "Teknik optimasi", "Metode evaluasi model"], ans: 1 },
  { q: "Regulasi AI mana yang dikeluarkan oleh Uni Eropa?", opts: ["AI Safety Act", "EU AI Act", "Digital AI Regulation", "European ML Policy"], ans: 1 },
  { q: "Kasus COMPAS menunjukkan masalah apa?", opts: ["Model terlalu lambat", "Bias rasial dalam algoritma prediksi recidivism", "Model tidak akurat", "Model terlalu mahal"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'Historical Bias'?", opts: ["Bug dalam kode lama", "Data training mencerminkan ketidakadilan historis di masyarakat", "Model yang sudah usang", "Kesalahan dalam preprocessing"], ans: 1 },
  { q: "SHAP menggunakan konsep dari bidang apa?", opts: ["Statistik klasik", "Game theory (Shapley values)", "Teori informasi", "Optimasi konveks"], ans: 1 },
  { q: "Differential Privacy memberikan jaminan apa?", opts: ["Model 100% akurat", "Jaminan matematis bahwa informasi individu tidak bisa diekstrak dari model", "Data selalu terenkripsi", "Model tidak bisa di-hack"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'Feedback Loop Bias'?", opts: ["Bug dalam feedback form", "Prediksi model mempengaruhi data masa depan, memperkuat bias awal", "Bias dari feedback pengguna", "Kesalahan dalam evaluasi model"], ans: 1 },
  { q: "Prinsip 'Transparency' dalam Responsible AI berarti...", opts: ["AI harus gratis", "Proses pengambilan keputusan AI harus dapat dijelaskan dan dipahami", "AI harus open source", "AI tidak boleh menyimpan data"], ans: 1 },
  { q: "Teknik mitigasi bias 'Pre-processing' dilakukan...", opts: ["Setelah model di-deploy", "Sebelum training — memperbaiki bias di data", "Selama training dengan constraint", "Setelah prediksi dengan threshold adjustment"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'Black Box' model?", opts: ["Model yang berjalan di server tersembunyi", "Model yang membuat prediksi tanpa penjelasan yang dapat dipahami manusia", "Model yang tidak akurat", "Model yang hanya bisa diakses admin"], ans: 1 },
  { q: "GDPR memberikan 'right to explanation' yang berarti...", opts: ["Pengguna bisa melihat kode model", "Pengguna berhak mendapat penjelasan atas keputusan otomatis yang mempengaruhi mereka", "Pengguna bisa menghapus model", "Pengguna bisa mengubah keputusan model"], ans: 1 },
  { q: "Adversarial Examples adalah...", opts: ["Contoh data yang sulit untuk model", "Input yang sengaja dimodifikasi dengan perturbasi kecil untuk menipu model AI", "Data training berkualitas buruk", "Contoh dari domain berbeda"], ans: 1 },
  { q: "Model Cards digunakan untuk...", opts: ["Menyimpan model ke cloud", "Mendokumentasikan performa, batasan, dan pertimbangan etika model secara transparan", "Mengoptimasi hyperparameter", "Membuat visualisasi model"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'Representation Bias'?", opts: ["Model yang terlalu besar", "Kelompok tertentu kurang terwakili dalam data training", "Bias dalam representasi visual", "Kesalahan dalam encoding data"], ans: 1 },
  { q: "LIME (Local Interpretable Model-agnostic Explanations) menjelaskan prediksi dengan...", opts: ["Menghitung Shapley values", "Membangun model linear sederhana di sekitar titik data yang ingin dijelaskan", "Menggunakan gradient", "Menampilkan feature importance global"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'Reward Hacking' dalam AI Safety?", opts: ["Meretas sistem reward", "AI menemukan cara memaksimalkan reward yang tidak sesuai tujuan sebenarnya", "Memanipulasi data reward", "Mengurangi reward secara artifisial"], ans: 1 },
  { q: "Demographic Parity sebagai metrik fairness berarti...", opts: ["Semua kelompok mendapat akurasi sama", "Tingkat prediksi positif harus sama di semua kelompok demografis", "Model dilatih dengan data seimbang", "Semua kelompok memiliki jumlah data sama"], ans: 1 }
];
