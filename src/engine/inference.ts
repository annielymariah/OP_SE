import type { AttributeKey } from '../knowledge/attributes';
import { QUESTIONS } from '../knowledge/questions';
import { TRAILS, type TrailKey, TRAIL_KEYS } from '../knowledge/trails';

export type AttributeScores = Record<AttributeKey, number>;

export interface TrailResult {
  key: TrailKey;
  label: string;
  score: number;
  compatibility: number;
}

export interface InferenceResult {
  attributeScores: AttributeScores;
  trailResults: TrailResult[];
  recommended: TrailResult;
  firedRules: string[];
}

type BonusRule = {
  description: string;
  condition: (attrs: AttributeScores) => boolean;
  effect: (scores: Record<TrailKey, number>) => void;
};

export const BONUS_RULES: BonusRule[] = [
  {
    description:
      'SE Sustentabilidade = 2 E Pot. Dano Fisico = 2 ENTAO Combatente +2 (perfil tanque puro)',
    condition: (a) => a.sustainability === 2 && a.pdp === 2,
    effect: (s) => { s.combatente += 2; },
  },
  {
    description:
      'SE Pericias = 2 E Flexibilidade = 2 ENTAO Especialista +2 (perfil coringa investigador)',
    condition: (a) => a.skills === 2 && a.flexibility === 2,
    effect: (s) => { s.especialista += 2; },
  },
  {
    description:
      'SE Pot. Dano Elemental = 2 E Escalabilidade >= 1 ENTAO Ocultista +2 (perfil ritualista)',
    condition: (a) => a.pde === 2 && a.scalability >= 1,
    effect: (s) => { s.ocultista += 2; },
  },
  {
    description:
      'SE Mentalidade >= 1 E Pot. Dano Elemental >= 1 ENTAO Ocultista +1 (afinidade paranormal)',
    condition: (a) => a.mentality >= 1 && a.pde >= 1,
    effect: (s) => { s.ocultista += 1; },
  },
  {
    description:
      'SE Flexibilidade >= 1 E Pericias >= 1 E Pot. Dano Armado >= 1 ENTAO Especialista +1 (atirador tatico)',
    condition: (a) => a.flexibility >= 1 && a.skills >= 1 && a.pdw >= 1,
    effect: (s) => { s.especialista += 1; },
  },
];

function initAttributeScores(): AttributeScores {
  return {
    sustainability: 0,
    mentality: 0,
    skills: 0,
    pdp: 0,
    pdw: 0,
    pde: 0,
    scalability: 0,
    flexibility: 0,
  };
}

function initTrailScores(): Record<TrailKey, number> {
  return { combatente: 0, especialista: 0, ocultista: 0 };
}

export function runInference(answers: Map<number, boolean>): InferenceResult {
  const attributeScores = initAttributeScores();
  const trailScores = initTrailScores();

  for (const question of QUESTIONS) {
    const answer = answers.get(question.id) ?? false;
    const activates = question.reversed ? !answer : answer;

    if (activates) {
      attributeScores[question.attribute] += 1;
    }
  }

  for (const attrKey of Object.keys(attributeScores) as AttributeKey[]) {
    const attrScore = attributeScores[attrKey];
    if (attrScore === 0) continue;

    for (const trailKey of TRAIL_KEYS) {
      const weight = TRAILS[trailKey].weights[attrKey];
      trailScores[trailKey] += attrScore * weight;
    }
  }

  const firedRules: string[] = [];
  for (const rule of BONUS_RULES) {
    if (rule.condition(attributeScores)) {
      rule.effect(trailScores);
      firedRules.push(rule.description);
    }
  }

  const scores = Object.values(trailScores);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore || 1;

  const trailResults: TrailResult[] = TRAIL_KEYS.map((key: TrailKey) => {
    const raw = trailScores[key];
    const normalized = ((raw - minScore) / range) * 28 + 60;
    return {
      key,
      label: TRAILS[key].label,
      score: raw,
      compatibility: parseFloat(normalized.toFixed(1)),
    };
  });

  trailResults.sort((a, b) => b.compatibility - a.compatibility);

  return {
    attributeScores,
    trailResults,
    recommended: trailResults[0]!,
    firedRules,
  };
}
