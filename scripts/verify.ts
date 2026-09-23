import { getDb } from '../src/lib/db.ts';
import { extractHiddenSkills } from '../src/lib/skills/extractor.ts';

console.log('--- Testing Blummiya Backend & Extraction Engine ---');

// 1. Verify DB initialization & seeding
const db = getDb();
const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number };
const linkCount = db.prepare('SELECT COUNT(*) as count FROM trail_links').get() as { count: number };
const trailCount = db.prepare('SELECT COUNT(*) as count FROM trails').get() as { count: number };

console.log(`✓ Database initialized: ${skillCount.count} skills, ${linkCount.count} trail links, ${trailCount.count} shared trails.`);

// 2. Verify Hidden Skill Extraction for a complex real-world moment
const testMoment = {
  title: 'Calmed heated disagreement during cross-functional roadmapping session',
  narrative: 'Two leads were arguing over roadmap priorities. Rather than shutting them down, I created a safe space, listened to the underlying anxieties of each team, and reframed the problem as a shared dependency.',
  context: 'work' as const,
  impact: 'Both teams agreed to a phased rollout without lingering bitterness.',
};

const analysis = extractHiddenSkills(testMoment);

console.log(`✓ Skill Extraction Analysis:`);
console.log(`  - Primary Revealed Skills: ${analysis.skills.map(s => `${s.name} (${s.category}, tacit: ${s.isTacit})`).join(', ')}`);
console.log(`  - Growth Revelation: "${analysis.revelation}"`);
console.log(`  - Suggested Interconnections: ${analysis.suggestedConnections.length} connection(s)`);

if (analysis.skills.length === 0) {
  throw new Error('Expected at least 1 extracted skill');
}

console.log('✓ All verification tests passed successfully!');

