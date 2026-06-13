# AI Stack Map — Feature Ideas

**Drafted:** 2026-06-13 · **Status:** candidate backlog for discussion (nothing committed)

A structured brainstorm of where the platform could go next, viewed from two
audiences: **practitioners** (AI engineers / software developers who use the map
to make build decisions) and **business services** (PMs, buyers, security,
leadership who use it to scope, justify, and de-risk AI work).

**How to read this**

- **Effort:** S = a few hours / data-only · M = a component + data · L = new tab or model change
- **Fit:** how well it sits with the project's principles (below). ✅ on-ethos · ⚠️ needs care
- **New?:** net-new vs. already on `ROADMAP.md`

### Guardrails these ideas must respect

Restating the existing principles so candidates don't drift into the non-goals:

- **Layers first, brands second**; neutral tradeoffs, no "winning" stack.
- **Static SPA, no backend, no accounts** — everything is client-side and data-driven; "share" = URL hash only.
- **Not a tutorial site, not a vendor directory, not a leaderboard** — own *where things fit*, link out for *how-to*.
- **Anti-staleness** — absolute prices and dated claims rot fast; prefer relative tiers and `lastReviewed` stamps.

Any idea below that bumps one of these is flagged with how to keep it in bounds.

---

## A. For practitioners (AI engineers / software developers)

| Idea | What it adds | Effort | Fit | New? |
|------|--------------|--------|-----|------|
| **Cost & latency envelope on a sketch** | From layers + picks + a rough volume input, show an order-of-magnitude cost tier and latency band | M | ⚠️ use $/$$/$$$ tiers, not live prices | New |
| **Decision-record (ADR) export** | Extend sketch markdown with a "context / decision / alternatives / consequences" template | S | ✅ | New |
| **Stack "review" checklist** | Grow the v1.7.2 validation hints into a fuller risk lint (agents + customer-facing + no eval, RAG w/o reranker at scale, multi-provider w/o gateway) | M | ✅ | Extends |
| **Reference-implementation links per pattern** | Link each of the 8 patterns to a canonical OSS starter/template | S | ⚠️ link-rot; gate behind `lastReviewed` | New |
| **Migration / scale paths** | "Prototype on Ollama → vLLM in prod", "pgvector → dedicated vector DB when…" as compare-style content | M | ✅ | New |
| **Catalog filter facets** | Add `deployment` (serverless / self-host / VPC), `latencyClass`, `residency` fields to tool entries + filters | M | ✅ | New |
| **Map-as-data (JSON) export** | Emit the whole catalog/glossary/patterns as versioned static JSON at build time | S | ✅ OSS-friendly | New |
| **Embeddable widgets** | Standalone embeds of the layer diagram, agent decision tree, or one compare table for blogs/docs | M | ✅ | New |
| **Command palette** | Extend Cmd+K beyond search: jump to any tab/pattern/term, "compare X vs Y" quick actions | M | ✅ | Extends |
| **Offline PWA** | Cache static data for conference Wi-Fi | M | ✅ | Roadmap P3 |
| **New pattern: eval-driven dev loop** | The next pattern after real-time inference; eval set → harness → ship → trace → refine | S | ✅ | Roadmap P1 |

**Spotlights**

*Cost & latency envelope.* The single most-asked practitioner question is "what
will this cost and how slow is it?" A client-side estimator that takes a sketch
plus a volume slider (req/day, avg tokens) and returns a **relative** cost tier
and a latency band (cache hit / single call / RAG / agent loop) would be high
value. Keep it honest and non-stale by shipping **ratios and tiers**, not vendor
price tables — e.g., "agent loop ≈ 3–10× a single call," "self-host trades $/token
for fixed GPU cost above N req/day." Pairs naturally with the new real-time
inference pattern (TTFT/p95) and the build/buy annotation.

*Map-as-data + embeds.* The catalog, glossary, patterns and comparisons are
already clean typed data. Emitting them as a versioned `stack-map.json` and
offering a couple of embeddable widgets turns the project from a destination into
**infrastructure other people build on** — fully on-ethos for a neutral reference,
near-zero backend cost, and a credibility signal.

---

## B. For business services (PM / buyer / security / leadership)

