-- Migration 0043: Purge all SportSpyder aggregator sources, publications, and articles.
DELETE FROM publications WHERE source_id LIKE '%sportspyder%' OR url LIKE '%sportspyder%';
DELETE FROM articles WHERE source_id LIKE '%sportspyder%' OR url LIKE '%sportspyder%';
DELETE FROM sources WHERE id LIKE '%sportspyder%' OR name LIKE '%SportSpyder%';
