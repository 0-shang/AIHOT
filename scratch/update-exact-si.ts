import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected, updating exact article...');
  const script = `
docker exec aihot-api-1 node -e '
import { sql, closeDb } from "@aihot/backend/db";
async function run() {
  const id = "xrjw961lsacolngct9f5m0qua";
  const zhTitle = "老鹰vs火箭前瞻：伤病报告与今晚比赛预计首发";
  const zhSummary = "休斯敦火箭今日主场迎战亚特兰大老鹰。赛前双方伤病报告与预计首发阵容出炉，火箭队全员保持健康状态出击，力争延续主场攻防强势表现。";
  console.log("Updating publications and articles for " + id);
  await sql\`
    UPDATE publications
    SET title = \${zhTitle},
        summary = \${zhSummary},
        category = "news",
        tags = ARRAY["赛前前瞻", "伤病报告", "预计首发", "权威动态"]::text[],
        visibility = "public",
        eligible = true,
        updated_at = NOW()
    WHERE article_id = \${id}
  \`;
  await sql\`
    UPDATE articles
    SET summary = \${zhSummary}
    WHERE id = \${id}
  \`;
  console.log("Exact update done!");
  await closeDb();
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
'
echo "==> Restarting aihot-api-1 to clear pool cache..."
docker restart aihot-api-1
`;

  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('data', (d: Buffer) => process.stdout.write(d.toString()));
    stream.stderr.on('data', (d: Buffer) => process.stderr.write(d.toString()));
    stream.on('close', (code: number) => {
      console.log('Finished with code:', code);
      conn.end();
    });
  });
}).on('error', console.error).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU',
  readyTimeout: 30000
});
