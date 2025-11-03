# MSSB v4.1 - Upload Instructions

1. Create GitHub repository (or use existing `mssb` repo).
2. Upload all files/folders preserving structure:
   - index.html, style.css, script.js
   - /pages/ (all .html files)
   - /assets/ (logo, icons, default.jpg, favicon)
   - sitemap.xml, robots.txt, manifest.json, feed.xml
3. (Optional) Add rss-generator.js and .github/workflows/rss-update.yml for auto RSS.
4. Commit & Push. GitHub Pages will publish at:
   https://<username>.github.io/<repo>  (for your case it's already: maharashtrasaralsevabharti.github.io/mssb)
5. In Google Search Console -> Add property (URL prefix) and verify (add meta tag to index.html head).
6. Submit sitemap: https://.../sitemap.xml
7. Replace GA/Tag Manager IDs if used.

That's it — update Google Sheet `MSSB_Post` and `Highlights` to publish content.
