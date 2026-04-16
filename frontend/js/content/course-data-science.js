// ══════════════════════════════════════════════
// KURSUS 6: DATA SCIENCE WITH AI
// ══════════════════════════════════════════════

const courseDataScience = {
  id: 6,
  curriculum: [
    {
      title: "Modul 1: Fondasi Data Science",
      lessons: [
        { icon: "▶️", title: "Data Science Lifecycle", duration: "15 min" },
        { icon: "▶️", title: "Statistik Deskriptif: Mean, Median, Std, Skewness", duration: "22 min" },
        { icon: "▶️", title: "Probabilitas & Distribusi", duration: "25 min" },
        { icon: "▶️", title: "Hypothesis Testing & p-value", duration: "22 min" },
        { icon: "💻", title: "Lab: Statistik dengan Python & SciPy", duration: "35 min" },
      ]
    },
    {
      title: "Modul 2: Exploratory Data Analysis (EDA)",
      lessons: [
        { icon: "▶️", title: "EDA Framework & Best Practices", duration: "18 min" },
        { icon: "▶️", title: "Univariate & Bivariate Analysis", duration: "22 min" },
        { icon: "▶️", title: "Correlation & Causation", duration: "18 min" },
        { icon: "▶️", title: "Outlier Detection & Treatment", duration: "20 min" },
        { icon: "💻", title: "Lab: EDA Dataset E-commerce", duration: "45 min" },
      ]
    },
    {
      title: "Modul 3: Data Wrangling & Feature Engineering",
      lessons: [
        { icon: "▶️", title: "Data Cleaning Strategies", duration: "20 min" },
        { icon: "▶️", title: "Feature Engineering Techniques", duration: "25 min" },
        { icon: "▶️", title: "Dimensionality Reduction: PCA, t-SNE", duration: "22 min" },
        { icon: "💻", title: "Lab: Feature Engineering Pipeline", duration: "40 min" },
      ]
    },
    {
      title: "Modul 4: Data Visualization & Storytelling",
      lessons: [
        { icon: "▶️", title: "Prinsip Visualisasi Data yang Efektif", duration: "18 min" },
        { icon: "▶️", title: "Plotly & Interactive Charts", duration: "22 min" },
        { icon: "▶️", title: "Dashboard dengan Streamlit", duration: "25 min" },
        { icon: "💻", title: "Proyek: Dashboard Analitik Bisnis", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa perbedaan Mean dan Median?", options: ["Tidak ada perbedaan", "Mean adalah rata-rata, Median adalah nilai tengah — Median lebih robust terhadap outlier", "Median selalu lebih besar dari Mean", "Mean hanya untuk data kategorikal"], answer: 1 },
    { q: "Apa yang dimaksud dengan p-value dalam hypothesis testing?", options: ["Probabilitas hipotesis benar", "Probabilitas mendapatkan hasil seekstrem ini jika H0 benar", "Ukuran effect size", "Tingkat kepercayaan"], answer: 1 },
    { q: "Apa tujuan PCA (Principal Component Analysis)?", options: ["Meningkatkan akurasi model", "Mengurangi dimensi data sambil mempertahankan variance maksimum", "Mendeteksi outlier", "Mengisi missing values"], answer: 1 },
    { q: "Apa itu EDA (Exploratory Data Analysis)?", options: ["Teknik training model", "Proses investigasi awal data untuk menemukan pola dan anomali", "Metode evaluasi model", "Teknik deployment"], answer: 1 },
    { q: "Distribusi mana yang sering diasumsikan dalam statistik inferensial?", options: ["Uniform Distribution", "Poisson Distribution", "Normal (Gaussian) Distribution", "Exponential Distribution"], answer: 2 },
  ],
  sources: [
    { label: "TutorialSearch – Master Python Data Analysis NumPy Pandas", url: "https://tutorialsearch.io/blog/master-python-data-analysis-numpy-pandas-workflows" },
    { label: "EasierDocs – Python Data Science with Pandas & NumPy", url: "https://easierdocs.com/tutorials/python/data-science-pandas-numpy/" },
    { label: "AnalyticsVidhya – Data Exploration in Python", url: "https://www.analyticsvidhya.com/blog/2015/04/comprehensive-guide-data-exploration-sas-using-python-numpy-scipy-matplotlib-pandas/" },
    { label: "Medium – Data Analysis with Pandas and NumPy", url: "https://medium.com/@AlexanderObregon/how-to-use-pandas-and-numpy-for-data-analysis-in-python-0e650e9d0940" },
    { label: "Landeros Labs – Statistics and Probability with SciPy", url: "https://landeros-labs.com/posts/statistics/index.html" },
    { label: "Pandas Official Documentation", url: "https://pandas.pydata.org/docs/" },
    { label: "SciPy Official Documentation", url: "https://docs.scipy.org/doc/scipy/" },
    { label: "Plotly Official Documentation", url: "https://plotly.com/python/" },
  ]
};

courseDataScience.materi = `
<div class="materi-section">
  <h2>📊 Apa itu Data Science?</h2>
  <p>Data Science adalah bidang interdisipliner yang menggabungkan <strong>statistik, matematika, pemrograman, dan domain knowledge</strong> untuk mengekstrak insight bermakna dari data. Data Scientist sering disebut sebagai "unicorn" karena membutuhkan keahlian yang sangat beragam.</p>
  <h3>Data Science Lifecycle</h3>
  <ol>
    <li><strong>Problem Definition:</strong> Definisikan pertanyaan bisnis yang ingin dijawab.</li>
    <li><strong>Data Collection:</strong> Kumpulkan data dari berbagai sumber (database, API, web scraping, sensor).</li>
    <li><strong>Data Cleaning:</strong> Tangani missing values, outlier, duplikat, inkonsistensi.</li>
    <li><strong>EDA (Exploratory Data Analysis):</strong> Eksplorasi data untuk menemukan pola dan insight.</li>
    <li><strong>Feature Engineering:</strong> Buat dan pilih fitur yang relevan untuk model.</li>
    <li><strong>Modeling:</strong> Pilih, latih, dan evaluasi model ML.</li>
    <li><strong>Deployment:</strong> Deploy model ke production environment.</li>
    <li><strong>Monitoring:</strong> Monitor performa model dan data drift.</li>
  </ol>
</div>

<div class="materi-section">
  <h2>📐 Statistik untuk Data Science</h2>
  <h3>Statistik Deskriptif</h3>
  <div class="code-block"><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy <span class="kw">import</span> stats

data = np.array([<span class="num">23</span>, <span class="num">45</span>, <span class="num">12</span>, <span class="num">67</span>, <span class="num">34</span>, <span class="num">89</span>, <span class="num">23</span>, <span class="num">45</span>, <span class="num">56</span>, <span class="num">78</span>, <span class="num">200</span>])

<span class="cm"># Ukuran pemusatan</span>
<span class="fn">print</span>(<span class="str">f"Mean:   {np.mean(data):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Median: {np.median(data):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Mode:   {stats.mode(data).mode[0]}"</span>)

<span class="cm"># Ukuran penyebaran</span>
<span class="fn">print</span>(<span class="str">f"Std Dev:  {np.std(data):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Variance: {np.var(data):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Range:    {np.ptp(data)}"</span>)
q1, q3 = np.percentile(data, [<span class="num">25</span>, <span class="num">75</span>])
<span class="fn">print</span>(<span class="str">f"IQR:      {q3 - q1:.2f}"</span>)

<span class="cm"># Bentuk distribusi</span>
<span class="fn">print</span>(<span class="str">f"Skewness: {stats.skew(data):.3f}"</span>)   <span class="cm"># >0 right-skewed, <0 left-skewed</span>
<span class="fn">print</span>(<span class="str">f"Kurtosis: {stats.kurtosis(data):.3f}"</span>) <span class="cm"># >0 heavy tails</span></div>

  <h3>Distribusi Probabilitas Penting</h3>
  <ul>
    <li><strong>Normal (Gaussian):</strong> Bell curve simetris. Banyak fenomena alam mengikuti distribusi ini. Penting untuk asumsi banyak algoritma ML.</li>
    <li><strong>Binomial:</strong> Jumlah sukses dalam n percobaan independen dengan probabilitas p. Contoh: jumlah email spam dari 100 email.</li>
    <li><strong>Poisson:</strong> Jumlah kejadian dalam interval waktu/ruang tertentu. Contoh: jumlah pengunjung website per jam.</li>
    <li><strong>Uniform:</strong> Semua nilai memiliki probabilitas sama. Digunakan untuk random number generation.</li>
    <li><strong>Exponential:</strong> Waktu antar kejadian dalam proses Poisson. Contoh: waktu antar kedatangan pelanggan.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> scipy <span class="kw">import</span> stats
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> numpy <span class="kw">as</span> np

x = np.linspace(-<span class="num">4</span>, <span class="num">4</span>, <span class="num">100</span>)

<span class="cm"># Normal distribution</span>
normal_pdf = stats.norm.pdf(x, loc=<span class="num">0</span>, scale=<span class="num">1</span>)

<span class="cm"># Probabilitas P(X < 1.96) untuk normal standar</span>
prob = stats.norm.cdf(<span class="num">1.96</span>)
<span class="fn">print</span>(<span class="str">f"P(Z < 1.96) = {prob:.4f}"</span>)  <span class="cm"># 0.9750</span>

<span class="cm"># Confidence interval 95%</span>
sample = np.random.normal(<span class="num">50</span>, <span class="num">10</span>, <span class="num">100</span>)
ci = stats.t.interval(<span class="num">0.95</span>, df=len(sample)-<span class="num">1</span>,
                      loc=np.mean(sample), scale=stats.sem(sample))
<span class="fn">print</span>(<span class="str">f"95% CI: ({ci[0]:.2f}, {ci[1]:.2f})"</span>)</div>

  <h3>Hypothesis Testing</h3>
  <p>Proses statistik untuk membuat keputusan berdasarkan data. Kita mulai dengan <strong>Null Hypothesis (H₀)</strong> — asumsi default — dan mencoba membuktikan <strong>Alternative Hypothesis (H₁)</strong>.</p>
  <ul>
    <li><strong>p-value:</strong> Probabilitas mendapatkan hasil seekstrem ini (atau lebih ekstrem) jika H₀ benar. Jika p &lt; α (biasanya 0.05), tolak H₀.</li>
    <li><strong>t-test:</strong> Bandingkan mean dua kelompok. Contoh: apakah treatment A lebih efektif dari B?</li>
    <li><strong>Chi-square test:</strong> Uji independensi dua variabel kategorikal.</li>
    <li><strong>ANOVA:</strong> Bandingkan mean lebih dari dua kelompok.</li>
    <li><strong>A/B Testing:</strong> Aplikasi hypothesis testing di bisnis — uji dua versi produk/fitur.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> scipy <span class="kw">import</span> stats

<span class="cm"># A/B Test: apakah versi B meningkatkan konversi?</span>
group_a = np.random.binomial(<span class="num">1</span>, <span class="num">0.10</span>, <span class="num">1000</span>)  <span class="cm"># 10% conversion rate</span>
group_b = np.random.binomial(<span class="num">1</span>, <span class="num">0.12</span>, <span class="num">1000</span>)  <span class="cm"># 12% conversion rate</span>

t_stat, p_value = stats.ttest_ind(group_a, group_b)
<span class="fn">print</span>(<span class="str">f"t-statistic: {t_stat:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"p-value: {p_value:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Signifikan (p<0.05): {p_value < 0.05}"</span>)</div>
</div>

<div class="materi-section">
  <h2>🔍 Exploratory Data Analysis (EDA)</h2>
  <p>EDA adalah proses investigasi awal data menggunakan statistik dan visualisasi untuk menemukan pola, anomali, dan hubungan antar variabel sebelum membangun model.</p>
  <div class="code-block"><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> seaborn <span class="kw">as</span> sns
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

df = pd.read_csv(<span class="str">'dataset.csv'</span>)

<span class="cm"># ── Step 1: Overview ──</span>
<span class="fn">print</span>(df.shape)
<span class="fn">print</span>(df.dtypes)
<span class="fn">print</span>(df.describe())
<span class="fn">print</span>(df.isnull().sum())

<span class="cm"># ── Step 2: Distribusi variabel numerik ──</span>
fig, axes = plt.subplots(<span class="num">2</span>, <span class="num">3</span>, figsize=(<span class="num">15</span>, <span class="num">8</span>))
<span class="kw">for</span> i, col <span class="kw">in</span> enumerate(df.select_dtypes(<span class="str">'number'</span>).columns[:<span class="num">6</span>]):
    axes[i//<span class="num">3</span>, i%<span class="num">3</span>].hist(df[col].dropna(), bins=<span class="num">30</span>)
    axes[i//<span class="num">3</span>, i%<span class="num">3</span>].set_title(col)
plt.tight_layout(); plt.show()

<span class="cm"># ── Step 3: Correlation matrix ──</span>
plt.figure(figsize=(<span class="num">10</span>, <span class="num">8</span>))
sns.heatmap(df.corr(), annot=<span class="kw">True</span>, cmap=<span class="str">'coolwarm'</span>, center=<span class="num">0</span>, fmt=<span class="str">'.2f'</span>)
plt.title(<span class="str">'Correlation Matrix'</span>); plt.show()

<span class="cm"># ── Step 4: Outlier detection dengan IQR ──</span>
<span class="kw">def</span> <span class="fn">detect_outliers_iqr</span>(series):
    Q1, Q3 = series.quantile([<span class="num">0.25</span>, <span class="num">0.75</span>])
    IQR = Q3 - Q1
    lower, upper = Q1 - <span class="num">1.5</span>*IQR, Q3 + <span class="num">1.5</span>*IQR
    <span class="kw">return</span> series[(series < lower) | (series > upper)]

<span class="kw">for</span> col <span class="kw">in</span> df.select_dtypes(<span class="str">'number'</span>).columns:
    outliers = detect_outliers_iqr(df[col])
    <span class="fn">print</span>(<span class="str">f"{col}: {len(outliers)} outliers ({len(outliers)/len(df)*100:.1f}%)"</span>)</div>
</div>

<div class="materi-section">
  <h2>📉 Dimensionality Reduction</h2>
  <h3>PCA (Principal Component Analysis)</h3>
  <p>Teknik unsupervised untuk mengurangi dimensi data dengan menemukan arah (principal components) yang memaksimalkan variance. Berguna untuk visualisasi, mengurangi noise, dan mempercepat training.</p>
  <div class="code-block"><span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Selalu scale sebelum PCA!</span>
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

<span class="cm"># PCA untuk visualisasi (2D)</span>
pca_2d = PCA(n_components=<span class="num">2</span>)
X_2d = pca_2d.fit_transform(X_scaled)
<span class="fn">print</span>(<span class="str">f"Explained variance: {pca_2d.explained_variance_ratio_.sum():.2%}"</span>)

<span class="cm"># PCA untuk mempertahankan 95% variance</span>
pca_95 = PCA(n_components=<span class="num">0.95</span>)
X_reduced = pca_95.fit_transform(X_scaled)
<span class="fn">print</span>(<span class="str">f"Dimensi asli: {X.shape[1]}, Setelah PCA: {X_reduced.shape[1]}"</span>)

<span class="cm"># Scree plot</span>
pca_full = PCA().fit(X_scaled)
plt.plot(np.cumsum(pca_full.explained_variance_ratio_))
plt.xlabel(<span class="str">'Jumlah Komponen'</span>); plt.ylabel(<span class="str">'Cumulative Explained Variance'</span>)
plt.axhline(y=<span class="num">0.95</span>, color=<span class="str">'r'</span>, linestyle=<span class="str">'--'</span>); plt.show()</div>

  <h3>t-SNE & UMAP untuk Visualisasi</h3>
  <p>t-SNE (t-Distributed Stochastic Neighbor Embedding) dan UMAP (Uniform Manifold Approximation and Projection) adalah teknik non-linear untuk memvisualisasikan data berdimensi tinggi dalam 2D/3D. Sangat berguna untuk memahami struktur cluster dalam data.</p>
  <div class="code-block"><span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE
<span class="kw">import</span> umap  <span class="cm"># pip install umap-learn</span>

<span class="cm"># t-SNE</span>
tsne = TSNE(n_components=<span class="num">2</span>, perplexity=<span class="num">30</span>, random_state=<span class="num">42</span>)
X_tsne = tsne.fit_transform(X_scaled)

<span class="cm"># UMAP (lebih cepat dari t-SNE untuk dataset besar)</span>
reducer = umap.UMAP(n_components=<span class="num">2</span>, random_state=<span class="num">42</span>)
X_umap = reducer.fit_transform(X_scaled)

plt.figure(figsize=(<span class="num">12</span>, <span class="num">5</span>))
plt.subplot(<span class="num">1</span>,<span class="num">2</span>,<span class="num">1</span>); plt.scatter(X_tsne[:,<span class="num">0</span>], X_tsne[:,<span class="num">1</span>], c=y, cmap=<span class="str">'tab10'</span>); plt.title(<span class="str">'t-SNE'</span>)
plt.subplot(<span class="num">1</span>,<span class="num">2</span>,<span class="num">2</span>); plt.scatter(X_umap[:,<span class="num">0</span>], X_umap[:,<span class="num">1</span>], c=y, cmap=<span class="str">'tab10'</span>); plt.title(<span class="str">'UMAP'</span>)
plt.show()</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="ds-sources"></ul>
</div>
`;

// ══════════════════════════════════════════════
// QUIZ PER MODUL — DATA SCIENCE WITH AI
// Sumber: GeeksforGeeks Data Science Quiz (geeksforgeeks.org/quizzes/data-science-quiz),
//         Sanfoundry Data Science MCQ (sanfoundry.com/1000-data-science-questions-answers),
//         Analytics Vidhya Statistics Questions (analyticsvidhya.com/blog/2022/08/top-40-data-science-statistics-interview-questions)
// ══════════════════════════════════════════════
courseDataScience.moduleQuizzes = [
  {
    moduleIndex: 0,
    moduleTitle: "Modul 1: Fondasi Data Science",
    questions: [
      {
        q: "Apa perbedaan Mean dan Median dalam statistik deskriptif?",
        opts: ["Tidak ada perbedaan", "Mean adalah rata-rata aritmatika, Median adalah nilai tengah — Median lebih robust terhadap outlier", "Median selalu lebih besar dari Mean", "Mean hanya untuk data kategorikal"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan p-value dalam hypothesis testing?",
        opts: ["Probabilitas hipotesis alternatif benar", "Probabilitas mendapatkan hasil seekstrem ini jika null hypothesis benar", "Ukuran effect size", "Tingkat kepercayaan (confidence level)"],
        ans: 1
      },
      {
        q: "Distribusi mana yang paling sering diasumsikan dalam statistik inferensial?",
        opts: ["Uniform Distribution", "Poisson Distribution", "Normal (Gaussian) Distribution", "Exponential Distribution"],
        ans: 2
      },
      {
        q: "Jika p-value = 0.03 dan alpha = 0.05, apa kesimpulannya?",
        opts: ["Gagal menolak null hypothesis", "Tolak null hypothesis — hasil signifikan secara statistik", "Tidak bisa disimpulkan", "Perlu lebih banyak data"],
        ans: 1
      },
      {
        q: "Apa yang diukur oleh Standard Deviation?",
        opts: ["Nilai tengah data", "Seberapa jauh data tersebar dari mean", "Nilai maksimum data", "Korelasi antar variabel"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 1,
    moduleTitle: "Modul 2: Exploratory Data Analysis (EDA)",
    questions: [
      {
        q: "Apa tujuan utama EDA (Exploratory Data Analysis)?",
        opts: ["Langsung membangun model ML", "Investigasi awal data untuk menemukan pola, anomali, dan hubungan sebelum modeling", "Membersihkan data saja", "Membuat laporan akhir"],
        ans: 1
      },
      {
        q: "Metode IQR (Interquartile Range) digunakan untuk...",
        opts: ["Mengisi missing values", "Mendeteksi outlier — nilai di luar Q1-1.5*IQR atau Q3+1.5*IQR", "Menghitung korelasi", "Mengurangi dimensi data"],
        ans: 1
      },
      {
        q: "Apa perbedaan korelasi dan kausalitas?",
        opts: ["Keduanya sama", "Korelasi menunjukkan hubungan statistik, kausalitas menunjukkan hubungan sebab-akibat", "Kausalitas lebih mudah dibuktikan", "Korelasi selalu berarti kausalitas"],
        ans: 1
      },
      {
        q: "Correlation matrix heatmap berguna untuk...",
        opts: ["Menampilkan distribusi satu variabel", "Memvisualisasikan kekuatan hubungan linear antar semua pasangan variabel numerik", "Mendeteksi outlier", "Membandingkan dua dataset"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan Skewness dalam distribusi data?",
        opts: ["Ukuran penyebaran data", "Ukuran asimetri distribusi — positif berarti ekor panjang ke kanan, negatif ke kiri", "Jumlah outlier", "Nilai rata-rata data"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 2,
    moduleTitle: "Modul 3: Data Wrangling & Feature Engineering",
    questions: [
      {
        q: "Apa strategi terbaik untuk menangani missing values pada kolom numerik?",
        opts: ["Selalu hapus baris yang memiliki missing values", "Tergantung konteks: imputasi dengan mean/median untuk data normal, atau KNNImputer untuk data kompleks", "Selalu isi dengan 0", "Biarkan saja, model akan menanganinya"],
        ans: 1
      },
      {
        q: "Apa tujuan Feature Scaling (StandardScaler/MinMaxScaler)?",
        opts: ["Mengurangi jumlah fitur", "Menyamakan skala fitur agar algoritma yang sensitif terhadap skala (KNN, SVM, NN) bekerja optimal", "Menghapus outlier", "Mengisi missing values"],
        ans: 1
      },
      {
        q: "PCA (Principal Component Analysis) digunakan untuk...",
        opts: ["Meningkatkan akurasi model secara langsung", "Mengurangi dimensi data sambil mempertahankan variance maksimum", "Mendeteksi outlier", "Mengisi missing values"],
        ans: 1
      },
      {
        q: "Mengapa feature scaling WAJIB dilakukan sebelum PCA?",
        opts: ["Untuk mempercepat komputasi", "Karena PCA sensitif terhadap skala — fitur dengan skala besar akan mendominasi principal components", "Untuk mengurangi noise", "Karena PCA tidak bisa memproses angka besar"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan 'data leakage' dalam machine learning?",
        opts: ["Data yang hilang dari database", "Informasi dari test set yang bocor ke training set, menyebabkan evaluasi yang terlalu optimis", "Data yang tidak terenkripsi", "Missing values yang tidak ditangani"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 3,
    moduleTitle: "Modul 4: Data Visualization & Storytelling",
    questions: [
      {
        q: "Prinsip utama visualisasi data yang efektif adalah...",
        opts: ["Menggunakan sebanyak mungkin warna", "Menyampaikan insight dengan jelas dan jujur tanpa menyesatkan pembaca", "Membuat grafik yang kompleks dan detail", "Menggunakan 3D chart sebisa mungkin"],
        ans: 1
      },
      {
        q: "Apa keunggulan Plotly dibanding Matplotlib untuk visualisasi?",
        opts: ["Plotly lebih cepat", "Plotly menghasilkan chart interaktif (zoom, hover, filter) yang ideal untuk dashboard web", "Plotly lebih mudah diinstall", "Plotly menggunakan lebih sedikit kode"],
        ans: 1
      },
      {
        q: "Streamlit digunakan untuk...",
        opts: ["Membuat model ML", "Membuat web app data science interaktif dengan Python tanpa perlu HTML/CSS/JS", "Memvisualisasikan data statis", "Mengelola database"],
        ans: 1
      },
      {
        q: "Jenis chart apa yang paling tepat untuk menampilkan perubahan nilai seiring waktu?",
        opts: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"],
        ans: 2
      }
    ]
  }
];

// ══════════════════════════════════════════════
// QUIZ AKHIR KURSUS — DATA SCIENCE WITH AI (20 Soal)
// Sumber: GeeksforGeeks Data Science Quiz (geeksforgeeks.org/quizzes/data-science-quiz),
//         Sanfoundry Data Science MCQ (sanfoundry.com/1000-data-science-questions-answers),
//         Analytics Vidhya Statistics (analyticsvidhya.com/blog/2022/08/top-40-data-science-statistics-interview-questions)
// ══════════════════════════════════════════════
courseDataScience.finalQuiz = [
  { q: "Apa perbedaan Mean dan Median?", opts: ["Tidak ada perbedaan", "Mean adalah rata-rata, Median adalah nilai tengah — Median lebih robust terhadap outlier", "Median selalu lebih besar dari Mean", "Mean hanya untuk data kategorikal"], ans: 1 },
  { q: "Apa yang dimaksud dengan p-value?", opts: ["Probabilitas hipotesis benar", "Probabilitas mendapatkan hasil seekstrem ini jika H0 benar", "Ukuran effect size", "Tingkat kepercayaan"], ans: 1 },
  { q: "Tujuan PCA (Principal Component Analysis)?", opts: ["Meningkatkan akurasi model", "Mengurangi dimensi data sambil mempertahankan variance maksimum", "Mendeteksi outlier", "Mengisi missing values"], ans: 1 },
  { q: "Apa itu EDA?", opts: ["Teknik training model", "Proses investigasi awal data untuk menemukan pola dan anomali", "Metode evaluasi model", "Teknik deployment"], ans: 1 },
  { q: "Distribusi yang sering diasumsikan dalam statistik inferensial?", opts: ["Uniform Distribution", "Poisson Distribution", "Normal (Gaussian) Distribution", "Exponential Distribution"], ans: 2 },
  { q: "Apa yang diukur oleh Standard Deviation?", opts: ["Nilai tengah data", "Seberapa jauh data tersebar dari mean", "Nilai maksimum data", "Korelasi antar variabel"], ans: 1 },
  { q: "Metode IQR digunakan untuk...", opts: ["Mengisi missing values", "Mendeteksi outlier", "Menghitung korelasi", "Mengurangi dimensi data"], ans: 1 },
  { q: "Apa perbedaan korelasi dan kausalitas?", opts: ["Keduanya sama", "Korelasi menunjukkan hubungan statistik, kausalitas menunjukkan sebab-akibat", "Kausalitas lebih mudah dibuktikan", "Korelasi selalu berarti kausalitas"], ans: 1 },
  { q: "Mengapa feature scaling WAJIB sebelum PCA?", opts: ["Untuk mempercepat komputasi", "PCA sensitif terhadap skala — fitur besar akan mendominasi principal components", "Untuk mengurangi noise", "PCA tidak bisa memproses angka besar"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'data leakage'?", opts: ["Data yang hilang dari database", "Informasi dari test set yang bocor ke training set", "Data yang tidak terenkripsi", "Missing values yang tidak ditangani"], ans: 1 },
  { q: "t-SNE digunakan untuk...", opts: ["Meningkatkan akurasi model", "Memvisualisasikan data berdimensi tinggi dalam 2D/3D", "Mengisi missing values", "Mendeteksi outlier"], ans: 1 },
  { q: "Apa yang dilakukan Streamlit?", opts: ["Membuat model ML", "Membuat web app data science interaktif dengan Python", "Memvisualisasikan data statis", "Mengelola database"], ans: 1 },
  { q: "Jika p-value = 0.03 dan alpha = 0.05, kesimpulannya?", opts: ["Gagal menolak null hypothesis", "Tolak null hypothesis — hasil signifikan", "Tidak bisa disimpulkan", "Perlu lebih banyak data"], ans: 1 },
  { q: "Apa keunggulan Plotly dibanding Matplotlib?", opts: ["Plotly lebih cepat", "Plotly menghasilkan chart interaktif (zoom, hover, filter)", "Plotly lebih mudah diinstall", "Plotly menggunakan lebih sedikit kode"], ans: 1 },
  { q: "Apa yang dimaksud dengan Skewness?", opts: ["Ukuran penyebaran data", "Ukuran asimetri distribusi", "Jumlah outlier", "Nilai rata-rata data"], ans: 1 },
  { q: "Apa strategi terbaik untuk missing values pada kolom numerik?", opts: ["Selalu hapus baris", "Tergantung konteks: imputasi mean/median atau KNNImputer", "Selalu isi dengan 0", "Biarkan saja"], ans: 1 },
  { q: "Apa yang dilakukan df.describe() di Pandas?", opts: ["Menampilkan 5 baris pertama", "Menampilkan statistik deskriptif (mean, std, min, max, quartiles)", "Menampilkan tipe data", "Menampilkan jumlah missing values"], ans: 1 },
  { q: "UMAP lebih baik dari t-SNE untuk dataset besar karena...", opts: ["UMAP lebih akurat", "UMAP jauh lebih cepat dan mempertahankan struktur global lebih baik", "UMAP menggunakan lebih sedikit memori", "UMAP lebih mudah diimplementasikan"], ans: 1 },
  { q: "Apa yang dimaksud dengan A/B Testing?", opts: ["Testing dua model ML", "Uji hipotesis untuk membandingkan dua versi produk/fitur secara statistik", "Testing dua dataset", "Membandingkan dua algoritma"], ans: 1 },
  { q: "Apa tujuan Feature Engineering?", opts: ["Mengurangi jumlah data", "Membuat dan memilih fitur yang relevan untuk meningkatkan performa model", "Mempercepat training", "Mengurangi overfitting secara otomatis"], ans: 1 }
];
