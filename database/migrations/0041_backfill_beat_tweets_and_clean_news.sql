-- Migration 0041: Backfill beat_tweets and clean non-news trivia from news category.
-- 1. All non-first-party tweets from beat reporters default to beat_tweets category unless explicitly an interview.
UPDATE publications
SET category = 'beat_tweets'
WHERE channel = 'x'
  AND NOT first_party
  AND NOT (tags && ARRAY['赛后采访', '球员采访', '将帅原声', '采访', '球队采访', '原声', '声音']::text[]);

UPDATE analyses
SET category = 'beat_tweets'
FROM articles a, sources s
WHERE analyses.article_id = a.id
  AND a.source_id = s.id
  AND s.kind = 'x_search'
  AND NOT s.first_party
  AND NOT (analyses.tags && ARRAY['赛后采访', '球员采访', '将帅原声', '采访', '球队采访', '原声', '声音']::text[]);

-- 2. Remove trivia/history articles (like jersey history) from news category.
UPDATE publications
SET category = NULL
WHERE category = 'news'
  AND (title LIKE '%球衣历史%' OR title LIKE '%球衣回顾%' OR title LIKE '%球衣盘点%');

UPDATE analyses
SET category = NULL
WHERE category = 'news'
  AND (title_zh LIKE '%球衣历史%' OR title_zh LIKE '%球衣回顾%' OR title_zh LIKE '%球衣盘点%');
