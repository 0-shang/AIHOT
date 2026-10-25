import { readFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "@aihot/backend/config";
import { closeDb, sql } from "@aihot/backend/db";

async function main() {
  console.log("Applying 0052 migration...");
  const sqlFile = path.join(REPO_ROOT, "database/migrations/0052_clean_noisy_aggregator_and_tweets.sql");
  const text = readFileSync(sqlFile, "utf8");
  await sql.begin(async (tx) => {
    await tx.unsafe(text);
    await tx`INSERT INTO schema_migrations (name) VALUES ('0052_clean_noisy_aggregator_and_tweets.sql') ON CONFLICT (name) DO NOTHING`;
  });
  console.log("0052 applied successfully!");
  await closeDb();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration 0052 error:", err);
  process.exit(1);
});
