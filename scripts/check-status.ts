import { sql, closeDb } from "@aihot/backend/db";

const pubs = await sql`SELECT article_id, title, visibility, selected, visible_after, now() as current_now FROM publications`;
console.log(pubs);

await sql`UPDATE publications SET visible_after = now() - interval '1 minute' WHERE visible_after > now() OR visible_after IS NULL`;
console.log("Updated visible_after to now!");

await closeDb();
