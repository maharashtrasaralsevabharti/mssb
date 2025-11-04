// ✅ Google Sheet Config
const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";

// ✅ Typing effect for tagline
function typingEffect() {
  const text = "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर उपलब्ध";
  const el = document.getElementById("typing-text");
  if (!el) return;
  let i = 0;
  const speed = 90;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  el.textContent = "";
  type();
}

// ✅ Load Highlights
async function loadHighlights() {
  const highlightBox = document.getElementById("highlights");
  if (!highlightBox) return;
  highlightBox.textContent = "लोड होत आहे…";

  try {
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${HIGHLIGHTS_SHEET}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const titles = data.map(r => r.Title).filter(Boolean);
      highlightBox.innerHTML = titles.map(t => `🔸 ${t}`).join(" &nbsp;&nbsp; | &nbsp;&nbsp;");
    } else {
      highlightBox.textContent = "⚠️ कोणतीही अपडेट्स उपलब्ध नाहीत.";
    }
  } catch (err) {
    highlightBox.textContent = "⚠️ अपडेट लोड करण्यात त्रुटी आली.";
  }
}

// ✅ Load Posts
async function loadPosts() {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return;
  postsContainer.innerHTML = "<p>लोड होत आहे...</p>";

  try {
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await res.json();
    if (data && data.length > 0) {
      postsContainer.innerHTML = "";
      data.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
          <img src="${post.Image || 'default.jpg'}" alt="${post.Title}">
          <h3>${post.Title || ''}</h3>
          <p>${post.Description || ''}</p>
          <a href="${post.Link || '#'}" target="_blank" class="read-more">अधिक वाचा</a>
        `;
        postsContainer.appendChild(card);
      });
    } else {
      postsContainer.innerHTML = "<p>⚠️ कोणतीही पोस्ट्स उपलब्ध नाहीत.</p>";
    }
  } catch (err) {
    postsContainer.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी आली.</p>";
  }
}

// ✅ Smooth Scrolling Highlights (Ticker)
function startTickerScroll() {
  const highlights = document.getElementById("highlights");
  if (!highlights) return;
  highlights.style.whiteSpace = "nowrap";
  highlights.style.overflow = "hidden";
  highlights.style.display = "block";
  let scrollAmount = 0;
  setInterval(() => {
    scrollAmount -= 1;
    highlights.style.transform = `translateX(${scrollAmount}px)`;
    if (Math.abs(scrollAmount) > highlights.scrollWidth) {
      scrollAmount = window.innerWidth;
    }
  }, 25);
}

// ✅ Auto Refresh every 5 min
setInterval(() => {
  loadHighlights();
  loadPosts();
}, 5 * 60 * 1000);

// ✅ Initial Load
document.addEventListener("DOMContentLoaded", () => {
  typingEffect();
  loadHighlights();
  loadPosts();
  setTimeout(startTickerScroll, 2000);
});
