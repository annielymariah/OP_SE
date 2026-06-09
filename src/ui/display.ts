import type { InferenceResult } from '../engine/inference';
import { TRAILS } from '../knowledge/trails';
import { ATTRIBUTES, type AttributeKey } from '../knowledge/attributes';

const LINE = '='.repeat(66);
const DASH = '-'.repeat(66);
const BLOCK_FULL = '█';
const BLOCK_EMPTY = '░';

function progressBar(value: number, max: number, width: number): string {
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  return BLOCK_FULL.repeat(Math.max(0, filled)) + BLOCK_EMPTY.repeat(Math.max(0, empty));
}

function compatBar(pct: number, width: number = 10): string {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  return BLOCK_FULL.repeat(Math.max(0, filled)) + BLOCK_EMPTY.repeat(Math.max(0, empty));
}

function padRight(str: string, length: number): string {
  return str.padEnd(length, ' ');
}

function printAttributeProfile(result: InferenceResult): void {
  console.log(`\n${LINE}`);
  console.log(' SEU PERFIL DE ATRIBUTOS');
  console.log(LINE);

  const attrKeys = Object.keys(result.attributeScores) as AttributeKey[];
  const maxAttrScore = Math.max(...(Object.values(result.attributeScores) as number[]), 1);

  for (const key of attrKeys) {
    const attr = ATTRIBUTES[key];
    const score = result.attributeScores[key];
    const bar = progressBar(score, maxAttrScore, 5);
    const label = padRight(attr.label, 22);
    console.log(`  ${padRight(label, 24)} [${bar}] ${score}/${maxAttrScore}`);
  }
}

function printRecommendation(result: InferenceResult): void {
  const rec = result.recommended;
  const trail = TRAILS[rec.key];

  console.log(`\n${LINE}`);
  console.log(' RECOMENDACAO DO SISTEMA ESPECIALISTA');
  console.log(LINE);
  console.log('');
  console.log(`  Classe principal : ${rec.label}`);
  console.log(`  Compatibilidade  : ${rec.compatibility}%`);
  console.log(`  Papel na equipe  : ${trail.role}`);
  console.log(`  Atributos-chave  : ${trail.keyAttributes}`);
  console.log('');
  console.log(`  ${trail.description}`);
  console.log('');
  console.log('  Pontos fortes:');
  for (const s of trail.strengths) console.log(`    [+] ${s}`);
  console.log('');
  console.log('  Pontos fracos:');
  for (const w of trail.weaknesses) console.log(`    [-] ${w}`);
}

function printComparativeAxes(result: InferenceResult): void {
  const rec = result.recommended;

  console.log(`\n${DASH}`);
  console.log(` EIXOS COMPARATIVOS - ${rec.label}`);
  console.log(DASH);

  const attrKeys = Object.keys(result.attributeScores) as AttributeKey[];
  const maxScore = Math.max(...(Object.values(result.attributeScores) as number[]), 1);

  for (const key of attrKeys) {
    const attr = ATTRIBUTES[key];
    const score = result.attributeScores[key];
    const bar = progressBar(score, maxScore, 3);
    const label = padRight(attr.label, 22);
    console.log(`  ${label} [${bar}] ${score}/${maxScore}  ${attr.description}`);
  }
}

function printRanking(result: InferenceResult): void {
  console.log(`\n${DASH}`);
  console.log(' RANKING DE COMPATIBILIDADE');
  console.log(DASH);

  for (let i = 0; i < result.trailResults.length; i++) {
    const t = result.trailResults[i]!;
    const bar = compatBar(t.compatibility, 10);
    const prefix = `${i + 1}. ${padRight(t.label, 14)}`;
    console.log(`  ${prefix} [${bar}] ${t.compatibility}%`);
  }
}

function printReasoning(result: InferenceResult): void {
  console.log(`\n${DASH}`);
  console.log(' RACIOCINIO DO SISTEMA (encadeamento para frente)');
  console.log(DASH);

  if (result.firedRules.length === 0) {
    console.log('  Nenhuma regra de bonus disparada.');
    console.log('  Classificacao baseada apenas na similaridade de perfil.');
  } else {
    console.log('  Regras de bonus disparadas:');
    for (const rule of result.firedRules) {
      console.log(`  >> ${rule}`);
    }
  }

  console.log('');
  console.log(`  CONCLUSAO: Classe '${result.recommended.label}' recomendada.`);
}

export function displayResult(result: InferenceResult): void {
  printAttributeProfile(result);
  printRecommendation(result);
  printComparativeAxes(result);
  printRanking(result);
  printReasoning(result);
  console.log('\n');
}
