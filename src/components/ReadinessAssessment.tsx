import { useState } from 'react'

interface Question {
  id: string
  dimension: string
  text: string
}

const QUESTIONS: Question[] = [
  { id: 'evalset', dimension: 'Eval', text: 'Do you have a labeled eval set that reflects real tasks?' },
  { id: 'gate', dimension: 'Eval', text: 'Do you gate prompt / model changes on an automated quality check?' },
  { id: 'tracing', dimension: 'Ops', text: 'Is there tracing / observability on production AI calls?' },
  { id: 'versioning', dimension: 'Ops', text: 'Do you version prompts and models, and can you roll back?' },
  { id: 'governance', dimension: 'Governance', text: 'Are there spend caps and access controls on model usage?' },
  { id: 'data', dimension: 'Data', text: 'Is your source data access-controlled and refreshable?' },
]

type Answer = 0 | 1 | 2

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Partly' },
  { value: 2, label: 'Yes' },
]

const STAGES = [
  { max: 3, name: 'Experiment', advice: 'You are exploring — keep it cheap and manual, but start a small eval set now.' },
  { max: 7, name: 'Prototype', advice: 'You have the basics. Before customer traffic, close the biggest gap below.' },
  { max: 10, name: 'Production-leaning', advice: 'Solid foundation. Harden the weakest dimension and add a CI eval gate.' },
  { max: 12, name: 'Production / enterprise', advice: 'Mature posture. Keep the eval set growing from real failures and review governance regularly.' },
]

export function ReadinessAssessment() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const answered = Object.keys(answers).length
  const total = (Object.values(answers) as number[]).reduce((a, b) => a + b, 0)
  const incomplete = answered < QUESTIONS.length
  const stage = STAGES.find((s) => total <= s.max) ?? STAGES[STAGES.length - 1]

  const dimScores: Record<string, { sum: number; count: number }> = {}
  for (const q of QUESTIONS) {
    if (q.id in answers) {
      if (!dimScores[q.dimension]) dimScores[q.dimension] = { sum: 0, count: 0 }
      dimScores[q.dimension].sum += answers[q.id]
      dimScores[q.dimension].count += 1
    }
  }
  let weakest: string | null = null
  let weakestAvg = Infinity
  for (const [dim, s] of Object.entries(dimScores)) {
    const avg = s.sum / s.count
    if (avg < weakestAvg) {
      weakestAvg = avg
      weakest = dim
    }
  }

  return (
    <div className="card readiness">
      <h3>Readiness self-assessment</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Six quick questions across data, eval, ops, and governance. Nothing is stored — it maps you to
        a maturity stage and the gap to close first.
      </p>
      <ul className="readiness-questions">
        {QUESTIONS.map((q) => (
          <li key={q.id} className="readiness-q">
            <span className="readiness-q-text">
              <span className="readiness-dim">{q.dimension}</span> {q.text}
            </span>
            <span className="readiness-opts" role="group" aria-label={q.text}>
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`segment-btn${answers[q.id] === o.value ? ' active' : ''}`}
                  aria-pressed={answers[q.id] === o.value}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.value }))}
                >
                  {o.label}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      {answered > 0 && (
        <div className="readiness-result">
          <p>
            <strong>
              Score {total} / 12 — {stage.name}
            </strong>
            {incomplete && (
              <span style={{ color: 'var(--text-muted)' }}>
                {' '}
                (answer all {QUESTIONS.length} for an accurate read)
              </span>
            )}
          </p>
          <p style={{ fontSize: '0.9rem' }}>{stage.advice}</p>
          {weakest && (
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Shore up first:</strong> {weakest}.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
