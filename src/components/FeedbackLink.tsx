import { useState } from 'react'
import { suggestEditUrl, type FeedbackContext } from '../utils/feedback'
import { SuggestEditModal } from './SuggestEditModal'

type Props = FeedbackContext & {
  className?: string
  label?: string
}

export function FeedbackLink({
  className = 'feedback-link',
  label = 'Suggest an edit',
  ...ctx
}: Props) {
  const [open, setOpen] = useState(false)
  const href = suggestEditUrl(ctx)

  return (
    <>
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          // Plain click opens the in-app box; ctrl/cmd/middle-click still opens GitHub directly.
          if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {label}
      </a>
      {open && <SuggestEditModal {...ctx} onClose={() => setOpen(false)} />}
    </>
  )
}
