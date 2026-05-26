import { useCallback, useEffect, useMemo, useState } from 'react'
import { StackSketchDiagram } from '../components/StackSketchDiagram'
import { getSketchPicksForLayer, catalogAnchorForPick } from '../data/sketchPicks'
import { layers, layerOrder } from '../data/layers'
import { targetToHash } from '../navigation'
import {
  decodeSketchState,
  emptySketchState,
  encodeSketchState,
} from '../utils/sketchState'
import { sketchToMarkdown } from '../utils/sketchMarkdown'
import type { LayerId, SketchPhase, StackSketchState } from '../types'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget, replace?: boolean) => void
  scrollTo?: string
  onAnchorChange?: (anchor: string | undefined) => void
}

export function StackSketchPage({ onNavigate, scrollTo, onAnchorChange }: Props) {
  const [state, setState] = useState<StackSketchState>(() => {
    return decodeSketchState(scrollTo) ?? emptySketchState()
  })
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  useEffect(() => {
    const decoded = decodeSketchState(scrollTo)
    if (decoded) setState(decoded)
  }, [scrollTo])

  const syncUrl = useCallback(
    (next: StackSketchState) => {
      const encoded = encodeSketchState(next)
      onAnchorChange?.(encoded)
      history.replaceState(null, '', targetToHash({ tab: 'sketch', anchor: encoded }))
    },
    [onAnchorChange],
  )

  const updateState = (updater: (prev: StackSketchState) => StackSketchState) => {
    setState((prev) => {
      const next = updater(prev)
      syncUrl(next)
      return next
    })
  }

  const toggleLayer = (layerId: LayerId) => {
    updateState((prev) => {
      const has = prev.layers.includes(layerId)
      const layersNext = has
        ? prev.layers.filter((l) => l !== layerId)
        : [...prev.layers, layerId]
      const ordered = layerOrder.filter((l) => layersNext.includes(l))
      const phases = { ...prev.phases }
      if (!has) phases[layerId] = phases[layerId] ?? 'mvp'
      return { ...prev, layers: ordered, phases }
    })
  }

  const setPick = (layerId: LayerId, pickId: string) => {
    updateState((prev) => {
      const picks = { ...prev.picks }
      if (!pickId) delete picks[layerId]
      else picks[layerId] = pickId
      return { ...prev, picks }
    })
  }

  const setPhase = (layerId: LayerId, phase: SketchPhase) => {
    updateState((prev) => ({
      ...prev,
      phases: { ...prev.phases, [layerId]: phase },
    }))
  }

  const addIgnore = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    updateState((prev) => ({
      ...prev,
      ignore: prev.ignore.includes(trimmed) ? prev.ignore : [...prev.ignore, trimmed],
    }))
  }

  const removeIgnore = (text: string) => {
    updateState((prev) => ({
      ...prev,
      ignore: prev.ignore.filter((x) => x !== text),
    }))
  }

  const shareUrl = useMemo(() => {
    const encoded = encodeSketchState(state)
    const base = `${window.location.origin}${window.location.pathname}`
    return `${base}#/sketch/${encoded}`
  }, [state])

  const handleCopyMarkdown = async () => {
    const md = sketchToMarkdown(state)
    try {
      await navigator.clipboard.writeText(md)
      setCopyStatus('Copied markdown to clipboard')
    } catch {
      setCopyStatus('Copy failed — select text manually')
    }
    setTimeout(() => setCopyStatus(null), 3000)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('Copied share link')
    } catch {
      setCopyStatus('Copy failed')
    }
    setTimeout(() => setCopyStatus(null), 3000)
  }

  const [ignoreDraft, setIgnoreDraft] = useState('')

  return (
    <>
      <h2>Stack sketch</h2>
      <p className="lead">
        Compose a draft framework: toggle layers, pick tool types or example products, and mark MVP vs
        growth. Share a link or copy markdown for a design doc — not a vendor recommendation.
      </p>

      <p className="path-footer">
        Start from{' '}
        <button
          type="button"
          className="nav-chip nav-chip-inline"
          onClick={() => onNavigate({ tab: 'builder' })}
        >
          Stack builder
        </button>{' '}
        for suggested layers, or{' '}
        <button
          type="button"
          className="nav-chip nav-chip-inline"
          onClick={() => updateState(() => emptySketchState())}
        >
          reset sketch
        </button>
        .
      </p>

      <div className="card sketch-controls">
        <label className="sketch-title-label">
          <span className="segment-label">Sketch title</span>
          <input
            type="text"
            className="search-input"
            value={state.title}
            onChange={(e) => updateState((prev) => ({ ...prev, title: e.target.value }))}
            aria-label="Sketch title"
          />
        </label>

        <div className="segment-group">
          <div className="segment-label">Layers in your stack</div>
          <div className="filter-row">
            {layerOrder.map((layerId) => (
              <button
                key={layerId}
                type="button"
                className={`segment-btn${state.layers.includes(layerId) ? ' active' : ''}`}
                onClick={() => toggleLayer(layerId)}
                aria-pressed={state.layers.includes(layerId)}
              >
                {layers.find((l) => l.id === layerId)?.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sketch-layout">
        <div className="sketch-diagram-col card">
          <h3>Preview</h3>
          <StackSketchDiagram state={state} />
        </div>

        <div className="sketch-slots-col">
          <h3>Layer slots</h3>
          {layerOrder.map((layerId) => {
            if (!state.layers.includes(layerId)) return null
            const layer = layers.find((l) => l.id === layerId)!
            const picks = getSketchPicksForLayer(layerId)
            const phase = state.phases[layerId] ?? 'mvp'
            const pick = state.picks[layerId] ?? ''
            const catalogAnchor = pick ? catalogAnchorForPick(pick) : null

            return (
              <div key={layerId} className="card sketch-slot">
                <h4>{layer.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{layer.description}</p>

                <div className="segment-group">
                  <div className="segment-label">Phase</div>
                  <div className="segment-row">
                    {(['mvp', 'growth'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`segment-btn${phase === p ? ' active' : ''}`}
                        onClick={() => setPhase(layerId, p)}
                      >
                        {p === 'mvp' ? 'MVP' : 'Growth'}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="sketch-pick-label-wrap">
                  <span className="segment-label">Pick (type or example)</span>
                  <select
                    className="sketch-select"
                    value={pick}
                    onChange={(e) => setPick(layerId, e.target.value)}
                    aria-label={`Pick for ${layer.shortName}`}
                  >
                    {picks.map((opt) => (
                      <option key={opt.id || 'skip'} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                {catalogAnchor && (
                  <button
                    type="button"
                    className="nav-chip nav-chip-inline"
                    onClick={() =>
                      onNavigate({
                        tab: 'catalog',
                        anchor: pick.startsWith('app:') ? catalogAnchor : catalogAnchor,
                      })
                    }
                  >
                    Open in catalog →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3>Ignore for now</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Explicit anti-FOMO — what you are not buying or building in this phase.
        </p>
        <ul className="ignore-list">
          {state.ignore.map((item) => (
            <li key={item}>
              {item}{' '}
              <button
                type="button"
                className="nav-chip nav-chip-inline"
                onClick={() => removeIgnore(item)}
                aria-label={`Remove ${item}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="sketch-ignore-add">
          <input
            type="text"
            className="search-input"
            placeholder="Add item…"
            value={ignoreDraft}
            onChange={(e) => setIgnoreDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addIgnore(ignoreDraft)
                setIgnoreDraft('')
              }
            }}
            aria-label="Add ignore item"
          />
          <button
            type="button"
            className="segment-btn"
            onClick={() => {
              addIgnore(ignoreDraft)
              setIgnoreDraft('')
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="card sketch-export">
        <h3>Export</h3>
        <div className="sketch-export-actions">
          <button type="button" className="segment-btn" onClick={handleCopyMarkdown}>
            Copy markdown plan
          </button>
          <button type="button" className="segment-btn" onClick={handleCopyLink}>
            Copy share link
          </button>
        </div>
        {copyStatus && (
          <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
            {copyStatus}
          </p>
        )}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Share link encodes this sketch in the URL (no server storage).
        </p>
      </div>
    </>
  )
}
