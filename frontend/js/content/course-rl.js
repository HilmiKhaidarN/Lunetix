// ══════════════════════════════════════════════
// KURSUS 7: REINFORCEMENT LEARNING
// ══════════════════════════════════════════════

const courseRL = {
  id: 7,
  curriculum: [
    {
      title: "Modul 1: Fondasi Reinforcement Learning",
      lessons: [
        { icon: "▶️", title: "Agent, Environment, State, Action, Reward", duration: "18 min" },
        { icon: "▶️", title: "Markov Decision Process (MDP)", duration: "22 min" },
        { icon: "▶️", title: "Policy, Value Function, Q-Function", duration: "20 min" },
        { icon: "▶️", title: "Exploration vs Exploitation Tradeoff", duration: "15 min" },
      ]
    },
    {
      title: "Modul 2: Tabular Methods",
      lessons: [
        { icon: "▶️", title: "Dynamic Programming: Value Iteration", duration: "20 min" },
        { icon: "▶️", title: "Monte Carlo Methods", duration: "18 min" },
        { icon: "▶️", title: "Q-Learning & SARSA", duration: "25 min" },
        { icon: "💻", title: "Lab: Q-Learning di FrozenLake (OpenAI Gym)", duration: "40 min" },
      ]
    },
    {
      title: "Modul 3: Deep Reinforcement Learning",
      lessons: [
        { icon: "▶️", title: "Deep Q-Network (DQN)", duration: "25 min" },
        { icon: "▶️", title: "Policy Gradient Methods: REINFORCE", duration: "22 min" },
        { icon: "▶️", title: "Actor-Critic: A2C, A3C", duration: "22 min" },
        { icon: "▶️", title: "PPO (Proximal Policy Optimization)", duration: "25 min" },
        { icon: "💻", title: "Lab: DQN untuk Atari Games", duration: "55 min" },
      ]
    },
    {
      title: "Modul 4: Advanced RL",
      lessons: [
        { icon: "▶️", title: "Multi-Agent RL", duration: "22 min" },
        { icon: "▶️", title: "Model-Based RL", duration: "20 min" },
        { icon: "▶️", title: "RLHF (RL from Human Feedback) — Cara ChatGPT Dilatih", duration: "25 min" },
        { icon: "💻", title: "Proyek: Robot Navigation dengan PPO", duration: "60 min" },
      ]
    }
  ],
  quiz: [
    { q: "Apa yang dimaksud dengan 'reward' dalam Reinforcement Learning?", options: ["Kecepatan training", "Sinyal feedback dari environment yang menunjukkan kualitas tindakan", "Jumlah parameter model", "Ukuran dataset"], answer: 1 },
    { q: "Apa itu Exploration vs Exploitation tradeoff?", options: ["Tradeoff antara kecepatan dan akurasi", "Tradeoff antara mencoba tindakan baru vs menggunakan tindakan terbaik yang diketahui", "Tradeoff antara training dan testing", "Tradeoff antara reward dan penalty"], answer: 1 },
    { q: "Apa perbedaan Q-Learning dan SARSA?", options: ["Q-Learning lebih lambat", "Q-Learning off-policy (belajar dari optimal policy), SARSA on-policy", "SARSA lebih akurat", "Tidak ada perbedaan"], answer: 1 },
    { q: "Apa inovasi utama DQN dibanding Q-Learning biasa?", options: ["Menggunakan lebih banyak data", "Experience Replay dan Target Network untuk stabilitas training", "Lebih cepat", "Tidak memerlukan reward"], answer: 1 },
    { q: "RLHF digunakan untuk melatih model apa?", options: ["Model computer vision", "Large Language Models seperti ChatGPT", "Model time series", "Model clustering"], answer: 1 },
  ],
  sources: [
    { label: "TheAIInternship – Reinforcement Learning Complete Guide 2025", url: "https://theaiinternship.com/blog/reinforcement-learning-complete-guide-2025/" },
    { label: "Indium Tech – Policy Gradient Methods in RL", url: "https://www.indium.tech/blog/policy-gradient-methods/" },
    { label: "Medium – Complete Guide to Modern RL: From Basics to PPO", url: "https://medium.com/@harshal.dhandrut/a-complete-guide-to-modern-reinforcement-learning-from-basics-to-ppo-6474b0fd24d0" },
    { label: "Sesen.ai – From Q-Tables to Policy Gradients", url: "https://sesen.ai/blog/topics/reinforcement-learning" },
    { label: "Arxiv – Practical Introduction to Deep RL", url: "https://arxiv.org/html/2505.08295v1" },
    { label: "OpenAI Gym Documentation", url: "https://gymnasium.farama.org/" },
    { label: "Stable Baselines3 Documentation", url: "https://stable-baselines3.readthedocs.io/" },
  ]
};

