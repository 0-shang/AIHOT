import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH ready, executing fix script on aihot-api-1...');
  const script = `
docker exec aihot-api-1 node -e '
import { sql, closeDb } from "@aihot/backend/db";
async function fix() {
  console.log("Searching for Sports Illustrated preview article...");
  const rows = await sql\`
    SELECT p.article_id, p.title, p.summary, a.title as orig_title, a.body_text
    FROM publications p
    JOIN articles a ON a.id = p.article_id
    WHERE a.title ILIKE \${"%Hawks Vs Rockets%Preview%"} OR p.title ILIKE \${"%Hawks Vs Rockets%Preview%"}
    LIMIT 5
  \`;
  console.log("Found rows:", rows.length);
  for (const r of rows) {
    console.log("Found row:", r.article_id, r.title);
    const zhTitle = "老鹰vs火箭前瞻：伤病报告与今晚比赛预计首发";
    const zhSummary = "休斯敦火箭今日主场迎战亚特兰大老鹰。赛前双方伤病报告与预计首发阵容出炉，火箭队全员保持健康状态出击，力争延续主场攻防强势表现。";
    await sql\`
      UPDATE publications
      SET title = \${zhTitle},
          summary = \${zhSummary},
          category = 'news',
          tags = ARRAY['赛前前瞻', '伤病报告', '预计首发', '权威动态']::text[],
          visibility = 'public',
          eligible = true,
          updated_at = NOW()
      WHERE article_id = \${r.article_id}
    \`;
    await sql\`
      UPDATE articles
      SET summary = \${zhSummary}
      WHERE id = \${r.article_id}
    \`;
    console.log("Updated article " + r.article_id + " successfully!");
  }
  await closeDb();
  process.exit(0);
}
fix().catch(e => { console.error(e); process.exit(1); });
'
`;
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      console.log('Exit code:', code);
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error(err);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
