import type {
  BuilderInput,
  BuilderMaturity,
  BuilderResult,
  BuilderRole,
  LayerId,
} from '../types'

function applyRole(
  role: BuilderRole,
  input: BuilderInput,
  layers: Set<LayerId>,
  mvp: string[],
  growth: string[],
  enterprise: string[],
  ignoreForNow: string[],
): void {
  switch (role) {
    case 'app-dev':
      if (input.goal !== 'fine-tune') {
        ignoreForNow.push('Axolotl / full training stack unless ML partners own it')
      }
      mvp.push('Prefer official SDK over framework if scope is small')
      break
    case 'ml-engineer':
      growth.push('Harness in CI (promptfoo / DeepEval)')
      if (input.goal === 'fine-tune' || input.goal === 'classify') {
        layers.add('capabilities')
      }
      break
    case 'data-platform':
      layers.add('data')
      growth.push('Re-index and data quality checks', 'Gateway for API keys and routing')
      break
    case 'product-pm':
      ignoreForNow.push('Framework shopping before use case is fixed')
      break
    case 'security':
      layers.add('governance')
      growth.push('Audit logging on prompts/responses', 'Data residency review for model API')
      enterprise.push('Red-team / safety eval offline')
      break
  }
}

function applyMaturity(
  maturity: BuilderMaturity,
  layers: Set<LayerId>,
  mvp: string[],
  growth: string[],
  enterprise: string[],
  ignoreForNow: string[],
): void {
  switch (maturity) {
    case 'experiment':
      ignoreForNow.push(
        'Paid observability suite',
        'Enterprise gateway',
        'Vector DB cluster at scale',
      )
      break
    case 'prototype':
      mvp.push('Manual or spreadsheet eval is OK')
      ignoreForNow.push('Multi-region HA', 'Full agent autonomy in prod')
      break
    case 'production':
      layers.add('build-ship')
      if (!growth.some((g) => g.toLowerCase().includes('observability'))) {
        growth.push('Observability (traces + cost) — required at this stage')
      }
      growth.push('Prompt/version control', 'Eval regression before deploy')
      break
    case 'enterprise':
      layers.add('governance')
      enterprise.push('SSO', 'Central model gateway', 'Audit retention', 'Shared eval catalog')
      ignoreForNow.push('Per-team shadow API keys', 'Ungoverned no-code in prod')
      break
  }
}

