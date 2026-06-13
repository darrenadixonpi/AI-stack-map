# AI Stack Map — Site-Wide Audit

**Audit date:** 2026-06-12  
**Auditor:** Claude Fable 5 (automated + manual review)  
**Scope:** All source files, data, CSS, routing, accessibility, content staleness, and build tooling.  
**Codebase version at time of audit:** 1.5.0 (post-fix)

---

## Summary

8 bugs were found and fixed inline during this audit session. 1 advisory warning
remains from the validator. Several content-staleness issues require human
follow-up. Multiple UI/UX and accessibility improvements are called out below,
along with roadmap additions.

| Severity | Count | Status |
|---|---|---|
| 🔴 Bug — fixed | 8 | Done |
| 🟡 Warning — validator | 1 | Advisory |
| 🟠 Content stale | 3 | Needs human update |
| 🔵 Code smell / tech debt | 5 | Logged |
| ♿ Accessibility | 3 | Logged |
| 💡 UI/UX suggestion | 8 | Logged |
| 🗺️ Roadmap addition | 7 | Logged |

---

## Part 1 — Bugs Fixed

### Fix 1 · Duplicate `id="agent-tree"` in AgentDecisionTree

**File:** `src/components/AgentDecisionTree.tsx`

`AgentDecisionTree` rendered `<div id="agent-tree">` in both its question branch
and its outcome branch, conflicting with the `<h2 id="agent-tree">` in
`StackBuilderPage.tsx` (the intended scroll anchor for role-guide deep links).
Browsers silently pick the first occurrence; deep-linking from the product-pm
role guide fired scrollToAnchor before the component had rendered, then landed on
the wrong element when it appeared.

**Fix:** Removed the `id` from both `<div className="agent-tree-box">` divs.
The `<h2>` in `StackBuilderPage` is the correct anchor and is always present.

---

### Fix 2 · Self-referencing related link in `fine-tune-domain` pattern

**File:** `src/data/patterns.ts`

The fine-tune-domain pattern listed `'pattern:fine-tune-domain'` in its own
`related` array. Clicking "Related" would navigate to the same card — a no-op
loop that also wasted a visible link slot.

**Fix:** Replaced with `'glossary:fine-tuning'`, which is the correct conceptual
cross-reference.

---

### Fix 3 · `compare:harness-framework-obs` silently dropped from RelatedLinks

**File:** `src/data/links.ts` (new constant added)

`harnessFrameworkObs` is a special export from `comparisons.ts` rendered directly
in `ComparePage` with `id="harness-framework-obs"`. It is not a member of the
`comparisons[]` array, so `resolveRelated('compare:harness-framework-obs')`
returned `null`. Any `related[]` array referencing it (e.g.
`glossary:observability`, `glossary:llmops`) silently omitted the link.

**Fix:** Added `SPECIAL_COMPARE_ANCHORS` map in `links.ts`. Both
`resolveRelated()` and `labelForRelated()` check this map before consulting
`comparisons[]`. The `validate-data` script explicitly whitelists this id.

---

### Fix 4 · `product-pm` role guide had two identical "Stack builder" links

**File:** `src/data/roles.ts`

The product-pm role guide defined two `{ label: 'Stack builder', target: { tab: 'builder' } }`
entries. The second was supposed to link to "Stack patterns" but was copy-pasted
incorrectly.

**Fix:** Second entry corrected to `{ label: 'Stack patterns', target: { tab: 'patterns' } }`.

---

### Fix 5 · `ml-engineer` role guide missing anchor on compare-models link

**File:** `src/data/roles.ts`

The ml-engineer role guide had `{ label: 'Compare models (job)', target: { tab: 'overview' } }`
with no anchor. The `compare-models` job card has `id="compare-models"` in
`OverviewPage`; without the anchor the link just scrolled to the top of the
Overview tab.

**Fix:** Added `anchor: 'compare-models'` to the target.

---

### Fix 6 · Redundant ternary in `StackSketchPage` (`pick.startsWith('app:')`)

**File:** `src/pages/StackSketchPage.tsx`

```ts
// Before
onClick={() => onNavigate({ tab: 'catalog', anchor: pick.startsWith('app:') ? catalogAnchor : catalogAnchor })}
```

Both branches of the ternary were identical. TypeScript strict mode did not catch
this because the types matched. Dead conditional.

