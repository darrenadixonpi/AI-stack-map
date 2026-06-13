import type { LayerId } from '../types'

/**
 * For each comparison topic, the layers that make it relevant.
 * A sketch scores a topic by counting how many of its layers appear in the sketch.
 */
const COMPARISON_LAYER_RELEVANCE: Record<string, LayerId[]> = {
  'langchain-llamaindex-sdk':   ['orchestration'],
  'vector-pg-elastic':          ['data'],
  'agent-workflow':             ['orchestration'],
  'rag-finetune':               ['capabilities', 'data'],
  'local-api':                  ['model-access'],
  'harness-observability':      ['build-ship'],
  'mcp-custom-tools':           ['orchestration', 'capabilities'],
  'platform-assemble':          ['product'],
  'reranker-none':              ['capabilities', 'data'],
  'structured-output-tools':    ['capabilities', 'model-access'],
  'compliance-residency':       ['governance', 'model-access'],
  'packaged-vs-custom-stack':   ['product'],
  'rpa-vs-agent-workflow':      ['orchestration', 'product'],
  'enterprise-search-vs-rag':   ['data', 'capabilities', 'product'],
  'horizontal-vs-vertical-app': ['product'],
}

/**
 * Returns up to `limit` comparison IDs most relevant to the given sketch layers,
 * ranked by number of matching layers (ties broken by order above).
 */
export function getRelevantComparisons(
  sketchLayers: LayerId[],
  limit = 3,
): string[] {
  if (sketchLayers.length === 0) return []

  const scored = Object.entries(COMPARISON_LAYER_RELEVANCE)
    .map(([id, relevantLayers]) => ({
      id,
      score: relevantLayers.filter((l) => sketchLayers.includes(l)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(({ id }) => id)
}
