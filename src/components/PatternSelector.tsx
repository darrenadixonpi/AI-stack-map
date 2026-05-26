import { stackPatterns } from '../data/patterns'

export type PatternId = (typeof stackPatterns)[number]['id']
/** null = no pattern focused (show all) */
export type PatternFilter = PatternId | null

interface Props {
  value: PatternFilter
  onChange: (id: PatternFilter) => void
}

export function PatternSelector({ value, onChange }: Props) {
  const toggle = (id: PatternId) => {
    onChange(value === id ? null : id)
  }

  return (
    <div className="pattern-selector" role="group" aria-label="Stack pattern">
      <div className="segment-label">Focus pattern (optional)</div>
      <p className="pattern-selector-hint">
        {value === null
          ? 'All patterns shown below.'
          : 'Click again to show all patterns.'}
      </p>
      <div className="segment-row">
        {stackPatterns.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`segment-btn${value === p.id ? ' active' : ''}`}
            onClick={() => toggle(p.id)}
            aria-pressed={value === p.id}
          >
            {p.shortLabel}
          </button>
        ))}
      </div>
    </div>
  )
}
