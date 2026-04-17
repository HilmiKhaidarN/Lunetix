// -- AI PLAYGROUND --
// ----------------------------------------------
// AI PLAYGROUND
// ----------------------------------------------
const pgModels = [
  { id:'gpt4o',    name:'GPT-4o',           tag:'Most Advanced', icon:'cpu',      color:'#a78bfa', bg:'rgba(124,58,237,0.15)' },
  { id:'claude35', name:'Claude 3.5 Sonnet',tag:'',              icon:'sparkles', color:'#f97316', bg:'rgba(249,115,22,0.15)' },
  { id:'gemini',   name:'Gemini 1.5 Pro',   tag:'',              icon:'star',     color:'#60a5fa', bg:'rgba(59,130,246,0.15)' },
  { id:'llama',    name:'Llama 3 70B',       tag:'',              icon:'zap',      color:'#34d399', bg:'rgba(16,185,129,0.15)' },
];
const pgTools = [
  { id:'code',  name:'Code Interpreter', desc:'Run Python code',        icon:'code-2',   color:'#60a5fa', bg:'rgba(59,130,246,0.15)' },
  { id:'file',  name:'File Analyzer',    desc:'Upload & analyze files', icon:'file-text',color:'#a78bfa', bg:'rgba(124,58,237,0.15)' },
  { id:'web',   name:'Web Search',       desc:'Search real-time data',  icon:'globe',    color:'#34d399', bg:'rgba(16,185,129,0.15)' },
  { id:'image', name:'Image Generation', desc:'Generate images',        icon:'image',    color:'#fbbf24', bg:'rgba(245,158,11,0.15)' },
];
const pgSessions = [];  // Sessions disimpan di localStorage
const pgRecentActivity = [];  // Activity dari localStorage
const pgExamplePrompts = [
  { text:'Explain quantum computing in simple terms',              icon:'star',     color:'#a78bfa', bg:'rgba(124,58,237,0.15)' },
  { text:'Write a Python function to sort a list using quicksort', icon:'code-2',   color:'#60a5fa', bg:'rgba(59,130,246,0.15)' },
  { text:'Analyze this dataset and show key insights',             icon:'bar-chart',color:'#34d399', bg:'rgba(16,185,129,0.15)' },
  { text:'Generate ideas for an AI project for beginners',         icon:'zap',      color:'#fbbf24', bg:'rgba(245,158,11,0.15)' },
  { text:'Explain the difference between CNN and RNN',             icon:'network',  color:'#f97316', bg:'rgba(249,115,22,0.15)' },
  { text:'How does backpropagation work step by step?',            icon:'git-branch',color:'#c084fc',bg:'rgba(168,85,247,0.15)' },
];
const pgResponseBank = {
  neural: `Neural networks are a series of algorithms that mimic the way the human brain works. They are designed to recognize patterns, make decisions, and solve complex problems.\n\nHere's a simple example using Python with TensorFlow:\n\n<code>import tensorflow as tf\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Dense\n\nmodel = Sequential([\n    Dense(4, activation='relu', input_shape=(3,)),\n    Dense(2, activation='softmax')\n])\n\nmodel.compile(optimizer='adam',\n              loss='sparse_categorical_crossentropy',\n              metrics=['accuracy'])</code>\n\nThis model has one hidden layer with 4 neurons and an output layer with 2 neurons.`,
  python: `Here's a Python quicksort implementation:\n\n<code>def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\n# Example\nnumbers = [3, 6, 8, 10, 1, 2, 1]\nprint(quicksort(numbers))  # [1, 1, 2, 3, 6, 8, 10]</code>\n\nQuicksort has average time complexity of O(n log n).`,
  default: [
    "Machine Learning adalah subset dari AI yang memungkinkan komputer belajar dari data tanpa diprogram secara eksplisit. Ada tiga jenis utama: Supervised, Unsupervised, dan Reinforcement Learning.",
    "Deep Learning menggunakan neural network berlapis banyak untuk mempelajari representasi data secara hierarkis. Ini adalah teknologi di balik ChatGPT, DALL-E, dan sistem pengenalan gambar modern.",
    "Untuk memulai belajar AI:\n\n1. Python fundamentals\n2. NumPy & Pandas\n3. Matplotlib & Seaborn\n4. Scikit-learn untuk classical ML\n5. TensorFlow atau PyTorch untuk Deep Learning",
    "Overfitting terjadi ketika model terlalu hafal data training. Solusinya:\n\n- Regularisasi (L1/L2)\n- Dropout layers\n- Data augmentation\n- Early stopping\n- Cross-validation",
    "Transformer architecture menggunakan Self-Attention mechanism yang memungkinkan model memperhatikan semua bagian input secara paralel � jauh lebih efisien dari RNN.",
    "Gradient Descent adalah algoritma optimasi untuk meminimalkan loss function dengan mengupdate weights ke arah negatif gradient. Varian: Batch GD, Stochastic GD, Mini-batch GD.",
  ],
};
let pgActiveModel = 'gpt4o';
let pgCurrentOutput = '';
let pgChatHistory = []; // Simpan history percakapan untuk context

