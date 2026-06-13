import type { PatternExtras } from '../types'

/**
 * Business-facing framing (problem / ROI levers / KPIs / risks) and canonical
 * reference implementations, keyed by StackPattern id. Everything here is
 * optional — patterns render their core content with or without an entry.
 *
 * References point to stable, canonical project repositories rather than blog
 * posts, to limit link rot. Re-check on each content review pass.
 */
export const patternExtras: Record<string, PatternExtras> = {
  'doc-qa': {
    businessCase: {
      problem:
        'Employees lose hours hunting through scattered docs, wikis, and PDFs for answers that already exist somewhere.',
      roiLevers: [
        'Time saved per lookup vs. manual search',
        'Fewer escalations to subject-matter experts',
        'Faster onboarding for new staff',
      ],
      kpis: ['Median time-to-answer', 'Deflection rate (resolved without a human)', 'Answer acceptance rate', 'Weekly active users'],
      risks: [
        'Confidently wrong answers erode trust quickly',
        'A stale index returns outdated answers',
        'Surfacing documents a user should not be able to see',
      ],
    },
    references: [
      { label: 'LlamaIndex (RAG framework)', url: 'https://github.com/run-llama/llama_index' },
      { label: 'LangChain', url: 'https://github.com/langchain-ai/langchain' },
    ],
  },
  'support-assist': {
    businessCase: {
      problem:
        'Support agents retype the same answers and dig through the knowledge base while queues and handle times grow.',
      roiLevers: [
        'Lower average handle time per ticket',
        'More tickets per agent without added headcount',
        'More consistent answer quality',
      ],
      kpis: ['Average handle time', 'First-contact resolution', 'CSAT on assisted replies', 'Suggestion acceptance rate'],
      risks: [
        'Auto-sending an unreviewed reply damages customer trust',
        'Suggestions learned from poor past tickets propagate errors',
        'Agents over-trusting drafts and skipping review',
      ],
    },
    references: [{ label: 'LangChain', url: 'https://github.com/langchain-ai/langchain' }],
  },
  'research-code': {
    businessCase: {
      problem:
        'Skilled engineers and analysts spend large blocks of time on boilerplate, search, and multi-step investigation an agent can accelerate.',
      roiLevers: [
        'Engineer hours reclaimed for higher-value work',
        'Faster cycle time on investigations and fixes',
        'Lower context-switching cost',
      ],
      kpis: ['Task completion without human takeover', 'Cycle time per task', 'Cost per completed task', 'Tool-call success rate'],
      risks: [
        'Unbounded agent loops burn money and time',
        'Unsandboxed tool use on real systems is dangerous',
        'Failures are hard to debug without tracing',
      ],
    },
    references: [
      { label: 'AutoGen (multi-agent)', url: 'https://github.com/microsoft/autogen' },
      { label: 'LangGraph (agent graphs)', url: 'https://github.com/langchain-ai/langgraph' },
    ],
  },
  'batch-classify': {
    businessCase: {
      problem:
        'Large backlogs of documents, tickets, or records need consistent tagging or extraction that is too slow and costly by hand.',
      roiLevers: [
        'Labor displaced from manual tagging',
        'Predictable per-item cost at scale',
        'More consistent labels than ad-hoc human rating',
      ],
      kpis: ['Accuracy / F1 vs. a labeled gold set', 'Cost per 1,000 items', 'Throughput (items/hour)', 'Manual-review rate'],
      risks: [
        'Silent accuracy drift as input data shifts',
        'Reporting playground accuracy instead of held-out accuracy',
        'Over-engineering a fixed-schema task',
      ],
    },
    references: [{ label: 'Hugging Face Transformers', url: 'https://github.com/huggingface/transformers' }],
  },
  'multimodal-input': {
    businessCase: {
      problem:
        'Valuable information is locked inside images, scans, audio, and mixed documents that text-only systems cannot process.',
      roiLevers: [
        'Automating manual data entry from documents and media',
        'Unlocking previously unusable content',
        'Faster processing of forms and media at scale',
      ],
      kpis: ['Extraction accuracy on edge cases', 'Cost per file by type and size', 'Straight-through-processing rate', 'Turnaround time per item'],
      risks: [
        'Quality degrades sharply on poor-quality inputs',
        'Token cost scales with image size — surprise bills',
        'Sensitive content (PII) hidden inside images',
      ],
    },
    references: [{ label: 'Hugging Face Transformers', url: 'https://github.com/huggingface/transformers' }],
  },
  'gateway-internal': {
    businessCase: {
      problem:
        'Teams call model APIs directly with no central control, so spend, keys, and usage are invisible and ungoverned.',
      roiLevers: [
        'Spend visibility and per-team budget control',
        'Avoided overspend via caps and routing',
        'Reduced key-rotation and audit overhead',
      ],
      kpis: ['Spend per team / service', 'Cost saved via caching and routing', 'Time to rotate or revoke a key', 'Policy / audit coverage'],
      risks: [
        'An unauthenticated internal gateway is still a breach risk',
        'Single point of failure without fallback routing',
        'Cost spikes stay invisible without logging',
      ],
    },
    references: [{ label: 'LiteLLM (gateway / proxy)', url: 'https://github.com/BerriAI/litellm' }],
  },
  'fine-tune-domain': {
    businessCase: {
      problem:
        'A general model cannot reliably hit a required tone, format, or narrow-domain behavior, and prompt engineering has hit a ceiling.',
      roiLevers: [
        'A smaller, cheaper model matching a larger one on the task',
        'Lower per-call cost at scale',
        'Consistent format and tone without long prompts',
      ],
      kpis: ['Task accuracy vs. base model', 'Cost per call vs. base model', 'Inference latency', 'Win rate in side-by-side eval'],
      risks: [
        'Knowledge that changes often is a poor fit (use RAG)',
        'Ongoing burden of retraining and versioning',
        'No eval set aligned to the production task',
      ],
    },
    references: [
      { label: 'TRL (HF fine-tuning)', url: 'https://github.com/huggingface/trl' },
      { label: 'Unsloth (efficient PEFT)', url: 'https://github.com/unslothai/unsloth' },
    ],
  },
  'realtime-inference': {
    businessCase: {
      problem:
        'User-facing AI feels sluggish; slow first-token and tail latency drive abandonment in chat, voice, and autocomplete.',
      roiLevers: [
        'Higher engagement and completion from faster responses',
        'Lower compute cost via caching of repeat prompts',
        'Better conversion on latency-sensitive surfaces',
      ],
      kpis: ['Time-to-first-token (p50/p95)', 'p95/p99 end-to-end latency', 'Cache hit rate', 'Session completion / abandonment'],
      risks: [
        'Optimising the average while the tail drives churn',
        'Cold-start spikes on idle self-hosted GPUs',
        'Latency-critical path bloated by RAG or agent hops',
      ],
    },
    references: [
      { label: 'vLLM (high-throughput serving)', url: 'https://github.com/vllm-project/vllm' },
      { label: 'Text Generation Inference (TGI)', url: 'https://github.com/huggingface/text-generation-inference' },
    ],
  },
  'eval-driven-loop': {
    businessCase: {
      problem:
        'Teams ship prompt and model changes on gut feel, so quality silently regresses and nobody can prove the system is improving.',
      roiLevers: [
        'Fewer quality regressions reaching users',
        'Faster, safer iteration behind a clear gate',
        'Objective evidence to justify changes and spend',
      ],
      kpis: ['Eval pass rate over time', 'Regressions caught pre-release', 'Mean time to detect a quality drop', 'Eval coverage of real failure modes'],
      risks: [
        'An eval set written after the fact is shaped to pass',
        'Overfitting to a stale eval set',
        'LLM-judge drift without human spot-checks',
      ],
    },
    references: [
      { label: 'promptfoo (eval + red-team)', url: 'https://github.com/promptfoo/promptfoo' },
      { label: 'Ragas (RAG eval)', url: 'https://github.com/explodinggradients/ragas' },
    ],
  },
}
