import { tools } from '../data/tools'
import { layers, layerOrder } from '../data/layers'
import type { SkillFloor, StackSketchState } from '../types'

export interface StaffingSummary {
  overall: SkillFloor
  counts: Record<SkillFloor, number>
  picks: { floor: SkillFloor; layer: string; tool: string }[]
  note: string
}

const RANK: Record<SkillFloor, number> = { low: 1, medium: 2, high: 3 }

/**
 * Derive a rough staffing / skill-floor readout from the tools explicitly
 * picked in a sketch. Only concrete `tool:` picks carry a skill floor; type-only
 * or "decide later" slots are ignored. Returns null when no tool is picked.
 */
export function getStaffingSummary(state: StackSketchState): StaffingSummary | null {
  const picks: StaffingSummary['picks'] = []
  for (const layerId of layerOrder) {
    if (!state.layers.includes(layerId)) continue
    const pick = state.picks[layerId]
    if (!pick || !pick.startsWith('tool:')) continue
    const tool = tools.find((t) => t.id === pick.slice('tool:'.length))
    if (!tool) continue
    picks.push({
      floor: tool.skillFloor,
      layer: layers.find((l) => l.id === layerId)?.shortName ?? layerId,
      tool: tool.name,
    })
  }
  if (picks.length === 0) return null

  const counts: Record<SkillFloor, number> = { low: 0, medium: 0, high: 0 }
  for (const p of picks) counts[p.floor]++
  const overall = picks.reduce<SkillFloor>(
    (acc, p) => (RANK[p.floor] > RANK[acc] ? p.floor : acc),
    'low',
  )
  const note =
    overall === 'high'
      ? 'At least one pick needs specialist depth — plan for an experienced ML / platform engineer.'
      : overall === 'medium'
        ? 'A capable software engineer with some AI experience can own this stack.'
        : 'Low skill floor — an app developer can stand this up without deep ML expertise.'
  return { overall, counts, picks, note }
}
