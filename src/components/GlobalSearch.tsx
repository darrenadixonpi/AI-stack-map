import { useEffect, useMemo, useRef, useState } from 'react'
import { buildSearchIndex, type SearchHit } from '../data/links'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
}

export function GlobalSearch({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1)
  }, [results])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Cmd+K or Ctrl+K, and '/' when no input is focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
        setOpen(true)
        return
      }
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const pick = (hit: SearchHit) => {
    onNavigate({ tab: hit.tab, anchor: hit.anchor })
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      pick(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const activeId = activeIndex >= 0 ? `search-result-${activeIndex}` : undefined

  return (
    <div className="global-search" ref={wrapRef}>
      <input
        ref={inputRef}
        type="search"
        className="global-search-input"
        placeholder="Search map… (⌘K)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label="Search glossary, tools, patterns, and comparisons"
        aria-expanded={open && results.length > 0}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        role="combobox"
      />
      {open && query.trim().length >= 2 && (
        <ul id="search-results" className="search-results" role="listbox">
          {results.length === 0 ? (
            <li className="search-hit empty" role="option" aria-selected={false}>No matches</li>
          ) : (
            results.map((hit, i) => (
              <li key={hit.id} role="presentation">
                <button
                  id={`search-result-${i}`}
                  type="button"
                  className={`search-hit${i === activeIndex ? ' search-hit-active' : ''}`}
                  role="option"
                  aria-selected={i === activeIndex}
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
