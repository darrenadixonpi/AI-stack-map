import type { Job } from '../types'
import type { NavigationTarget } from '../navigation'
import { catalogAnchorForApps } from './catalogAnchor'

export function targetForJob(job: Job): NavigationTarget {
  if (job.id === 'enterprise-search-job') {
    return { tab: 'compare', anchor: 'enterprise-search-vs-rag' }
  }
  if (job.applicationCategory) {
    return { tab: 'catalog', anchor: catalogAnchorForApps(job.applicationCategory) }
  }
  const tab = (job.tabHint as NavigationTarget['tab']) ?? 'builder'
  const anchor = job.id === 'agents-hype' ? 'agent-tree' : undefined
  return { tab, anchor }
}
