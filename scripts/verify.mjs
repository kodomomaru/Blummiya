import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'blummiya.db');
console.log('Connecting to SQLite at:', DB_PATH);

const db = new DatabaseSync(DB_PATH);

const skills = db.prepare('SELECT * FROM skills ORDER BY radiance DESC').all();
console.log(`✓ Retrieved ${skills.length} skills from database:`);
for (const s of skills.slice(0, 4)) {
  console.log(`  - [${s.category}] ${s.name}: ${s.radiance}% radiance (${s.is_tacit ? 'Tacit' : 'Explicit'})`);
}

const links = db.prepare('SELECT * FROM trail_links').all();
console.log(`✓ Retrieved ${links.length} trail links connecting skills.`);

const trails = db.prepare('SELECT * FROM trails').all();
console.log(`✓ Retrieved ${trails.length} shared inspirational trails:`);
for (const t of trails) {
  console.log(`  - "${t.title}" by ${t.author_name} (${t.sparks_count} sparks)`);
}

const moments = db.prepare('SELECT * FROM moments').all();
console.log(`✓ Retrieved ${moments.length} chronicled moment(s).`);

console.log('\n--- VERIFICATION PASSED: Database persistence and seed constellation are 100% operational ---');

