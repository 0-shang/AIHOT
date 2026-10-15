-- Migration 0046: Enhance Sportstalk 790 Rockets The A-Team podcast filtering, dedup and polish latest episodes.

-- 1. Ensure any wrongly withdrawn Rockets podcast episodes are restored
UPDATE publications p
SET visibility = 'public',
    eligible = true,
    category = 'podcasts'
WHERE p.source_id LIKE 'rss-podcast-sportstalk790%'
  AND (
    (coalesce(p.title, '') || ' ' || coalesce(p.original_title, '')) ~* '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|preseason|training camp|media day|nba)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯|季前赛|媒体日|训练营)'
  );

-- 2. Deduplicate duplicate sportstalk podcast publication entries by published_at
WITH dupes AS (
  SELECT article_id,
         row_number() OVER (PARTITION BY source_id, published_at ORDER BY article_id ASC) AS rn
  FROM publications
  WHERE source_id LIKE 'rss-podcast-sportstalk790%' AND visibility = 'public'
)
UPDATE publications
SET visibility = 'withdrawn', eligible = false
WHERE article_id IN (SELECT article_id FROM dupes WHERE rn > 1);

-- 3. Reset fetch cursor and schedule immediate fetch to grab any newer episodes
UPDATE sources
SET next_fetch_at = now() - interval '1 minute',
    fail_count = 0,
    health = 'ok'
WHERE id = 'rss-podcast-sportstalk790';
