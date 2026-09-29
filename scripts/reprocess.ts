import { sql, closeDb } from "@aihot/backend/db";
import { queueProcessing } from "@aihot/backend/jobs/content";

console.log("=== Finding articles in 'new' state ===");
const articles = await sql`
  SELECT id, title FROM articles
  WHERE processing_state = 'new'`;
console.log(`Found ${articles.length} articles:`, articles.map(a => a.title));

for (const a of articles) {
  console.log(`Queueing processing for: ${a.title}`);
  await queueProcessing(a.id);
}

await closeDb();
console.log("Done enqueuing articles for processing!");
