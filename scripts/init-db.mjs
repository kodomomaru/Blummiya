import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'blummiya.db');
console.log('Initializing Blummiya SQLite Database at:', DB_PATH);

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('craft', 'human', 'cognitive', 'inner')),
    description TEXT NOT NULL,
    is_tacit INTEGER NOT NULL DEFAULT 0,
    radiance REAL NOT NULL DEFAULT 10,
    moments_count INTEGER NOT NULL DEFAULT 0,
    x REAL NOT NULL,
    y REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS moments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    narrative TEXT NOT NULL,
    context TEXT NOT NULL CHECK (context IN ('work', 'life', 'craft', 'community')),
    impact TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS moment_skills (
    moment_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    contribution TEXT NOT NULL,
    PRIMARY KEY (moment_id, skill_id),
    FOREIGN KEY (moment_id) REFERENCES moments(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trail_links (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    strength REAL NOT NULL DEFAULT 1,
    FOREIGN KEY (source_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES skills(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trails (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    description TEXT NOT NULL,
    skill_ids TEXT NOT NULL,
    is_shared INTEGER NOT NULL DEFAULT 1,
    sparks_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

const now = new Date().toISOString();

const seedSkills = [
  {
    id: 'conflict-mediation',
    name: 'Conflict Mediation',
    category: 'human',
    description: 'Bridging opposing viewpoints to discover common ground without forced compromises.',
    is_tacit: 1,
    radiance: 45,
    moments_count: 2,
    x: 320,
    y: 280,
  },
  {
    id: 'systems-synthesis',
    name: 'Systems Synthesis',
    category: 'cognitive',
    description: 'Connecting isolated events and subtle feedback loops into a unified, holistic mental model.',
    is_tacit: 1,
    radiance: 60,
    moments_count: 3,
    x: 480,
    y: 210,
  },
  {
    id: 'crisis-composure',
    name: 'Crisis Composure',
    category: 'inner',
    description: 'Maintaining clear, rational groundedness when unexpected emergencies disrupt routine.',
    is_tacit: 1,
    radiance: 75,
    moments_count: 4,
    x: 410,
    y: 390,
  },
  {
    id: 'root-cause-intuition',
    name: 'Root Cause Intuition',
    category: 'craft',
    description: 'Sensing structural defects beneath surface bugs through accumulated tactile experience.',
    is_tacit: 1,
    radiance: 55,
    moments_count: 3,
    x: 620,
    y: 310,
  },
  {
    id: 'empathic-listening',
    name: 'Empathic Attunement',
    category: 'human',
    description: 'Hearing unspoken anxieties and aspirations hidden beneath surface conversation.',
    is_tacit: 1,
    radiance: 35,
    moments_count: 1,
    x: 230,
    y: 390,
  },
  {
    id: 'graceful-refactoring',
    name: 'Graceful Iteration',
    category: 'craft',
    description: 'Transforming legacy structures incrementally while preserving stability and flow.',
    is_tacit: 0,
    radiance: 65,
    moments_count: 3,
    x: 690,
    y: 430,
  },
  {
    id: 'unprompted-mentorship',
    name: 'Unprompted Mentorship',
    category: 'human',
    description: 'Nurturing peers through timely, gentle guidance without creating dependency.',
    is_tacit: 1,
    radiance: 40,
    moments_count: 2,
    x: 290,
    y: 500,
  },
  {
    id: 'prioritization-triage',
    name: 'Essential Triage',
    category: 'cognitive',
    description: 'Ruthlessly identifying the single domino that unlocks momentum amidst high noise.',
    is_tacit: 0,
    radiance: 50,
    moments_count: 2,
    x: 520,
    y: 490,
  },
];

const insertSkill = db.prepare(`
  INSERT OR REPLACE INTO skills (id, name, category, description, is_tacit, radiance, moments_count, x, y, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of seedSkills) {
  insertSkill.run(s.id, s.name, s.category, s.description, s.is_tacit, s.radiance, s.moments_count, s.x, s.y, now, now);
}

const links = [
  { id: 'link-1', source_id: 'conflict-mediation', target_id: 'empathic-listening', strength: 2 },
  { id: 'link-2', source_id: 'conflict-mediation', target_id: 'crisis-composure', strength: 3 },
  { id: 'link-3', source_id: 'crisis-composure', target_id: 'systems-synthesis', strength: 2 },
  { id: 'link-4', source_id: 'systems-synthesis', target_id: 'root-cause-intuition', strength: 3 },
  { id: 'link-5', source_id: 'root-cause-intuition', target_id: 'graceful-refactoring', strength: 2 },
  { id: 'link-6', source_id: 'crisis-composure', target_id: 'prioritization-triage', strength: 2 },
  { id: 'link-7', source_id: 'empathic-listening', target_id: 'unprompted-mentorship', strength: 2 },
];

const insertLink = db.prepare(`
  INSERT OR REPLACE INTO trail_links (id, source_id, target_id, strength)
  VALUES (?, ?, ?, ?)
`);

for (const l of links) {
  insertLink.run(l.id, l.source_id, l.target_id, l.strength);
}

const insertMoment = db.prepare(`
  INSERT OR REPLACE INTO moments (id, title, narrative, context, impact, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertMoment.run(
  'moment-seed-1',
  'Navigated high-severity production outage during cross-functional review',
  'During our release demo, our main worker cluster stopped processing. Rather than pointing fingers or panicking, I stabilized communications, isolated the culprit query, and coached a junior engineer through the hotfix.',
  'work',
  'Restored uptime in 14 minutes, team felt protected rather than blamed.',
  now
);

const insertMomentSkill = db.prepare(`
  INSERT OR REPLACE INTO moment_skills (moment_id, skill_id, contribution)
  VALUES (?, ?, ?)
`);

insertMomentSkill.run('moment-seed-1', 'crisis-composure', 'Maintained calm and grounded team focus while customer alarms fired.');
insertMomentSkill.run('moment-seed-1', 'root-cause-intuition', 'Traced query lock cascade within 3 minutes without exhaustive log hunting.');
insertMomentSkill.run('moment-seed-1', 'unprompted-mentorship', 'Guided junior colleague to deploy the fix to cement their confidence.');

const insertTrail = db.prepare(`
  INSERT OR REPLACE INTO trails (id, title, author_name, description, skill_ids, is_shared, sparks_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTrail.run(
  'trail-crisis-commander',
  'The Calm in the Storm: From Panic to Poise',
  'Elena Rostova (Staff SRE)',
  'A journey of turning high-stakes operational friction into deep emotional composure, empathetic team leadership, and tactical clarity.',
  JSON.stringify(['crisis-composure', 'conflict-mediation', 'root-cause-intuition', 'unprompted-mentorship']),
  1,
  42,
  now
);

insertTrail.run(
  'trail-architect-craft',
  'The Living Craft: Evolutionary Systems Design',
  'Marcus Thorne (Principal Architect)',
  'How everyday refactorings and subtle architectural listening grow into effortless systems intuition.',
  JSON.stringify(['systems-synthesis', 'root-cause-intuition', 'graceful-refactoring', 'prioritization-triage']),
  1,
  38,
  now
);

console.log('✓ Database initialization and initial pathway seed complete!');

