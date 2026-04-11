// ══════════════════════════════════════════════
// KURSUS 4: NATURAL LANGUAGE PROCESSING
// ══════════════════════════════════════════════

const courseNLP = {
  id: 4,
  curriculum: [
    {
      title: "Modul 1: Fondasi NLP",
      lessons: [
        { icon: "▶️", title: "Apa itu NLP dan Aplikasinya", duration: "12 min" },
        { icon: "▶️", title: "Text Preprocessing: Tokenization, Stemming, Lemmatization", duration: "22 min" },
        { icon: "▶️", title: "Stop Words & Regular Expressions", duration: "18 min" },
        { icon: "💻", title: "Lab: Text Cleaning dengan NLTK & spaCy", duration: "35 min" },
      ]
    },
    {
      title: "Modul 2: Text Representation",
      lessons: [
        { icon: "▶️", title: "Bag of Words (BoW) & TF-IDF", duration: "20 min" },
        { icon: "▶️", title: "Word Embeddings: Word2Vec, GloVe, FastText", duration: "25 min" },
        { icon: "▶️", title: "Contextual Embeddings: ELMo, BERT", duration: "22 min" },
        { icon: "💻", title: "Lab: Visualisasi Word Embeddings", duration: "30 min" },
      ]
    },
    {
      title: "Modul 3: NLP Tasks Klasik",
      lessons: [
        { icon: "▶️", title: "Sentiment Analysis", duration: "20 min" },
        { icon: "▶️", title: "Named Entity Recognition (NER)", duration: "18 min" },
        { icon: "▶️", title: "Text Classification", duration: "20 min" },
        { icon: "▶️", title: "Machine Translation", duration: "22 min" },
        { icon: "💻", title: "Lab: Sentiment Classifier dengan BERT", duration: "45 min" },
      ]
    },
    {
      title: "Modul 4: Large Language Models",
      lessons: [
        { icon: "▶️", title: "GPT Architecture & Prompting", duration: "25 min" },
        { icon: "▶️", title: "Fine-tuning LLMs", duration: "28 min" },
        { icon: "▶️", title: "RAG (Retrieval Augmented Generation)", duration: "25 min" },
        { icon: "💻", title: "Proyek: Chatbot dengan LLM", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa itu Tokenization dalam NLP?", options: ["Enkripsi teks", "Memecah teks menjadi unit-unit kecil (token)", "Menerjemahkan teks", "Mengompres teks"], answer: 1 },
    { q: "Apa perbedaan TF-IDF dengan Bag of Words?", options: ["TF-IDF lebih lambat", "TF-IDF mempertimbangkan frekuensi kata di seluruh dokumen, BoW tidak", "BoW lebih akurat", "Tidak ada perbedaan"], answer: 1 },
    { q: "Apa keunggulan Word2Vec dibanding BoW?", options: ["Lebih cepat", "Menangkap makna semantik dan hubungan antar kata", "Menggunakan lebih sedikit memori", "Tidak memerlukan training"], answer: 1 },
    { q: "Apa itu Named Entity Recognition (NER)?", options: ["Mengenali nama file", "Mengidentifikasi entitas seperti nama orang, tempat, organisasi dalam teks", "Memberi nama model", "Teknik tokenisasi"], answer: 1 },
    { q: "Apa itu RAG (Retrieval Augmented Generation)?", options: ["Teknik training baru", "Menggabungkan retrieval dokumen dengan generasi teks LLM", "Jenis tokenizer", "Metode fine-tuning"], answer: 1 },
  ],
  sources: [
    { label: "TheAIInternship – NLP Complete Guide 2025", url: "https://theaiinternship.com/blog/natural-language-processing-complete-guide-2025/" },
    { label: "GeeksforGeeks – NLP Tutorial", url: "https://www.geeksforgeeks.org/nlp/natural-language-processing-nlp-tutorial/" },
    { label: "GeeksforGeeks – NLP Algorithms", url: "https://www.geeksforgeeks.org/nlp/nlp-algorithms/" },
    { label: "MarketingScoop – Complete Guide to NLP", url: "https://www.marketingscoop.com/ai/nlp/" },
    { label: "Xonique – NLP Mastery Comprehensive Guide", url: "https://xonique.dev/blog/natural-language-processing-comprehensive-guide/" },
    { label: "Taskade – What Is NLP Guide 2026", url: "https://www.taskade.com/blog/demystifying-ai-what-is-natural-language-processing-nlp-and-how-does-it-work-updated-2024" },
    { label: "NLTK Official Documentation", url: "https://www.nltk.org/" },
    { label: "spaCy Official Documentation", url: "https://spacy.io/usage" },
    { label: "Hugging Face – Transformers Documentation", url: "https://huggingface.co/docs/transformers" },
  ]
};

courseNLP.materi = `
<div class="materi-section">
  <h2>💬 Apa itu Natural Language Processing?</h2>
  <p>Natural Language Processing (NLP) adalah cabang AI yang berfokus pada interaksi antara komputer dan bahasa manusia. NLP memungkinkan mesin untuk <strong>memahami, menginterpretasi, dan menghasilkan</strong> teks atau ucapan manusia secara bermakna.</p>
  <p>NLP adalah teknologi di balik hampir semua produk AI yang kita gunakan sehari-hari: Google Search, ChatGPT, Google Translate, Siri, Alexa, filter spam email, dan autocomplete di smartphone.</p>
  <h3>Tantangan Utama NLP</h3>
  <ul>
    <li><strong>Ambiguitas:</strong> "Bank" bisa berarti bank keuangan atau tepi sungai — tergantung konteks.</li>
    <li><strong>Variasi Bahasa:</strong> Slang, dialek, singkatan, typo, bahasa gaul.</li>
    <li><strong>Sarkasme & Ironi:</strong> "Bagus banget nih, telat 2 jam" — makna berlawanan dengan kata-kata.</li>
    <li><strong>Coreference:</strong> "Alice bertemu Bob. Dia sangat senang." — "Dia" merujuk ke siapa?</li>
    <li><strong>Multilingual:</strong> Ribuan bahasa dengan struktur gramatikal yang sangat berbeda.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>🔤 Text Preprocessing</h2>
  <p>Sebelum teks bisa diproses oleh model ML, perlu dilakukan serangkaian preprocessing untuk membersihkan dan menstandarisasi teks.</p>
  <h3>Pipeline Preprocessing Standar</h3>
  <div class="code-block"><span class="kw">import</span> nltk
<span class="kw">import</span> re
<span class="kw">from</span> nltk.tokenize <span class="kw">import</span> word_tokenize, sent_tokenize
<span class="kw">from</span> nltk.corpus <span class="kw">import</span> stopwords
<span class="kw">from</span> nltk.stem <span class="kw">import</span> WordNetLemmatizer, PorterStemmer

nltk.download([<span class="str">'punkt'</span>, <span class="str">'stopwords'</span>, <span class="str">'wordnet'</span>])

<span class="kw">def</span> <span class="fn">preprocess_text</span>(text):
    <span class="cm"># 1. Lowercase</span>
    text = text.lower()
    <span class="cm"># 2. Hapus karakter khusus & angka</span>
    text = re.sub(r<span class="str">'[^a-zA-Z\s]'</span>, <span class="str">''</span>, text)
    <span class="cm"># 3. Tokenization</span>
    tokens = word_tokenize(text)
    <span class="cm"># 4. Hapus stop words</span>
    stop_words = set(stopwords.words(<span class="str">'english'</span>))
    tokens = [t <span class="kw">for</span> t <span class="kw">in</span> tokens <span class="kw">if</span> t <span class="kw">not in</span> stop_words]
    <span class="cm"># 5. Lemmatization (lebih baik dari stemming)</span>
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) <span class="kw">for</span> t <span class="kw">in</span> tokens]
    <span class="kw">return</span> tokens

text = <span class="str">"The cats are running quickly through the beautiful gardens"</span>
<span class="fn">print</span>(preprocess_text(text))
<span class="cm"># ['cat', 'running', 'quickly', 'beautiful', 'garden']</span></div>

  <h3>Tokenization Tingkat Lanjut</h3>
  <ul>
    <li><strong>Word Tokenization:</strong> Memecah teks menjadi kata-kata individual.</li>
    <li><strong>Sentence Tokenization:</strong> Memecah teks menjadi kalimat.</li>
    <li><strong>Subword Tokenization (BPE):</strong> Digunakan oleh GPT, BERT — memecah kata langka menjadi subword units. "unhappiness" → ["un", "happiness"].</li>
    <li><strong>Character Tokenization:</strong> Setiap karakter adalah token — berguna untuk bahasa dengan morfologi kompleks.</li>
  </ul>

  <h3>Stemming vs Lemmatization</h3>
  <ul>
    <li><strong>Stemming:</strong> Memotong akhiran kata secara kasar. "running" → "run", "studies" → "studi" (bisa tidak valid). Cepat tapi kurang akurat.</li>
    <li><strong>Lemmatization:</strong> Mengembalikan kata ke bentuk dasar (lemma) berdasarkan kamus. "better" → "good", "running" → "run". Lebih akurat tapi lebih lambat.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>📊 Text Representation</h2>
  <h3>Bag of Words (BoW)</h3>
  <p>Representasi paling sederhana: setiap dokumen direpresentasikan sebagai vektor frekuensi kata. Mengabaikan urutan kata dan konteks.</p>
  <div class="code-block"><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer, TfidfVectorizer

corpus = [
    <span class="str">"Machine learning is amazing"</span>,
    <span class="str">"Deep learning is a subset of machine learning"</span>,
    <span class="str">"NLP is a branch of AI"</span>
]

<span class="cm"># Bag of Words</span>
bow = CountVectorizer()
X_bow = bow.fit_transform(corpus)
<span class="fn">print</span>(<span class="str">"Vocabulary:"</span>, bow.vocabulary_)

<span class="cm"># TF-IDF (Term Frequency - Inverse Document Frequency)</span>
tfidf = TfidfVectorizer(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), max_features=<span class="num">1000</span>)
X_tfidf = tfidf.fit_transform(corpus)
<span class="cm"># TF-IDF memberi bobot lebih tinggi pada kata yang sering di dokumen ini</span>
<span class="cm"># tapi jarang di dokumen lain — lebih informatif dari BoW</span></div>

  <h3>Word Embeddings</h3>
  <p>Representasi kata sebagai vektor dense berdimensi rendah (biasanya 100-300 dimensi) yang menangkap makna semantik. Kata-kata dengan makna serupa memiliki vektor yang berdekatan.</p>
  <p><strong>Properti menarik Word2Vec:</strong> king - man + woman ≈ queen</p>
  <div class="code-block"><span class="kw">from</span> gensim.models <span class="kw">import</span> Word2Vec
<span class="kw">import</span> gensim.downloader <span class="kw">as</span> api

<span class="cm"># Load pre-trained Word2Vec (Google News, 3 juta kata)</span>
model = api.load(<span class="str">'word2vec-google-news-300'</span>)

<span class="cm"># Kata-kata serupa</span>
similar = model.most_similar(<span class="str">'python'</span>, topn=<span class="num">5</span>)
<span class="fn">print</span>(similar)

<span class="cm"># Operasi vektor</span>
result = model.most_similar(positive=[<span class="str">'king'</span>, <span class="str">'woman'</span>], negative=[<span class="str">'man'</span>])
<span class="fn">print</span>(result[<span class="num">0</span>])  <span class="cm"># ('queen', 0.71)</span>

<span class="cm"># Train Word2Vec sendiri</span>
sentences = [[<span class="str">'machine'</span>, <span class="str">'learning'</span>, <span class="str">'is'</span>, <span class="str">'fun'</span>], [<span class="str">'deep'</span>, <span class="str">'learning'</span>, <span class="str">'rocks'</span>]]
custom_model = Word2Vec(sentences, vector_size=<span class="num">100</span>, window=<span class="num">5</span>, min_count=<span class="num">1</span>, workers=<span class="num">4</span>)</div>
</div>

<div class="materi-section">
  <h2>🎯 NLP Tasks Utama</h2>
  <h3>Sentiment Analysis</h3>
  <p>Menentukan sentimen (positif/negatif/netral) dari teks. Aplikasi: analisis review produk, monitoring media sosial, analisis feedback pelanggan.</p>
  <div class="code-block"><span class="kw">from</span> transformers <span class="kw">import</span> pipeline

<span class="cm"># Zero-shot dengan pre-trained model</span>
sentiment = pipeline(<span class="str">"sentiment-analysis"</span>, model=<span class="str">"distilbert-base-uncased-finetuned-sst-2-english"</span>)

reviews = [
    <span class="str">"This product is absolutely fantastic! Best purchase ever."</span>,
    <span class="str">"Terrible quality, broke after one day. Very disappointed."</span>,
    <span class="str">"It's okay, nothing special but does the job."</span>
]

<span class="kw">for</span> review <span class="kw">in</span> reviews:
    result = sentiment(review)[<span class="num">0</span>]
    <span class="fn">print</span>(<span class="str">f"{result['label']} ({result['score']:.2%}): {review[:50]}..."</span>)</div>

  <h3>Named Entity Recognition (NER)</h3>
  <p>Mengidentifikasi dan mengklasifikasikan entitas dalam teks: nama orang (PER), organisasi (ORG), lokasi (LOC), tanggal (DATE), jumlah uang (MONEY), dll.</p>
  <div class="code-block"><span class="kw">import</span> spacy

nlp = spacy.load(<span class="str">"en_core_web_sm"</span>)
text = <span class="str">"Elon Musk founded SpaceX in 2002 in Hawthorne, California with $100 million."</span>
doc = nlp(text)

<span class="kw">for</span> ent <span class="kw">in</span> doc.ents:
    <span class="fn">print</span>(<span class="str">f"{ent.text:20} → {ent.label_} ({spacy.explain(ent.label_)})"</span>)
<span class="cm"># Elon Musk            → PERSON</span>
<span class="cm"># SpaceX               → ORG</span>
<span class="cm"># 2002                 → DATE</span>
<span class="cm"># Hawthorne, California → GPE (Geopolitical Entity)</span>
<span class="cm"># $100 million         → MONEY</span></div>

  <h3>Text Classification</h3>
  <div class="code-block"><span class="kw">from</span> transformers <span class="kw">import</span> BertTokenizer, BertForSequenceClassification
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, Dataset
<span class="kw">import</span> torch

<span class="kw">class</span> <span class="fn">TextDataset</span>(Dataset):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, texts, labels, tokenizer, max_len=<span class="num">128</span>):
        self.encodings = tokenizer(texts, truncation=<span class="kw">True</span>, padding=<span class="kw">True</span>, max_length=max_len)
        self.labels = labels
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> len(self.labels)
    <span class="kw">def</span> <span class="fn">__getitem__</span>(self, idx):
        item = {k: torch.tensor(v[idx]) <span class="kw">for</span> k, v <span class="kw">in</span> self.encodings.items()}
        item[<span class="str">'labels'</span>] = torch.tensor(self.labels[idx])
        <span class="kw">return</span> item

tokenizer = BertTokenizer.from_pretrained(<span class="str">'bert-base-uncased'</span>)
model = BertForSequenceClassification.from_pretrained(<span class="str">'bert-base-uncased'</span>, num_labels=<span class="num">3</span>)</div>
</div>

<div class="materi-section">
  <h2>🚀 Large Language Models (LLMs)</h2>
  <p>LLM adalah model bahasa dengan miliaran parameter yang dilatih pada corpus teks yang sangat besar. Mereka menunjukkan kemampuan "emergent" — kemampuan yang tidak secara eksplisit dilatih, seperti reasoning, coding, dan problem-solving.</p>
  <h3>Prompting Techniques</h3>
  <ul>
    <li><strong>Zero-shot:</strong> Langsung tanya tanpa contoh. "Terjemahkan ke Bahasa Indonesia: Hello World"</li>
    <li><strong>Few-shot:</strong> Berikan beberapa contoh sebelum pertanyaan utama.</li>
    <li><strong>Chain-of-Thought (CoT):</strong> Minta model berpikir step-by-step. "Mari kita pikirkan langkah demi langkah..."</li>
    <li><strong>Role Prompting:</strong> "Kamu adalah seorang data scientist berpengalaman..."</li>
  </ul>
  <h3>RAG (Retrieval Augmented Generation)</h3>
  <p>Menggabungkan LLM dengan sistem retrieval dokumen. Alih-alih mengandalkan pengetahuan yang "tersimpan" dalam parameter, RAG mengambil dokumen relevan dari database dan memberikannya sebagai konteks ke LLM.</p>
  <div class="code-block"><span class="cm"># Contoh RAG sederhana dengan LangChain</span>
<span class="cm"># pip install langchain chromadb openai</span>
<span class="kw">from</span> langchain.vectorstores <span class="kw">import</span> Chroma
<span class="kw">from</span> langchain.embeddings <span class="kw">import</span> OpenAIEmbeddings
<span class="kw">from</span> langchain.chains <span class="kw">import</span> RetrievalQA
<span class="kw">from</span> langchain.llms <span class="kw">import</span> OpenAI

<span class="cm"># 1. Buat vector store dari dokumen</span>
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(documents, embeddings)

<span class="cm"># 2. Buat retrieval chain</span>
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(temperature=<span class="num">0</span>),
    retriever=vectorstore.as_retriever(search_kwargs={<span class="str">"k"</span>: <span class="num">3</span>})
)

answer = qa_chain.run(<span class="str">"Apa itu machine learning?"</span>)</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="nlp-sources"></ul>
</div>
`;
