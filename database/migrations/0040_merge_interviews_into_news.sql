-- Merge "interviews" and "games" categories into "news" (球队动态).
-- Top tabs are now: 全部, 球队动态, 深度专栏, 交易流言, 队记推文.
UPDATE items SET category = 'news' WHERE category = 'interviews' OR category = 'games';
UPDATE publication_facts SET category = 'news' WHERE category = 'interviews' OR category = 'games';
