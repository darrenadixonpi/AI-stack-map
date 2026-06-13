export interface StateOfMapNote {
  heading: string
  items: string[]
}

/**
 * A short, periodically-updated "state of the map" — what is heating up, cooling
 * down, or has been renamed/acquired. Deliberately qualitative and conservative;
 * update on each review pass. Not predictions, just observed movement.
 */
export const stateOfMap: { asOf: string; notes: StateOfMapNote[] } = {
  asOf: '2026-06',
  notes: [
    {
      heading: 'Heating up',
      items: [
        'Eval-driven workflows and LLM-as-judge tooling moving from nice-to-have to table stakes',
        'Low-latency serving (vLLM, Groq, TGI) as real-time chat and voice UX raise the latency bar',
        'Gateways and routers as multi-model and provider-fallback become the default posture',
      ],
    },
    {
      heading: 'Cooling / consolidating',
      items: [
        'Standalone "agent platforms" folding into broader orchestration frameworks',
        'Bare vector databases commoditising as Postgres/pgvector and hybrid search mature',
        'Prompt-only "wrappers" giving way to retrieval + eval as the minimum serious stack',
      ],
    },
    {
      heading: 'Renamed / acquired',
      items: [
        'Salesforce Einstein → Agentforce (Sept 2025 rebrand)',
        'Casetext CoCounsel → CoCounsel Legal (Thomson Reuters)',
        'Adept core team moved to Amazon — original product effectively inactive',
      ],
    },
  ],
}
