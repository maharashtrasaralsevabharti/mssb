const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";

async function loadHighlights() {
  const highlightBox = document.getElementById("highlights");
  highlightBox.innerHTML = "<span>लोड होत आहे...</span>";
  try {
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${HIGHLIGHTS_SHEET}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const text = data.map(row => `🔸 ${row.Title}`).join(" &nbsp;&nbsp; | &nbsp;&nbsp; ");
      highlightBox.innerHTML = `<span>${text}</span>`;
    } else highlightBox.textContent = "⚠️ कोणतेही अपडेट्स नाहीत.";
  } catch (err) {
    highlightBox.textContent = "⚠️ अपडेट मिळवण्यात त्रुटी आली.";
  }
}

async function loadPosts() {
  const container = document.getElementById("posts-container");
  container.innerHTML = "<p>लोड होत आहे...</p>";
  try {
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const posts = await res.json();
    if (!posts || posts.length === 0) {
      container.innerHTML = "<p>⚠️ कोणत्याही पोस्ट उपलब्ध नाहीत.</p>";
      return;
    }
    container.innerHTML = "";
    posts.forEach(p => {
      const card = document.createElement("div");
      card.className = "post-card";
      card.innerHTML = `
        <img src="${p.Image || 'assets/default.jpg'}" alt="${p.Title}">
        <h3>${p.Title}</h3>
        <p>${p.Description || ''}</p>
        <a href="${p.Link || '#'}" target="_blank" class="read-more">अधिक वाचा</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी आली.</p>";
  }
}

function typingEffect() {
  const text = "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर उपलब्ध";
  const elem = document.getElementById("typing-text");
  let i = 0;
  function type() {
    if (i < text.length) {
      elem.textContent += text.charAt(i);
      i++;
      setTimeout(type, 75);
    }
  }
  type();
}

document.addEventListener("DOMContentLoaded", () => {
  typingEffect();
  loadHighlights();
  loadPosts();
  setInterval(() => {
    loadHighlights();
    loadPosts();
  }, 5 * 60 * 1000);
});
