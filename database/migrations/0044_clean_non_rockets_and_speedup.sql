-- Migration 0044: Fast indexing, non-Rockets withdrawal, podcast & video categorization.

-- 1. Withdraw all other Houston sports teams (Texans/Astros/Oilers/Dynamo) and noise from publications
UPDATE publications
SET visibility = 'withdrawn', eligible = false, selected = false
WHERE title ~* '(德州人|太空人|油人队|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|c\.j|四分卫|外接手|防守端锋|跑卫|角卫|达阵|棒球|橄榄球|全垒打|安打|三振|红雀|马文·哈里森|marvin harrison)'
   OR original_title ~* '(德州人|太空人|油人队|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|c\.j|四分卫|外接手|防守端锋|跑卫|角卫|达阵|棒球|橄榄球|全垒打|安打|三振|红雀|马文·哈里森|marvin harrison)';

-- 2. Ensure all podcast sources have category = 'podcasts'
UPDATE publications
SET category = 'podcasts'
WHERE source_id LIKE 'rss-podcast-%'
   OR source_id IN ('rss-podcast-lockedon', 'rss-podcast-launchpod', 'rss-podcast-rocketfuel', 'rss-podcast-rocketsdaily', 'rss-podcast-sportstalk790', 'rss-sportstalk790');

UPDATE analyses
SET category = 'podcasts'
WHERE article_id IN (
  SELECT article_id FROM publications WHERE category = 'podcasts'
);

-- 3. Categorize articles with video media as 'videos' (only Rockets related)
UPDATE publications p
SET category = 'videos'
WHERE (
  p.source_id LIKE 'yt-%'
  OR p.source_id LIKE '%video%'
  OR EXISTS (
    SELECT 1 FROM articles a 
    WHERE a.id = p.article_id 
      AND (
        (a.media IS NOT NULL AND a.media::text LIKE '%"kind":"video"%')
        OR (a.x_post IS NOT NULL AND a.x_post::text LIKE '%"kind":"video"%')
      )
  )
)
AND p.visibility = 'public'
AND (
  p.title ~* '(rockets|火箭|休斯敦|houston|乌度卡|udoka|申京|sengun|格林|jalen green|小贾巴里|jabari smith|史密斯|伊森|eason|阿门|amen|谢泼德|sheppard|范弗里特|vanvleet|亚当斯|adams|惠特莫尔|whitmore|狄龙|brooks|丰田中心|toyota center|nba)'
  OR p.original_title ~* '(rockets|火箭|休斯敦|houston|udoka|sengun|jalen green|jabari smith|eason|amen|sheppard|vanvleet|adams|whitmore|brooks|toyota center|nba)'
  OR p.source_id IN ('x-houston-rockets', 'x-rocketsnation-cp', 'x-sleeper-rockets', 'x-spacecity-hn', 'x-rockets-wire')
)
AND NOT (
  p.title ~* '(德州人|太空人|油人|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|c\.j|四分卫|外接手|防守端锋|跑卫|达阵|棒球|橄榄球|全垒打|安打)'
  OR p.original_title ~* '(德州人|太空人|油人|迪纳摩|texans|astros|oilers|dynamo|stroud|斯特劳德|c\.j|四分卫|外接手|防守端锋|跑卫|达阵|棒球|橄榄球|全垒打|安打)'
);

-- 4. Ensure news articles have category = 'news' if currently null
UPDATE publications
SET category = 'news'
WHERE category IS NULL
  AND source_id NOT LIKE 'rss-podcast-%'
  AND source_id NOT LIKE 'yt-%'
  AND (channel = 'news' OR first_party OR source_id IN ('x-houston-rockets', 'x-rocketsnation-cp', 'x-sleeper-rockets', 'x-spacecity-hn', 'x-rockets-wire'));

-- 5. Add index on publications(category, timeline_at DESC, article_id) for instant category filtering
CREATE INDEX IF NOT EXISTS publications_category_timeline_idx
  ON publications (category, timeline_at DESC, article_id)
  WHERE visibility = 'public' AND eligible;

-- 6. Add index on publications(source_id, timeline_at DESC, article_id) for instant show filtering
CREATE INDEX IF NOT EXISTS publications_source_timeline_idx
  ON publications (source_id, timeline_at DESC, article_id)
  WHERE visibility = 'public' AND eligible;
