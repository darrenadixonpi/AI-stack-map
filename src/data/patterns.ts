import type { StackPattern } from '../types'

export const stackPatterns: StackPattern[] = [
  {
    id: 'doc-qa',
    title: 'Document Q&A (internal copilot)',
    shortLabel: 'Doc Q&A',
    summary:
      'Internal copilot: users ask questions; answers are grounded in your document corpus behind existing auth.',
    diagram: {
      envelope: [{ id: 'ui', label: 'App UI + auth', layer: 'product' }],
      pipeline: [
        { id: 'ingest', label: 'Ingest docs', layer: 'data' },
        { id: 'chunk', label: 'Chunk + metadata', layer: 'data' },
        { id: 'embed', label: 'Embed', layer: 'capabilities' },
        { id: 'store', label: 'Vector store', layer: 'data' },
        { id: 'retrieve', label: 'Retrieve top-k', layer: 'capabilities' },
        { id: 'generate', label: 'Generate answer', layer: 'model-access' },
      ],
      supporting: [
        { id: 'eval', label: 'Offline eval set', layer: 'build-ship' },
        { id: 'trace', label: 'Tracing + cost', layer: 'build-ship' },
      ],
      feedback: [
        {
          fromStepId: 'generate',
          toStepId: 'ingest',
          label: 'Re-index when sources change',
          layer: 'data',
          productionOnly: true,
        },
      ],
      excludes: ['Agent loop', 'Fine-tune (unless style-only)'],
    },
    layers: ['product', 'data', 'capabilities', 'model-access', 'build-ship'],
    mvp: [
      'Document loaders + chunking',
      'Embedding API or local embed model',
      'Vector store (or pgvector for small scale)',
      'Model API + simple RAG prompt',
      'Basic web UI with auth',
    ],
    production: [
      'Eval set on representative questions',
      'Tracing (Langfuse / similar)',
      'Re-index pipeline when docs change',
      'Cost and latency monitoring',
    ],
    mistakes: [
      'Jumping to a full agent framework before RAG works',
      'Fine-tuning when knowledge changes frequently',
      'Skipping chunking strategy and metadata filters',
    ],
    usuallySkip: ['Full agent framework', 'Fine-tuning', 'Complex multi-agent setups'],
    related: ['glossary:rag', 'compare:vector-pg-elastic', 'compare:rag-finetune'],
  },
  {
    id: 'support-assist',
    title: 'Customer support assist (human in the loop)',
    shortLabel: 'Support assist',
    summary:
      'Suggest replies from KB and tickets; a human always approves before anything reaches the customer.',
    diagram: {
      envelope: [{ id: 'ui', label: 'Agent desktop / draft UI', layer: 'product' }],
      pipeline: [
        { id: 'ingest', label: 'Ingest KB + tickets', layer: 'data' },
        { id: 'retrieve', label: 'Retrieve context', layer: 'capabilities' },
        { id: 'draft', label: 'Draft reply', layer: 'model-access' },
        { id: 'human', label: 'Human reviews & sends', layer: 'product' },
      ],
      supporting: [
        { id: 'moderation', label: 'Moderation on draft', layer: 'governance' },
        { id: 'crm', label: 'CRM / ticket integration', layer: 'product' },
        { id: 'feedback', label: 'Thumbs + edit logging', layer: 'build-ship' },
      ],
      feedback: [
        {
          fromStepId: 'human',
          toStepId: 'ingest',
          label: 'Refresh KB from resolved tickets',
          layer: 'data',
          productionOnly: true,
        },
      ],
      excludes: ['Autonomous send', 'Full agent with CRM write access'],
    },
    layers: ['product', 'data', 'capabilities', 'model-access', 'governance', 'build-ship'],
    mvp: [
      'KB ingestion into vector store',
      'Suggest-draft UI in agent desktop',
      'Model API with retrieval',
      'Human approval before send',
    ],
    production: [
      'Moderation on drafts',
      'Feedback loop (thumbs, edits)',
      'Prompt A/B via observability',
      'PII handling in governance layer',
    ],
    mistakes: [
      'Auto-sending LLM replies without review',
      'Treating ticket DB as vector store without hygiene',
      'Agents when retrieval + single-shot is enough',
    ],
    usuallySkip: ['Autonomous agent with send permissions', 'Fine-tune on ticket text early'],
    related: ['compare:agent-workflow', 'glossary:guardrails', 'compare:compliance-residency'],
  },
  {
    id: 'research-code',
    title: 'Research / coding assistant',
    shortLabel: 'Code / research',
    summary:
      'Exploratory tool use (search, repo, sandbox) in a loop — high risk; tracing and caps are non-optional in prod.',
    diagram: {
      envelope: [{ id: 'ui', label: 'IDE / chat host', layer: 'product' }],
      pipeline: [
        { id: 'plan', label: 'Plan next step', layer: 'orchestration' },
        { id: 'pick-tool', label: 'Pick tool(s)', layer: 'orchestration' },
        { id: 'run-tool', label: 'Run sandbox / search / repo', layer: 'capabilities' },
        { id: 'synthesize', label: 'Synthesize result', layer: 'model-access' },
      ],
      supporting: [
        { id: 'trace', label: 'Trace every tool call', layer: 'build-ship' },
        { id: 'caps', label: 'Cost + rate caps', layer: 'governance' },
        { id: 'allow', label: 'Tool allowlists', layer: 'governance' },
      ],
      feedback: [
        {
          fromStepId: 'synthesize',
          toStepId: 'plan',
          label: 'Agent loop until stop condition',
          layer: 'orchestration',
        },
        {
          fromStepId: 'run-tool',
          toStepId: 'plan',
          label: 'Human escalation on failure',
          layer: 'product',
          productionOnly: true,
        },
      ],
      excludes: ['Heavy RAG (unless docs are core)', 'No-code prod builder'],
    },
    layers: ['product', 'orchestration', 'capabilities', 'model-access', 'build-ship', 'governance'],
    mvp: [
      'Sandboxed code execution',
      'Search / repo tools with allowlists',
      'Agent or graph orchestration',
      'Strong model API',
    ],
    production: [
      'Tracing every tool call',
      'Tool-level eval and regression',
      'Cost caps and rate limits',
      'Human escalation paths',
    ],
    mistakes: [
      'Unsandboxed shell on customer data',
      'No logging of tool inputs/outputs',
      'Skipping eval on tool-selection failures',
    ],
    usuallySkip: ['Heavy RAG unless docs are core', 'No-code builders for prod'],
    related: ['builder:agent-tree', 'compare:mcp-custom-tools', 'glossary:agent'],
  },
  {
    id: 'batch-classify',
    title: 'Batch classification / extraction',
    shortLabel: 'Batch classify',
    summary:
      'Fixed schema out, many rows in — one model call per item (or batch API), no retrieval and no agent.',
    diagram: {
      pipeline: [
        { id: 'queue', label: 'Job queue / worker', layer: 'product' },
        { id: 'call', label: 'Structured model output', layer: 'model-access' },
        { id: 'store', label: 'Write results', layer: 'data' },
      ],
      supporting: [
        { id: 'eval', label: 'Harness on labeled set', layer: 'build-ship' },
        { id: 'version', label: 'Prompt versioning', layer: 'build-ship' },
      ],
      excludes: ['Vector DB', 'RAG', 'Agent loop', 'Orchestration framework'],
    },
    layers: ['model-access', 'build-ship', 'data'],
    mvp: [
      'Model API with structured output or JSON mode',
      'Small labeled eval set',
      'Script or queue worker',
    ],
    production: [
      'Harness regression on eval set',
      'Versioned prompts',
      'Throughput and cost monitoring',
    ],
    mistakes: [
      'Adding vector DB and agents for a fixed schema task',
      'Reporting playground accuracy without held-out set',
    ],
    usuallySkip: ['RAG stack', 'Agent frameworks', 'Vector DB'],
    related: ['glossary:structured-output', 'compare:structured-output-tools', 'glossary:harness'],
  },
  {
    id: 'fine-tune-domain',
    title: 'Fine-tuned domain model',
    shortLabel: 'Fine-tune',
    summary:
      'Adapt weights for stable task format or tone; use RAG instead when facts change frequently.',
    diagram: {
      pipeline: [
        { id: 'curate', label: 'Curate dataset', layer: 'data' },
        { id: 'train', label: 'PEFT / fine-tune', layer: 'capabilities' },
        { id: 'serve', label: 'Inference server', layer: 'model-access' },
        { id: 'eval', label: 'Domain harness', layer: 'build-ship' },
      ],
      supporting: [
        { id: 'rag', label: 'Optional RAG for changing facts', layer: 'capabilities' },
        { id: 'version', label: 'Model version + rollback', layer: 'build-ship' },
      ],
      feedback: [
        {
          fromStepId: 'eval',
          toStepId: 'train',
          label: 'Retrain when metrics regress',
          layer: 'capabilities',
          productionOnly: true,
        },
      ],
      excludes: ['Multi-agent orchestration', 'Vector DB (unless hybrid)'],
    },
    layers: ['data', 'capabilities', 'model-access', 'build-ship'],
    mvp: [
      'Curated training set',
      'PEFT training (Axolotl / Unsloth / TRL)',
      'Local inference server',
      'Harness on domain metrics',
    ],
    production: [
      'Model versioning and rollback',
      'Serving autoscaling',
      'Side-by-side eval vs base model',
    ],
    mistakes: [
      'Fine-tuning for facts that change weekly (use RAG)',
      'No eval set aligned to production task',
    ],
    usuallySkip: ['Large agent orchestration', 'Vector DB unless hybrid RAG+FT'],
    related: ['compare:rag-finetune', 'glossary:peft', 'pattern:fine-tune-domain'],
  },
]
