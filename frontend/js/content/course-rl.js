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
