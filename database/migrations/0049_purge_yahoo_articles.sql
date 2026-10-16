-- Migration 0049: Purge and withdraw all Yahoo articles and redirected content

UPDATE publications p
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
FROM articles a
WHERE a.id = p.article_id
  AND (
    a.url ILIKE '%yahoo.com%'
    OR a.url ILIKE '%sports.yahoo%'
    OR p.url ILIKE '%yahoo.com%'
    OR p.url ILIKE '%sports.yahoo%'
    OR p.title ILIKE '%Yahoo%'
    OR a.title ILIKE '%Yahoo%'
    OR p.summary ILIKE '%Yahoo%'
    OR a.excerpt ILIKE '%Yahoo%'
  );

UPDATE articles
SET body_status = 'blocked'
WHERE url ILIKE '%yahoo.com%'
   OR url ILIKE '%sports.yahoo%'
   OR title ILIKE '%Yahoo%';
