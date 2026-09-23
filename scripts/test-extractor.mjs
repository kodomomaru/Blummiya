// Test taxonomy & extraction patterns
const BASELINE_TAXONOMY = [
  {
    id: 'conflict-mediation',
    name: 'Conflict Mediation',
    category: 'human',
    isTacit: true,
    keywords: ['conflict', 'tension', 'disagree', 'arguing', 'friction', 'mediation', 'aligned', 'compromise', 'blameless'],
    radianceFactor: 1.2,
  },
  {
    id: 'empathic-listening',
    name: 'Empathic Attunement',
    category: 'human',
    isTacit: true,
    keywords: ['listened', 'empathy', 'venting', 'understood', 'perspective', 'heard', 'feel', 'anxiety', 'unspoken'],
    radianceFactor: 1.1,
  },
  {
    id: 'unprompted-mentorship',
    name: 'Unprompted Mentorship',
    category: 'human',
    isTacit: true,
    keywords: ['mentor', 'taught', 'coached', 'junior', 'helped', 'guided', 'empowered', 'onboarded', 'explained'],
    radianceFactor: 1.3,
  },
  {
    id: 'psychological-safety',
    name: 'Psychological Safety Stewardship',
    category: 'human',
    isTacit: true,
    keywords: ['safe', 'vulnerability', 'mistake', 'blameless', 'encouraged', 'openness', 'inclusion', 'retrospective'],
    radianceFactor: 1.4,
  },
  {
    id: 'systems-synthesis',
    name: 'Systems Synthesis',
    category: 'cognitive',
    isTacit: true,
    keywords: ['system', 'architecture', 'connected', 'patterns', 'synthesis', 'dependencies', 'feedback loop', 'big picture'],
    radianceFactor: 1.3,
  },
  {
    id: 'root-cause-intuition',
    name: 'Root Cause Intuition',
    category: 'craft',
    isTacit: true,
    keywords: ['debug', 'culprit', 'outage', 'root cause', 'investigated', 'bottleneck', 'isolated', 'intuition', 'diagnosed'],
    radianceFactor: 1.3,
  },
  {
    id: 'crisis-composure',
    name: 'Crisis Composure',
    category: 'inner',
    isTacit: true,
    keywords: ['calm', 'composure', 'panic', 'stress', 'crisis', 'emergency', 'firefight', 'steadiness', 'grounded'],
    radianceFactor: 1.4,
  },
];

function extractHiddenSkills(input) {
  const text = `${input.title} ${input.narrative} ${input.impact || ''}`.toLowerCase();
  const matched = [];

  for (const def of BASELINE_TAXONOMY) {
    let score = 0;
    for (const kw of def.keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > 0) {
      const boost = Math.min(25, Math.round((10 + score * 4) * def.radianceFactor));
      matched.push({ name: def.name, category: def.category, isTacit: def.isTacit, boost });
    }
  }

  return matched.sort((a, b) => b.boost - a.boost).slice(0, 3);
}

console.log('--- Testing Hidden Skill Extraction Cases ---');

// Test Case 1: Human / Soft Skill moment
const case1 = {
  title: 'Navigated tense disagreement during retrospective without finger-pointing',
  narrative: 'Two team members were arguing fiercely about who missed a deadline. I stepped in, created a blameless atmosphere, listened to both underlying frustrations, and guided them to align on workflow improvements.',
  context: 'work',
};
const res1 = extractHiddenSkills(case1);
console.log('\nCase 1 (Human Dynamics / Friction):');
console.log('Detected blooms:', res1.map(s => `${s.name} (+${s.boost}% radiance)`));
if (!res1.some(s => s.name === 'Conflict Mediation' || s.name === 'Psychological Safety Stewardship')) {
  throw new Error('Case 1 failed to detect mediation/safety');
}

// Test Case 2: Deep Technical / Outage moment
const case2 = {
  title: 'Resolved silent memory leak cascading in production during peak traffic',
  narrative: 'Server memory spiked to 98%. While the team feared panic, I stayed calm, isolated the culprit worker thread, and diagnosed a cyclic reference in our caching layer.',
  context: 'work',
};
const res2 = extractHiddenSkills(case2);
console.log('\nCase 2 (Craft & Crisis Composure):');
console.log('Detected blooms:', res2.map(s => `${s.name} (+${s.boost}% radiance)`));
if (!res2.some(s => s.name === 'Crisis Composure' || s.name === 'Root Cause Intuition')) {
  throw new Error('Case 2 failed to detect composure/root-cause');
}

// Test Case 3: Everyday Life / Mentorship
const case3 = {
  title: 'Taught a neighbor how to bake sourdough and stay patient through failures',
  narrative: 'Helped them understand how ambient temperature shifts yeast activity. When their first loaf collapsed, I coached them through the mistake and guided their shaping technique.',
  context: 'life',
};
const res3 = extractHiddenSkills(case3);
console.log('\nCase 3 (Life / Mentorship):');
console.log('Detected blooms:', res3.map(s => `${s.name} (+${s.boost}% radiance)`));
if (!res3.some(s => s.name === 'Unprompted Mentorship')) {
  throw new Error('Case 3 failed to detect mentorship');
}

console.log('\n✓ ALL 3 EXTRACTION TEST CASES PASSED WITH HIGH FIDELITY!');

