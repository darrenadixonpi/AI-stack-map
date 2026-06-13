import type { LayerId } from '../types'

export type HintSeverity = 'warning' | 'info'

export interface SketchHint {
  id: string
  severity: HintSeverity
  message: string
  /** What to consider adding or checking */
  suggestion: string
}

const has = (layers: LayerId[], id: LayerId) => layers.includes(id)

/**
 * Rules-based soft hints for a sketch layer selection.
 * Returns only hints that apply; empty array = no issues.
 * All hints are informational — none block the user.
 */
export function getSketchHints(layers: LayerId[]): SketchHint[] {
  const hints: SketchHint[] = []

  // Agents without tracing/eval is nearly always a prod problem
  if (has(layers, 'orchestration') && !has(layers, 'build-ship')) {
    hints.push({
      id: 'agent-no-eval',
      severity: 'warning',
      message: 'Agent loop without observability or eval',
      suggestion:
        'Add a Build & ship layer for tracing (Langfuse, Weave) and an offline eval harness — agent failures are subtle and hard to catch without logs.',
    })
  }

  // Agents without cost/policy controls
  if (has(layers, 'orchestration') && !has(layers, 'governance')) {
    hints.push({
      id: 'agent-no-governance',
      severity: 'warning',
      message: 'Agents without cost caps or policy guardrails',
      suggestion:
        'Add a Governance layer for spend limits, tool allowlists, and moderation. Unconstrained agent loops can exhaust API budgets or bypass safety checks.',
    })
  }

  // RAG/retrieval without somewhere to put the data
  if (has(layers, 'capabilities') && !has(layers, 'data')) {
    hints.push({
      id: 'rag-no-data',
      severity: 'info',
      message: 'Retrieval or RAG in capabilities — but no data layer',
      suggestion:
        'If you are using RAG or tool-retrieved context, add a Data layer for your vector store, document loader, and embedding pipeline.',
    })
  }

  // Non-trivial stack with no observability at all
  if (layers.length >= 3 && !has(layers, 'build-ship')) {
    // Only fire this if the agent hint didn't already fire (avoid double-hint)
    if (!has(layers, 'orchestration')) {
      hints.push({
        id: 'no-observability',
        severity: 'info',
        message: 'Multi-layer stack with no Build & ship layer',
        suggestion:
          'Even without agents, adding tracing and a basic eval harness will save time when latency or accuracy drifts in production.',
      })
    }
  }

  // Retrieval stack with a data layer but no eval harness
  if (has(layers, 'capabilities') && has(layers, 'data') && !has(layers, 'build-ship')) {
    hints.push({
      id: 'rag-no-eval',
      severity: 'info',
      message: 'Retrieval stack without an eval harness',
      suggestion:
        'RAG quality (recall, faithfulness) degrades silently as your corpus changes. Add a Build & ship layer with a small eval set (Ragas, promptfoo) before you scale.',
    })
  }

  // Governance controls you cannot verify without observability
  if (has(layers, 'governance') && !has(layers, 'build-ship') && !has(layers, 'orchestration')) {
    hints.push({
      id: 'governance-no-obs',
      severity: 'info',
      message: 'Policy and cost caps with no observability',
      suggestion:
        'You can only prove guardrails and spend limits work if you log them. Add a Build & ship layer for traces and spend metrics.',
    })
  }

  // A product/UX layer with nothing serving the model
  if (has(layers, 'product') && !has(layers, 'model-access') && !has(layers, 'orchestration')) {
    hints.push({
      id: 'product-no-model',
      severity: 'warning',
      message: 'Product layer with no model access',
      suggestion:
        'A product or UX layer needs a model behind it. Add Model access — an API, a gateway, or a self-hosted inference server.',
    })
  }

  // A data layer that nothing retrieves from
  if (has(layers, 'data') && !has(layers, 'capabilities')) {
    hints.push({
      id: 'data-no-capabilities',
      severity: 'info',
      message: 'Data layer without a capabilities layer',
      suggestion:
        'A vector store or document pipeline usually feeds retrieval. Add a Capabilities layer (embeddings, RAG) — unless this data is only for fine-tuning.',
    })
  }

  return hints
}