function initPlayground() {
  renderPgModels(); renderPgTools(); renderPgSessions(); renderPgRecentActivity(); renderPgPrompts();
}
function renderPgModels() {
  const el = document.getElementById('pg-model-list'); if (!el) return;
  el.innerHTML = pgModels.map(m => `
    <div class="pg-model-item ${m.id===pgActiveModel?'active':''}" onclick="pgSelectModel('${m.id}')">
      <div class="pg-model-dot" style="background:${m.bg}"><i data-lucide="${m.icon}" style="width:14px;height:14px;color:${m.color}"></i></div>
      <div style="flex:1"><div class="pg-model-name">${m.name}</div>${m.tag?`<div class="pg-model-tag">${m.tag}</div>`:''}</div>
      ${m.id===pgActiveModel?`<i data-lucide="check" style="width:13px;height:13px;color:var(--accent-light)"></i>`:''}
    </div>`).join('');
  lucide.createIcons();
}
function pgSelectModel(id) {
  pgActiveModel = id;
  const m = pgModels.find(x=>x.id===id);
  const label = document.getElementById('pg-active-model-label');
  if (label && m) label.textContent = m.name;
  renderPgModels();
}
function renderPgTools() {
  const el = document.getElementById('pg-tools-list'); if (!el) return;
  el.innerHTML = pgTools.map(t => `
    <div class="pg-tool-item" onclick="showToast('${t.name} activated!')">
      <div class="pg-tool-dot" style="background:${t.bg}"><i data-lucide="${t.icon}" style="width:14px;height:14px;color:${t.color}"></i></div>
      <div><div class="pg-tool-name-s">${t.name}</div><div class="pg-tool-desc-s">${t.desc}</div></div>
    </div>`).join('');
  lucide.createIcons();
}
function renderPgSessions() {
  const el = document.getElementById('pg-sessions-list'); if (!el) return;
  const sessions = store.get('pg_sessions', []);
  if (!sessions.length) {
    el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada sesi. Mulai chat!</div>';
    return;
  }
  el.innerHTML = sessions.slice(0, 5).map(s => {
    return '<div class="pg-session-item" onclick="pgLoadSession(\\'' + s.id + '\\')">'+
      '<div class="pg-session-icon" style="background:rgba(124,58,237,0.15)"><i data-lucide="cpu" style="width:14px;height:14px;color:#a78bfa"></i></div>'+
      '<div style="flex:1;min-width:0"><div class="pg-session-title">' + s.title + '</div>'+
      '<div class="pg-session-meta">' + s.model + ' · ' + timeAgo(s.time) + '</div></div></div>';
  }).join('');
  lucide.createIcons();
}
function renderPgRecentActivity() {
  const el = document.getElementById('pg-recent-list'); if (!el) return;
  const sessions = store.get('pg_sessions', []);
  if (!sessions.length) {
    el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">Belum ada aktivitas.</div>';
    return;
  }
  el.innerHTML = sessions.slice(0, 4).map(s => {
    return '<div class="pg-recent-item">'+
      '<div class="pg-recent-dot" style="background:rgba(124,58,237,0.15)"><i data-lucide="message-circle" style="width:12px;height:12px;color:#a78bfa"></i></div>'+
      '<div class="pg-recent-text">' + s.title + '</div>'+
      '<div class="pg-recent-time">' + timeAgo(s.time) + '</div></div>';
  }).join('');
  lucide.createIcons();
}
function renderPgPrompts() {
  const el = document.getElementById('pg-prompts-list'); if (!el) return;
  const shuffled = [...pgExamplePrompts].sort(()=>Math.random()-0.5).slice(0,4);
  el.innerHTML = shuffled.map(p => `
    <div class="pg-prompt-item" onclick="pgUsePrompt(this)" data-text="${escHtml(p.text)}">
      <div class="pg-prompt-icon" style="background:${p.bg}"><i data-lucide="${p.icon}" style="width:13px;height:13px;color:${p.color}"></i></div>
      <span>${p.text}</span>
    </div>`).join('');
  lucide.createIcons();
}
function pgRefreshPrompts() { renderPgPrompts(); showToast('Prompts refreshed!'); }
function pgUsePrompt(el) {
  const text = el.dataset.text;
  const input = document.getElementById('pg-input');
  if (input) { input.value = text; input.focus(); pgAutoResize(input); }
}
function pgLoadSession(id) { showToast('Loading session ' + id + '...'); }
function pgNewSession() {
  const output = document.getElementById('pg-output-area');
  const footer = document.getElementById('pg-output-footer');
  const input  = document.getElementById('pg-input');
  if (input) input.value = '';
  if (output) output.innerHTML = `<div class="pg-output-placeholder"><i data-lucide="sparkles" style="width:32px;height:32px;color:var(--accent-light);margin-bottom:10px"></i><p style="font-size:13px;color:var(--text-muted)">Run a prompt to see the AI response here.</p></div>`;
  if (footer) footer.style.display = 'none';
  pgCurrentOutput = '';
  pgChatHistory = []; // Reset history
  lucide.createIcons();
  showToast('New session started!');
}

