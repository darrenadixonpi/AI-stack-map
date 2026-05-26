import type { NavigationTarget, TabId } from '../navigation'
import { comparisons } from './comparisons'
import { glossaryTerms } from './glossary'
import { stackPatterns } from './patterns'
import { applicationProducts } from './applicationTools'
import { applicationCategories } from './applicationCategories'
import { tools } from './tools'

/** Format: `glossary:id` | `compare:id` | `pattern:id` | `tool:id` | `app:id` | `landscape:…` */
export type RelatedRef = string

export function resolveRelated(ref: RelatedRef): NavigationTarget | null {
  const [kind, id] = ref.split(':')
  if (!id) return null
  switch (kind) {
    case 'glossary':
      return glossaryTerms.some((t) => t.id === id) ? { tab: 'glossary', anchor: id } : null
    case 'compare':
      return comparisons.some((c) => c.id === id) ? { tab: 'compare', anchor: id } : null
    case 'pattern':
      return stackPatterns.some((p) => p.id === id) ? { tab: 'patterns', anchor: id } : null
    case 'tool':
      return tools.some((t) => t.id === id) ? { tab: 'catalog', anchor: `tool-${id}` } : null
    case 'app':
      return applicationProducts.some((a) => a.id === id)
        ? { tab: 'catalog', anchor: `app-${id}` }
        : null
    case 'landscape':
      return { tab: 'landscape', anchor: id || undefined }
    case 'builder':
      return { tab: 'builder', anchor: id || undefined }
    case 'overview':
      return { tab: 'overview', anchor: id || undefined }
    default:
      return null
  }
}

export function labelForRelated(ref: RelatedRef): string {
  const [kind, id] = ref.split(':')
  if (!id) return ref
  switch (kind) {
    case 'glossary': {
      const t = glossaryTerms.find((x) => x.id === id)
      return t ? t.term : id
    }
    case 'compare': {
      const c = comparisons.find((x) => x.id === id)
      return c ? c.title : id
    }
    case 'pattern': {
      const p = stackPatterns.find((x) => x.id === id)
      return p ? p.title : id
    }
    case 'tool': {
      const t = tools.find((x) => x.id === id)
      return t ? t.name : id
    }
    case 'app': {
      const a = applicationProducts.find((x) => x.id === id)
      return a ? a.name : id
    }
    case 'landscape':
      return id === 'vertical' ? 'Enterprise landscape (vertical)' : 'Enterprise landscape'
    case 'builder':
      return id === 'agent-tree' ? 'Agent decision tree' : 'Stack builder'
    default:
      return id
  }
}

export interface SearchHit {
  id: string
  title: string
  snippet: string
  tab: TabId
  anchor?: string
  kind: string
}

export function buildSearchIndex(): SearchHit[] {
  const hits: SearchHit[] = []

  for (const t of glossaryTerms) {
    hits.push({
      id: `glossary-${t.id}`,
      title: t.term,
      snippet: t.whatItIs.slice(0, 120),
      tab: 'glossary',
      anchor: t.id,
      kind: 'Glossary',
    })
  }
  for (const t of tools) {
    hits.push({
      id: `tool-${t.id}`,
      title: t.name,
      snippet: `${t.category} — ${t.summary}`,
      tab: 'catalog',
      anchor: `tool-${t.id}`,
      kind: 'Tool',
    })
  }
  for (const c of comparisons) {
    hits.push({
      id: `compare-${c.id}`,
      title: c.title,
      snippet: c.sameJob.slice(0, 120),
      tab: 'compare',
      anchor: c.id,
      kind: 'Compare',
    })
  }
  for (const p of stackPatterns) {
    hits.push({
      id: `pattern-${p.id}`,
      title: p.title,
      snippet: p.summary.slice(0, 120),
      tab: 'patterns',
      anchor: p.id,
      kind: 'Pattern',
    })
  }
  for (const a of applicationProducts) {
    hits.push({
      id: `app-${a.id}`,
      title: a.name,
      snippet: `${a.market} · ${a.summary.slice(0, 80)}`,
      tab: 'catalog',
      anchor: `app-${a.id}`,
      kind: 'Enterprise app',
    })
  }
  hits.push({
    id: 'sketch',
    title: 'Stack sketch',
    snippet: 'Compose a shareable draft stack — layers, picks, MVP vs growth',
    tab: 'sketch',
    kind: 'Sketch',
  })
  hits.push({
    id: 'landscape-map',
    title: 'Enterprise landscape',
    snippet: 'Horizontal and vertical packaged AI apps by category',
    tab: 'landscape',
    kind: 'Landscape',
  })
  for (const c of applicationCategories) {
    hits.push({
      id: `app-cat-${c.id}`,
      title: `${c.label} (enterprise apps)`,
      snippet: c.description.slice(0, 120),
      tab: 'catalog',
      anchor: `apps/${c.id}`,
      kind: 'App category',
    })
  }

  return hits
}
