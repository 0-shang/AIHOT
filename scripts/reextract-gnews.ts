import { sql, closeDb } from "@aihot/backend/db";
import { extractArticleBody } from "@aihot/backend/content/extract";
import { publishArticle } from "@aihot/backend/publication/publish";

console.log("=== Finding Google News articles without confirmed body ===");
const articles = await sql<{ id: string; title: string; url: string }[]>`
  SELECT id, title, url FROM articles
  WHERE url LIKE '%news.google.com%' AND body_status <> 'ok'
  ORDER BY (title ILIKE '%Head Coach Confirms Rockets%') DESC, discovered_at DESC`;

console.log(`Found ${articles.length} articles to extract.`);

for (const a of articles) {
  console.log(`Extracting: [${a.id}] ${a.title}`);
  try {
    const state = await extractArticleBody(a.id);
    console.log(` -> Result: ${state}`);
    if (state === "ok") {
      await publishArticle(a.id);
      console.log(` -> Published successfully with full body`);
    }
  } catch (err) {
    console.error(` -> Failed:`, err);
  }
}

await closeDb();
console.log("Done extracting Google News articles!");
