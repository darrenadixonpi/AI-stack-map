import { layers } from '../data/layers'
import type { LayerId, PatternDiagram, PatternDiagramStep } from '../types'

function layerName(id: LayerId): string {
  return layers.find((l) => l.id === id)?.shortName ?? id
}

function FlowStep({ step }: { step: PatternDiagramStep }) {
  return (
    <div className="flow-step" data-layer={step.layer}>
      <span className="flow-layer">{layerName(step.layer)}</span>
      <span className="flow-label">{step.label}</span>
    </div>
  )
}

function FlowArrow() {
  return (
    <span className="flow-arrow" aria-hidden>
      →
    </span>
  )
}

interface Props {
  diagram: PatternDiagram
  title: string
}

const FLOW_LEGEND = [
  { className: 'flow-legend-pipeline', label: 'Main path' },
  { className: 'flow-legend-envelope', label: 'Wraps flow' },
  { className: 'flow-legend-supporting', label: 'Also in play' },
  { className: 'flow-legend-feedback', label: '↺ Feedback loop' },
]

export function PatternFlowDiagram({ diagram, title }: Props) {
  return (
    <figure className="pattern-flow" aria-label={`${title} architecture flow`}>
      <figcaption className="flow-legend" aria-label="Diagram legend">
        {FLOW_LEGEND.map(({ className, label }) => (
          <span key={label} className={`flow-legend-item ${className}`}>
            {label}
          </span>
        ))}
      </figcaption>
      {diagram.envelope && diagram.envelope.length > 0 && (
        <div className="flow-row flow-envelope">
          <span className="flow-row-label">Wraps flow</span>
          <div className="flow-track">
            {diagram.envelope.map((step, i) => (
              <span key={step.id} className="flow-step-wrap">
                {i > 0 && <FlowArrow />}
                <FlowStep step={step} />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flow-row flow-pipeline">
        <span className="flow-row-label">Main path</span>
        <div className="flow-track">
          {diagram.pipeline.map((step, i) => (
            <span key={step.id} className="flow-step-wrap">
              {i > 0 && <FlowArrow />}
              <FlowStep step={step} />
            </span>
          ))}
        </div>
      </div>

      {diagram.supporting && diagram.supporting.length > 0 && (
        <div className="flow-row flow-supporting">
          <span className="flow-row-label">Also in play</span>
          <div className="flow-track">
            {diagram.supporting.map((step, i) => (
              <span key={step.id} className="flow-step-wrap">
                {i > 0 && <span className="flow-plus" aria-hidden>+</span>}
                <FlowStep step={step} />
              </span>
            ))}
          </div>
        </div>
      )}

      {diagram.feedback && diagram.feedback.length > 0 && (
        <ul className="flow-feedback">
          {diagram.feedback.map((fb) => (
            <li
              key={`${fb.fromStepId}-${fb.toStepId}-${fb.label}`}
              className={fb.productionOnly ? 'prod-only' : undefined}
            >
              <span className="flow-loop-icon" aria-hidden>
                ↺
              </span>
              <span>
                {fb.label}
                {fb.layer && (
                  <span className="flow-feedback-layer"> · {layerName(fb.layer)}</span>
                )}
                {fb.productionOnly && (
                  <span className="flow-feedback-tag"> (production)</span>
                )}
              </span>
              <span className="flow-feedback-path">
                {diagram.pipeline.find((s) => s.id === fb.fromStepId)?.label ?? fb.fromStepId}
                {' → '}
                {diagram.pipeline.find((s) => s.id === fb.toStepId)?.label ?? fb.toStepId}
              </span>
            </li>
          ))}
        </ul>
      )}

      {diagram.excludes && diagram.excludes.length > 0 && (
        <p className="flow-excludes">
          <strong>Not in this pattern:</strong> {diagram.excludes.join(' · ')}
        </p>
      )}
    </figure>
  )
}
