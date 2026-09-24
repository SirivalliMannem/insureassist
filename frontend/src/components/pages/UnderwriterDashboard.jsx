export default function UnderwriterDashboard() {
  return (
<section id="page-underwriter-dashboard" className="page">
  <div className="page-header editorial-page-header">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, width: '100%'}}>
      <div>
        <div className="header-eyebrow">INFORMED DECISIONS</div>
        <h2 className="page-title editorial-title" id="uw-dashboard-greeting">
          Hello <span id="uw-dash-name">Alex</span>,<br />
          <span className="editorial-title-italic">Assess today. Protect tomorrow.</span>
        </h2>
        <p className="page-subtitle editorial-subtitle">Review applications, assess risk, and help build a safer tomorrow.</p>
      </div>
      <div className="portal-identity-badge">
        <span className="portal-identity-dot" style={{background: '#8C5343'}} />
        <span>Underwriter Portal · Assess risk. Enable confidence.</span>
      </div>
    </div>
  </div>
  <div className="grid grid-4" style={{marginBottom: '1.5rem'}}>
    <div className="card stat-card" id="card-uw-pending" onClick={(event) => window.__iaCall(event, "navigateTo('underwriter-queue')")} data-tooltip="View pending submissions in the Underwriting Queue">
      <div className="stat-card-top">
        <div className="stat-icon amber">
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg>
        </div>
        <span className="stat-card-click-hint">Queue →</span>
      </div>
      <div className="stat-value" id="uw-stat-pending-val">--</div>
      <div className="stat-label">Pending Reviews</div>
      <div className="stat-subtext">Awaiting risk assessment</div>
    </div>
    <div className="card stat-card" id="card-uw-high-risk" onClick={(event) => window.__iaCall(event, "navigateTo('underwriter-queue')")} data-tooltip="View flagged high-risk cases in the Underwriting Queue">
      <div className="stat-card-top">
        <div className="stat-icon red">
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2="12.01" y2={17} /></svg>
        </div>
        <span className="stat-card-click-hint">Queue →</span>
      </div>
      <div className="stat-value" id="uw-stat-high-risk-val">--</div>
      <div className="stat-label">High-Risk Cases</div>
      <div className="stat-subtext">Flagged for strict review</div>
    </div>
    <div className="card stat-card" id="card-uw-approved" onClick={(event) => window.__iaCall(event, "navigateTo('underwriter-queue')")} data-tooltip="View approved policy applications">
      <div className="stat-card-top">
        <div className="stat-icon green">
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        </div>
        <span className="stat-card-click-hint">Queue →</span>
      </div>
      <div className="stat-value" id="uw-stat-approved-val">--</div>
      <div className="stat-label">Approved &amp; Bound</div>
      <div className="stat-subtext">Active policies in portfolio</div>
    </div>
    <div className="card stat-card" id="card-uw-info" onClick={(event) => window.__iaCall(event, "navigateTo('underwriter-queue')")} data-tooltip="View applications requiring additional documents">
      <div className="stat-card-top">
        <div className="stat-icon blue">
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><line x1={12} y1={16} x2={12} y2={12} /><line x1={12} y1={8} x2="12.01" y2={8} /></svg>
        </div>
        <span className="stat-card-click-hint">Queue →</span>
      </div>
      <div className="stat-value" id="uw-stat-info-val">--</div>
      <div className="stat-label">Info Required</div>
      <div className="stat-subtext">Documents pending review</div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem', alignItems: 'stretch'}}>
    <div className="card" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Underwriting Decision Distribution</h3>
          <div className="card-subtitle">Portfolio case outcomes &amp; pipeline efficiency</div>
        </div>
        <div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600}} id="uw-decision-total-cases">-- Total Cases</div>
      </div>
      <div id="uw-decision-distribution-container" style={{display: 'flex', flexDirection: 'column', gap: '0.9rem'}}>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)'}}>
        <div style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: 8, border: '1px solid var(--gray-200)'}} data-tooltip="Weighted average hazard score of active book">
          <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600}}>Avg Risk Score</div>
          <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-900)', marginTop: 2}} id="uw-avg-risk-score-val">--</div>
        </div>
        <div style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: 8, border: '1px solid var(--gray-200)'}} data-tooltip="Active portfolio coverage ratio">
          <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600}}>Active Policy Rate</div>
          <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)', marginTop: 2}} id="uw-active-policy-rate-val">--</div>
        </div>
        <div style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: 8, border: '1px solid var(--gray-200)'}} data-tooltip="Pending queue volume requiring action">
          <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600}}>Queue Triage Volume</div>
          <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-900)', marginTop: 2}} id="uw-triage-volume-val">--</div>
        </div>
        <div style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: 8, border: '1px solid var(--gray-200)'}} data-tooltip="High-risk accounts proportion in queue">
          <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600}}>High-Risk Ratio</div>
          <div style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-600)', marginTop: 2}} id="uw-high-risk-ratio-val">--</div>
        </div>
      </div>
    </div>
    <div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
      <div>
        <div className="card-header">
          <div>
            <h3 className="card-title">Cases Requiring Attention</h3>
            <div className="card-subtitle">Urgent triage queue flagged for underwriter intervention</div>
          </div>
          <span className="badge" style={{background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5'}} id="uw-urgent-badge">High Priority</span>
        </div>
        <div id="uw-urgent-attention-list" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        </div>
      </div>
      <div style={{marginTop: '1.25rem'}}>
        <button className="btn btn-outline btn-block" onClick={(event) => window.__iaCall(event, "navigateTo('underwriter-queue')")} data-tooltip="Navigate to Underwriting Queue">
          Open Full Queue →
        </button>
      </div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem', alignItems: 'stretch'}}>
    <div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
      <div>
        <div className="card-header">
          <div>
            <h3 className="card-title">Portfolio Exposure by Line</h3>
            <div className="card-subtitle">Active insured liability spread across lines of business</div>
          </div>
        </div>
        <div className="chart-bars-horizontal" id="uw-lob-distribution-bars">
        </div>
      </div>
    </div>
    <div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
      <div>
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Decision Activity</h3>
            <div className="card-subtitle">Audit trail of newly bound and processed submissions</div>
          </div>
        </div>
        <div id="uw-recent-activity-list" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
