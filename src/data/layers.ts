import type { Layer } from '../types'

export const layers: Layer[] = [
  {
    id: 'product',
    name: 'Product / UX',
    shortName: 'Product',
    description: 'Your app, copilot UI, workflow surfaces, and how users interact with AI features.',
    toolTypes: ['Web/mobile app', 'Chat UI', 'Admin console', 'Workflow designer'],
    skipIf: 'You are only running batch jobs or internal scripts with no user-facing surface.',
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    shortName: 'Orchestration',
    description: 'Agents, chains, graphs, and workflows that coordinate multiple steps and tool calls.',
    toolTypes: ['Agent frameworks', 'Workflow engines', 'Graph runtimes', 'Task planners'],
    skipIf: 'Your task is a fixed pipeline (ingest → retrieve → generate) with no dynamic tool selection.',
  },
  {
    id: 'capabilities',
    name: 'Capabilities',
    shortName: 'Capabilities',
    description: 'RAG, tools, memory, multimodal pipelines, and fine-tuning — the “what the model can do” layer.',
    toolTypes: ['RAG pipelines', 'Tool/function calling', 'Memory stores', 'PEFT / adapters'],
    skipIf: 'A single model API call with a static prompt is enough for your use case.',
  },
  {
    id: 'model-access',
    name: 'Model Access',
    shortName: 'Model access',
    description: 'Hosted LLM APIs, local inference, routing, and gateways to models.',
    toolTypes: ['LLM APIs', 'Local inference (Ollama, vLLM)', 'Model routers', 'API gateways'],
    skipIf: 'You already have a fixed model endpoint and no need to swap or route models.',
  },
  {
    id: 'data',
    name: 'Data',
    shortName: 'Data',
    description: 'Vectors, documents, feature stores, labeling — everything models read or learn from.',
    toolTypes: ['Vector DBs', 'Document loaders', 'Embedding APIs', 'Labeling platforms'],
    skipIf: 'You use only the model’s built-in knowledge with no private corpus or training data.',
  },
  {
    id: 'build-ship',
    name: 'Build & Ship',
    shortName: 'Build & ship',
    description: 'SDKs, hosting, observability, and offline eval — how you build, test, and run in production.',
    toolTypes: ['SDKs', 'Eval harnesses', 'Tracing / LLMOps', 'Inference hosting'],
    skipIf: 'You are in a one-off notebook experiment with no deploy path yet.',
  },
  {
    id: 'governance',
    name: 'Governance',
    shortName: 'Governance',
    description: 'Keys, policy, cost caps, moderation, and safety filters for production AI.',
    toolTypes: ['API gateways with policy', 'Moderation APIs', 'Cost controls', 'Audit logging'],
    skipIf: 'Internal-only prototypes with no PII, spend limits, or compliance requirements.',
  },
]

export const layerOrder: import('../types').LayerId[] = [
  'product',
  'orchestration',
  'capabilities',
  'model-access',
  'data',
  'build-ship',
  'governance',
]
