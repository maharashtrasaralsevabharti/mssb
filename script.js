// =================== Typing Animation ===================
document.addEventListener("DOMContentLoaded", () => {
  const typingTexts = [
    "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर",
    "सरकारी योजना, नोकरी भरती, शेतकरी अपडेट्स, PDF डाउनलोड",
    "Maharashtra Saral Seva Bharti - Official Info Hub"
  ];
  const typingElement = document.getElementById("typing-text");
  let typingIndex = 0;
  let charIndex = 0;

  function typeText() {
    if (!typingElement) return;
    if (charIndex < typingTexts[typingIndex].length) {
      typingElement.textContent += typingTexts[typingIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 70);
    } else {
      setTimeout(eraseText, 1800);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      typingElement.textContent = typingTexts[typingIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseText, 30);
    } else {
      typingIndex = (typingIndex + 1) % typingTexts.length;
      setTimeout(typeText, 300);
    }
  }

  typeText();
});


// =================== Auto Fetch Latest Posts ===================
document.addEventListener("DOMContentLoaded", async () => {
  const sheetURL = "https://opensheet.elk.sh/1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE/Sheet1";
  const postContainer = document.querySelector(".latest-posts .posts-grid");

  if (!postContainer) {
    console.error("❌ posts-grid section सापडली नाही!");
    return;
  }

  try {
    const res = await fetch(sheetURL);
    const posts = await res.json();
    // Auto refresh every 5 minutes (300000 milliseconds)
setInterval(loadPosts, 300000);
    postContainer.innerHTML = "";

    if (!posts || posts.length === 0) {
      postContainer.innerHTML = "<p>⚠️ सध्या कोणतीही पोस्ट उपलब्ध नाही.</p>";
      return;
    }

    posts.forEach((post, i) => {
      const article = document.createElement("article");
      article.classList.add("post");
      article.style.opacity = "0";
      article.innerHTML = `
        <img src="${post.Image}" alt="${post.Title}">
        <div class="post-content">
          <h3>${post.Title}</h3>
          <p>${post.Category || ""}</p>
          <p>${post.Description}</p>
          <a class="readmore" href="${post.Link}" target="_blank">अधिक वाचा</a>
        </div>
      `;
      postContainer.appendChild(article);

      // Fade-in animation
      setTimeout(() => {
        article.style.opacity = "1";
        article.style.animation = "fadeInUp 0.7s ease forwards";
      }, i * 200);
    });

  } catch (err) {
    console.error("Error loading posts:", err);
    postContainer.innerHTML = "<p>⚠️ डेटा मिळवण्यात त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.</p>";
  }
});
