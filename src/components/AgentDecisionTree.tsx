import { useState } from 'react'
import { agentReminders, agentTreeNodes } from '../data/agentTree'

export function AgentDecisionTree({ onReset }: { onReset?: () => void }) {
  const [nodeId, setNodeId] = useState('start')
  const node = agentTreeNodes[nodeId]

  if (!node) return null

  if (node.outcome) {
    return (
      <div className="agent-tree-box" id="agent-tree">
        <div className={`agent-outcome outcome-${node.outcomeType ?? 'default'}`}>
          <p>{node.outcome}</p>
        </div>
        <button
          type="button"
          className="agent-btn"
          style={{ marginTop: '1rem' }}
          onClick={() => {
            setNodeId('start')
            onReset?.()
          }}
        >
          Start over
        </button>
        <ul className="reminder-list" style={{ marginTop: '1.25rem' }}>
          {agentReminders.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="agent-tree-box" id="agent-tree">
      <p className="agent-question">{node.question}</p>
      <p className="agent-hint">Pick one — neither answer is selected until you click.</p>
      <div className="agent-actions" role="group" aria-label="Answer">
        {node.yesChild && (
          <button
            type="button"
            className="agent-btn"
            onClick={() => setNodeId(node.yesChild!)}
          >
            {node.yes ?? 'Yes'}
          </button>
        )}
        {node.noChild && (
          <button
            type="button"
            className="agent-btn"
            onClick={() => setNodeId(node.noChild!)}
          >
            {node.no ?? 'No'}
          </button>
        )}
      </div>
    </div>
  )
}
