// ══════════════════════════════════════════════
// KURSUS 5: COMPUTER VISION WITH PYTHON
// ══════════════════════════════════════════════

const courseComputerVision = {
  id: 5,
  curriculum: [
    {
      title: "Modul 1: Dasar Computer Vision",
      lessons: [
        { icon: "▶️", title: "Apa itu Computer Vision?", duration: "12 min" },
        { icon: "▶️", title: "Representasi Gambar: Pixel, Channel, Color Space", duration: "18 min" },
        { icon: "▶️", title: "OpenCV Basics: Load, Display, Transform", duration: "22 min" },
        { icon: "💻", title: "Lab: Manipulasi Gambar dengan OpenCV", duration: "35 min" },
      ]
    },
    {
      title: "Modul 2: Image Processing",
      lessons: [
        { icon: "▶️", title: "Filtering: Blur, Sharpen, Edge Detection", duration: "20 min" },
        { icon: "▶️", title: "Morphological Operations", duration: "15 min" },
        { icon: "▶️", title: "Histogram Equalization & Thresholding", duration: "18 min" },
        { icon: "💻", title: "Lab: Image Enhancement Pipeline", duration: "30 min" },
      ]
    },
    {
      title: "Modul 3: CNN untuk Computer Vision",
      lessons: [
        { icon: "▶️", title: "Image Classification dengan CNN", duration: "25 min" },
        { icon: "▶️", title: "Object Detection: YOLO, SSD, Faster R-CNN", duration: "28 min" },
        { icon: "▶️", title: "Image Segmentation: Semantic & Instance", duration: "22 min" },
        { icon: "💻", title: "Lab: Real-time Object Detection dengan YOLOv8", duration: "50 min" },
      ]
    },
    {
      title: "Modul 4: Advanced Computer Vision",
      lessons: [
        { icon: "▶️", title: "Face Detection & Recognition", duration: "22 min" },
        { icon: "▶️", title: "Pose Estimation dengan MediaPipe", duration: "20 min" },
        { icon: "▶️", title: "Optical Flow & Video Analysis", duration: "20 min" },
        { icon: "💻", title: "Proyek: Sistem Absensi Face Recognition", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Berapa channel yang dimiliki gambar RGB?", options: ["1", "2", "3", "4"], answer: 2 },
    { q: "Apa fungsi Pooling Layer dalam CNN?", options: ["Menambah parameter", "Mengurangi dimensi spatial dan komputasi", "Meningkatkan resolusi gambar", "Menambah channel"], answer: 1 },
    { q: "Algoritma deteksi objek mana yang terkenal dengan kecepatannya (real-time)?", options: ["R-CNN", "YOLO", "VGG", "AlexNet"], answer: 1 },
    { q: "Apa itu Transfer Learning dalam Computer Vision?", options: ["Memindahkan gambar antar server", "Menggunakan model pre-trained ImageNet untuk task baru", "Teknik augmentasi data", "Metode kompresi gambar"], answer: 1 },
    { q: "Library Python mana yang paling populer untuk Computer Vision?", options: ["Pandas", "NumPy", "OpenCV", "Matplotlib"], answer: 2 },
  ],
  sources: [
    { label: "DataCamp – PyTorch CNN Tutorial", url: "https://www.datacamp.com/tutorial/pytorch-cnn-tutorial" },
    { label: "Orchestrator.dev – Image Recognition in Python", url: "https://orchestrator.dev/blog/2024-12-22-image-recognition-python-article" },
    { label: "Reintech – Image Recognition System with Python", url: "https://reintech.io/blog/how-to-create-an-image-recognition-system-with-python" },
    { label: "33rdSquare – Image Classification using CNN", url: "https://www.33rdsquare.com/image-classification-using-convolutional-neural-network-with-python/" },
    { label: "Krython – CNNs Image Classification Tutorial", url: "https://krython.com/tutorial/python/cnns-image-classification/" },
    { label: "OpenCV Official Documentation", url: "https://docs.opencv.org/" },
    { label: "Ultralytics YOLOv8 Documentation", url: "https://docs.ultralytics.com/" },
  ]
};

courseComputerVision.materi = `
<div class="materi-section">
  <h2>👁️ Apa itu Computer Vision?</h2>
  <p>Computer Vision adalah bidang AI yang memungkinkan komputer untuk <strong>melihat, memahami, dan menginterpretasi dunia visual</strong> — gambar dan video — seperti yang dilakukan manusia. Ini adalah salah satu aplikasi Deep Learning yang paling sukses dan berdampak luas.</p>
  <ul>
    <li><strong>Autonomous Vehicles:</strong> Tesla, Waymo menggunakan CV untuk mendeteksi jalan, rambu, pejalan kaki.</li>
    <li><strong>Medical Imaging:</strong> Deteksi kanker dari X-ray, MRI, CT scan dengan akurasi melebihi dokter.</li>
    <li><strong>Face Recognition:</strong> Unlock smartphone, sistem keamanan, absensi otomatis.</li>
    <li><strong>Augmented Reality:</strong> Filter Snapchat/Instagram, Google Lens, Apple ARKit.</li>
    <li><strong>Quality Control:</strong> Deteksi cacat produk di lini produksi manufaktur.</li>
    <li><strong>Agriculture:</strong> Deteksi penyakit tanaman dari foto drone.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>🖼️ Representasi Gambar Digital</h2>
  <p>Gambar digital adalah array 2D (grayscale) atau 3D (berwarna) dari nilai pixel. Setiap pixel memiliki nilai intensitas 0-255.</p>
  <ul>
    <li><strong>Grayscale:</strong> Shape (H, W) — satu channel, nilai 0 (hitam) sampai 255 (putih).</li>
    <li><strong>RGB:</strong> Shape (H, W, 3) — tiga channel: Red, Green, Blue.</li>
    <li><strong>RGBA:</strong> Shape (H, W, 4) — RGB + Alpha (transparansi).</li>
    <li><strong>HSV (Hue, Saturation, Value):</strong> Lebih intuitif untuk filtering warna tertentu.</li>
  </ul>
  <div class="code-block"><span class="kw">import</span> cv2
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt

<span class="cm"># Load gambar</span>
img = cv2.imread(<span class="str">'image.jpg'</span>)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  <span class="cm"># OpenCV pakai BGR!</span>

<span class="fn">print</span>(<span class="str">f"Shape: {img.shape}"</span>)    <span class="cm"># (height, width, channels)</span>
<span class="fn">print</span>(<span class="str">f"Dtype: {img.dtype}"</span>)    <span class="cm"># uint8</span>
<span class="fn">print</span>(<span class="str">f"Max: {img.max()}"</span>)      <span class="cm"># 255</span>

<span class="cm"># Resize</span>
img_resized = cv2.resize(img, (<span class="num">224</span>, <span class="num">224</span>))

<span class="cm"># Crop</span>
img_crop = img[<span class="num">100</span>:<span class="num">300</span>, <span class="num">50</span>:<span class="num">250</span>]

<span class="cm"># Flip</span>
img_flip = cv2.flip(img, <span class="num">1</span>)  <span class="cm"># 1=horizontal, 0=vertical</span>

<span class="cm"># Rotate</span>
M = cv2.getRotationMatrix2D((<span class="num">112</span>, <span class="num">112</span>), <span class="num">45</span>, <span class="num">1.0</span>)
img_rot = cv2.warpAffine(img, M, (<span class="num">224</span>, <span class="num">224</span>))

<span class="cm"># Konversi color space</span>
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
img_hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)</div>
</div>

<div class="materi-section">
  <h2>🔧 Image Processing dengan OpenCV</h2>
  <h3>Filtering & Smoothing</h3>
  <div class="code-block"><span class="cm"># Gaussian Blur — mengurangi noise</span>
blurred = cv2.GaussianBlur(img, (<span class="num">15</span>, <span class="num">15</span>), <span class="num">0</span>)

<span class="cm"># Median Blur — efektif untuk salt-and-pepper noise</span>
median = cv2.medianBlur(img, <span class="num">5</span>)

<span class="cm"># Bilateral Filter — blur tapi pertahankan edges</span>
bilateral = cv2.bilateralFilter(img, <span class="num">9</span>, <span class="num">75</span>, <span class="num">75</span>)

<span class="cm"># Edge Detection dengan Canny</span>
edges = cv2.Canny(img_gray, threshold1=<span class="num">100</span>, threshold2=<span class="num">200</span>)

<span class="cm"># Sobel — gradient horizontal dan vertikal</span>
sobelx = cv2.Sobel(img_gray, cv2.CV_64F, <span class="num">1</span>, <span class="num">0</span>, ksize=<span class="num">3</span>)
sobely = cv2.Sobel(img_gray, cv2.CV_64F, <span class="num">0</span>, <span class="num">1</span>, ksize=<span class="num">3</span>)
magnitude = np.sqrt(sobelx**<span class="num">2</span> + sobely**<span class="num">2</span>)

<span class="cm"># Thresholding</span>
_, thresh = cv2.threshold(img_gray, <span class="num">127</span>, <span class="num">255</span>, cv2.THRESH_BINARY)
adaptive = cv2.adaptiveThreshold(img_gray, <span class="num">255</span>,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, <span class="num">11</span>, <span class="num">2</span>)</div>

  <h3>Data Augmentation untuk Training</h3>
  <div class="code-block"><span class="kw">from</span> tensorflow.keras.preprocessing.image <span class="kw">import</span> ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=<span class="num">20</span>,
    width_shift_range=<span class="num">0.2</span>,
    height_shift_range=<span class="num">0.2</span>,
    horizontal_flip=<span class="kw">True</span>,
    zoom_range=<span class="num">0.2</span>,
    brightness_range=[<span class="num">0.8</span>, <span class="num">1.2</span>],
    fill_mode=<span class="str">'nearest'</span>,
    rescale=<span class="num">1.</span>/<span class="num">255</span>
)

train_generator = datagen.flow_from_directory(
    <span class="str">'data/train'</span>, target_size=(<span class="num">224</span>, <span class="num">224</span>),
    batch_size=<span class="num">32</span>, class_mode=<span class="str">'categorical'</span>
)</div>
</div>

<div class="materi-section">
  <h2>🎯 Object Detection</h2>
  <p>Object detection tidak hanya mengklasifikasikan objek tapi juga melokalisasinya dengan bounding box. Lebih kompleks dari image classification.</p>
  <h3>YOLO (You Only Look Once)</h3>
  <p>YOLO adalah algoritma deteksi objek real-time yang memproses seluruh gambar dalam satu forward pass. Sangat cepat (dapat mencapai 100+ FPS) dan akurat.</p>
  <div class="code-block"><span class="cm"># pip install ultralytics</span>
<span class="kw">from</span> ultralytics <span class="kw">import</span> YOLO
<span class="kw">import</span> cv2

<span class="cm"># Load model YOLOv8</span>
model = YOLO(<span class="str">'yolov8n.pt'</span>)  <span class="cm"># nano, small, medium, large, xlarge</span>

<span class="cm"># Deteksi pada gambar</span>
results = model(<span class="str">'image.jpg'</span>)
results[<span class="num">0</span>].show()  <span class="cm"># tampilkan hasil</span>

<span class="cm"># Real-time deteksi dari webcam</span>
cap = cv2.VideoCapture(<span class="num">0</span>)
<span class="kw">while</span> cap.isOpened():
    ret, frame = cap.read()
    <span class="kw">if not</span> ret: <span class="kw">break</span>
    results = model(frame, stream=<span class="kw">True</span>)
    <span class="kw">for</span> r <span class="kw">in</span> results:
        annotated = r.plot()
        cv2.imshow(<span class="str">'YOLOv8 Detection'</span>, annotated)
    <span class="kw">if</span> cv2.waitKey(<span class="num">1</span>) & <span class="num">0xFF</span> == ord(<span class="str">'q'</span>): <span class="kw">break</span>
cap.release(); cv2.destroyAllWindows()

<span class="cm"># Fine-tune pada dataset custom</span>
model.train(data=<span class="str">'custom_dataset.yaml'</span>, epochs=<span class="num">100</span>, imgsz=<span class="num">640</span>)</div>

  <h3>Image Segmentation</h3>
  <ul>
    <li><strong>Semantic Segmentation:</strong> Setiap pixel diklasifikasikan ke kategori. Semua mobil = satu warna, semua orang = warna lain. Model: DeepLab, FCN.</li>
    <li><strong>Instance Segmentation:</strong> Membedakan setiap instance objek. Mobil 1 dan Mobil 2 punya mask berbeda. Model: Mask R-CNN, YOLOv8-seg.</li>
    <li><strong>Panoptic Segmentation:</strong> Kombinasi semantic + instance segmentation.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>👤 Face Detection & Recognition</h2>
  <div class="code-block"><span class="kw">import</span> face_recognition  <span class="cm"># pip install face-recognition</span>
<span class="kw">import</span> cv2
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Load gambar referensi</span>
known_image = face_recognition.load_image_file(<span class="str">"person.jpg"</span>)
known_encoding = face_recognition.face_encodings(known_image)[<span class="num">0</span>]

<span class="cm"># Deteksi & kenali wajah di gambar baru</span>
unknown_image = face_recognition.load_image_file(<span class="str">"unknown.jpg"</span>)
unknown_encodings = face_recognition.face_encodings(unknown_image)

<span class="kw">for</span> encoding <span class="kw">in</span> unknown_encodings:
    match = face_recognition.compare_faces([known_encoding], encoding, tolerance=<span class="num">0.6</span>)
    distance = face_recognition.face_distance([known_encoding], encoding)
    <span class="fn">print</span>(<span class="str">f"Match: {match[0]}, Distance: {distance[0]:.3f}"</span>)</div>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="cv-sources"></ul>
</div>
`;

// ══════════════════════════════════════════════
// QUIZ PER MODUL — COMPUTER VISION WITH PYTHON
// Sumber: AIMCQs CNN (aimcqs.com/convolutional-neural-networks),
//         Lolaapp CNN Quiz (lolaapp.com/convolutional-neural-networks-quiz),
//         GeeksforGeeks Object Detection (geeksforgeeks.org/object-detection-with-yolo-and-opencv)
// ══════════════════════════════════════════════
courseComputerVision.moduleQuizzes = [
  {
    moduleIndex: 0,
    moduleTitle: "Modul 1: Dasar Computer Vision",
    questions: [
      {
        q: "Gambar RGB memiliki berapa channel?",
        opts: ["1", "2", "3", "4"],
        ans: 2
      },
      {
        q: "Mengapa OpenCV menggunakan format BGR bukan RGB?",
        opts: ["BGR lebih akurat", "Alasan historis dari implementasi awal OpenCV yang mengikuti konvensi Windows BMP", "BGR lebih cepat diproses", "BGR menggunakan lebih sedikit memori"],
        ans: 1
      },
      {
        q: "Apa kegunaan Color Space HSV dalam Computer Vision?",
        opts: ["Meningkatkan resolusi gambar", "Lebih intuitif untuk filtering warna tertentu karena memisahkan hue dari brightness", "Mengurangi ukuran file gambar", "Meningkatkan kontras gambar"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan pixel dalam gambar digital?",
        opts: ["Unit terkecil gambar dengan nilai intensitas warna", "Ukuran file gambar", "Resolusi gambar", "Format file gambar"],
        ans: 0
      },
      {
        q: "Fungsi cv2.resize() digunakan untuk...",
        opts: ["Mengubah format gambar", "Mengubah dimensi (lebar dan tinggi) gambar", "Mengubah color space", "Mendeteksi objek"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 1,
    moduleTitle: "Modul 2: Image Processing",
    questions: [
      {
        q: "Apa fungsi Gaussian Blur dalam image processing?",
        opts: ["Mendeteksi tepi gambar", "Mengurangi noise dengan menghaluskan gambar menggunakan distribusi Gaussian", "Meningkatkan ketajaman gambar", "Mengubah warna gambar"],
        ans: 1
      },
      {
        q: "Algoritma Canny Edge Detection digunakan untuk...",
        opts: ["Menghaluskan gambar", "Mendeteksi tepi (edges) dalam gambar", "Mengubah gambar ke grayscale", "Mendeteksi wajah"],
        ans: 1
      },
      {
        q: "Apa keunggulan Bilateral Filter dibanding Gaussian Blur?",
        opts: ["Bilateral Filter lebih cepat", "Bilateral Filter menghaluskan gambar sambil mempertahankan tepi (edges)", "Bilateral Filter menggunakan lebih sedikit memori", "Bilateral Filter lebih mudah diimplementasikan"],
        ans: 1
      },
      {
        q: "Data Augmentation dalam training CNN bertujuan untuk...",
        opts: ["Mempercepat training", "Memperbanyak data training secara artifisial untuk mencegah overfitting", "Meningkatkan resolusi gambar", "Mengurangi ukuran model"],
        ans: 1
      },
      {
        q: "Adaptive Thresholding lebih baik dari Global Thresholding untuk gambar dengan...",
        opts: ["Pencahayaan seragam", "Pencahayaan tidak seragam (varying illumination)", "Gambar berwarna", "Gambar beresolusi tinggi"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 2,
    moduleTitle: "Modul 3: CNN untuk Computer Vision",
    questions: [
      {
        q: "Apa yang dimaksud dengan 'stride' dalam Convolutional Layer?",
        opts: ["Ukuran filter", "Langkah pergeseran filter saat sliding over input — stride 2 mengurangi dimensi output menjadi setengah", "Jumlah filter", "Padding yang ditambahkan"],
        ans: 1
      },
      {
        q: "YOLO (You Only Look Once) terkenal karena...",
        opts: ["Akurasi tertinggi di antara semua detector", "Kecepatan real-time — memproses seluruh gambar dalam satu forward pass", "Ukuran model yang sangat kecil", "Tidak memerlukan GPU"],
        ans: 1
      },
      {
        q: "Apa perbedaan Semantic Segmentation dan Instance Segmentation?",
        opts: ["Tidak ada perbedaan", "Semantic memberi label per pixel per kelas, Instance membedakan setiap objek individu", "Instance lebih lambat tapi kurang akurat", "Semantic hanya untuk gambar medis"],
        ans: 1
      },
      {
        q: "Faster R-CNN menggunakan komponen apa yang membedakannya dari R-CNN biasa?",
        opts: ["Lebih banyak layer", "Region Proposal Network (RPN) yang terintegrasi sehingga jauh lebih cepat", "Menggunakan LSTM", "Menggunakan Transformer"],
        ans: 1
      },
      {
        q: "Mengapa Transfer Learning sangat efektif untuk Computer Vision?",
        opts: ["Model pre-trained lebih kecil", "Model pre-trained pada ImageNet sudah belajar fitur visual umum (edges, textures, shapes) yang berguna untuk banyak task", "Transfer Learning tidak memerlukan GPU", "Transfer Learning selalu menghasilkan akurasi 100%"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 3,
    moduleTitle: "Modul 4: Advanced Computer Vision",
    questions: [
      {
        q: "Face Recognition berbeda dari Face Detection karena...",
        opts: ["Face Detection lebih akurat", "Face Detection hanya menemukan lokasi wajah, Face Recognition mengidentifikasi siapa orangnya", "Face Recognition lebih cepat", "Keduanya adalah hal yang sama"],
        ans: 1
      },
      {
        q: "MediaPipe digunakan untuk task apa dalam Computer Vision?",
        opts: ["Object detection saja", "Pose estimation, hand tracking, face mesh — real-time di perangkat mobile", "Image segmentation saja", "Text recognition"],
        ans: 1
      },
      {
        q: "Optical Flow digunakan untuk menganalisis apa dalam video?",
        opts: ["Warna dominan dalam frame", "Pergerakan objek antar frame berturut-turut", "Kualitas video", "Deteksi wajah"],
        ans: 1
      },
      {
        q: "Apa metrik yang umum digunakan untuk mengevaluasi object detection?",
        opts: ["Accuracy dan F1-Score", "mAP (mean Average Precision)", "MSE dan RMSE", "AUC-ROC"],
        ans: 1
      }
    ]
  }
];

// ══════════════════════════════════════════════
// QUIZ AKHIR KURSUS — COMPUTER VISION WITH PYTHON (20 Soal)
// Sumber: AIMCQs CNN (aimcqs.com/convolutional-neural-networks),
//         Lolaapp CNN Quiz (lolaapp.com/convolutional-neural-networks-quiz),
//         GeeksforGeeks YOLO OpenCV (geeksforgeeks.org/object-detection-with-yolo-and-opencv)
// ══════════════════════════════════════════════
courseComputerVision.finalQuiz = [
  { q: "Berapa channel gambar RGB?", opts: ["1", "2", "3", "4"], ans: 2 },
  { q: "Fungsi Pooling Layer dalam CNN?", opts: ["Menambah parameter", "Mengurangi dimensi spatial dan komputasi", "Meningkatkan resolusi gambar", "Menambah channel"], ans: 1 },
  { q: "YOLO terkenal karena?", opts: ["Akurasi tertinggi", "Kecepatan real-time detection dalam satu forward pass", "Ukuran model kecil", "Mudah dilatih"], ans: 1 },
  { q: "Apa itu Transfer Learning dalam CV?", opts: ["Pindah gambar antar server", "Gunakan model pre-trained ImageNet untuk task baru", "Augmentasi data", "Kompresi gambar"], ans: 1 },
  { q: "Library Python paling populer untuk CV?", opts: ["Pandas", "NumPy", "OpenCV", "Matplotlib"], ans: 2 },
  { q: "Mengapa OpenCV menggunakan format BGR bukan RGB?", opts: ["BGR lebih akurat", "Alasan historis dari implementasi awal OpenCV", "BGR lebih cepat", "BGR menggunakan lebih sedikit memori"], ans: 1 },
  { q: "Apa fungsi Gaussian Blur?", opts: ["Mendeteksi tepi", "Mengurangi noise dengan menghaluskan gambar", "Meningkatkan ketajaman", "Mengubah warna"], ans: 1 },
  { q: "Apa yang dilakukan Canny Edge Detection?", opts: ["Menghaluskan gambar", "Mendeteksi tepi (edges) dalam gambar", "Mengubah ke grayscale", "Mendeteksi wajah"], ans: 1 },
  { q: "Apa perbedaan Semantic dan Instance Segmentation?", opts: ["Tidak ada perbedaan", "Semantic memberi label per kelas, Instance membedakan setiap objek individu", "Instance lebih lambat tapi kurang akurat", "Semantic hanya untuk gambar medis"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'stride' dalam CNN?", opts: ["Ukuran filter", "Langkah pergeseran filter — stride 2 mengurangi dimensi output menjadi setengah", "Jumlah filter", "Padding yang ditambahkan"], ans: 1 },
  { q: "Data Augmentation bertujuan untuk...", opts: ["Mempercepat training", "Memperbanyak data training secara artifisial untuk mencegah overfitting", "Meningkatkan resolusi gambar", "Mengurangi ukuran model"], ans: 1 },
  { q: "Faster R-CNN lebih cepat dari R-CNN karena...", opts: ["Lebih sedikit layer", "Region Proposal Network (RPN) yang terintegrasi", "Menggunakan LSTM", "Menggunakan Transformer"], ans: 1 },
  { q: "Face Recognition berbeda dari Face Detection karena...", opts: ["Face Detection lebih akurat", "Face Detection menemukan lokasi wajah, Face Recognition mengidentifikasi siapa orangnya", "Face Recognition lebih cepat", "Keduanya sama"], ans: 1 },
  { q: "Apa metrik evaluasi untuk object detection?", opts: ["Accuracy dan F1-Score", "mAP (mean Average Precision)", "MSE dan RMSE", "AUC-ROC"], ans: 1 },
  { q: "Apa keunggulan Bilateral Filter dibanding Gaussian Blur?", opts: ["Lebih cepat", "Menghaluskan gambar sambil mempertahankan tepi (edges)", "Menggunakan lebih sedikit memori", "Lebih mudah diimplementasikan"], ans: 1 },
  { q: "Arsitektur CNN mana yang memperkenalkan skip connections?", opts: ["AlexNet", "VGG", "ResNet", "LeNet"], ans: 2 },
  { q: "MediaPipe digunakan untuk task apa?", opts: ["Object detection saja", "Pose estimation, hand tracking, face mesh — real-time di mobile", "Image segmentation saja", "Text recognition"], ans: 1 },
  { q: "Apa yang dimaksud dengan Optical Flow?", opts: ["Warna dominan dalam frame", "Pergerakan objek antar frame berturut-turut dalam video", "Kualitas video", "Deteksi wajah"], ans: 1 },
  { q: "Activation function yang umum digunakan di Convolutional Layer?", opts: ["Sigmoid", "Tanh", "ReLU", "Softmax"], ans: 2 },
  { q: "Apa kegunaan Color Space HSV dalam CV?", opts: ["Meningkatkan resolusi", "Lebih intuitif untuk filtering warna tertentu karena memisahkan hue dari brightness", "Mengurangi ukuran file", "Meningkatkan kontras"], ans: 1 }
];
