# AI Stack Map — Platform Outline

**Purpose:** Handoff document for building a practitioner-oriented platform that answers:

> *“The AI space is huge — agents, harnesses, frameworks, APIs, vector DBs, eval tools… **what do I actually use for my job?**”*

**Reference app (interaction model & UX inspiration):**  
https://backtest-validation-guide.vercel.app/

That site is a **validation/statistics** guide for backtesting. This project is different: an **ecosystem map** — categories, jobs-to-be-done, tradeoffs, and “start here” paths. Borrow its clarity (tabs, glossary, interactive recommender, neutral tone), not its subject matter.

---

## 1. One-sentence promise

**“Tell us what you’re trying to do; we show you the layer of the stack, the tool *types* that fit, and what you can ignore (for now).”**

---

## 2. Core user problems

- Too many product names, unclear categories (agent vs workflow vs harness vs framework).
- Marketing collapses different **layers** into one buzzword (“agent platform”).
- Practitioners don’t know **minimum viable stack** vs **production stack**.
- No neutral map — only tutorials tied to one vendor.

---

## 3. Mental model (homepage hero)

Everything sits in **layers**. Most confusion is cross-layer (e.g. comparing a vector DB to an agent framework).

```
┌─────────────────────────────────────────────────────────┐
│  PRODUCT / UX (your app, copilot, workflow UI)          │
├─────────────────────────────────────────────────────────┤
│  ORCHESTRATION (agents, chains, graphs, workflows)      │
├─────────────────────────────────────────────────────────┤
│  CAPABILITIES (RAG, tools, memory, multimodal, fine-tune)│
├─────────────────────────────────────────────────────────┤
│  MODEL ACCESS (APIs, local inference, routing, gateways)  │
├─────────────────────────────────────────────────────────┤
│  DATA (vectors, documents, feature stores, labeling)      │
├─────────────────────────────────────────────────────────┤
│  BUILD & SHIP (SDKs, hosting, observability, eval)        │
├─────────────────────────────────────────────────────────┤
│  GOVERNANCE (keys, policy, cost caps, safety filters)     │
└─────────────────────────────────────────────────────────┘
```

**Homepage interaction:** Click a layer → tool **types** → example products → “You probably don’t need this yet if…”

**Key message:** An agent framework ≠ eval harness. A vector DB ≠ an agent. A ChatGPT wrapper may only need Product + Model Access.

---

## 4. Primary navigation

### 4.1 By job-to-be-done (main entry for confused practitioners)

| I want to… | Start here (tool *types* first) |
|------------|----------------------------------|
| Call a model from my app | Model APIs / SDKs |
| Chat with my documents | RAG stack (ingest → embed → retrieve → generate) |
| Automate multi-step work | Orchestration / agents |
| Compare models or prompts | Eval harness + benchmark runner |
| Run models on my GPU / air-gap | Local inference + model hub |
| Fine-tune or adapt a model | Training / PEFT / serving stack |
| Ship to users with guardrails | Gateway + moderation + observability |
| Debug bad answers in prod | Tracing + eval + prompt/version control |
| Build an internal copilot | RAG + auth + orchestration (often *not* full agent) |
| “Do agents” because hype | Agent decision tree (§6) |

### 4.2 By role

- **App developer** — APIs, SDKs, minimal ML
- **ML engineer** — training, eval, pipelines
- **Data / platform** — stores, ingestion, governance
- **Product / PM** — feasibility, cost, latency
- **Security / compliance** — residency, logging, PII

### 4.3 By maturity

- **Experiment** — playground, one API key, notebook
- **Prototype** — RAG on small corpus, manual eval
- **Production** — observability, versioning, SLAs, cost caps
- **Enterprise** — SSO, VPC, audit, multi-team catalog

---

## 5. Site map (proposed tabs)

Mirror the reference app’s tab bar pattern; rename for this domain:

| Tab | Purpose |
|-----|---------|
| **Overview** | Stack diagram + “start here” by goal |
| **Use cases** | Stack patterns / recipes (§7) |
| **Stack builder** | Interactive recommender (§11) |
| **Tool catalog** | Searchable index by layer & function (§8) |
| **Compare** | Confusion matrix pages (§10) |
| **Glossary** | Category definitions, not product docs (§9) |

