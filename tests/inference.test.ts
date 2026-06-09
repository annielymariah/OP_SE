import { describe, it, expect } from 'vitest';
import { runInference, BONUS_RULES } from '../src/engine/inference';

function makeAnswers(yesIds: number[]): Map<number, boolean> {
  const map = new Map<number, boolean>();
  for (let i = 1; i <= 16; i++) {
    map.set(i, yesIds.includes(i));
  }
  return map;
}

const ALL_NO = makeAnswers([]);
const ALL_YES = makeAnswers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

const COMBATENTE_PROFILE = makeAnswers([1, 2, 7, 8, 9, 10]);
const ESPECIALISTA_PROFILE = makeAnswers([5, 6, 9, 10, 15, 16]);
const OCULTISTA_PROFILE = makeAnswers([3, 4, 11, 12, 13, 14]);

describe('runInference — estrutura do resultado', () => {
  it('sempre retorna um objeto InferenceResult com as 3 chaves obrigatórias', () => {
    const result = runInference(ALL_NO);
    expect(result).toHaveProperty('attributeScores');
    expect(result).toHaveProperty('trailResults');
    expect(result).toHaveProperty('recommended');
    expect(result).toHaveProperty('firedRules');
  });

  it('trailResults sempre contém as 3 trilhas', () => {
    const result = runInference(ALL_NO);
    expect(result.trailResults).toHaveLength(3);
  });

  it('trailResults está ordenado do maior para o menor compatibility', () => {
    const result = runInference(ALL_YES);
    const compatibilities = result.trailResults.map((t) => t.compatibility);
    expect(compatibilities[0]).toBeGreaterThanOrEqual(compatibilities[1]!);
    expect(compatibilities[1]).toBeGreaterThanOrEqual(compatibilities[2]!);
  });

  it('recommended é sempre o primeiro elemento de trailResults', () => {
    const result = runInference(ALL_YES);
    expect(result.recommended.key).toBe(result.trailResults[0]!.key);
  });

  it('compatibility de todas as trilhas fica entre 60 e 88', () => {
    for (const profile of [ALL_NO, ALL_YES, COMBATENTE_PROFILE, ESPECIALISTA_PROFILE, OCULTISTA_PROFILE]) {
      const result = runInference(profile);
      for (const t of result.trailResults) {
        expect(t.compatibility).toBeGreaterThanOrEqual(60);
        expect(t.compatibility).toBeLessThanOrEqual(88);
      }
    }
  });
});

describe('runInference — acúmulo de atributos', () => {
  it('nenhuma resposta sim resulta em todos os atributos zerados', () => {
    const result = runInference(ALL_NO);
    for (const score of Object.values(result.attributeScores)) {
      expect(score).toBe(0);
    }
  });

  it('todas as respostas sim resultam em todos os atributos com valor 2', () => {
    const result = runInference(ALL_YES);
    for (const score of Object.values(result.attributeScores)) {
      expect(score).toBe(2);
    }
  });

  it('responder sim apenas às perguntas 1 e 2 acumula sustainability = 2', () => {
    const result = runInference(makeAnswers([1, 2]));
    expect(result.attributeScores.sustainability).toBe(2);
    expect(result.attributeScores.mentality).toBe(0);
    expect(result.attributeScores.skills).toBe(0);
  });

  it('responder sim apenas às perguntas 11 e 12 acumula pde = 2', () => {
    const result = runInference(makeAnswers([11, 12]));
    expect(result.attributeScores.pde).toBe(2);
  });
});

describe('runInference — recomendação de trilha', () => {
  it('perfil combatente recomenda COMBATENTE', () => {
    const result = runInference(COMBATENTE_PROFILE);
    expect(result.recommended.key).toBe('combatente');
  });

  it('perfil especialista recomenda ESPECIALISTA', () => {
    const result = runInference(ESPECIALISTA_PROFILE);
    expect(result.recommended.key).toBe('especialista');
  });

  it('perfil ocultista recomenda OCULTISTA', () => {
    const result = runInference(OCULTISTA_PROFILE);
    expect(result.recommended.key).toBe('ocultista');
  });

  it('perfil combatente tem score de combatente maior que ocultista', () => {
    const result = runInference(COMBATENTE_PROFILE);
    const combatente = result.trailResults.find((t) => t.key === 'combatente')!;
    const ocultista = result.trailResults.find((t) => t.key === 'ocultista')!;
    expect(combatente.score).toBeGreaterThan(ocultista.score);
  });
});

describe('regras de bônus (forward chaining)', () => {
  it('perfil tanque puro (sustainability=2, pdp=2) dispara regra do Combatente', () => {
    const scores = { combatente: 0, especialista: 0, ocultista: 0 };
    const attrs = {
      sustainability: 2, mentality: 0, skills: 0,
      pdp: 2, pdw: 0, pde: 0, scalability: 0, flexibility: 0,
    };
    const rule = BONUS_RULES.find((r) => r.description.includes('tanque puro'))!;
    expect(rule.condition(attrs)).toBe(true);
    rule.effect(scores);
    expect(scores.combatente).toBe(2);
  });

  it('perfil coringa (skills=2, flexibility=2) dispara regra do Especialista', () => {
    const scores = { combatente: 0, especialista: 0, ocultista: 0 };
    const attrs = {
      sustainability: 0, mentality: 0, skills: 2,
      pdp: 0, pdw: 0, pde: 0, scalability: 0, flexibility: 2,
    };
    const rule = BONUS_RULES.find((r) => r.description.includes('coringa'))!;
    expect(rule.condition(attrs)).toBe(true);
    rule.effect(scores);
    expect(scores.especialista).toBe(2);
  });

  it('perfil ritualista (pde=2, scalability>=1) dispara regra do Ocultista', () => {
    const scores = { combatente: 0, especialista: 0, ocultista: 0 };
    const attrs = {
      sustainability: 0, mentality: 0, skills: 0,
      pdp: 0, pdw: 0, pde: 2, scalability: 1, flexibility: 0,
    };
    const rule = BONUS_RULES.find((r) => r.description.includes('ritualista'))!;
    expect(rule.condition(attrs)).toBe(true);
    rule.effect(scores);
    expect(scores.ocultista).toBe(2);
  });

  it('perfil ocultista completo dispara regra de bônus do Ocultista no runInference', () => {
    const result = runInference(OCULTISTA_PROFILE);
    const hasOcultistaBonus = result.firedRules.some((r) =>
      r.includes('ritualista') || r.includes('paranormal'),
    );
    expect(hasOcultistaBonus).toBe(true);
  });

  it('regras não disparam para perfil sem atributos (todos zero)', () => {
    const result = runInference(ALL_NO);
    expect(result.firedRules).toHaveLength(0);
  });
});
