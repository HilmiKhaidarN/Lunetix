// ══════════════════════════════════════════════
// KURSUS 1: MACHINE LEARNING FUNDAMENTALS
// ══════════════════════════════════════════════

const courseML = {
  id: 1,
  curriculum: [
    {
      title: "Modul 1: Pengenalan Machine Learning",
      lessons: [
        { icon: "▶️", title: "Apa itu Machine Learning?", duration: "12 min" },
        { icon: "▶️", title: "Sejarah dan Perkembangan ML", duration: "10 min" },
        { icon: "📄", title: "Perbedaan AI, ML, dan Deep Learning", duration: "8 min" },
        { icon: "▶️", title: "Aplikasi ML di Dunia Nyata", duration: "15 min" },
      ]
    },
    {
      title: "Modul 2: Jenis-Jenis Machine Learning",
      lessons: [
        { icon: "▶️", title: "Supervised Learning", duration: "20 min" },
        { icon: "▶️", title: "Unsupervised Learning", duration: "18 min" },
        { icon: "▶️", title: "Reinforcement Learning (Intro)", duration: "14 min" },
        { icon: "💻", title: "Lab: Klasifikasi Pertama dengan Scikit-learn", duration: "30 min" },
      ]
    },
    {
      title: "Modul 3: Algoritma Dasar ML",
      lessons: [
        { icon: "▶️", title: "Linear Regression", duration: "22 min" },
        { icon: "▶️", title: "Logistic Regression", duration: "20 min" },
        { icon: "▶️", title: "Decision Tree & Random Forest", duration: "25 min" },
        { icon: "▶️", title: "K-Nearest Neighbors (KNN)", duration: "18 min" },
        { icon: "▶️", title: "Support Vector Machine (SVM)", duration: "22 min" },
        { icon: "💻", title: "Lab: Implementasi 5 Algoritma", duration: "45 min" },
      ]
    },
    {
      title: "Modul 4: Evaluasi Model",
      lessons: [
        { icon: "▶️", title: "Train/Test Split & Cross Validation", duration: "16 min" },
        { icon: "▶️", title: "Confusion Matrix, Precision, Recall, F1", duration: "20 min" },
        { icon: "▶️", title: "Overfitting & Underfitting", duration: "18 min" },
        { icon: "▶️", title: "Hyperparameter Tuning dengan GridSearchCV", duration: "22 min" },
      ]
    },
    {
      title: "Modul 5: Feature Engineering & Pipeline",
      lessons: [
        { icon: "▶️", title: "Data Preprocessing", duration: "20 min" },
        { icon: "▶️", title: "Feature Scaling & Normalization", duration: "15 min" },
        { icon: "▶️", title: "Handling Missing Values", duration: "14 min" },
        { icon: "💻", title: "Proyek Akhir: Prediksi Harga Rumah", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa perbedaan utama antara Supervised dan Unsupervised Learning?", options: ["Supervised menggunakan GPU, Unsupervised tidak", "Supervised menggunakan data berlabel, Unsupervised tidak", "Supervised lebih lambat dari Unsupervised", "Tidak ada perbedaan"], answer: 1 },
    { q: "Algoritma mana yang paling cocok untuk prediksi nilai kontinu seperti harga rumah?", options: ["Logistic Regression", "K-Means Clustering", "Linear Regression", "Decision Tree Classifier"], answer: 2 },
    { q: "Apa yang dimaksud dengan overfitting?", options: ["Model terlalu sederhana", "Model hafal data training tapi buruk di data baru", "Model tidak bisa dilatih", "Model membutuhkan terlalu banyak memori"], answer: 1 },
    { q: "Metrik apa yang paling tepat untuk dataset yang tidak seimbang (imbalanced)?", options: ["Accuracy", "F1-Score", "Mean Squared Error", "R-squared"], answer: 1 },
    { q: "Apa fungsi Cross-Validation?", options: ["Mempercepat training", "Mengevaluasi model secara lebih robust dengan multiple splits", "Mengurangi ukuran dataset", "Meningkatkan akurasi secara otomatis"], answer: 1 },
  ],
  sources: [
    { label: "GeeksforGeeks – Machine Learning Tutorial", url: "https://www.geeksforgeeks.org/machine-learning/machine-learning/" },
    { label: "Python Guides – Machine Learning with Python", url: "https://pythonguides.com/machine-learning-tutorials/" },
    { label: "Clynt – AI and Machine Learning for Beginners", url: "https://clynt.com/blog/ai-machine-learning/getting-started/ai-ml-beginners-guide" },
    { label: "Sanfoundry – ML Tutorial Beginner to Advanced", url: "https://www.sanfoundry.com/machine-learning-tutorial/" },
    { label: "YetiAI – Ultimate Guide to Master ML Basics", url: "https://yetiai.com/machine-learning-tutorial-for-beginners/" },
    { label: "HuggingFace – ML & DL Mastery Guide", url: "https://huggingface.co/blog/info5ec/ml-dl-mastery-guide" },
    { label: "IndiBlogHub – ML Fundamentals Practical Guide", url: "https://indibloghub.com/post/machine-learning-fundamentals-practical-beginner-guide" },
    { label: "Scikit-learn Official Documentation", url: "https://scikit-learn.org/stable/" },
  ]
};

courseML.materi = `
<div class="materi-section">
  <h2>🤖 Apa itu Machine Learning?</h2>
  <p>Machine Learning (ML) adalah cabang dari Artificial Intelligence (AI) yang memungkinkan komputer untuk <strong>belajar dari data</strong> tanpa diprogram secara eksplisit untuk setiap tugas. Alih-alih menulis aturan manual, kita memberikan data ke algoritma yang kemudian menemukan pola sendiri dan membuat prediksi.</p>
  <p>Definisi klasik dari <strong>Arthur Samuel (1959)</strong>: <em>"Machine Learning adalah bidang studi yang memberikan komputer kemampuan untuk belajar tanpa diprogram secara eksplisit."</em></p>
  <p>Definisi modern dari <strong>Tom Mitchell (1997)</strong>: <em>"Sebuah program komputer dikatakan belajar dari pengalaman E terhadap tugas T dengan ukuran performa P, jika performanya pada T meningkat seiring pengalaman E."</em></p>
  <h3>Mengapa ML Penting?</h3>
  <ul>
    <li><strong>Volume data yang besar:</strong> Manusia tidak bisa memproses miliaran data poin secara manual.</li>
    <li><strong>Pola kompleks:</strong> Beberapa masalah terlalu kompleks untuk dirumuskan sebagai aturan eksplisit (misalnya pengenalan wajah, terjemahan bahasa).</li>
    <li><strong>Adaptasi otomatis:</strong> Model ML dapat beradaptasi dengan data baru tanpa reprogramming ulang.</li>
    <li><strong>Personalisasi skala besar:</strong> Rekomendasi Netflix, Spotify, TikTok, dan e-commerce semuanya menggunakan ML.</li>
    <li><strong>Otomasi keputusan:</strong> Deteksi fraud kartu kredit, diagnosis medis, filter spam email.</li>
  </ul>
  <div class="info-box">
    💡 <strong>Analogi Sederhana:</strong> Bayangkan kamu mengajari anak kecil mengenali kucing. Kamu tidak memberikan aturan seperti "kucing punya 4 kaki, telinga runcing, dll." — kamu cukup menunjukkan ratusan foto kucing dan bukan kucing. Itulah cara kerja ML: belajar dari contoh.
  </div>
  <h3>Perbedaan AI, ML, dan Deep Learning</h3>
  <ul>
    <li><strong>Artificial Intelligence (AI):</strong> Bidang paling luas — segala teknik yang membuat mesin "cerdas".</li>
    <li><strong>Machine Learning (ML):</strong> Subset AI — mesin belajar dari data tanpa diprogram eksplisit.</li>
    <li><strong>Deep Learning (DL):</strong> Subset ML — menggunakan neural network berlapis banyak untuk belajar representasi data secara hierarkis.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>🗂️ Jenis-Jenis Machine Learning</h2>
  <h3>1. Supervised Learning (Pembelajaran Terawasi)</h3>
  <p>Model dilatih menggunakan data berlabel — setiap input memiliki output yang benar. Model belajar memetakan input ke output yang diharapkan.</p>
  <ul>
    <li><strong>Regresi:</strong> Output berupa nilai kontinu. Contoh: prediksi harga rumah, prediksi suhu, estimasi penjualan.</li>
    <li><strong>Klasifikasi:</strong> Output berupa kategori. Contoh: spam/bukan spam, deteksi penyakit, klasifikasi gambar.</li>
  </ul>
  <p><strong>Algoritma populer:</strong> Linear Regression, Logistic Regression, Decision Tree, Random Forest, SVM, Gradient Boosting, Neural Networks.</p>
  <h3>2. Unsupervised Learning (Pembelajaran Tidak Terawasi)</h3>
  <p>Model dilatih dengan data tanpa label. Model menemukan pola dan struktur tersembunyi sendiri dari data mentah.</p>
  <ul>
    <li><strong>Clustering:</strong> Mengelompokkan data serupa. Contoh: segmentasi pelanggan, pengelompokan dokumen, deteksi komunitas di media sosial.</li>
    <li><strong>Dimensionality Reduction:</strong> Mengurangi jumlah fitur sambil mempertahankan informasi penting. Contoh: PCA, t-SNE, UMAP untuk visualisasi.</li>
    <li><strong>Anomaly Detection:</strong> Menemukan data yang tidak biasa. Contoh: deteksi penipuan kartu kredit, deteksi intrusi jaringan.</li>
    <li><strong>Generative Models:</strong> Mempelajari distribusi data untuk menghasilkan sampel baru. Contoh: GAN, VAE.</li>
  </ul>
  <h3>3. Reinforcement Learning (Pembelajaran Penguatan)</h3>
  <p>Agent belajar melalui trial-and-error dengan berinteraksi dengan lingkungan. Agent menerima reward untuk tindakan baik dan penalty untuk tindakan buruk, dengan tujuan memaksimalkan total reward jangka panjang.</p>
  <ul>
    <li>AlphaGo dan AlphaZero mengalahkan juara dunia Go dan Chess.</li>
    <li>Robot belajar berjalan dan memanipulasi objek.</li>
    <li>Optimasi strategi iklan dan trading saham.</li>
    <li>Autonomous driving dan navigasi drone.</li>
  </ul>
  <h3>4. Semi-Supervised Learning</h3>
  <p>Kombinasi data berlabel (sedikit) dan tidak berlabel (banyak). Berguna ketika pelabelan data mahal dan memakan waktu — misalnya anotasi gambar medis yang membutuhkan dokter spesialis.</p>
  <h3>5. Self-Supervised Learning</h3>
  <p>Model membuat label sendiri dari data yang ada. Digunakan oleh model bahasa besar (GPT, BERT) — model belajar memprediksi kata berikutnya atau kata yang disembunyikan.</p>
</div>

<div class="materi-section">
  <h2>📐 Algoritma Machine Learning Utama</h2>
  <h3>Linear Regression</h3>
  <p>Algoritma paling dasar untuk prediksi nilai kontinu. Mencari garis (atau hyperplane) terbaik yang meminimalkan jumlah kuadrat error antara prediksi dan nilai aktual (Ordinary Least Squares / OLS).</p>
  <p><strong>Formula:</strong> ŷ = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ</p>
  <p>Di mana β adalah koefisien yang dipelajari dari data, dan x adalah fitur input.</p>
  <div class="code-block"><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Data: ukuran rumah (m²) vs harga (juta rupiah)</span>
X = np.array([[<span class="num">50</span>],[<span class="num">75</span>],[<span class="num">100</span>],[<span class="num">125</span>],[<span class="num">150</span>],[<span class="num">80</span>],[<span class="num">90</span>],[<span class="num">110</span>]])
y = np.array([<span class="num">300</span>,<span class="num">450</span>,<span class="num">600</span>,<span class="num">750</span>,<span class="num">900</span>,<span class="num">480</span>,<span class="num">540</span>,<span class="num">660</span>])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=<span class="num">0.2</span>)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

<span class="fn">print</span>(<span class="str">f"R² Score: {r2_score(y_test, y_pred):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Koefisien: {model.coef_[0]:.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Intercept: {model.intercept_:.2f}"</span>)</div>

  <h3>Logistic Regression</h3>
  <p>Meskipun namanya "regression", ini adalah algoritma klasifikasi. Menggunakan fungsi sigmoid untuk menghasilkan probabilitas antara 0 dan 1, lalu menerapkan threshold (biasanya 0.5) untuk klasifikasi biner.</p>
  <p><strong>Fungsi Sigmoid:</strong> σ(z) = 1 / (1 + e⁻ᶻ), di mana z = β₀ + β₁x₁ + ... + βₙxₙ</p>
  <div class="code-block"><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>
)

model = LogisticRegression(max_iter=<span class="num">10000</span>)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

<span class="fn">print</span>(classification_report(y_test, y_pred,
      target_names=[<span class="str">'Malignant'</span>, <span class="str">'Benign'</span>]))</div>

  <h3>Decision Tree</h3>
  <p>Model berbentuk pohon yang membuat keputusan berdasarkan serangkaian pertanyaan ya/tidak pada fitur. Setiap node internal adalah kondisi pada fitur, setiap leaf adalah prediksi.</p>
  <ul>
    <li><strong>Gini Impurity:</strong> Gini = 1 - Σ(pᵢ²) — mengukur seberapa sering elemen yang dipilih secara acak akan salah diklasifikasikan.</li>
    <li><strong>Information Gain / Entropy:</strong> H = -Σ(pᵢ log₂ pᵢ) — mengukur pengurangan ketidakpastian setelah split.</li>
    <li><strong>Max Depth:</strong> Parameter krusial untuk mencegah overfitting — batasi kedalaman pohon.</li>
    <li><strong>Min Samples Split:</strong> Minimum sampel yang dibutuhkan untuk membagi node.</li>
  </ul>

  <h3>Random Forest</h3>
  <p>Ensemble dari banyak Decision Tree yang dilatih secara paralel. Menggunakan dua teknik utama: <strong>Bagging</strong> (setiap pohon dilatih pada subset data acak dengan replacement) dan <strong>Feature Randomness</strong> (setiap split hanya mempertimbangkan subset fitur acak).</p>
  <div class="code-block"><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">import</span> pandas <span class="kw">as</span> pd

model = RandomForestClassifier(
    n_estimators=<span class="num">200</span>,
    max_depth=<span class="num">10</span>,
    min_samples_split=<span class="num">5</span>,
    random_state=<span class="num">42</span>,
    n_jobs=-<span class="num">1</span>  <span class="cm"># gunakan semua CPU core</span>
)

scores = cross_val_score(model, X, y, cv=<span class="num">5</span>, scoring=<span class="str">'accuracy'</span>)
<span class="fn">print</span>(<span class="str">f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}"</span>)

model.fit(X_train, y_train)
<span class="cm"># Feature importance</span>
importances = pd.Series(model.feature_importances_).sort_values(ascending=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="str">"Top 5 fitur paling penting:"</span>)
<span class="fn">print</span>(importances.head(<span class="num">5</span>))</div>

  <h3>Support Vector Machine (SVM)</h3>
  <p>Mencari hyperplane optimal yang memisahkan kelas dengan <strong>margin maksimum</strong>. Margin adalah jarak antara hyperplane dan support vectors (titik data terdekat dari masing-masing kelas).</p>
  <ul>
    <li><strong>Hard Margin SVM:</strong> Membutuhkan data yang linearly separable sempurna.</li>
    <li><strong>Soft Margin SVM:</strong> Mengizinkan beberapa misclassification dengan parameter C (regularization).</li>
    <li><strong>Kernel Trick:</strong> Memetakan data ke dimensi lebih tinggi tanpa komputasi eksplisit. Kernel populer: RBF (Radial Basis Function), Polynomial, Linear, Sigmoid.</li>
  </ul>

  <h3>K-Nearest Neighbors (KNN)</h3>
  <p>Algoritma "lazy learning" — tidak ada training eksplisit, semua komputasi dilakukan saat prediksi. Untuk prediksi, cari K tetangga terdekat menggunakan jarak Euclidean (atau Minkowski), lalu ambil voting mayoritas (klasifikasi) atau rata-rata (regresi).</p>
  <div class="info-box warn">
    ⚠️ <strong>Perhatian:</strong> KNN lambat pada dataset besar (O(n) per prediksi). Selalu lakukan feature scaling sebelum KNN karena sensitif terhadap skala fitur. Pilih K ganjil untuk menghindari tie.
  </div>

  <h3>Gradient Boosting (XGBoost, LightGBM)</h3>
  <p>Ensemble method yang membangun model secara sekuensial — setiap model baru berfokus pada error dari model sebelumnya. Saat ini merupakan algoritma terbaik untuk data tabular di kompetisi Kaggle.</p>
  <div class="code-block"><span class="cm"># Install: pip install xgboost</span>
<span class="kw">from</span> xgboost <span class="kw">import</span> XGBClassifier

model = XGBClassifier(
    n_estimators=<span class="num">300</span>,
    learning_rate=<span class="num">0.05</span>,
    max_depth=<span class="num">6</span>,
    subsample=<span class="num">0.8</span>,
    colsample_bytree=<span class="num">0.8</span>,
    use_label_encoder=<span class="kw">False</span>,
    eval_metric=<span class="str">'logloss'</span>
)
model.fit(X_train, y_train,
          eval_set=[(X_test, y_test)],
          early_stopping_rounds=<span class="num">20</span>,
          verbose=<span class="kw">False</span>)
<span class="fn">print</span>(<span class="str">f"Akurasi: {model.score(X_test, y_test):.3f}"</span>)</div>
</div>

<div class="materi-section">
  <h2>📊 Evaluasi Model Machine Learning</h2>
  <h3>Train/Test Split</h3>
  <p>Membagi dataset menjadi training set (70-80%) dan test set (20-30%). Model dilatih pada training set dan dievaluasi pada test set yang belum pernah dilihat model. Gunakan <code>random_state</code> untuk reproducibility.</p>
  <h3>K-Fold Cross-Validation</h3>
  <p>Teknik evaluasi yang lebih robust: dataset dibagi menjadi K fold. Model dilatih K kali, setiap kali menggunakan fold berbeda sebagai test set. Hasil akhir adalah rata-rata dari K evaluasi. Mengurangi variance dalam estimasi performa.</p>
  <div class="code-block"><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> StratifiedKFold, cross_validate

cv = StratifiedKFold(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
results = cross_validate(model, X, y, cv=cv,
    scoring=[<span class="str">'accuracy'</span>, <span class="str">'f1_weighted'</span>, <span class="str">'roc_auc'</span>])

<span class="kw">for</span> metric, scores <span class="kw">in</span> results.items():
    <span class="kw">if</span> metric.startswith(<span class="str">'test_'</span>):
        <span class="fn">print</span>(<span class="str">f"{metric}: {scores.mean():.3f} ± {scores.std():.3f}"</span>)</div>

  <h3>Confusion Matrix & Metrik Klasifikasi</h3>
  <ul>
    <li><strong>True Positive (TP):</strong> Prediksi positif yang benar</li>
    <li><strong>True Negative (TN):</strong> Prediksi negatif yang benar</li>
    <li><strong>False Positive (FP):</strong> Prediksi positif yang salah (Type I Error) — "false alarm"</li>
    <li><strong>False Negative (FN):</strong> Prediksi negatif yang salah (Type II Error) — "miss"</li>
    <li><strong>Accuracy:</strong> (TP+TN)/Total — baik untuk dataset seimbang</li>
    <li><strong>Precision:</strong> TP/(TP+FP) — seberapa tepat prediksi positif (penting jika FP mahal)</li>
    <li><strong>Recall/Sensitivity:</strong> TP/(TP+FN) — seberapa banyak positif terdeteksi (penting jika FN mahal, misal deteksi kanker)</li>
    <li><strong>F1-Score:</strong> 2×(P×R)/(P+R) — harmonic mean, baik untuk imbalanced dataset</li>
    <li><strong>ROC-AUC:</strong> Area under ROC curve — semakin mendekati 1.0 semakin baik</li>
  </ul>
  <h3>Metrik Regresi</h3>
  <ul>
    <li><strong>MAE (Mean Absolute Error):</strong> Rata-rata nilai absolut error — mudah diinterpretasi</li>
    <li><strong>MSE (Mean Squared Error):</strong> Rata-rata kuadrat error — menghukum error besar lebih berat</li>
    <li><strong>RMSE:</strong> Akar dari MSE — dalam satuan yang sama dengan target</li>
    <li><strong>R² (R-squared):</strong> Proporsi variance yang dijelaskan model (0-1, semakin tinggi semakin baik)</li>
  </ul>
  <h3>Overfitting vs Underfitting</h3>
  <p><strong>Overfitting (High Variance):</strong> Model terlalu kompleks, "hafal" data training, performa buruk di data baru. Training accuracy tinggi, validation accuracy rendah.</p>
  <p><strong>Solusi overfitting:</strong> Regularisasi L1/L2, Dropout, Early Stopping, lebih banyak data training, data augmentation, cross-validation, simplifikasi model.</p>
  <p><strong>Underfitting (High Bias):</strong> Model terlalu sederhana, tidak bisa menangkap pola. Baik training maupun validation accuracy rendah.</p>
  <p><strong>Solusi underfitting:</strong> Model lebih kompleks, lebih banyak fitur, kurangi regularisasi, latih lebih lama.</p>
  <div class="info-box">
    🎯 <strong>Bias-Variance Tradeoff:</strong> Overfitting = high variance, low bias. Underfitting = low variance, high bias. Tujuan kita adalah menemukan sweet spot — model yang cukup kompleks untuk menangkap pola tapi tidak terlalu kompleks sehingga overfitting.
  </div>
  <h3>Hyperparameter Tuning</h3>
  <div class="code-block"><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV

param_grid = {
    <span class="str">'n_estimators'</span>: [<span class="num">100</span>, <span class="num">200</span>, <span class="num">300</span>],
    <span class="str">'max_depth'</span>: [<span class="num">5</span>, <span class="num">10</span>, <span class="num">15</span>, <span class="kw">None</span>],
    <span class="str">'min_samples_split'</span>: [<span class="num">2</span>, <span class="num">5</span>, <span class="num">10</span>]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=<span class="num">42</span>),
    param_grid, cv=<span class="num">5</span>, scoring=<span class="str">'f1_weighted'</span>, n_jobs=-<span class="num">1</span>
)
grid_search.fit(X_train, y_train)
<span class="fn">print</span>(<span class="str">f"Best params: {grid_search.best_params_}"</span>)
<span class="fn">print</span>(<span class="str">f"Best score: {grid_search.best_score_:.3f}"</span>)</div>
</div>

<div class="materi-section">
  <h2>🔧 Feature Engineering & Pipeline</h2>
  <p>Andrew Ng pernah berkata: <em>"Applied machine learning is basically feature engineering."</em> Kualitas fitur sering lebih menentukan performa model daripada pilihan algoritma itu sendiri.</p>
  <h3>Teknik Preprocessing Penting</h3>
  <ul>
    <li><strong>Handling Missing Values:</strong> Imputasi dengan mean/median/mode (SimpleImputer), atau gunakan KNNImputer untuk imputasi berbasis tetangga terdekat. Jangan hapus baris kecuali terpaksa.</li>
    <li><strong>Feature Scaling:</strong> StandardScaler (z-score: mean=0, std=1) atau MinMaxScaler (range 0-1). Wajib untuk KNN, SVM, Logistic Regression, Neural Networks. Tidak diperlukan untuk tree-based models.</li>
    <li><strong>Encoding Categorical:</strong> One-Hot Encoding untuk nominal (tidak ada urutan), Ordinal Encoding untuk ordinal (ada urutan: rendah/sedang/tinggi), Target Encoding untuk high-cardinality.</li>
    <li><strong>Feature Selection:</strong> Pilih fitur paling relevan menggunakan correlation matrix, feature importance dari Random Forest, atau Recursive Feature Elimination (RFE).</li>
    <li><strong>Feature Creation:</strong> Buat fitur baru dari kombinasi fitur yang ada — polynomial features, interaction terms, log transformation untuk distribusi skewed.</li>
    <li><strong>Outlier Handling:</strong> Deteksi dengan IQR atau Z-score, lalu clip, remove, atau transform.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer

<span class="cm"># Definisikan kolom numerik dan kategorikal</span>
numeric_features = [<span class="str">'age'</span>, <span class="str">'income'</span>, <span class="str">'score'</span>]
categorical_features = [<span class="str">'gender'</span>, <span class="str">'city'</span>]

numeric_transformer = Pipeline([
    (<span class="str">'imputer'</span>, SimpleImputer(strategy=<span class="str">'median'</span>)),
    (<span class="str">'scaler'</span>, StandardScaler())
])

categorical_transformer = Pipeline([
    (<span class="str">'imputer'</span>, SimpleImputer(strategy=<span class="str">'most_frequent'</span>)),
    (<span class="str">'encoder'</span>, OneHotEncoder(handle_unknown=<span class="str">'ignore'</span>))
])

preprocessor = ColumnTransformer([
    (<span class="str">'num'</span>, numeric_transformer, numeric_features),
    (<span class="str">'cat'</span>, categorical_transformer, categorical_features)
])

<span class="cm"># Full pipeline: preprocessing + model</span>
full_pipeline = Pipeline([
    (<span class="str">'preprocessor'</span>, preprocessor),
    (<span class="str">'model'</span>, RandomForestClassifier(n_estimators=<span class="num">200</span>))
])

full_pipeline.fit(X_train, y_train)
<span class="fn">print</span>(<span class="str">f"Test Accuracy: {full_pipeline.score(X_test, y_test):.3f}"</span>)</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="ml-sources"></ul>
</div>
`;
