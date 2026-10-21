import { sql, closeDb } from "@aihot/backend/db";
import { collectSource } from "../packages/backend/src/sources/collect.ts";
import { publishArticle } from "../packages/backend/src/publication/publish.ts";

async function main() {
  console.log("=== Step 1: Ensure Sportstalk sources are active in DB ===");
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

  console.log("=== Step 2: Collecting rss-podcast-sportstalk790 (The A-Team) ===");
  const res1 = await collectSource("rss-podcast-sportstalk790", { force: true });
  console.log("A-Team collection result:", res1);

  console.log("=== Step 3: Collecting rss-podcast-sportstalk790-mattthomas ===");
  const res2 = await collectSource("rss-podcast-sportstalk790-mattthomas", { force: true });
  console.log("Matt Thomas collection result:", res2);

  console.log("=== Step 4: Publishing all sportstalk790 articles ===");
  const allArticles = await sql<{ id: string; title: string; published_at: Date }[]>`
    SELECT a.id, a.title, a.published_at
    FROM articles a
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY a.published_at DESC
  `;
  console.log(`Found ${allArticles.length} total articles from Sportstalk 790. Publishing...`);

  let pubCount = 0;
  for (const a of allArticles) {
    await publishArticle(a.id);
    pubCount++;
  }
  console.log(`Finished publishing ${pubCount} articles.`);

  console.log("=== Step 5: Verify Rocket-related sportstalk episodes are public ===");
  // Rocket episodes: title/original_title/summary mentions Rockets/NBA topics
  const updated = await sql`
    UPDATE publications p
    SET visibility = 'public',
        eligible = true,
        category = 'podcasts'
    FROM articles a
    WHERE a.id = p.article_id
      AND a.source_id LIKE 'rss-podcast-sportstalk790%'
      AND (
        (coalesce(p.title, '') || ' ' || coalesce(p.original_title, '') || ' ' || coalesce(a.title, '') || ' ' || coalesce(a.body_text, '')) ~*
        '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|preseason|training camp|media day|nba|fertitta)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯|季前赛|媒体日|训练营|费尔蒂塔)'
      )
      AND NOT coalesce(p.summary, '') ~* '(与休斯敦火箭队无关|与火箭队无关|与休斯敦火箭无关)'
    RETURNING p.article_id
  `;
  console.log(`Affirmed ${updated.length} Rocket episodes as public podcasts.`);

  console.log("=== Step 6: Querying latest 15 public Sportstalk 790 podcast episodes ===");
  const latestPublic = await sql`
    SELECT p.article_id, p.title, p.visibility, p.category, p.published_at, a.source_id
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
      AND p.visibility = 'public'
    ORDER BY p.published_at DESC
    LIMIT 15
  `;
  for (const item of latestPublic) {
    console.log(`  [${item.published_at?.toISOString()?.substring(0, 16)}] [${item.source_id === 'rss-podcast-sportstalk790' ? 'The A-Team' : 'Matt Thomas'}] ${item.title}`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
