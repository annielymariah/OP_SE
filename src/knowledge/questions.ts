import type { AttributeKey } from './attributes';

export interface Question {
  id: number;
  category: string;
  text: string;
  attribute: AttributeKey;
  reversed?: boolean;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Sustentabilidade',
    text: 'Seu personagem deve atuar na linha de frente durante os confrontos?',
    attribute: 'sustainability',
  },
  {
    id: 2,
    category: 'Sustentabilidade',
    text: 'Seu personagem deverá ser o último a cair caso a luta seja muito difícil?',
    attribute: 'sustainability',
  },
  {
    id: 3,
    category: 'Mentalidade',
    text: 'Seu personagem tem costume e não se sente ameaçado mesmo diante de horrores sobrenaturais?',
    attribute: 'mentality',
  },
  {
    id: 4,
    category: 'Mentalidade',
    text: 'Seu personagem deve ser emocionalmente resiliente em situações extremas?',
    attribute: 'mentality',
  },
  {
    id: 5,
    category: 'Perícias',
    text: 'Seu personagem deve ser capaz de resolver problemas por meio de habilidades técnicas?',
    attribute: 'skills',
  },
  {
    id: 6,
    category: 'Perícias',
    text: 'A interpretação e versatilidade em investigações e tarefas complexas é importante para seu personagem?',
    attribute: 'skills',
  },
  {
    id: 7,
    category: 'Dano Físico',
    text: 'Em uma luta, o combate corpo a corpo por meio dos punhos deve ser uma das principais características do seu personagem?',
    attribute: 'pdp',
  },
  {
    id: 8,
    category: 'Dano Físico',
    text: 'Seu personagem gostaria de ser apto em agarrar e imobilizar os inimigos?',
    attribute: 'pdp',
  },
  {
    id: 9,
    category: 'Dano Armado',
    text: 'Seu personagem deve ser altamente eficiente utilizando armas, como pistolas, espadas, porretes, dentre outras?',
    attribute: 'pdw',
  },
  {
    id: 10,
    category: 'Dano Armado',
    text: 'Seu personagem deve depender mais de equipamentos e armamentos do que de poderes sobrenaturais?',
    attribute: 'pdw',
  },
  {
    id: 11,
    category: 'Dano Elemental',
    text: 'Seu personagem deve utilizar poderes paranormais ou ocultistas para poder atacar ou gerar suporte?',
    attribute: 'pde',
  },
  {
    id: 12,
    category: 'Dano Elemental',
    text: 'O uso de rituais e habilidades sobrenaturais e a afinidade com o oculto devem ser características importantes do seu personagem?',
    attribute: 'pde',
  },
  {
    id: 13,
    category: 'Escalabilidade',
    text: 'Seu personagem deve possuir alto potencial de crescimento ao longo da campanha, mesmo que isso signifique ser fraco no início?',
    attribute: 'scalability',
  },
  {
    id: 14,
    category: 'Escalabilidade',
    text: 'Você dependeria dos aliados no começo de sua missão, contanto que no futuro seja capaz de ser mais forte que eles?',
    attribute: 'scalability',
  },
  {
    id: 15,
    category: 'Flexibilidade',
    text: 'Seu personagem deve alternar facilmente entre suporte, combate e investigação?',
    attribute: 'flexibility',
  },
  {
    id: 16,
    category: 'Flexibilidade',
    text: 'Você prefere abdicar de ser o melhor em algum cargo na equipe, em prol de ser capaz de auxiliar em outras áreas, como saber socorrer aliados caídos em combate?',
    attribute: 'flexibility',
  },
];
