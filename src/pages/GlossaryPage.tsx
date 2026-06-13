import { useEffect, useMemo, useState } from 'react'
import { FeedbackLink } from '../components/FeedbackLink'
import { RelatedLinks } from '../components/RelatedLinks'
import { glossaryCategories } from '../data/glossaryCategories'
import { glossaryTerms } from '../data/glossary'
import { glossaryPlainLanguage } from '../data/glossaryPlainLanguage'
import type { GlossaryCategoryId } from '../types'
import type { NavigationTarget } from '../navigation'
import { targetToHash } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget, replace?: boolean) => void
  scrollTo?: string
}

function termLetter(term: string): string {
  const ch = term.trim()[0]?.toUpperCase() ?? '#'
  return /[A-Z]/.test(ch) ? ch : '#'
}

export function GlossaryPage({ onNavigate, scrollTo }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [categoryFilter, setCategoryFilter] = useState<GlossaryCategoryId | null>(null)
  const [plain, setPlain] = useState(false)

  useEffect(() => {
    if (scrollTo) {
      setOpenIds((prev) => new Set(prev).add(scrollTo))
      requestAnimationFrame(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [scrollTo])

  const filteredTerms = useMemo(() => {
    if (!categoryFilter) return glossaryTerms
    return glossaryTerms.filter((t) => t.category === categoryFilter)
  }, [categoryFilter])

  const letters = useMemo(() => {
    const set = new Set(filteredTerms.map((t) => termLetter(t.term)))
    return [...set].sort()
  }, [filteredTerms])

  const byLetter = useMemo(() => {
    const map = new Map<string, typeof glossaryTerms>()
    for (const t of filteredTerms) {
      const L = termLetter(t.term)
      if (!map.has(L)) map.set(L, [])
      map.get(L)!.push(t)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filteredTerms])

  const expandAll = () => setOpenIds(new Set(filteredTerms.map((t) => t.id)))
  const collapseAll = () => setOpenIds(new Set())

  const jumpToLetter = (letter: string) => {
    document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', targetToHash({ tab: 'glossary' }))
  }

  const toggle = (id: string, open: boolean) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (open) next.add(id)
      else next.delete(id)
      return next
    })
    if (open) {
      history.replaceState(null, '', targetToHash({ tab: 'glossary', anchor: id }))
    }
  }

  const categoryLabel = (id: GlossaryCategoryId) =>
    glossaryCategories.find((c) => c.id === id)?.label ?? id

  return (
    <>
      <h2>Glossary</h2>
      <p className="lead">
        {glossaryTerms.length} category terms — what it is, what it is not, stack neighbors, when you
        need it. Use <strong>Search map</strong> in the header to jump here from anywhere.
      </p>

      <div className="glossary-toolbar card">
        <div className="glossary-toolbar-row">
          <span className="glossary-count">
            {categoryFilter
              ? `${filteredTerms.length} of ${glossaryTerms.length} terms`
              : `${glossaryTerms.length} terms`}
          </span>
          <div className="glossary-toolbar-actions">
            <button
              type="button"
              className={`nav-chip${plain ? ' nav-chip-on' : ''}`}
              onClick={() => setPlain((v) => !v)}
              aria-pressed={plain}
              title="Show plain-language explanations for non-technical stakeholders"
            >
              {plain ? 'Plain language: on' : 'Plain language: off'}
            </button>
            <button type="button" className="nav-chip" onClick={expandAll}>
              Expand all
            </button>
            <button type="button" className="nav-chip" onClick={collapseAll}>
              Collapse all
            </button>
          </div>
        </div>

        <div className="segment-group">
          <div className="segment-label">Topic</div>
          <div className="segment-row">
            <button
              type="button"
              className={`segment-btn${categoryFilter === null ? ' active' : ''}`}
              onClick={() => setCategoryFilter(null)}
              aria-pressed={categoryFilter === null}
            >
              All topics
            </button>
            {glossaryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`segment-btn${categoryFilter === cat.id ? ' active' : ''}`}
                onClick={() => setCategoryFilter(cat.id)}
                aria-pressed={categoryFilter === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="glossary-alpha" aria-label="Jump by letter">
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className="glossary-alpha-btn"
              onClick={() => jumpToLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </nav>
      </div>

      {filteredTerms.length === 0 ? (
        <p className="lead">No terms in this topic.</p>
      ) : (
        <div className="glossary-list">
          {byLetter.map(([letter, terms]) => (
            <section key={letter} id={`glossary-${letter}`} className="glossary-letter-group">
              <h3 className="glossary-letter-heading">{letter}</h3>
              {terms.map((term) => {
                const isOpen = openIds.has(term.id)
                return (
                  <details
                    key={term.id}
                    id={term.id}
                    className="glossary-term"
                    open={isOpen}
                    onToggle={(e) => toggle(term.id, e.currentTarget.open)}
                  >
                    <summary>
                      <span className="glossary-term-header">
                        <span className="glossary-term-name">{term.term}</span>
                        <span className="glossary-category-badge">
                          {categoryLabel(term.category)}
                        </span>
                      </span>
                      {term.confusedWith.length > 0 && (
                        <span className="glossary-confused">
                          Often confused with {term.confusedWith.join(', ')}
                        </span>
                      )}
                    </summary>
                    <div className="glossary-body">
                      <FeedbackLink
                        section="Glossary"
                        topicName={term.term}
                        topicId={term.id}
                        label="Suggest a glossary edit"
                      />
                      <dl>
                        {plain && glossaryPlainLanguage[term.id] && (
                          <>
                            <dt className="glossary-plain-dt">In plain terms</dt>
                            <dd className="glossary-plain-dd">{glossaryPlainLanguage[term.id]}</dd>
                          </>
                        )}
                        <dt>What it is</dt>
                        <dd>{term.whatItIs}</dd>
                        <dt>What it is not</dt>
                        <dd>{term.whatItIsNot}</dd>
                        <dt>Stack neighbors</dt>
                        <dd>{term.neighbors}</dd>
                        <dt>When you need it</dt>
                        <dd>{term.whenYouNeedIt}</dd>
                      </dl>
                      {term.related && (
                        <RelatedLinks refs={term.related} onNavigate={onNavigate} />
                      )}
                    </div>
                  </details>
                )
              })}
            </section>
          ))}
        </div>
      )}
    </>
  )
}
