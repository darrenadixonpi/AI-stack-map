import { useEffect } from 'react'
import { LayerDiagram } from '../components/LayerDiagram'
import { jobs } from '../data/jobs'
import { harnessFrameworkObs } from '../data/comparisons'
import { maturityStages } from '../data/maturity'
import { roleGuides } from '../data/roles'
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

      <details className="overview-more" id="overview-more">
        <summary>More ways in (layers, role, maturity)</summary>
        <div className="overview-more-body">
          <h3 id="stack-layers">Stack layers</h3>
          <p className="lead">Click a layer to see tool types and what you can skip for now.</p>
          <LayerDiagram />

          <details className="nested-details" id="role-hub">
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

          <details className="nested-details" id="maturity-hub">
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
    </>
  )
}