async function pgSend() {
  const input = document.getElementById('pg-input');
  const msg = input?.value.trim();
  if (!msg) return;

  const output = document.getElementById('pg-output-area');
  const footer = document.getElementById('pg-output-footer');
  if (!output) return;

  // Clear input
  if (input) { input.value = ''; input.style.height = 'auto'; }

  // Show typing indicator
  output.innerHTML = '<div class="pg-typing"><span></span><span></span><span></span></div>';
  if (footer) footer.style.display = 'none';

  const startTime = Date.now();

  try {
    const session = getSession();
    if (!session?.token) {
      // Fallback ke response bank jika tidak login
      _pgSendLocal(msg, output, footer, startTime);
      return;
    }

    const result = await PlaygroundAPI.chat(msg, pgActiveModel, pgChatHistory);
    const reply = result.reply || '';
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const tokens = result.usage?.totalTokens || Math.floor(reply.length / 4);

    // Simpan ke history
    pgChatHistory.push({ role: 'user', content: msg });
    pgChatHistory.push({ role: 'assistant', content: reply });
    // Batasi history 20 pesan
    if (pgChatHistory.length > 20) pgChatHistory = pgChatHistory.slice(-20);

    pgCurrentOutput = reply;
    output.innerHTML = pgFormatResponse(reply);

    if (footer) {
      footer.style.display = 'flex';
      const timeEl = document.getElementById('pg-gen-time');
      if (timeEl) timeEl.textContent = `Generated in ${elapsed}s · ${tokens} tokens`;
    }

    // Simpan session ke localStorage
    const sessions = store.get('pg_sessions', []);
    sessions.unshift({
      id: Date.now(),
      title: msg.slice(0, 60),
      model: (pgModels.find(m => m.id === pgActiveModel) || {}).name || 'AI',
      time: new Date().toISOString(),
    });
    store.set('pg_sessions', sessions.slice(0, 20));
    renderPgSessions();
    renderPgRecentActivity();
    lucide.createIcons();

  } catch (err) {
    console.error('[Playground] Error:', err);
    // Fallback ke response bank
    _pgSendLocal(msg, output, footer, startTime);
  }
}

