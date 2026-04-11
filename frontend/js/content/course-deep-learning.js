// ══════════════════════════════════════════════
// KURSUS 3: DEEP LEARNING ESSENTIALS
// ══════════════════════════════════════════════

const courseDeepLearning = {
  id: 3,
  curriculum: [
    {
      title: "Modul 1: Fondasi Neural Networks",
      lessons: [
        { icon: "▶️", title: "Neuron Biologis vs Artificial Neuron", duration: "15 min" },
        { icon: "▶️", title: "Perceptron & Multi-Layer Perceptron (MLP)", duration: "20 min" },
        { icon: "▶️", title: "Activation Functions: ReLU, Sigmoid, Tanh, Softmax", duration: "22 min" },
        { icon: "▶️", title: "Forward Propagation", duration: "18 min" },
        { icon: "💻", title: "Lab: Neural Network dari Scratch", duration: "40 min" },
      ]
    },
    {
      title: "Modul 2: Training Neural Networks",
      lessons: [
        { icon: "▶️", title: "Loss Functions: MSE, Cross-Entropy", duration: "18 min" },
        { icon: "▶️", title: "Backpropagation & Gradient Descent", duration: "25 min" },
        { icon: "▶️", title: "Optimizers: SGD, Adam, RMSprop", duration: "20 min" },
        { icon: "▶️", title: "Batch, Mini-batch, Stochastic GD", duration: "15 min" },
        { icon: "💻", title: "Lab: Training dengan Keras", duration: "35 min" },
      ]
    },
    {
      title: "Modul 3: Convolutional Neural Networks (CNN)",
      lessons: [
        { icon: "▶️", title: "Convolution Operation & Feature Maps", duration: "22 min" },
        { icon: "▶️", title: "Pooling Layers & Padding", duration: "18 min" },
        { icon: "▶️", title: "Arsitektur: LeNet, AlexNet, VGG, ResNet", duration: "25 min" },
        { icon: "▶️", title: "Transfer Learning & Fine-tuning", duration: "22 min" },
        { icon: "💻", title: "Lab: Image Classification dengan CNN", duration: "50 min" },
      ]
    },
    {
      title: "Modul 4: Recurrent Neural Networks (RNN & LSTM)",
      lessons: [
        { icon: "▶️", title: "Sequential Data & RNN Architecture", duration: "20 min" },
        { icon: "▶️", title: "LSTM & GRU – Mengatasi Vanishing Gradient", duration: "25 min" },
        { icon: "▶️", title: "Bidirectional RNN", duration: "15 min" },
        { icon: "💻", title: "Lab: Prediksi Time Series dengan LSTM", duration: "45 min" },
      ]
    },
    {
      title: "Modul 5: Transformers & Modern DL",
      lessons: [
        { icon: "▶️", title: "Attention Mechanism", duration: "25 min" },
        { icon: "▶️", title: "Transformer Architecture", duration: "28 min" },
        { icon: "▶️", title: "BERT, GPT, dan Large Language Models", duration: "22 min" },
        { icon: "▶️", title: "Generative AI: GANs & Diffusion Models", duration: "25 min" },
        { icon: "💻", title: "Proyek Akhir: Sentiment Analysis dengan BERT", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa fungsi activation function dalam neural network?", options: ["Mempercepat training", "Menambahkan non-linearitas ke model", "Mengurangi ukuran model", "Menginisialisasi weights"], answer: 1 },
    { q: "Apa yang dimaksud dengan Backpropagation?", options: ["Proses forward pass data", "Algoritma untuk menghitung gradient dan update weights", "Teknik regularisasi", "Metode inisialisasi weights"], answer: 1 },
    { q: "Mengapa LSTM lebih baik dari RNN biasa untuk sequence panjang?", options: ["LSTM lebih cepat", "LSTM memiliki memory cell yang mengatasi vanishing gradient", "LSTM menggunakan lebih sedikit parameter", "LSTM tidak memerlukan training"], answer: 1 },
    { q: "Apa itu Transfer Learning?", options: ["Memindahkan data antar server", "Menggunakan model pre-trained sebagai starting point untuk task baru", "Teknik kompresi model", "Metode augmentasi data"], answer: 1 },
    { q: "Komponen utama apa yang membedakan Transformer dari RNN?", options: ["Jumlah layer yang lebih banyak", "Self-Attention Mechanism", "Penggunaan CNN", "Ukuran batch yang lebih besar"], answer: 1 },
  ],
  sources: [
    { label: "GeeksforGeeks – Deep Learning Tutorial", url: "https://www.geeksforgeeks.org/deep-learning-tutorial" },
    { label: "TheAIInternship – Deep Learning Mastery Guide", url: "https://theaiinternship.com/blog/deep-learning-mastery-guide-2025/" },
    { label: "Guru99 – Deep Learning Tutorial for Beginners", url: "https://www.guru99.com/deep-learning-tutorial.html" },
    { label: "ExpertBeacon – Deep Learning Tutorial Series 50 Lessons", url: "https://expertbeacon.com/deep-learning-tutorial-series-50-step-by-step-lessons-free2024/" },
    { label: "NumberAnalytics – Complete Neural Networks Handbook", url: "https://www.numberanalytics.com/blog/complete-neural-networks-handbook-ai-success" },
    { label: "TensorFlow Official Documentation", url: "https://www.tensorflow.org/tutorials" },
    { label: "PyTorch Official Documentation", url: "https://pytorch.org/tutorials/" },
    { label: "Arxiv – Compact Holistic Tutorial on Deep Learning", url: "https://arxiv.org/html/2408.12308v3" },
  ]
};

courseDeepLearning.materi = `
<div class="materi-section">
  <h2>🧠 Apa itu Deep Learning?</h2>
  <p>Deep Learning adalah subset dari Machine Learning yang menggunakan <strong>Artificial Neural Networks (ANN) dengan banyak lapisan tersembunyi</strong> untuk mempelajari representasi data secara hierarkis. Kata "deep" merujuk pada kedalaman (jumlah layer) dalam jaringan.</p>
  <p>Deep Learning telah merevolusi AI sejak 2012 ketika AlexNet memenangkan ImageNet competition dengan margin yang sangat besar menggunakan GPU. Sejak saat itu, DL mendominasi hampir semua benchmark AI.</p>
  <ul>
    <li><strong>Computer Vision:</strong> Pengenalan wajah, deteksi objek, segmentasi gambar, self-driving cars.</li>
    <li><strong>NLP:</strong> ChatGPT, Google Translate, Siri, Alexa.</li>
    <li><strong>Drug Discovery:</strong> AlphaFold memprediksi struktur protein — terobosan terbesar dalam biologi 50 tahun terakhir.</li>
    <li><strong>Generative AI:</strong> DALL-E, Midjourney, Stable Diffusion, Sora.</li>
  </ul>
  <div class="info-box">
    💡 <strong>Mengapa Deep Learning Butuh Banyak Data?</strong> Neural network dalam memiliki jutaan hingga miliaran parameter. Untuk melatih parameter sebanyak itu secara efektif, dibutuhkan dataset yang sangat besar. Itulah mengapa DL baru meledak setelah era big data dan GPU yang terjangkau.
  </div>
</div>

<div class="materi-section">
  <h2>⚡ Fondasi: Artificial Neural Networks</h2>
  <h3>Neuron Artifisial</h3>
  <p>Terinspirasi dari neuron biologis, artificial neuron menerima beberapa input, mengalikannya dengan weights, menjumlahkan hasilnya ditambah bias, lalu melewatkannya melalui activation function.</p>
  <p><strong>Formula:</strong> output = f(w1*x1 + w2*x2 + ... + wn*xn + b)</p>
  <h3>Activation Functions</h3>
  <ul>
    <li><strong>Sigmoid:</strong> output 0-1. Untuk output layer klasifikasi biner. Masalah: vanishing gradient.</li>
    <li><strong>Tanh:</strong> output -1 sampai 1. Lebih baik dari sigmoid untuk hidden layers.</li>
    <li><strong>ReLU:</strong> f(x) = max(0, x). Paling populer untuk hidden layers. Cepat, mengatasi vanishing gradient.</li>
    <li><strong>Leaky ReLU:</strong> f(x) = max(0.01x, x). Mengatasi dying ReLU.</li>
    <li><strong>Softmax:</strong> Distribusi probabilitas untuk multi-class classification.</li>
    <li><strong>GELU:</strong> Digunakan di Transformer (BERT, GPT). Lebih smooth dari ReLU.</li>
  </ul>
  <div class="code-block"><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> <span class="fn">NeuralNetFromScratch</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, layer_sizes):
        self.weights, self.biases = [], []
        <span class="kw">for</span> i <span class="kw">in</span> range(len(layer_sizes) - <span class="num">1</span>):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+<span class="num">1</span>]) * np.sqrt(<span class="num">2</span>/layer_sizes[i])
            self.weights.append(w)
            self.biases.append(np.zeros((<span class="num">1</span>, layer_sizes[i+<span class="num">1</span>])))

    <span class="kw">def</span> <span class="fn">relu</span>(self, x): <span class="kw">return</span> np.maximum(<span class="num">0</span>, x)
    <span class="kw">def</span> <span class="fn">sigmoid</span>(self, x): <span class="kw">return</span> <span class="num">1</span> / (<span class="num">1</span> + np.exp(-x))

    <span class="kw">def</span> <span class="fn">forward</span>(self, X):
        self.activations = [X]
        <span class="kw">for</span> i, (w, b) <span class="kw">in</span> enumerate(zip(self.weights, self.biases)):
            z = self.activations[-<span class="num">1</span>] @ w + b
            a = self.sigmoid(z) <span class="kw">if</span> i == len(self.weights)-<span class="num">1</span> <span class="kw">else</span> self.relu(z)
            self.activations.append(a)
        <span class="kw">return</span> self.activations[-<span class="num">1</span>]

nn = NeuralNetFromScratch([<span class="num">784</span>, <span class="num">256</span>, <span class="num">128</span>, <span class="num">10</span>])</div>
</div>

<div class="materi-section">
  <h2>🔄 Training: Backpropagation dan Optimizers</h2>
  <h3>Loss Functions</h3>
  <ul>
    <li><strong>MSE:</strong> L = (1/n) * sum((y_pred - y_true)^2) — untuk regresi</li>
    <li><strong>Binary Cross-Entropy:</strong> L = -[y*log(y_pred) + (1-y)*log(1-y_pred)] — klasifikasi biner</li>
    <li><strong>Categorical Cross-Entropy:</strong> L = -sum(yi * log(y_pred_i)) — multi-class</li>
    <li><strong>Huber Loss:</strong> Kombinasi MSE dan MAE, robust terhadap outlier</li>
  </ul>
  <h3>Backpropagation</h3>
  <p>Algoritma untuk menghitung gradient loss terhadap setiap weight menggunakan chain rule dari kalkulus. Gradient mengalir mundur dari output layer ke input layer.</p>
  <p><strong>Update rule:</strong> w = w - alpha * dL/dw, di mana alpha adalah learning rate.</p>
  <h3>Optimizers</h3>
  <ul>
    <li><strong>SGD + Momentum:</strong> Sederhana, stabil dengan momentum term.</li>
    <li><strong>Adam:</strong> Adaptive learning rate per parameter. Paling populer saat ini.</li>
    <li><strong>AdamW:</strong> Adam + weight decay yang benar. Digunakan hampir semua Transformer modern.</li>
    <li><strong>RMSprop:</strong> Adaptive learning rate, cocok untuk RNN.</li>
  </ul>
  <h3>Regularisasi untuk Mencegah Overfitting</h3>
  <ul>
    <li><strong>Dropout:</strong> Secara acak mematikan neuron selama training (20-50%). Memaksa network belajar representasi yang lebih robust.</li>
    <li><strong>Batch Normalization:</strong> Normalisasi aktivasi setiap layer. Mempercepat training dan memungkinkan learning rate lebih tinggi.</li>
    <li><strong>L2 Regularization:</strong> Menambahkan penalti pada weights besar ke loss function.</li>
    <li><strong>Early Stopping:</strong> Hentikan training ketika validation loss mulai naik.</li>
    <li><strong>Data Augmentation:</strong> Perbanyak data training dengan transformasi (flip, rotate, crop, noise).</li>
  </ul>
</div>

<div class="materi-section">
  <h2>🖼️ Convolutional Neural Networks (CNN)</h2>
  <p>CNN dirancang khusus untuk data grid seperti gambar. Menggunakan operasi konvolusi untuk mendeteksi fitur lokal (edges, textures, shapes) secara hierarkis dari sederhana ke kompleks.</p>
  <h3>Komponen CNN</h3>
  <ul>
    <li><strong>Convolutional Layer:</strong> Filter/kernel yang slide over input, menghasilkan feature map. Setiap filter mendeteksi pola tertentu.</li>
    <li><strong>Pooling Layer:</strong> Mengurangi dimensi spatial. Max Pooling mengambil nilai maksimum dari region.</li>
    <li><strong>Padding:</strong> Menambahkan border nol di sekitar input. Same padding mempertahankan ukuran output.</li>
    <li><strong>Stride:</strong> Langkah pergeseran filter. Stride 2 mengurangi dimensi output menjadi setengah.</li>
    <li><strong>Fully Connected Layer:</strong> Layer terakhir yang menggabungkan semua fitur untuk klasifikasi akhir.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> tensorflow.keras <span class="kw">import</span> layers, models

model = models.Sequential([
    layers.Conv2D(<span class="num">32</span>, (<span class="num">3</span>,<span class="num">3</span>), activation=<span class="str">'relu'</span>, padding=<span class="str">'same'</span>, input_shape=(<span class="num">32</span>,<span class="num">32</span>,<span class="num">3</span>)),
    layers.BatchNormalization(),
    layers.MaxPooling2D((<span class="num">2</span>,<span class="num">2</span>)),
    layers.Dropout(<span class="num">0.25</span>),
    layers.Conv2D(<span class="num">64</span>, (<span class="num">3</span>,<span class="num">3</span>), activation=<span class="str">'relu'</span>, padding=<span class="str">'same'</span>),
    layers.MaxPooling2D((<span class="num">2</span>,<span class="num">2</span>)),
    layers.Dropout(<span class="num">0.25</span>),
    layers.Flatten(),
    layers.Dense(<span class="num">512</span>, activation=<span class="str">'relu'</span>),
    layers.Dropout(<span class="num">0.5</span>),
    layers.Dense(<span class="num">10</span>, activation=<span class="str">'softmax'</span>)
])
model.compile(optimizer=<span class="str">'adam'</span>, loss=<span class="str">'sparse_categorical_crossentropy'</span>, metrics=[<span class="str">'accuracy'</span>])</div>

  <h3>Transfer Learning</h3>
  <p>Menggunakan model yang sudah dilatih pada dataset besar (ImageNet, 1.2 juta gambar) sebagai starting point untuk task baru. Sangat efektif ketika data training terbatas.</p>
  <div class="code-block"><span class="kw">from</span> tensorflow.keras.applications <span class="kw">import</span> ResNet50V2
<span class="kw">from</span> tensorflow.keras <span class="kw">import</span> layers, models

base_model = ResNet50V2(weights=<span class="str">'imagenet'</span>, include_top=<span class="kw">False</span>, input_shape=(<span class="num">224</span>,<span class="num">224</span>,<span class="num">3</span>))
base_model.trainable = <span class="kw">False</span>

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(<span class="num">256</span>, activation=<span class="str">'relu'</span>),
    layers.Dropout(<span class="num">0.5</span>),
    layers.Dense(<span class="num">5</span>, activation=<span class="str">'softmax'</span>)
])

<span class="cm"># Fine-tuning: unfreeze layer terakhir</span>
base_model.trainable = <span class="kw">True</span>
<span class="kw">for</span> layer <span class="kw">in</span> base_model.layers[:-<span class="num">20</span>]:
    layer.trainable = <span class="kw">False</span></div>
</div>

<div class="materi-section">
  <h2>🔁 Recurrent Neural Networks dan LSTM</h2>
  <p>RNN dirancang untuk data sekuensial (teks, time series, audio) di mana urutan informasi penting. RNN memiliki memory — output dari timestep sebelumnya digunakan sebagai input untuk timestep berikutnya.</p>
  <h3>Masalah Vanishing Gradient</h3>
  <p>RNN standar kesulitan belajar dependensi jangka panjang karena gradient mengecil secara eksponensial saat backpropagation melalui banyak timestep. Solusinya: LSTM dan GRU.</p>
  <h3>LSTM (Long Short-Term Memory)</h3>
  <p>LSTM memiliki mekanisme gate yang mengontrol aliran informasi:</p>
  <ul>
    <li><strong>Forget Gate:</strong> Memutuskan informasi mana dari cell state yang harus dilupakan.</li>
    <li><strong>Input Gate:</strong> Memutuskan informasi baru mana yang akan disimpan ke cell state.</li>
    <li><strong>Output Gate:</strong> Memutuskan bagian mana dari cell state yang akan menjadi output.</li>
    <li><strong>Cell State:</strong> Conveyor belt yang membawa informasi jangka panjang.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> tensorflow.keras <span class="kw">import</span> layers, models

model = models.Sequential([
    layers.LSTM(<span class="num">128</span>, return_sequences=<span class="kw">True</span>, input_shape=(<span class="num">60</span>, <span class="num">1</span>)),
    layers.Dropout(<span class="num">0.2</span>),
    layers.LSTM(<span class="num">64</span>, return_sequences=<span class="kw">False</span>),
    layers.Dropout(<span class="num">0.2</span>),
    layers.Dense(<span class="num">32</span>, activation=<span class="str">'relu'</span>),
    layers.Dense(<span class="num">1</span>)
])
model.compile(optimizer=<span class="str">'adam'</span>, loss=<span class="str">'mse'</span>)

<span class="cm"># Bidirectional LSTM</span>
model_bi = models.Sequential([
    layers.Bidirectional(layers.LSTM(<span class="num">64</span>), input_shape=(<span class="num">100</span>, <span class="num">50</span>)),
    layers.Dense(<span class="num">1</span>, activation=<span class="str">'sigmoid'</span>)
])</div>
</div>

<div class="materi-section">
  <h2>🤖 Transformer dan Modern Deep Learning</h2>
  <h3>Attention Mechanism</h3>
  <p>Diperkenalkan pada paper "Attention Is All You Need" (Vaswani et al., 2017). Memungkinkan model untuk fokus pada bagian input yang relevan saat menghasilkan setiap output.</p>
  <p><strong>Self-Attention:</strong> Setiap token dalam sequence memperhatikan semua token lain untuk membangun representasi kontekstual.</p>
  <p><strong>Formula Attention:</strong> Attention(Q, K, V) = softmax(Q*K_transpose / sqrt(dk)) * V</p>
  <h3>Transformer Architecture</h3>
  <ul>
    <li><strong>Multi-Head Attention:</strong> Menjalankan attention beberapa kali secara paralel — menangkap berbagai jenis hubungan.</li>
    <li><strong>Positional Encoding:</strong> Posisi token ditambahkan secara eksplisit menggunakan sinusoidal encoding.</li>
    <li><strong>Feed-Forward Network:</strong> Dua linear transformation dengan ReLU di tengah.</li>
    <li><strong>Layer Normalization:</strong> Normalisasi setelah setiap sub-layer.</li>
    <li><strong>Residual Connections:</strong> Skip connections yang membantu gradient flow.</li>
  </ul>
  <h3>Model-Model Penting</h3>
  <ul>
    <li><strong>BERT (Google, 2018):</strong> Bidirectional Encoder. Terbaik untuk pemahaman teks (classification, NER, QA).</li>
    <li><strong>GPT-4 (OpenAI):</strong> Autoregressive decoder. Terbaik untuk generasi teks.</li>
    <li><strong>T5 (Google):</strong> Encoder-Decoder. Semua NLP task diframe sebagai text-to-text.</li>
    <li><strong>Vision Transformer (ViT):</strong> Transformer untuk computer vision — gambar dibagi menjadi patches.</li>
    <li><strong>Stable Diffusion:</strong> Diffusion model untuk generasi gambar dari teks.</li>
  </ul>
  <div class="code-block"><span class="kw">from</span> transformers <span class="kw">import</span> pipeline

<span class="cm"># Sentiment analysis dengan BERT — 1 baris kode</span>
classifier = pipeline(<span class="str">"sentiment-analysis"</span>)
result = classifier(<span class="str">"Deep learning is revolutionizing AI!"</span>)
<span class="fn">print</span>(result)  <span class="cm"># [{'label': 'POSITIVE', 'score': 0.999}]</span>

<span class="cm"># Text generation dengan GPT-2</span>
generator = pipeline(<span class="str">"text-generation"</span>, model=<span class="str">"gpt2"</span>)
output = generator(<span class="str">"Artificial Intelligence will"</span>, max_length=<span class="num">50</span>, num_return_sequences=<span class="num">1</span>)
<span class="fn">print</span>(output[<span class="num">0</span>][<span class="str">'generated_text'</span>])</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="dl-sources"></ul>
</div>
`;
