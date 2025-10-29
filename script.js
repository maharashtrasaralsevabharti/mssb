// ✅ Google Sheet Configuration
const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const HIGHLIGHTS_SHEET = "Highlights";

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
      data.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";

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

// ✅ Auto Refresh (प्रत्येक 5 मिनिटांनी)
setInterval(() => {
  loadPosts();
  loadHighlights();
}, 5 * 60 * 1000);

// ✅ Initial Load
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
  loadHighlights();
});
