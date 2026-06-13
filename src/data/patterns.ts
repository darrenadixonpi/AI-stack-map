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
    id: 'multimodal-input',
    title: 'Multimodal input pipeline (image / audio / document)',
    shortLabel: 'Multimodal',
    summary:
      'Process images, audio, or mixed documents through a vision or audio model and route structured results downstream — no retrieval loop needed.',
    diagram: {
      envelope: [{ id: 'ui', label: 'Upload / webhook surface', layer: 'product' }],
      pipeline: [
        { id: 'validate', label: 'Validate & pre-process file', layer: 'product' },
        { id: 'call', label: 'Multimodal model call', layer: 'model-access' },
        { id: 'extract', label: 'Extract structured result', layer: 'capabilities' },
        { id: 'route', label: 'Route / store output', layer: 'data' },
      ],
      supporting: [
        { id: 'eval', label: 'Eval on edge-case inputs', layer: 'build-ship' },
        { id: 'cost', label: 'Token / file cost monitoring', layer: 'build-ship' },
      ],
      excludes: ['Vector DB (unless outputs feed RAG)', 'Agent loop', 'Fine-tune for most cases'],
    },
    layers: ['product', 'capabilities', 'model-access', 'data', 'build-ship'],
    mvp: [
      'Multimodal model API (GPT-4o, Claude Vision, Gemini)',
      'File upload + basic format validation',
      'Structured output / JSON mode for extraction',
      'Simple store for results',
    ],
    production: [
      'Eval set covering edge cases (blurry, rotated, mixed-language)',
      'Cost monitoring per file type and size',
      'Fallback routing for unsupported formats',
      'PII redaction if images contain sensitive data',
    ],
    mistakes: [
      'Treating OCR and vision as equivalent — vision models handle layout and context, OCR does not',
      'Skipping eval: multimodal quality degrades sharply on edge inputs',
      'Sending raw high-res files without resize — token cost scales with image dimensions',
    ],
    usuallySkip: ['Fine-tuning on visual tasks before eval shows it helps', 'Vector DB unless outputs feed a RAG pipeline', 'Agent loop for fixed extraction tasks'],
    related: ['glossary:structured-output', 'compare:structured-output-tools'],
  },
  {
    id: 'gateway-internal',
    title: 'Gateway-only internal tool (no custom product layer)',
    shortLabel: 'Gateway tool',
    summary:
      'Route all team LLM calls through a central gateway — no custom UI, just policy, cost controls, logging, and model routing.',
    diagram: {
      pipeline: [
        { id: 'gateway', label: 'LLM gateway (LiteLLM / Portkey)', layer: 'governance' },
        { id: 'route', label: 'Route to model(s)', layer: 'model-access' },
      ],
      supporting: [
        { id: 'auth', label: 'Key management & auth', layer: 'governance' },
        { id: 'budget', label: 'Per-team budget caps', layer: 'governance' },
        { id: 'log', label: 'Audit log + tracing', layer: 'build-ship' },
      ],
      excludes: ['Custom product UI', 'RAG pipeline', 'Agent orchestration'],
    },
    layers: ['model-access', 'governance', 'build-ship'],
    mvp: [
      'LiteLLM or Portkey proxy in front of model APIs',
      'API key abstraction per team or service',
      'Basic usage logging',
    ],
    production: [
      'Per-team and per-model spend caps',
      'Fallback routing (e.g. Azure OpenAI → OpenAI on failure)',
      'Audit log for compliance',
      'Rate limits and model allowlists per consumer',
    ],
    mistakes: [
      'Letting teams call model APIs directly — loses spend visibility and key rotation control',
      'No auth on the gateway itself — internal does not mean safe to expose',
      'Skipping logs: the first cost spike will be invisible without them',
    ],
    usuallySkip: ['Custom UI', 'RAG stack', 'Fine-tuning', 'Agent framework'],
    related: ['glossary:gateway', 'compare:compliance-residency', 'compare:local-api'],
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
    related: ['compare:rag-finetune', 'glossary:peft', 'glossary:fine-tuning'],
  },
  {
    id: 'realtime-inference',
    title: 'Real-time / streaming inference (low latency)',
    shortLabel: 'Real-time',
    summary:
      'Interactive, user-facing responses — chat, voice, autocomplete — where time-to-first-token and tail latency matter more than raw throughput. Stream early; keep the hot path short.',
    diagram: {
      envelope: [{ id: 'client', label: 'Streaming UI (SSE / WebSocket)', layer: 'product' }],
      pipeline: [
        { id: 'route', label: 'Router + health-based fallback', layer: 'model-access' },
        { id: 'cache', label: 'Semantic cache lookup', layer: 'capabilities' },
        { id: 'serve', label: 'Low-latency inference (stream)', layer: 'model-access' },
        { id: 'stream', label: 'Stream tokens to user', layer: 'product' },
      ],
      supporting: [
        { id: 'latency', label: 'TTFT + p95/p99 monitoring', layer: 'build-ship' },
        { id: 'warm', label: 'Warm pool / autoscaling', layer: 'build-ship' },
        { id: 'limit', label: 'Rate limit / load shedding', layer: 'governance' },
      ],
      feedback: [
        {
          fromStepId: 'serve',
          toStepId: 'cache',
          label: 'Populate cache on miss',
          layer: 'capabilities',
          productionOnly: true,
        },
      ],
      excludes: ['Multi-hop RAG in the hot path', 'Agent loop', 'Batch jobs on the same endpoint'],
    },
    layers: ['product', 'capabilities', 'model-access', 'build-ship', 'governance'],
    mvp: [
      'Streaming-capable endpoint (Groq / vLLM / TGI or a streaming model API)',
      'Server-sent events or WebSocket transport to the client',
      'Token-by-token rendering in the UI (show output as it arrives)',
      'Request timeout + one fallback model',
    ],
    production: [
      'Semantic cache for repeat/near-duplicate prompts (cuts hot-path latency)',
      'Latency SLOs on time-to-first-token and p95/p99 (not just average)',
      'Warm pools / autoscaling to avoid cold-start spikes on self-hosted GPUs',
      'Router with health-based fallback when a provider degrades',
      'Load shedding / graceful degradation under burst traffic',
    ],
    mistakes: [
      'Optimising average latency instead of p95/p99 and time-to-first-token — the tail is what users feel',
      'Putting multi-hop RAG or an agent loop on the hot path without budgeting their round-trips',
      'No streaming — making users wait for the full completion before anything appears',
      'Cold starts on idle self-hosted GPUs with no warm pool — the first request after a lull is brutal',
    ],
    usuallySkip: [
      'Heavy multi-hop RAG in the hot path (precompute or cache instead)',
      'Agent loops on latency-critical surfaces',
      'Fine-tuning before profiling shows model size is the bottleneck',
    ],
    related: ['glossary:inference-server', 'glossary:semantic-cache', 'compare:local-api'],
  },
  {
    id: 'eval-driven-loop',
    title: 'Eval-driven development loop',
    shortLabel: 'Eval loop',
    summary:
      'Lead with evals: write a labeled eval set before you build, gate every prompt or model change on it, trace production, and feed real failures back into the set.',
    diagram: {
      envelope: [{ id: 'feature', label: 'LLM feature under test', layer: 'product' }],
      pipeline: [
        { id: 'evalset', label: 'Define eval set + metrics', layer: 'build-ship' },
        { id: 'build', label: 'Build / change prompt or chain', layer: 'capabilities' },
        { id: 'run', label: 'Run harness (offline)', layer: 'build-ship' },
        { id: 'gate', label: 'Gate: ship only if no regression', layer: 'build-ship' },
      ],
      supporting: [
        { id: 'trace', label: 'Production tracing', layer: 'build-ship' },
        { id: 'judge', label: 'LLM-as-judge + human spot-check', layer: 'build-ship' },
        { id: 'version', label: 'Prompt + model versioning', layer: 'build-ship' },
      ],
      feedback: [
        {
          fromStepId: 'gate',
          toStepId: 'build',
          label: 'Regression → iterate before shipping',
          layer: 'capabilities',
        },
        {
          fromStepId: 'trace',
          toStepId: 'evalset',
          label: 'Add real production failures to the eval set',
          layer: 'build-ship',
          productionOnly: true,
        },
      ],
      excludes: ['Shipping prompt changes with no eval gate', 'Vibes-based "looks good to me" review'],
    },
    layers: ['product', 'capabilities', 'model-access', 'build-ship'],
    mvp: [
      'A labeled eval set that mirrors real tasks (start with 20–50 cases)',
      'An eval runner / harness (promptfoo, DeepEval, Ragas, or lm-eval-harness)',
      'A score or pass/fail threshold agreed before you change the prompt',
      'Versioned prompts so you can diff what actually changed',
    ],
    production: [
      'CI gate that blocks deploys which regress the eval set',
      'Production tracing wired back to grow the eval set from real failures',
      'LLM-as-judge for scale, periodically checked against human labels',
      'A held-out set to detect overfitting to the eval cases',
    ],
    mistakes: [
      'Building first and writing evals later — the set ends up shaped to pass',
      'Trusting LLM-as-judge without ever checking it against human labels',
      'Reusing one eval set until the prompt overfits it — keep a held-out set',
      'Reporting an average that hides a handful of catastrophic failures',
    ],
    usuallySkip: [
      'A vector DB or agent framework unless the feature itself needs one',
      'Fine-tuning before evals show the base model is the ceiling',
    ],
    related: ['glossary:harness', 'glossary:eval-platform', 'compare:harness-observability'],
  },
]
