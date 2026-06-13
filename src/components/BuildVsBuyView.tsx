import { buildBuyScenarios } from '../data/buildVsBuy'

export function BuildVsBuyView() {
  return (
    <div className="build-buy">
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Relative trade-offs, not prices — both columns are valid depending on your constraints
        (budget, control, on-prem, time).
      </p>
      {buildBuyScenarios.map((s) => (
        <div key={s.id} className="build-buy-scenario card">
          <h4>{s.scenario}</h4>
          <div className="build-buy-cols">
            <div className="build-buy-col">
              <h5>Build it</h5>
              <dl>
                <dt>Effort</dt>
                <dd>{s.build.effort}</dd>
                <dt>Time to value</dt>
                <dd>{s.build.timeToValue}</dd>
                <dt>Control</dt>
                <dd>{s.build.control}</dd>
                <dt>Risks</dt>
                <dd>{s.build.risks}</dd>
              </dl>
            </div>
            <div className="build-buy-col">
              <h5>
                Buy it <span className="build-buy-example">— {s.buy.example}</span>
              </h5>
              <dl>
                <dt>Effort</dt>
                <dd>{s.buy.effort}</dd>
                <dt>Time to value</dt>
                <dd>{s.buy.timeToValue}</dd>
                <dt>Control</dt>
                <dd>{s.buy.control}</dd>
                <dt>Risks</dt>
                <dd>{s.buy.risks}</dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
