export type Locale = 'en'

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * UI-string scaffold. Content (catalog, glossary, patterns) stays English; this
 * covers app-shell strings so the UI can be localised without touching data.
 * Add a locale by adding a dictionary and extending `Locale`.
 */
const en = {
  'app.title': 'AI Stack Map',
  'app.subtitle':
    'Navigate models, RAG, agents, harnesses, and observability without drowning in hype.',
  'nav.overview': 'Overview',
  'nav.patterns': 'Patterns',
  'nav.builder': 'Stack builder',
  'nav.sketch': 'Stack sketch',
  'nav.catalog': 'Tool catalog',
  'nav.landscape': 'Landscape',
  'nav.compare': 'Compare',
  'nav.glossary': 'Glossary',
  'search.placeholder': 'Search map… (⌘K)',
} as const

export type StringKey = keyof typeof en

const dictionaries: Record<Locale, Partial<Record<StringKey, string>>> = { en }

let currentLocale: Locale = DEFAULT_LOCALE

export function setLocale(locale: Locale): void {
  currentLocale = locale
}

export function getLocale(): Locale {
  return currentLocale
}

/** Translate a UI-string key. Falls back to English, then the key itself. */
export function t(key: StringKey): string {
  return dictionaries[currentLocale]?.[key] ?? en[key] ?? key
}
