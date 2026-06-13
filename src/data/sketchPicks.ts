import { applicationProducts } from './applicationTools'
import { layers } from './layers'
import { tools } from './tools'
import type { LayerId } from '../types'

export type SketchPickKind = 'type' | 'tool' | 'app' | 'skip'

export interface SketchPickOption {
  id: string
  label: string
  kind: SketchPickKind
}

const SKIP_OPTION: SketchPickOption = { id: '', label: '— Decide later —', kind: 'skip' }

// If a layer gains more tools than these caps, extras are silently dropped from
// the sketch pick dropdown. Raise the cap or split the layer before that happens.
const MAX_TOOLS_PER_LAYER = 6
const MAX_APPS_PER_LAYER = 3

export function getSketchPicksForLayer(layerId: LayerId): SketchPickOption[] {
  const layer = layers.find((l) => l.id === layerId)
  if (!layer) return [SKIP_OPTION]

  const typeOpts: SketchPickOption[] = layer.toolTypes.map((t) => ({
    id: `type:${t}`,
    label: t,
    kind: 'type',
  }))

  const layerTools = tools.filter((t) => t.layer === layerId)
  if (import.meta.env.DEV && layerTools.length > MAX_TOOLS_PER_LAYER) {
    console.warn(
      `sketchPicks: layer "${layerId}" has ${layerTools.length} tools but MAX_TOOLS_PER_LAYER=${MAX_TOOLS_PER_LAYER}. ` +
        `${layerTools.length - MAX_TOOLS_PER_LAYER} tool(s) will be hidden from the sketch dropdown.`,
    )
  }
  const toolOpts: SketchPickOption[] = layerTools
    .slice(0, MAX_TOOLS_PER_LAYER)
    .map((t) => ({
      id: `tool:${t.id}`,
      label: t.name,
      kind: 'tool',
    }))

  const layerApps = applicationProducts.filter((a) => a.stackLayers.includes(layerId))
  const appOpts: SketchPickOption[] = layerApps
    .slice(0, MAX_APPS_PER_LAYER)
    .map((a) => ({
      id: `app:${a.id}`,
      label: `${a.name} (buy)`,
      kind: 'app',
    }))

  return [SKIP_OPTION, ...typeOpts, ...toolOpts, ...appOpts]
}

export function labelForPickId(pickId: string | undefined): string {
  if (!pickId) return '— Decide later —'
  const colon = pickId.indexOf(':')
  const kind = colon >= 0 ? pickId.slice(0, colon) : ''
  const ref = colon >= 0 ? pickId.slice(colon + 1) : pickId
  if (kind === 'type') return ref
  if (kind === 'tool') {
    const t = tools.find((x) => x.id === ref)
    return t?.name ?? ref
  }
  if (kind === 'app') {
    const a = applicationProducts.find((x) => x.id === ref)
    return a ? `${a.name} (buy)` : ref
  }
  return pickId
}

export function catalogAnchorForPick(pickId: string): string | null {
  if (pickId.startsWith('tool:')) return `tool-${pickId.slice(5)}`
  if (pickId.startsWith('app:')) return `app-${pickId.slice(4)}`
  return null
}
