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

  return hints
}
