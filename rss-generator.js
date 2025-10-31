// ✅ Maharashtra Saral Seva Bharti - Advanced RSS + HTML Feed Generator

const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";

async function generateFeeds() {
  try {
    const response = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await response.json();
    const siteUrl = "https://maharashtrasaralsevabharti.github.io/mssb";

    if (!data || data.length === 0) {
      console.error("⚠️ No posts found in sheet.");
      return;
    }

    // 🔹 RSS XML Feed (for Google / SEO)
    const rssItems = data.map(post => `
      <item>
        <title><![CDATA[${post.Title || "Untitled"}]]></title>
        <link>${post.Link || siteUrl}</link>
        <guid>${post.Link || siteUrl}</guid>
        <description><![CDATA[${post.Description || ""}]]></description>
        <author><![CDATA[Maharashtra Saral Seva Bharti]]></author>
        <pubDate>${new Date().toUTCString()}</pubDate>
        <category><![CDATA[Latest Update]]></category>
      </item>`).join("\n");

    const rssFeed = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Maharashtra Saral Seva Bharti - Official Updates</title>
          <link>${siteUrl}</link>
          <description>Latest Sarkari Bharti, Yojana, and Updates in Marathi</description>
          <language>mr-IN</language>
          ${rssItems}
        </channel>
      </rss>
    `;

    fs.writeFileSync("feed.xml", rssFeed.trim());

    // 🔹 HTML Feed (Beautiful UI)
    const htmlFeed = `
      <!DOCTYPE html>
      <html lang="mr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ताज्या भरती अपडेट्स - महाराष्ट्र सरळ सेवा भरती</title>
        <style>
          body { font-family: 'Noto Sans Devanagari', sans-serif; background: #f7f7f7; margin: 0; padding: 20px; }
          h1 { color: #b30000; text-align: center; }
          .feed-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
          .card { background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
          .card h2 { font-size: 1.1rem; color: #222; margin-bottom: 10px; }
          .card p { font-size: 0.9rem; color: #555; }
          .read-more { display: inline-block; margin-top: 10px; color: #b30000; text-decoration: none; font-weight: bold; }
          footer { text-align: center; margin-top: 40px; font-size: 0.85rem; color: #666; }
        </style>
      </head>
      <body>
        <h1>📰 ताज्या भरती अपडेट्स</h1>
        <div class="feed-container">
          ${data.map(post => `
            <div class="card">
              <h2>${post.Title || "Untitled"}</h2>
              <p>${post.Description || "अधिक माहितीसाठी लिंक तपासा."}</p>
              <a class="read-more" href="${post.Link || siteUrl}" target="_blank">👉 अधिक वाचा</a>
            </div>
          `).join("")}
        </div>
        <footer>© ${new Date().getFullYear()} Maharashtra Saral Seva Bharti</footer>
      </body>
      </html>
    `;

    fs.writeFileSync("feed.html", htmlFeed.trim());

    console.log("✅ feed.xml आणि feed.html दोन्ही तयार झाले!");
  } catch (err) {
    console.error("❌ Error generating feeds:", err);
  }
}

generateFeeds();
