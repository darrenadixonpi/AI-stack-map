/** GitHub repo for issues and content PRs */
export const GITHUB_REPO =
  (import.meta.env.VITE_GITHUB_REPO as string | undefined) ?? 'darrenadixonpi/AI-stack-map'

export type FeedbackContext = {
  section: string
  detail?: string
  topicName?: string
  topicId?: string
}

export function suggestEditUrl({ section, detail, topicName, topicId }: FeedbackContext): string {
  const title = `[Suggestion] ${section}${topicName ? `: ${topicName}` : ''}`
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${window.location.hash}`
      : ''

  const body = [
    '## Section',
    section,
    detail ? `\n## Page context\n${detail}` : '',
    pageUrl ? `\n## Page URL\n${pageUrl}` : '',
    topicName
      ? `\n## Topic\n${topicName}${topicId ? ` (\`${topicId}\`)` : ''}`
      : '',
    '\n## Suggestion',
    '_Describe what should change — definition, tool entry, comparison, missing vendor, typo, etc._',
    '\n---',
    '_Submitted from [AI Stack Map](https://github.com/darrenadixonpi/AI-stack-map)._',
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({ title, body, labels: 'content' })
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`
}

export const SECTION_LABELS: Record<string, string> = {
  overview: 'Overview',
  patterns: 'Patterns',
  builder: 'Stack builder',
  sketch: 'Stack sketch',
  catalog: 'Tool catalog',
  landscape: 'Enterprise landscape',
  compare: 'Compare',
  glossary: 'Glossary',
}
