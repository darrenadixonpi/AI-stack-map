import { useEffect, useMemo, useRef, useState } from 'react'
import { buildSearchIndex, type SearchHit } from '../data/links'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
}

export function GlobalSearch({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const index = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return index
      .filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.snippet.toLowerCase().includes(q) ||
          h.kind.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [query, index])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const pick = (hit: SearchHit) => {
    onNavigate({ tab: hit.tab, anchor: hit.anchor })
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="global-search" ref={wrapRef}>
      <input
        type="search"
        className="global-search-input"
        placeholder="Search map…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search glossary, tools, patterns, and comparisons"
        aria-expanded={open && results.length > 0}
        aria-controls="search-results"
      />
      {open && query.trim().length >= 2 && (
        <ul id="search-results" className="search-results" role="listbox">
          {results.length === 0 ? (
            <li className="search-hit empty">No matches</li>
          ) : (
            results.map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  className="search-hit"
                  role="option"
                  onClick={() => pick(hit)}
                >
                  <span className="search-hit-kind">{hit.kind}</span>
                  <span className="search-hit-title">{hit.title}</span>
                  <span className="search-hit-snippet">{hit.snippet}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
