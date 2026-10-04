-- Migration 0042: Withdraw and disable all YouTube content and sources.
UPDATE publications
SET visibility = 'withdrawn', eligible = false, selected = false
WHERE source_id LIKE 'yt-%'
   OR source_id LIKE '%youtube%'
   OR url LIKE '%youtube.com%'
   OR url LIKE '%youtu.be%'
   OR title LIKE '%YouTube%'
   OR original_title LIKE '%YouTube%'
   OR article_id IN (
     SELECT id FROM articles
     WHERE url LIKE '%youtube.com%'
        OR url LIKE '%youtu.be%'
        OR url LIKE '%youtube%'
        OR source_id LIKE 'yt-%'
   );

UPDATE sources
SET enabled = false
WHERE id LIKE 'yt-%'
   OR id LIKE '%youtube%'
   OR name LIKE '%YouTube%'
   OR (kind = 'rss' AND config->>'feedUrl' LIKE '%youtube.com%');
