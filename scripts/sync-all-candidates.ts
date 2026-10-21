import { sql, closeDb } from "@aihot/backend/db";
import { fetchRss } from "../packages/backend/src/sources/rss.ts";
import { upsertMaterial, identityKeyFor } from "../packages/backend/src/content/materials.ts";
import { publishArticle } from "../packages/backend/src/publication/publish.ts";

async function syncFeed(sourceId: string) {
  console.log(`\n=== Syncing ${sourceId} ===`);
  const [source] = await sql`SELECT * FROM sources WHERE id = ${sourceId}`;
  if (!source) {
    console.log(`Source ${sourceId} not found`);
    return;
  }
  const feedResult = await fetchRss(source as any, { force: true });
  console.log(`Fetched ${feedResult.candidates.length} candidates from RSS feed.`);

  let createdCount = 0;
  let updatedCount = 0;
  const seen = new Set<string>();

  for (const c of feedResult.candidates) {
    const material = { ...c, sourceId, via: "fetch" as const, backfill: null };
    const key = identityKeyFor(material as any);
    if (seen.has(key)) continue;
    seen.add(key);

    const res = await upsertMaterial(material as any);
    if (res.created) createdCount++;
    if (res.revised) updatedCount++;
    await publishArticle(res.articleId);
  }

  console.log(`Finished ${sourceId}: created=${createdCount}, revised=${updatedCount}`);
}

async function main() {
  await syncFeed("rss-podcast-sportstalk790");
  await syncFeed("rss-podcast-sportstalk790-mattthomas");

  // Step: update sources metadata
  await sql`
    UPDATE sources
    SET last_fetch_at = now(),
        last_ok_at = now(),
        health = 'ok',
        fail_count = 0,
        next_fetch_at = now() + make_interval(mins => interval_minutes)
    WHERE id LIKE 'rss-podcast-sportstalk790%'
  `;

  // Step: Print the latest 20 public episodes
  console.log("\n=== Latest 20 Public Sportstalk 790 Episodes in Database ===");
  const latest = await sql`
    SELECT p.article_id, p.title, p.visibility, p.category, p.published_at, a.source_id
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
      AND p.visibility = 'public'
    ORDER BY p.published_at DESC
    LIMIT 20
  `;
  for (const item of latest) {
    const show = item.source_id === "rss-podcast-sportstalk790" ? "The A-Team" : "Matt Thomas";
    console.log(`[${item.published_at?.toISOString()?.substring(0, 16)}] [${show}] ${item.title}`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
