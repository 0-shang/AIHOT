import { sql, closeDb } from "@aihot/backend/db";
import { processArticle } from "../packages/backend/src/jobs/content.ts";
import { publishArticle } from "../packages/backend/src/publication/publish.ts";

async function main() {
  console.log("=== Step 1: Ensure Sportstalk episodes do not wait on web body extraction ===");
  await sql`
    UPDATE articles
    SET body_status = 'unconfirmed',
        processing_error = NULL
    WHERE (source_id LIKE 'rss-podcast-sportstalk790%' OR source_id LIKE 'rss-podcast-%')
      AND body_status = 'pending'
  `;

  console.log("=== Step 2: Clear empty/rule-only analyses for Fertitta & latest episodes ===");
  const targetIds = [
    'w3763xzieoao3lv1l1xyykrv1', // Rockets Vice Chairman Patrick Fertitta
    'tqvxn5qi2k36xnbpr7364i4sq', // Rockets Season Starts Tomorrow...
  ];

  // Also include any other recent Rockets episodes that have empty summary or no analysis
  const recentRockets = await sql<{ id: string; title: string }[]>`
    SELECT a.id, a.title
    FROM articles a
    LEFT JOIN publications p ON p.article_id = a.id
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
      AND (
        a.title ILIKE '%Fertitta%'
        OR a.title ILIKE '%Rockets Season Starts%'
        OR a.title ILIKE '%Rockets%'
      )
      AND (p.summary IS NULL OR p.summary = '' OR p.title = a.title OR p.eligible = false)
    ORDER BY a.published_at DESC
    LIMIT 10
  `;
  for (const r of recentRockets) {
    if (!targetIds.includes(r.id)) targetIds.push(r.id);
  }

  console.log(`Target articles to analyze with model (${targetIds.length}):`, targetIds);

  for (const id of targetIds) {
    console.log(`\n--- Processing article ${id} ---`);
    // Remove empty analysis so new model analysis is generated
    await sql`DELETE FROM analyses WHERE article_id = ${id} AND (title_zh = '' OR summary_zh = '' OR model = 'rule')`;
    await sql`UPDATE articles SET processing_state = 'new', processing_error = NULL WHERE id = ${id}`;

    try {
      const res = await processArticle(id);
      console.log(`processArticle result for ${id}:`, res);
    } catch (e) {
      console.error(`Error processing ${id}:`, e);
    }

    await publishArticle(id);
  }

  console.log("\n=== Step 3: Verifying publications table for target articles ===");
  const pubs = await sql`
    SELECT p.article_id, p.title, p.summary, p.visibility, p.eligible, p.category, a.title as original_title
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE p.article_id IN ${sql(targetIds)}
  `;
  for (const p of pubs) {
    console.log(`ID: ${p.article_id}`);
    console.log(`  Original: ${p.original_title}`);
    console.log(`  Title:    ${p.title}`);
    console.log(`  Summary:  ${p.summary}`);
    console.log(`  Eligible: ${p.eligible}, Visibility: ${p.visibility}, Category: ${p.category}\n`);
  }

  await closeDb();
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
