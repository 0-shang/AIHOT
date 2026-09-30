// Backfill videoUrl for tweets in articles.x_post from saved receipts.
import { sql, closeDb } from "@aihot/backend/db";
import { pickVideoUrl, type SdTweet, type SdMedia } from "@aihot/backend/providers/socialdata";

console.log("=== Backfilling video URLs for tweets from receipts ===");

// 1. Load tweets with video_info from socialdata receipts
const receipts = await sql<{ response: any }[]>`
  SELECT response FROM receipts
  WHERE service = 'socialdata' AND response::text LIKE '%video_info%'
`;

const tweetMap = new Map<string, SdTweet>();
for (const r of receipts) {
  const json = typeof r.response === "string" ? JSON.parse(r.response) : r.response;
  for (const t of (json.tweets ?? []) as SdTweet[]) {
    if (t.id_str) tweetMap.set(t.id_str, t);
  }
}
console.log(`Loaded ${tweetMap.size} tweets from ${receipts.length} receipts.`);

// 2. Query articles with video media
const articles = await sql<{ id: string; url: string; x_post: Record<string, any> }[]>`
  SELECT id, url, x_post FROM articles
  WHERE x_post IS NOT NULL AND x_post::text LIKE '%"kind": "video"%'
`;
console.log(`Found ${articles.length} articles with video media in x_post.`);

let updatedCount = 0;

for (const a of articles) {
  const rawX = a.x_post;
  const x = typeof rawX === "string" ? JSON.parse(rawX) : rawX;
  if (!x || !Array.isArray(x.media)) continue;

  const tweetId = String(x.tweetId ?? a.url.split("/").pop()?.split("?")[0] ?? "");
  const tweet = tweetMap.get(tweetId);
  if (!tweet) {
    console.warn(`Tweet ${tweetId} (${a.url}) not found in receipts.`);
    continue;
  }

  const sdMediaList: SdMedia[] = tweet.extended_entities?.media ?? tweet.entities?.media ?? [];
  let modified = false;

  for (let i = 0; i < x.media.length; i++) {
    const m = x.media[i];
    if (m.kind === "video" && !m.videoUrl) {
      // Find matching media in tweet
      const matched = sdMediaList.find((sm) => sm.media_url_https === m.url || sm.media_url_https === m.poster) ?? sdMediaList[i];
      if (matched) {
        const vUrl = pickVideoUrl(matched);
        if (vUrl) {
          m.videoUrl = vUrl;
          modified = true;
        }
      }
    }
  }

  // If modified OR if it was stored as a double-serialized string, update with sql.json
  if (modified || typeof rawX === "string") {
    await sql`
      UPDATE articles
      SET x_post = ${sql.json(x as never)}
      WHERE id = ${a.id}
    `;
    updatedCount++;
    console.log(`Updated article [${a.id}] (tweet ${tweetId}) with videoUrl.`);
  }
}

console.log(`=== Done! Backfilled ${updatedCount} articles. ===`);
await closeDb();