**Fix:** Collapsed to a direct expression.

---

### Fix 7 · Deep-link to hidden catalog card when filters are active

**File:** `src/pages/CatalogPage.tsx`

If a user arrived at `#/catalog/app-glean` while the app category or market
filter was set (e.g. from a previous session's localStorage state or a same-tab
navigation), the card was filtered out and `scrollToAnchor` found nothing.
The same issue affected `tool-*` anchors when a layer or category filter was
active.

**Fix:** Added filter-clearing logic in the `scrollTo` effect: any `app-*` anchor
clears `marketFilter`, `appCategoryFilter`, and the search query; any `tool-*`
anchor clears `layerFilter`, `categoryFilter`, and the search query.

---

### Fix 8 · Unused `GITHUB_SUGGEST_EDIT_URL` export in `siteMeta.ts`

**File:** `src/data/siteMeta.ts`

The file imported `suggestEditUrl` from `../utils/feedback` and re-exported
`GITHUB_SUGGEST_EDIT_URL`. This export was never consumed anywhere in the
codebase (all consumers call `suggestEditUrl()` directly). With
`noUnusedLocals: true` in tsconfig, this silently passed because the value was
re-exported, but it was semantic dead weight.

**Fix:** Removed the import and the unused export.

---

### Fix 9 · New `scripts/validate-data.ts` + `npm run validate`

**Files:** `scripts/validate-data.ts`, `package.json`

No cross-reference validation existed. Broken `related[]` refs, missing anchor
targets, and duplicate IDs could be introduced silently.

**Fix:** Added a permanent Node.js validation script (bundled via esbuild so it
can import the same TypeScript source tree). Checks:

- Duplicate IDs across tools, apps, glossary terms, comparisons, patterns
- All `related[]` refs resolve (via same logic as `resolveRelated()`)
- All role guide nav links resolve
- Builder `nextStep` anchors exist on Overview page
- Agent tree child node IDs exist
- Tool `category` values are in `toolCategories`
- App `market` and `applicationCategory` values are valid
- App categories with fewer than 2 products (advisory)

Run with `npm run validate`. Exits non-zero on errors, zero on clean.

---

## Part 2 — Remaining Validator Warnings

### Warning · `gaming` application category has only 1 product

The gaming category (`applicationCategories.ts`) has only one entry: Inworld.
This makes the filter button functional but nearly useless — pressing it always
shows the same single card.

**Options:**
1. Add 1–2 more gaming-AI products (e.g. Convai, Replica Studios, Modl.ai)
2. Merge gaming into a broader "Creative / Media" category
3. Leave it — gaming AI is genuinely sparse right now; the category serves as a
   placeholder for future expansion

---

## Part 3 — Stale Content

### Stale 1 · `adept` entry describes a company that no longer exists in its original form

**File:** `src/data/applicationTools.ts`, id `adept`

The entry describes Adept as an active UI-agent startup. In mid-2024 Amazon
acquihired Adept's key staff (CEO, CTO, most engineers). The remaining company
was reduced to ~20 people. The product as described is effectively discontinued
or in maintenance.

**Recommended action:** Either remove the entry, mark it with a `status: 'inactive'`
field, or update the summary to reflect its current state (shell company; core
team at Amazon).

---

### Stale 2 · `casetext-coCounsel` entry name is pre-acquisition

**File:** `src/data/applicationTools.ts`, id `casetext-coCounsel`

Casetext was acquired by Thomson Reuters in August 2023. The product was
rebranded to "CoCounsel" and then "CoCounsel Legal" by the time of the
Thomson Reuters 2025 product announcements. The entry should reflect this.

**Recommended action:** Update `name` to "CoCounsel Legal (Thomson Reuters)",
update `summary` to note the acquisition, and verify feature claims against
Thomson Reuters' current product page.

---

### Stale 3 · `salesforce-einstein` entry predates the Agentforce rebrand

**File:** `src/data/applicationTools.ts`, id `salesforce-einstein`

Salesforce rebranded its AI product line from "Einstein" to "Agentforce" in
September 2025. The entry still uses Einstein framing throughout. This will
confuse users who look up the product by its current name (Agentforce does not
appear anywhere in the catalog).

**Recommended action:** Update `name` to "Salesforce Agentforce", update
`summary` and field descriptions to reflect the agent-first positioning, and
add a note that it was previously called Einstein Copilot / Einstein GPT.

