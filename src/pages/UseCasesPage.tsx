import { useEffect, useState } from 'react'
import { PatternFlowDiagram } from '../components/PatternFlowDiagram'
import { PatternSelector, type PatternFilter, type PatternId } from '../components/PatternSelector'
import { RelatedLinks } from '../components/RelatedLinks'
import { stackPatterns } from '../data/patterns'
import { patternExtras } from '../data/patternExtras'
import { migrationPaths } from '../data/migrations'
import { layers } from '../data/layers'
import { encodeSketchState, sketchFromPattern } from '../utils/sketchState'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
  scrollTo?: string
}

function isPatternId(id: string): id is PatternId {
  return stackPatterns.some((p) => p.id === id)
}

export function UseCasesPage({ onNavigate, scrollTo }: Props) {
  const [patternFilter, setPatternFilter] = useState<PatternFilter>(null)

  useEffect(() => {
    if (scrollTo && isPatternId(scrollTo)) {
      setPatternFilter(scrollTo)
    }
  }, [scrollTo])

  const visible =
    patternFilter === null
      ? stackPatterns
      : stackPatterns.filter((p) => p.id === patternFilter)

  return (
    <>
      <h2>Stack patterns</h2>
      <p className="lead">
        Recipes by outcome — optionally focus one pattern below. Each includes a layer-labeled flow,
        MVP vs production, and what to skip.
      </p>

      <div className="card pattern-selector-card">
        <PatternSelector value={patternFilter} onChange={setPatternFilter} />
      </div>

      <div id="patterns-list" className="patterns-list">
        {visible.map((pattern) => {
          const extras = patternExtras[pattern.id]
          return (
          <section key={pattern.id} id={pattern.id} className="pattern-section card">
            <h2>{pattern.title}</h2>
            <p>{pattern.summary}</p>
            <PatternFlowDiagram diagram={pattern.diagram} title={pattern.title} />
            <p className="layers-involved">
              <strong>Layers involved:</strong>{' '}
              {pattern.layers
                .map((lid) => layers.find((l) => l.id === lid)?.shortName ?? lid)
                .join(' · ')}
            </p>
            <div className="tier-block">
              <h4>MVP</h4>
              <ul>
                {pattern.mvp.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="tier-block">
              <h4>Production adds</h4>
              <ul>
                {pattern.production.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="tier-block">
              <h4>Usually skip</h4>
              <ul className="ignore-list">
                {pattern.usuallySkip.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <h3>Common mistakes</h3>
            <ul className="mistake-list">
              {pattern.mistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {extras?.businessCase && (
              <details className="pattern-business-case">
                <summary>Business case (for PMs &amp; buyers)</summary>
                <p className="business-problem">{extras.businessCase.problem}</p>
                <div className="business-grid">
                  <div>
                    <h5>ROI levers</h5>
                    <ul>
                      {extras.businessCase.roiLevers.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>KPIs to track</h5>
                    <ul>
                      {extras.businessCase.kpis.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Top risks</h5>
                    <ul>
                      {extras.businessCase.risks.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            )}
            {extras?.references && extras.references.length > 0 && (
              <p className="pattern-references">
                <strong>Reference implementations:</strong>{' '}
                {extras.references.map((r, i) => (
                  <span key={r.url}>
                    {i > 0 && ' · '}
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {r.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
            {pattern.related && (
              <RelatedLinks refs={pattern.related} onNavigate={onNavigate} />
            )}
            <div className="pattern-actions">
              <button
                type="button"
                className="nav-chip nav-chip-inline"
                onClick={() => {
                  const encoded = encodeSketchState(sketchFromPattern(pattern))
                  onNavigate({ tab: 'sketch', anchor: encoded })
                }}
              >
                Sketch this pattern →
              </button>
            </div>
          </section>
          )
        })}
      </div>

      <section className="card migrations-section" id="migration-paths">
        <h2>Migration &amp; scale paths</h2>
        <p className="lead">
          When you outgrow the simple option — the trigger to move, and what to move to.
        </p>
        <div className="migrations-list">
          {migrationPaths.map((m) => (
            <div key={m.id} className="migration-row">
              <p className="migration-head">
                <span className="migration-from">{m.from}</span>
                <span className="migration-arrow"> → </span>
                <span className="migration-to">{m.to}</span>
                <span className="badge">
                  {layers.find((l) => l.id === m.layer)?.shortName ?? m.layer}
                </span>
              </p>
              <p className="migration-trigger">
                <strong>Move when:</strong> {m.trigger}
              </p>
              <p className="migration-note">{m.note}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
