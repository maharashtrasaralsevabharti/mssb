// ✅ Maharashtra Saral Seva Bharti - Fully Responsive Marathi News Feed (v4)
const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";
const SITE_URL = "https://maharashtrasaralsevabharti.github.io/mssb";

async function generateFeeds() {
  try {
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      console.error("⚠️ No posts found in sheet.");
      return;
    }

    // RSS XML
    const rssItems = data.map(post => `
      <item>
        <title><![CDATA[${post.Title || "Untitled"}]]></title>
        <link>${post.Link || SITE_URL}</link>
        <guid>${post.Link || SITE_URL}</guid>
        <description><![CDATA[${post.Description || ""}]]></description>
        <author><![CDATA[Maharashtra Saral Seva Bharti]]></author>
        <pubDate>${new Date().toUTCString()}</pubDate>
        <category><![CDATA[${post.Category || "अपडेट"}]]></category>
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

    // Feed HTML (Fully Responsive)
    const htmlFeed = `
      <!DOCTYPE html>
      <html lang="mr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ताज्या भरती आणि योजना अपडेट्स - महाराष्ट्र सरळ सेवा भरती</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Noto Sans Devanagari', sans-serif;
            background: #fafafa;
            color: #222;
          }
          header {
            background: linear-gradient(90deg, #b30000, #ff4d4d);
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 1.1rem;
            font-weight: bold;
          }
          .feed-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 15px;
            padding: 20px;
            max-width: 1100px;
            margin: auto;
          }
          .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          }
          .thumb {
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
          }
          .content {
            padding: 15px;
          }
          .category {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            color: white;
            margin-bottom: 8px;
          }
          .category[data-type="भरती"] { background: #007bff; }
          .category[data-type="योजना"] { background: #28a745; }
          .category[data-type="शेतकरी"] { background: #f0ad4e; }
          .category[data-type="निर्णय"] { background: #6f42c1; }
          h2 {
            font-size: 1rem;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          p {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.5;
          }
          .read-more {
            display: inline-block;
            margin-top: 8px;
            font-size: 0.85rem;
            color: #b30000;
            text-decoration: none;
            font-weight: bold;
          }
          footer {
            text-align: center;
            padding: 20px;
            font-size: 0.85rem;
            color: #666;
            background: #f1f1f1;
            margin-top: 20px;
          }
          /* 🔹 Mobile optimization */
          @media (max-width: 600px) {
            header { font-size: 1rem; padding: 10px; }
            .feed-container { padding: 10px; gap: 10px; }
            .card { border-radius: 8px; }
            .thumb { height: 160px; }
            .content { padding: 12px; }
            h2 { font-size: 0.95rem; }
            p { font-size: 0.85rem; }
          }
        </style>
      </head>
      <body>
        <header>📢 ताज्या भरती आणि सरकारी योजना अपडेट्स</header>
        <div class="feed-container">
          ${data.map(post => `
            <div class="card">
              ${post.Image ? `<img src="${post.Image}" alt="${post.Title}" class="thumb">` : ""}
              <div class="content">
                <span class="category" data-type="${post.Category || 'अपडेट'}">${post.Category || "अपडेट"}</span>
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
    console.log("✅ feed.xml आणि feed.html तयार झाले (Fully Responsive UI)");
  } catch (err) {
    console.error("❌ Error generating feeds:", err);
  }
}

generateFeeds();
