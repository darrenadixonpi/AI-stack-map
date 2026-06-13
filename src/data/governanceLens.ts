import type { LayerId } from '../types'

export interface LayerGovernance {
  layer: LayerId
  concerns: string[]
}

/**
 * Governance & compliance concerns to check at each stack layer. This is a
 * neutral checklist / framework to structure the conversation — not legal advice,
 * and not a per-vendor compliance claim. Pair with the vendor due-diligence
 * checklist on the Landscape page and verify against primary sources.
 */
export const governanceByLayer: LayerGovernance[] = [
  {
    layer: 'product',
    concerns: [
      'Disclose to users that AI is involved; capture consent where required',
      'Accessibility of AI-driven UI',
      'Feedback, correction, and appeal paths for users',
    ],
  },
  {
    layer: 'orchestration',
    concerns: [
      'Tool permissions and allowlists for agents',
      'Human-in-the-loop approval for risky or irreversible actions',
      'An audit trail of every tool call and decision',
    ],
  },
  {
    layer: 'capabilities',
    concerns: [
      'What context is sent to the model (avoid leaking sensitive data)',
      'Prompt-injection surface from retrieved or tool-fetched content',
    ],
  },
  {
    layer: 'model-access',
    concerns: [
      'Provider data-use terms and training opt-out',
      'Region of inference and any cross-border transfer',
      'Key management, rotation, and per-consumer scoping',
      'Provider certifications (SOC 2, ISO 27001, etc.)',
    ],
  },
  {
    layer: 'data',
    concerns: [
      'Data residency and region of storage',
      'PII detection, minimisation, and redaction',
      'Retention and deletion policy',
      'Access control on source documents (no over-retrieval)',
    ],
  },
  {
    layer: 'build-ship',
    concerns: [
      'Audit logging of prompts, outputs, and cost',
      'Eval coverage for safety- and compliance-relevant cases',
      'Change management and rollback for prompts and models',
    ],
  },
  {
    layer: 'governance',
    concerns: [
      'Spend caps and rate limits per team or service',
      'Moderation and safety filters on inputs and outputs',
      'Policy enforcement and periodic reporting',
    ],
  },
]

export interface RiskTier {
  tier: string
  note: string
}

/** Neutral risk-tier framing (informed by risk-based regimes like the EU AI Act). */
export const riskTiers: RiskTier[] = [
  {
    tier: 'Minimal / limited risk',
    note: 'Most internal productivity uses. Transparency to users is usually the main obligation.',
  },
  {
    tier: 'High risk',
    note: 'Decisions materially affecting people (hiring, credit, health, legal, safety). Expect documentation, human oversight, data-quality and testing obligations.',
  },
  {
    tier: 'Unacceptable / prohibited',
    note: 'A narrow set of uses are restricted or banned outright in some jurisdictions. Check before building.',
  },
]
