// Check if recent SportsTalk 790 episodes contain Rockets mentions in their transcripts
async function test() {
  const res = await fetch('https://www.spreaker.com/show/3442316/episodes/feed');
  const xml = await res.text();
  const items = xml.split('<item>').slice(1);
  
  const rocketsKeywords = /\b(rockets|houston rockets|clutch city|toyota center|udoka|ime udoka|sengun|alperen|jalen green|amen thompson|reed sheppard|vanvleet|fred vanvleet|durant|kevin durant|jabari smith|tari eason|cam whitmore|steven adams|rafael stone|nba|preseason|training camp|media day)\b/i;
  
  // Check the first 10 episodes
  for (let i = 0; i < Math.min(10, items.length); i++) {
    const titleMatch = items[i].match(/<title>(.*?)<\/title>/);
    const dateMatch = items[i].match(/<pubDate>(.*?)<\/pubDate>/);
    const transcriptMatch = items[i].match(/<podcast:transcript url="([^"]+)" type="text\/plain"/);
    const title = titleMatch ? titleMatch[1] : 'N/A';
    const date = dateMatch ? dateMatch[1] : 'N/A';
    
    console.log((i+1) + '. [' + date.substring(0, 16) + '] ' + title);
    
    if (transcriptMatch) {
      try {
        const tres = await fetch(transcriptMatch[1]);
        const transcript = await tres.text();
        const lines = transcript.split('\n');
        console.log('   Transcript: ' + lines.length + ' lines, ' + transcript.length + ' chars');
        
        // Check for Rockets mentions
        const mentionsRockets = rocketsKeywords.test(transcript);
        if (mentionsRockets) {
          // Find the rocket-related lines
          const rocketLines = lines.filter(l => rocketsKeywords.test(l)).slice(0, 3);
          console.log('   ✅ Contains Rockets content!');
          for (const l of rocketLines) {
            console.log('     > ' + l.substring(0, 120));
          }
        } else {
          console.log('   ⚪ No Rockets content in transcript');
        }
      } catch (e) {
        console.log('   ❌ Could not fetch transcript');
      }
    } else {
      console.log('   No transcript URL found');
    }
    console.log('');
  }
}
test().catch(console.error);
