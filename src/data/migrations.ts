import type { LayerId } from '../types'

export interface MigrationPath {
  id: string
  from: string
  to: string
  /** When the move is worth making */
  trigger: string
  note: string
  layer: LayerId
}

/**
 * Common "you have outgrown X, move to Y" paths. Neutral and tool-type-first:
 * the trigger is the signal to migrate, not a vendor push.
 */
export const migrationPaths: MigrationPath[] = [
  {
    id: 'ollama-to-served',
    from: 'Ollama (local dev)',
    to: 'vLLM / TGI (served)',
    trigger: 'Concurrent users and throughput outgrow a single-stream local runtime',
    note: 'Ollama is excellent for prototyping. Switch to vLLM or TGI when you need batching, higher throughput, and autoscaling behind an API.',
    layer: 'model-access',
  },
  {
    id: 'pgvector-to-dedicated',
    from: 'pgvector',
    to: 'Dedicated vector DB (Qdrant, etc.)',
    trigger: 'Corpus size, QPS, or filtering needs exceed what Postgres serves at your target latency',
    note: 'pgvector keeps data in one place early on. Move to a dedicated store when index size, metadata filtering, or recall needs specialised infrastructure.',
    layer: 'data',
  },
  {
    id: 'direct-to-gateway',
    from: 'Direct model API calls',
    to: 'Gateway + router',
    trigger: 'Multiple teams or providers, or you need spend caps and provider fallback',
    note: 'A gateway centralises keys, logging, and budgets; a router adds health-based failover and cost-aware routing on top.',
    layer: 'governance',
  },
  {
    id: 'prompt-to-finetune',
    from: 'Prompt engineering',
    to: 'Fine-tune / PEFT',
    trigger: 'You have hit a quality or format ceiling and the target behaviour is stable',
    note: 'Exhaust prompting and few-shot first. Fine-tune only when evals show the base model is the bottleneck and the task format is fixed.',
    layer: 'capabilities',
  },
  {
    id: 'manual-to-evalgate',
    from: 'Manual spot-checks',
    to: 'Eval harness + CI gate',
    trigger: 'More than one person ships prompt changes and regressions start slipping through',
    note: 'Once changes cause silent quality drops, add a labeled eval set and block deploys that regress it.',
    layer: 'build-ship',
  },
]
