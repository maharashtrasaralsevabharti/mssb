// =================== Typing Animation ===================
const typingTexts = [
  "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर",
  "सरकारी योजना, नोकरी भरती, शेतकरी अपडेट्स, PDF डाउनलोड",
  "Maharashtra Saral Seva Bharti - Official Info Hub"
];

let typingIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing-text");

function typeText() {
  if (!typingElement) return;
  if (charIndex < typingTexts[typingIndex].length) {
    typingElement.textContent += typingTexts[typingIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 80);
  } else {
    setTimeout(eraseText, 1800);
  }
}

function eraseText() {
  if (charIndex > 0) {
    typingElement.textContent = typingTexts[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, 50);
  } else {
    typingIndex = (typingIndex + 1) % typingTexts.length;
    setTimeout(typeText, 300);
  }
}

document.addEventListener("DOMContentLoaded", typeText);


// =================== Auto Fetch Latest Posts ===================
const sheetURL = "https://opensheet.elk.sh/1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE/Sheet1";
const postContainer = document.querySelector(".latest-posts .posts-grid");

async function loadPosts()
  // =============== Category Filter ===============
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    const selected = e.target.getAttribute("data-category");
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    filterPosts(selected);
  }
});

function filterPosts(category) {
  const posts = document.querySelectorAll(".latest-posts .post");
  posts.forEach(post => {
    const postCategory = post.querySelector("p").textContent || "";
    if (category === "सर्व" || postCategory.includes(category)) {
      post.style.display = "block";
      post.style.animation = `fadeInUp 0.5s ease forwards`;
    } else {
      post.style.display = "none";
    }
  });
}
{
  try {
    const res = await fetch(sheetURL);
    const posts = await res.json();
    postContainer.innerHTML = "";

    posts.forEach((post, i) => {
      const article = document.createElement("article");
      article.classList.add("post");
      article.style.opacity = "0";
      article.innerHTML = `
        <img src="${post.Image}" alt="${post.Title}">
        <div class="post-content">
          <h3>${post.Title}</h3>
          <p>${post.Description}</p>
          <a class="readmore" href="${post.Link}" target="_blank">अधिक वाचा</a>
        </div>
      `;
      postContainer.appendChild(article);

      // Smooth fade-in animation
      setTimeout(() => {
        article.style.opacity = "1";
        article.style.animation = `fadeInUp 0.7s ease forwards`;
      }, i * 200);
    });

  } catch (err) {
    console.error("Error loading posts:", err);
    postContainer.innerHTML = "<p>⚠️ पोस्ट लोड करण्यात समस्या आली.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPosts);
