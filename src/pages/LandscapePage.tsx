import { useState } from 'react'
import { applicationProducts } from '../data/applicationTools'
import { horizontalCategories, verticalCategories } from '../data/applicationCategories'
import { dueDiligenceChecklist } from '../data/dueDiligence'
import { layers } from '../data/layers'
import { catalogAnchorForApps } from '../utils/catalogAnchor'
import type { ApplicationCategoryId, LayerId } from '../types'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
}

export function LandscapePage({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [layerFilter, setLayerFilter] = useState<LayerId | 'all'>('all')

  const productsInCategory = (categoryId: ApplicationCategoryId) => {
    const q = query.toLowerCase().trim()
    return applicationProducts.filter((p) => {
      if (p.applicationCategory !== categoryId) return false
      if (layerFilter !== 'all' && !p.stackLayers.includes(layerFilter)) return false
      if (!q) return true
      return p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    })
  }

  const openCategory = (categoryId: ApplicationCategoryId) => {
    onNavigate({ tab: 'catalog', anchor: catalogAnchorForApps(categoryId) })
  }

  const openCompare = (id: string) => {
    onNavigate({ tab: 'compare', anchor: id })
  }

  return (
    <>
      <h2>Enterprise landscape</h2>
      <p className="lead">
        Packaged AI apps by business function (horizontal) and industry (vertical). Use this for{' '}
        <strong>buy</strong> decisions; use the stack layers and builder for <strong>build</strong>{' '}
        decisions. Not a ranking — verify contracts, regions, and compliance before procurement.
      </p>

      <p className="path-footer">
        New to the distinction?{' '}
        <button
          type="button"
          className="nav-chip nav-chip-inline"
          onClick={() => openCompare('packaged-vs-custom-stack')}
        >
          Packaged app vs custom stack
        </button>
        {' · '}
        <button
          type="button"
          className="nav-chip nav-chip-inline"
          onClick={() => onNavigate({ tab: 'catalog', anchor: 'apps' })}
        >
          Browse all enterprise apps
        </button>
      </p>

      <details className="overview-more landscape-dd" id="vendor-due-diligence">
        <summary>Vendor due-diligence checklist (for buy decisions)</summary>
        <div className="overview-more-body">
          <p className="landscape-block-desc">
            Neutral questions to put to any AI vendor before procurement — a starting point for the
            governance conversation, not legal advice.
          </p>
          <div className="dd-grid">
            {dueDiligenceChecklist.map((g) => (
              <section key={g.id} className="dd-group card">
                <h4>{g.title}</h4>
                <ul>
                  {g.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </details>

      <div className="card landscape-filters">
        <input
          type="search"
          className="search-input"
          placeholder="Filter apps by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter enterprise apps by name"
        />
        <div className="segment-group">
          <div className="segment-label">Involves stack layer</div>
          <div className="filter-row">
            <button
              type="button"
              className={`segment-btn${layerFilter === 'all' ? ' active' : ''}`}
              onClick={() => setLayerFilter('all')}
            >
              All
            </button>
            {layers.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`segment-btn${layerFilter === l.id ? ' active' : ''}`}
                onClick={() => setLayerFilter(l.id)}
              >
                {l.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="landscape-block landscape-horizontal" aria-labelledby="landscape-horizontal-title">
        <h3 id="landscape-horizontal-title" className="landscape-block-title">
          Enterprise: horizontal
        </h3>
        <p className="landscape-block-desc">
          Cross-department tools — same capability sold to many industries.
        </p>
        <div className="landscape-grid">
          {horizontalCategories.map((cat) => {
            const items = productsInCategory(cat.id)
            if (items.length === 0) return null
            return (
              <article key={cat.id} className="landscape-category card">
                <header className="landscape-category-header">
                  <h4>{cat.label}</h4>
                  <button
                    type="button"
                    className="nav-chip nav-chip-inline"
                    onClick={() => openCategory(cat.id)}
                  >
                    All ({items.length}) →
                  </button>
                </header>
                <p className="landscape-category-desc">{cat.description}</p>
                <div className="landscape-chips" role="list">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="listitem"
                      className="landscape-chip"
                      title={p.summary}
                      onClick={() =>
                        onNavigate({ tab: 'catalog', anchor: `app-${p.id}` })
                      }
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="landscape-block landscape-vertical" aria-labelledby="landscape-vertical-title">
        <h3 id="landscape-vertical-title" className="landscape-block-title">
          Enterprise: vertical
        </h3>
        <p className="landscape-block-desc">
          Industry-specific workflows — compliance and ontology baked in.
        </p>
        <div className="landscape-grid landscape-grid-vertical">
          {verticalCategories.map((cat) => {
            const items = productsInCategory(cat.id)
            if (items.length === 0) return null
            return (
              <article key={cat.id} className="landscape-category card">
                <header className="landscape-category-header">
                  <h4>{cat.label}</h4>
                  <button
                    type="button"
                    className="nav-chip nav-chip-inline"
                    onClick={() => openCategory(cat.id)}
                  >
                    All ({items.length}) →
                  </button>
                </header>
                <p className="landscape-category-desc">{cat.description}</p>
                <div className="landscape-chips" role="list">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="listitem"
                      className="landscape-chip"
                      title={p.summary}
                      onClick={() =>
                        onNavigate({ tab: 'catalog', anchor: `app-${p.id}` })
                      }
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <details className="overview-more" id="landscape-compare-hints">
        <summary>Related comparisons</summary>
        <div className="overview-more-body hub-links">
          {[
            { id: 'enterprise-search-vs-rag', label: 'Enterprise search vs RAG you build' },
            { id: 'rpa-vs-agent-workflow', label: 'RPA vs agent workflow' },
            { id: 'horizontal-vs-vertical-app', label: 'Horizontal vs vertical app' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              className="nav-chip"
              onClick={() => openCompare(c.id)}
            >
              {c.label} →
            </button>
          ))}
        </div>
      </details>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        Categories mirror common market maps ({applicationProducts.length} example products).{' '}
        Missing a vendor? Use suggest-edit in the footer.
      </p>
    </>
  )
}
