export type TabId =
  | 'overview'
  | 'patterns'
  | 'builder'
  | 'sketch'
  | 'catalog'
  | 'landscape'
  | 'compare'
  | 'glossary'

export interface NavigationTarget {
  tab: TabId
  anchor?: string
}

const TAB_IDS: TabId[] = [
  'overview',
  'patterns',
  'builder',
  'sketch',
  'catalog',
  'landscape',
  'compare',
  'glossary',
]

export function isTabId(value: string): value is TabId {
  return TAB_IDS.includes(value as TabId)
}

export function targetToHash(target: NavigationTarget): string {
  return target.anchor ? `#/${target.tab}/${target.anchor}` : `#/${target.tab}`
}

export function parseHash(hash: string): NavigationTarget | null {
  const raw = hash.replace(/^#\/?/, '').trim()
  if (!raw) return { tab: 'overview' }
  const [tabPart, ...rest] = raw.split('/')
  if (!isTabId(tabPart)) return null
  const anchor = rest.length > 0 ? rest.join('/') : undefined
  return { tab: tabPart, anchor }
}