export function buildStack(input: BuilderInput): BuilderResult {
  const layers = new Set<LayerId>(['model-access', 'build-ship'])
  const mvp: string[] = ['Model API or SDK', 'Basic eval set (even 20 cases)']
  const growth: string[] = []
  const enterprise: string[] = []
  const ignoreForNow: string[] = []
  const nextSteps: BuilderResult['nextSteps'] = []

  switch (input.goal) {
    case 'chat-docs':
      layers.add('data')
      layers.add('capabilities')
      layers.add('product')
      mvp.push('Document loaders', 'Embeddings', 'Vector store (pgvector OK at small scale)', 'RAG prompt')
      growth.push('Observability (Langfuse / similar)', 'Re-index pipeline', 'Ragas or RAG eval metrics')
      ignoreForNow.push('Full agent framework', 'Fine-tuning', 'Multi-agent crews')
      nextSteps.push(
        { label: 'Document Q&A pattern', tab: 'patterns', anchor: 'doc-qa' },
        { label: 'RAG glossary term', tab: 'glossary', anchor: 'rag' },
        { label: 'Vector DB vs pgvector', tab: 'compare', anchor: 'vector-pg-elastic' },
      )
      break
    case 'automate':
      layers.add('orchestration')
      layers.add('capabilities')
      mvp.push('Workflow or chain first', 'Tool schemas if needed')
      growth.push('Tracing', 'Tool-level eval')
      if (input.risk === 'customer') {
        layers.add('governance')
        growth.push('Human approval steps', 'Guardrails / moderation')
      }
      ignoreForNow.push('CrewAI-style multi-agent', 'Fine-tune')
      nextSteps.push(
        { label: 'Agent decision tree', tab: 'builder', anchor: 'agent-tree' },
        { label: 'Agent vs workflow compare', tab: 'compare', anchor: 'agent-workflow' },
        { label: 'Orchestration glossary', tab: 'glossary', anchor: 'orchestration' },
      )
      break
    case 'classify':
      layers.add('product')
      mvp.push('Structured output / JSON mode', 'Labeled eval CSV', 'Batch worker script')
      growth.push('promptfoo in CI', 'Prompt versioning')
      ignoreForNow.push('Vector DB', 'Agent frameworks', 'RAG')
      nextSteps.push(
        { label: 'Batch classification pattern', tab: 'patterns', anchor: 'batch-classify' },
        { label: 'Harness glossary', tab: 'glossary', anchor: 'harness' },
        { label: 'Structured output glossary', tab: 'glossary', anchor: 'structured-output' },
      )
      break
    case 'code-agent':
      layers.add('orchestration')
      layers.add('product')
      layers.add('capabilities')
      mvp.push('Sandboxed tools', 'Agent or graph runtime', 'Strong frontier model API')
      growth.push('Cost caps', 'Tool allowlists', 'Regression eval on tool paths')
      enterprise.push('Audit logs', 'SSO on internal host')
      ignoreForNow.push('No-code flow builders for prod', 'RAG unless docs are core')
      nextSteps.push(
        { label: 'Research / code pattern', tab: 'patterns', anchor: 'research-code' },
        { label: 'Agent glossary', tab: 'glossary', anchor: 'agent' },
        { label: 'MCP vs custom tools', tab: 'compare', anchor: 'mcp-custom-tools' },
      )
      break
    case 'fine-tune':
      layers.add('data')
      layers.add('capabilities')
      mvp.push('Curated dataset', 'PEFT training (Axolotl / Unsloth)', 'Local inference server')
      growth.push('Domain harness', 'Model versioning')
      ignoreForNow.push('Vector DB unless hybrid', 'Agent orchestration')
      nextSteps.push(
        { label: 'Fine-tune pattern', tab: 'patterns', anchor: 'fine-tune-domain' },
        { label: 'RAG vs fine-tuning', tab: 'compare', anchor: 'rag-finetune' },
      )
      break
    case 'ship-guardrails':
      layers.add('product')
      layers.add('governance')
      mvp.push('Gateway or proxy', 'Moderation pass', 'Observability from day one')
      growth.push('Prompt management', 'Cost dashboards')
      enterprise.push('VPC / private link', 'Audit retention', 'Team API key policies')
      ignoreForNow.push('Second agent framework', 'Benchmark leaderboards')
      nextSteps.push(
        { label: 'Support assist pattern', tab: 'patterns', anchor: 'support-assist' },
        { label: 'Guardrails glossary', tab: 'glossary', anchor: 'guardrails' },
        { label: 'Compliance & residency', tab: 'compare', anchor: 'compliance-residency' },
      )
      break
  }

  if (input.constraints.includes('on-prem')) {
    mvp.push('Ollama or vLLM instead of public API where possible')
    growth.push('Self-hosted observability')
  }
  if (input.constraints.includes('budget')) {
    ignoreForNow.push('Multiple paid observability stacks')
    mvp.push('Start with OSS promptfoo + Langfuse OSS')
  }
  if (input.constraints.includes('latency')) {
    growth.push('Caching layer', 'Smaller model for retrieval step')
  }

  if (input.team === 'solo') {
    ignoreForNow.push('Enterprise catalog', 'Multi-team gateway policies')
  } else if (input.team === 'platform') {
    enterprise.push('Central model gateway', 'Shared eval datasets', 'Internal tool catalog')
    layers.add('governance')
  }

  if (input.risk === 'customer') {
    layers.add('governance')
    if (!growth.some((g) => g.includes('Guardrails') || g.includes('moderation'))) {
      growth.push('Guardrails / moderation')
    }
  }

  applyRole(input.role, input, layers, mvp, growth, enterprise, ignoreForNow)
  applyMaturity(input.maturity, layers, mvp, growth, enterprise, ignoreForNow)

  const layerList = (
    [
      'product',
      'orchestration',
      'capabilities',
      'model-access',
      'data',
      'build-ship',
      'governance',
    ] as LayerId[]
  ).filter((l) => layers.has(l))

  const dedupe = (arr: string[]) => [...new Set(arr)]

  return {
    layers: layerList,
    mvp: dedupe(mvp),
    growth: dedupe(growth),
    enterprise: dedupe(enterprise),
    ignoreForNow: dedupe(ignoreForNow),
    nextSteps,
  }
}

export const builderGoals = [
  { id: 'chat-docs' as const, label: 'Chat with documents' },
  { id: 'automate' as const, label: 'Automate multi-step work' },
  { id: 'classify' as const, label: 'Classify / extract at scale' },
  { id: 'code-agent' as const, label: 'Research / coding agent' },
  { id: 'fine-tune' as const, label: 'Fine-tune domain model' },
  { id: 'ship-guardrails' as const, label: 'Ship with guardrails' },
]

export const builderTeams = [
  { id: 'solo' as const, label: 'Solo' },
  { id: 'small' as const, label: 'Small product team' },
  { id: 'platform' as const, label: 'Platform team' },
]

export const builderRoles = [
  { id: 'app-dev' as const, label: 'App developer' },
  { id: 'ml-engineer' as const, label: 'ML engineer' },
  { id: 'data-platform' as const, label: 'Data / platform' },
  { id: 'product-pm' as const, label: 'Product / PM' },
  { id: 'security' as const, label: 'Security / compliance' },
]

export const builderMaturities = [
  { id: 'experiment' as const, label: 'Experiment' },
  { id: 'prototype' as const, label: 'Prototype' },
  { id: 'production' as const, label: 'Production' },
  { id: 'enterprise' as const, label: 'Enterprise' },
]

export const builderConstraints = [
  { id: 'on-prem' as const, label: 'On-prem / air-gap' },
  { id: 'budget' as const, label: 'Tight budget' },
  { id: 'latency' as const, label: 'Low latency' },
]

export const builderRisks = [
  { id: 'internal' as const, label: 'Internal only' },
  { id: 'customer' as const, label: 'Customer-facing' },
]
