// script.js - MSSB v4.1 Final
const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";
const SITE_URL = "https://maharashtrasaralsevabharti.github.io/mssb";

// -------------------- Typing effect --------------------
const typingEl = document.getElementById("typing-text");
const phrases = [
  "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर उपलब्ध",
  "नवीन सरकारी भरती, योजना आणि ताज्या शासकीय निर्णयांची माहिती",
  "शेतकरी अपडेट्स, PDF डाउनलोड — सर्व एका ठिकाणी"
];
let tIndex = 0, chIndex = 0, deleting = false;
function typeLoop(){
  if(!typingEl) return;
  const current = phrases[tIndex];
  if(!deleting){
    typingEl.textContent = current.substring(0, chIndex+1);
    chIndex++;
    if(chIndex === current.length){ deleting = true; setTimeout(typeLoop,1500); return;}
  } else {
    typingEl.textContent = current.substring(0, chIndex-1);
    chIndex--;
    if(chIndex === 0){ deleting = false; tIndex = (tIndex+1)%phrases.length; }
  }
  setTimeout(typeLoop, deleting?60:100);
}
document.addEventListener("DOMContentLoaded", typeLoop);

// -------------------- Utility: fetch sheet --------------------
async function fetchSheet(sheetName){
  try{
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`);
    if(!res.ok) throw new Error('Sheet fetch failed');
    return await res.json();
  }catch(err){
    console.error("Sheet fetch error:", err);
    return null;
  }
}

// -------------------- Highlights ticker --------------------
async function loadHighlights(){
  const el = document.getElementById("highlights");
  if(!el) return;
  el.textContent = "लोड होत आहे…";
  const data = await fetchSheet(HIGHLIGHTS_SHEET);
  if(!data || data.length===0){ el.textContent = "⚠️ अपडेट उपलब्ध नाहीत."; return; }
  const titles = data.map(r => r.Title).filter(Boolean);
  if(titles.length===0){ el.textContent = "⚠️ अपडेट उपलब्ध नाहीत."; return; }
  const inner = document.createElement('div');
  inner.className = 'inner';
  inner.innerHTML = titles.map(t=>`🔸 ${t}`).join(" &nbsp;&nbsp; | &nbsp;&nbsp;");
  el.innerHTML = '';
  el.appendChild(inner);
}

// -------------------- Load Latest posts (for homepage) --------------------
async function loadPosts(limit=12){
  const container = document.getElementById("posts-container");
  if(!container) return;
  container.innerHTML = "<p>लोड होत आहे...</p>";
  const data = await fetchSheet(POSTS_SHEET);
  if(!data || data.length===0){ container.innerHTML = "<p>⚠️ कोणतीही पोस्ट्स उपलब्ध नाहीत.</p>"; return; }
  // sort by Date if present (descending)
  data.sort((a,b)=> new Date(b.Date||0) - new Date(a.Date||0));
  const items = data.slice(0,limit);
  container.innerHTML = items.map(post => (`
    <article class="post-card">
      <img src="${post.Image || 'assets/default.jpg'}" alt="${escapeHtml(post.Title||'')}" loading="lazy">
      <div class="content">
        <h3>${escapeHtml(post.Title||'Untitled')}</h3>
        <p>${escapeHtml(post.Description||'')}</p>
        <a class="read-more" href="pages/post.html?id=${encodeURIComponent(post.ID||post.Title)}">अधिक वाचा</a>
      </div>
    </article>
  `)).join('');
  revealItems(); // animate
}

// -------------------- Category page loader --------------------
async function loadCategoryPosts(category){
  // pages have container with id=category-posts or posts-container on main
  const container = document.getElementById("category-posts") || document.getElementById("posts-container");
  if(!container) return;
  container.innerHTML = "<p>लोड होत आहे...</p>";
  const data = await fetchSheet(POSTS_SHEET);
  if(!data){ container.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी.</p>"; return; }
  const filtered = data.filter(p => (p.Category||'').trim() === category);
  if(filtered.length===0){ container.innerHTML = `<div class="info-box"><strong>⚠️ '${category}' साठी अद्याप पोस्ट उपलब्ध नाही.</strong></div>`; return; }
  filtered.sort((a,b)=> new Date(b.Date||0)-new Date(a.Date||0));
  container.innerHTML = filtered.map(post => (`
    <article class="post-card">
      <img src="${post.Image || '../assets/default.jpg'}" alt="${escapeHtml(post.Title||'')}" loading="lazy">
      <div class="content">
        <h3>${escapeHtml(post.Title||'Untitled')}</h3>
        <p>${escapeHtml(post.Description||'')}</p>
        <a class="read-more" href="post.html?id=${encodeURIComponent(post.ID||post.Title)}">अधिक वाचा</a>
      </div>
    </article>
  `)).join('');
  revealItems();
}

// -------------------- Single post loader (post.html) --------------------
async function loadSinglePost(){
  // only run on post.html
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('post-content');
  if(!container){ return; }
  container.innerHTML = "<p>लोड होत आहे...</p>";
  const data = await fetchSheet(POSTS_SHEET);
  if(!data){ container.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी.</p>"; return; }
  const post = data.find(p => String(p.ID) === String(id));
  if(!post){ container.innerHTML = "<p>⚠️ ही पोस्ट उपलब्ध नाही.</p>"; return; }

  const postURL = window.location.href;
  container.innerHTML = `
    <div class="post-header">
      <h1>${escapeHtml(post.Title||'Untitled')}</h1>
      <div class="meta">📅 ${escapeHtml(post.Date||'')} | 🏷️ ${escapeHtml(post.Category||'')}</div>
    </div>
    <img src="${post.Image || '../assets/default.jpg'}" class="post-image" alt="${escapeHtml(post.Title||'')}" loading="lazy">
    <div class="post-content">${post.Content || post.Description || ''}</div>

    <div class="share-section">
      <h3>📢 शेअर करा</h3>
      <div class="share-icons">
        <a href="https://wa.me/?text=${encodeURIComponent(post.Title + ' - ' + postURL)}" target="_blank" title="WhatsApp">🟢</a>
        <a href="https://t.me/share/url?url=${encodeURIComponent(postURL)}&text=${encodeURIComponent(post.Title)}" target="_blank" title="Telegram">🔵</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postURL)}" target="_blank" title="Facebook">🔷</a>
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(postURL)}&text=${encodeURIComponent(post.Title)}" target="_blank" title="Twitter">⚫</a>
      </div>
    </div>
  `;

  // Related posts
  const relatedSection = document.getElementById('related-section');
  const relatedContainer = document.getElementById('related-container');
  const related = data.filter(p => p.Category === post.Category && String(p.ID)!==String(post.ID)).sort(()=>0.5-Math.random()).slice(0,3);
  if(related.length>0 && relatedContainer){
    relatedSection.style.display = 'block';
    relatedContainer.innerHTML = related.map(r=>`
      <div class="related-card">
        <img src="${r.Image || '../assets/default.jpg'}" alt="${escapeHtml(r.Title)}">
        <h4>${escapeHtml(r.Title)}</h4>
        <a href="post.html?id=${encodeURIComponent(r.ID)}">अधिक वाचा</a>
      </div>
    `).join('');
    animateRelatedCards();
  }
}

// -------------------- Helpers & animation --------------------
function escapeHtml(text){
  if(!text) return '';
  return String(text).replace(/[&<>"]/g, function(s){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]; });
}
function revealItems(){
  const items = document.querySelectorAll('.post-card');
  items.forEach((el,i)=>{
    setTimeout(()=> el.classList.add('visible'), i*80);
  });
}
function animateRelatedCards(){
  const cards = document.querySelectorAll('.related-card');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  },{threshold:0.2});
  cards.forEach(c=>obs.observe(c));
}

// -------------------- Auto refresh & initial load --------------------
document.addEventListener('DOMContentLoaded', ()=>{
  // initialise homepage / highlights / categories if elements exist
  loadHighlights();
  loadPosts();

  // If category page with id container exists, try to infer category from a data attribute
  // (category pages call loadCategoryPosts explicitly at bottom of their HTML)
  setInterval(()=>{ loadHighlights(); loadPosts(); }, 5*60*1000);
});

// -------------------- Expose functions for pages to call --------------------
window.loadCategoryPosts = loadCategoryPosts;
window.loadSinglePost = loadSinglePost;
window.loadPosts = loadPosts;
window.loadHighlights = loadHighlights;