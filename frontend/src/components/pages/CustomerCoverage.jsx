export default function CustomerCoverage() {
  return (
<section id="page-customer-coverage" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Coverage Checker</h2>
      <p className="page-subtitle">Enter any incident or scenario to see whether it is covered under your active policies.</p>
    </div>
  </div>
  <div className="card" style={{marginBottom: '1.5rem'}}>
    <div className="coverage-search">
      <input type="text" id="coverage-query-input" placeholder="e.g., Burst pipe water damage, tree falling on roof, stolen laptop..." />
      <button className="btn btn-primary" id="coverage-submit-btn">Check Coverage</button>
    </div>
    <div style={{fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.75rem'}}>Sample Scenarios to test:</div>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
      <button className="btn btn-outline btn-sm coverage-quick-chip">Water damage from burst pipe</button>
      <button className="btn btn-outline btn-sm coverage-quick-chip">Theft of personal belongings</button>
      <button className="btn btn-outline btn-sm coverage-quick-chip">Flood damage from storm</button>
      <button className="btn btn-outline btn-sm coverage-quick-chip">Car accident liability</button>
      <button className="btn btn-outline btn-sm coverage-quick-chip">Medical emergency abroad</button>
    </div>
  </div>
  <div className="coverage-result" id="coverage-result-box">
    <div className="coverage-status" id="coverage-status-banner">
      <svg width={28} height={28} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      <div>
        <h3 id="coverage-status-title">Covered</h3>
        <p id="coverage-status-desc" style={{fontSize: '0.9rem', marginTop: 2}} />
      </div>
    </div>
    <div className="grid grid-2" style={{marginBottom: '1rem'}}>
      <div className="card">
        <div className="card-title" style={{marginBottom: '0.75rem'}}>Explanation &amp; Details</div>
        <p id="coverage-reason-text" style={{color: 'var(--gray-700)', fontSize: '0.9rem', lineHeight: '1.6'}} />
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom: '0.75rem'}}>Relevant Policy Clause</div>
        <p id="coverage-clause-text" style={{fontStyle: 'italic', color: 'var(--gray-700)', fontSize: '0.875rem', lineHeight: '1.6'}} />
      </div>
    </div>
    <div className="card">
      <div className="card-title" style={{marginBottom: '0.5rem'}}>Policy Reference</div>
      <p id="coverage-ref-text" style={{fontWeight: 600, color: 'var(--blue-900)', fontSize: '0.9rem'}} />
    </div>
  </div>
</section>
  );
}
