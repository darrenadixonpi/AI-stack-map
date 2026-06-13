# AI Stack Map — Roadmap

Living plan for content and product work. Map version in the app footer (`src/data/siteMeta.ts`) tracks shipped releases; this file tracks what's next.

**Principles (unchanged):** layers first, brands second; neutral tradeoffs; agents optional; "ignore for now" is a feature.

---

## Shipped (v1.5 – v1.9)

- [x] Tab shell, theme toggle, hash routing, global search
- [x] Overview jobs, layer diagram, roles, maturity
- [x] Stack patterns with flow diagrams (with colour-coded legend)
- [x] Rule-based stack builder + agent decision tree
- [x] Tool catalog (stack tools) + enterprise landscape + enterprise apps catalog
- [x] Compare pages with topic filters
- [x] Glossary with topic chips and A–Z jump
- [x] **Stack sketch** — compose layers, picks, MVP/growth, share link, copy markdown
- [x] Sketch markdown export appends a paste-to-LLM architecture prompt
- [x] **Sketch compare** (v1.7) — "Fork & compare" opens side-by-side diff; shareable `compare/` URL encodes both sketches
- [x] **Changelog** in Overview — version history surfaced in-app
- [x] **Status badges** on catalog entries (acquired / deprecated / pivoted)
- [x] **5 new stack tools** — AWS Bedrock, Mistral AI, Cohere, Together AI, Braintrust (v1.6)
- [x] **5 more stack tools** — Qdrant, Instructor, Groq, DSPy, Haystack (v1.8)
- [x] Per-tool **"Suggest edit"** links open pre-filled GitHub issues
- [x] Lazy-loaded all 8 pages (smaller initial bundle)
- [x] Tab bar horizontal scroll on narrow screens (no wrap/overflow clip)
- [x] GlobalSearch: arrow-key navigation, Cmd+K / "/" shortcut, active-descendant ARIA
- [x] LayerDiagram rows converted to semantic `<button>` elements
- [x] Empty-state messages with "Clear filters" in catalog
- [x] Catalog view transitions via `useTransition`
- [x] OG / Twitter Card meta + `public/og-image.png` for link previews
- [x] Content update: Salesforce Einstein → Agentforce; Adept inactive; CoCounsel → Thomson Reuters
- [x] **Sketch validation hints** (v1.7.2) — soft warnings for risky layer combos (agents without eval, agents without cost caps, etc.)
- [x] **Pattern → sketch** (v1.7.1) — "Sketch this pattern →" pre-fills sketch from any pattern card
- [x] **2 new patterns** — Multimodal input pipeline, Gateway-only internal tool (v1.8; 7 total)
- [x] **Compare from sketch** (v1.8) — export card surfaces up to 3 relevant comparison topics based on active layers
- [x] **JSON export** (v1.8) — "Download JSON" saves portable `.sketch.json`
- [x] **Builder ↔ sketch sync** (v1.9) — "Refine in builder →" round-trips sketch to builder; "Update sketch ↩" merges result back preserving picks/phases
- [x] **Build / Buy / Hybrid annotation** (v1.9) — per-layer approach toggle; badge in diagram; annotation in markdown export
- [x] **Compare table ARIA** (v1.9) — semantic `<table>` replacing CSS grid divs; full screen reader support
- [x] `package.json` version kept in sync with `MAP_VERSION`

---

## P0 — Polish & correctness

| Item | Notes |
|------|--------|
| `content` GitHub label | Create once repo is public so suggest-edit issues route correctly |

---

## P1 — Content depth (next up)

| Item | Notes |
|------|--------|
| More stack patterns | Batch classify, real-time inference, fine-tune pipeline |
| Catalog maintenance | Keep `lastReviewed` current; flag newly deprecated/acquired entries |
| More enterprise app entries | Expand vertical coverage (HR, finance, dev tooling) |

---

## P2 — Sketch & builder (next up)

| Item | Notes |
|------|--------|
| Sketch → PDF export | Print-friendly single-page sketch summary |
| Compare table column sort | Click layer name to sort diff rows first |
| Sketch versioning / history | Browser-local undo history or named saved sketches |

---

## P3 — Platform (optional)

| Item | Notes |
|------|--------|
| i18n | UI strings only; content stays EN unless contributed |
| Offline PWA | Cache static data for conference Wi‑Fi |
| Community edits | PR template for `src/data/*` + CI validate IDs/links |
| Analytics-free usage | Optional Plausible / none — stay privacy-friendly |

---

## Explicit non-goals

- Model leaderboards or prompt cookbooks
- Exhaustive vendor directory (stale faster than we can ship)
- One "winning" stack recommendation
- Full visual node editor (Miro-class canvas)
- Backend accounts or saved stacks (hash share only for now)

---

## How to suggest work

Open a GitHub issue with label `roadmap` or use **Suggest an edit** in the app footer. Prefer jobs-to-be-done ("I need X when doing Y") over vendor requests alone.
