import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  const query = `
    import { sql, closeDb } from './packages/backend/src/db.js';
    async function run() {
      const arts = await sql\`SELECT id, title, published_at FROM articles WHERE title ILIKE '%Fertitta%'\`;
      console.log('Articles:', arts);
      if (arts.length > 0) {
        for (const a of arts) {
          const pubs = await sql\`SELECT article_id, title, visibility, eligible, category, summary, original_title FROM publications WHERE article_id = \${a.id}\`;
          console.log('Pub for ' + a.id + ':', pubs);
        }
      }
      await closeDb();
    }
    run().catch(console.error);
  `;
  const remoteCmd = `docker exec aihot-api-1 node -e "${query.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
  conn.exec(remoteCmd, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d).on('close', () => {
      console.log('VPS Result:\n' + out);
      conn.end();
    });
  });
}).connect({ host: '45.32.112.31', port: 22, username: 'root', password: 'sN6,{U@hhw+SuoLU' });
