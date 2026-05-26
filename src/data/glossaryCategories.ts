import type { GlossaryTerm } from '../types'

export type GlossaryCategoryId =
  | 'model-access'
  | 'orchestration'
  | 'data-rag'
  | 'build-ship'
  | 'capabilities'
  | 'governance'

export const glossaryCategories: { id: GlossaryCategoryId; label: string }[] = [
  { id: 'model-access', label: 'Model access' },
  { id: 'orchestration', label: 'Agents & orchestration' },
  { id: 'data-rag', label: 'Data & RAG' },
  { id: 'build-ship', label: 'Eval & observability' },
  { id: 'capabilities', label: 'Capabilities & training' },
  { id: 'governance', label: 'Governance & safety' },
]

const categoryByTermId: Record<string, GlossaryCategoryId> = {
  'model-api': 'model-access',
  sdk: 'model-access',
  gateway: 'model-access',
  router: 'model-access',
  'model-hub': 'model-access',
  'inference-server': 'model-access',
  'semantic-cache': 'model-access',
  'context-window': 'model-access',
  framework: 'orchestration',
  orchestration: 'orchestration',
  agent: 'orchestration',
  'workflow-engine': 'orchestration',
  'tool-calling': 'orchestration',
  mcp: 'orchestration',
  'agent-host': 'orchestration',
  rag: 'data-rag',
  'embedding-model': 'data-rag',
  'vector-db': 'data-rag',
  chunking: 'data-rag',
  reranker: 'data-rag',
  harness: 'build-ship',
  benchmark: 'build-ship',
  'eval-platform': 'build-ship',
  observability: 'build-ship',
  llmops: 'build-ship',
  'prompt-management': 'build-ship',
  'structured-output': 'build-ship',
  'fine-tuning': 'capabilities',
  peft: 'capabilities',
  guardrails: 'governance',
  'red-teaming': 'governance',
}

export function withGlossaryCategories(terms: Omit<GlossaryTerm, 'category'>[]): GlossaryTerm[] {
  return terms.map((t) => {
    const category = categoryByTermId[t.id]
    if (!category) {
      throw new Error(`Missing glossary category for term: ${t.id}`)
    }
    return { ...t, category }
  })
}