courseRL.materi = `
<div class="materi-section">
  <h2>🎮 Apa itu Reinforcement Learning?</h2>
  <p>Reinforcement Learning (RL) adalah paradigma ML di mana <strong>agent belajar membuat keputusan melalui trial-and-error</strong> dengan berinteraksi dengan environment. Agent menerima reward untuk tindakan baik dan penalty untuk tindakan buruk, dengan tujuan memaksimalkan total reward kumulatif jangka panjang.</p>
  <p>RL berbeda dari Supervised Learning (tidak ada label) dan Unsupervised Learning (ada reward/feedback, bukan hanya data). RL adalah cara belajar yang paling mirip dengan cara manusia dan hewan belajar.</p>
  <h3>Pencapaian Luar Biasa RL</h3>
  <ul>
    <li><strong>AlphaGo (2016):</strong> Mengalahkan juara dunia Go Lee Sedol — permainan yang dianggap terlalu kompleks untuk AI.</li>
    <li><strong>AlphaZero (2017):</strong> Belajar Chess, Go, dan Shogi dari nol hanya dalam beberapa jam, mengalahkan semua program sebelumnya.</li>
    <li><strong>OpenAI Five (2019):</strong> Mengalahkan tim profesional Dota 2 — game dengan action space yang sangat besar.</li>
    <li><strong>ChatGPT/GPT-4:</strong> Menggunakan RLHF (RL from Human Feedback) untuk alignment dengan preferensi manusia.</li>
    <li><strong>AlphaFold 2:</strong> Memecahkan masalah protein folding yang telah menantang ilmuwan selama 50 tahun.</li>
  </ul>
</div>

<div class="materi-section">
  <h2>🏗️ Komponen Dasar RL</h2>
  <ul>
    <li><strong>Agent:</strong> Entitas yang belajar dan membuat keputusan (robot, program game, trading bot).</li>
    <li><strong>Environment:</strong> Dunia tempat agent berinteraksi (game, simulator fisika, pasar saham).</li>
    <li><strong>State (s):</strong> Representasi situasi saat ini dari environment.</li>
    <li><strong>Action (a):</strong> Tindakan yang bisa dilakukan agent di state tertentu.</li>
    <li><strong>Reward (r):</strong> Sinyal numerik yang menunjukkan seberapa baik tindakan agent.</li>
    <li><strong>Policy (π):</strong> Strategi agent — fungsi yang memetakan state ke action. π(a|s) = probabilitas memilih action a di state s.</li>
    <li><strong>Value Function V(s):</strong> Expected total reward dari state s mengikuti policy π.</li>
    <li><strong>Q-Function Q(s,a):</strong> Expected total reward dari mengambil action a di state s, lalu mengikuti policy π.</li>
  </ul>

  <h3>Markov Decision Process (MDP)</h3>
  <p>Framework matematis untuk RL. MDP didefinisikan oleh tuple (S, A, P, R, γ):</p>
  <ul>
    <li><strong>S:</strong> State space</li>
    <li><strong>A:</strong> Action space</li>
    <li><strong>P(s'|s,a):</strong> Transition probability — probabilitas pindah ke state s' dari state s dengan action a</li>
    <li><strong>R(s,a):</strong> Reward function</li>
    <li><strong>γ (gamma):</strong> Discount factor (0-1) — seberapa penting reward masa depan vs sekarang</li>
  </ul>
  <p><strong>Bellman Equation:</strong> V(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V(s')]</p>
</div>

<div class="materi-section">
  <h2>📋 Q-Learning</h2>
  <p>Q-Learning adalah algoritma RL off-policy yang belajar Q-function optimal secara langsung, tanpa perlu model environment. Menggunakan Bellman equation untuk update Q-values secara iteratif.</p>
  <p><strong>Update Rule:</strong> Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]</p>
  <div class="code-block"><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.make(<span class="str">'FrozenLake-v1'</span>, is_slippery=<span class="kw">False</span>)
n_states = env.observation_space.n   <span class="cm"># 16</span>
n_actions = env.action_space.n       <span class="cm"># 4</span>

<span class="cm"># Inisialisasi Q-table</span>
Q = np.zeros((n_states, n_actions))

<span class="cm"># Hyperparameters</span>
alpha = <span class="num">0.1</span>    <span class="cm"># learning rate</span>
gamma = <span class="num">0.99</span>   <span class="cm"># discount factor</span>
epsilon = <span class="num">1.0</span>  <span class="cm"># exploration rate</span>
epsilon_decay = <span class="num">0.995</span>
epsilon_min = <span class="num">0.01</span>
n_episodes = <span class="num">10000</span>

rewards_history = []

<span class="kw">for</span> episode <span class="kw">in</span> range(n_episodes):
    state, _ = env.reset()
    total_reward = <span class="num">0</span>

    <span class="kw">while</span> <span class="kw">True</span>:
        <span class="cm"># Epsilon-greedy policy</span>
        <span class="kw">if</span> np.random.random() < epsilon:
            action = env.action_space.sample()  <span class="cm"># explore</span>
        <span class="kw">else</span>:
            action = np.argmax(Q[state])         <span class="cm"># exploit</span>

        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated <span class="kw">or</span> truncated

        <span class="cm"># Q-Learning update</span>
        Q[state, action] += alpha * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )

        state = next_state
        total_reward += reward
        <span class="kw">if</span> done: <span class="kw">break</span>

    epsilon = max(epsilon_min, epsilon * epsilon_decay)
    rewards_history.append(total_reward)

<span class="fn">print</span>(<span class="str">f"Avg reward (last 100): {np.mean(rewards_history[-100:]):.3f}"</span>)</div>
</div>

<div class="materi-section">
  <h2>🧠 Deep Q-Network (DQN)</h2>
  <p>DQN menggabungkan Q-Learning dengan Deep Neural Network untuk menangani state space yang sangat besar (seperti pixel gambar). Dua inovasi kunci yang membuat DQN stabil:</p>
  <ul>
    <li><strong>Experience Replay:</strong> Simpan transisi (s, a, r, s') dalam replay buffer. Sample mini-batch secara acak untuk training — mengurangi korelasi antar sampel.</li>
    <li><strong>Target Network:</strong> Gunakan network terpisah (target network) untuk menghitung target Q-values. Update target network secara periodik — mengurangi oscillation.</li>
  </ul>
  <div class="code-block"><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> collections <span class="kw">import</span> deque
<span class="kw">import</span> random

<span class="kw">class</span> <span class="fn">DQN</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, state_dim, action_dim):
        <span class="fn">super</span>().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, <span class="num">128</span>), nn.ReLU(),
            nn.Linear(<span class="num">128</span>, <span class="num">128</span>), nn.ReLU(),
            nn.Linear(<span class="num">128</span>, action_dim)
        )
    <span class="kw">def</span> <span class="fn">forward</span>(self, x): <span class="kw">return</span> self.net(x)

<span class="kw">class</span> <span class="fn">ReplayBuffer</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, capacity=<span class="num">10000</span>):
        self.buffer = deque(maxlen=capacity)
    <span class="kw">def</span> <span class="fn">push</span>(self, *args): self.buffer.append(args)
    <span class="kw">def</span> <span class="fn">sample</span>(self, batch_size): <span class="kw">return</span> random.sample(self.buffer, batch_size)
    <span class="kw">def</span> <span class="fn">__len__</span>(self): <span class="kw">return</span> len(self.buffer)

<span class="cm"># Training loop DQN</span>
env = gym.make(<span class="str">'CartPole-v1'</span>)
policy_net = DQN(env.observation_space.shape[<span class="num">0</span>], env.action_space.n)
target_net = DQN(env.observation_space.shape[<span class="num">0</span>], env.action_space.n)
target_net.load_state_dict(policy_net.state_dict())
optimizer = torch.optim.Adam(policy_net.parameters(), lr=<span class="num">1e-3</span>)
buffer = ReplayBuffer()</div>
</div>

<div class="materi-section">
  <h2>🎯 Policy Gradient & PPO</h2>
  <p>Policy Gradient methods langsung mengoptimasi policy π tanpa perlu Q-function. Lebih cocok untuk continuous action spaces (seperti kontrol robot).</p>
  <h3>PPO (Proximal Policy Optimization)</h3>
  <p>PPO adalah algoritma state-of-the-art yang digunakan oleh OpenAI untuk melatih ChatGPT (via RLHF). Membatasi seberapa besar policy bisa berubah dalam satu update — mencegah "catastrophic forgetting".</p>
  <div class="code-block"><span class="cm"># Menggunakan Stable Baselines3 — library RL terpopuler</span>
<span class="cm"># pip install stable-baselines3</span>
<span class="kw">from</span> stable_baselines3 <span class="kw">import</span> PPO, DQN, SAC
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.make(<span class="str">'CartPole-v1'</span>)

<span class="cm"># Train PPO</span>
model = PPO(<span class="str">'MlpPolicy'</span>, env, verbose=<span class="num">1</span>,
            learning_rate=<span class="num">3e-4</span>, n_steps=<span class="num">2048</span>,
            batch_size=<span class="num">64</span>, n_epochs=<span class="num">10</span>)
model.learn(total_timesteps=<span class="num">100000</span>)
model.save(<span class="str">"ppo_cartpole"</span>)

<span class="cm"># Evaluasi</span>
obs, _ = env.reset()
<span class="kw">for</span> _ <span class="kw">in</span> range(<span class="num">1000</span>):
    action, _ = model.predict(obs, deterministic=<span class="kw">True</span>)
    obs, reward, done, _, _ = env.step(action)
    <span class="kw">if</span> done: obs, _ = env.reset()</div>

  <h3>RLHF (Reinforcement Learning from Human Feedback)</h3>
  <p>Teknik yang digunakan untuk melatih ChatGPT dan model bahasa modern agar sesuai dengan preferensi manusia:</p>
  <ol>
    <li><strong>Supervised Fine-tuning (SFT):</strong> Fine-tune LLM pada demonstrasi manusia berkualitas tinggi.</li>
    <li><strong>Reward Model Training:</strong> Latih model reward dari perbandingan output yang dibuat manusia (mana yang lebih baik?).</li>
    <li><strong>RL Optimization:</strong> Gunakan PPO untuk mengoptimasi LLM berdasarkan reward model, dengan KL penalty untuk mencegah drift terlalu jauh dari SFT model.</li>
  </ol>
</div>

<div class="sources-section">
  <h3>📚 Sumber Referensi</h3>
  <ul id="rl-sources"></ul>
</div>
`;

