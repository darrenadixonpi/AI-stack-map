import { tools } from '../data/tools'
import { applicationProducts } from '../data/applicationTools'
import { CATALOG_DEFAULT_REVIEWED, MAP_LAST_UPDATED } from '../data/siteMeta'

interface Entry {
  name: string
  reviewed: string
  explicit: boolean
}

/** 'YYYY-MM' (or longer) → comparable month ordinal */
function ym(s: string): number {
  const [y, m] = s.split('-').map(Number)
  return y * 12 + (m || 1)
}

const STALE_MONTHS = 6

export function FreshnessPanel() {
  const all: Entry[] = [
    ...tools.map((t) => ({
      name: t.name,
      reviewed: t.lastReviewed ?? CATALOG_DEFAULT_REVIEWED,
      explicit: !!t.lastReviewed,
    })),
    ...applicationProducts.map((a) => ({
      name: a.name,
      reviewed: a.lastReviewed ?? CATALOG_DEFAULT_REVIEWED,
      explicit: !!a.lastReviewed,
    })),
  ]
  const now = ym(MAP_LAST_UPDATED)
  const explicitCount = all.filter((e) => e.explicit).length
  const stale = all.filter((e) => now - ym(e.reviewed) >= STALE_MONTHS)

  const byMonth = new Map<string, number>()
  for (const e of all) byMonth.set(e.reviewed, (byMonth.get(e.reviewed) ?? 0) + 1)
  const months = [...byMonth.entries()].sort(([a], [b]) => ym(b) - ym(a))

  return (
    <div className="freshness-panel">
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {all.length} catalog entries · {explicitCount} with an explicit review date · default{' '}
        {CATALOG_DEFAULT_REVIEWED} · as of {MAP_LAST_UPDATED.slice(0, 7)}.
      </p>
      <ul className="freshness-months">
        {months.map(([m, n]) => (
          <li key={m} className="freshness-row">
            <span className="freshness-month">{m}</span>
            <span className="freshness-bar-track" aria-hidden="true">
              <span
                className="freshness-bar"
                style={{ width: `${Math.round((n / all.length) * 100)}%` }}
              />
            </span>
            <span className="freshness-count">{n}</span>
          </li>
        ))}
      </ul>
      {stale.length > 0 ? (
        <p style={{ fontSize: '0.85rem' }}>
          <strong>{stale.length}</strong> entr{stale.length === 1 ? 'y' : 'ies'} not reviewed in{' '}
          {STALE_MONTHS}+ months — candidates for a refresh.
        </p>
      ) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No entries are older than {STALE_MONTHS} months.
        </p>
      )}
    </div>
  )
}
