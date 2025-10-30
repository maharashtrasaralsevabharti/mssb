// ✅ RSS Feed Generator (Run locally and upload feed.xml manually)
const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";

async function generateRSS() {
  const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
  const data = await res.json();

  let rssItems = data.map(post => `
    <item>
      <title><![CDATA[${post.Title}]]></title>
      <link>${post.Link}</link>
      <description><![CDATA[${post.Description || ''}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${post.Link}</guid>
    </item>`).join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Maharashtra Saral Seva Bharti</title>
      <link>https://maharashtrasaralsevabharti.github.io/mssb/</link>
      <description>Latest Government Jobs, Schemes and News Updates in Marathi</description>
      <language>mr</language>
      ${rssItems}
    </channel>
  </rss>`;

  fs.writeFileSync("feed.xml", rssFeed);
  console.log("✅ RSS Feed Generated Successfully!");
}

generateRSS();
