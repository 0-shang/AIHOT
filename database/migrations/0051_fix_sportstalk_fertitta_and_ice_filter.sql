-- Migration 0051: Fix ICE filter word boundary and ensure Rockets-related Sportstalk 790 podcasts remain public

-- 1. Ensure any Sportstalk podcast covering Rockets/Fertitta/Udoka is public and eligible
UPDATE publications p
SET visibility = 'public',
    eligible = true,
    category = 'podcasts'
FROM articles a
WHERE a.id = p.article_id
  AND a.source_id LIKE 'rss-podcast-sportstalk790%'
  AND (
    (coalesce(p.title, '') || ' ' || coalesce(p.original_title, '') || ' ' || coalesce(a.title, '')) ~*
    '(\\y(rockets|houston rockets|udoka|sengun|durant|amen|thompson|eason|sheppard|stone|vanvleet|jalen green|whitmore|jabari|smith|adams|preseason|training camp|media day|nba|fertitta)\\y|火箭|休斯敦火箭|休斯顿火箭|乌度卡|申京|杜兰特|阿门|伊森|谢泼德|斯通|范弗里特|格林|惠特莫尔|史密斯|亚当斯|季前赛|媒体日|训练营|费尔蒂塔)'
  )
  AND NOT coalesce(p.summary, '') ~* '(与休斯敦火箭队无关|与火箭队无关|与休斯敦火箭无关)';
