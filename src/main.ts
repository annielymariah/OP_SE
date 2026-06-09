import { select, confirm } from '@inquirer/prompts';
import { QUESTIONS } from './knowledge/questions';
import { runInference } from './engine/inference';
import { displayResult } from './ui/display';

function printHeader(): void {
  console.clear();
  console.log('');
  console.log('  ██████╗ ██████╗ ██████╗ ███████╗███╗   ███╗');
  console.log('  ██╔═══██╗██╔══██╗██╔══██╗██╔════╝████╗ ████║');
  console.log('  ██║   ██║██████╔╝██║  ██║█████╗  ██╔████╔██║');
  console.log('  ██║   ██║██╔══██╗██║  ██║██╔══╝  ██║╚██╔╝██║');
  console.log('  ╚██████╔╝██║  ██║██████╔╝███████╗██║ ╚═╝ ██║');
  console.log('   ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝');
  console.log('');
  console.log('  ██████╗  █████╗ ██████╗  █████╗ ███╗   ██╗ ██████╗ ██████╗  ███╗  ██╗ █████╗ ██╗');
  console.log('  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔═══██╗██╔══██╗████╗  ██║██╔══██╗██║');
  console.log('  ██████╔╝███████║██████╔╝███████║██╔██╗ ██║██║   ██║██████╔╝██╔██╗ ██║███████║██║');
  console.log('  ██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╗██║██║   ██║██╔══██╗██║╚██╗██║██╔══██║██║');
  console.log('  ██║     ██║  ██║██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║  ██║██║ ╚████║██║  ██║███████╗');
  console.log('  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝');
  console.log('');
  console.log('  ──────────────────────────────────────────────────────────────────');
  console.log('   Sistema Especialista — Recomendacao de Trilha');
  console.log('   Dominio: RPG Ordem Paranormal');
  console.log('  ──────────────────────────────────────────────────────────────────');
  console.log('');
  console.log('  Responda as perguntas a seguir para descobrir qual trilha');
  console.log('  de Ordem Paranormal melhor se adequa ao seu perfil.');
  console.log('');
}

async function runQuestionnaire(): Promise<Map<number, boolean>> {
  const answers = new Map<number, boolean>();
  let currentCategory = '';

  for (const question of QUESTIONS) {
    if (question.category !== currentCategory) {
      currentCategory = question.category;
      console.log(`\n  ══ ${currentCategory.toUpperCase()} ${'═'.repeat(Math.max(0, 50 - currentCategory.length))}`);
    }

    const answer = await select({
      message: `[${question.id}/${QUESTIONS.length}] ${question.text}`,
      choices: [
        { name: '✅  Sim', value: true },
        { name: '❌  Nao', value: false },
      ],
    });

    answers.set(question.id, answer);
  }

  return answers;
}

async function main(): Promise<void> {
  let continuar = true;

  while (continuar) {
    printHeader();

    const answers = await runQuestionnaire();

    console.log('\n  Analisando seu perfil...\n');

    const result = runInference(answers);

    displayResult(result);

    continuar = await confirm({
      message: 'Deseja refazer o questionario?',
      default: false,
    });
  }

  console.log('');
  console.log('  Obrigado por usar o Sistema Especialista de Ordem Paranormal!');
  console.log('  Boa aventura no Outro Lado!');
  console.log('');
}

main().catch((err) => {
  if (err?.name === 'ExitPromptError') {
    console.log('\n\n  Encerrando... Boa aventura!\n');
    process.exit(0);
  }
  console.error('Erro inesperado:', err);
  process.exit(1);
});
