import type { ApplicationCategoryId, MarketAxis } from '../types'

export interface ApplicationCategoryMeta {
  id: ApplicationCategoryId
  label: string
  market: MarketAxis
  description: string
}

export const applicationCategories: ApplicationCategoryMeta[] = [
  {
    id: 'search',
    label: 'Search',
    market: 'horizontal',
    description: 'Enterprise knowledge search and “find anything in the org” copilots.',
  },
  {
    id: 'image',
    label: 'Image',
    market: 'horizontal',
    description: 'Generative and editing tools for marketing, design, and creative teams.',
  },
  {
    id: 'data-science',
    label: 'Data science',
    market: 'horizontal',
    description: 'Analytics copilots, SQL assistants, and notebook-style data exploration.',
  },
  {
    id: 'video-audio',
    label: 'Video / audio',
    market: 'horizontal',
    description: 'Transcription, dubbing, avatars, and generative media for comms teams.',
  },
  {
    id: 'sales',
    label: 'Sales',
    market: 'horizontal',
    description: 'Revenue intelligence, outbound copy, and CRM-embedded sales assistants.',
  },
  {
    id: 'rpa-automation',
    label: 'RPA / automation',
    market: 'horizontal',
    description: 'Workflow automation and document bots — often rule-based, not full agents.',
  },
  {
    id: 'customer-support',
    label: 'Customer support',
    market: 'horizontal',
    description: 'Contact-center AI, deflection, and agent-assist on tickets and chat.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    market: 'horizontal',
    description: 'Copy, personalization, and campaign content at scale.',
  },
  {
    id: 'presentation-design',
    label: 'Presentation / design',
    market: 'horizontal',
    description: 'Slides, brand design, and collaborative visual tools.',
  },
  {
    id: 'productivity',
    label: 'Productivity',
    market: 'horizontal',
    description: 'Inbox, docs, and meeting assistants embedded in daily work tools.',
  },
  {
    id: 'code-documentation',
    label: 'Code / documentation',
    market: 'horizontal',
    description: 'IDE assistants and dev-focused codegen — overlaps the builder stack.',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    market: 'vertical',
    description: 'Clinical documentation, patient comms, and regulated health workflows.',
  },
  {
    id: 'legal',
    label: 'Legal',
    market: 'vertical',
    description: 'Contract review, litigation prep, and legal research copilots.',
  },
  {
    id: 'bio',
    label: 'Bio',
    market: 'vertical',
    description: 'Protein / molecule design and lab-oriented generative tools.',
  },
  {
    id: 'finance',
    label: 'Finance',
    market: 'vertical',
    description: 'Accounting, FP&A, and research assistants for finance teams.',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    market: 'vertical',
    description: 'NPC dialogue, narrative, and in-world character systems.',
  },
]

export const horizontalCategories = applicationCategories.filter((c) => c.market === 'horizontal')
export const verticalCategories = applicationCategories.filter((c) => c.market === 'vertical')

export function categoryLabel(id: ApplicationCategoryId): string {
  return applicationCategories.find((c) => c.id === id)?.label ?? id
}
