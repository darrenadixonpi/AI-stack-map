export type LayerId =
  | 'product'
  | 'orchestration'
  | 'capabilities'
  | 'model-access'
  | 'data'
  | 'build-ship'
  | 'governance'

export type SkillFloor = 'low' | 'medium' | 'high'
export type LicenseType = 'oss' | 'commercial' | 'both'
export type EntryStatus = 'active' | 'acquired' | 'deprecated' | 'pivoted'

export type RelatedRef = string

export interface Layer {
  id: LayerId
  name: string
  shortName: string
  description: string
  toolTypes: string[]
  skipIf: string
}

export interface Job {
  id: string
  title: string
  startHere: string
  layerIds: LayerId[]
  tabHint?: string
  /** Routes to enterprise app catalog filter */
  applicationCategory?: ApplicationCategoryId
  buyPathLabel?: string
}

export type GlossaryCategoryId =
  | 'model-access'
  | 'orchestration'
  | 'data-rag'
  | 'build-ship'
  | 'capabilities'
  | 'governance'

export interface GlossaryTerm {
  id: string
  term: string
  category: GlossaryCategoryId
  confusedWith: string[]
  whatItIs: string
  whatItIsNot: string
  neighbors: string
  whenYouNeedIt: string
  related?: RelatedRef[]
}

export interface Tool {
  id: string
  name: string
  summary: string
  layer: LayerId
  category: string
  useWhen: string
  skipIf: string
  pairsWith: string
  buildVsBuy: string
  license: LicenseType
  skillFloor: SkillFloor
  lastReviewed?: string
  status?: EntryStatus
  related?: RelatedRef[]
}

export type SketchPhase = 'mvp' | 'growth'
export type SketchLayerMode = 'build' | 'buy' | 'hybrid'

export interface StackSketchState {
  title: string
  layers: LayerId[]
  picks: Partial<Record<LayerId, string>>
  phases: Partial<Record<LayerId, SketchPhase>>
  ignore: string[]
  modes?: Partial<Record<LayerId, SketchLayerMode>>
}

export interface PatternDiagramStep {
  id: string
  label: string
  layer: LayerId
}

export interface PatternDiagramFeedback {
  fromStepId: string
  toStepId: string
  label: string
  layer?: LayerId
  productionOnly?: boolean
}

export interface PatternDiagram {
  /** Spans the flow (UI, policy wrapper) */
  envelope?: PatternDiagramStep[]
  pipeline: PatternDiagramStep[]
  /** Second row: governance, ops, integrations */
  supporting?: PatternDiagramStep[]
  feedback?: PatternDiagramFeedback[]
  excludes?: string[]
}

export interface StackPattern {
  id: string
  title: string
  /** Short label for pattern selector control */
  shortLabel: string
  summary: string
  diagram: PatternDiagram
  layers: LayerId[]
  mvp: string[]
  production: string[]
  mistakes: string[]
  usuallySkip: string[]
  related?: RelatedRef[]
}

export type CompareGroupId =
  | 'build-ship'
  | 'orchestration'
  | 'data-capabilities'
  | 'model-access'
  | 'enterprise-buy'
  | 'governance'

export interface Comparison {
  id: string
  title: string
  group: CompareGroupId
  sameJob: string
  sameLayer: string
  pickA: string
  pickB: string
  useBoth: string
  options: { name: string; pickIf: string }[]
  related?: RelatedRef[]
}

export type BuilderGoal =
  | 'chat-docs'
  | 'automate'
  | 'classify'
  | 'code-agent'
  | 'fine-tune'
  | 'ship-guardrails'

export type BuilderTeam = 'solo' | 'small' | 'platform'
export type BuilderRole = 'app-dev' | 'ml-engineer' | 'data-platform' | 'product-pm' | 'security'
export type BuilderMaturity = 'experiment' | 'prototype' | 'production' | 'enterprise'
export type BuilderConstraint = 'on-prem' | 'budget' | 'latency'
export type BuilderRisk = 'internal' | 'customer'

export interface BuilderInput {
  goal: BuilderGoal
  team: BuilderTeam
  role: BuilderRole
  maturity: BuilderMaturity
  constraints: BuilderConstraint[]
  risk: BuilderRisk
}

export interface BuilderResult {
  layers: LayerId[]
  mvp: string[]
  growth: string[]
  enterprise: string[]
  ignoreForNow: string[]
  nextSteps: { label: string; tab: string; anchor?: string }[]
}

export type MarketAxis = 'horizontal' | 'vertical'

export type ApplicationCategoryId =
  | 'search'
  | 'image'
  | 'data-science'
  | 'video-audio'
  | 'sales'
  | 'rpa-automation'
  | 'customer-support'
  | 'marketing'
  | 'presentation-design'
  | 'productivity'
  | 'code-documentation'
  | 'healthcare'
  | 'legal'
  | 'bio'
  | 'finance'
  | 'gaming'

export interface ApplicationProduct {
  id: string
  name: string
  summary: string
  market: MarketAxis
  applicationCategory: ApplicationCategoryId
  stackLayers: LayerId[]
  useWhen: string
  skipIf: string
  buildVsBuy: string
  lastReviewed?: string
  status?: EntryStatus
  related?: RelatedRef[]
}
