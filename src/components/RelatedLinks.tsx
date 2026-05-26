import { labelForRelated, resolveRelated, type RelatedRef } from '../data/links'
import type { NavigationTarget } from '../navigation'

interface Props {
  refs: RelatedRef[]
  onNavigate: (t: NavigationTarget) => void
}

export function RelatedLinks({ refs, onNavigate }: Props) {
  if (!refs.length) return null

  return (
    <div className="related-links">
      <span className="related-label">See also</span>
      {refs.map((ref) => {
        const target = resolveRelated(ref)
        if (!target) return null
        return (
          <button
            key={ref}
            type="button"
            className="nav-chip"
            onClick={() => onNavigate(target)}
          >
            {labelForRelated(ref)}
          </button>
        )
      })}
    </div>
  )
}
