import { sql, closeDb } from "@aihot/backend/db";
import { collectSource } from "../packages/backend/src/sources/collect.ts";
import { publishArticle } from "../packages/backend/src/publication/publish.ts";

async function main() {
  console.log("=== Updating Sportstalk 790 sources config in DB ===");

  await sql`
    UPDATE sources
    SET config = '{"feedUrl": "https://www.spreaker.com/show/3442316/episodes/feed", "_aihot": {"initialBackfillLimit": 120}}'::jsonb,
        cursor = NULL,
        enabled = true,
        next_fetch_at = now() - interval '1 minute'
    WHERE id = 'rss-podcast-sportstalk790'
  `;

  await sql`
    UPDATE sources
    SET config = '{"feedUrl": "https://www.spreaker.com/show/2599904/episodes/feed", "_aihot": {"initialBackfillLimit": 80}}'::jsonb,
        cursor = NULL,
        enabled = true,
        next_fetch_at = now() - interval '1 minute'
    WHERE id = 'rss-podcast-sportstalk790-mattthomas'
  `;

  console.log("=== Collecting rss-podcast-sportstalk790 (The A-Team) ===");
  const res1 = await collectSource("rss-podcast-sportstalk790", { force: true });
  console.log("A-Team collection result:", res1);

  console.log("=== Collecting rss-podcast-sportstalk790-mattthomas ===");
  const res2 = await collectSource("rss-podcast-sportstalk790-mattthomas", { force: true });
  console.log("Matt Thomas collection result:", res2);

  // Publish all articles from sportstalk790
  const unpubArticles = await sql<{ id: string; title: string }[]>`
    SELECT a.id, a.title
    FROM articles a
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY a.published_at DESC
  `;
  console.log(`Publishing ${unpubArticles.length} sportstalk790 articles...`);

  for (const a of unpubArticles) {
    await publishArticle(a.id);
  }

  // Ensure all sportstalk790 publications are public, eligible, and categorized as podcasts
  const updatedPubs = await sql`
    UPDATE publications
    SET visibility = 'public',
        eligible = true,
        category = 'podcasts'
    WHERE source_id LIKE 'rss-podcast-sportstalk790%'
    RETURNING article_id
  `;
  console.log(`Updated ${updatedPubs.length} publications to public/eligible podcasts.`);

  // Print latest 25 publications from sportstalk790
  const latest = await sql`
    SELECT p.article_id, p.title, p.visibility, p.eligible, p.published_at, p.category
    FROM publications p
    WHERE p.source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY p.published_at DESC
    LIMIT 25
  `;
  console.log("\n=== Latest 25 Published Episodes from Sportstalk 790 ===");
  for (const row of latest) {
    console.log(`${row.published_at?.toISOString()?.substring(0, 10)} | vis=${row.visibility} el=${row.eligible} | ${row.title}`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error("Error in sync-all-sportstalk:", err);
  process.exit(1);
});
