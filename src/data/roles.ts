import type { NavigationTarget } from '../navigation'

export interface RoleGuide {
  id: string
  title: string
  summary: string
  startHere: string[]
  skipForNow: string[]
  links: { label: string; target: NavigationTarget }[]
}

export const roleGuides: RoleGuide[] = [
  {
    id: 'app-dev',
    title: 'App developer',
    summary: 'APIs, SDKs, minimal ML — ship features without owning training infra.',
    startHere: ['Model API + official SDK', 'Product UI', 'RAG or chain before agents'],
    skipForNow: ['Full fine-tune pipeline', 'lm-eval academic harness', 'Multi-agent crews'],
    links: [
      { label: 'By role hub', target: { tab: 'overview', anchor: 'role-hub' } },
      { label: 'Call a model (job)', target: { tab: 'overview', anchor: 'call-model' } },
      { label: 'LangChain vs SDK', target: { tab: 'compare', anchor: 'langchain-llamaindex-sdk' } },
      { label: 'Stack builder', target: { tab: 'builder' } },
    ],
  },
  {
    id: 'ml-engineer',
    title: 'ML engineer',
    summary: 'Training, eval, pipelines — model quality and regression are your job.',
    startHere: ['Eval harness + labeled set', 'Offline metrics before prod', 'Versioned prompts/models'],
    skipForNow: ['No-code flow builders for prod', 'Marketing “agent platform” as default'],
    links: [
      { label: 'Compare models (job)', target: { tab: 'overview', anchor: 'compare-models' } },
      { label: 'Harness vs observability', target: { tab: 'compare', anchor: 'harness-framework-obs' } },
      { label: 'RAG vs fine-tuning', target: { tab: 'compare', anchor: 'rag-finetune' } },
    ],
  },
  {
    id: 'data-platform',
    title: 'Data / platform',
    summary: 'Stores, ingestion, governance — vectors, pipelines, and access control.',
    startHere: ['Data layer (loaders, vector store)', 'Re-index pipelines', 'Gateway for keys and routing'],
    skipForNow: ['Choosing chat UI frameworks first', 'Agent hype before data hygiene'],
    links: [
      { label: 'Vector DB compare', target: { tab: 'compare', anchor: 'vector-pg-elastic' } },
      { label: 'Document Q&A pattern', target: { tab: 'patterns', anchor: 'doc-qa' } },
      { label: 'Gateway glossary', target: { tab: 'glossary', anchor: 'gateway' } },
    ],
  },
  {
    id: 'product-pm',
    title: 'Product / PM',
    summary: 'Feasibility, cost, latency — what’s possible without reading every README.',
    startHere: ['Stack builder for MVP scope', 'Patterns for user-facing outcomes', 'Agent decision tree before “we need agents”'],
    skipForNow: ['Deep framework comparisons until use case is fixed', 'Vendor leaderboard chasing'],
    links: [
      { label: 'Stack builder', target: { tab: 'builder' } },
      { label: 'Do I need an agent?', target: { tab: 'builder', anchor: 'agent-tree' } },
      { label: 'Stack patterns', target: { tab: 'patterns' } },
    ],
  },
  {
    id: 'security',
    title: 'Security / compliance',
    summary: 'Residency, logging, PII — governance layer and auditability.',
    startHere: ['Governance layer (gateway, moderation, audit)', 'Data residency for model API', 'Red team / safety eval offline'],
    skipForNow: ['Skipping logging because “it’s just a POC”', 'Customer PII in prompts without policy'],
    links: [
      { label: 'Compliance & data residency', target: { tab: 'compare', anchor: 'compliance-residency' } },
      { label: 'Ship with guardrails (builder goal)', target: { tab: 'builder' } },
      { label: 'Guardrails glossary', target: { tab: 'glossary', anchor: 'guardrails' } },
    ],
  },
]
