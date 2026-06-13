# AI Stack Map — Roadmap

Living plan for content and product work. Map version in the app footer (`src/data/siteMeta.ts`) tracks shipped releases; this file tracks what's next.

**Principles (unchanged):** layers first, brands second; neutral tradeoffs; agents optional; "ignore for now" is a feature.

---

## Shipped (v1.5 – v1.7)

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
- [x] **5 new stack tools** — AWS Bedrock, Mistral AI, Cohere, Together AI, Braintrust
- [x] Per-tool **"Suggest edit"** links open pre-filled GitHub issues
- [x] Lazy-loaded all 8 pages (smaller initial bundle)
- [x] Tab bar horizontal scroll on narrow screens (no wrap/overflow clip)
- [x] GlobalSearch: arrow-key navigation, Cmd+K / "/" shortcut, active-descendant ARIA
- [x] LayerDiagram rows converted to semantic `<button>` elements
- [x] Empty-state messages with "Clear filters" in catalog
- [x] Catalog view transitions via `useTransition`
- [x] OG / Twitter Card meta + `public/og-image.png` for link previews
- [x] Content update: Salesforce Einstein → Agentforce; Adept inactive; CoCounsel → Thomson Reuters

---

## P0 — Polish & correctness

| Item | Notes |
|------|--------|
| `package.json` version | Bump to match `MAP_VERSION` (currently `1.7.0`) |
| `content` GitHub label | Create once repo is public so suggest-edit issues route correctly |
| Focus order in sketch compare | Tab order through the two editor columns; compare table rows need `role="rowgroup"` |
| Sketch validation hints | Soft warnings (e.g. agent + no eval layer) — rules only, no ML |

---

## P1 — Content depth

| Item | Notes |
|------|--------|
| More stack patterns | Batch classify, multimodal, gateway-only internal tools |
| Catalog growth | More tools/apps with `lastReviewed`; no "best" rankings |
| Compare from sketch | Suggest 2–3 compare links based on layer picks |
| Pattern → sketch | "Start from this pattern" pre-fills sketch slots |

---

## P2 — Sketch & builder

| Item | Notes |
|------|--------|
| Buy + build on one sketch | Explicit "packaged here, custom there" lane per layer |
| Export formats | JSON download in addition to markdown |
| Builder ↔ sketch sync | Re-run builder without losing manual sketch edits |
| Related compares block | Under sketch export, dynamic from picks |

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
