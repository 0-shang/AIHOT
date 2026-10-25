import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected. Triggering sync in aihot-api-1...');
  const script = `
docker exec aihot-api-1 node -e "import('@aihot/backend/publication/rockets').then(m => m.triggerRocketsSync()).then(r => console.log('Sync result:', r)).catch(console.error)"
docker exec aihot-api-1 node -e "import('@aihot/backend/publication/rockets').then(m => m.loadRocketsStandings()).then(s => console.log('Standings:', s.entries.length, s.entries.slice(0,5).map(e=>e.name+': '+e.wins+'-'+e.losses))).catch(console.error)"
`;
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log('Output:\n' + out);
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
