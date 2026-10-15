import { sql, closeDb } from "@aihot/backend/db";

async function main() {
  // 1. Check the latest fetch_runs for sportstalk790
  console.log("=== Latest fetch_runs for sportstalk790 ===");
  const runs = await sql`
    SELECT id, source_id, started_at, finished_at, status, found_count, new_count, error
    FROM fetch_runs 
    WHERE source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY started_at DESC 
    LIMIT 10`;
  for (const r of runs) {
    console.log(r.started_at?.toISOString()?.substring(0, 16) + ' | status=' + r.status + ' found=' + r.found_count + ' new=' + r.new_count + (r.error ? ' err=' + r.error.substring(0, 80) : ''));
  }

  // 2. Check the source record  
  console.log("\n=== Source record for sportstalk790 ===");
  const sources = await sql`
    SELECT id, enabled, last_fetch_at, last_ok_at, fail_count, health
    FROM sources 
    WHERE id LIKE 'rss-podcast-sportstalk790%'`;
  for (const s of sources) {
    console.log('  id:', s.id, '| enabled:', s.enabled, '| health:', s.health, '| fail_count:', s.fail_count);
    console.log('  last_fetch_at:', s.last_fetch_at?.toISOString());
    console.log('  last_ok_at:', s.last_ok_at?.toISOString());
  }

  // 3. Check the latest articles from sportstalk790
  console.log("\n=== Latest 20 articles from sportstalk790 ===");
  const articles = await sql`
    SELECT id, source_id, title, url, published_at, discovered_at
    FROM articles
    WHERE source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY published_at DESC
    LIMIT 20`;
  for (const a of articles) {
    console.log(a.published_at?.toISOString()?.substring(0, 10) + ' | ' + a.title?.substring(0, 100));
  }

  // 4. Check the publications for sportstalk790
  console.log("\n=== Latest 20 publications from sportstalk790 ===");
  const pubs = await sql`
    SELECT p.article_id, p.title, p.visibility, p.selected, p.published_at, p.category, a.source_id
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'
    ORDER BY p.published_at DESC
    LIMIT 20`;
  for (const p of pubs) {
    console.log(p.published_at?.toISOString()?.substring(0, 10) + ' | vis=' + p.visibility + ' sel=' + p.selected + ' cat=' + p.category + ' | ' + p.title?.substring(0, 80));
  }

  // 5. Count total
  const countResult = await sql`
    SELECT count(*) as cnt FROM articles WHERE source_id LIKE 'rss-podcast-sportstalk790%'`;
  console.log("\nTotal articles from sportstalk790:", countResult[0].cnt);

  const pubCount = await sql`
    SELECT count(*) as cnt FROM publications p JOIN articles a ON a.id = p.article_id WHERE a.source_id LIKE 'rss-podcast-sportstalk790%'`;
  console.log("Total publications from sportstalk790:", pubCount[0].cnt);

  await closeDb();
}
main().catch((e) => { console.error(e); process.exit(1); });
