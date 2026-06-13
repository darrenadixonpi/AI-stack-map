export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

/**
 * Most recent entries first. Keep to ~10 entries max — older history belongs
 * in git log, not in the UI.
 */
export const changelog: ChangelogEntry[] = [
  {
    version: '1.7.0',
    date: '2026-06-12',
    changes: [
      'Stack sketch: "Fork & compare" opens side-by-side diff of two sketches',
      'Compare mode highlights layers that differ in pick or phase',
      'Compare URLs encode both sketches in the hash — fully shareable',
      'OG image (public/og-image.png) wired to meta tags for link previews',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-06-12',
    changes: [
      'Added 5 catalog tools: AWS Bedrock, Mistral AI, Cohere, Together AI, Braintrust',
      'New status badges on catalog entries (acquired / deprecated / pivoted)',
      'Lazy-loaded all 8 tab pages — smaller initial bundle',
      'Accessibility: LayerDiagram rows converted to semantic buttons',
      'GlobalSearch: arrow-key navigation, Cmd+K / "/" shortcut, aria-activedescendant',
      'Tab bar now scrolls horizontally on narrow screens instead of wrapping',
      'Catalog: empty-state messages with "Clear filters" when no results',
      'Stack sketch: copy buttons show "Copied ✓" confirmation for 1.5 s',
      'Pattern flow diagrams now include a colour-coded legend',
      'Sketch markdown export appends a ready-to-paste LLM prompt',
      'Open Graph / Twitter Card meta tags added to index.html',
    ],
  },
  {
    version: '1.5.1',
    date: '2026-06-12',
    changes: [
      'Content update: Salesforce Einstein → Agentforce (Sept 2025 rebrand)',
      'Content update: Casetext CoCounsel → CoCounsel Legal (Thomson Reuters)',
      'Content update: Adept marked inactive after Amazon acquihire (mid-2024)',
      'Validated ApplicationCategoryId cast in parseCatalogAnchor',
      'Removed dead CSS classes (.compare-jump, .nav-chip-current, .start-steps)',
      'Added MAX_TOOLS_PER_LAYER dev warning in sketchPicks.ts',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-05-26',
    changes: [
      'Stack sketch — compose layers, picks, MVP/growth, share link, copy markdown',
      'Enterprise apps catalog — 49 packaged products by business function',
      'Landscape map — horizontal and vertical AI apps grid',
      'Glossary topic chips and A–Z jump navigation',
      'Agent decision tree embedded in Stack builder',
      'Global search across tools, glossary, patterns, comparisons',
      'Light / Dark / System theme toggle with anti-FOUC script',
      'Hash-based deep links for all tabs, anchors, and sketch state',
    ],
  },
]
