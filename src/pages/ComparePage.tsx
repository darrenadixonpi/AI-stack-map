import { useLayoutEffect, useMemo, useState } from 'react'
import { RelatedLinks } from '../components/RelatedLinks'
import { compareGroups, HARNESS_COMPARE_GROUP } from '../data/compareGroups'
import { comparisons, harnessFrameworkObs } from '../data/comparisons'
import { targetToHash } from '../navigation'
import { scrollToAnchor } from '../utils/openAnchor'
import type { CompareGroupId } from '../types'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget, replace?: boolean) => void
  scrollTo?: string
  onAnchorChange?: (anchor: string | undefined) => void
}

const harnessItem = {
  id: 'harness-framework-obs',
  label: harnessFrameworkObs.title,
  group: HARNESS_COMPARE_GROUP,
}

const selectorItems = [harnessItem, ...comparisons.map((c) => ({ id: c.id, label: c.title, group: c.group }))]

export function ComparePage({ onNavigate, scrollTo, onAnchorChange }: Props) {
  const [groupFilter, setGroupFilter] = useState<CompareGroupId | 'all'>('all')

  useLayoutEffect(() => {
    if (scrollTo) {
      scrollToAnchor(scrollTo)
    }
  }, [scrollTo])

  const filteredSelectors = useMemo(() => {
    if (groupFilter === 'all') return selectorItems
    return selectorItems.filter((item) => item.group === groupFilter)
  }, [groupFilter])

  const showHarness = groupFilter === 'all' || groupFilter === HARNESS_COMPARE_GROUP
  const filteredComparisons = useMemo(() => {
    if (groupFilter === 'all') return comparisons
    return comparisons.filter((c) => c.group === groupFilter)
  }, [groupFilter])

  const jump = (id: string) => {
    onAnchorChange?.(id)
    history.replaceState(null, '', targetToHash({ tab: 'compare', anchor: id }))
    scrollToAnchor(id)
  }

  const setGroup = (group: CompareGroupId | 'all') => {
    setGroupFilter(group)
    onAnchorChange?.(undefined)
    history.replaceState(null, '', targetToHash({ tab: 'compare' }))
  }

  const showingCount = filteredSelectors.length

  return (
    <>
      <h2>Compare</h2>
      <p className="lead">
        Short confusion-matrix pages — same job? same layer? pick A if… pick B if…
      </p>

      <div className="segment-group">
        <div className="segment-label">Topic</div>
        <div className="filter-row">
          {compareGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`segment-btn${groupFilter === g.id ? ' active' : ''}`}
              onClick={() => setGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="segment-group">
        <div className="segment-label">Comparison</div>
        <div className="filter-row">
          {filteredSelectors.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`segment-btn${scrollTo === item.id ? ' active' : ''}`}
              onClick={() => jump(item.id)}
              aria-current={scrollTo === item.id ? 'true' : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing {showingCount} comparison{showingCount === 1 ? '' : 's'}
        {groupFilter !== 'all' ? ` in ${compareGroups.find((g) => g.id === groupFilter)?.label}` : ''}
      </p>

      <div className="compare-sections">
        {showHarness && (
          <section id="harness-framework-obs" className="card compare-card">
            <h3 className="compare-card-title">{harnessFrameworkObs.title}</h3>
            <p>{harnessFrameworkObs.subtitle}</p>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>When</th>
                  <th>Question</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {harnessFrameworkObs.rows.map((row) => (
                  <tr key={row.role}>
                    <td>
                      <strong>{row.role}</strong>
                    </td>
                    <td>{row.when}</td>
                    <td>{row.question}</td>
                    <td>{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {filteredComparisons.map((c) => (
          <section key={c.id} id={c.id} className="card compare-card">
            <h3 className="compare-card-title">{c.title}</h3>
            <p>
              <strong>Same job?</strong> {c.sameJob}
            </p>
            <p>
              <strong>Same layer?</strong> {c.sameLayer}
            </p>
            <p>
              <strong>Pick A if:</strong> {c.pickA}
            </p>
            <p>
              <strong>Pick B if:</strong> {c.pickB}
            </p>
            <p>
              <strong>Use both when:</strong> {c.useBoth}
            </p>
            <div className="compare-options">
              {c.options.map((opt) => (
                <div key={opt.name} className="compare-option">
                  <strong>{opt.name}</strong> — {opt.pickIf}
                </div>
              ))}
            </div>
            {c.related && <RelatedLinks refs={c.related} onNavigate={onNavigate} />}
          </section>
        ))}
      </div>
    </>
  )
}
