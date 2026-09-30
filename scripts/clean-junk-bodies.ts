import { sql, closeDb } from "@aihot/backend/db";
import { isSubstantiveBody } from "@aihot/backend/content/sanitize";
import { publishArticle } from "@aihot/backend/publication/publish";

console.log("=== Scanning database for non-substantive/junk article bodies ===");

const candidates = await sql<{
  id: string;
  title: string;
  body_status: string;
  body_html: string | null;
  body_text: string | null;
}[]>`
  SELECT id, title, body_status, body_html, body_text
  FROM articles
  WHERE body_status = 'ok' AND (body_html IS NOT NULL OR body_text IS NOT NULL)
`;

console.log(`Checking ${candidates.length} articles with confirmed bodies...`);

let cleanedCount = 0;

for (const a of candidates) {
  const html = a.body_html ?? "";
  const text = a.body_text ?? "";
  
  if (!isSubstantiveBody(html, text)) {
    console.log(`[Junk Body Detected] ID: ${a.id}`);
    console.log(`  Title: ${a.title}`);
    console.log(`  Preview: ${text.slice(0, 80).replace(/\n/g, " ")}...`);
    
    // Reset body status to unconfirmed and clear junk body content
    await sql`
      UPDATE articles
      SET body_status = 'unconfirmed',
          body_html = NULL,
          body_text = NULL,
          updated_at = now()
      WHERE id = ${a.id}
    `;
    
    // Re-publish article so publication projection automatically falls back to summary mode
    await publishArticle(a.id);
    cleanedCount++;
    console.log(`  -> Cleared junk body and re-published in summary mode.`);
  }
}

console.log(`\nScan finished. Total cleaned: ${cleanedCount} article(s).`);
await closeDb();
