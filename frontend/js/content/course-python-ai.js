// ══════════════════════════════════════════════
// KURSUS 2: PYTHON FOR AI
// ══════════════════════════════════════════════

const coursePythonAI = {
  id: 2,
  curriculum: [
    {
      title: "Modul 1: Python Essentials untuk AI",
      lessons: [
        { icon: "▶️", title: "Setup Environment: Python, pip, venv", duration: "15 min" },
        { icon: "▶️", title: "Python Basics: Variables, Loops, Functions", duration: "25 min" },
        { icon: "▶️", title: "List Comprehension & Lambda", duration: "18 min" },
        { icon: "▶️", title: "OOP: Class, Inheritance, Polymorphism", duration: "22 min" },
        { icon: "💻", title: "Lab: Python Warm-up Exercises", duration: "30 min" },
      ]
    },
    {
      title: "Modul 2: NumPy – Komputasi Numerik",
      lessons: [
        { icon: "▶️", title: "Array, Shape, Dtype", duration: "20 min" },
        { icon: "▶️", title: "Indexing, Slicing, Broadcasting", duration: "22 min" },
        { icon: "▶️", title: "Operasi Matematika & Linear Algebra", duration: "20 min" },
        { icon: "💻", title: "Lab: Matrix Operations untuk ML", duration: "35 min" },
      ]
    },
    {
      title: "Modul 3: Pandas – Manipulasi Data",
      lessons: [
        { icon: "▶️", title: "DataFrame & Series", duration: "20 min" },
        { icon: "▶️", title: "Loading, Filtering, Grouping Data", duration: "25 min" },
        { icon: "▶️", title: "Handling Missing Data", duration: "18 min" },
        { icon: "▶️", title: "Merge, Join, Concat", duration: "20 min" },
        { icon: "💻", title: "Lab: Analisis Dataset Titanic", duration: "45 min" },
      ]
    },
    {
      title: "Modul 4: Matplotlib & Seaborn – Visualisasi",
      lessons: [
        { icon: "▶️", title: "Line, Bar, Scatter, Histogram", duration: "20 min" },
        { icon: "▶️", title: "Seaborn: Heatmap, Pairplot, Boxplot", duration: "18 min" },
        { icon: "▶️", title: "Visualisasi untuk EDA (Exploratory Data Analysis)", duration: "22 min" },
      ]
    },
    {
      title: "Modul 5: Scikit-learn & AI Libraries",
      lessons: [
        { icon: "▶️", title: "Scikit-learn Pipeline", duration: "20 min" },
        { icon: "▶️", title: "TensorFlow & Keras Intro", duration: "25 min" },
        { icon: "▶️", title: "PyTorch Intro", duration: "22 min" },
        { icon: "💻", title: "Proyek Akhir: End-to-End ML Project", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Library Python mana yang digunakan untuk komputasi array numerik?", options: ["Pandas", "Matplotlib", "NumPy", "Seaborn"], answer: 2 },
    { q: "Apa output dari: import numpy as np; a = np.array([1,2,3]); print(a.shape)?", options: ["(1,3)", "(3,)", "[3]", "3"], answer: 1 },
    { q: "Fungsi Pandas apa yang digunakan untuk melihat statistik deskriptif DataFrame?", options: ["df.info()", "df.describe()", "df.head()", "df.shape"], answer: 1 },
    { q: "Apa itu Broadcasting dalam NumPy?", options: ["Mengirim data ke server", "Operasi array dengan shape berbeda secara otomatis", "Menyiarkan hasil ke layar", "Teknik kompresi data"], answer: 1 },
    { q: "Library mana yang paling populer untuk deep learning di Python?", options: ["Scikit-learn", "Pandas", "TensorFlow/PyTorch", "Matplotlib"], answer: 2 },
  ],
  sources: [
    { label: "TheAIInternship – Ultimate Python for AI Guide 2025", url: "https://theaiinternship.com/blog/python-ai-development-guide-2025/" },
    { label: "GeeksforGeeks – AI With Python Tutorial", url: "https://www.geeksforgeeks.org/python-ai/" },
    { label: "Flexiana – Getting Started with Python for AI", url: "https://ai.flexiana.com/blog/getting-started-with-python-for-ai-a-complete-beginners-guide" },
    { label: "Pickl.ai – Artificial Intelligence with Python", url: "https://www.pickl.ai/blog/artificial-intelligence-using-python-a-comprehensive-guide/" },
    { label: "Codingal – How to Make AI in Python", url: "https://www.codingal.com/coding-for-kids/blog/ai-in-python/" },
    { label: "NumPy Official Documentation", url: "https://numpy.org/doc/stable/" },
    { label: "Pandas Official Documentation", url: "https://pandas.pydata.org/docs/" },
  ]
};

coursePythonAI.materi = `
<div class="materi-section">
  <h2>🐍 Mengapa Python untuk AI?</h2>
  <p>Python telah menjadi bahasa de facto untuk Artificial Intelligence dan Machine Learning. Kombinasi sintaks yang bersih, ekosistem library yang kaya, dan komunitas yang besar menjadikannya pilihan utama baik untuk pemula maupun expert.</p>
  <ul>
    <li><strong>Readable Syntax:</strong> Kode Python mudah dibaca dan ditulis, mirip pseudocode — memungkinkan fokus pada logika AI bukan sintaks.</li>
    <li><strong>Rich Ecosystem:</strong> NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch, Keras, Hugging Face — semua tersedia.</li>
    <li><strong>Community Support:</strong> Komunitas terbesar di dunia untuk AI/ML, ribuan tutorial, forum, dan open-source projects.</li>
    <li><strong>Industry Standard:</strong> Digunakan oleh Google, Meta, OpenAI, DeepMind, dan hampir semua perusahaan AI.</li>
    <li><strong>Interoperability:</strong> Mudah diintegrasikan dengan C/C++, Java, dan bahasa lain untuk performa tinggi.</li>
  </ul>
  <div class="info-box">
    💡 <strong>Fun Fact:</strong> Python dibuat oleh Guido van Rossum pada 1991. Namanya bukan dari ular python, tapi dari acara komedi Inggris "Monty Python's Flying Circus"!
  </div>
</div>

<div class="materi-section">
  <h2>⚙️ Setup Environment Python untuk AI</h2>
  <h3>Instalasi Python & Virtual Environment</h3>
  <div class="code-block"><span class="cm"># Install Python dari python.org atau gunakan Anaconda</span>
<span class="cm"># Buat virtual environment</span>
python -m venv ai_env

<span class="cm"># Aktivasi (Windows)</span>
ai_env\Scripts\activate

<span class="cm"># Aktivasi (Mac/Linux)</span>
source ai_env/bin/activate

<span class="cm"># Install library AI essentials</span>
pip install numpy pandas matplotlib seaborn scikit-learn
pip install tensorflow torch torchvision
pip install jupyter notebook ipykernel</div>

  <h3>Jupyter Notebook</h3>
  <p>Jupyter Notebook adalah lingkungan interaktif yang ideal untuk eksplorasi data dan prototyping model AI. Kode dijalankan dalam "cell" dan hasilnya langsung terlihat di bawah cell tersebut.</p>
  <div class="code-block"><span class="cm"># Jalankan Jupyter Notebook</span>
jupyter notebook

<span class="cm"># Atau gunakan JupyterLab (versi lebih modern)</span>
pip install jupyterlab
jupyter lab</div>
</div>

<div class="materi-section">
  <h2>🔢 NumPy – Fondasi Komputasi Numerik</h2>
  <p>NumPy (Numerical Python) adalah library fundamental untuk komputasi ilmiah di Python. Hampir semua library AI/ML dibangun di atas NumPy. Kecepatan NumPy berasal dari implementasi C di balik layar dan operasi vectorized yang menghindari Python loops.</p>
  <h3>Array Dasar</h3>
  <div class="code-block"><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Membuat array</span>
a = np.array([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>])
b = np.array([[<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>],[<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>]])  <span class="cm"># 2D array (matrix)</span>

<span class="fn">print</span>(a.shape)   <span class="cm"># (5,)</span>
<span class="fn">print</span>(b.shape)   <span class="cm"># (2, 3)</span>
<span class="fn">print</span>(b.dtype)   <span class="cm"># int64</span>
<span class="fn">print</span>(b.ndim)    <span class="cm"># 2</span>

<span class="cm"># Array khusus</span>
zeros = np.zeros((<span class="num">3</span>, <span class="num">4</span>))       <span class="cm"># matrix 3x4 berisi 0</span>
ones  = np.ones((<span class="num">2</span>, <span class="num">3</span>))        <span class="cm"># matrix 2x3 berisi 1</span>
eye   = np.eye(<span class="num">4</span>)              <span class="cm"># identity matrix 4x4</span>
rand  = np.random.randn(<span class="num">3</span>, <span class="num">3</span>) <span class="cm"># random normal distribution</span>
arange = np.arange(<span class="num">0</span>, <span class="num">10</span>, <span class="num">2</span>)  <span class="cm"># [0, 2, 4, 6, 8]</span>
linspace = np.linspace(<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>) <span class="cm"># [0, 0.25, 0.5, 0.75, 1]</span></div>

  <h3>Indexing & Slicing</h3>
  <div class="code-block">m = np.array([[<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>],[<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>],[<span class="num">7</span>,<span class="num">8</span>,<span class="num">9</span>]])

<span class="fn">print</span>(m[<span class="num">0</span>, <span class="num">1</span>])      <span class="cm"># 2 — baris 0, kolom 1</span>
<span class="fn">print</span>(m[<span class="num">1</span>:, :<span class="num">2</span>])   <span class="cm"># [[4,5],[7,8]] — baris 1+, kolom 0-1</span>
<span class="fn">print</span>(m[:, <span class="num">2</span>])     <span class="cm"># [3,6,9] — semua baris, kolom 2</span>

<span class="cm"># Boolean indexing</span>
data = np.array([<span class="num">10</span>, <span class="num">25</span>, <span class="num">5</span>, <span class="num">40</span>, <span class="num">15</span>])
<span class="fn">print</span>(data[data > <span class="num">15</span>])  <span class="cm"># [25, 40]</span>

<span class="cm"># Fancy indexing</span>
idx = np.array([<span class="num">0</span>, <span class="num">2</span>, <span class="num">4</span>])
<span class="fn">print</span>(data[idx])  <span class="cm"># [10, 5, 15]</span></div>

  <h3>Broadcasting</h3>
  <p>Broadcasting memungkinkan operasi antara array dengan shape berbeda. NumPy secara otomatis "memperluas" array yang lebih kecil agar cocok dengan yang lebih besar — tanpa menyalin data secara eksplisit.</p>
  <div class="code-block"><span class="cm"># Broadcasting: tambah scalar ke array</span>
a = np.array([[<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>],[<span class="num">4</span>,<span class="num">5</span>,<span class="num">6</span>]])
<span class="fn">print</span>(a + <span class="num">10</span>)  <span class="cm"># [[11,12,13],[14,15,16]]</span>

<span class="cm"># Broadcasting: array 1D dengan 2D</span>
b = np.array([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>])
<span class="fn">print</span>(a * b)   <span class="cm"># [[1,4,9],[4,10,18]]</span>

<span class="cm"># Normalisasi kolom (penting untuk ML!)</span>
X = np.random.randn(<span class="num">100</span>, <span class="num">5</span>)
X_normalized = (X - X.mean(axis=<span class="num">0</span>)) / X.std(axis=<span class="num">0</span>)</div>

  <h3>Linear Algebra dengan NumPy</h3>
  <div class="code-block">A = np.array([[<span class="num">2</span>,<span class="num">1</span>],[<span class="num">5</span>,<span class="num">3</span>]])
B = np.array([[<span class="num">1</span>,<span class="num">0</span>],[<span class="num">0</span>,<span class="num">1</span>]])

<span class="fn">print</span>(A @ B)              <span class="cm"># Matrix multiplication</span>
<span class="fn">print</span>(np.linalg.det(A))   <span class="cm"># Determinant: 1.0</span>
<span class="fn">print</span>(np.linalg.inv(A))   <span class="cm"># Inverse matrix</span>
eigenvalues, eigenvectors = np.linalg.eig(A)
U, S, Vt = np.linalg.svd(A)  <span class="cm"># Singular Value Decomposition</span></div>
</div>

<div class="materi-section">
  <h2>🐼 Pandas – Manipulasi Data Tabular</h2>
  <p>Pandas adalah library untuk manipulasi dan analisis data tabular (seperti spreadsheet atau database). Dua struktur data utama: <strong>Series</strong> (1D) dan <strong>DataFrame</strong> (2D).</p>
  <h3>DataFrame Basics</h3>
  <div class="code-block"><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Membuat DataFrame</span>
df = pd.DataFrame({
    <span class="str">'nama'</span>: [<span class="str">'Alice'</span>, <span class="str">'Bob'</span>, <span class="str">'Charlie'</span>, <span class="str">'Diana'</span>],
    <span class="str">'usia'</span>: [<span class="num">25</span>, <span class="num">30</span>, <span class="num">35</span>, <span class="num">28</span>],
    <span class="str">'gaji'</span>: [<span class="num">5000</span>, <span class="num">7000</span>, <span class="num">9000</span>, <span class="num">6500</span>],
    <span class="str">'kota'</span>: [<span class="str">'Jakarta'</span>, <span class="str">'Bandung'</span>, <span class="str">'Jakarta'</span>, <span class="str">'Surabaya'</span>]
})

<span class="fn">print</span>(df.head())        <span class="cm"># 5 baris pertama</span>
<span class="fn">print</span>(df.info())        <span class="cm"># tipe data & missing values</span>
<span class="fn">print</span>(df.describe())    <span class="cm"># statistik deskriptif</span>
<span class="fn">print</span>(df.shape)         <span class="cm"># (4, 4)</span>

<span class="cm"># Load dari file</span>
df = pd.read_csv(<span class="str">'data.csv'</span>)
df = pd.read_excel(<span class="str">'data.xlsx'</span>)
df = pd.read_json(<span class="str">'data.json'</span>)</div>

  <h3>Filtering & Selection</h3>
  <div class="code-block"><span class="cm"># Pilih kolom</span>
df[<span class="str">'nama'</span>]                    <span class="cm"># Series</span>
df[[<span class="str">'nama'</span>, <span class="str">'gaji'</span>]]          <span class="cm"># DataFrame</span>

<span class="cm"># Filter baris</span>
df[df[<span class="str">'usia'</span>] > <span class="num">28</span>]
df[(df[<span class="str">'kota'</span>] == <span class="str">'Jakarta'</span>) & (df[<span class="str">'gaji'</span>] > <span class="num">5000</span>)]

<span class="cm"># loc (label-based) vs iloc (integer-based)</span>
df.loc[<span class="num">0</span>:<span class="num">2</span>, <span class="str">'nama'</span>:<span class="str">'usia'</span>]
df.iloc[<span class="num">0</span>:<span class="num">3</span>, <span class="num">0</span>:<span class="num">2</span>]

<span class="cm"># Query syntax</span>
df.query(<span class="str">'usia > 25 and kota == "Jakarta"'</span>)</div>

  <h3>GroupBy & Aggregasi</h3>
  <div class="code-block"><span class="cm"># Rata-rata gaji per kota</span>
df.groupby(<span class="str">'kota'</span>)[<span class="str">'gaji'</span>].mean()

<span class="cm"># Multiple aggregations</span>
df.groupby(<span class="str">'kota'</span>).agg({
    <span class="str">'gaji'</span>: [<span class="str">'mean'</span>, <span class="str">'max'</span>, <span class="str">'count'</span>],
    <span class="str">'usia'</span>: <span class="str">'mean'</span>
})

<span class="cm"># Pivot table</span>
pd.pivot_table(df, values=<span class="str">'gaji'</span>, index=<span class="str">'kota'</span>, aggfunc=<span class="str">'mean'</span>)</div>

  <h3>Handling Missing Data</h3>
  <div class="code-block"><span class="cm"># Cek missing values</span>
df.isnull().sum()
df.isnull().mean() * <span class="num">100</span>  <span class="cm"># persentase missing</span>

<span class="cm"># Isi missing values</span>
df[<span class="str">'gaji'</span>].fillna(df[<span class="str">'gaji'</span>].median(), inplace=<span class="kw">True</span>)
df[<span class="str">'kota'</span>].fillna(<span class="str">'Unknown'</span>, inplace=<span class="kw">True</span>)
df.fillna(method=<span class="str">'ffill'</span>)  <span class="cm"># forward fill</span>

<span class="cm"># Hapus baris/kolom dengan missing values</span>
df.dropna(subset=[<span class="str">'nama'</span>])  <span class="cm"># hapus baris jika 'nama' kosong</span>
df.dropna(thresh=<span class="num">3</span>)         <span class="cm"># hapus baris jika < 3 nilai non-null</span></div>
</div>

<div class="materi-section">
  <h2>📊 Matplotlib & Seaborn – Visualisasi Data</h2>
  <p>Visualisasi adalah langkah krusial dalam Exploratory Data Analysis (EDA). Memahami distribusi, korelasi, dan outlier secara visual jauh lebih cepat daripada membaca angka.</p>
  <div class="code-block"><span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">import</span> seaborn <span class="kw">as</span> sns

<span class="cm"># Set style</span>
plt.style.use(<span class="str">'dark_background'</span>)
sns.set_palette(<span class="str">'husl'</span>)

<span class="cm"># Histogram — distribusi data</span>
plt.figure(figsize=(<span class="num">10</span>, <span class="num">4</span>))
plt.subplot(<span class="num">1</span>, <span class="num">2</span>, <span class="num">1</span>)
plt.hist(df[<span class="str">'gaji'</span>], bins=<span class="num">20</span>, edgecolor=<span class="str">'white'</span>)
plt.title(<span class="str">'Distribusi Gaji'</span>)

<span class="cm"># Scatter plot — korelasi dua variabel</span>
plt.subplot(<span class="num">1</span>, <span class="num">2</span>, <span class="num">2</span>)
plt.scatter(df[<span class="str">'usia'</span>], df[<span class="str">'gaji'</span>], alpha=<span class="num">0.7</span>)
plt.xlabel(<span class="str">'Usia'</span>); plt.ylabel(<span class="str">'Gaji'</span>)
plt.tight_layout(); plt.show()

<span class="cm"># Seaborn: Heatmap korelasi</span>
plt.figure(figsize=(<span class="num">8</span>, <span class="num">6</span>))
sns.heatmap(df.corr(), annot=<span class="kw">True</span>, cmap=<span class="str">'coolwarm'</span>, fmt=<span class="str">'.2f'</span>)
plt.title(<span class="str">'Correlation Matrix'</span>); plt.show()

<span class="cm"># Seaborn: Pairplot — semua kombinasi fitur</span>
sns.pairplot(df, hue=<span class="str">'kota'</span>, diag_kind=<span class="str">'kde'</span>)
plt.show()</div>
</div>

<div class="materi-section">
  <h2>🧠 AI Libraries Utama di Python</h2>
  <h3>Scikit-learn</h3>
  <p>Library ML paling populer untuk classical machine learning. Menyediakan ratusan algoritma dengan API yang konsisten: <code>fit()</code>, <code>predict()</code>, <code>transform()</code>.</p>
  <h3>TensorFlow & Keras</h3>
  <p>Framework deep learning dari Google. Keras adalah high-level API yang berjalan di atas TensorFlow, memudahkan pembuatan neural network.</p>
  <div class="code-block"><span class="kw">import</span> tensorflow <span class="kw">as</span> tf
<span class="kw">from</span> tensorflow <span class="kw">import</span> keras

<span class="cm"># Membuat neural network sederhana</span>
model = keras.Sequential([
    keras.layers.Dense(<span class="num">128</span>, activation=<span class="str">'relu'</span>, input_shape=(<span class="num">20</span>,)),
    keras.layers.Dropout(<span class="num">0.3</span>),
    keras.layers.Dense(<span class="num">64</span>, activation=<span class="str">'relu'</span>),
    keras.layers.Dense(<span class="num">1</span>, activation=<span class="str">'sigmoid'</span>)
])

model.compile(optimizer=<span class="str">'adam'</span>, loss=<span class="str">'binary_crossentropy'</span>, metrics=[<span class="str">'accuracy'</span>])
model.summary()

history = model.fit(X_train, y_train, epochs=<span class="num">50</span>, batch_size=<span class="num">32</span>,
                    validation_split=<span class="num">0.2</span>, verbose=<span class="num">1</span>)</div>

  <h3>PyTorch</h3>
  <p>Framework deep learning dari Meta/Facebook. Lebih fleksibel dan "Pythonic" dibanding TensorFlow, sangat populer di riset akademik.</p>
  <div class="code-block"><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">SimpleNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().__init__()
        self.layers = nn.Sequential(
            nn.Linear(<span class="num">20</span>, <span class="num">128</span>),
            nn.ReLU(),
            nn.Dropout(<span class="num">0.3</span>),
            nn.Linear(<span class="num">128</span>, <span class="num">64</span>),
            nn.ReLU(),
            nn.Linear(<span class="num">64</span>, <span class="num">1</span>),
            nn.Sigmoid()
        )
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.layers(x)

model = SimpleNet()
optimizer = torch.optim.Adam(model.parameters(), lr=<span class="num">0.001</span>)
criterion = nn.BCELoss()</div>

  <h3>Hugging Face Transformers</h3>
  <p>Library untuk menggunakan pre-trained model NLP (BERT, GPT, T5, dll.) dengan mudah. Ribuan model tersedia di Hugging Face Hub.</p>
  <div class="code-block"><span class="kw">from</span> transformers <span class="kw">import</span> pipeline

<span class="cm"># Sentiment analysis dengan 1 baris kode!</span>
classifier = pipeline(<span class="str">"sentiment-analysis"</span>)
result = classifier(<span class="str">"Lunetix adalah platform belajar AI yang luar biasa!"</span>)
<span class="fn">print</span>(result)  <span class="cm"># [{'label': 'POSITIVE', 'score': 0.998}]</span>

<span class="cm"># Text generation</span>
generator = pipeline(<span class="str">"text-generation"</span>, model=<span class="str">"gpt2"</span>)
output = generator(<span class="str">"Artificial Intelligence will"</span>, max_length=<span class="num">50</span>)</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="python-ai-sources"></ul>
</div>
`;

// ══════════════════════════════════════════════
// QUIZ PER MODUL — PYTHON FOR AI
// Sumber: GeeksforGeeks NumPy Quiz (geeksforgeeks.org/quizzes/python-numpy-quiz),
//         Sanfoundry Pandas MCQ (sanfoundry.com/data-science-questions-answers-pandas-data-structure),
//         Analytics Vidhya Python MCQ (analyticsvidhya.com/blog/2024/02/mcqs-on-basic-python-with-answers)
// ══════════════════════════════════════════════
coursePythonAI.moduleQuizzes = [
  {
    moduleIndex: 0,
    moduleTitle: "Modul 1: Python Essentials untuk AI",
    questions: [
      {
        q: "Apa keunggulan utama Python untuk pengembangan AI dibanding bahasa lain?",
        opts: ["Python paling cepat di antara semua bahasa", "Ekosistem library AI yang kaya dan sintaks yang mudah dibaca", "Python satu-satunya bahasa yang mendukung ML", "Python tidak memerlukan instalasi"],
        ans: 1
      },
      {
        q: "Apa output dari: x = [i**2 for i in range(5)]?",
        opts: ["[1, 4, 9, 16, 25]", "[0, 1, 4, 9, 16]", "[0, 1, 2, 3, 4]", "Error"],
        ans: 1
      },
      {
        q: "Apa fungsi dari virtual environment (venv) dalam Python?",
        opts: ["Mempercepat eksekusi kode", "Mengisolasi dependensi proyek agar tidak konflik antar proyek", "Mengompilasi kode Python", "Menghubungkan ke database"],
        ans: 1
      },
      {
        q: "Apa perbedaan antara list dan tuple di Python?",
        opts: ["Tidak ada perbedaan", "List mutable (bisa diubah), tuple immutable (tidak bisa diubah)", "Tuple lebih lambat dari list", "List hanya untuk angka, tuple untuk string"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan lambda function di Python?",
        opts: ["Fungsi yang berjalan di background", "Fungsi anonim satu baris yang bisa digunakan sebagai argumen", "Fungsi rekursif", "Fungsi yang hanya menerima satu argumen"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 1,
    moduleTitle: "Modul 2: NumPy – Komputasi Numerik",
    questions: [
      {
        q: "Apa output dari: import numpy as np; a = np.array([[1,2],[3,4]]); print(a.shape)?",
        opts: ["(4,)", "(2, 2)", "[2, 2]", "4"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan Broadcasting dalam NumPy?",
        opts: ["Mengirim data ke server lain", "Operasi array dengan shape berbeda secara otomatis tanpa menyalin data", "Menyiarkan hasil ke layar", "Teknik kompresi array"],
        ans: 1
      },
      {
        q: "Fungsi NumPy mana yang digunakan untuk perkalian matriks?",
        opts: ["np.multiply()", "np.dot() atau operator @", "np.cross()", "np.matmul() saja"],
        ans: 1
      },
      {
        q: "Apa perbedaan np.zeros((3,4)) dan np.ones((3,4))?",
        opts: ["Tidak ada perbedaan", "zeros mengisi dengan 0, ones mengisi dengan 1", "zeros lebih cepat", "ones hanya untuk integer"],
        ans: 1
      },
      {
        q: "Mengapa NumPy jauh lebih cepat dari Python list untuk operasi numerik?",
        opts: ["NumPy menggunakan lebih banyak RAM", "NumPy diimplementasikan dalam C dan menggunakan operasi vectorized", "NumPy menggunakan GPU secara otomatis", "NumPy menyimpan data di cloud"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 2,
    moduleTitle: "Modul 3: Pandas – Manipulasi Data",
    questions: [
      {
        q: "Apa perbedaan antara df.loc[] dan df.iloc[] di Pandas?",
        opts: ["Tidak ada perbedaan", "loc menggunakan label/nama, iloc menggunakan posisi integer", "iloc lebih cepat dari loc", "loc hanya untuk baris, iloc hanya untuk kolom"],
        ans: 1
      },
      {
        q: "Fungsi Pandas apa yang digunakan untuk melihat statistik deskriptif (mean, std, min, max)?",
        opts: ["df.info()", "df.head()", "df.describe()", "df.shape"],
        ans: 2
      },
      {
        q: "Bagaimana cara mengisi missing values dengan median di Pandas?",
        opts: ["df.fillna(df.mean())", "df.fillna(df.median())", "df.dropna()", "df.replace(NaN, 0)"],
        ans: 1
      },
      {
        q: "Apa fungsi df.groupby('kota')['gaji'].mean()?",
        opts: ["Mengurutkan data berdasarkan kota", "Menghitung rata-rata gaji untuk setiap kota", "Menggabungkan dua DataFrame", "Menghapus kolom kota"],
        ans: 1
      },
      {
        q: "Apa output dari df.isnull().sum()?",
        opts: ["Total baris DataFrame", "Jumlah missing values per kolom", "Jumlah nilai unik per kolom", "Tipe data setiap kolom"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 3,
    moduleTitle: "Modul 4: Matplotlib & Seaborn – Visualisasi",
    questions: [
      {
        q: "Jenis plot apa yang paling tepat untuk menampilkan distribusi satu variabel numerik?",
        opts: ["Scatter plot", "Bar chart", "Histogram", "Pie chart"],
        ans: 2
      },
      {
        q: "Apa kegunaan Seaborn heatmap dalam EDA?",
        opts: ["Menampilkan gambar", "Memvisualisasikan matriks korelasi antar variabel", "Membuat animasi", "Menampilkan distribusi data"],
        ans: 1
      },
      {
        q: "Apa perbedaan utama Seaborn dengan Matplotlib?",
        opts: ["Seaborn lebih cepat", "Seaborn dibangun di atas Matplotlib dengan tampilan lebih menarik dan fungsi statistik bawaan", "Matplotlib lebih modern", "Seaborn tidak bisa membuat scatter plot"],
        ans: 1
      },
      {
        q: "Fungsi plt.subplot(1, 2, 1) berarti...",
        opts: ["Membuat 1 plot dengan ukuran 2x1", "Grid 1 baris 2 kolom, aktifkan subplot ke-1", "Membuat 2 plot secara vertikal", "Mengatur ukuran figure"],
        ans: 1
      },
      {
        q: "Apa kegunaan sns.pairplot() dalam analisis data?",
        opts: ["Membandingkan dua dataset", "Menampilkan scatter plot semua kombinasi pasangan fitur sekaligus", "Membuat heatmap korelasi", "Menampilkan distribusi satu variabel"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 4,
    moduleTitle: "Modul 5: Scikit-learn & AI Libraries",
    questions: [
      {
        q: "Apa pola API yang konsisten di Scikit-learn untuk semua model?",
        opts: ["load(), run(), save()", "fit(), predict(), transform()", "train(), test(), evaluate()", "build(), compile(), fit()"],
        ans: 1
      },
      {
        q: "Apa perbedaan utama TensorFlow/Keras dengan PyTorch?",
        opts: ["TensorFlow lebih akurat", "PyTorch lebih fleksibel dan 'Pythonic', populer di riset; Keras lebih mudah untuk prototyping", "PyTorch tidak bisa digunakan untuk production", "Tidak ada perbedaan signifikan"],
        ans: 1
      },
      {
        q: "Hugging Face Transformers digunakan untuk...",
        opts: ["Transformasi data tabular", "Menggunakan pre-trained model NLP (BERT, GPT, dll.) dengan mudah", "Visualisasi data", "Komputasi numerik"],
        ans: 1
      },
      {
        q: "Apa fungsi model.compile() di Keras?",
        opts: ["Membuat arsitektur model", "Mengonfigurasi optimizer, loss function, dan metrics sebelum training", "Menyimpan model ke disk", "Memuat dataset"],
        ans: 1
      },
      {
        q: "Apa keuntungan menggunakan Jupyter Notebook untuk pengembangan AI?",
        opts: ["Lebih cepat dari script Python biasa", "Kode dijalankan per cell dan hasilnya langsung terlihat — ideal untuk eksplorasi data", "Otomatis deploy ke cloud", "Tidak memerlukan instalasi Python"],
        ans: 1
      }
    ]
  }
];

// ══════════════════════════════════════════════
// QUIZ AKHIR KURSUS — PYTHON FOR AI (20 Soal)
// Sumber: GeeksforGeeks NumPy Quiz (geeksforgeeks.org/quizzes/python-numpy-quiz),
//         Sanfoundry Pandas MCQ (sanfoundry.com/data-science-questions-answers-pandas-data-structure),
//         Analytics Vidhya Python MCQ (analyticsvidhya.com/blog/2024/02/mcqs-on-basic-python-with-answers)
// ══════════════════════════════════════════════
coursePythonAI.finalQuiz = [
  { q: "Library Python mana yang digunakan untuk komputasi array numerik?", opts: ["Pandas", "Matplotlib", "NumPy", "Seaborn"], ans: 2 },
  { q: "Apa output dari: np.array([1,2,3]).shape?", opts: ["(1,3)", "(3,)", "[3]", "3"], ans: 1 },
  { q: "Fungsi Pandas untuk statistik deskriptif DataFrame?", opts: ["df.info()", "df.describe()", "df.head()", "df.shape"], ans: 1 },
  { q: "Apa itu Broadcasting dalam NumPy?", opts: ["Kirim data ke server", "Operasi array shape berbeda secara otomatis", "Siarkan hasil ke layar", "Kompresi data"], ans: 1 },
  { q: "Library paling populer untuk deep learning di Python?", opts: ["Scikit-learn", "Pandas", "TensorFlow/PyTorch", "Matplotlib"], ans: 2 },
  { q: "Cara membaca CSV dengan Pandas?", opts: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"], ans: 1 },
  { q: "Apa itu list comprehension?", opts: ["Cara membuat list panjang", "Sintaks ringkas untuk membuat list dari iterable", "Fungsi bawaan Python", "Tipe data baru"], ans: 1 },
  { q: "Fungsi train_test_split digunakan untuk?", opts: ["Melatih model", "Membagi dataset menjadi training dan testing", "Menguji model", "Membagi fitur"], ans: 1 },
  { q: "Apa perbedaan df.loc[] dan df.iloc[]?", opts: ["Tidak ada perbedaan", "loc menggunakan label, iloc menggunakan posisi integer", "iloc lebih cepat dari loc", "loc hanya untuk baris"], ans: 1 },
  { q: "Apa fungsi np.zeros((3,4))?", opts: ["Array 3x4 berisi angka acak", "Array 3x4 berisi semua 0", "Array 3x4 berisi semua 1", "Array 1D berisi 12 elemen"], ans: 1 },
  { q: "Apa kegunaan sns.heatmap() dalam EDA?", opts: ["Menampilkan gambar", "Memvisualisasikan matriks korelasi", "Membuat animasi", "Menampilkan distribusi"], ans: 1 },
  { q: "Apa fungsi model.compile() di Keras?", opts: ["Membuat arsitektur model", "Mengonfigurasi optimizer, loss, dan metrics", "Menyimpan model", "Memuat dataset"], ans: 1 },
  { q: "Apa yang dilakukan df.fillna(df.median())?", opts: ["Menghapus missing values", "Mengisi missing values dengan nilai median", "Menghapus kolom dengan missing values", "Mengganti semua nilai dengan median"], ans: 1 },
  { q: "Apa keunggulan PyTorch dibanding TensorFlow untuk riset?", opts: ["PyTorch lebih cepat", "PyTorch lebih fleksibel dan Pythonic, mudah di-debug", "PyTorch lebih mudah di-deploy", "PyTorch menggunakan lebih sedikit memori"], ans: 1 },
  { q: "Apa output dari: np.arange(0, 10, 2)?", opts: ["[0,1,2,3,4,5,6,7,8,9]", "[0,2,4,6,8]", "[2,4,6,8,10]", "[0,2,4,6,8,10]"], ans: 1 },
  { q: "Hugging Face pipeline('sentiment-analysis') menggunakan model apa secara default?", opts: ["GPT-2", "DistilBERT fine-tuned untuk sentiment", "BERT base", "T5"], ans: 1 },
  { q: "Apa fungsi df.groupby('kota')['gaji'].mean()?", opts: ["Mengurutkan data", "Menghitung rata-rata gaji per kota", "Menggabungkan DataFrame", "Menghapus kolom kota"], ans: 1 },
  { q: "Apa yang dimaksud dengan virtual environment (venv)?", opts: ["Server virtual", "Isolasi dependensi proyek agar tidak konflik", "Lingkungan cloud", "Emulator Python"], ans: 1 },
  { q: "Apa fungsi plt.subplot(1, 2, 1)?", opts: ["Membuat 1 plot ukuran 2x1", "Grid 1 baris 2 kolom, aktifkan subplot ke-1", "Membuat 2 plot vertikal", "Mengatur ukuran figure"], ans: 1 },
  { q: "Apa kegunaan Jupyter Notebook untuk AI development?", opts: ["Lebih cepat dari script Python", "Kode dijalankan per cell dan hasilnya langsung terlihat", "Otomatis deploy ke cloud", "Tidak memerlukan instalasi Python"], ans: 1 }
];
