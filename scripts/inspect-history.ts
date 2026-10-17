import { execSync } from 'child_process';

const log = execSync('git log --format="%ad|%h|%s" --date=iso-strict --author="0-shang"', { encoding: 'utf-8' });
const lines = log.trim().split('\n').filter(Boolean);

const dateGroups: Record<string, { count: number; commits: string[] }> = {};

for (const line of lines) {
  const [dateStr, hash, ...rest] = line.split('|');
  const subject = rest.join('|');
  const day = dateStr.slice(0, 10);
  if (!dateGroups[day]) {
    dateGroups[day] = { count: 0, commits: [] };
  }
  dateGroups[day].count++;
  dateGroups[day].commits.push(subject);
}

console.log('--- COMMIT STATS BY DAY ---');
const sortedDays = Object.keys(dateGroups).sort();
for (const day of sortedDays) {
  console.log(`${day}: ${dateGroups[day].count} commits`);
}
console.log('Earliest day:', sortedDays[0]);
console.log('Latest day:', sortedDays[sortedDays.length - 1]);
console.log('Total commits:', lines.length);
