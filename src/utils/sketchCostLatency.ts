import { layerOrder } from '../data/layers'
import type { LayerId, StackSketchState } from '../types'

export interface CostLatencyEnvelope {
  costTier: '$' | '$$' | '$$$'
  costDrivers: string[]
  latencyBand: string
  latencyNote: string
}

const has = (s: StackSketchState, id: LayerId) => s.layers.includes(id)

/**
 * A deliberately rough, RELATIVE cost + latency envelope for a sketch — never an
 * absolute price or SLA. Uses tiers ($/$$/$$$) and bands so it does not go stale
 * as vendor pricing changes. Drivers explain the rating; always load-test before
 * committing.
 */
export function getCostLatencyEnvelope(state: StackSketchState): CostLatencyEnvelope {
  let score = 1
  const costDrivers: string[] = []

  if (has(state, 'orchestration')) {
    score += 2
    costDrivers.push('Agent loop — several model calls per request')
  }
  if (has(state, 'capabilities')) {
    score += 1
    costDrivers.push('Embeddings + retrieval add calls per request')
  }
  if (has(state, 'data')) {
    score += 1
    costDrivers.push('Vector store / data pipeline to run and keep warm')
  }
  const growthCount = layerOrder.filter(
    (id) => state.layers.includes(id) && state.phases[id] === 'growth',
  ).length
  if (growthCount >= 3) {
    score += 1
    costDrivers.push('Several layers planned at growth scale')
  }
  if (costDrivers.length === 0) {
    costDrivers.push('Mostly a single model API call')
  }

  const costTier: CostLatencyEnvelope['costTier'] = score <= 2 ? '$' : score <= 4 ? '$$' : '$$$'

  let latencyBand: string
  let latencyNote: string
  if (has(state, 'orchestration')) {
    latencyBand = 'Multi-second'
    latencyNote =
      'Agent loops chain several model calls — budget for the worst case, not the average, and show progress in the UI.'
  } else if (has(state, 'capabilities')) {
    latencyBand = 'Sub-second to ~2s'
    latencyNote =
      'Retrieval plus a single generation. Cache repeat queries and stream tokens so output appears immediately.'
  } else {
    latencyBand = 'Streaming, <1s to first token'
    latencyNote = 'A single model call — stream tokens so the user sees output right away.'
  }

  return { costTier, costDrivers, latencyBand, latencyNote }
}
