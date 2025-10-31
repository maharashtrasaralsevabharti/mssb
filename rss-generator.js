// ✅ Maharashtra Saral Seva Bharti - Professional News Portal Feed Generator (v3)
const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const SITE_URL = "https://maharashtrasaralsevabharti.github.io/mssb";

async function generateFeeds() {
  try {
    console.log("🚀 Fetching posts from Google Sheet...");
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      console.error("⚠️ No posts found in sheet.");
      return;
    }

    // ----------------------------
    // 🔹 Generate feed.xml (for SEO)
    // ----------------------------
    const rssItems = data.map(post => `
      <item>
        <title><![CDATA[${post.Title || "Untitled"}]]></title>
        <link>${post.Link || SITE_URL}</link>
        <guid>${post.Link || SITE_URL}</guid>
        <description><![CDATA[${post.Description || ""}]]></description>
        <author><![CDATA[Maharashtra Saral Seva Bharti]]></author>
        <pubDate>${new Date().toUTCString()}</pubDate>
        <category><![CDATA[${post.Category || "Update"}]]></category>
      </item>`).join("\n");

    const rssFeed = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Maharashtra Saral Seva Bharti - Official Updates</title>
          <link>${SITE_URL}</link>
          <description>Latest Sarkari Bharti, Yojana, and Updates in Marathi</description>
          <language>mr-IN</language>
          ${rssItems}
        </channel>
      </rss>
    `;
    fs.writeFileSync("feed.xml", rssFeed.trim());

    // ----------------------------
    // 🔹 Generate feed.html (Visual Portal Look)
    // ----------------------------
    const htmlFeed = `
      <!DOCTYPE html>
      <html lang="mr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ताज्या भरती आणि योजना अपडेट्स - महाराष्ट्र सरळ सेवा भरती</title>
        <style>
          body {
            font-family: 'Noto Sans Devanagari', sans-serif;
            background: #fafafa;
            margin: 0;
            padding: 0;
          }
          header {
            background: linear-gradient(90deg, #b30000, #ff4d4d);
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 1.3rem;
            font-weight: bold;
            letter-spacing: 0.5px;
          }
          .feed-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            padding: 25px;
            max-width: 1200px;
            margin: auto;
          }
          .card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .thumb {
            width: 100%;
            height: 180px;
            object-fit: cover;
            background: #eee;
          }
          .content {
            padding: 15px;
          }
          .category {
            display: inline-block;
            background: #b30000;
            color: white;
            font-size: 0.75rem;
            border-radius: 4px;
            padding: 3px 8px;
            margin-bottom: 8px;
          }
          h2 {
            font-size: 1.1rem;
            margin: 8px 0;
            color: #222;
          }
          p {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.5;
          }
          .read-more {
            display: inline-block;
            margin-top: 10px;
            color: #b30000;
            font-weight: bold;
            text-decoration: none;
          }
          footer {
            text-align: center;
            padding: 20px;
            font-size: 0.9rem;
            color: #666;
            border-top: 1px solid #ddd;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <header>📰 ताज्या भरती आणि सरकारी योजना अपडेट्स</header>
        <div class="feed-container">
          ${data.map(post => `
            <div class="card">
              ${post.Image ? `<img src="${post.Image}" alt="${post.Title}" class="thumb">` : ""}
              <div class="content">
                <span class="category">${post.Category || "अपडेट"}</span>
                <h2>${post.Title || "Untitled Post"}</h2>
                <p>${post.Description || "अधिक माहितीसाठी लिंक तपासा."}</p>
                <a href="${post.Link || SITE_URL}" target="_blank" class="read-more">👉 अधिक वाचा</a>
              </div>
            </div>
          `).join("")}
        </div>
        <footer>© ${new Date().getFullYear()} Maharashtra Saral Seva Bharti</footer>
      </body>
      </html>
    `;

    fs.writeFileSync("feed.html", htmlFeed.trim());
    console.log("✅ feed.xml आणि feed.html दोन्ही तयार झाले (Professional UI)");
  } catch (err) {
    console.error("❌ Error generating feeds:", err);
  }
}

generateFeeds();
