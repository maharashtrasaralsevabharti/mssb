// ✅ RSS Generator for Maharashtra Saral Seva Bharti
// Auto-updates from Google Sheet and generates SEO-friendly RSS feed

const fs = require("fs");
const fetch = require("node-fetch");

const SHEET_ID = "1t_my2HdNcRqoLrWk1LJQLbZrMLvLMOtqKeZfQyRiiNE";
const POSTS_SHEET = "MSSB_Post";

async function generateRSS() {
  try {
    const response = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${POSTS_SHEET}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("⚠️ No data found in sheet.");
      return;
    }

    const siteUrl = "https://maharashtrasaralsevabharti.github.io/mssb";
    const rssItems = data
      .map(post => {
        const title = post.Title || "Untitled Post";
        const link = post.Link || siteUrl;
        const description = post.Description || "";
        const pubDate = new Date().toUTCString();

        return `
          <item>
            <title><![CDATA[${title}]]></title>
            <link>${link}</link>
            <guid>${link}</guid>
            <description><![CDATA[${description}]]></description>
            <author><![CDATA[Maharashtra Saral Seva Bharti]]></author>
            <pubDate>${pubDate}</pubDate>
            <category><![CDATA[Latest Update]]></category>
          </item>
        `;
      })
      .join("\n");

    const rssFeed = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Maharashtra Saral Seva Bharti - Official Updates</title>
          <link>${siteUrl}</link>
          <description>Latest Sarkari Bharti, Yojana, Shasan Nirnay, and Updates in Marathi</description>
          <language>mr-IN</language>
          ${rssItems}
        </channel>
      </rss>
    `;

    fs.writeFileSync("feed.html", rssFeed.trim());
    console.log("✅ RSS feed generated successfully: feed.html");
  } catch (error) {
    console.error("❌ Error generating RSS:", error);
  }
}

generateRSS();
