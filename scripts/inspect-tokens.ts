import { sql } from "../packages/backend/src/db.ts";

async function main() {
  try {
    const rows = await sql`
      SELECT 
        r.purpose, 
        r.service,
        r.model,
        count(a.id) as calls,
        round(sum(coalesce(a.cost, 0))::numeric, 4) as cost_cny
      FROM receipts r
      LEFT JOIN receipt_attempts a ON a.receipt_id = r.id
      GROUP BY r.purpose, r.service, r.model
      ORDER BY calls DESC
    `;
    console.table(rows);

    const states = await sql`
      SELECT processing_state, count(*) as count
      FROM articles
      GROUP BY processing_state
      ORDER BY count DESC
    `;
    console.table(states);

  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}

main();
