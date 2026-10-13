import { sql } from "@aihot/backend/db";
import { publishArticle } from "@aihot/backend/publication/publish";

async function main() {
  console.log("==> Starting synchronization and re-publishing of publications...");
  const articles = await sql<{ id: string }[]>`
    SELECT id FROM articles ORDER BY timeline_at DESC
  `;
  console.log(`==> Found ${articles.length} articles to evaluate and publish.`);

  let count = 0;
  for (const { id } of articles) {
    try {
      await publishArticle(id, { releasedAt: new Date(Date.now() - 3600_000) });
      count++;
      if (count % 100 === 0) {
        console.log(`==> Processed ${count}/${articles.length}...`);
      }
    } catch (e: any) {
      console.error(`==> Failed to publish article ${id}: ${e.message}`);
    }
  }

  const summary = await sql`
    SELECT category, visibility, eligible, selected, count(*)::int
    FROM publications
    GROUP BY category, visibility, eligible, selected
    ORDER BY category, visibility, eligible DESC
  `;
  console.log("==> Completed! New publications summary:\n", summary);
  process.exit(0);
}

main().catch((err) => {
  console.error("==> Fatal error in sync-publications:", err);
  process.exit(1);
});
