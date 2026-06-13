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
import {
  sketchToMarkdown,
  sketchToADR,
  sketchToExecSummary,
  sketchToRiskRegister,
} from '../utils/sketchMarkdown'
import { getSketchHints } from '../utils/sketchHints'
import { getStaffingSummary } from '../utils/sketchStaffing'
import { getCostLatencyEnvelope } from '../utils/sketchCostLatency'
import { getRelevantComparisons } from '../utils/sketchCompares'
import { governanceByLayer, riskTiers } from '../data/governanceLens'
import { comparisons } from '../data/comparisons'
import type { LayerId, SketchLayerMode, SketchPhase, StackSketchState } from '../types'
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

  const setMode = (layerId: LayerId, mode: SketchLayerMode | undefined) => {
    setState((prev) => {
      const modes = { ...(prev.modes ?? {}) }
      if (mode === undefined) {
        delete modes[layerId]
      } else {
        modes[layerId] = mode
      }
      return { ...prev, modes: Object.keys(modes).length > 0 ? modes : undefined }
    })
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

                <div className="segment-group">
                  <div className="segment-label">Approach</div>
                  <div className="segment-row">
                    {(['build', 'buy', 'hybrid'] as const).map((m) => {
                      const currentMode = state.modes?.[layerId]
                      return (
                        <button
                          key={m}
                          type="button"
                          className={`segment-btn sketch-mode-btn sketch-mode-${m}${currentMode === m ? ' active' : ''}`}
                          onClick={() => setMode(layerId, currentMode === m ? undefined : m)}
                          aria-pressed={currentMode === m}
                        >
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                      )
                    })}
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

  const visibleRows = layerOrder
    .map((layerId) => ({ layerId, status: layerDiffStatus(layerId, a, b) }))
    .filter(({ status, layerId }) => !(status === 'same' && !a.layers.includes(layerId)))

  return (
    <div className="sketch-compare-wrap">
      <p className="sketch-compare-summary" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {diffCount === 0
          ? 'Sketches are identical across all layers.'
          : `${diffCount} layer${diffCount !== 1 ? 's' : ''} differ between the two sketches.`}
      </p>

      <table className="sketch-compare-table" aria-label="Layer-by-layer stack comparison">
        <thead>
          <tr>
            <th scope="col" className="sketch-compare-label-col">Layer</th>
            <th scope="col" className="sketch-compare-a-col">
              <span>{a.title}</span>
              <button type="button" className="nav-chip nav-chip-inline" onClick={onEditA}>
                Edit A →
              </button>
            </th>
            <th scope="col" className="sketch-compare-b-col">
              <span>{b.title}</span>
              <button type="button" className="nav-chip nav-chip-inline" onClick={onEditB}>
                Edit B →
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map(({ layerId, status }) => {
            const layer = layers.find((l) => l.id === layerId)!

            const cellA = !a.layers.includes(layerId)
              ? <span className="sketch-compare-absent">not in stack</span>
              : <>
                  <span className={`sketch-phase-badge sketch-phase-${a.phases[layerId] ?? 'mvp'}`}>
                    {(a.phases[layerId] ?? 'mvp') === 'mvp' ? 'MVP' : 'Growth'}
                  </span>
                  <span className="sketch-compare-pick">{labelForPickId(a.picks[layerId]) || '—'}</span>
                </>

            const cellB = !b.layers.includes(layerId)
              ? <span className="sketch-compare-absent">not in stack</span>
              : <>
                  <span className={`sketch-phase-badge sketch-phase-${b.phases[layerId] ?? 'mvp'}`}>
                    {(b.phases[layerId] ?? 'mvp') === 'mvp' ? 'MVP' : 'Growth'}
                  </span>
                  <span className="sketch-compare-pick">{labelForPickId(b.picks[layerId]) || '—'}</span>
                </>

            return (
              <tr key={layerId} className={`sketch-compare-row-${status}`}>
                <th scope="row" className="sketch-compare-label-col">
                  <span className="sketch-compare-layer-name">{layer.shortName}</span>
                  {status !== 'same' && (
                    <span className="sketch-compare-diff-badge" aria-label="differs">≠</span>
                  )}
                </th>
                <td className="sketch-compare-a-col">{cellA}</td>
                <td className="sketch-compare-b-col">{cellB}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
  const [copiedAdr, setCopiedAdr] = useState(false)
  const [copiedExec, setCopiedExec] = useState(false)
  const [copiedRisk, setCopiedRisk] = useState(false)

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

  const handleCopyAdr = async () => {
    try {
      await navigator.clipboard.writeText(sketchToADR(state))
      setCopiedAdr(true)
      setTimeout(() => setCopiedAdr(false), 1500)
    } catch {
      // silently ignore
    }
  }

  const handleCopyExec = async () => {
    try {
      await navigator.clipboard.writeText(sketchToExecSummary(state))
      setCopiedExec(true)
      setTimeout(() => setCopiedExec(false), 1500)
    } catch {
      // silently ignore
    }
  }

  const handleCopyRisk = async () => {
    try {
      await navigator.clipboard.writeText(sketchToRiskRegister(state))
      setCopiedRisk(true)
      setTimeout(() => setCopiedRisk(false), 1500)
    } catch {
      // silently ignore
    }
  }

  const handleDownloadJson = () => {
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.sketch.json`
    a.click()
    URL.revokeObjectURL(url)
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

      {!compareMode && state.layers.length > 0 && (() => {
        const env = getCostLatencyEnvelope(state)
        return (
          <div className="card sketch-envelope">
            <h3>Cost &amp; latency envelope</h3>
            <div className="sketch-envelope-grid">
              <div>
                <span className="segment-label">Relative cost</span>
                <p className="sketch-envelope-tier">{env.costTier}</p>
                <ul className="sketch-envelope-drivers">
                  {env.costDrivers.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="segment-label">Latency band</span>
                <p className="sketch-envelope-band">{env.latencyBand}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{env.latencyNote}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Rough, relative envelope — not a quote or an SLA. Load-test with your real prompts and
              volume before committing.
            </p>
          </div>
        )
      })()}

      {!compareMode && (() => {
        const staffing = getStaffingSummary(state)
        if (!staffing) return null
        return (
          <div className="card sketch-staffing">
            <h3>Team &amp; skills</h3>
            <p className="sketch-staffing-overall">
              Highest skill floor in this stack:{' '}
              <span className={`skill-badge skill-${staffing.overall}`}>{staffing.overall}</span>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{staffing.note}</p>
            <ul className="sketch-staffing-list">
              {staffing.picks.map((p) => (
                <li key={`${p.layer}-${p.tool}`}>
                  <span className={`skill-badge skill-${p.floor}`}>{p.floor}</span> {p.tool}{' '}
                  <span style={{ color: 'var(--text-muted)' }}>· {p.layer}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Based on the specific tools you picked (type-only slots are not counted).
            </p>
          </div>
        )
      })()}

      {!compareMode && state.layers.length > 0 && (
        <details className="card sketch-governance">
          <summary>Governance &amp; compliance lens</summary>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            A checklist to structure the conversation for your active layers — not legal advice. Pair
            it with the vendor due-diligence checklist on the Landscape page.
          </p>
          <div className="governance-layers">
            {governanceByLayer
              .filter((g) => state.layers.includes(g.layer))
              .map((g) => (
                <div key={g.layer} className="governance-layer">
                  <h4>{layers.find((l) => l.id === g.layer)?.name ?? g.layer}</h4>
                  <ul>
                    {g.concerns.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="governance-tiers">
            <h4>Risk-tier framing</h4>
            <ul>
              {riskTiers.map((rt) => (
                <li key={rt.tier}>
                  <strong>{rt.tier}:</strong> {rt.note}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      <div className="card sketch-export">
        <h3>Export</h3>
        <div className="sketch-export-actions">
          {!compareMode && (
            <button type="button" className="segment-btn" onClick={handleCopyMarkdown}>
              {copiedMd ? 'Copied ✓' : 'Copy markdown plan'}
            </button>
          )}
          {!compareMode && (
            <button
              type="button"
              className="segment-btn"
              onClick={handleCopyAdr}
              title="Architecture Decision Record — for an engineering design doc or PR"
            >
              {copiedAdr ? 'Copied ✓' : 'Copy decision record'}
            </button>
          )}
          {!compareMode && (
            <button
              type="button"
              className="segment-btn"
              onClick={handleCopyExec}
              title="Plain-language summary for non-technical stakeholders"
            >
              {copiedExec ? 'Copied ✓' : 'Copy exec summary'}
            </button>
          )}
          {!compareMode && (
            <button
              type="button"
              className="segment-btn"
              onClick={handleCopyRisk}
              title="Starter risk register (risk / severity / mitigation / owner) as a markdown table"
            >
              {copiedRisk ? 'Copied ✓' : 'Copy risk register'}
            </button>
          )}
          <button type="button" className="segment-btn" onClick={handleCopyLink}>
            {copiedLink ? 'Copied ✓' : compareMode ? 'Copy compare link' : 'Copy share link'}
          </button>
          {!compareMode && (
            <button type="button" className="segment-btn" onClick={handleDownloadJson}>
              Download JSON
            </button>
          )}
          {!compareMode && (
            <button type="button" className="segment-btn" onClick={enterCompareMode}>
              Fork &amp; compare →
            </button>
          )}
          {!compareMode && (
            <button
              type="button"
              className="segment-btn"
              onClick={() =>
                onNavigate({ tab: 'builder', anchor: `from-sketch/${encodeSketchState(state)}` })
              }
            >
              Refine in builder →
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          {compareMode
            ? 'Compare link encodes both sketches in the URL (no server storage).'
            : 'Share link encodes this sketch in the URL (no server storage).'}
        </p>
        {!compareMode && (() => {
          const ids = getRelevantComparisons(state.layers)
          const matches = ids.map((id) => comparisons.find((c) => c.id === id)).filter(Boolean)
          if (matches.length === 0) return null
          return (
            <div className="sketch-compare-suggestions">
              <p className="sketch-compare-suggestions-label">Related comparisons for your stack:</p>
              <div className="sketch-compare-suggestions-list">
                {matches.map((c) => (
                  <button
                    key={c!.id}
                    type="button"
                    className="nav-chip nav-chip-inline"
                    onClick={() => onNavigate({ tab: 'compare', anchor: c!.id })}
                  >
                    {c!.title} →
                  </button>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </>
  )
}
