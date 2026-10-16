-- Migration 0048: Filter SportsTalk 790 to Rockets-only, and clean up fake/no-content videos

-- 1. Withdraw non-Rockets SportsTalk 790 podcast episodes
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE source_id LIKE 'rss-podcast-sportstalk790%'
  AND (
    (coalesce(title, '') || ' ' || coalesce(original_title, '')) !~* '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|preseason|training camp|media day|nba)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯|季前赛|媒体日|训练营)'
    OR coalesce(summary, '') ~* '(与休斯敦火箭队无关|与火箭队无关|与休斯敦火箭无关)'
  );

-- 2. Ensure legitimate Rockets-focused SportsTalk 790 episodes remain public and eligible
UPDATE publications
SET visibility = 'public',
    eligible = true,
    category = 'podcasts'
WHERE source_id LIKE 'rss-podcast-sportstalk790%'
  AND (coalesce(title, '') || ' ' || coalesce(original_title, '')) ~* '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|preseason|training camp|media day|nba)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯|季前赛|媒体日|训练营)'
  AND NOT coalesce(summary, '') ~* '(与休斯敦火箭队无关|与火箭队无关|与休斯敦火箭无关)';

-- 3. Withdraw all fake video highlights with no actual video media and no substantive body (e.g. Google News stubs)
UPDATE publications p
SET visibility = 'withdrawn',
    eligible = false,
    selected = false,
    category = 'news',
    tags = array_remove(array_remove(array_remove(p.tags, '集锦'), '视频'), '精彩视频')
FROM articles a
WHERE a.id = p.article_id
  AND (
    p.source_id IN ('rss-google-news-rockets', 'rss-web-rockets-global')
    OR (
      p.source_id NOT LIKE 'yt-%'
      AND NOT (a.media IS NOT NULL AND a.media::text ~* '"kind"\s*:\s*"video"')
      AND (
        length(coalesce(a.body_text, '')) < 300
        OR coalesce(p.summary, '') ~* '(原文未提供|个人集锦|比赛集锦已在|上线)'
      )
    )
  )
  AND (p.category = 'videos' OR p.tags && ARRAY['集锦', '视频', '精彩视频']::text[]);

-- 4. Reclassify any remaining non-video publications out of 'videos' category
UPDATE publications p
SET category = CASE WHEN p.channel = 'x' THEN 'beat_tweets' ELSE 'news' END,
    tags = array_remove(array_remove(array_remove(p.tags, '集锦'), '视频'), '精彩视频')
FROM articles a
WHERE a.id = p.article_id
  AND p.category = 'videos'
  AND p.source_id NOT LIKE 'yt-%'
  AND NOT (a.media IS NOT NULL AND a.media::text ~* '"kind"\s*:\s*"video"');