Optional later: **Changelog / hype radar** (what cooled down, what merged).

---

## 6. “Do I need an agent?” decision tree

Dedicated page + embed in Stack builder.

```
Need LLM in product?
  No → stop reading agent blogs
  Yes → Is the task fixed steps every time?
    Yes → Workflow / chain (deterministic) — usually enough
    No → Must the system pick tools dynamically?
      No → Chain + maybe RAG
      Yes → Agent-style loop
        Is failure costly (money, safety, compliance)?
          Yes → Narrow tools, human approval, eval + tracing
          No → Prototype agent OK; add eval before scale
```

**Repeat loudly:**

- Many “agents” are **workflows with an LLM step**.
- Agents add unpredictability, cost, and eval burden.
- Default: **RAG + single-shot or chain**; add loops only when exploration is required.

---

## 7. Stack patterns (recipes)

Each pattern: diagram, layers, **MVP vs production**, common mistakes, links to catalog tags.

### Pattern 1: Document Q&A (internal copilot)

- Ingest → chunk → embed → vector store → retrieve → generate
- App: your UI + auth
- Prod adds: eval set, tracing, re-index pipeline
- **Usually skip:** full agent framework, fine-tune

### Pattern 2: Customer support assist (human in loop)

- Retrieve KB + tickets; suggest reply, don’t auto-send
- CRM integration
- Prod: moderation, feedback loop, prompt A/B
- **Agent?** Often no

### Pattern 3: Research / coding assistant

- Tools: sandbox, search, repo
- Agent loops common; sandbox + allowlists
- **Must have:** tracing, tool eval, cost caps

### Pattern 4: Batch classification / extraction

- Model API or local inference
- No RAG, no agent
- Eval: harness on labeled set
- **Don’t over-engineer**

### Pattern 5: Fine-tuned domain model

- Curated data → PEFT or full FT → inference server
- **RAG vs FT:** knowledge changes often → RAG; fixed style/format → FT

---

## 8. Tool catalog structure

Organize by **function**, not hype. Lead with **types**, then example products.

### Per-entry fields

- What it does (one line)
- **Layer** (§3)
- You use it when…
- You don’t need it if…
- Pairs with (upstream / downstream)
- Build vs buy note
- OSS / commercial / both
- Skill floor (low / medium / high)

### Top-level catalog sections

1. **Model access** — hosted LLM APIs, cloud AI services
2. **SDKs & thin clients** — official SDKs, Vercel AI SDK, etc.
3. **Orchestration & agents** — LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, Semantic Kernel, Pydantic AI, …
4. **RAG & data** — loaders, chunkers, vector DBs, pgvector, Elasticsearch hybrid
5. **Eval & quality** — lm-eval-harness, promptfoo, DeepEval, Ragas, …
6. **Observability & LLMOps** — Langfuse, LangSmith, Arize, Helicone, W&B Weave, …
7. **Inference & hosting** — vLLM, TGI, Ollama, Modal, Replicate, …
8. **Training & adaptation** — HF Transformers, Axolotl, Unsloth, TRL, …
9. **Gateways & routing** — LiteLLM, Portkey, …
10. **Safety & policy** — guardrails, moderation APIs, Llama Guard, …
11. **Human labeling** — Label Studio, Argilla, …
12. **Agent protocols & tools** — MCP, OpenAPI tools, plugin hosts
13. **No-code / low-code** — Flowise, Dify, n8n AI nodes (honest: prototype vs prod)

**Maintenance:** “Last reviewed” dates; avoid claiming “best” stack.

---

## 9. Glossary (categories, ~25–40 terms to start)

Each term: **what it is**, **what it is not**, **stack neighbors**, **when you need it**.

| Term | Often confused with |
|------|---------------------|
| Model API | Agent, framework |
| SDK | Framework |
| Framework | Agent platform |
| Orchestration | “Agent” (marketing) |
| Agent | Workflow automation |
| Workflow engine | Agent |
| RAG | Fine-tuning |
| Embedding model | Chat model |
| Vector DB | Document store |
| Harness | Observability |
| Benchmark | Product eval |
| Eval platform | Harness |
| Observability / LLMOps | Offline eval |
| Gateway | API provider |
| Router | Gateway |
| Fine-tuning | RAG |
| PEFT / LoRA | Full fine-tune |
| Prompt management | CMS |
| Tool / function calling | MCP |
| MCP | Custom tools |
| Guardrails | Safety eval |
| Model hub | API |
| Inference server | Model API |
| Agent host | App server |

