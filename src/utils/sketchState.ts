import { layerOrder } from '../data/layers'
import type { BuilderResult, LayerId, StackSketchState } from '../types'

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

export function decodeSketchState(anchor: string | undefined): StackSketchState | null {
  if (!anchor || anchor.length < 8) return null
  try {
    const b64 = padBase64(anchor.replace(/-/g, '+').replace(/_/g, '/'))
    const binary = atob(b64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as StackSketchState
    if (!Array.isArray(parsed.layers)) return null
    return {
      title: parsed.title ?? 'My AI stack sketch',
      layers: parsed.layers.filter((l): l is LayerId => layerOrder.includes(l as LayerId)),
      picks: parsed.picks ?? {},
      phases: parsed.phases ?? {},
      ignore: Array.isArray(parsed.ignore) ? parsed.ignore : [],
    }
  } catch {
    return null
  }
}
