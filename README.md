# AI Stack Map

**Repository:** https://github.com/darrenadixonpi/AI-stack-map

Practitioner-oriented map of the AI tooling ecosystem — layers, jobs-to-be-done, tradeoffs, and “start here” paths. Not a vendor leaderboard or tutorial site.

**Subtitle:** *Navigate models, RAG, agents, harnesses, and observability without drowning in hype.*

## Features

| Tab | Purpose |
|-----|---------|
| **Overview** | Jobs-to-be-done, stack layers, role/maturity hubs, build-vs-buy scenarios, state-of-the-map, catalog freshness, changelog, and a map-as-data JSON export |
| **Patterns** | 9 stack recipes with flow diagrams (MVP vs production), per-pattern business case + reference implementations, and migration / scale paths |
| **Stack builder** | Rule-based recommender → layers, tiers, what to ignore; plus an agent decision tree and a readiness self-assessment |
| **Stack sketch** | Interactive draft stack — layers, picks, MVP/growth, build/buy; cost & latency envelope, team & skills readout, governance lens; exports (markdown, ADR, exec summary, risk register, JSON); share + fork-and-compare URLs |
| **Tool catalog** | Stack tools + enterprise apps, filterable by layer, category, and deployment (SaaS / self-host / both) |
| **Landscape** | Enterprise app map by horizontal/vertical category, with name + stack-layer filters and a vendor due-diligence checklist |
| **Compare** | Confusion matrices (framework vs harness, RAG vs fine-tune, …) |
| **Glossary** | Category definitions with topic filters and a plain-language ("explain for stakeholders") mode |

**Platform:** global search doubles as a **command palette** (⌘K / `/` to jump to any tab or section) · **offline PWA** (web manifest + service worker) · **embeddable** layer diagram at `/embed/layers.html` · **i18n scaffold** for UI strings · community **CI** (`validate` + `build`) with PR / issue templates.

**Roadmap:** see [ROADMAP.md](./ROADMAP.md) for planned work and non-goals. Recent releases are in the in-app changelog and [`src/data/changelog.ts`](./src/data/changelog.ts).

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
npm run validate   # data integrity: IDs, cross-references, builder anchors
```

## Structure

- `src/data/` — tools, patterns, glossary, comparisons, builder rules, enterprise apps, plus build-vs-buy, governance lens, migrations, and state-of-the-map
- `src/pages/` — tab content
- `src/components/` — diagrams, search / command palette, readiness, freshness, build-vs-buy
- `src/utils/` — sketch encode/decode and the markdown / ADR / risk-register exports, cost-latency, staffing, deployment, and map-as-data JSON
- `src/i18n.ts` — UI-string scaffold (`t()` + dictionaries)
- `public/` — `manifest.webmanifest`, `sw.js` (offline), `embed/layers.html` (embeddable widget)
- `.github/` — PR + issue templates and the `validate` + `build` CI workflow
- `ROADMAP.md` · `OUTLINE.md` · `IDEAS.md` · `TESTING.md` — plan, product spec, feature backlog, QA checklist

UX inspired by [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/) (tabs, glossary, interactive builder, neutral tone).

**Theme:** Header toggle — **Light**, **Dark**, or **System** (follows OS via `prefers-color-scheme`). Preference is stored in `localStorage`.

## Stack sketch (share links)

Sketches are stored in the URL fragment, e.g. `#/sketch/<encoded-state>`. No server storage. Use **Copy share link** or **Copy markdown plan** on the Stack sketch tab.

Flow: run **Stack builder** → **Compose stack sketch →** → adjust layers and picks → share.

## Deploy

Static SPA — deploy to **Vercel** (recommended: the `api/suggest.ts` function powers the suggest-an-edit box). On a pure static host with no functions, the app still works and suggest-an-edit falls back to prefilled GitHub issue links.

**Suggest an edit:** the header button and per-entry "✎ suggest edit" links open an in-app box — type a suggestion and it files a GitHub issue (labeled `content`) via the Vercel function. Set `GITHUB_TOKEN` (a fine-grained PAT with **Issues: write**) in the Vercel project; without it the box falls back to a prefilled GitHub issue link. Ctrl/Cmd-click any suggest link to skip the box and go straight to GitHub. Optional env: `GITHUB_REPO`, `SUGGEST_LABEL`, and `VITE_GITHUB_REPO` (see `.env.example`). Spam control: a hidden honeypot + length caps, an optional **Cloudflare Turnstile** captcha (`VITE_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`), and an optional **durable per-IP rate limit** via Upstash (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, e.g. provisioned through the Vercel Marketplace). Each piece degrades gracefully if its keys are absent.
