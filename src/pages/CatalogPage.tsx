import { useEffect, useMemo, useState, useTransition } from 'react'
import { RelatedLinks } from '../components/RelatedLinks'
import { applicationProducts } from '../data/applicationTools'
import {
  applicationCategories,
  categoryLabel,
} from '../data/applicationCategories'
import { CATALOG_DEFAULT_REVIEWED } from '../data/siteMeta'
import { tools, toolCategories } from '../data/tools'
import { layers } from '../data/layers'
import { getToolDeployment, deploymentLabel, deploymentOptions } from '../utils/toolDeployment'
import type { NavigationTarget } from '../navigation'
import type { ApplicationCategoryId, DeploymentModel, LayerId } from '../types'
import {
  catalogAnchorForApps,
  parseCatalogAnchor,
  type CatalogView,
} from '../utils/catalogAnchor'
import { scrollToAnchor } from '../utils/openAnchor'
import { FeedbackLink } from '../components/FeedbackLink'

interface Props {
  onNavigate: (t: NavigationTarget) => void
  scrollTo?: string
  onAnchorChange?: (anchor: string | undefined) => void
}

export function CatalogPage({ onNavigate, scrollTo, onAnchorChange }: Props) {
  const parsed = parseCatalogAnchor(scrollTo)
  const [view, setView] = useState<CatalogView>(parsed.view)
  const [query, setQuery] = useState('')
  const [layerFilter, setLayerFilter] = useState<LayerId | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deploymentFilter, setDeploymentFilter] = useState<DeploymentModel | 'all'>('all')
  const [appCategoryFilter, setAppCategoryFilter] = useState<ApplicationCategoryId | 'all'>(
    parsed.applicationCategory ?? 'all',
  )
  const [marketFilter, setMarketFilter] = useState<'all' | 'horizontal' | 'vertical'>('all')
  const [, startTransition] = useTransition()

  useEffect(() => {
    const next = parseCatalogAnchor(scrollTo)
    setView(next.view)
    if (next.applicationCategory) {
      setAppCategoryFilter(next.applicationCategory)
    }
    if (next.view === 'apps') {
      setCategoryFilter('all')
      setLayerFilter('all')
    }
    // Deep link to a specific card: clear any filter that could hide it
    if (scrollTo?.startsWith('app-')) {
      setMarketFilter('all')
      setAppCategoryFilter('all')
      setQuery('')
    } else if (scrollTo?.startsWith('tool-')) {
      setLayerFilter('all')
      setCategoryFilter('all')
      setDeploymentFilter('all')
      setQuery('')
    }
  }, [scrollTo])

  useEffect(() => {
    if (!scrollTo) return
    if (scrollTo.startsWith('tool-') || scrollTo.startsWith('app-')) {
      scrollToAnchor(scrollTo)
    }
  }, [scrollTo])

  const setCatalogView = (next: CatalogView, appCategory?: ApplicationCategoryId) => {
    startTransition(() => setView(next))
    if (next === 'apps') {
      setLayerFilter('all')
      setCategoryFilter('all')
      if (appCategory) setAppCategoryFilter(appCategory)
    }
    const anchor = next === 'apps' ? catalogAnchorForApps(appCategory) : 'stack'
    onAnchorChange?.(anchor)
    history.replaceState(null, '', `#/catalog/${anchor}`)
  }

  const setAppCategory = (cat: ApplicationCategoryId | 'all') => {
    setAppCategoryFilter(cat)
    const anchor = catalogAnchorForApps(cat === 'all' ? undefined : cat)
    onAnchorChange?.(anchor)
    history.replaceState(null, '', `#/catalog/${anchor}`)
  }

  const resetStackFilters = () => {
    setLayerFilter('all')
    setCategoryFilter('all')
    setDeploymentFilter('all')
    setQuery('')
  }

  const resetAppFilters = () => {
    setMarketFilter('all')
    setAppCategoryFilter('all')
    setQuery('')
  }

  const filteredStack = useMemo(() => {
    const q = query.toLowerCase().trim()
    return tools.filter((t) => {
      if (layerFilter !== 'all' && t.layer !== layerFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (deploymentFilter !== 'all' && getToolDeployment(t) !== deploymentFilter) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    })
  }, [query, layerFilter, categoryFilter])

  const filteredApps = useMemo(() => {
    const q = query.toLowerCase().trim()
    return applicationProducts.filter((p) => {
      if (marketFilter !== 'all' && p.market !== marketFilter) return false
      if (appCategoryFilter !== 'all' && p.applicationCategory !== appCategoryFilter) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        categoryLabel(p.applicationCategory).toLowerCase().includes(q)
      )
    })
  }, [query, marketFilter, appCategoryFilter])

  const count = view === 'stack' ? filteredStack.length : filteredApps.length
  const total = view === 'stack' ? tools.length : applicationProducts.length

  return (
    <>
      <h2>Tool catalog</h2>
      <p className="lead">
        {view === 'stack'
          ? 'Builder stack — SDKs, orchestration, data, eval, and hosting. Organized by layer and function.'
          : 'Enterprise apps — packaged products by business function or industry. Buy path, not a ranking.'}{' '}
        Default last reviewed: {CATALOG_DEFAULT_REVIEWED}.
      </p>

      <div className="segment-group">
        <div className="segment-label">Catalog view</div>
        <div className="filter-row">
          <button
            type="button"
            className={`segment-btn${view === 'stack' ? ' active' : ''}`}
            onClick={() => setCatalogView('stack')}
          >
            Stack tools ({tools.length})
          </button>
          <button
            type="button"
            className={`segment-btn${view === 'apps' ? ' active' : ''}`}
            onClick={() => setCatalogView('apps')}
          >
            Enterprise apps ({applicationProducts.length})
          </button>
          <button
            type="button"
            className="nav-chip nav-chip-inline"
            onClick={() => onNavigate({ tab: 'landscape' })}
          >
            Landscape map →
          </button>
        </div>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder={view === 'stack' ? 'Search stack tools…' : 'Search enterprise apps…'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search catalog"
      />

      {view === 'stack' ? (
        <>
          <div className="segment-group">
            <div className="segment-label">Layer</div>
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

          <div className="segment-group">
            <div className="segment-label">Category</div>
            <div className="filter-row">
              <button
                type="button"
                className={`segment-btn${categoryFilter === 'all' ? ' active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All
              </button>
              {toolCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`segment-btn${categoryFilter === cat ? ' active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="segment-group">
            <div className="segment-label">Deployment</div>
            <div className="filter-row">
              <button
                type="button"
                className={`segment-btn${deploymentFilter === 'all' ? ' active' : ''}`}
                onClick={() => setDeploymentFilter('all')}
              >
                All
              </button>
              {deploymentOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`segment-btn${deploymentFilter === d ? ' active' : ''}`}
                  onClick={() => setDeploymentFilter(d)}
                >
                  {deploymentLabel(d)}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="segment-group">
            <div className="segment-label">Market</div>
            <div className="filter-row">
              {(['all', 'horizontal', 'vertical'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`segment-btn${marketFilter === m ? ' active' : ''}`}
                  onClick={() => setMarketFilter(m)}
                >
                  {m === 'all' ? 'All' : m === 'horizontal' ? 'Horizontal' : 'Vertical'}
                </button>
              ))}
            </div>
          </div>

          <div className="segment-group">
            <div className="segment-label">Application category</div>
            <div className="filter-row">
              <button
                type="button"
                className={`segment-btn${appCategoryFilter === 'all' ? ' active' : ''}`}
                onClick={() => setAppCategory('all')}
              >
                All
              </button>
              {applicationCategories
                .filter((c) => marketFilter === 'all' || c.market === marketFilter)
                .map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`segment-btn${appCategoryFilter === cat.id ? ' active' : ''}`}
                    onClick={() => setAppCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing {count} of {total} entries
      </p>

      {view === 'stack' ? (
        <div className="tool-list">
          {filteredStack.length === 0 && (
            <p className="catalog-empty">
              No stack tools match these filters.{' '}
              <button type="button" className="nav-chip nav-chip-inline" onClick={resetStackFilters}>
                Clear filters
              </button>
            </p>
          )}
          {filteredStack.map((tool) => (
            <article key={tool.id} id={`tool-${tool.id}`} className="card tool-card">
              <h4>
                {tool.name}
                {tool.status && tool.status !== 'active' && (
                  <span className={`badge badge-status badge-status-${tool.status}`}>
                    {tool.status}
                  </span>
                )}
              </h4>
              <div className="tool-meta">
                <span className="badge">{layers.find((l) => l.id === tool.layer)?.shortName}</span>
                <span>{tool.category}</span>
                <span>{tool.license}</span>
                <span className="badge badge-deployment">{deploymentLabel(getToolDeployment(tool))}</span>
                <span>Skill: {tool.skillFloor}</span>
                <span>Reviewed: {tool.lastReviewed ?? CATALOG_DEFAULT_REVIEWED}</span>
              </div>
              <p>{tool.summary}</p>
              <p>
                <strong>Use when:</strong> {tool.useWhen}
              </p>
              <p>
                <strong>Skip if:</strong> {tool.skipIf}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Pairs with:</strong> {tool.pairsWith} · <strong>Build vs buy:</strong>{' '}
                {tool.buildVsBuy}
              </p>
              {tool.related && <RelatedLinks refs={tool.related} onNavigate={onNavigate} />}
              <FeedbackLink
                className="suggest-edit-link"
                label="✎ suggest edit"
                section="Tool catalog"
                topicName={tool.name}
                topicId={tool.id}
              />
            </article>
          ))}
        </div>
      ) : (
        <div className="tool-list">
          {filteredApps.length === 0 && (
            <p className="catalog-empty">
              No enterprise apps match these filters.{' '}
              <button type="button" className="nav-chip nav-chip-inline" onClick={resetAppFilters}>
                Clear filters
              </button>
            </p>
          )}
          {filteredApps.map((app) => (
            <article key={app.id} id={`app-${app.id}`} className="card tool-card app-card">
              <h4>
                {app.name}
                {app.status && app.status !== 'active' && (
                  <span className={`badge badge-status badge-status-${app.status}`}>
                    {app.status}
                  </span>
                )}
              </h4>
              <div className="tool-meta">
                <span className="badge badge-market">{app.market}</span>
                <span>{categoryLabel(app.applicationCategory)}</span>
                <span>
                  Stack:{' '}
                  {app.stackLayers
                    .map((lid) => layers.find((l) => l.id === lid)?.shortName ?? lid)
                    .join(', ')}
                </span>
              </div>
              <p>{app.summary}</p>
              <p>
                <strong>Use when:</strong> {app.useWhen}
              </p>
              <p>
                <strong>Skip if:</strong> {app.skipIf}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Build vs buy:</strong> {app.buildVsBuy}
              </p>
              {app.related && <RelatedLinks refs={app.related} onNavigate={onNavigate} />}
              <FeedbackLink
                className="suggest-edit-link"
                label="✎ suggest edit"
                section="Tool catalog"
                topicName={app.name}
                topicId={app.id}
              />
            </article>
          ))}
        </div>
      )}
    </>
  )
}
