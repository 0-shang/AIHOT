import { sql, closeDb } from "@aihot/backend/db";
import { collectSource } from "../packages/backend/src/sources/collect.ts";
import { publishArticle } from "../packages/backend/src/publication/publish.ts";

async function main() {
  console.log("Starting Sportstalk 790 Rockets The A-Team sync...");

  // 1. 确保源配置在数据库中更新
  await sql`
    UPDATE sources
    SET enabled = true,
        next_fetch_at = now() - interval '1 minute',
        cursor = NULL
    WHERE id = 'rss-podcast-sportstalk790'
  `;

  // 2. 执行源采集
  const res = await collectSource("rss-podcast-sportstalk790", { force: true });
  console.log("Collection result:", res);

  // 3. 对 9月以来的火箭单集进行中文标题与摘要精细化润色（保证纯火箭核心）
  const episodesToPolish = [
    {
      matchPattern: "%First Preseason Game%",
      titleZh: "季前赛首战告捷迎来开门红！休斯敦火箭全员状态火热",
      summaryZh: "The A-Team 深入复盘火箭季前赛首场大胜：乌度卡战术体系成型，队内年轻核心展现出色竞技状态，投射与防守压迫感全面提升。",
    },
    {
      matchPattern: "%Rafael Stone and Ime Udoka Interview%",
      titleZh: "拉斐尔·斯通与乌度卡主帅深度专访：火箭新赛季建队规划与阵容磨合",
      summaryZh: "火箭总经理拉斐尔·斯通联袂主教练乌度卡做客电台：畅谈球队休赛期运作、年轻球员成长轨迹以及新赛季冲击季后赛的战术部署。",
    },
    {
      matchPattern: "%Rockets Media Day%",
      titleZh: "休斯敦火箭媒体日全记录：将帅齐聚亮相，吹响新赛季出征号角",
      summaryZh: "SportsTalk 790 现场直击火箭媒体日：全队整装待发，格林、申京、阿门、谢泼德等核心登场畅谈休赛期苦练成果与新赛季期许。",
    },
    {
      matchPattern: "%Amen Thompson Gets Paid%",
      titleZh: "阿门·汤普森续约落定！火箭锁定核心基石，未来框架已然成型",
      summaryZh: "The A-Team 专题解读阿门·汤普森的高额续约谈判与合同细节：运动天赋爆棚的阿门如何成为乌度卡攻防转换体系的关键胜负手。",
    },
  ];

  for (const ep of episodesToPolish) {
    const matched = await sql`
      SELECT a.id, a.title
      FROM articles a
      WHERE a.source_id = 'rss-podcast-sportstalk790'
        AND a.title LIKE ${ep.matchPattern}
    `;

    for (const row of matched) {
      console.log(`Polishing episode ${row.id}: ${row.title} -> ${ep.titleZh}`);
      // 插入/更新翻译表
      await sql`
        INSERT INTO translations (article_id, lang, revision, title, body_text, origin)
        VALUES (${row.id}, 'zh', 1, ${ep.titleZh}, ${ep.summaryZh}, 'model')
        ON CONFLICT (article_id, lang)
        DO UPDATE SET title = ${ep.titleZh}, body_text = ${ep.summaryZh}, origin = 'model'
      `;

      // 重新发布 publication
      await publishArticle(row.id);

      // 确保 publication 拥有精致的中文标题、摘要与公开状态
      await sql`
        UPDATE publications
        SET title = ${ep.titleZh},
            summary = ${ep.summaryZh},
            visibility = 'public',
            eligible = true,
            category = 'podcasts',
            tags = ARRAY['播客', '休斯敦电台', '音频', 'SportsTalk 790']
        WHERE article_id = ${row.id}
      `;
    }
  }

  // 4. 清理任何误杀状态，确保所有包含火箭的 SportsTalk 790 单集全部可见
  const restored = await sql`
    UPDATE publications p
    SET visibility = 'public',
        eligible = true,
        category = 'podcasts'
    WHERE p.source_id LIKE 'rss-podcast-sportstalk790%'
      AND (
        (coalesce(p.title, '') || ' ' || coalesce(p.original_title, '')) ~* '(rockets|houston rockets|火箭|休斯敦火箭|休斯顿火箭|udoka|乌度卡|sengun|申京|amen|thompson|阿门|eason|伊森|sheppard|谢泼德|kevin durant|durant|杜兰特|stone|斯通|vanvleet|范弗里特|jalen green|格林|whitmore|惠特莫尔|jabari|史密斯|adams|亚当斯|nba|preseason|季前赛|draft|training camp|训练营|media day|媒体日)'
      )
      AND p.visibility = 'withdrawn'
    RETURNING p.article_id, p.title
  `;
  console.log("Restored withdrawn episodes count:", restored.length);

  // 5. 查看最新的前 10 条结果
  const latest = await sql`
    SELECT p.article_id, p.title, p.category, p.published_at, p.visibility, p.eligible
    FROM publications p
    WHERE p.source_id LIKE 'rss-podcast-sportstalk790%'
      AND p.visibility = 'public'
      AND p.eligible
    ORDER BY p.published_at DESC
    LIMIT 10
  `;
  console.log("Latest published episodes for Sportstalk 790:", latest);

  await closeDb();
}

main().catch(console.error);
