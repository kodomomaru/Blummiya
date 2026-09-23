export type SkillCategory = 'craft' | 'human' | 'cognitive' | 'inner';

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  isTacit: boolean;
  keywords: string[];
  radianceFactor: number;
}

export const SKILL_CATEGORIES: Record<
  SkillCategory,
  { label: string; color: string; glowClass: string; borderClass: string; bgClass: string; description: string }
> = {
  human: {
    label: 'Human Dynamics & Fellowship',
    color: '#06b6d4', // Cyan
    glowClass: 'shadow-glow-cyan',
    borderClass: 'border-cyan-500/40',
    bgClass: 'bg-cyan-500/10 text-cyan-300',
    description: 'Empathetic connection, psychological safety, quiet mediation, and unprompted mentorship.',
  },
  cognitive: {
    label: 'Cognitive Strategy & Synthesis',
    color: '#a855f7', // Violet
    glowClass: 'shadow-glow-violet',
    borderClass: 'border-purple-500/40',
    bgClass: 'bg-purple-500/10 text-purple-300',
    description: 'Seeing interconnected feedback loops, navigating ambiguity, and essential triage.',
  },
  craft: {
    label: 'Craft & Tactical Mastery',
    color: '#10b981', // Emerald
    glowClass: 'shadow-glow-sm',
    borderClass: 'border-emerald-500/40',
    bgClass: 'bg-emerald-500/10 text-emerald-300',
    description: 'Tactile fluency, root-cause intuition, architectural beauty, and graceful refactoring.',
  },
  inner: {
    label: 'Inner Mastery & Groundedness',
    color: '#f59e0b', // Amber
    glowClass: 'shadow-glow-amber',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-500/10 text-amber-300',
    description: 'Poise in the storm, psychological resilience, intentional reflection, and patience.',
  },
};

export const BASELINE_TAXONOMY: SkillDefinition[] = [
  // Human Dynamics
  {
    id: 'conflict-mediation',
    name: 'Conflict Mediation',
    category: 'human',
    description: 'Transforming tension into constructive alignment without forcing false harmony.',
    isTacit: true,
    keywords: ['conflict', 'tension', 'disagree', 'arguing', 'friction', 'mediation', 'aligned', 'compromise', 'blameless'],
    radianceFactor: 1.2,
  },
  {
    id: 'empathic-listening',
    name: 'Empathic Attunement',
    category: 'human',
    description: 'Listening for unspoken feelings and subtext beneath surface dialogue.',
    isTacit: true,
    keywords: ['listened', 'empathy', 'venting', 'understood', 'perspective', 'heard', 'feel', 'anxiety', 'unspoken'],
    radianceFactor: 1.1,
  },
  {
    id: 'unprompted-mentorship',
    name: 'Unprompted Mentorship',
    category: 'human',
    description: 'Lifting peers up through just-in-time guidance and empowering their independence.',
    isTacit: true,
    keywords: ['mentor', 'taught', 'coached', 'junior', 'helped', 'guided', 'empowered', 'onboarded', 'explained'],
    radianceFactor: 1.3,
  },
  {
    id: 'psychological-safety',
    name: 'Psychological Safety Stewardship',
    category: 'human',
    description: 'Cultivating environments where vulnerability, mistakes, and novel ideas are welcomed.',
    isTacit: true,
    keywords: ['safe', 'vulnerability', 'mistake', 'blameless', 'encouraged', 'openness', 'inclusion', 'retrospective'],
    radianceFactor: 1.4,
  },

  // Cognitive Strategy
  {
    id: 'systems-synthesis',
    name: 'Systems Synthesis',
    category: 'cognitive',
    description: 'Connecting scattered signals into an elegant, coherent mental architecture.',
    isTacit: true,
    keywords: ['system', 'architecture', 'connected', 'patterns', 'synthesis', 'dependencies', 'feedback loop', 'big picture'],
    radianceFactor: 1.3,
  },
  {
    id: 'prioritization-triage',
    name: 'Essential Triage',
    category: 'cognitive',
    description: 'Ruthlessly cutting through cognitive overload to illuminate the single pivotal move.',
    isTacit: false,
    keywords: ['prioritize', 'triage', 'cutoff', 'focus', 'simplify', 'tradeoff', 'crucial', 'urgency', 'noise'],
    radianceFactor: 1.1,
  },
  {
    id: 'second-order-thinking',
    name: 'Second-Order Forecasting',
    category: 'cognitive',
    description: 'Anticipating ripple effects and unintended consequences before decisions materialize.',
    isTacit: true,
    keywords: ['future', 'consequence', 'unintended', 'ripple', 'anticipate', 'long term', 'downstream', 'prevented'],
    radianceFactor: 1.4,
  },
  {
    id: 'lateral-inquiry',
    name: 'Lateral Problem Solving',
    category: 'cognitive',
    description: 'Unlocking stubborn impasses through unconventional angles and creative analogy.',
    isTacit: true,
    keywords: ['creative', 'unconventional', 'novel', 'analogy', 'workaround', 'clever', 'reframe', 'lateral'],
    radianceFactor: 1.2,
  },

  // Craft & Tactical Mastery
  {
    id: 'root-cause-intuition',
    name: 'Root Cause Intuition',
    category: 'craft',
    description: 'Zeroing in on foundational faults using tactile muscle memory rather than surface trial-and-error.',
    isTacit: true,
    keywords: ['debug', 'culprit', 'outage', 'root cause', 'investigated', 'bottleneck', 'isolated', 'intuition', 'diagnosed'],
    radianceFactor: 1.3,
  },
  {
    id: 'graceful-refactoring',
    name: 'Graceful Iteration',
    category: 'craft',
    description: 'Evolving brittle foundations incrementally without breaking rhythm or user trust.',
    isTacit: false,
    keywords: ['refactor', 'clean', 'modular', 'rewrote', 'simplified', 'rearchitect', 'tested', 'stability', 'debt'],
    radianceFactor: 1.2,
  },
  {
    id: 'tactile-craftsmanship',
    name: 'Tactile Craftsmanship',
    category: 'craft',
    description: 'Polishing interactions and artifacts to an effortless, delightful standard of finish.',
    isTacit: false,
    keywords: ['polish', 'craft', 'detail', 'quality', 'responsive', 'smooth', 'typography', 'delight', 'finish'],
    radianceFactor: 1.1,
  },

  // Inner Mastery & Groundedness
  {
    id: 'crisis-composure',
    name: 'Crisis Composure',
    category: 'inner',
    description: 'Channeling high-stress turbulence into calm, focused, and reassuring momentum.',
    isTacit: true,
    keywords: ['calm', 'composure', 'panic', 'stress', 'crisis', 'emergency', 'firefight', 'steadiness', 'grounded'],
    radianceFactor: 1.4,
  },
  {
    id: 'reflective-awareness',
    name: 'Reflective Self-Awareness',
    category: 'inner',
    description: 'Honest evaluation of one’s own triggers, blind spots, and growth plateaus.',
    isTacit: true,
    keywords: ['reflected', 'learned', 'mistake', 'humility', 'blind spot', 'admitted', 'realized', 'growth', 'journal'],
    radianceFactor: 1.2,
  },
  {
    id: 'sustainable-pace',
    name: 'Sustainable Rhythm',
    category: 'inner',
    description: 'Balancing intense bursts of output with vital recovery to prevent burn-out.',
    isTacit: true,
    keywords: ['boundary', 'burnout', 'pacing', 'rest', 'sustainable', 'recovery', 'recharge', 'marathon'],
    radianceFactor: 1.3,
  },
];

