-- Update SportsTalk 790 config: collect all episodes without noise filter
UPDATE sources
SET config = '{"feedUrl": "https://www.spreaker.com/show/3442316/episodes/feed", "_aihot": {"initialBackfillLimit": 120}}'::jsonb
WHERE id = 'rss-podcast-sportstalk790';

UPDATE sources
SET config = '{"feedUrl": "https://www.spreaker.com/show/2599904/episodes/feed", "_aihot": {"initialBackfillLimit": 80}}'::jsonb
WHERE id = 'rss-podcast-sportstalk790-mattthomas';

-- Restore any withdrawn sportstalk790 publications so all collected episodes are publicly visible
UPDATE publications
SET visibility = 'public',
    eligible = true,
    category = 'podcasts'
WHERE source_id LIKE 'rss-podcast-sportstalk790%';
