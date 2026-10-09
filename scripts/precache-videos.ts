// Pre-caches all existing videos in the database into local disk storage (.data/videocache)
// so all videos play instantly with zero delay.
import { sql } from "../packages/backend/src/db.ts";
import { downloadAndCacheVideo, isVideoCached, videoCacheKey } from "../packages/backend/src/media/videocache.ts";

async function main() {
  console.log("Searching for articles with video content...");
  
  const rows = await sql<{ id: string; title: string; x_post: any }[]>`
    SELECT id, title, x_post
    FROM articles
    WHERE x_post IS NOT NULL
    ORDER BY coalesce(published_at, discovered_at) DESC
    LIMIT 200
  `;

  const videoUrls: Array<{ id: string; url: string; title: string }> = [];

  for (const r of rows) {
    const post = typeof r.x_post === "string" ? JSON.parse(r.x_post) : r.x_post;
    if (!post) continue;
    const media = post.media || [];
    for (const m of media) {
      if (m.kind === "video" && m.videoUrl && typeof m.videoUrl === "string") {
        videoUrls.push({ id: r.id, url: m.videoUrl, title: r.title });
      }
    }
  }

  console.log(`Found ${videoUrls.length} videos in recent articles.`);
  let cachedCount = 0;
  let downloadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < videoUrls.length; i++) {
    const { id, url, title } = videoUrls[i];
    const key = videoCacheKey(url);
    const cached = await isVideoCached(url);
    if (cached) {
      cachedCount++;
      console.log(`[${i + 1}/${videoUrls.length}] Already cached: ${title.slice(0, 30)}... (${key})`);
      continue;
    }

    console.log(`[${i + 1}/${videoUrls.length}] Caching video: ${title.slice(0, 30)}...`);
    try {
      const res = await downloadAndCacheVideo(url);
      if (res) {
        downloadedCount++;
        console.log(`  -> Cached successfully to disk`);
      } else {
        failedCount++;
        console.warn(`  -> Download failed or returned empty`);
      }
    } catch (err) {
      failedCount++;
      console.error(`  -> Error:`, err);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Total: ${videoUrls.length}`);
  console.log(`Already cached: ${cachedCount}`);
  console.log(`Newly downloaded: ${downloadedCount}`);
  console.log(`Failed: ${failedCount}`);

  await sql.end();
}

main().catch(console.error);
