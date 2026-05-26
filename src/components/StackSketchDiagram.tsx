import { labelForPickId } from '../data/sketchPicks'
import { layers, layerOrder } from '../data/layers'
import type { SketchPhase, StackSketchState } from '../types'

interface Props {
  state: StackSketchState
}

export function StackSketchDiagram({ state }: Props) {
  const enabled = layerOrder.filter((id) => state.layers.includes(id))

  if (enabled.length === 0) {
    return (
      <p className="sketch-diagram-empty" style={{ color: 'var(--text-muted)' }}>
        Enable at least one layer to preview your sketch.
      </p>
    )
  }

  return (
    <figure className="sketch-stack" aria-label="Stack sketch diagram">
      {enabled.map((layerId, index) => {
        const layer = layers.find((l) => l.id === layerId)!
        const phase: SketchPhase = state.phases[layerId] ?? 'mvp'
        const pickLabel = labelForPickId(state.picks[layerId])
        return (
          <div key={layerId} className="sketch-stack-row">
            {index > 0 && (
              <span className="sketch-stack-arrow" aria-hidden>
                ↓
              </span>
            )}
            <div
              className={`sketch-layer-card flow-step${phase === 'growth' ? ' sketch-phase-growth' : ''}`}
              data-layer={layerId}
              data-phase={phase}
            >
              <div className="sketch-layer-head">
                <span className="flow-layer">{layer.shortName}</span>
                <span className={`sketch-phase-badge sketch-phase-${phase}`}>
                  {phase === 'mvp' ? 'MVP' : 'Growth'}
                </span>
              </div>
              <span className="flow-label sketch-pick-label">{pickLabel}</span>
            </div>
          </div>
        )
      })}
    </figure>
  )
}
