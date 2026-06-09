export type AttributeKey =
  | 'sustainability'
  | 'mentality'
  | 'skills'
  | 'pdp'
  | 'pdw'
  | 'pde'
  | 'scalability'
  | 'flexibility';

export interface Attribute {
  key: AttributeKey;
  label: string;
  description: string;
}

export const ATTRIBUTES: Record<AttributeKey, Attribute> = {
  sustainability: {
    key: 'sustainability',
    label: 'Sustentabilidade',
    description: 'Resistência física e vitalidade do personagem em campo',
  },
  mentality: {
    key: 'mentality',
    label: 'Mentalidade',
    description: 'Resistência mental e emocional diante de eventos sobrenaturais',
  },
  skills: {
    key: 'skills',
    label: 'Perícias',
    description: 'Conhecimento técnico e aptidão em diferentes áreas de atuação',
  },
  pdp: {
    key: 'pdp',
    label: 'Pot. Dano Físico',
    description: 'Capacidade de causar dano por ataques desarmados e força física',
  },
  pdw: {
    key: 'pdw',
    label: 'Pot. Dano Armado',
    description: 'Capacidade de causar dano utilizando armas (cortantes, perfurantes, contundentes)',
  },
  pde: {
    key: 'pde',
    label: 'Pot. Dano Elemental',
    description: 'Capacidade de manipular e causar dano via elementos ocultistas',
  },
  scalability: {
    key: 'scalability',
    label: 'Escalabilidade',
    description: 'Potencial de progressão e desenvolvimento do personagem ao longo da missão',
  },
  flexibility: {
    key: 'flexibility',
    label: 'Flexibilidade',
    description: 'Versatilidade para desempenhar diferentes funções em situações distintas',
  },
};
