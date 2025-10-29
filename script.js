// ✅ Google Sheet Configuration
const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";
// ✅ Typing Animation Texts
const typingTexts = [
  "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर उपलब्ध"
];
let typingIndex = 0;
let charIndex = 0;
const typingSpeed = 120;
const eraseSpeed = 80;
const delayBetween = 1500;

function typeEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  if (charIndex < typingTexts[typingIndex].length) {
    typingElement.textContent += typingTexts[typingIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, typingSpeed);
  } else {
    setTimeout(eraseEffect, delayBetween);
  }
}

function eraseEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  if (charIndex > 0) {
    typingElement.textContent = typingTexts[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, eraseSpeed);
  } else {
    typingIndex = (typingIndex + 1) % typingTexts.length;
    setTimeout(typeEffect, typingSpeed);
  }
}

function eraseEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  if (charIndex > 0) {
    typingElement.textContent = typingTexts[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, eraseSpeed);
  } else {
    typingIndex = (typingIndex + 1) % typingTexts.length;
    setTimeout(typeEffect, typingSpeed);
  }
}

// ✅ Fetch Highlights (Ticker)
async function loadHighlights() {
  const highlightBox = document.getElementById("highlights");
  highlightBox.textContent = "लोड होत आहे…";

  try {
    const response = await fetch(
      `https://opensheet.elk.sh/${SHEET_ID}/${HIGHLIGHTS_SHEET}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const titles = data.map(row => row.Title).filter(Boolean);
      if (titles.length > 0) {
        highlightBox.innerHTML = titles.map(t => `🔸 ${t}`).join(" &nbsp;&nbsp; | &nbsp;&nbsp;");
      } else {
        highlightBox.textContent = "⚠️ कोणतीही अपडेट्स उपलब्ध नाहीत.";
      }
    } else {
      highlightBox.textContent = "⚠️ डेटा रिकामा आहे.";
    }
  } catch (error) {
    console.error(error);
    highlightBox.textContent = "⚠️ अपडेट लोड करण्यात त्रुटी आली.";
  }
}

// ✅ Fetch Posts (Main Section)
async function loadPosts() {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "<p>लोड होत आहे...</p>";

  try {
    const response = await fetch(
      `https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      postsContainer.innerHTML = "";
      data.forEach((post, index) => {
        const card = document.createElement("div");
        card.className = "post-card fade-in";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
          <img src="${post.Image || 'default.jpg'}" alt="${post.Title}">
          <h3>${post.Title}</h3>
          <p>${post.Description || ''}</p>
          <a href="${post.Link || '#'}" target="_blank" class="read-more">अधिक वाचा</a>
        `;

        postsContainer.appendChild(card);
      });
    } else {
      postsContainer.innerHTML = "<p>⚠️ कोणतीही पोस्ट्स उपलब्ध नाहीत.</p>";
    }
  } catch (error) {
    console.error(error);
    postsContainer.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.</p>";
  }
}

// ✅ Scroll Animation
window.addEventListener("scroll", () => {
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
    if (position < screenHeight - 50) {
      el.classList.add("visible");
    }
  });
});

// ✅ Auto Refresh (5 मिनिटांनी)
setInterval(() => {
  loadPosts();
  loadHighlights();
}, 5 * 60 * 1000);

// ✅ Initial Load
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
  loadHighlights();
  typeEffect();
});
