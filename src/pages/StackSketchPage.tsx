import { useCallback, useEffect, useMemo, useState } from 'react'
import { StackSketchDiagram } from '../components/StackSketchDiagram'
import { getSketchPicksForLayer, catalogAnchorForPick, labelForPickId } from '../data/sketchPicks'
import { layers, layerOrder } from '../data/layers'
import { targetToHash } from '../navigation'
import {
  decodeSketchState,
  emptySketchState,
  encodeSketchState,
  encodeCompareAnchor,
  parseCompareAnchor,
} from '../utils/sketchState'
import { sketchToMarkdown } from '../utils/sketchMarkdown'
import { getSketchHints } from '../utils/sketchHints'
import type { LayerId, SketchPhase, StackSketchState } from '../types'
import type { NavigationTarget } from '../navigation'

interface Props {
  onNavigate: (t: NavigationTarget, replace?: boolean) => void
  scrollTo?: string
  onAnchorChange?: (anchor: string | undefined) => void
}

// ─── Single-sketch editor ────────────────────────────────────────────────────

interface EditorProps {
  state: StackSketchState
  setState: (updater: (prev: StackSketchState) => StackSketchState) => void
  onNavigate: (t: NavigationTarget, replace?: boolean) => void
}

function SketchEditor({ state, setState, onNavigate }: EditorProps) {
  const [ignoreDraft, setIgnoreDraft] = useState('')
  const [dismissedHints, setDismissedHints] = useState<string[]>([])
  const hints = getSketchHints(state.layers).filter((h) => !dismissedHints.includes(h.id))

  const toggleLayer = (layerId: LayerId) => {
    setState((prev) => {
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
    setState((prev) => {
      const picks = { ...prev.picks }
      if (!pickId) delete picks[layerId]
      else picks[layerId] = pickId
      return { ...prev, picks }
    })
  }

  const setPhase = (layerId: LayerId, phase: SketchPhase) => {
    setState((prev) => ({
      ...prev,
      phases: { ...prev.phases, [layerId]: phase },
    }))
  }

  const addIgnore = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      ignore: prev.ignore.includes(trimmed) ? prev.ignore : [...prev.ignore, trimmed],
    }))
  }

  const removeIgnore = (text: string) => {
    setState((prev) => ({
      ...prev,
      ignore: prev.ignore.filter((x) => x !== text),
    }))
  }

  return (
    <>
      <div className="card sketch-controls">
        <label className="sketch-title-label">
          <span className="segment-label">Sketch title</span>
          <input
            type="text"
            className="search-input"
            value={state.title}
            onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
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

      {hints.length > 0 && (
        <div className="sketch-hints" role="list" aria-label="Stack hints">
          {hints.map((hint) => (
            <div
              key={hint.id}
              role="listitem"
              className={`sketch-hint sketch-hint-${hint.severity}`}
            >
              <div className="sketch-hint-body">
                <strong className="sketch-hint-title">
                  {hint.severity === 'warning' ? '⚠ ' : 'ℹ '}
                  {hint.message}
                </strong>
                <p className="sketch-hint-suggestion">{hint.suggestion}</p>
              </div>
              <button
                type="button"
                className="sketch-hint-dismiss"
                aria-label={`Dismiss: ${hint.message}`}
                onClick={() => setDismissedHints((d) => [...d, hint.id])}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

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
                    onClick={() => onNavigate({ tab: 'catalog', anchor: catalogAnchor })}
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
    </>
  )
}

// ─── Compare view ─────────────────────────────────────────────────────────────

type DiffStatus = 'same' | 'diff' | 'only-a' | 'only-b'

function layerDiffStatus(
  layerId: LayerId,
  a: StackSketchState,
  b: StackSketchState,
): DiffStatus {
  const inA = a.layers.includes(layerId)
  const inB = b.layers.includes(layerId)
  if (!inA && !inB) return 'same'
  if (inA && !inB) return 'only-a'
  if (!inA && inB) return 'only-b'
  const pickA = a.picks[layerId] ?? ''
  const pickB = b.picks[layerId] ?? ''
  const phaseA = a.phases[layerId] ?? 'mvp'
  const phaseB = b.phases[layerId] ?? 'mvp'
  if (pickA !== pickB || phaseA !== phaseB) return 'diff'
  return 'same'
}

interface CompareViewProps {
  a: StackSketchState
  b: StackSketchState
  onEditA: () => void
  onEditB: () => void
}

function SketchCompareView({ a, b, onEditA, onEditB }: CompareViewProps) {
  const diffCount = layerOrder.filter((id) => layerDiffStatus(id, a, b) !== 'same').length

  return (
    <div className="sketch-compare-wrap">
      <p className="sketch-compare-summary" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {diffCount === 0
          ? 'Sketches are identical across all layers.'
          : `${diffCount} layer${diffCount !== 1 ? 's' : ''} differ between the two sketches.`}
      </p>

      <div className="sketch-compare-grid">
        {/* Column headers */}
        <div className="sketch-compare-header sketch-compare-label-col" />
        <div className="sketch-compare-header sketch-compare-a-col">
          <strong>{a.title}</strong>
          <button type="button" className="nav-chip nav-chip-inline" onClick={onEditA}>
            Edit A →
          </button>
        </div>
        <div className="sketch-compare-header sketch-compare-b-col">
          <strong>{b.title}</strong>
          <button type="button" className="nav-chip nav-chip-inline" onClick={onEditB}>
            Edit B →
          </button>
        </div>

        {/* Layer rows */}
        {layerOrder.map((layerId) => {
          const layer = layers.find((l) => l.id === layerId)!
          const status = layerDiffStatus(layerId, a, b)
          if (status === 'same' && !a.layers.includes(layerId)) return null // absent in both — skip

          const rowClass = `sketch-compare-row sketch-compare-row-${status}`

          const CellA = () => {
            if (!a.layers.includes(layerId))
              return <span className="sketch-compare-absent">not in stack</span>
            return (
              <>
                <span className={`sketch-phase-badge sketch-phase-${a.phases[layerId] ?? 'mvp'}`}>
                  {(a.phases[layerId] ?? 'mvp') === 'mvp' ? 'MVP' : 'Growth'}
                </span>
                <span className="sketch-compare-pick">
                  {labelForPickId(a.picks[layerId]) || '—'}
                </span>
              </>
            )
          }

          const CellB = () => {
            if (!b.layers.includes(layerId))
              return <span className="sketch-compare-absent">not in stack</span>
            return (
              <>
                <span className={`sketch-phase-badge sketch-phase-${b.phases[layerId] ?? 'mvp'}`}>
                  {(b.phases[layerId] ?? 'mvp') === 'mvp' ? 'MVP' : 'Growth'}
                </span>
                <span className="sketch-compare-pick">
                  {labelForPickId(b.picks[layerId]) || '—'}
                </span>
              </>
            )
          }

          return (
            <div key={layerId} className={rowClass} role="row">
              <div className="sketch-compare-label-col">
                <span className="sketch-compare-layer-name">{layer.shortName}</span>
                {status !== 'same' && (
                  <span className="sketch-compare-diff-badge" aria-label="differs">≠</span>
                )}
              </div>
              <div className="sketch-compare-a-col">
                <CellA />
              </div>
              <div className="sketch-compare-b-col">
                <CellB />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StackSketchPage({ onNavigate, scrollTo, onAnchorChange }: Props) {
  const compareInit = parseCompareAnchor(scrollTo)

  const [state, setState] = useState<StackSketchState>(() => {
    if (compareInit) return emptySketchState()
    return decodeSketchState(scrollTo) ?? emptySketchState()
  })
  const [compareMode, setCompareMode] = useState(!!compareInit)
  const [compareA, setCompareA] = useState<StackSketchState>(compareInit?.[0] ?? emptySketchState())
  const [compareB, setCompareB] = useState<StackSketchState>(compareInit?.[1] ?? emptySketchState())

  const [copiedMd, setCopiedMd] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    const c = parseCompareAnchor(scrollTo)
    if (c) {
      setCompareMode(true)
      setCompareA(c[0])
      setCompareB(c[1])
      return
    }
    const decoded = decodeSketchState(scrollTo)
    if (decoded) {
      setCompareMode(false)
      setState(decoded)
    }
  }, [scrollTo])

  // Sync URL for single sketch mode
  const syncSingleUrl = useCallback(
    (next: StackSketchState) => {
      const encoded = encodeSketchState(next)
      onAnchorChange?.(encoded)
      history.replaceState(null, '', targetToHash({ tab: 'sketch', anchor: encoded }))
    },
    [onAnchorChange],
  )

  // Sync URL for compare mode
  const syncCompareUrl = useCallback(
    (a: StackSketchState, b: StackSketchState) => {
      const anchor = encodeCompareAnchor(a, b)
      onAnchorChange?.(anchor)
      history.replaceState(null, '', targetToHash({ tab: 'sketch', anchor }))
    },
    [onAnchorChange],
  )

  const updateState = (updater: (prev: StackSketchState) => StackSketchState) => {
    setState((prev) => {
      const next = updater(prev)
      syncSingleUrl(next)
      return next
    })
  }

  const updateCompareA = (updater: (prev: StackSketchState) => StackSketchState) => {
    setCompareA((prev) => {
      const next = updater(prev)
      syncCompareUrl(next, compareB)
      return next
    })
  }

  const updateCompareB = (updater: (prev: StackSketchState) => StackSketchState) => {
    setCompareB((prev) => {
      const next = updater(prev)
      syncCompareUrl(compareA, next)
      return next
    })
  }

  const enterCompareMode = () => {
    // Fork current sketch into both A and B slots
    const copy: StackSketchState = { ...state, title: state.title + ' (B)' }
    setCompareA(state)
    setCompareB(copy)
    setCompareMode(true)
    syncCompareUrl(state, copy)
  }

  const exitCompareMode = (which?: 'a' | 'b') => {
    const picked = which === 'b' ? compareB : compareA
    setState(picked)
    setCompareMode(false)
    syncSingleUrl(picked)
  }

  const shareUrl = useMemo(() => {
    const encoded = compareMode
      ? encodeCompareAnchor(compareA, compareB)
      : encodeSketchState(state)
    const base = `${window.location.origin}${window.location.pathname}`
    return `${base}#/sketch/${encoded}`
  }, [state, compareMode, compareA, compareB])

  const handleCopyMarkdown = async () => {
    const md = sketchToMarkdown(state)
    try {
      await navigator.clipboard.writeText(md)
      setCopiedMd(true)
      setTimeout(() => setCopiedMd(false), 1500)
    } catch {
      // silently ignore — browser may block clipboard without user gesture
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 1500)
    } catch {
      // silently ignore
    }
  }

  return (
    <>
      <h2>Stack sketch{compareMode ? ' — compare' : ''}</h2>
      <p className="lead">
        {compareMode
          ? 'Side-by-side comparison of two stack sketches. Layers that differ are highlighted.'
          : 'Compose a draft framework: toggle layers, pick tool types or example products, and mark MVP vs growth. Share a link or copy markdown for a design doc — not a vendor recommendation.'}
      </p>

      <p className="path-footer">
        {compareMode ? (
          <>
            <button
              type="button"
              className="nav-chip nav-chip-inline"
              onClick={() => exitCompareMode('a')}
            >
              ← Edit sketch A
            </button>{' '}
            <button
              type="button"
              className="nav-chip nav-chip-inline"
              onClick={() => exitCompareMode('b')}
            >
              ← Edit sketch B
            </button>
          </>
        ) : (
          <>
            Start from{' '}
            <button
              type="button"
              className="nav-chip nav-chip-inline"
              onClick={() => onNavigate({ tab: 'builder' })}
            >
              Stack builder
            </button>{' '}
            for suggested layers,{' '}
            <button
              type="button"
              className="nav-chip nav-chip-inline"
              onClick={() => updateState(() => emptySketchState())}
            >
              reset sketch
            </button>
            , or{' '}
            <button
              type="button"
              className="nav-chip nav-chip-inline"
              onClick={enterCompareMode}
            >
              Fork &amp; compare →
            </button>
            .
          </>
        )}
      </p>

      {compareMode ? (
        <>
          <div className="sketch-compare-editors">
            <div className="card sketch-compare-editor-col">
              <h3>Sketch A — {compareA.title}</h3>
              <SketchEditor state={compareA} setState={updateCompareA} onNavigate={onNavigate} />
            </div>
            <div className="card sketch-compare-editor-col">
              <h3>Sketch B — {compareB.title}</h3>
              <SketchEditor state={compareB} setState={updateCompareB} onNavigate={onNavigate} />
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3>Layer diff</h3>
            <SketchCompareView
              a={compareA}
              b={compareB}
              onEditA={() => exitCompareMode('a')}
              onEditB={() => exitCompareMode('b')}
            />
          </div>
        </>
      ) : (
        <SketchEditor state={state} setState={updateState} onNavigate={onNavigate} />
      )}

      <div className="card sketch-export">
        <h3>Export</h3>
        <div className="sketch-export-actions">
          {!compareMode && (
            <button type="button" className="segment-btn" onClick={handleCopyMarkdown}>
              {copiedMd ? 'Copied ✓' : 'Copy markdown plan'}
            </button>
          )}
          <button type="button" className="segment-btn" onClick={handleCopyLink}>
            {copiedLink ? 'Copied ✓' : compareMode ? 'Copy compare link' : 'Copy share link'}
          </button>
          {!compareMode && (
            <button type="button" className="segment-btn" onClick={enterCompareMode}>
              Fork &amp; compare →
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          {compareMode
            ? 'Compare link encodes both sketches in the URL (no server storage).'
            : 'Share link encodes this sketch in the URL (no server storage).'}
        </p>
      </div>
    </>
  )
}
