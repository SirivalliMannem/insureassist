export default function AgentApplications() {
  return (
<section id="page-agent-applications" className="page">
  <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem'}}>
    <div>
      <h2 className="page-title" id="agent-apps-page-title">Customer Policy Applications</h2>
      <p className="page-subtitle">Review incoming applications, audit uploaded documentation, request additional information, and forward verified files to Underwriting.</p>
    </div>
    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "fetchAgentApplications(true)")} data-tooltip="Reload live applications from database">
        ↻ Refresh Queue
      </button>
    </div>
  </div>
  <div className="agent-summary-cards-grid" id="agent-apps-metrics">
    <div className="agent-summary-card">
      <div className="agent-summary-card-title">Total Applications</div>
      <div className="agent-summary-card-value agent-val-total" id="agent-metric-apps-total">0</div>
      <div className="agent-summary-card-sub">Across assigned client accounts</div>
    </div>
    <div className="agent-summary-card">
      <div className="agent-summary-card-title">Pending Verification</div>
      <div className="agent-summary-card-value agent-val-pending" id="agent-metric-apps-pending">0</div>
      <div className="agent-summary-card-sub">Awaiting Agent document review</div>
    </div>
    <div className="agent-summary-card">
      <div className="agent-summary-card-title">More Info Required</div>
      <div className="agent-summary-card-value agent-val-info" id="agent-metric-apps-info">0</div>
      <div className="agent-summary-card-sub">Pending customer uploads</div>
    </div>
    <div className="agent-summary-card">
      <div className="agent-summary-card-title">Forwarded to UW</div>
      <div className="agent-summary-card-value agent-val-forwarded" id="agent-metric-apps-forwarded">0</div>
      <div className="agent-summary-card-sub">In Underwriting decision queue</div>
    </div>
  </div>
  <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
    <div style={{display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.25rem'}}>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}} id="agent-app-filter-pills">
        <button type="button" className="btn btn-sm agent-app-filter-pill active" onClick={(event) => window.__iaCall(event, "filterAgentApplications('all', this)")} style={{borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, background: 'var(--cust-brown-700)', color: '#fff', border: 'none', cursor: 'pointer'}}>All Submissions</button>
        <button type="button" className="btn btn-outline btn-sm agent-app-filter-pill" onClick={(event) => window.__iaCall(event, "filterAgentApplications('review', this)")} style={{borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'}}>Pending Verification</button>
        <button type="button" className="btn btn-outline btn-sm agent-app-filter-pill" onClick={(event) => window.__iaCall(event, "filterAgentApplications('info', this)")} style={{borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'}}>More Info Required</button>
        <button type="button" className="btn btn-outline btn-sm agent-app-filter-pill" onClick={(event) => window.__iaCall(event, "filterAgentApplications('forwarded', this)")} style={{borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'}}>Forwarded to UW</button>
      </div>
      <div style={{position: 'relative', flex: 1, maxWidth: 320, minWidth: 240}}>
        <input type="text" id="agent-app-search-input" className="form-control" placeholder="Search by App ID, Customer, or Line..." onInput={(event) => window.__iaCall(event, "handleAgentAppSearch(this.value)")} style={{padding: '8px 12px', fontSize: '0.825rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)', background: 'var(--white)', width: '100%', boxSizing: 'border-box', color: 'var(--cust-brown-900)'}} />
      </div>
    </div>
    <div className="data-table-container compact-table-scroll table-wrapper">
      <table className="data-table agent-app-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Customer Name</th>
            <th>Product &amp; Policy</th>
            <th>Coverage Tier</th>
            <th>Est. Premium</th>
            <th>Attachments</th>
            <th>Verification</th>
            <th className="th-status">Status</th>
            <th className="th-action" style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="agent-applications-tbody">
        </tbody>
      </table>
    </div>
    <div className="agent-apps-pagination-bar" id="agent-apps-pagination-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0.25rem 0.25rem', borderTop: '1px solid var(--cust-cream-border)', marginTop: '1rem', flexWrap: 'wrap', gap: 10}}>
      <div id="agent-apps-pagination-info" style={{fontSize: '0.825rem', color: 'var(--gray-600)', fontWeight: 500}}>
        Showing 1–10 of 12 applications
      </div>
      <div className="pagination-controls" id="agent-apps-pagination-controls" style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      </div>
    </div>
  </div>
</section>
  );
}