---

## Part 4 — Code Smells and Tech Debt

### Debt 1 · `parseCatalogAnchor` contains an unchecked cast on `ApplicationCategoryId`

**File:** `src/utils/catalogAnchor.ts`

```ts
// Approximate current code
if (rest.startsWith('apps/')) {
  return { view: 'apps', applicationCategory: rest.slice(5) as ApplicationCategoryId }
}
```

The string after `apps/` is cast directly to `ApplicationCategoryId` without
validation. An invalid deep-link like `#/catalog/apps/not-a-category` would set
`appCategoryFilter` to a value that matches no category, silently showing an
empty list with no feedback to the user.

**Recommended fix:**

```ts
const candidateId = rest.slice(5)
const validCategory = applicationCategories.find(c => c.id === candidateId)
return {
  view: 'apps',
  applicationCategory: validCategory ? (candidateId as ApplicationCategoryId) : undefined
}
```

---

### Debt 2 · `MAX_TOOLS_PER_LAYER = 6` silently truncates sketch pick dropdowns

**File:** `src/data/sketchPicks.ts`

`getSketchPicksForLayer()` caps results at 6 picks per layer with no warning or
visual indicator. If a layer has more than 6 relevant tools, the user never sees
the extras. Currently no layer exceeds this limit, but new tools could trigger
silent truncation.

**Recommended fix:** Either raise the cap to a generous value (12–16), or add a
`// NOTE: if this list exceeds MAX_TOOLS_PER_LAYER, extras are silently dropped`
comment per layer so maintainers notice when adding tools. A console.warn in dev
mode when truncation fires would also help.

---

### Debt 3 · No `lastReviewed` dates on individual tool entries

**File:** `src/data/tools.ts`

All 47 tool entries fall through to `CATALOG_DEFAULT_REVIEWED` because none set
`lastReviewed` individually. The field exists on the `Tool` interface but is
universally omitted. This means the "Reviewed:" badge in the catalog always shows
the global default date, making it impossible to tell which entries are actually
fresh vs which ones need a check.

**Recommended action:** On each content update pass, stamp the affected tool
entries with the specific review date.

---

### Debt 4 · Dead CSS classes in `src/index.css`

**File:** `src/index.css`

The following classes are defined but never referenced by any component:

- `.compare-jump` (line ~940) — was part of a removed Compare tab jump-nav
- `.compare-jump-label` (line ~944)
- `.compare-jump-list` (line ~948)
- `.nav-chip-current` (line ~278) — superseded by `.segment-btn.active`
- `.start-steps` (line ~1100) — from a removed "getting started" section

Combined ~40 lines of dead CSS. Removing them has no functional impact but
reduces the stylesheet from 1491 to ~1450 lines and removes confusion for
future contributors.

---

### Debt 5 · `ROADMAP.md` P0 item "Tab bar overflow on small screens" has no implementation notes

**File:** `ROADMAP.md`

The overflow item is marked P0 but has no notes on approach. On a 360 px
viewport the 8-tab nav wraps or clips. The two most common solutions:

1. **Horizontal scroll (`overflow-x: auto`)** on `.nav-tabs` — simple, works
   with current markup, but scroll affordance is invisible on iOS/desktop
2. **Collapse to a `<select>` or bottom sheet below a breakpoint** — better UX
   but requires a layout restructure

Recommended: Option 1 first (3-line CSS change), then reassess based on usage
data.

---

## Part 5 — Accessibility

### A11y 1 · Layer rows in `LayerDiagram` are interactive `<div>` elements

**File:** `src/components/LayerDiagram.tsx`

Layer rows have `tabIndex={0}`, `onClick`, `onKeyDown`, and `aria-expanded`, but
the element is a `<div>`, not a `<button>`. Screen readers announce this as a
generic container unless `role="button"` is also present. Keyboard users rely on
Enter/Space activating button roles; a plain div with `onKeyDown` requires the
page to manually handle both keys (and the current code may not handle Space).

**Fix:** Either change the element to `<button type="button">` (preferred — free
keyboard semantics and click handling) or add `role="button"` and verify both
Enter and Space keydowns trigger the handler.

---

### A11y 2 · `GlobalSearch` result list has no visible focus ring on keyboard navigation

**File:** `src/components/GlobalSearch.tsx`

