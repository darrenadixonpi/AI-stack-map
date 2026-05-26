# AI Stack Map

**Repository:** https://github.com/darrenadixonpi/AI-stack-map

Practitioner-oriented map of the AI tooling ecosystem — layers, jobs-to-be-done, tradeoffs, and “start here” paths. Not a vendor leaderboard or tutorial site.

**Subtitle:** *Navigate models, RAG, agents, harnesses, and observability without drowning in hype.*

## Features

| Tab | Purpose |
|-----|---------|
| **Overview** | Jobs-to-be-done, stack layers, role/maturity hubs |
| **Patterns** | Stack recipes with flow diagrams (MVP vs production) |
| **Stack builder** | Rule-based recommender → layers, tiers, what to ignore |
| **Stack sketch** | Interactive draft stack — toggle layers, picks per layer, MVP/growth, share URL |
| **Tool catalog** | Stack tools + enterprise apps (build vs buy) |
| **Landscape** | Enterprise app map by horizontal/vertical category |
| **Compare** | Confusion matrices (framework vs harness, RAG vs fine-tune, …) |
| **Glossary** | Category definitions with topic filters |

**Roadmap:** see [ROADMAP.md](./ROADMAP.md) for planned work and non-goals.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Structure

- `src/data/` — tools, patterns, glossary, comparisons, stack builder rules, enterprise apps
- `src/pages/` — tab content
- `src/utils/sketchState.ts` — encode/decode shareable stack sketches in the URL hash
- `OUTLINE.md` — product spec and content principles

UX inspired by [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/) (tabs, glossary, interactive builder, neutral tone).

**Theme:** Header toggle — **Light**, **Dark**, or **System** (follows OS via `prefers-color-scheme`). Preference is stored in `localStorage`.

## Stack sketch (share links)

Sketches are stored in the URL fragment, e.g. `#/sketch/<encoded-state>`. No server storage. Use **Copy share link** or **Copy markdown plan** on the Stack sketch tab.

Flow: run **Stack builder** → **Compose stack sketch →** → adjust layers and picks → share.

## Deploy

Static SPA — deploy `dist/` to Vercel or any static host.

**Suggest an edit:** use the header button (opens a GitHub issue with tab context pre-filled). Create a `content` label in the repo for auto-tagging. Optional env: `VITE_GITHUB_REPO` to override the repo slug (see `.env.example`).
