-- Migration 0050: Withdraw non-Rockets articles and purge non-podcast sources from podcasts category

-- 1. Withdraw the specific unrelated Houston ICE enforcement article
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE article_id = 'n2c18wuurgnh52l7qgsxcanfs'
   OR title ILIKE '%ICE%休斯敦%'
   OR summary ILIKE '%ICE%探员%';

-- 2. Ensure non-podcast sources (like Google News or web feeds) never leak into 'podcasts' category
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE category = 'podcasts'
  AND source_id NOT LIKE 'rss-podcast-%';

-- 3. Withdraw any podcast publication discussing non-Rockets civic/political matters
UPDATE publications
SET visibility = 'withdrawn',
    eligible = false,
    selected = false
WHERE category = 'podcasts'
  AND (
    (coalesce(title, '') || ' ' || coalesce(summary, '')) ~* '(ICE|执法事件|去世多年|Ken Paxton|参议员竞选|出资投放广告)'
    OR (
      (coalesce(title, '') || ' ' || coalesce(original_title, '')) !~* '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|nba)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯)'
      AND NOT coalesce(summary, '') ~* '(火箭|申京|杜兰特|乌度卡)'
    )
  );
