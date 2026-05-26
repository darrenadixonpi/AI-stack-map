export interface AgentTreeNode {
  id: string
  question: string
  yes?: string
  no?: string
  yesChild?: string
  noChild?: string
  outcome?: string
  outcomeType?: 'stop' | 'workflow' | 'chain' | 'agent' | 'caution'
}

export const agentTreeNodes: Record<string, AgentTreeNode> = {
  start: {
    id: 'start',
    question: 'Do you need an LLM in your product at all?',
    yesChild: 'fixed-steps',
    noChild: 'outcome-no-llm',
    no: 'No',
    yes: 'Yes',
  },
  'fixed-steps': {
    id: 'fixed-steps',
    question: 'Is the task the same fixed steps every time?',
    yesChild: 'outcome-workflow',
    noChild: 'dynamic-tools',
    yes: 'Yes',
    no: 'No',
  },
  'dynamic-tools': {
    id: 'dynamic-tools',
    question: 'Must the system pick tools or actions dynamically?',
    yesChild: 'costly-failure',
    noChild: 'outcome-chain',
    yes: 'Yes',
    no: 'No',
  },
  'costly-failure': {
    id: 'costly-failure',
    question: 'Is failure costly (money, safety, compliance)?',
    yesChild: 'outcome-agent-safe',
    noChild: 'outcome-agent-proto',
    yes: 'Yes',
    no: 'No',
  },
  'outcome-no-llm': {
    id: 'outcome-no-llm',
    question: '',
    outcome: 'Stop reading agent blogs — you may not need generative AI for this problem.',
    outcomeType: 'stop',
  },
  'outcome-workflow': {
    id: 'outcome-workflow',
    question: '',
    outcome:
      'Use a workflow or chain (deterministic). Temporal, n8n, or a simple pipeline is usually enough — not a marketing “agent.”',
    outcomeType: 'workflow',
  },
  'outcome-chain': {
    id: 'outcome-chain',
    question: '',
    outcome: 'Chain + maybe RAG. Script the path; use the model for generation steps, not open-ended loops.',
    outcomeType: 'chain',
  },
  'outcome-agent-safe': {
    id: 'outcome-agent-safe',
    question: '',
    outcome:
      'Agent-style loop is plausible — narrow tools, human approval, eval harness + tracing before scale.',
    outcomeType: 'caution',
  },
  'outcome-agent-proto': {
    id: 'outcome-agent-proto',
    question: '',
    outcome: 'Prototype an agent is OK — add offline eval and observability before production traffic.',
    outcomeType: 'agent',
  },
}

export const agentReminders = [
  'Many “agents” are workflows with an LLM step.',
  'Agents add unpredictability, cost, and eval burden.',
  'Default: RAG + single-shot or chain; add loops only when exploration is required.',
]
