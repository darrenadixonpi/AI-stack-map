import type { ApplicationCategoryId } from '../types'

export type CatalogView = 'stack' | 'apps'

export interface ParsedCatalogAnchor {
  view: CatalogView
  applicationCategory?: ApplicationCategoryId
  toolId?: string
  appId?: string
}

const APP_CATEGORY_PREFIX = 'apps/'

export function parseCatalogAnchor(anchor?: string): ParsedCatalogAnchor {
  if (!anchor) return { view: 'stack' }
  if (anchor === 'apps' || anchor.startsWith(APP_CATEGORY_PREFIX)) {
    const cat = anchor.startsWith(APP_CATEGORY_PREFIX)
      ? (anchor.slice(APP_CATEGORY_PREFIX.length) as ApplicationCategoryId)
      : undefined
    return { view: 'apps', applicationCategory: cat }
  }
  if (anchor.startsWith('app-')) {
    return { view: 'apps', appId: anchor.slice(4) }
  }
  if (anchor.startsWith('tool-')) {
    return { view: 'stack', toolId: anchor.slice(5) }
  }
  return { view: 'stack', toolId: anchor }
}

export function catalogAnchorForApps(category?: ApplicationCategoryId): string {
  return category ? `${APP_CATEGORY_PREFIX}${category}` : 'apps'
}

/** View/mode anchors — switching these should not scroll the page */
export function isCatalogViewAnchor(anchor?: string): boolean {
  if (!anchor || anchor === 'stack' || anchor === 'apps') return true
  if (anchor.startsWith(APP_CATEGORY_PREFIX)) return true
  return false
}
