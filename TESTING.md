# AI Stack Map — Testing Backlog

## v1.9.0 — ARIA fix, builder↔sketch sync, buy+build annotation

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T-a1 | ARIA compare | Open compare table with a screen reader (or axe DevTools) — rows and columns announce correctly | |
| T-a2 | ARIA compare | Table has `aria-label="Layer-by-layer stack comparison"` | |
| T-a3 | ARIA compare | Diff cells that differ have `aria-label="differs"` badge | |
| T-s1 | Builder→sketch | Build a sketch → click "Refine in builder →" → lands on Builder tab | |
| T-s2 | Builder→sketch | Builder URL contains `from-sketch/{encoded}` in the hash anchor | |
| T-s3 | Builder→sketch | "Update sketch ↩" button is visible (in addition to "New sketch →") | |
| T-s4 | Builder→sketch | Clicking "Update sketch ↩" returns to Sketch with builder-recommended layers applied | |
| T-s5 | Builder→sketch | Layers that were in the original sketch keep their pick/phase if still recommended by builder | |
| T-s6 | Builder→sketch | "New sketch →" creates a fresh sketch (no previous picks carried over) | |
| T-s7 | Builder→sketch | Arriving at builder without `from-sketch/` anchor shows only "Compose stack sketch →" | |
| T-m1 | Mode toggle | Each active layer in Sketch editor shows Build / Buy / Hybrid buttons | |
| T-m2 | Mode toggle | Clicking a mode button highlights it; clicking again deselects | |
| T-m3 | Mode toggle | Mode badge (🔨/🛒/⚗️) appears in the sketch diagram for layers with a mode set | |
| T-m4 | Mode toggle | Mode is encoded in the share URL and survives page reload | |
| T-m5 | Mode toggle | "Copy markdown plan" output includes "Approach: Build / Buy / Hybrid" under applicable layers | |
| T-m6 | Mode toggle | Layers with no mode set have no badge and no approach line in markdown | |

---



Manual QA items to verify on the live Vercel deployment. Add new items as features ship; tick them off after a real browser check.

Legend: `[ ]` untested · `[~]` partial / uncertain · `[x]` confirmed good · `[!]` broken

---

## v1.8.0 — Compare from sketch, new patterns, catalog growth, JSON export

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T-c1 | Compare from sketch | Sketch with Orchestration layer → export card shows "Agent vs workflow" and "LangChain vs LlamaIndex" links | |
| T-c2 | Compare from sketch | Sketch with Capabilities + Data → shows "RAG vs fine-tuning" and "Vector DB vs pgvector" | |
| T-c3 | Compare from sketch | Sketch with no layers → no compare suggestions shown | |
| T-c4 | Compare from sketch | Clicking a suggestion navigates to the Compare tab on the right topic | |
| T-j1 | JSON export | "Download JSON" button appears in export card (single-sketch mode only) | |
| T-j2 | JSON export | Clicking it downloads a `.sketch.json` file named after the sketch title | |
| T-j3 | JSON export | Downloaded JSON contains valid `title`, `layers`, `picks`, `phases`, `ignore` fields | |
| T-p1 | New patterns | "Multimodal" and "Gateway tool" appear in the pattern selector | |
| T-p2 | New patterns | Multimodal pattern: layers = product, capabilities, model-access, data, build-ship | |
| T-p3 | New patterns | Gateway tool pattern: layers = model-access, governance, build-ship | |
| T-p4 | New patterns | "Sketch this pattern →" works for both new patterns | |
| T-t1 | New tools | Qdrant, Instructor, Groq API, DSPy, Haystack appear in Tool catalog | |
| T-t2 | New tools | Each has correct layer assignment (Qdrant=data, Instructor=capabilities, Groq=model-access, DSPy/Haystack=orchestration) | |

---

## v1.7.2 — Sketch validation hints

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T-h1 | Hints | Enable Orchestration only → two warning hints appear (no eval, no cost caps) | |
| T-h2 | Hints | Add Build & ship → "Agent loop without observability" hint disappears | |
| T-h3 | Hints | Add Governance → "Agents without cost caps" hint disappears | |
| T-h4 | Hints | Enable Capabilities without Data → info hint appears | |
| T-h5 | Hints | Enable 3+ layers with no Build & ship (no Orchestration) → info hint appears | |
| T-h6 | Hints | Dismiss a hint → it disappears and doesn't return until page reload | |
| T-h7 | Hints | No hints shown when sketch has no layer combinations that trigger rules | |

---

## v1.7.1 — Pattern → sketch

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T0a | Pattern → sketch | Each pattern card shows "Sketch this pattern →" button at the bottom | |
| T0b | Pattern → sketch | Clicking it navigates to Stack sketch with the pattern's title pre-filled | |
| T0c | Pattern → sketch | The correct layers are toggled on (e.g. Doc Q&A → product, data, capabilities, model-access, build-ship) | |
| T0d | Pattern → sketch | "Ignore for now" list is pre-populated from the pattern's "Usually skip" list | |
| T0e | Pattern → sketch | Sketch URL encodes the state — survives page reload | |

