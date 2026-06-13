import { tools, toolCategories } from '../data/tools'
import { applicationProducts } from '../data/applicationTools'
import { applicationCategories } from '../data/applicationCategories'
import { glossaryTerms } from '../data/glossary'
import { comparisons } from '../data/comparisons'
import { stackPatterns } from '../data/patterns'
import { layers } from '../data/layers'
import { jobs } from '../data/jobs'
import { MAP_VERSION, MAP_LAST_UPDATED } from '../data/siteMeta'

/**
 * Assemble the full map as a single portable, versioned JSON object — so other
 * people can build on, query, or embed the data. No backend; generated in the
 * browser from the same typed source the app renders.
 */
export function buildMapData() {
  return {
    meta: {
      source: 'AI Stack Map',
      version: MAP_VERSION,
      lastUpdated: MAP_LAST_UPDATED,
      generatedAt: new Date().toISOString(),
      counts: {
        tools: tools.length,
        apps: applicationProducts.length,
        glossary: glossaryTerms.length,
        comparisons: comparisons.length,
        patterns: stackPatterns.length,
        jobs: jobs.length,
      },
    },
    layers,
    toolCategories,
    tools,
    applicationCategories,
    applicationProducts,
    glossary: glossaryTerms,
    comparisons,
    patterns: stackPatterns,
    jobs,
  }
}

export function downloadMapData() {
  const json = JSON.stringify(buildMapData(), null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-stack-map-${MAP_VERSION}.json`
  a.click()
  URL.revokeObjectURL(url)
}