The listbox results receive `:hover` styles but the `aria-activedescendant`
pattern doesn't apply a CSS `.focused` class to the active option. A keyboard
user cannot tell which result is selected before pressing Enter.

**Fix:** Apply a `.focused` or `[data-active="true"]` class to the currently
active descendant and style it the same as `:hover`.

---

### A11y 3 · `<details>` elements have no `aria-label` on their `<summary>`

**Files:** `src/pages/OverviewPage.tsx`, `src/pages/GlossaryPage.tsx`

Several role/maturity `<details>` blocks use generic `<summary>` text like
"Role guides" or "Maturity stages". Screen readers announce these correctly, but
there is no `aria-label` differentiating them when navigating by landmark. Low
priority — existing `<summary>` text is already descriptive — but worth noting.

---

## Part 6 — UI/UX Suggestions

### UI 1 · Tab bar overflow on narrow viewports (P0 — already in ROADMAP)

See Debt 5 above. Current `.nav-tabs` wraps at ~600 px and clips at ~360 px.
Quickest fix: add `overflow-x: auto; -webkit-overflow-scrolling: touch;` to
`.nav-tabs` and `white-space: nowrap` to `.nav-tab` items.

---

### UI 2 · "Showing N of M entries" counter resets to 0 on filter change before re-render

**File:** `src/pages/CatalogPage.tsx`

When the user switches from Stack → Enterprise apps view, there's a brief flash
where `count` shows 0 before the filtered list renders. This is a React rendering
order artifact. Fix: use `useMemo` to derive `count` from the already-memoized
`filteredStack` / `filteredApps` (currently correct) but ensure the
`segment-btn.active` click re-render path doesn't interleave a zero-count state.
A `useTransition` wrap on `setCatalogView` would eliminate the flash entirely.

---

### UI 3 · Stack Sketch share link copies to clipboard with no visual confirmation

**File:** `src/pages/StackSketchPage.tsx`

The "Copy link" button writes to clipboard but the only feedback is a tooltip
that appears for ~1.5 s on some browsers. A brief in-place "Copied ✓" state on
the button itself (swap label for 1.5 s, then revert) would make the action
clearly confirmed. Pattern:

```ts
const [copied, setCopied] = useState(false)
const handleCopy = () => {
  navigator.clipboard.writeText(url)
  setCopied(true)
  setTimeout(() => setCopied(false), 1500)
}
// button label: copied ? 'Copied ✓' : 'Copy link'
```

---

### UI 4 · GlobalSearch has no keyboard shortcut

**File:** `src/components/GlobalSearch.tsx`

Common SPA convention is `/` or `Cmd+K` to focus the search input. Neither is
currently implemented. A `useEffect` listening for `'/'` (when no input is
focused) or `metaKey + k` and calling `inputRef.current?.focus()` would match
user expectations from tools like GitHub, Linear, and Notion.

---

### UI 5 · No empty-state message when catalog filters return 0 results

**File:** `src/pages/CatalogPage.tsx`

If a layer + category filter combination returns no tools, the tool list renders
empty with no explanation. Users may think the data hasn't loaded. Add:

```tsx
{filteredStack.length === 0 && (
  <p className="muted">No tools match these filters. <button onClick={resetFilters}>Clear filters</button></p>
)}
```

---

### UI 6 · Pattern flow diagram has no legend

**File:** `src/components/PatternFlowDiagram.tsx`

The four row types (envelope, pipeline, supporting, feedback) are rendered with
distinct colours but no key. First-time users cannot tell what the visual
groupings mean. A compact inline legend (2–3 lines, can collapse on mobile) would
resolve this.

---

### UI 7 · No `og:image` meta tag — share links show blank previews

**File:** `index.html`

The page has `<meta name="description">` and `<title>` but no `og:image`. When
shared on Slack, Twitter/X, LinkedIn, or iMessage, the card shows a blank image.
A simple static 1200×630 SVG (or PNG) of the layer diagram with the site name
would dramatically improve shareability. Path: `public/og-image.png`, tag:

```html
<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="twitter:card" content="summary_large_image" />
```

---

### UI 8 · Sketch markdown export could include a "paste to ChatGPT / Claude" prompt

**File:** `src/utils/sketchMarkdown.ts`

`sketchToMarkdown()` produces a clean summary of the chosen stack. A natural
extension would be to append a pre-written prompt like:

