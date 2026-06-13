export interface DueDiligenceGroup {
  id: string
  title: string
  questions: string[]
}

/**
 * Neutral, evergreen questions to put to any AI vendor before procurement.
 * Not legal advice — a starting checklist for the governance / buy conversation.
 */
export const dueDiligenceChecklist: DueDiligenceGroup[] = [
  {
    id: 'security-compliance',
    title: 'Security & compliance',
    questions: [
      'Which certifications do you hold (SOC 2 Type II, ISO 27001, HIPAA, FedRAMP)?',
      'Can you share a recent penetration-test summary?',
      'How is data encrypted in transit and at rest?',
      'Do you support SSO / SAML and role-based access control?',
    ],
  },
  {
    id: 'data-privacy',
    title: 'Data & privacy',
    questions: [
      'Is our data used to train your models or any third-party models? Can we opt out?',
      'Where is data stored and processed (region / residency options)?',
      'What is your data retention and deletion policy?',
      'Will you sign a DPA, and who are your sub-processors?',
    ],
  },
  {
    id: 'model-quality',
    title: 'Model & quality',
    questions: [
      'Which underlying models power this, and can we pin or choose versions?',
      'How do you evaluate quality, and will you share the methodology?',
      'How are model updates communicated and rolled out?',
      'What guardrails or moderation are applied, and can we configure them?',
    ],
  },
  {
    id: 'reliability',
    title: 'Reliability & support',
    questions: [
      'What uptime SLA do you offer, and what are the remedies?',
      'What are the rate limits, and how do you handle bursts?',
      'What is your incident communication and status-page practice?',
      'What support tiers and response times are available?',
    ],
  },
  {
    id: 'commercials-exit',
    title: 'Commercials & exit',
    questions: [
      'How is pricing structured (per seat, per token, tiered), and how does it scale?',
      'How does price change at renewal, and is there lock-in?',
      'Can we export our data and configuration if we leave, and in what format?',
      'What is the offboarding process and timeline?',
    ],
  },
]
