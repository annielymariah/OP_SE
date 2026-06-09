import type { AttributeKey } from './attributes';

export type TrailKey = 'combatente' | 'especialista' | 'ocultista';

export interface Trail {
  key: TrailKey;
  label: string;
  role: string;
  keyAttributes: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  weights: Record<AttributeKey, number>;
}

export const TRAILS: Record<TrailKey, Trail> = {
  combatente: {
    key: 'combatente',
    label: 'COMBATENTE',
    role: 'Tank / DPS corpo a corpo',
    keyAttributes: 'FOR e VIG',
    description:
      'O guerreiro da equipe. Robusto, resistente e letal no combate direto. Forte desde o início, mas com menor versatilidade fora do front.',
    strengths: [
      'Maior sustentabilidade e resistência física',
      'Melhor potencial de dano físico e armado',
      'Confiável desde os primeiros níveis',
    ],
    weaknesses: [
      'Baixa resistência a efeitos paranormais',
      'Poucas opções fora do combate',
      'Menor escalabilidade no late game',
    ],
    weights: {
      sustainability: 1,
      mentality: -1,
      skills: -1,
      pdp: 1,
      pdw: 1,
      pde: 0,
      scalability: 0,
      flexibility: 0,
    },
  },

  especialista: {
    key: 'especialista',
    label: 'ESPECIALISTA',
    role: 'Suporte / Investigador / DPS à distância',
    keyAttributes: 'INT e AGI',
    description:
      'O coringa da equipe. Versátil, interpretativo e eficaz em perícias e investigação. Equilibrado entre combate à distância, furtividade, suporte e utilidade. Escala bem e se adapta a qualquer composição de grupo.',
    strengths: [
      'Melhor flexibilidade e versatilidade',
      'Melhor em perícias e testes de investigação',
      'Boa escalabilidade no mid/late game',
    ],
    weaknesses: [
      'Baixa sustentabilidade (frágil no front)',
      'Dano físico e elemental medianos',
    ],
    weights: {
      sustainability: 0,
      mentality: 0,
      skills: 1,
      pdp: 0,
      pdw: 1,
      pde: 0,
      scalability: -1,
      flexibility: 1,
    },
  },

  ocultista: {
    key: 'ocultista',
    label: 'OCULTISTA',
    role: 'Mago / Controlador / DPS elemental',
    keyAttributes: 'PRE e INT',
    description:
      'O estudioso do Outro Lado. Frágil no início, mas devastador no late game. Domina rituais e elementos paranormais para atacar, defender e controlar o campo de batalha.',
    strengths: [
      'Maior potencial de dano elemental',
      'Melhor escalabilidade no late game',
      'Alta resistência mental e sanidade',
    ],
    weaknesses: [
      'Baixa sustentabilidade física',
      'Fraco em dano físico e armado',
      'Dependente de evolução para atingir seu potencial',
    ],
    weights: {
      sustainability: -1,
      mentality: 1,
      skills: 0,
      pdp: -1,
      pdw: 0,
      pde: 1,
      scalability: 1,
      flexibility: 1,
    },
  },
};

export const TRAIL_KEYS: TrailKey[] = ['combatente', 'especialista', 'ocultista'];