| Idea | What it adds | Effort | Fit | New? |
|------|--------------|--------|-----|------|
| **Build-vs-Buy TCO view** | Per job, contrast "assemble the stack" vs "buy a packaged app" on cost / time / risk; reuses build/buy annotation + enterprise catalog | M | ✅ | New |
| **Vendor due-diligence checklist** | Per enterprise app / layer: the questions to ask (residency, SOC2/ISO, DPA, model provenance, exit/portability, SLA, pricing model) | S | ✅ governance | New |
| **Governance / compliance lens** | A toggle that overlays PII, data residency, and risk-tier framing across the map (EU AI Act risk tiers as a *framework*, not legal advice) | L | ⚠️ frame as checklist, link to primary sources | New |
| **Business-case note per pattern** | Each pattern gets problem framed, ROI levers (deflection %, time saved), KPIs to track, top risks | S | ✅ | New |
| **"Share with my exec" export** | Plain-language sketch summary: what/why, cost tier, risk flags, rough timeline — for non-technical stakeholders | S | ✅ | Extends |
| **Readiness self-assessment** | Short questionnaire → scores org on data / eval / governance / MLOps → maps to the existing maturity stages with "shore this up first" | M | ✅ | New |
| **Skill-gap / staffing view** | Aggregate the per-tool `skillFloor` of a chosen stack into "this needs ~1 ML eng + RAG experience" | S | ✅ | New |
| **Risk register from a sketch** | Turn validation hints into a tracked register (risk / likelihood / mitigation / owner) — a real PMO artifact | M | ✅ | Extends |
| **Buyer-centric Landscape filters** | Filter the enterprise map by deployment model, pricing model, target company size | M | ✅ | Extends |
| **Plain-language glossary mode** | An "explain for stakeholders" toggle on the 31 glossary terms | S | ✅ | Extends |

**Spotlights**

*Vendor due-diligence checklist.* Cheap to build, disproportionately useful, and
squarely in the governance layer the OUTLINE already calls out. A reusable list of
the right questions to put to any AI vendor — data residency, certifications, DPA,
model provenance and update policy, portability/exit, SLA, pricing model — is the
kind of neutral, evergreen content that ages well and earns enterprise trust. It
also strengthens the existing build/buy story: the checklist is what "Buy" should
trigger.

*Governance / compliance lens.* The biggest gap for business buyers is a
**security/compliance overlay**. A lens toggle that tags layers and tools with
PII exposure, residency options, and a risk-tier framing makes the map usable in
regulated settings. This is the highest-value business feature **and** the one
that most needs discipline: keep it a *framework and a set of questions* that links
out to primary regulatory sources, never legal advice or "this tool is compliant"
claims. Stamp it heavily with `lastReviewed`.

---

## C. Cross-cutting / platform

- **Freshness dashboard** — surface `lastReviewed` coverage and flag entries past N months (directly addresses `AUDIT.md` Debt 3 and the "is this data fresh?" trust problem). Effort S, ✅.
- **"State of the map" quarterly note** — a short changelog-adjacent post on what cooled down / merged / got acquired. Builds trust, fits OUTLINE Phase 3. Effort S.
- **Community edits / PR workflow** — `src/data/*` PR template + CI running `npm run validate`. Keeps data fresh without a backend. Roadmap P3, effort M.
- **Analytics-free usage signal** — optional privacy-preserving counts or none at all; a stated privacy posture is itself a business selling point. Roadmap P3.
- **i18n** — UI strings only, content stays EN unless contributed. Roadmap P3, effort L.

---

## Recommended next 5 (highest value : effort, all on-ethos)

1. **Vendor due-diligence checklist** (B) — S, evergreen, fills the governance gap, strengthens build/buy. Best ROI on the list.
2. **Eval-driven dev loop pattern** (A) — S, already the natural next pattern; keeps the practitioner core deep.
3. **Stack "review" checklist** (A) — M, extends shipped validation hints into a feature both audiences use.
4. **Map-as-data JSON export** (A) — S, turns the map into something others build on; near-zero maintenance.
5. **Freshness dashboard** (C) — S, attacks the project's #1 credibility risk (staleness) head-on.

These five are all Small/Medium, need no backend, and reinforce — rather than
stretch — the project's identity. The two **larger bets** worth scoping separately
are the **cost/latency envelope** and the **governance/compliance lens**: both are
high-value but carry staleness/scope risk, so each deserves its own design pass
with the guardrails above baked in from the start.

## Ideas deliberately left out (tension with non-goals)

- **Live pricing tables** — rot weekly; use relative tiers instead.
- **Code/config generators beyond a stub** — drifts the site toward a tutorial/boilerplate tool; a single starter `compose`/gateway-config stub is the most that fits.
- **Accounts / saved stacks / a backend** — explicit non-goal; hash-share and JSON download already cover persistence.
- **A full visual node-editor (Miro-class canvas)** — explicit non-goal; the sketch + diagram are intentionally lighter.