function _pgSendLocal(msg, output, footer, startTime) {
  const delay = 1200 + Math.random() * 800;
  setTimeout(() => {
    const response = pgGetSmartResponse(msg);
    pgCurrentOutput = response.plain;
    output.innerHTML = response.html;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    if (footer) {
      footer.style.display = 'flex';
      const timeEl = document.getElementById('pg-gen-time');
      if (timeEl) timeEl.textContent = `Generated in ${elapsed}s · ${Math.floor(response.plain.length/4)} tokens`;
    }
    const sessions = store.get('pg_sessions', []);
    sessions.unshift({ id: Date.now(), title: msg.slice(0, 60), model: (pgModels.find(m => m.id === pgActiveModel) || {}).name || 'AI', time: new Date().toISOString() });
    store.set('pg_sessions', sessions.slice(0, 20));
    renderPgSessions();
    renderPgRecentActivity();
    lucide.createIcons();
  }, delay);
}

// Format markdown-like response dari Groq
function pgFormatResponse(text) {
  // Code blocks
  let html = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'code';
    const lines = code.trim().split('\n').map((l, i) =>
      `<div><span style="color:#4b5563;user-select:none;margin-right:12px">${i+1}</span>${escHtml(l)}</div>`
    ).join('');
    return `<div class="pg-code-block"><div class="pg-code-header"><span>${language}</span><button class="pg-icon-btn" onclick="navigator.clipboard.writeText(${JSON.stringify(code.trim())}).then(()=>showToast('Copied!'))"><i data-lucide="copy" style="width:12px;height:12px"></i></button></div><div class="pg-code-body">${lines}</div></div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h4 style="font-size:14px;font-weight:700;margin:14px 0 6px">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:16px 0 8px">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:18px 0 10px">$1</h2>');

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:var(--accent);font-weight:600;min-width:20px">•</span><span>$1</span></div>');

  // Bullet lists
  html = html.replace(/^[-*] (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:var(--accent);min-width:16px">•</span><span>$1</span></div>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  return `<div style="font-size:14px;line-height:1.8;color:var(--text-primary)">${html}</div>`;
}
function pgGetSmartResponse(msg) {
  const lower = msg.toLowerCase();
  let raw = lower.includes('neural')||lower.includes('network') ? pgResponseBank.neural
           : lower.includes('quicksort')||lower.includes('sort') ? pgResponseBank.python
           : pgResponseBank.default[Math.floor(Math.random()*pgResponseBank.default.length)];
  const html = raw.replace(/<code>([\s\S]*?)<\/code>/g, (_, code) => {
    const lines = code.trim().split('\n').map((l,i)=>`<div><span style="color:#4b5563;user-select:none;margin-right:12px">${i+1}</span>${escHtml(l)}</div>`).join('');
    return `<div class="pg-code-block"><div class="pg-code-header"><span>Python</span><button class="pg-icon-btn" onclick="navigator.clipboard.writeText(${JSON.stringify(code)})"><i data-lucide="copy" style="width:12px;height:12px"></i></button></div><div class="pg-code-body">${lines}</div></div>`;
  });
  return { html: html.replace(/\n/g,'<br>').replace(/<br><div/g,'<div').replace(/<\/div><br>/g,'</div>'), plain: raw.replace(/<code>[\s\S]*?<\/code>/g,'[code block]') };
}
function pgHandleKey(e) { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();pgSend();} pgAutoResize(e.target); }
function pgAutoResize(ta) { ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,280)+'px'; }
function pgClearInput() { const i=document.getElementById('pg-input'); if(i){i.value='';i.style.height='auto';i.focus();} }
function pgCopyOutput() { if(pgCurrentOutput) navigator.clipboard.writeText(pgCurrentOutput).then(()=>showToast('Copied!')); }
function pgSwitchInputTab(tab) {
  document.querySelectorAll('.pg-itab').forEach(t=>t.classList.remove('active'));
  document.getElementById('itab-'+tab)?.classList.add('active');
  const input = document.getElementById('pg-input');
  if (input) input.placeholder = tab==='code' ? 'Paste your code here...' : 'Ask anything about AI, ML, or your courses...';
}

