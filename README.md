# Sistema Especialista — Ordem Paranormal

Sistema Especialista desenvolvido como projeto acadêmico da disciplina de Inteligência Artificial. Analisa o perfil do jogador por meio de um questionário e recomenda a trilha ideal do RPG **Ordem Paranormal**.

---

## Domínio

**Ordem Paranormal** é um sistema de RPG de mesa brasileiro criado por Cellbit, ambientado em um mundo contemporâneo onde agentes investigam e combatem ameaças paranormais. Os jogadores escolhem entre três trilhas de personagem, cada uma com características distintas:

| Trilha | Papel | Atributos-chave |
|---|---|---|
| **Combatente** | Tank / DPS corpo a corpo | Sustentabilidade e Dano Físico |
| **Especialista** | Suporte / Investigador / DPS à distância | Perícias e Flexibilidade |
| **Ocultista** | Mago / Controlador / DPS elemental | Dano Elemental e Escalabilidade |

---

## Base de Conhecimento

A base de conhecimento foi construída a partir de informações fornecidas pelo especialista **Vinícius França**, com referência nos livros *Ordem Paranormal* e *Sobrevivendo ao Horror*.

São definidos **8 atributos** para análise de perfil:

| Atributo | Descrição |
|---|---|
| Sustentabilidade | Resistência física e vitalidade em campo |
| Mentalidade | Resistência mental diante de horrores sobrenaturais |
| Perícias | Conhecimento técnico e aptidão em diversas áreas |
| Pot. Dano Físico | Capacidade de causar dano por força física |
| Pot. Dano Armado | Capacidade de causar dano com armas |
| Pot. Dano Elemental | Capacidade de manipular e causar dano via ocultismo |
| Escalabilidade | Potencial de progressão ao longo da missão |
| Flexibilidade | Versatilidade para desempenhar diferentes funções |

### Tabela de Pesos

Cada atributo possui um peso associado a cada trilha (+1, 0 ou -1):

| Atributo | Combatente | Especialista | Ocultista |
|---|:---:|:---:|:---:|
| Sustentabilidade | +1 | 0 | -1 |
| Mentalidade | -1 | 0 | +1 |
| Perícias | -1 | +1 | 0 |
| Pot. Dano Físico | +1 | 0 | -1 |
| Pot. Dano Armado | +1 | +1 | 0 |
| Pot. Dano Elemental | 0 | 0 | +1 |
| Escalabilidade | 0 | -1 | +1 |
| Flexibilidade | 0 | +1 | +1 |

---

## Método de Inferência — Forward Chaining

O sistema utiliza **encadeamento para frente** (*forward chaining*): parte dos fatos conhecidos (respostas do usuário) e aplica regras até chegar à conclusão (trilha recomendada).

### Fluxo do Sistema

```
Início
  │
  ▼
Aplicar Questionário (16 perguntas, 2 por atributo)
  │
  ▼
Receber Respostas (sim/não via setas do teclado)
  │
  ▼
Identificar Atributos
  SE resposta = sim → atributo += 1
  │
  ▼
Aplicar Regras de Inferência (tabela de pesos)
  SE atributo[X] > 0 → score[trilha] += atributo[X] * peso[X][trilha]
  │
  ▼
Calcular Pontuação das Trilhas (+ regras de bônus)
  SE Sustentabilidade=2 E Dano Físico=2 → Combatente +2
  SE Perícias=2 E Flexibilidade=2       → Especialista +2
  SE Dano Elemental=2 E Escalabilidade≥1 → Ocultista +2
  SE Mentalidade≥1 E Dano Elemental≥1   → Ocultista +1
  SE Flexibilidade≥1 E Perícias≥1 E Dano Armado≥1 → Especialista +1
  │
  ▼
Comparar Resultados (normalizar scores em 60–88%)
  │
  ▼
Determinar Trilha Recomendada (maior compatibilidade)
  │
  ▼
Exibir Resultado
  - Perfil de atributos com barras ASCII
  - Classe recomendada com % de compatibilidade
  - Pontos fortes e fracos
  - Eixos comparativos
  - Ranking das 3 trilhas
  - Raciocínio do sistema (regras disparadas)
  │
  ▼
Fim
```

---

## Arquitetura

```
src/
├── knowledge/
│   ├── attributes.ts   # 8 atributos da base de conhecimento
│   ├── trails.ts       # 3 trilhas com tabela de pesos e descrições
│   └── questions.ts    # 16 perguntas mapeadas aos atributos
├── engine/
│   └── inference.ts    # Motor de inferência (forward chaining)
├── ui/
│   └── display.ts      # Exibição formatada no terminal (barras ASCII)
└── main.ts             # Orquestrador: questionário → inferência → exibição

tests/
└── inference.test.ts   # 18 testes automatizados (Vitest)
```

---

## Como Executar

**Pré-requisitos:** Node.js 18+

```bash
# Instalar dependências
npm install

# Executar o sistema
npm start

# Executar testes automatizados
npm test
```

---

## Testes Automatizados

18 testes cobrindo os principais comportamentos do motor de inferência:

```
runInference — estrutura do resultado     (5 testes)
runInference — acúmulo de atributos      (4 testes)
runInference — recomendação de trilha    (4 testes)
regras de bônus (forward chaining)       (5 testes)
```

---

## Tecnologias

| Ferramenta | Uso |
|---|---|
| TypeScript | Linguagem principal |
| tsx | Execução direta de TypeScript |
| @inquirer/prompts | Interface interativa no terminal |
| Vitest | Framework de testes automatizados |

---

## Grupo

Projeto da disciplina de Inteligência Artificial.
Especialista consultado: **Vinícius França**
Referências: *Ordem Paranormal* e *Sobrevivendo ao Horror*
