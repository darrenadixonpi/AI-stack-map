import { layerOrder } from '../data/layers'
import type { BuilderResult, LayerId, SketchLayerMode, StackPattern, StackSketchState } from '../types'

export function emptySketchState(): StackSketchState {
  return {
    title: 'My AI stack sketch',
    layers: ['product', 'model-access', 'build-ship'],
    picks: {},
    phases: {
      product: 'mvp',
      'model-access': 'mvp',
      'build-ship': 'mvp',
    },
    ignore: [],
  }
}

export function sketchFromPattern(pattern: StackPattern): StackSketchState {
  const ordered = layerOrder.filter((id) => pattern.layers.includes(id))
  const phases: StackSketchState['phases'] = {}
  for (const id of ordered) {
    phases[id] = 'mvp'
  }
  return {
    title: pattern.title,
    layers: ordered,
    picks: {},
    phases,
    ignore: [...pattern.usuallySkip],
  }
}

/**
 * Merge a builder result back into an existing sketch.
 * Layers the builder recommends are added (preserving existing picks/phases).
 * Layers the builder omits are removed, but their picks/phases stay in case the
 * user re-adds them later — only `layers[]` shrinks.
 */
export function mergeSketchWithBuilder(
  existing: StackSketchState,
  result: BuilderResult,
): StackSketchState {
  const newLayers = layerOrder.filter((id) => result.layers.includes(id))
  const phases: StackSketchState['phases'] = {}
  for (const id of newLayers) {
    phases[id] = existing.phases[id] ?? 'mvp'
  }
  return {
    title: existing.title,
    layers: newLayers.length > 0 ? newLayers : ['model-access', 'build-ship'],
    picks: { ...existing.picks }, // keep all picks; UI filters by active layers
    phases,
    ignore: [...result.ignoreForNow],
  }
}

export function defaultSketchFromBuilder(result: BuilderResult): StackSketchState {
  const ordered = layerOrder.filter((id) => result.layers.includes(id))
  const phases: StackSketchState['phases'] = {}
  for (const id of ordered) {
    phases[id] = 'mvp'
  }
  return {
    title: 'Stack from builder',
    layers: ordered.length > 0 ? ordered : ['model-access', 'build-ship'],
    picks: {},
    phases,
    ignore: [...result.ignoreForNow],
  }
}

function padBase64(b64: string): string {
  const rem = b64.length % 4
  if (rem === 0) return b64
  return b64 + '='.repeat(4 - rem)
}

export function encodeSketchState(state: StackSketchState): string {
  const json = JSON.stringify(state)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function encodeCompareAnchor(a: StackSketchState, b: StackSketchState): string {
  return `compare/${encodeSketchState(a)}/${encodeSketchState(b)}`
}

export function parseCompareAnchor(
  anchor: string | undefined,
): [StackSketchState, StackSketchState] | null {
  if (!anchor?.startsWith('compare/')) return null
  const rest = anchor.slice('compare/'.length)
  const slash = rest.indexOf('/')
  if (slash === -1) return null
  const a = decodeSketchState(rest.slice(0, slash))
  const b = decodeSketchState(rest.slice(slash + 1))
  if (!a || !b) return null
  return [a, b]
}

export function decodeSketchState(anchor: string | undefined): StackSketchState | null {
  if (!anchor || anchor.length < 8) return null
  try {
    const b64 = padBase64(anchor.replace(/-/g, '+').replace(/_/g, '/'))
    const binary = atob(b64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as StackSketchState
    if (!Array.isArray(parsed.layers)) return null
    const VALID_MODES: SketchLayerMode[] = ['build', 'buy', 'hybrid']
    const rawModes = parsed.modes ?? {}
    const modes: StackSketchState['modes'] = {}
    for (const [k, v] of Object.entries(rawModes)) {
      if (layerOrder.includes(k as LayerId) && VALID_MODES.includes(v as SketchLayerMode)) {
        modes[k as LayerId] = v as SketchLayerMode
      }
    }
    return {
      title: parsed.title ?? 'My AI stack sketch',
      layers: parsed.layers.filter((l): l is LayerId => layerOrder.includes(l as LayerId)),
      picks: parsed.picks ?? {},
      phases: parsed.phases ?? {},
      ignore: Array.isArray(parsed.ignore) ? parsed.ignore : [],
      modes: Object.keys(modes).length > 0 ? modes : undefined,
    }
  } catch {
    return null
  }
}
