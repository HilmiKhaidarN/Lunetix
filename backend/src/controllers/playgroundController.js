// ══════════════════════════════════════════════
// PLAYGROUND CONTROLLER — Groq AI Integration
// ══════════════════════════════════════════════

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limit: max 20 request per user per jam
const userRequestCounts = new Map();
const MAX_REQUESTS_PER_HOUR = 20;

function checkRateLimit(userId) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const userRequests = userRequestCounts.get(userId) || [];
  const recentRequests = userRequests.filter(t => t > hourAgo);
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) return false;
  recentRequests.push(now);
  userRequestCounts.set(userId, recentRequests);
  return true;
}

// Model mapping dari frontend ke Groq model ID
const MODEL_MAP = {
  'gpt4o':    'llama-3.3-70b-versatile',   // Best quality
  'claude35': 'llama-3.1-70b-versatile',
  'gemini':   'gemma2-9b-it',
  'llama':    'llama-3.1-8b-instant',       // Fastest
};

const SYSTEM_PROMPT = `Kamu adalah AI tutor untuk platform belajar AI bernama Lunetix. 
Kamu membantu user belajar tentang Machine Learning, Deep Learning, NLP, Computer Vision, Data Science, dan Python untuk AI.
Jawab dengan bahasa yang mudah dipahami. Jika ada kode, gunakan format markdown code block.
Berikan penjelasan yang terstruktur dan praktis.`;

// POST /api/playground/chat
async function chat(req, res) {
  const { message, model = 'gpt4o', history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key tidak dikonfigurasi.' });
  }

  // Cek rate limit
  if (!checkRateLimit(req.user.id)) {
    return res.status(429).json({ error: 'Batas 20 request per jam tercapai. Coba lagi nanti.' });
  }

  const groqModel = MODEL_MAP[model] || MODEL_MAP['gpt4o'];

  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    // Include conversation history (max 10 messages)
    ...history.slice(-10).map(h => ({
      role: h.role,
      content: h.content,
    })),
    { role: 'user', content: message.trim() },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        messages,
        max_tokens: 2048,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[Groq] Error:', err);
      return res.status(response.status).json({
        error: err.error?.message || 'Groq API error.',
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const usage = data.usage || {};

    return res.json({
      reply,
      model: groqModel,
      usage: {
        promptTokens:     usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens:      usage.total_tokens || 0,
      },
    });
  } catch (err) {
    console.error('[Groq] Fetch error:', err);
    return res.status(500).json({ error: 'Gagal menghubungi Groq API.' });
  }
}

module.exports = { chat };
