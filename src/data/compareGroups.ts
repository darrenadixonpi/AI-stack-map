import type { CompareGroupId } from '../types'

export const compareGroups: { id: CompareGroupId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'build-ship', label: 'Build & ship' },
  { id: 'orchestration', label: 'Orchestration' },
  { id: 'data-capabilities', label: 'Data & capabilities' },
  { id: 'model-access', label: 'Model access' },
  { id: 'enterprise-buy', label: 'Enterprise / buy' },
  { id: 'governance', label: 'Governance' },
]

/** Topic for the harness vs framework vs observability table */
export const HARNESS_COMPARE_GROUP: CompareGroupId = 'build-ship'
