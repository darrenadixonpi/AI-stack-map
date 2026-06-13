/**
 * Data integrity validation for src/data/*.
 * Run with: npm run validate
 * Exits non-zero on broken cross-references, duplicate IDs, or invalid categories.
 */
import { tools, toolCategories } from '../src/data/tools'
import { applicationProducts } from '../src/data/applicationTools'
import { applicationCategories } from '../src/data/applicationCategories'
import { glossaryTerms } from '../src/data/glossary'
import { comparisons } from '../src/data/comparisons'
import { stackPatterns } from '../src/data/patterns'
import { jobs } from '../src/data/jobs'
import { roleGuides } from '../src/data/roles'
import { maturityStages } from '../src/data/maturity'
import {
  buildStack,
  builderGoals,
  builderTeams,
  builderRoles,
  builderMaturities,
  builderConstraints,
  builderRisks,
} from '../src/data/stackBuilder'
import { agentTreeNodes } from '../src/data/agentTree'
import { layerOrder } from '../src/data/layers'
import type { BuilderInput } from '../src/types'

const problems: string[] = []
const warnings: string[] = []

const glossaryIds = new Set(glossaryTerms.map((t) => t.id))
const compareIds = new Set(comparisons.map((c) => c.id))
const patternIds = new Set(stackPatterns.map((p) => p.id))
const toolIds = new Set(tools.map((t) => t.id))
const appIds = new Set(applicationProducts.map((a) => a.id))
const appCatIds = new Set(applicationCategories.map((c) => c.id))

/** Sections rendered on the Compare tab that are not entries in `comparisons` (see links.ts) */
const SPECIAL_COMPARE = new Set(['harness-framework-obs'])

function dupes(ids: string[], label: string) {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) problems.push(`duplicate ${label} id: ${id}`)
    seen.add(id)
  }
}
dupes(tools.map((t) => t.id), 'tool')
dupes(applicationProducts.map((a) => a.id), 'app')
dupes(glossaryTerms.map((t) => t.id), 'glossary')
dupes(comparisons.map((c) => c.id), 'comparison')
dupes(stackPatterns.map((p) => p.id), 'pattern')
dupes(jobs.map((j) => j.id), 'job')

function checkRef(owner: string, ref: string) {
  const [kind, id] = ref.split(':')
  if (!id) {
    problems.push(`${owner}: malformed ref "${ref}"`)
    return
  }
  switch (kind) {
    case 'glossary':
      if (!glossaryIds.has(id)) problems.push(`${owner}: broken glossary ref "${id}"`)
      break
    case 'compare':
      if (!compareIds.has(id) && !SPECIAL_COMPARE.has(id))
        problems.push(`${owner}: broken compare ref "${id}"`)
      break
    case 'pattern':
      if (!patternIds.has(id)) problems.push(`${owner}: broken pattern ref "${id}"`)
      if (owner === `pattern:${id}`) warnings.push(`${owner}: self-referencing related link`)
      break
    case 'tool':
      if (!toolIds.has(id)) problems.push(`${owner}: broken tool ref "${id}"`)
      break
    case 'app':
      if (!appIds.has(id)) problems.push(`${owner}: broken app ref "${id}"`)
      break
    case 'builder':
    case 'overview':
    case 'landscape':
      break
    default:
      problems.push(`${owner}: unknown ref kind "${kind}"`)
  }
}

for (const t of glossaryTerms) (t.related ?? []).forEach((r) => checkRef(`glossary:${t.id}`, r))
for (const c of comparisons) (c.related ?? []).forEach((r) => checkRef(`compare:${c.id}`, r))
for (const p of stackPatterns) (p.related ?? []).forEach((r) => checkRef(`pattern:${p.id}`, r))
for (const t of tools) (t.related ?? []).forEach((r) => checkRef(`tool:${t.id}`, r))
for (const a of applicationProducts) (a.related ?? []).forEach((r) => checkRef(`app:${a.id}`, r))

for (const j of jobs) {
  if (j.applicationCategory && !appCatIds.has(j.applicationCategory))
    problems.push(`job:${j.id}: unknown applicationCategory "${j.applicationCategory}"`)
}