// ══════════════════════════════════════════════
// QUIZ PER MODUL — REINFORCEMENT LEARNING
// Sumber: T4Tutorials RL MCQ (t4tutorials.com/reinforcement-learning-mcqs),
//         EasyExamNotes RL MCQ (easyexamnotes.com/rl-techniques-mcqs),
//         DevInterview Q-Learning (devinterview.io/blog/q-learning-interview-questions)
// ══════════════════════════════════════════════
courseRL.moduleQuizzes = [
  {
    moduleIndex: 0,
    moduleTitle: "Modul 1: Fondasi Reinforcement Learning",
    questions: [
      {
        q: "Apa yang dimaksud dengan 'agent' dalam Reinforcement Learning?",
        opts: ["Dataset yang digunakan untuk training", "Entitas yang belajar dan membuat keputusan dengan berinteraksi dengan environment", "Fungsi reward", "Algoritma optimasi"],
        ans: 1
      },
      {
        q: "Apa itu 'reward' dalam konteks RL?",
        opts: ["Kecepatan training model", "Sinyal numerik dari environment yang menunjukkan kualitas tindakan agent", "Jumlah parameter model", "Ukuran dataset training"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan 'policy' dalam RL?",
        opts: ["Aturan lingkungan", "Strategi agent — fungsi yang memetakan state ke action", "Fungsi reward", "Nilai discount factor"],
        ans: 1
      },
      {
        q: "Discount factor (gamma) dalam RL mengontrol...",
        opts: ["Kecepatan learning", "Seberapa penting reward masa depan dibanding reward sekarang (0=hanya sekarang, 1=jangka panjang)", "Jumlah episode training", "Ukuran action space"],
        ans: 1
      },
      {
        q: "Apa yang dimaksud dengan Markov Property dalam MDP?",
        opts: ["State berikutnya bergantung pada semua history", "State berikutnya hanya bergantung pada state dan action saat ini, bukan history sebelumnya", "Reward selalu positif", "Action space harus diskrit"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 1,
    moduleTitle: "Modul 2: Tabular Methods",
    questions: [
      {
        q: "Apa itu Exploration vs Exploitation tradeoff dalam RL?",
        opts: ["Tradeoff antara kecepatan dan akurasi", "Tradeoff antara mencoba tindakan baru (explore) vs menggunakan tindakan terbaik yang diketahui (exploit)", "Tradeoff antara training dan testing", "Tradeoff antara reward dan penalty"],
        ans: 1
      },
      {
        q: "Epsilon-greedy policy mengatasi exploration-exploitation dengan cara...",
        opts: ["Selalu memilih action terbaik", "Dengan probabilitas epsilon memilih action acak (explore), sisanya memilih action terbaik (exploit)", "Selalu memilih action acak", "Menggunakan model terpisah untuk exploration"],
        ans: 1
      },
      {
        q: "Apa perbedaan Q-Learning dan SARSA?",
        opts: ["Q-Learning lebih lambat", "Q-Learning off-policy (belajar dari optimal policy), SARSA on-policy (belajar dari policy yang sedang dijalankan)", "SARSA lebih akurat untuk semua kasus", "Tidak ada perbedaan signifikan"],
        ans: 1
      },
      {
        q: "Q-Learning update rule: Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]. Apa yang dimaksud dengan α?",
        opts: ["Discount factor", "Learning rate — seberapa cepat Q-value diperbarui", "Exploration rate", "Reward maksimum"],
        ans: 1
      },
      {
        q: "Monte Carlo Methods dalam RL belajar dari...",
        opts: ["Setiap langkah (step)", "Episode lengkap — menunggu sampai episode selesai untuk update value function", "Model environment", "Data offline saja"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 2,
    moduleTitle: "Modul 3: Deep Reinforcement Learning",
    questions: [
      {
        q: "Apa inovasi utama DQN (Deep Q-Network) dibanding Q-Learning tabular?",
        opts: ["Menggunakan lebih banyak data", "Experience Replay dan Target Network untuk stabilitas training dengan neural network", "Lebih cepat untuk state space kecil", "Tidak memerlukan reward"],
        ans: 1
      },
      {
        q: "Apa fungsi Experience Replay Buffer dalam DQN?",
        opts: ["Menyimpan model terbaik", "Menyimpan transisi (s,a,r,s') dan sampling secara acak untuk mengurangi korelasi antar sampel", "Mempercepat komputasi GPU", "Mengurangi ukuran neural network"],
        ans: 1
      },
      {
        q: "Policy Gradient methods langsung mengoptimasi apa?",
        opts: ["Q-function", "Policy π secara langsung tanpa perlu Q-function", "Value function V(s)", "Reward function"],
        ans: 1
      },
      {
        q: "PPO (Proximal Policy Optimization) membatasi update policy dengan tujuan...",
        opts: ["Mempercepat training", "Mencegah perubahan policy yang terlalu besar dalam satu update — menghindari catastrophic forgetting", "Mengurangi jumlah parameter", "Meningkatkan exploration"],
        ans: 1
      },
      {
        q: "Actor-Critic methods menggabungkan...",
        opts: ["CNN dan RNN", "Policy Gradient (Actor) dan Value Function (Critic) untuk mengurangi variance", "Q-Learning dan Monte Carlo", "DQN dan SARSA"],
        ans: 1
      }
    ]
  },
  {
    moduleIndex: 3,
    moduleTitle: "Modul 4: Advanced RL",
    questions: [
      {
        q: "RLHF (Reinforcement Learning from Human Feedback) digunakan untuk melatih model seperti...",
        opts: ["Model computer vision", "ChatGPT dan model bahasa besar lainnya agar sesuai preferensi manusia", "Model time series", "Model clustering"],
        ans: 1
      },
      {
        q: "Dalam RLHF, Reward Model dilatih dari...",
        opts: ["Data berlabel otomatis", "Perbandingan output yang dibuat oleh manusia (mana yang lebih baik)", "Hasil Q-Learning", "Data dari environment simulator"],
        ans: 1
      },
      {
        q: "Apa tantangan utama Multi-Agent RL dibanding single-agent RL?",
        opts: ["Lebih sedikit data yang dibutuhkan", "Environment menjadi non-stationary karena semua agent belajar secara bersamaan", "Lebih mudah diimplementasikan", "Tidak memerlukan reward function"],
        ans: 1
      },
      {
        q: "Model-Based RL berbeda dari Model-Free RL karena...",
        opts: ["Model-Based lebih lambat", "Model-Based membangun model internal environment untuk perencanaan, lebih efisien dalam penggunaan data", "Model-Free lebih akurat", "Model-Based tidak memerlukan interaksi dengan environment"],
        ans: 1
      }
    ]
  }
];

// ══════════════════════════════════════════════
// QUIZ AKHIR KURSUS — REINFORCEMENT LEARNING (20 Soal)
// Sumber: T4Tutorials RL MCQ (t4tutorials.com/reinforcement-learning-mcqs),
//         EasyExamNotes RL MCQ (easyexamnotes.com/rl-techniques-mcqs),
//         DevInterview Q-Learning (devinterview.io/blog/q-learning-interview-questions)
// ══════════════════════════════════════════════
courseRL.finalQuiz = [
  { q: "Apa yang dimaksud dengan 'reward' dalam RL?", opts: ["Kecepatan training", "Sinyal feedback dari environment yang menunjukkan kualitas tindakan", "Jumlah parameter model", "Ukuran dataset"], ans: 1 },
  { q: "Apa itu Exploration vs Exploitation tradeoff?", opts: ["Tradeoff kecepatan dan akurasi", "Tradeoff antara mencoba tindakan baru vs menggunakan tindakan terbaik yang diketahui", "Tradeoff training dan testing", "Tradeoff reward dan penalty"], ans: 1 },
  { q: "Perbedaan Q-Learning dan SARSA?", opts: ["Q-Learning lebih lambat", "Q-Learning off-policy, SARSA on-policy", "SARSA lebih akurat", "Tidak ada perbedaan"], ans: 1 },
  { q: "Inovasi utama DQN dibanding Q-Learning biasa?", opts: ["Menggunakan lebih banyak data", "Experience Replay dan Target Network untuk stabilitas training", "Lebih cepat", "Tidak memerlukan reward"], ans: 1 },
  { q: "RLHF digunakan untuk melatih model apa?", opts: ["Model computer vision", "Large Language Models seperti ChatGPT", "Model time series", "Model clustering"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'policy' dalam RL?", opts: ["Aturan lingkungan", "Strategi agent — fungsi yang memetakan state ke action", "Fungsi reward", "Nilai discount factor"], ans: 1 },
  { q: "Discount factor (gamma) mengontrol...", opts: ["Kecepatan learning", "Seberapa penting reward masa depan dibanding sekarang", "Jumlah episode training", "Ukuran action space"], ans: 1 },
  { q: "Apa itu Markov Property?", opts: ["State berikutnya bergantung pada semua history", "State berikutnya hanya bergantung pada state dan action saat ini", "Reward selalu positif", "Action space harus diskrit"], ans: 1 },
  { q: "Epsilon-greedy policy mengatasi exploration-exploitation dengan...", opts: ["Selalu memilih action terbaik", "Dengan probabilitas epsilon memilih acak, sisanya memilih terbaik", "Selalu memilih acak", "Menggunakan model terpisah"], ans: 1 },
  { q: "Apa fungsi Experience Replay Buffer dalam DQN?", opts: ["Menyimpan model terbaik", "Menyimpan transisi dan sampling acak untuk mengurangi korelasi antar sampel", "Mempercepat komputasi GPU", "Mengurangi ukuran neural network"], ans: 1 },
  { q: "PPO membatasi update policy untuk...", opts: ["Mempercepat training", "Mencegah perubahan policy terlalu besar — menghindari catastrophic forgetting", "Mengurangi jumlah parameter", "Meningkatkan exploration"], ans: 1 },
  { q: "Actor-Critic menggabungkan...", opts: ["CNN dan RNN", "Policy Gradient (Actor) dan Value Function (Critic)", "Q-Learning dan Monte Carlo", "DQN dan SARSA"], ans: 1 },
  { q: "Apa tantangan utama Multi-Agent RL?", opts: ["Lebih sedikit data", "Environment non-stationary karena semua agent belajar bersamaan", "Lebih mudah diimplementasikan", "Tidak memerlukan reward function"], ans: 1 },
  { q: "Model-Based RL berbeda dari Model-Free karena...", opts: ["Model-Based lebih lambat", "Model-Based membangun model internal environment untuk perencanaan", "Model-Free lebih akurat", "Model-Based tidak perlu interaksi dengan environment"], ans: 1 },
  { q: "Dalam RLHF, Reward Model dilatih dari...", opts: ["Data berlabel otomatis", "Perbandingan output yang dibuat oleh manusia", "Hasil Q-Learning", "Data dari environment simulator"], ans: 1 },
  { q: "Monte Carlo Methods belajar dari...", opts: ["Setiap langkah (step)", "Episode lengkap — menunggu sampai episode selesai", "Model environment", "Data offline saja"], ans: 1 },
  { q: "Apa yang dimaksud dengan Value Function V(s)?", opts: ["Probabilitas memilih action di state s", "Expected total reward dari state s mengikuti policy π", "Reward langsung dari state s", "Jumlah action yang tersedia di state s"], ans: 1 },
  { q: "AlphaGo menggunakan teknik RL apa?", opts: ["Q-Learning tabular", "Monte Carlo Tree Search dikombinasikan dengan Deep RL", "SARSA", "Policy Gradient saja"], ans: 1 },
  { q: "Apa yang dimaksud dengan 'reward shaping'?", opts: ["Mengubah arsitektur model", "Memodifikasi reward function untuk memandu agent belajar lebih cepat", "Mengurangi action space", "Meningkatkan exploration rate"], ans: 1 },
  { q: "Apa keunggulan PPO dibanding REINFORCE?", opts: ["PPO lebih sederhana", "PPO lebih stabil dan efisien dengan clipping objective yang mencegah update terlalu besar", "REINFORCE lebih akurat", "Tidak ada perbedaan signifikan"], ans: 1 }
];
