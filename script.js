// ✅ Google Sheet Configuration
const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";

// ✅ Typing Animation Effect
const typingText = document.getElementById("typing-text");
const textArray = [
  "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर उपलब्ध",
  "नवीन सरकारी भरती, योजना आणि अपडेट्स एका ठिकाणी!",
  "ताज्या शासकीय निर्णयांसाठी भेट द्या महाराष्ट्र सरळ सेवा भरती"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = textArray[textIndex];
  if (!isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textArray.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

// ✅ Fetch Highlights (Ticker)
async function loadHighlights() {
  const highlightBox = document.getElementById("highlights");
  highlightBox.textContent = "लोड होत आहे…";

  try {
    const response = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${HIGHLIGHTS_SHEET}`);
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
    const response = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await response.json();

    if (data && data.length > 0) {
      postsContainer.innerHTML = "";
      data.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
          <img src="${post.Image || 'images/default.jpg'}" alt="${post.Title}">
          <h3>${post.Title}</h3>
          <p>${post.Description || ''}</p>
          <a href="${post.Link || '#'}" target="_blank" class="read-more">अधिक वाचा</a>
        `;
        postsContainer.appendChild(card);
      });

      // ✅ Structured Data for Google
      generateSchemaForPosts(data);
    } else {
      postsContainer.innerHTML = "<p>⚠️ कोणतीही पोस्ट्स उपलब्ध नाहीत.</p>";
    }
  } catch (error) {
    console.error(error);
    postsContainer.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.</p>";
  }
}

// ✅ Structured Data Generator
function generateSchemaForPosts(posts) {
  posts.forEach(post => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.Title || "Untitled Post",
      "description": post.Description || "No description available.",
      "image": post.Image || "https://maharashtrasaralsevabharti.github.io/mssb/logo.png",
      "author": {
        "@type": "Organization",
        "name": "Maharashtra Saral Seva Bharti",
        "url": "https://maharashtrasaralsevabharti.github.io/mssb"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Maharashtra Saral Seva Bharti",
        "logo": {
          "@type": "ImageObject",
          "url": "https://maharashtrasaralsevabharti.github.io/mssb/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": post.Link || "https://maharashtrasaralsevabharti.github.io/mssb"
      },
      "datePublished": new Date().toISOString()
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(script);
  });
}

// ✅ Scroll Motion Animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});
document.querySelectorAll("section").forEach(sec => observer.observe(sec));

// ✅ Auto Refresh every 5 min
setInterval(() => {
  loadPosts();
  loadHighlights();
}, 5 * 60 * 1000);

// ✅ On Page Load
document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  loadPosts();
  loadHighlights();
});