type NavLink = { label: string; target: { tab: string; anchor?: string } }
function checkNav(owner: string, links: NavLink[]) {
  const seen = new Set<string>()
  for (const l of links) {
    const key = `${l.target.tab}/${l.target.anchor ?? ''}`
    if (seen.has(key)) warnings.push(`${owner}: duplicate link target ${key} ("${l.label}")`)
    seen.add(key)
    const a = l.target.anchor
    if (!a) continue
    if (l.target.tab === 'compare' && !compareIds.has(a) && !SPECIAL_COMPARE.has(a))
      problems.push(`${owner}: compare anchor "${a}" does not exist`)
    if (l.target.tab === 'glossary' && !glossaryIds.has(a))
      problems.push(`${owner}: glossary anchor "${a}" does not exist`)
    if (l.target.tab === 'patterns' && !patternIds.has(a))
      problems.push(`${owner}: pattern anchor "${a}" does not exist`)
  }
}
for (const r of roleGuides) checkNav(`role:${r.id}`, r.links)
for (const m of maturityStages) checkNav(`maturity:${m.id}`, m.links)

// Exercise every builder combination; validate nextStep anchors
for (const g of builderGoals)
  for (const team of builderTeams)
    for (const role of builderRoles)
      for (const mat of builderMaturities)
        for (const risk of builderRisks) {
          const input: BuilderInput = {
            goal: g.id,
            team: team.id,
            role: role.id,
            maturity: mat.id,
            constraints: builderConstraints.map((c) => c.id),
            risk: risk.id,
          }
          const res = buildStack(input)
          if (res.layers.length === 0) problems.push(`builder(${g.id}/${mat.id}): empty layers`)
          for (const s of res.nextSteps) {
            if (s.tab === 'compare' && s.anchor && !compareIds.has(s.anchor) && !SPECIAL_COMPARE.has(s.anchor))
              problems.push(`builder(${g.id}): compare anchor "${s.anchor}" missing`)
            if (s.tab === 'glossary' && s.anchor && !glossaryIds.has(s.anchor))
              problems.push(`builder(${g.id}): glossary anchor "${s.anchor}" missing`)
            if (s.tab === 'patterns' && s.anchor && !patternIds.has(s.anchor))
              problems.push(`builder(${g.id}): pattern anchor "${s.anchor}" missing`)
          }
        }

for (const [id, n] of Object.entries(agentTreeNodes)) {
  if (n.yesChild && !agentTreeNodes[n.yesChild]) problems.push(`agentTree:${id}: missing yesChild "${n.yesChild}"`)
  if (n.noChild && !agentTreeNodes[n.noChild]) problems.push(`agentTree:${id}: missing noChild "${n.noChild}"`)
}

const catSet = new Set<string>(toolCategories as readonly string[])
for (const t of tools)
  if (!catSet.has(t.category)) problems.push(`tool:${t.id}: category "${t.category}" not in toolCategories`)

for (const p of applicationProducts) {
  const cat = applicationCategories.find((c) => c.id === p.applicationCategory)
  if (!cat) problems.push(`app:${p.id}: unknown category "${p.applicationCategory}"`)
  else if (cat.market !== p.market)
    problems.push(`app:${p.id}: market "${p.market}" != category "${cat.id}" market "${cat.market}"`)
}

for (const c of applicationCategories) {
  const n = applicationProducts.filter((p) => p.applicationCategory === c.id).length
  if (n === 0) problems.push(`app category "${c.id}" has no products`)
  else if (n < 2) warnings.push(`app category "${c.id}" has only ${n} product`)
}

for (const lid of layerOrder) {
  const n = tools.filter((t) => t.layer === lid).length
  if (n === 0) warnings.push(`layer "${lid}": no stack tools — sketch picks fall back to types/apps`)
}

console.log(
  `data counts: tools=${tools.length} apps=${applicationProducts.length} glossary=${glossaryTerms.length} ` +
    `comparisons=${comparisons.length} patterns=${stackPatterns.length} jobs=${jobs.length} appCats=${applicationCategories.length}`,
)
if (warnings.length) {
  console.log(`\nwarnings (${warnings.length}):`)
  warnings.forEach((w) => console.log('  ⚠ ' + w))
}
if (problems.length) {
  console.error(`\nproblems (${problems.length}):`)
  problems.forEach((p) => console.error('  ✗ ' + p))
  process.exit(1)
}
console.log('\n✓ data integrity OK')
