import { useEffect } from 'react'
import { LayerDiagram } from '../components/LayerDiagram'
import { jobs } from '../data/jobs'
import { harnessFrameworkObs } from '../data/comparisons'
import { maturityStages } from '../data/maturity'
import { roleGuides } from '../data/roles'
import { changelog } from '../data/changelog'
import { stateOfMap } from '../data/stateOfMap'
import { FreshnessPanel } from '../components/FreshnessPanel'
import { BuildVsBuyView } from '../components/BuildVsBuyView'
import { downloadMapData } from '../utils/exportMapData'
import { scrollToAnchor } from '../utils/openAnchor'
import { targetForJob } from '../utils/jobNavigation'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
  scrollTo?: string
}

export function OverviewPage({ onNavigate, scrollTo }: Props) {
  useEffect(() => {
    if (scrollTo) {
      scrollToAnchor(scrollTo)
    }
  }, [scrollTo])

  return (
    <>
      <div className="quick-answer primary-path" id="start-here">
        <h2>Start here</h2>
        <p className="lead" style={{ marginBottom: '1rem' }}>
          Pick the job closest to yours — not a vendor name. That routes you to the right tab.
        </p>
        <div className="job-grid job-grid-primary">
          {jobs.map((job) => (
            <button
              key={job.id}
              id={job.id}
              type="button"
              className="nav-chip nav-chip-block"
              onClick={() => onNavigate(targetForJob(job))}
            >
              <strong>{job.title}</strong>
              <span>{job.startHere}</span>
            </button>
          ))}
        </div>
        <p className="path-footer">
          Then use{' '}
          <button type="button" className="nav-chip nav-chip-inline" onClick={() => onNavigate({ tab: 'builder' })}>
            Stack builder
          </button>{' '}
          or{' '}
          <button type="button" className="nav-chip nav-chip-inline" onClick={() => onNavigate({ tab: 'sketch' })}>
            Stack sketch
          </button>{' '}
          for build paths,{' '}
          <button type="button" className="nav-chip nav-chip-inline" onClick={() => onNavigate({ tab: 'landscape' })}>
            Enterprise landscape
          </button>{' '}
          for buy paths, or{' '}
          <button type="button" className="nav-chip nav-chip-inline" onClick={() => onNavigate({ tab: 'glossary' })}>
            Glossary
          </button>{' '}
          if a term is unclear.
        </p>
      </div>

      <details className="overview-more" id="overview-more" aria-label="More navigation options: layers, role guides, and maturity stages">
        <summary>More ways in (layers, role, maturity)</summary>
        <div className="overview-more-body">
          <h3 id="stack-layers">Stack layers</h3>
          <p className="lead">Click a layer to see tool types and what you can skip for now.</p>
          <LayerDiagram />

          <details className="nested-details" id="role-hub" aria-label="Role guides">
            <summary>By role ({roleGuides.length} guides)</summary>
            <div className="hub-grid compact-hub">
              {roleGuides.map((role) => (
                <article key={role.id} id={role.id} className="card hub-card">
                  <h4>{role.title}</h4>
                  <p>{role.summary}</p>
                  <ul>
                    {role.startHere.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="hub-links">
                    {role.links.map((link) => (
                      <button
                        key={link.label}
                        type="button"
                        className="nav-chip"
                        onClick={() => onNavigate(link.target)}
                      >
                        {link.label} →
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </details>

          <details className="nested-details" id="maturity-hub" aria-label="Maturity stages">
            <summary>By maturity ({maturityStages.length} stages)</summary>
            <div className="hub-grid compact-hub">
              {maturityStages.map((stage) => (
                <article key={stage.id} id={stage.id} className="card hub-card">
                  <h4>{stage.title}</h4>
                  <p>{stage.summary}</p>
                  <ul>
                    {stage.focus.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="hub-links">
                    {stage.links.map((link) => (
                      <button
                        key={link.label}
                        type="button"
                        className="nav-chip"
                        onClick={() => onNavigate(link.target)}
                      >
                        {link.label} →
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </details>

          <details className="nested-details" id="harness-hub">
            <summary>{harnessFrameworkObs.title}</summary>
            <p>{harnessFrameworkObs.subtitle}</p>
            <button
              type="button"
              className="nav-chip"
              onClick={() => onNavigate({ tab: 'compare', anchor: 'harness-framework-obs' })}
            >
              Open full comparison →
            </button>
          </details>
        </div>
      </details>

      <details className="nested-details" id="changelog" aria-label="What's changed">
        <summary>What's changed — v{changelog[0].version}</summary>
        <div className="changelog-body">
          {changelog.map((entry) => (
            <div key={entry.version} className="changelog-entry">
              <p className="changelog-heading">
                <strong>v{entry.version}</strong>
                <span className="changelog-date">{entry.date}</span>
              </p>
              <ul>
                {entry.changes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <details className="nested-details" id="state-of-map" aria-label="State of the map">
        <summary>State of the map — {stateOfMap.asOf}</summary>
        <div className="overview-more-body state-of-map">
          {stateOfMap.notes.map((note) => (
            <div key={note.heading} className="state-of-map-group">
              <h4>{note.heading}</h4>
              <ul>
                {note.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <details className="nested-details" id="freshness" aria-label="Catalog freshness">
        <summary>Catalog freshness</summary>
        <div className="overview-more-body">
          <FreshnessPanel />
        </div>
      </details>

      <details className="nested-details" id="build-vs-buy" aria-label="Build vs buy">
        <summary>Build vs buy — common scenarios</summary>
        <div className="overview-more-body">
          <BuildVsBuyView />
        </div>
      </details>

      <p className="overview-data-export">
        <button type="button" className="nav-chip nav-chip-inline" onClick={downloadMapData}>
          Download map data (JSON)
        </button>{' '}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          The full catalog, glossary, patterns, and comparisons as portable, versioned JSON — build on
          it or embed it. No account, no server.
        </span>
      </p>
    </>
  )
}