**Feature:** Side-by-side compare (e.g. Agent vs Workflow vs Harness vs Observability).

---

## 10. Confusion matrix (comparison pages)

Short, linked pages:

- LangChain vs LlamaIndex vs “just the SDK”
- Vector DB vs pgvector vs Elasticsearch
- Agent vs workflow (Temporal, n8n)
- RAG vs fine-tuning
- Local (Ollama) vs API
- One model vs router vs gateway
- MCP vs custom tools
- Eval harness vs LLM-as-judge in production
- “AI platform” vs assemble-yourself

**Format:** Same job? Same layer? Pick A if… Pick B if… Use both when…

---

## 11. Dedicated explainer: Harness vs framework vs observability

Bookmark page.

| | **Harness** | **Framework** | **Observability** |
|---|-------------|---------------|-------------------|
| **When** | Dev / CI | Building the app | After deploy |
| **Question** | Is model A better on task T? | How do I wire RAG + tools? | What happened in request #982? |
| **Output** | Scores, regressions | Running code | Traces, cost, latency |

**Rule of thumb:** Framework builds the plane; harness is the wind tunnel; observability is the black box in flight.

---

## 12. Stack builder (interactive recommender)

Like the reference app’s Protocol builder — rule-based first, no backend required.

### Inputs

- **Goal** — chat docs / automate / classify / code agent / fine-tune
- **Team** — solo / small product / platform team
- **Constraints** — on-prem, budget, latency
- **Risk** — internal only vs customer-facing

### Outputs

- Recommended **layers** (not 50 products)
- **3-tier list:** MVP → growth → enterprise
- **“Ignore for now”** (explicit anti-FOMO)
- **Next 3 things to learn** (glossary + pattern links)

---

## 13. Content principles

- **Neutral** — tradeoffs, not religion
- **Layers first, brands second**
- **Agents are optional**
- **“You don’t need X yet”** is a feature
- **Not a tutorial site** — link out for how-to; own **where things fit**
- **Suggest an edit** → GitHub Issues (optional Phase 1, like reference app)

---

## 14. What this is NOT

- Not a validation/statistics guide (see reference app for that style on a different topic)
- Not a model leaderboard or prompt cookbook
- Not an exhaustive vendor directory (stale quickly)
- Not one “winning” stack recommendation

---

## 15. MVP build order

**Phase 1 — Ship confusion relief**

1. Homepage stack diagram (interactive)
2. Jobs-to-be-done hub (§4.1)
3. Agent decision tree (§6)
4. Harness / framework / observability page (§11)
5. Glossary (~25 category terms)
6. 3 stack patterns (§7)
7. Catalog skeleton: 30–50 tools tagged by layer

**Phase 2**

- Full catalog + filters
- Comparison matrix (§10)
- Stack builder (§12)
- Role-based landing pages

**Phase 3**

- Community updates / PR workflow
- Quarterly “state of the map” notes

---

## 16. Suggested tech stack (match reference app)

- Vite + React + TypeScript (static SPA)
- Data in `src/data/*.ts` (tools, patterns, glossary, comparisons)
- Deploy: Vercel or similar
- Optional: same feedback-link → GitHub Issues pattern

---

## 17. Working titles

- **AI Stack Map**
- **What Tool When** (AI)
- **The AI Tooling Compass**
- **Layers, Not Logos**

**Subtitle:** *Navigate models, RAG, agents, harnesses, and observability without drowning in hype.*

---

## 18. Handoff checklist for new thread

- [ ] Read reference UX: https://backtest-validation-guide.vercel.app/
- [ ] Scaffold repo (`ai-stack-map` or similar)
- [ ] Implement tab shell + homepage layer diagram
- [ ] Seed `tools.ts`, `patterns.ts`, `glossary.ts`, `comparisons.ts`
- [ ] Stack builder (rule-based)
- [ ] Agent decision tree page
- [ ] Deploy static site

---

*Outline version: 1.0 — for greenfield build in a new thread.*
