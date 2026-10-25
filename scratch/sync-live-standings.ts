import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Syncing standings.json and triggering rockets sync...');
  const script = `
docker exec aihot-api-1 mkdir -p /app/.data/rockets
docker cp /root/myhot/.data/rockets/standings.json aihot-api-1:/app/.data/rockets/standings.json
docker exec aihot-web-1 mkdir -p /app/.data/rockets
docker cp /root/myhot/.data/rockets/standings.json aihot-web-1:/app/.data/rockets/standings.json
echo "Triggering API sync via curl..."
docker exec aihot-api-1 curl -s -X POST http://127.0.0.1:3000/api/site/rockets/sync || true
echo ""
echo "Fetching updated standings from API..."
docker exec aihot-api-1 curl -s http://127.0.0.1:3000/api/site/rockets/standings | head -c 300
echo ""
`;
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log('Result:\n' + out);
      conn.end();
      process.exit(code || 0);
    });
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
}).connect({
  host: '45.32.112.31',
  port: 22,
  username: 'root',
  password: 'sN6,{U@hhw+SuoLU'
});
