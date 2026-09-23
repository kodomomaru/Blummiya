import { BASELINE_TAXONOMY, SkillDefinition, SkillCategory } from './taxonomy';

export interface ExtractedSkillResult {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  isTacit: boolean;
  contribution: string;
  radianceBoost: number;
}

export interface ExtractionAnalysis {
  skills: ExtractedSkillResult[];
  revelation: string; // The "hidden skill revelation" narrative
  suggestedConnections: { sourceId: string; targetId: string }[];
}

export function extractHiddenSkills(input: {
  title: string;
  narrative: string;
  context: 'work' | 'life' | 'craft' | 'community';
  impact?: string;
}): ExtractionAnalysis {
  const combinedText = `${input.title} ${input.narrative} ${input.impact || ''}`.toLowerCase();
  const matchedSkills: ExtractedSkillResult[] = [];

  // Match against our deep taxonomy using semantic keyword proximity and weighting
  for (const def of BASELINE_TAXONOMY) {
    let score = 0;
    const matchedWords: string[] = [];

    for (const kw of def.keywords) {
      if (combinedText.includes(kw.toLowerCase())) {
        score += 1;
        matchedWords.push(kw);
      }
    }

    if (score > 0) {
      const radianceBoost = Math.min(25, Math.round((10 + score * 4) * def.radianceFactor));
      matchedSkills.push({
        id: def.id,
        name: def.name,
        category: def.category,
        description: def.description,
        isTacit: def.isTacit,
        contribution: `Honed through: "${input.title}". Surfaced via actions involving ${matchedWords.slice(0, 3).join(', ')}.`,
        radianceBoost,
      });
    }
  }

  // Sort by highest relevance score / radiance boost
  matchedSkills.sort((a, b) => b.radianceBoost - a.radianceBoost);

  // If no taxonomy skills matched strongly, dynamically infer a tacit skill from context!
  if (matchedSkills.length === 0) {
    const fallbackSkill = inferNovelTacitSkill(input);
    matchedSkills.push(fallbackSkill);
  }

  // Cap at top 3-4 most distinct skills to keep the constellation meaningful rather than cluttered
  const topSkills = matchedSkills.slice(0, 3);

  // Generate the "Growth Revelation"
  const revelation = generateGrowthRevelation(input, topSkills);

  // Compute connections between the activated skills
  const suggestedConnections: { sourceId: string; targetId: string }[] = [];
  for (let i = 0; i < topSkills.length; i++) {
    for (let j = i + 1; j < topSkills.length; j++) {
      suggestedConnections.push({
        sourceId: topSkills[i].id,
        targetId: topSkills[j].id,
      });
    }
  }

  return {
    skills: topSkills,
    revelation,
    suggestedConnections,
  };
}

function inferNovelTacitSkill(input: {
  title: string;
  narrative: string;
  context: 'work' | 'life' | 'craft' | 'community';
}): ExtractedSkillResult {
  const contextMap: Record<string, { name: string; category: SkillCategory; desc: string }> = {
    work: {
      name: 'Adaptive Operational Agility',
      category: 'craft',
      desc: 'Seamlessly improvising workflows when standard protocols are ill-suited.',
    },
    life: {
      name: 'Everyday Equanimity',
      category: 'inner',
      desc: 'Infusing mindful intention and patience into ordinary domestic moments.',
    },
    craft: {
      name: 'Creative Persistence',
      category: 'cognitive',
      desc: 'Iterating past the messy middle of an unsolved creative endeavor.',
    },
    community: {
      name: 'Communal Weaving',
      category: 'human',
      desc: 'Building belonging and mutual care across loose social fabrics.',
    },
  };

  const template = contextMap[input.context] || contextMap.work;
  const slug = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: slug,
    name: template.name,
    category: template.category,
    description: template.desc,
    isTacit: true,
    contribution: `Revealed from everyday experience: "${input.title}".`,
    radianceBoost: 18,
  };
}

function generateGrowthRevelation(
  input: { title: string; context: string },
  skills: ExtractedSkillResult[]
): string {
  const tacitCount = skills.filter((s) => s.isTacit).length;
  const skillNames = skills.map((s) => s.name).join(' and ');

  if (tacitCount >= 2) {
    return `Most resumes would reduce this moment to a flat line item. Blummiya revealed that beneath the surface, your response deepened ${skillNames}—the rare, unteachable instincts that anchor high-trust collaborators.`;
  } else if (tacitCount === 1) {
    return `While this seemed like a standard ${input.context} task, your action ignited a hidden bloom of ${skillNames}, strengthening the quiet undercurrents of your mastery.`;
  } else {
    return `Every action leaves a ring of growth. By navigating "${input.title}", you channeled focused tactical craftsmanship in ${skillNames}, adding radiant clarity to your pathway.`;
  }
}

