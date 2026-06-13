import { useState } from 'react'
import { layers, layerOrder } from '../data/layers'
import type { LayerId } from '../types'

const layerColors: Record<LayerId, string> = {
  product: 'var(--layer-product)',
  orchestration: 'var(--layer-orch)',
  capabilities: 'var(--layer-cap)',
  'model-access': 'var(--layer-model)',
  data: 'var(--layer-data)',
  'build-ship': 'var(--layer-build)',
  governance: 'var(--layer-gov)',
}

export function LayerDiagram() {
  const [selected, setSelected] = useState<LayerId | null>(null)
  const ordered = layerOrder.map((id) => layers.find((l) => l.id === id)!)
  const detail = selected ? layers.find((l) => l.id === selected) : null

  return (
    <section>
      <p className="lead">
        Most confusion is cross-layer — comparing a vector DB to an agent framework. Click a layer
        for tool types and what you can skip for now.
      </p>
      <div className="layer-stack">
        {ordered.map((layer) => (
          <button
            key={layer.id}
            type="button"
            className={`layer-row${selected === layer.id ? ' selected' : ''}`}
            onClick={() => setSelected(selected === layer.id ? null : layer.id)}
            aria-expanded={selected === layer.id}
            aria-label={`${layer.name} — ${selected === layer.id ? 'collapse' : 'expand'} detail`}
          >
            <div
              className="layer-bar"
              style={{ background: layerColors[layer.id] }}
              aria-hidden
            />
            <div className="layer-content">
              <div className="layer-name">{layer.name}</div>
              <div className="layer-desc">{layer.description}</div>
            </div>
          </button>
        ))}
      </div>
      {detail && (
        <div className="card layer-detail">
          <h3>{detail.name}</h3>
          <p>
            <strong>Tool types:</strong>
          </p>
          <ul>
            {detail.toolTypes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p>
            <strong>You probably don&apos;t need this yet if:</strong> {detail.skipIf}
          </p>
        </div>
      )}
    </section>
  )
}
