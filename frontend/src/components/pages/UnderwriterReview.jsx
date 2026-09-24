export default function UnderwriterReview() {
  return (
<section id="page-underwriter-review" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Policy Review &amp; Decision Workspace</h2>
      <p className="page-subtitle">Interactive case review ledger, risk factor verification, coverage schedule audit, and binding decision authorization.</p>
    </div>
    <div className="portal-tag" style={{background: '#FAF6F2', borderColor: '#EADBCE', color: '#3B241D'}}>
      <span className="portal-dot" style={{background: '#8C5343'}} />
      Decision Authority Active
    </div>
  </div>
  <div className="uw-policy-picker-bar">
    <div style={{display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 280}}>
      <label htmlFor="uw-review-policy-select" style={{fontSize: '0.875rem', fontWeight: 700, color: 'var(--blue-900)', whiteSpace: 'nowrap'}}>Active Case:</label>
      <select id="uw-review-policy-select" className="input-select" style={{fontWeight: 600, fontSize: '0.875rem'}} onChange={(event) => window.__iaCall(event, "selectPolicyForReview(this.value)")}>
      </select>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      <span id="uw-review-queue-count-pill" className="badge badge-info">14 Cases in Queue</span>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "fetchUnderwriterQueue().then(() => initUnderwriterReviewPage())")} data-tooltip="Reload live queue and policies from backend">↻ Refresh</button>
    </div>
  </div>
  <div className="uw-policy-summary-banner" id="uw-review-summary-banner">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <h3 className="card-title" id="uw-rev-title" style={{fontSize: '1.35rem', margin: 0}}>POL-2024-1001 · Commercial Property</h3>
          <span className="badge badge-pending" id="uw-rev-status-badge">Pending Review</span>
        </div>
        <div className="card-subtitle" id="uw-rev-customer-sub" style={{marginTop: 4}}>Applicant: Michael Brown · Submissions Queue ID: UW-1004</div>
      </div>
      <div style={{textAlign: 'right'}}>
        <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600}}>Binding Authority</div>
        <div style={{fontSize: '0.95rem', fontWeight: 700, color: 'var(--blue-900)'}}>Alex Vance, Senior CPCU ($5.0M Limit)</div>
      </div>
    </div>
    <div className="uw-policy-summary-grid">
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Policy Number</span>
        <span className="uw-summary-value" id="uw-rev-policy-num" style={{fontFamily: 'monospace'}}>POL-2024-1001</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Insured Customer</span>
        <span className="uw-summary-value" id="uw-rev-insured-name">Michael Brown</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Calculated Premium</span>
        <span className="uw-summary-value" id="uw-rev-premium-val" style={{color: 'var(--blue-700)', fontSize: '1.1rem'}}>$4,200.00/yr</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Coverage Limit</span>
        <span className="uw-summary-value" id="uw-rev-limit-val">$2,000,000 Total Limit</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Risk Exposure Tier</span>
        <span className="uw-summary-value" id="uw-rev-risk-badge"><span className="badge badge-risk-medium">Score: 38/100 · Medium</span></span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Effective Date</span>
        <span className="uw-summary-value" id="uw-rev-effective-date">2026-04-01</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Renewal / Expiry</span>
        <span className="uw-summary-value" id="uw-rev-expiry-date">2027-04-01</span>
      </div>
      <div className="uw-summary-metric">
        <span className="uw-summary-label">Days to Expiry</span>
        <span className="uw-summary-value" id="uw-rev-days-val" style={{fontWeight: 700}}>14 days remaining</span>
      </div>
    </div>
  </div>
  <div className="uw-review-tabs">
    <button className="uw-review-tab-btn active" data-tab="details" onClick={(event) => window.__iaCall(event, "switchReviewTab('details', this)")}>1. Policy &amp; Insured</button>
    <button className="uw-review-tab-btn" data-tab="coverage" onClick={(event) => window.__iaCall(event, "switchReviewTab('coverage', this)")}>2. Coverage &amp; Limits</button>
    <button className="uw-review-tab-btn" data-tab="factors" onClick={(event) => window.__iaCall(event, "switchReviewTab('factors', this)")}>3. Risk Factors</button>
    <button className="uw-review-tab-btn" data-tab="docs" onClick={(event) => window.__iaCall(event, "switchReviewTab('docs', this)")}>4. Documents Checklist</button>
  </div>
  <div className="uw-tab-panel active" id="uw-panel-details">
    <div className="grid grid-2">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Policy Information</h3>
            <div className="card-subtitle">Line of business terms and contractual parameters</div>
          </div>
        </div>
        <div className="detail-section" style={{border: 'none', padding: 0}}>
          <div className="detail-row"><span className="detail-label">Policy Number</span><span className="detail-value" id="uw-tab-pol-id" style={{fontFamily: 'monospace', fontWeight: 700}}>POL-2024-1001</span></div>
          <div className="detail-row"><span className="detail-label">Policy Type</span><span className="detail-value" id="uw-tab-product-type">Commercial Property</span></div>
          <div className="detail-row"><span className="detail-label">Policy Status</span><span className="detail-value" id="uw-tab-policy-status"><span className="badge badge-pending">Pending Review</span></span></div>
          <div className="detail-row"><span className="detail-label">Effective Date</span><span className="detail-value" id="uw-tab-eff-date">2026-04-01</span></div>
          <div className="detail-row"><span className="detail-label">Renewal / Expiry Date</span><span className="detail-value" id="uw-tab-exp-date">2027-04-01</span></div>
          <div className="detail-row"><span className="detail-label">Annual Gross Premium</span><span className="detail-value" id="uw-tab-premium-val" style={{fontWeight: 700, color: 'var(--blue-700)'}}>$4,200.00</span></div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Insured Customer &amp; Property</h3>
            <div className="card-subtitle">Verified customer identity and property servicing contact</div>
          </div>
        </div>
        <div className="detail-section" style={{border: 'none', padding: 0}}>
          <div className="detail-row"><span className="detail-label">Insured Customer</span><span className="detail-value" id="uw-tab-cust-name" style={{fontWeight: 700}}>Michael Brown</span></div>
          <div className="detail-row"><span className="detail-label">Applicant Details</span><span className="detail-value" id="uw-tab-cust-email">michael.brown@example.com</span></div>
          <div className="detail-row"><span className="detail-label">Customer ID</span><span className="detail-value" id="uw-tab-cust-id" style={{fontFamily: 'monospace'}}>CUST-0024</span></div>
          <div className="detail-row"><span className="detail-label">Insured Address / Property</span><span className="detail-value" id="uw-tab-property-address" style={{textAlign: 'right', maxWidth: 260, fontSize: '0.825rem'}}>104 Corporate Plaza, Suite 400, Chicago, IL</span></div>
          <div className="detail-row"><span className="detail-label">Servicing Broker / Agent</span><span className="detail-value" id="uw-tab-servicing-agent">Alex Rivera (Agent Unit 4)</span></div>
          <div className="detail-row"><span className="detail-label">Risk Classification</span><span className="detail-value" id="uw-tab-risk-class"><span className="badge badge-risk-medium">Medium Risk Tier</span></span></div>
        </div>
      </div>
    </div>
  </div>
  <div className="uw-tab-panel" id="uw-panel-coverage">
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Coverage Schedule &amp; Limits</h3>
          <div className="card-subtitle">Active insured perils, coverage limits, deductibles, and endorsement riders</div>
        </div>
      </div>
      <div className="uw-coverage-cards-grid" id="uw-tab-coverages-container">
      </div>
    </div>
  </div>
  <div className="uw-tab-panel" id="uw-panel-factors">
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Underwriting Risk Factors &amp; Findings</h3>
          <div className="card-subtitle">Key evaluated hazard factors, impact ratings, findings, and verification statuses</div>
        </div>
      </div>
      <div className="uw-risk-factors-list" id="uw-tab-risk-factors-container">
      </div>
    </div>
  </div>
  <div className="uw-tab-panel" id="uw-panel-docs">
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Policy Documents &amp; Audit Checklist</h3>
          <div className="card-subtitle">Submitted customer documents, required types, and underwriting audit status</div>
        </div>
      </div>
      <div className="uw-docs-table-container">
        <table className="uw-docs-table">
          <thead>
            <tr>
              <th style={{minWidth: 200}}>Document Name</th>
              <th style={{minWidth: 140}}>Required Type</th>
              <th style={{minWidth: 120}}>Submission Status</th>
              <th style={{minWidth: 180}}>Review Action</th>
              <th style={{minWidth: 130, textAlign: 'right'}}>Inspector Status</th>
            </tr>
          </thead>
          <tbody id="uw-tab-docs-tbody">
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div className="card uw-decision-section-card" style={{padding: '1.15rem', background: '#FAF6F2', borderRadius: 12, border: '1px solid #EADBCE', marginTop: '1.25rem'}}>
    <div style={{marginBottom: '0.75rem'}}>
      <h3 className="card-title" style={{fontSize: '1.05rem', margin: 0, color: '#3B241D'}}>Underwriting Decision</h3>
      <p style={{fontSize: '0.8rem', color: '#7A4A3A', margin: '3px 0 0'}}>Select an underwriting action or launch the full workspace:</p>
    </div>
    <div className="uw-decision-btn-row">
      <button className="btn btn-uw-approve btn-sm" id="btn-page-uw-approve" onClick={(event) => window.__iaCall(event, "promptUnderwritingDecision('Approved')")} style={{fontWeight: 700, padding: '0.55rem 0.85rem', fontSize: '0.85rem', height: 38, borderRadius: 8}}>
        <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        Approve
      </button>
      <button className="btn btn-uw-info btn-sm" id="btn-page-uw-info" onClick={(event) => window.__iaCall(event, "promptUnderwritingDecision('Info Required')")} style={{fontWeight: 700, padding: '0.55rem 0.85rem', fontSize: '0.85rem', height: 38, borderRadius: 8}}>
        <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><line x1={12} y1={16} x2={12} y2={12} /><line x1={12} y1={8} x2="12.01" y2={8} /></svg>
        More Info
      </button>
      <button className="btn btn-uw-reject btn-sm" id="btn-page-uw-reject" onClick={(event) => window.__iaCall(event, "promptUnderwritingDecision('Rejected')")} style={{fontWeight: 700, padding: '0.55rem 0.85rem', fontSize: '0.85rem', height: 38, borderRadius: 8}}>
        <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
        Reject
      </button>
    </div>
  </div>
</section>
  );
}
