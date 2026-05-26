import { suggestEditUrl } from '../utils/feedback'

/** Site-wide metadata — update when you ship content changes */
export const MAP_VERSION = '1.5.0'
export const MAP_LAST_UPDATED = '2026-05-26'
export const CATALOG_DEFAULT_REVIEWED = '2026-05'

export const GITHUB_REPO_URL = 'https://github.com/darrenadixonpi/AI-stack-map'

/** Default suggest-edit URL (general feedback) */
export const GITHUB_SUGGEST_EDIT_URL = suggestEditUrl({ section: 'General' })
