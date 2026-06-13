# AI Stack Map — Roadmap

Living plan for content and product work. Map version in the app footer (`src/data/siteMeta.ts`) tracks shipped releases; this file tracks what’s next.

**Principles (unchanged):** layers first, brands second; neutral tradeoffs; agents optional; “ignore for now” is a feature.

---

## Shipped (v1.5)

- [x] Tab shell, theme toggle, hash routing, global search
- [x] Overview jobs, layer diagram, roles, maturity
- [x] Stack patterns with flow diagrams
- [x] Rule-based stack builder + agent decision tree
- [x] Tool catalog (stack tools) + enterprise landscape + enterprise apps catalog
- [x] Compare pages with topic filters
- [x] Glossary with topic chips and A–Z jump
- [x] **Stack sketch** — compose layers, picks, MVP/growth, share link, copy markdown

---

## P0 — Polish & correctness

| Item | Notes |
|------|--------|
| Tab bar overflow on small screens | Quick fix: `overflow-x: auto; -webkit-overflow-scrolling: touch` on `.nav-tabs` + `white-space: nowrap` on `.nav-tab`. Clips at ~360 px today. |
| Catalog / sketch deep links | Ensure `app-*` opens enterprise apps view reliably |
| Content review pass | Align `package.json` version with `MAP_VERSION` |
| Suggest-edit wiring | Repo uses `VITE_GITHUB_REPO` (see `.env.example`); create the `content` label once repo is public |
| Accessibility audit | Focus order on sketch selects, compare segment rows |

---

## P1 — Content depth

| Item | Notes |
|------|--------|
| More stack patterns | Batch classify, multimodal, gateway-only internal tools |
| Catalog growth | More tools/apps with `lastReviewed`; no “best” rankings |
| Compare from sketch | Suggest 2–3 compare links based on layer picks |
| Pattern → sketch | “Start from this pattern” pre-fills sketch slots |
| Changelog / hype radar | Optional tab: what cooled down, merged, renamed (OUTLINE optional) |

---

## P2 — Sketch & builder

| Item | Notes |
|------|--------|
| Buy + build on one sketch | Explicit “packaged here, custom there” lane per layer |
| Sketch validation hints | Soft warnings (e.g. agent + no eval) — rules only, no ML |
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
| Analytics-free usage | Optional Plausible/ none — stay privacy-friendly |

---

## Explicit non-goals

- Model leaderboards or prompt cookbooks
- Exhaustive vendor directory (stale faster than we can ship)
- One “winning” stack recommendation
- Full visual node editor (Miro-class canvas)
- Backend accounts or saved stacks (hash share only for now)

---

## How to suggest work

Open a GitHub issue with label `roadmap` or use **Suggest an edit** in the app footer. Prefer jobs-to-be-done (“I need X when doing Y”) over vendor requests alone.
