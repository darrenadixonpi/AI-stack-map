import type { NavigationTarget } from '../navigation'

export interface MaturityStage {
  id: string
  title: string
  summary: string
  focus: string[]
  defer: string[]
  links: { label: string; target: NavigationTarget }[]
}

export const maturityStages: MaturityStage[] = [
  {
    id: 'experiment',
    title: 'Experiment',
    summary: 'Playground, one API key, notebook — learn if LLM fits the problem.',
    focus: ['One model API', 'Notebook or script', '10–20 manual test prompts'],
    defer: ['Observability platform', 'Vector DB at scale', 'Agent frameworks', 'Enterprise gateway'],
    links: [
      { label: 'Stack builder', target: { tab: 'builder' } },
      { label: 'By maturity hub', target: { tab: 'overview', anchor: 'maturity-hub' } },
      { label: 'Model API glossary', target: { tab: 'glossary', anchor: 'model-api' } },
    ],
  },
  {
    id: 'prototype',
    title: 'Prototype',
    summary: 'RAG on small corpus, manual eval — demo for stakeholders.',
    focus: ['Small RAG or chain', 'pgvector or Chroma OK', 'promptfoo or spreadsheet eval'],
    defer: ['Multi-region HA', 'Full agent autonomy', 'Fine-tune before RAG baseline'],
    links: [
      { label: 'Document Q&A pattern', target: { tab: 'patterns', anchor: 'doc-qa' } },
      { label: 'RAG glossary', target: { tab: 'glossary', anchor: 'rag' } },
    ],
  },
  {
    id: 'production',
    title: 'Production',
    summary: 'Observability, versioning, SLAs, cost caps — real users depend on it.',
    focus: ['Tracing + cost dashboards', 'Eval regression in CI', 'Prompt/version control', 'Guardrails if external'],
    defer: ['Second framework', 'Benchmark leaderboard optimization'],
    links: [
      { label: 'Harness vs observability', target: { tab: 'compare', anchor: 'harness-observability' } },
      { label: 'Observability glossary', target: { tab: 'glossary', anchor: 'observability' } },
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    summary: 'SSO, VPC, audit, multi-team catalog — platform team owns the map.',
    focus: ['Central gateway', 'SSO + key policies', 'Audit retention', 'Shared eval datasets'],
    defer: ['Per-team shadow APIs', 'Ungoverned no-code prod apps'],
    links: [
      { label: 'AI platform vs assemble', target: { tab: 'compare', anchor: 'platform-assemble' } },
      { label: 'Compliance compare', target: { tab: 'compare', anchor: 'compliance-residency' } },
    ],
  },
]