---

## v1.7.0 — Sketch compare + OG image

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T1 | Sketch compare | "Fork & compare →" button appears in Stack sketch footer and path-footer | |
| T2 | Sketch compare | Clicking it forks the current sketch into two editable columns | |
| T3 | Sketch compare | Layer diff table appears below the two columns | |
| T4 | Sketch compare | Rows with differing picks/phases show accent highlight | |
| T5 | Sketch compare | Layers absent in one sketch show muted "not in stack" cell | |
| T6 | Sketch compare | Compare URL (`#/sketch/compare/…`) survives page reload | |
| T7 | Sketch compare | "Edit A →" / "Edit B →" exits compare mode with that sketch loaded | |
| T8 | Sketch compare | "Copy compare link" button copies the full compare URL | |
| T9 | Sketch compare | Columns collapse to single column on narrow viewport (≤760 px) | |
| T10 | OG image | Paste live URL into opengraph.xyz — preview card renders with layer stack graphic | |
| T11 | OG image | Paste live URL into Slack message — unfurl shows image (not blank) | |

---

## v1.6.0 — Catalog, badges, lazy load, search

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T12 | Status badges | Adept shows "deprecated" badge in Tool catalog | |
| T13 | Status badges | CoCounsel Legal shows "acquired" badge | |
| T14 | Status badges | Salesforce Agentforce shows "pivoted" badge | |
| T15 | Status badges | Badge colours correct in dark mode (not washed out) | |
| T16 | Catalog empty state | Filter to a combination with no results → "No stack tools match…" + "Clear filters" button appears | |
| T17 | Catalog empty state | "Clear filters" resets all filters correctly | |
| T18 | Lazy loading | Hard-refresh on `#/glossary` — page loads without blank flash | |
| T19 | Lazy loading | Switch tabs rapidly — no unmounted component errors in console | |
| T20 | GlobalSearch | Cmd+K (Mac) / Ctrl+K (Win) opens search from anywhere | |
| T21 | GlobalSearch | `/` key opens search when focus is not in an input | |
| T22 | GlobalSearch | Arrow keys navigate results; Enter navigates to selection | |
| T23 | GlobalSearch | Escape closes search and returns focus | |
| T24 | Suggest edit | Each tool card has "✎ suggest edit" link | |
| T25 | Suggest edit | Clicking it opens a pre-filled GitHub issue in a new tab | |
| T26 | New tools | AWS Bedrock, Mistral AI, Cohere, Together AI, Braintrust appear in Tool catalog | |
| T27 | Changelog | Overview page has "What's changed — v1.7.0" collapsible section | |
| T28 | Changelog | All three version entries (1.7.0, 1.6.0, 1.5.1) are visible inside | |

---

## v1.5.1 — Content + accessibility fixes

| # | Area | What to check | Notes |
|---|------|---------------|-------|
| T29 | Layer diagram | Clicking a layer row expands/collapses detail | |
| T30 | Layer diagram | Layer rows are focusable and operable via keyboard (Enter/Space) | |
| T31 | Tab bar | On a ~375 px wide viewport, tab bar scrolls horizontally without wrapping | |
| T32 | Tab bar | No horizontal scrollbar visible on desktop | |
| T33 | Pattern flow | Each pattern's flow diagram shows a colour-coded legend below | |
| T34 | Sketch markdown | "Copy markdown plan" output ends with the paste-to-LLM prompt section | |
| T35 | Catalog deep link | `#/catalog/apps/category/legal` opens Enterprise apps view filtered to Legal | |
| T36 | Content | Salesforce entry name is "Salesforce Agentforce" (not "Einstein") | |
| T37 | Content | Adept entry name is "Adept (inactive)" | |
| T38 | Content | CoCounsel entry name is "CoCounsel Legal (Thomson Reuters)" | |

---

## Regression — core flows

These should pass on every deploy regardless of what shipped.

| # | Area | What to check |
|---|------|---------------|
| R1 | Routing | Direct load of `#/overview`, `#/catalog`, `#/glossary`, `#/compare`, `#/sketch` all land on the correct tab |
| R2 | Routing | Browser back/forward navigates between tabs correctly |
| R3 | Theme | Light → Dark → System toggle persists across page reload |
| R4 | Stack builder | Answering all questions produces a recommended layer set |
| R5 | Stack builder | "Take to sketch →" pre-fills the sketch with those layers |
| R6 | Sketch share | Build a sketch → copy share link → open in incognito → same sketch loads |
| R7 | Compare page | All 15 comparison topics open and scroll to the correct section |
| R8 | Glossary | A–Z jump links scroll to the correct letter group |
| R9 | Search | Searching "rag" returns at least RAG glossary entry + relevant tools |
| R10 | Mobile | Full app is usable on a 375 px viewport with no horizontal overflow |

---

## Known deferred / won't-test-yet

- PWA / offline caching (not implemented)
- i18n (not implemented)
- Community PR CI validation (not implemented)
