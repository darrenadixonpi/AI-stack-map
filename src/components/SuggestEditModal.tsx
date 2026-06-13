import { useState } from 'react'
import { suggestEditUrl, type FeedbackContext } from '../utils/feedback'

type Props = FeedbackContext & {
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const MIN_LEN = 10
const MAX_LEN = 5000

const ERRORS: Record<string, string> = {
  not_configured: 'Auto-submit isn’t configured on this deployment yet.',
  too_short: 'Please add a little more detail.',
  too_long: 'That’s a bit long — please trim it.',
  rate_limited: 'A few too many suggestions just now — try again in a few minutes.',
  github_error: 'GitHub rejected the request.',
}

export function SuggestEditModal({ onClose, ...ctx }: Props) {
  const { section, topicName } = ctx
  const [text, setText] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty
  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${window.location.hash}`
      : ''
  const fallbackUrl = suggestEditUrl(ctx)

  const submit = async () => {
    const trimmed = text.trim()
    if (trimmed.length < MIN_LEN) {
      setStatus('error')
      setMessage(ERRORS.too_short)
      return
    }
    setStatus('submitting')
    setMessage('')
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ suggestion: trimmed, section, topicName, topicId: ctx.topicId, pageUrl, website }),
      })
      const data: { ok?: boolean; url?: string; error?: string } = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setResultUrl(data.url ?? null)
        setStatus('success')
      } else {
        setStatus('error')
        setMessage(ERRORS[data.error ?? ''] ?? 'Could not submit automatically.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not reach the server.')
    }
  }

  return (
    <div
      className="suggest-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Suggest an edit"
      onClick={onClose}
    >
      <div className="suggest-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="suggest-modal-head">
          <h3>Suggest an edit</h3>
          <button type="button" className="nav-chip nav-chip-inline" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <div className="suggest-success">
            <p>Thanks — your suggestion was filed as a GitHub issue.</p>
            {resultUrl && (
              <p>
                <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                  View issue →
                </a>
              </p>
            )}
            <button type="button" className="segment-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              About <strong>{section}{topicName ? `: ${topicName}` : ''}</strong>. Describe what should
              change — a definition, tool entry, comparison, missing vendor, or typo.
            </p>
            <textarea
              className="search-input suggest-textarea"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your suggestion…"
              aria-label="Your suggestion"
              maxLength={MAX_LEN}
            />
            {/* honeypot: visually hidden, off-screen; real users never fill this */}
            <input
              type="text"
              name="website"
              className="suggest-hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            {status === 'error' && (
              <p className="suggest-error">
                {message}{' '}
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
                  Open a prefilled GitHub issue instead →
                </a>
              </p>
            )}
            <div className="suggest-actions">
              <button
                type="button"
                className="segment-btn segment-btn-primary"
                onClick={submit}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit suggestion'}
              </button>
              <a className="nav-chip nav-chip-inline" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
                Prefer GitHub? →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
