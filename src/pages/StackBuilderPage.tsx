import { useEffect, useMemo, useState } from 'react'
import { AgentDecisionTree } from '../components/AgentDecisionTree'
import {
  buildStack,
  builderConstraints,
  builderGoals,
  builderMaturities,
  builderRisks,
  builderRoles,
  builderTeams,
} from '../data/stackBuilder'
import { layers } from '../data/layers'
import type {
  BuilderConstraint,
  BuilderGoal,
  BuilderMaturity,
  BuilderRisk,
  BuilderRole,
  BuilderTeam,
} from '../types'
import { encodeSketchState, defaultSketchFromBuilder } from '../utils/sketchState'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget) => void
  scrollTo?: string
}

export function StackBuilderPage({ onNavigate, scrollTo }: Props) {
  const [goal, setGoal] = useState<BuilderGoal>('chat-docs')
  const [team, setTeam] = useState<BuilderTeam>('small')
  const [role, setRole] = useState<BuilderRole>('app-dev')
  const [maturity, setMaturity] = useState<BuilderMaturity>('prototype')
  const [constraints, setConstraints] = useState<BuilderConstraint[]>([])
  const [risk, setRisk] = useState<BuilderRisk>('internal')

  useEffect(() => {
    if (scrollTo) {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollTo])

  const result = useMemo(
    () => buildStack({ goal, team, role, maturity, constraints, risk }),
    [goal, team, role, maturity, constraints, risk],
  )

  const toggleConstraint = (c: BuilderConstraint) => {
    setConstraints((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  return (
    <>
      <h2>Stack builder</h2>
      <p className="lead">
        Set your goal and risk first. Open advanced options only if role, maturity, or constraints
        matter for your case.
      </p>

      <div className="card">
        <div className="segment-group">
          <div className="segment-label">Goal</div>
          <div className="segment-row">
            {builderGoals.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`segment-btn${goal === g.id ? ' active' : ''}`}
                onClick={() => setGoal(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="segment-group">
          <div className="segment-label">Risk</div>
          <div className="segment-row">
            {builderRisks.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`segment-btn${risk === r.id ? ' active' : ''}`}
                onClick={() => setRisk(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <details className="builder-advanced">
          <summary>Advanced (role, maturity, team, constraints)</summary>
          <div className="builder-advanced-body">
            <div className="segment-group">
              <div className="segment-label">Role</div>
              <div className="segment-row">
                {builderRoles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`segment-btn${role === r.id ? ' active' : ''}`}
                    onClick={() => setRole(r.id)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="segment-group">
              <div className="segment-label">Maturity</div>
              <div className="segment-row">
                {builderMaturities.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`segment-btn${maturity === m.id ? ' active' : ''}`}
                    onClick={() => setMaturity(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="segment-group">
              <div className="segment-label">Team</div>
              <div className="segment-row">
                {builderTeams.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`segment-btn${team === t.id ? ' active' : ''}`}
                    onClick={() => setTeam(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="segment-group">
              <div className="segment-label">Constraints</div>
              <div className="check-row">
                {builderConstraints.map((c) => (
                  <label key={c.id} className="check-label">
                    <input
                      type="checkbox"
                      checked={constraints.includes(c.id)}
                      onChange={() => toggleConstraint(c.id)}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>

      <div className="card builder-output">
        <div className="builder-output-header">
          <h3>Recommended layers</h3>
          <button
            type="button"
            className="segment-btn"
            onClick={() =>
              onNavigate({
                tab: 'sketch',
                anchor: encodeSketchState(defaultSketchFromBuilder(result)),
              })
            }
          >
            Compose stack sketch →
          </button>
        </div>
        <p>
          {result.layers
            .map((id) => layers.find((l) => l.id === id)?.name ?? id)
            .join(' · ')}
        </p>

        <div className="tier-block">
          <h4>MVP</h4>
          <ol>
            {result.mvp.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        {result.growth.length > 0 && (
          <div className="tier-block">
            <h4>Growth</h4>
            <ol>
              {result.growth.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        )}
        {result.enterprise.length > 0 && (
          <div className="tier-block">
            <h4>Enterprise</h4>
            <ol>
              {result.enterprise.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        )}
        {result.ignoreForNow.length > 0 && (
          <div className="tier-block">
            <h4>Ignore for now</h4>
            <ul className="ignore-list">
              {result.ignoreForNow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <h3>Next 3 things to learn</h3>
        <ol>
          {result.nextSteps.map((step) => (
            <li key={step.label}>
              <button
                type="button"
                className="nav-chip"
                onClick={() =>
                  onNavigate({
                    tab: step.tab as NavigationTarget['tab'],
                    anchor: step.anchor,
                  })
                }
              >
                {step.label} →
              </button>
            </li>
          ))}
        </ol>
      </div>

      <h2 id="agent-tree">Do I need an agent?</h2>
      <p className="lead">Walk through before picking an agent framework.</p>
      <AgentDecisionTree />
    </>
  )
}