> "Given the stack above, what are the three highest-risk integration points I
> should validate before committing to this architecture?"

This makes the sketch immediately actionable from an LLM perspective and
differentiates the export from a plain list.

---

## Part 7 — Roadmap Additions

### Road 1 · Add missing foundational model-access tools

The current catalog is strong on orchestration and data but thin on the
model-access layer. Notable gaps:

| Tool | Layer | Why it matters |
|---|---|---|
| Mistral AI (API) | model-access | Top OSS-family model; widely benchmarked |
| Cohere | model-access | Enterprise-focused; strong embed + rerank story |
| Together AI | model-access | Key OSS inference provider; LLaMA/Mixtral hosting |
| AWS Bedrock | model-access | Primary enterprise on-ramp for multi-model API |
| Google Vertex AI | model-access | GCP equivalent; Gemini + Claude + open model hosting |

None of these appear in `tools.ts`. Bedrock and Vertex in particular are
essential for the security/compliance and data-platform roles.

---

### Road 2 · Add missing observability / eval tools

LLM-specific observability is one of the fastest-moving categories. Missing
notable entries:

| Tool | Category | Why |
|---|---|---|
| Braintrust | eval / observability | Strong eval + tracing combo; popular in prod |
| Arize Phoenix | observability | Open-source; LlamaTrace integration |
| Weights & Biases (LLM) | eval | Already in ML context; W&B Weave is LLM-specific |

---

### Road 3 · "What's changed" tab or changelog badge

The `MAP_LAST_UPDATED` and `MAP_VERSION` fields in `siteMeta.ts` are updated on
each release but nothing surfaces this to the user in the UI. A minimal
implementation: a `CHANGELOG.ts` data file listing the last 5–10 changes (date,
what was added/updated/fixed), surfaced as a collapsible `<details>` on the
Overview page or as a badge on the nav tab. This addresses the "is this data
fresh?" concern that skeptical users have.

---

### Road 4 · Lazy-load the JS bundle

**File:** `vite.config.ts`

Current bundle is ~332 kB JS (uncompressed). All tab content loads eagerly. The
pages with the largest data payloads (Catalog, Compare, Glossary) could be code-
split via React.lazy + Suspense:

```ts
const CatalogPage = lazy(() => import('./pages/CatalogPage'))
```

With 8 tabs, splitting even 4 of them would likely halve the initial bundle.
Vite supports this natively — no config changes required, just import changes.

---

### Road 5 · Per-tool and per-app "suggest an edit" links

The global `FeedbackLink` component links to GitHub issues with a pre-filled
subject. Individual tool and app cards could include a tiny "✎ suggest edit"
link that pre-fills the issue body with the tool ID, name, and the specific field
the user wants to correct. This dramatically lowers the barrier to crowd-sourced
data quality.

Draft URL format (already supported by `suggestEditUrl()`):

```
?title=Data+correction%3A+langchain&body=Tool+ID%3A+langchain%0A...
```

---

### Road 6 · Stack comparison ("compare two sketches")

The Stack Sketch lets users build one stack. A "compare mode" that lets users
fork their sketch or load a second sketch URL and renders them side-by-side
(same layer rows, two columns of picks) would make trade-off discussions much
more concrete. The encoding and decode infrastructure already exists; this is
primarily a UI component.

---

### Road 7 · Tool / app `status` field and staleness surface

As noted in Part 3, some catalog entries describe companies or products that have
changed significantly. A lightweight `status?: 'active' | 'acquired' | 'deprecated' | 'pivoted'`
field on `Tool` and `ApplicationProduct` — rendered as a badge in the card header
— would let maintainers flag this prominently without removing the entry. The
validate script could warn when entries haven't been reviewed within N months of
`lastReviewed`.

---

## Appendix — Validate Script Output (post-fix)

```
data counts: tools=47 apps=49 glossary=31 comparisons=15 patterns=5 jobs=16 appCats=16
warnings (1):
  ⚠ app category "gaming" has only 1 product
✓ data integrity OK
```

## Appendix — Build Output (post-fix)

```
tsc -b --force          → 0 errors
vite build              → 331.99 kB JS, 20.79 kB CSS, 0 warnings
npm run validate        → ✓ data integrity OK (1 advisory warning)
```

---

*Generated by automated audit pass on 2026-06-12. All fixes verified against a
clean `tsc` + `vite build` + `npm run validate` run.*
