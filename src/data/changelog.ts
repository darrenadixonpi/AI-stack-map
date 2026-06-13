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
    version: '1.16.0',
    date: '2026-06-13',
    changes: [
      'Suggest-an-edit hardening: optional Cloudflare Turnstile captcha on the box, verified server-side before filing',
      'Suggest-an-edit hardening: optional durable per-IP rate limit via Upstash (falls back to the in-memory limiter)',
      'Both degrade gracefully when their keys / backend are not configured',
    ],
  },
  {
    version: '1.15.0',
    date: '2026-06-13',
    changes: [
      'Suggest an edit: type in an in-app box and it files a GitHub issue directly (via a Vercel function that holds the token server-side)',
      'Falls back to a prefilled GitHub issue link when the function is not configured; Ctrl/Cmd-click skips the box',
      'Spam control: hidden honeypot field plus length and best-effort rate limits',
    ],
  },
  {
    version: '1.14.0',
    date: '2026-06-13',
    changes: [
      'Overview: Build vs buy — relative effort / time / control / risk for common scenarios',
      'Sketch: Governance & compliance lens — per-layer checklist and risk-tier framing for your active layers',
      'Search: command-palette entries — Cmd+K jumps to any tab or key section',
      'i18n scaffold for UI strings (English) — the app shell now routes through a t() layer',
      'Offline PWA — web manifest + a service worker that caches the app shell',
      'Embeddable layer-diagram widget at /embed/layers.html',
    ],
  },
  {
    version: '1.13.0',
    date: '2026-06-13',
    changes: [
      'Overview: State of the map — what is heating up, cooling, or renamed/acquired',
      'Overview: Catalog freshness panel — review-date coverage and staleness flags',
      'Patterns: Migration & scale paths — when to move from the simple option (Ollama→vLLM, pgvector→dedicated, gateway, fine-tune, eval gate)',
      'Catalog: Deployment facet (SaaS / Self-host / Both) with a filter and a card label',
      'Landscape: filter enterprise apps by name and by the stack layer they involve',
    ],
  },
  {
    version: '1.12.0',
    date: '2026-06-13',
    changes: [
      'Sketch: Cost & latency envelope — a relative $/$$/$$$ tier and latency band derived from your layers',
      'Sketch: Copy risk register export (risk / severity / mitigation / owner table)',
      'Stack builder: Readiness self-assessment — scores data / eval / ops / governance to a maturity stage',
      'Landscape: Vendor due-diligence checklist for buy decisions',
      'Sketch hints: four more rules (RAG without eval, governance without observability, product without model access, data without capabilities)',
    ],
  },
  {
    version: '1.11.0',
    date: '2026-06-13',
    changes: [
      'New pattern: Eval-driven development loop (9 patterns total)',
      'Patterns: per-pattern Business case (problem / ROI levers / KPIs / risks) and reference implementations',
      'Glossary: "Plain language" toggle explains every term for non-technical stakeholders',
      'Sketch: Copy decision record (ADR) and Copy exec summary exports',
      'Sketch: Team & skills readout derived from the skill floor of your tool picks',
      'Overview: Download map data (JSON) — full catalog, glossary, patterns, and comparisons as portable JSON',
      'Repo: PR + issue templates and a CI workflow that runs validate + build',
    ],
  },
  {
    version: '1.10.0',
    date: '2026-06-13',
    changes: [
      'New pattern: Real-time / streaming inference — low-latency serving for chat, voice, and autocomplete (8 patterns total)',
      'Pattern covers semantic caching, health-based fallback routing, warm pools, and time-to-first-token / p95 latency SLOs',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-06-13',
    changes: [
      'Sketch: "Refine in builder →" button sends current sketch to the Stack builder',
      'Builder: "Update sketch ↩" merges builder recommendations back, preserving existing picks and phases',
      'Sketch: Build / Buy / Hybrid approach toggle on every active layer',
      'Approach annotation appears as a colour-coded badge in the sketch diagram and in markdown export',
      'Compare table rebuilt as a semantic <table> for full screen reader support (ARIA fix)',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-06-13',
    changes: [
      'Sketch export: surface up to 3 relevant Compare topics based on your layer picks',
      'Sketch export: Download JSON button saves sketch state as a portable .json file',
      'New patterns: Multimodal input pipeline + Gateway-only internal tool (7 patterns total)',
      'Catalog: 5 new tools — Qdrant, Instructor, Groq, DSPy, Haystack (57 total)',
    ],
  },
  {
    version: '1.7.2',
    date: '2026-06-13',
    changes: [
      'Sketch: soft validation hints fire when layer combos have known risks (agents without eval, agents without cost caps, RAG without data layer)',
      'Hints are dismissible per session and show above the layer slots',
    ],
  },
  {
    version: '1.7.1',
    date: '2026-06-13',
    changes: [
      'Patterns: "Sketch this pattern →" button pre-fills Stack sketch with that pattern\'s layers and skip list',
    ],
  },
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
