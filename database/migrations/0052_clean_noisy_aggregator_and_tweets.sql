-- Migration 0052: Clean up noisy aggregator non-SI/roundtable items and withdraw x-search-rockets-global tweets

-- 1. Withdraw all generic Twitter search items (推特热议)
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE source_id = 'x-search-rockets-global';

UPDATE sources
SET participation_mode = 'isolated'
WHERE id = 'x-search-rockets-global';

-- 2. Withdraw all global aggregator articles that are NOT from Sports Illustrated or roundtable
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE source_id IN ('rss-web-rockets-global', 'rss-google-news-rockets')
  AND NOT (
    url ~* '(si\.com|roundtable)'
    OR title ~* '(sports illustrated|roundtable)'
    OR coalesce(original_title, '') ~* '(sports illustrated|roundtable)'
  );

-- 3. Ensure valid Sports Illustrated & roundtable publications remain eligible and in news category
UPDATE publications
SET visibility = 'public',
    eligible = true,
    category = 'news'
WHERE source_id IN ('rss-web-rockets-global', 'rss-google-news-rockets')
  AND (
    url ~* '(si\.com|roundtable)'
    OR title ~* '(sports illustrated|roundtable)'
    OR coalesce(original_title, '') ~* '(sports illustrated|roundtable)'
  )
  AND NOT (
    title ~* '(赛前前瞻|比赛前瞻|对阵前瞻|胜负预测|盘口|赔率|odds|prediction|spread)'
  );
