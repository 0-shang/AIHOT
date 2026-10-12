-- Migration 0045: Purge noisy sources (Fadeaway World, Hoops Wire), remove NFL hallucinated story, and update podcast backfill limits.

-- 1. Completely delete noisy non-Rockets syndicated blogs (Fadeaway World, Hoops Wire)
DELETE FROM publications WHERE source_id IN (
  SELECT id FROM sources WHERE id IN ('rss-fadeawayworld', 'rss-theleadsports', 'rss-hoopswire-rockets') OR id LIKE '%fadeaway%' OR id LIKE '%hoopswire%' OR name ILIKE '%Fadeaway%' OR name ILIKE '%Hoops Wire%'
);
DELETE FROM articles WHERE source_id IN (
  SELECT id FROM sources WHERE id IN ('rss-fadeawayworld', 'rss-theleadsports', 'rss-hoopswire-rockets') OR id LIKE '%fadeaway%' OR id LIKE '%hoopswire%' OR name ILIKE '%Fadeaway%' OR name ILIKE '%Hoops Wire%'
);
DELETE FROM sources WHERE id IN ('rss-fadeawayworld', 'rss-theleadsports', 'rss-hoopswire-rockets') OR id LIKE '%fadeaway%' OR id LIKE '%hoopswire%' OR name ILIKE '%Fadeaway%' OR name ILIKE '%Hoops Wire%';

-- 2. Remove the hallucinated NFL Texans story ("火箭交易CJ与MHJ传闻引热议") from stories table
UPDATE publications SET story_id = NULL WHERE story_id IN (
  SELECT id FROM stories WHERE title ~* '(cj|mhj|德州人|泰坦|四分卫|stroud|斯特劳德|接球|达阵|texans|astros|oilers)'
);
UPDATE facts SET story_id = NULL WHERE story_id IN (
  SELECT id FROM stories WHERE title ~* '(cj|mhj|德州人|泰坦|四分卫|stroud|斯特劳德|接球|达阵|texans|astros|oilers)'
);
DELETE FROM story_aliases WHERE story_id IN (
  SELECT id FROM stories WHERE title ~* '(cj|mhj|德州人|泰坦|四分卫|stroud|斯特劳德|接球|达阵|texans|astros|oilers)'
);
UPDATE stories SET merged_into = NULL WHERE merged_into IN (
  SELECT id FROM stories WHERE title ~* '(cj|mhj|德州人|泰坦|四分卫|stroud|斯特劳德|接球|达阵|texans|astros|oilers)'
);
DELETE FROM stories WHERE title ~* '(cj|mhj|德州人|泰坦|四分卫|stroud|斯特劳德|接球|达阵|texans|astros|oilers)';

-- 3. Withdraw any articles mentioning CJ/MHJ NFL trade rumors from publications
UPDATE publications
SET visibility = 'withdrawn', eligible = false, selected = false
WHERE title ~* '(cj.*mhj|mhj.*cj|四分卫|接球手|达阵|stroud|斯特劳德)'
   OR original_title ~* '(cj.*mhj|mhj.*cj|stroud)';

-- 4. Trigger immediate refetch for podcast sources (backfill configs are updated by seed.ts)
UPDATE sources
SET next_fetch_at = now()
WHERE id IN ('rss-podcast-launchpod', 'rss-podcast-sportstalk790', 'rss-podcast-sportstalk790-mattthomas');
