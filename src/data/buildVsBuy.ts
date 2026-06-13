export interface BuildBuyColumn {
  effort: string
  timeToValue: string
  control: string
  risks: string
}

export interface BuildBuyScenario {
  id: string
  scenario: string
  build: BuildBuyColumn
  buy: BuildBuyColumn & { example: string }
  /** Optional related job id (Overview "Start here") */
  jobId?: string
}

/**
 * Qualitative build-vs-buy contrasts for common scenarios. Deliberately uses
 * relative effort/time and trade-offs rather than dollar figures, to stay
 * neutral and avoid pricing staleness. Not a recommendation — both columns are
 * valid depending on constraints.
 */
export const buildBuyScenarios: BuildBuyScenario[] = [
  {
    id: 'internal-doc-qa',
    scenario: 'Internal document Q&A / knowledge copilot',
    jobId: 'chat-docs',
    build: {
      effort: 'Medium — RAG stack (ingest, embed, vector store, retrieve, generate) plus an auth UI',
      timeToValue: 'Weeks',
      control: 'Full — data residency, retrieval quality, cost per query, customisation',
      risks: 'You own retrieval tuning, eval, uptime, and re-indexing over time',
    },
    buy: {
      example: 'Enterprise search / assistant suites',
      effort: 'Low — connect sources and configure access',
      timeToValue: 'Days',
      control: 'Limited — vendor owns the model, ranking, and data flow',
      risks: 'Per-seat cost at scale, data egress to the vendor, lock-in',
    },
  },
  {
    id: 'support-assist',
    scenario: 'Customer support assist (suggested replies)',
    jobId: 'support-copilot',
    build: {
      effort: 'Medium-high — KB retrieval, draft UI in the agent desktop, moderation, feedback loop',
      timeToValue: 'Weeks to a couple of months',
      control: 'Full — tone, routing, escalation rules, and CRM integration depth',
      risks: 'Integration and change-management heavy; quality needs ongoing eval',
    },
    buy: {
      example: 'Packaged support-AI products',
      effort: 'Low-medium — configure intents, connect the help desk',
      timeToValue: 'Days to weeks',
      control: 'Medium — templated workflows, limited model choice',
      risks: 'Fit to your edge cases, seat/volume pricing, switching cost',
    },
  },
  {
    id: 'batch-extraction',
    scenario: 'Batch classification / document extraction',
    jobId: 'classify',
    build: {
      effort: 'Low — a model API with structured output plus a queue worker',
      timeToValue: 'Days',
      control: 'Full — schema, throughput, cost, and on-prem option',
      risks: 'You own the labeled eval set and accuracy monitoring',
    },
    buy: {
      example: 'Document-AI / IDP platforms',
      effort: 'Low — upload samples, map fields',
      timeToValue: 'Days',
      control: 'Medium — pre-built extractors, less control of edge cases',
      risks: 'Per-page pricing, accuracy on non-standard documents, egress',
    },
  },
]
