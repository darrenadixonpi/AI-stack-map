import type { DeploymentModel, Tool } from '../types'

const LABEL: Record<DeploymentModel, string> = {
  saas: 'SaaS',
  'self-host': 'Self-host',
  both: 'Self-host or SaaS',
}

/**
 * Deployment model for a tool — a buyer-friendly lens distinct from licence.
 * Uses an explicit `deployment` field when set, otherwise derives a sensible
 * default from the licence (OSS → self-host, commercial → SaaS, both → either).
 */
export function getToolDeployment(tool: Tool): DeploymentModel {
  if (tool.deployment) return tool.deployment
  if (tool.license === 'oss') return 'self-host'
  if (tool.license === 'commercial') return 'saas'
  return 'both'
}

export function deploymentLabel(d: DeploymentModel): string {
  return LABEL[d]
}

export const deploymentOptions: DeploymentModel[] = ['saas', 'self-host', 'both']
