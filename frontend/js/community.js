// -- COMMUNITY --
// COMMUNITY
// ----------------------------------------------
const defaultPosts = [
  { id:1, author:'Arman',  avatar:'A', avatarBg:'linear-gradient(135deg,#7c3aed,#9d5cf6)', badge:'Top Contributor', time:'2 jam lalu',  tag:'Machine Learning', tagColor:'#a78bfa', tagBg:'rgba(124,58,237,0.15)', title:'Baru selesai kursus Machine Learning Fundamentals!', body:'Proyek prediksi harga rumah berhasil dengan akurasi 89%. Terima kasih Lunetix ??\nNext goal: belajar model deployment. Ada saran resource bagus?', likes:24, replies:8,  liked:false, reactors:['D','B','S','R'], extraReactors:5 },
  { id:2, author:'Siti R.',avatar:'S', avatarBg:'linear-gradient(135deg,#1e40af,#3b82f6)', badge:'',               time:'5 jam lalu',  tag:'Deep Learning',    tagColor:'#60a5fa', tagBg:'rgba(59,130,246,0.15)',  title:'Ada yang bisa bantu? Stuck di Backpropagation ??',    body:'Gradient-nya selalu NaN setelah beberapa epoch. Learning rate sudah kecil tapi masih sama.\nAda tips debugging?',                                                                likes:12, replies:15, liked:false, reactors:['A','B','D','R'], extraReactors:8 },
  { id:3, author:'Budi P.',avatar:'B', avatarBg:'linear-gradient(135deg,#065f46,#10b981)', badge:'',               time:'1 hari lalu', tag:'NLP',              tagColor:'#34d399', tagBg:'rgba(16,185,129,0.15)', title:'Tips buat mulai NLP: dari NLTK ke Transformers',      body:'Menurutku fondasi preprocessing itu kunci. Tokenization, stemming, TF-IDF dulu.\nBaru lanjut ke BERT atau model modern lainnya.',                                              likes:26, replies:15, liked:false, reactors:['D','A','S'],   extraReactors:12 },
  { id:4, author:'Dewi K.',avatar:'D', avatarBg:'linear-gradient(135deg,#7f1d1d,#dc2626)', badge:'',               time:'2 jam lalu',  tag:'Computer Vision',  tagColor:'#f87171', tagBg:'rgba(239,68,68,0.15)',  title:'YOLOv8 beneran gila sih performanya!',               body:'Real-time object detection di webcam bisa 60+ FPS di laptop biasa. Highly recommend buat yang mau belajar Computer Vision!',                                                   likes:35, replies:20, liked:false, reactors:['A','B','S','R'], extraReactors:15 },
];
const leaderboard = [
  { name:'Dewi K.', xp:4250, avatar:'D', bg:'linear-gradient(135deg,#7f1d1d,#dc2626)' },
  { name:'Budi P.', xp:3890, avatar:'B', bg:'linear-gradient(135deg,#065f46,#10b981)' },
  { name:'Arman',   xp:1250, avatar:'A', bg:'linear-gradient(135deg,#7c3aed,#9d5cf6)' },
  { name:'Siti R.', xp:980,  avatar:'S', bg:'linear-gradient(135deg,#1e40af,#3b82f6)' },
  { name:'Reza M.', xp:760,  avatar:'R', bg:'linear-gradient(135deg,#92400e,#f59e0b)' },
];
const trendingTags = ['#MachineLearning','#PyTorch','#BERT','#YOLOv8','#DataScience','#Python','#NLP','#CNN','#LLM','#RAG'];
const cmStats = [
  { val:'12.4K', label:'Members',     trend:'+12% this month', icon:'users',          bg:'rgba(124,58,237,0.15)', color:'#a78bfa' },
  { val:'1.2K',  label:'Posts Today', trend:'+8% this week',   icon:'message-circle', bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  { val:'320',   label:'Active Now',  trend:'+15% this week',  icon:'zap',            bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
  { val:'45',    label:'Challenges',  trend:'Join & Earn XP',  icon:'trophy',         bg:'rgba(16,185,129,0.15)', color:'#34d399' },
];
let cmActiveFilter = 'all';

function getPosts() { return store.get('posts', defaultPosts); }
function savePosts(p) { store.set('posts', p); }

function renderCommunity() { renderCmStats(); renderFeed(); renderLeaderboard(); renderTrendingTags(); const session=getSession(); const av=document.getElementById('cm-post-avatar'); if(av&&session) av.textContent=session.avatar||session.name?.charAt(0)||'U'; }
function renderCmStats() {
  const el = document.getElementById('cm-stats-bar'); if (!el) return;
  el.innerHTML = cmStats.map(s=>`<div class="cm-stat-card"><div class="cm-stat-icon" style="background:${s.bg}"><i data-lucide="${s.icon}" style="width:18px;height:18px;color:${s.color}"></i></div><div style="flex:1"><div class="cm-stat-val">${s.val}</div><div class="cm-stat-label">${s.label}</div><div class="cm-stat-trend">${s.trend}</div></div></div>`).join('');
  lucide.createIcons();
}
function filterCommunity(tag, btn) { document.querySelectorAll('.cm-ftab').forEach(t=>t.classList.remove('active')); btn.classList.add('active'); cmActiveFilter=tag; renderFeed(); }
function renderFeed() {
  const feed = document.getElementById('community-feed'); if (!feed) return;
  let posts = getPosts();
  if (cmActiveFilter!=='all') posts = posts.filter(p=>p.tag===cmActiveFilter);
  feed.innerHTML = posts.map(p=>`
    <div class="cm-post-card">
      <div class="cm-post-header">
        <div class="cm-post-avatar" style="background:${p.avatarBg}">${p.avatar}</div>
        <div><div style="display:flex;align-items:center;gap:8px"><span class="cm-post-author">${p.author}</span>${p.badge?`<span class="cm-post-badge">${p.badge}</span>`:''}<span class="cm-post-time">${p.time}</span></div></div>
        <span class="cm-post-tag" style="background:${p.tagBg};color:${p.tagColor}">${p.tag}</span>
        <div class="cm-post-actions-right">
          <button class="cm-post-icon-btn"><i data-lucide="bookmark" style="width:14px;height:14px"></i></button>
          <button class="cm-post-icon-btn"><i data-lucide="more-horizontal" style="width:14px;height:14px"></i></button>
        </div>
      </div>
      <div class="cm-post-title">${p.title}</div>
      <div class="cm-post-body">${p.body.replace(/\n/g,'<br>')}</div>
      <div class="cm-post-footer">
        <button class="cm-post-action ${p.liked?'liked':''}" onclick="likePost(${p.id})"><i data-lucide="heart" style="width:13px;height:13px"></i> ${p.likes}</button>
        <button class="cm-post-action"><i data-lucide="message-circle" style="width:13px;height:13px"></i> ${p.replies} Replies</button>
        <button class="cm-post-action"><i data-lucide="share-2" style="width:13px;height:13px"></i> Share</button>
        <div class="cm-post-avatars">${p.reactors.map(r=>`<div class="mini-av" style="background:var(--accent)">${r}</div>`).join('')}${p.extraReactors?`<span class="cm-post-more">+${p.extraReactors}</span>`:''}</div>
      </div>
    </div>`).join('');
  lucide.createIcons();
}
function likePost(id) { const posts=getPosts(); const p=posts.find(x=>x.id===id); if(!p) return; p.liked=!p.liked; p.likes+=p.liked?1:-1; savePosts(posts); renderFeed(); }
function renderLeaderboard() {
  const el = document.getElementById('leaderboard-list'); if (!el) return;
  const medals=['??','??','??'];
  el.innerHTML = leaderboard.map((u,i)=>`<div class="cm-lb-item"><div class="cm-lb-rank">${medals[i]||i+1}</div><div class="cm-post-avatar" style="background:${u.bg};width:30px;height:30px;font-size:12px;border-radius:50%">${u.avatar}</div><div class="cm-lb-name">${u.name}</div><div class="cm-lb-xp">${u.xp.toLocaleString()} XP</div></div>`).join('');
}
function renderTrendingTags() {
  const el = document.getElementById('trending-tags'); if (!el) return;
  el.innerHTML = `<div class="cm-tag-grid">${trendingTags.map(t=>`<span class="cm-tag">${t}</span>`).join('')}</div>`;
}
function showPostForm() { const f=document.getElementById('post-form'); if(!f) return; f.style.display=f.style.display==='none'?'block':'none'; if(f.style.display==='block') document.getElementById('post-input')?.focus(); }
function hidePostForm() { const f=document.getElementById('post-form'); if(f) f.style.display='none'; }
function submitPost() {
  const input=document.getElementById('post-input'); const tagEl=document.getElementById('post-tag');
  const body=input?.value.trim(); if(!body){showToast('Tulis sesuatu dulu!');return;}
  const session=getSession(); const tag=tagEl?.value||'General';
  const tagColors={'Machine Learning':{color:'#a78bfa',bg:'rgba(124,58,237,0.15)'},'Deep Learning':{color:'#60a5fa',bg:'rgba(59,130,246,0.15)'},'NLP':{color:'#34d399',bg:'rgba(16,185,129,0.15)'},'Computer Vision':{color:'#f87171',bg:'rgba(239,68,68,0.15)'},'Data Science':{color:'#fbbf24',bg:'rgba(245,158,11,0.15)'},'General':{color:'#a78bfa',bg:'rgba(124,58,237,0.15)'}};
  const tc=tagColors[tag]||tagColors['General'];
  const posts=getPosts();
  posts.unshift({id:Date.now(),author:session?.name||'You',avatar:session?.avatar||'U',avatarBg:'linear-gradient(135deg,#7c3aed,#9d5cf6)',badge:'',time:'Baru saja',tag,tagColor:tc.color,tagBg:tc.bg,title:body.split('\n')[0].slice(0,80),body,likes:0,replies:0,liked:false,reactors:[],extraReactors:0});
  savePosts(posts); if(input) input.value=''; hidePostForm(); renderFeed(); showToast('Post berhasil dipublikasikan! ??');
}

