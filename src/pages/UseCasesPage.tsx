import { useEffect, useState } from 'react'
import { PatternFlowDiagram } from '../components/PatternFlowDiagram'
import { PatternSelector, type PatternFilter, type PatternId } from '../components/PatternSelector'
import { RelatedLinks } from '../components/RelatedLinks'
import { stackPatterns } from '../data/patterns'
import { layers } from '../data/layers'
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
        {visible.map((pattern) => (
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
            {pattern.related && (
              <RelatedLinks refs={pattern.related} onNavigate={onNavigate} />
            )}
          </section>
        ))}
      </div>
    </>
  )
}
