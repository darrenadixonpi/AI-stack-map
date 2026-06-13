import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { GlobalSearch } from './components/GlobalSearch'
import { FeedbackLink } from './components/FeedbackLink'
import { ThemeToggle } from './components/ThemeToggle'
import { GITHUB_REPO_URL, MAP_LAST_UPDATED, MAP_VERSION } from './data/siteMeta'
import { SECTION_LABELS } from './utils/feedback'
import type { NavigationTarget, TabId } from './navigation'
import { parseHash, targetToHash } from './navigation'
import { isCatalogViewAnchor } from './utils/catalogAnchor'
import { scrollToAnchor, syncHeaderScrollOffset } from './utils/openAnchor'
import { t } from './i18n'

const OverviewPage = lazy(() => import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage })))
const UseCasesPage = lazy(() => import('./pages/UseCasesPage').then((m) => ({ default: m.UseCasesPage })))
const StackBuilderPage = lazy(() => import('./pages/StackBuilderPage').then((m) => ({ default: m.StackBuilderPage })))
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })))
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })))
const GlossaryPage = lazy(() => import('./pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })))
const LandscapePage = lazy(() => import('./pages/LandscapePage').then((m) => ({ default: m.LandscapePage })))
const StackSketchPage = lazy(() => import('./pages/StackSketchPage').then((m) => ({ default: m.StackSketchPage })))

export type { NavigationTarget, TabId }

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'builder', label: 'Stack builder' },
  { id: 'sketch', label: 'Stack sketch' },
  { id: 'catalog', label: 'Tool catalog' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'compare', label: 'Compare' },
  { id: 'glossary', label: 'Glossary' },
]

function applyScroll(target: NavigationTarget) {
  if (target.tab === 'patterns' && target.anchor) {
    window.scrollTo({ top: 0 })
    return
  }
  // Compare scroll runs in ComparePage after paint (avoids double-scroll / clipped titles)
  if (target.tab === 'compare' && target.anchor) {
    return
  }
  if (target.tab === 'sketch') {
    return
  }
  if (target.tab === 'catalog' && isCatalogViewAnchor(target.anchor)) {
    return
  }
  if (target.anchor) {
    scrollToAnchor(target.anchor)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function App() {
  const [tab, setTab] = useState<TabId>('overview')
  const [anchor, setAnchor] = useState<string | undefined>()
  const [headerCompact, setHeaderCompact] = useState(false)

  const navigate = useCallback((target: NavigationTarget, replace = false) => {
    setTab(target.tab)
    setAnchor(target.anchor)
    const hash = targetToHash(target)
    if (replace) {
      history.replaceState(null, '', hash)
    } else {
      history.pushState(null, '', hash)
    }
    applyScroll(target)
  }, [])

  useEffect(() => {
    const fromHash = parseHash(window.location.hash)
    if (fromHash) {
      setTab(fromHash.tab)
      setAnchor(fromHash.anchor)
      requestAnimationFrame(() => applyScroll(fromHash))
    } else {
      history.replaceState(null, '', '#/overview')
    }

    const onHashChange = () => {
      const next = parseHash(window.location.hash)
      if (next) {
        setTab(next.tab)
        setAnchor(next.anchor)
        applyScroll(next)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    syncHeaderScrollOffset()
    const ro = new ResizeObserver(() => syncHeaderScrollOffset())
    const header = document.querySelector('.app-header')
    if (header) ro.observe(header)
    window.addEventListener('resize', syncHeaderScrollOffset)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncHeaderScrollOffset)
    }
  }, [headerCompact, tab])

  const renderPage = () => {
    switch (tab) {
      case 'overview':
        return <OverviewPage onNavigate={navigate} scrollTo={anchor} />
      case 'patterns':
        return <UseCasesPage onNavigate={navigate} scrollTo={anchor} />
      case 'builder':
        return (
          <StackBuilderPage
            onNavigate={navigate}
            anchor={anchor}
            scrollTo={anchor?.startsWith('from-sketch/') ? undefined : anchor}
          />
        )
      case 'sketch':
        return (
          <StackSketchPage
            onNavigate={navigate}
            scrollTo={anchor}
            onAnchorChange={setAnchor}
          />
        )
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={navigate}
            scrollTo={anchor}
            onAnchorChange={setAnchor}
          />
        )
      case 'landscape':
        return <LandscapePage onNavigate={navigate} />
      case 'compare':
        return (
          <ComparePage
            onNavigate={navigate}
            scrollTo={anchor}
            onAnchorChange={setAnchor}
          />
        )
      case 'glossary':
        return <GlossaryPage onNavigate={navigate} scrollTo={anchor} />
      default:
        return <OverviewPage onNavigate={navigate} scrollTo={anchor} />
    }
  }

  return (
    <>
      <header className={`app-header${headerCompact ? ' is-compact' : ''}`}>
        <div className="app-header-inner">
          <div className="header-top">
            <div className="header-titles">
              <h1 className="app-title">{t('app.title')}</h1>
              <p className="app-subtitle">{t('app.subtitle')}</p>
            </div>
            <div className="header-actions">
              <GlobalSearch onNavigate={navigate} />
              <ThemeToggle />
            </div>
          </div>
          <div className="tab-toolbar">
            <nav className="tab-bar" aria-label="Main">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`tab-btn${tab === t.id ? ' active' : ''}`}
                  onClick={() => navigate({ tab: t.id })}
                >
                  {t.label}
                </button>
              ))}
            </nav>
            <FeedbackLink
              section={SECTION_LABELS[tab] ?? tab}
              detail={
                anchor
                  ? `Tab: ${tab} · Anchor: ${anchor.length > 80 ? `${anchor.slice(0, 80)}…` : anchor}`
                  : `Tab: ${tab}`
              }
            />
          </div>
        </div>
      </header>
      <main className="app-main">
        <Suspense fallback={<div className="page-loading" aria-live="polite">Loading…</div>}>
          {renderPage()}
        </Suspense>
      </main>
      <footer className="app-main footer-note">
        <p>
          Map v{MAP_VERSION} · Last updated {MAP_LAST_UPDATED}. Neutral map — layers first, brands
          second.
        </p>
        <p>
          <FeedbackLink section="General" label="Suggest an edit" /> ·{' '}
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
