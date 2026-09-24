export default function UnderwriterQueue() {
  return (
<section id="page-underwriter-queue" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title" id="uw-queue-page-title">Underwriting Queue</h2>
      <p className="page-subtitle">Complete log of all pending and processed policy applications.</p>
    </div>
    <div className="portal-tag" style={{background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9'}}>Full Application Ledger</div>
  </div>
  <div className="card">
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10, marginBottom: '1rem'}}>
      <input type="text" className="table-search-input" id="uw-full-queue-search" placeholder="Search application ID, applicant, or product..." />
      <select id="uw-full-status-filter" className="input-select" style={{padding: '0.65rem 0.85rem', fontSize: '0.85rem'}}>
        <option value="all">All Statuses</option>
        <option value="Pending Review">Pending Review</option>
        <option value="Pending Approval">Pending Approval</option>
        <option value="Approved">Approved</option>
        <option value="Info Required">Info Required</option>
        <option value="Rejected">Rejected</option>
      </select>
      <select id="uw-full-risk-filter" className="input-select" style={{padding: '0.65rem 0.85rem', fontSize: '0.85rem'}}>
        <option value="all">Risk Level: All</option>
        <option value="Low">Low Risk</option>
        <option value="Medium">Medium Risk</option>
        <option value="High">High Risk</option>
      </select>
      <select id="uw-full-product-filter" className="input-select" style={{padding: '0.65rem 0.85rem', fontSize: '0.85rem'}}>
        <option value="all">Product: All</option>
        <option value="Commercial Property">Commercial Property</option>
        <option value="General Liability">General Liability</option>
        <option value="Homeowners">Homeowners</option>
        <option value="Auto">Auto</option>
        <option value="Renters">Renters</option>
      </select>
      <button className="btn btn-outline btn-sm" id="uw-full-reset-filters-btn" data-tooltip="Reset all filters">Reset</button>
    </div>
    <div style={{marginBottom: '0.75rem', padding: '0 2px'}}>
      <span style={{fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 600}} id="uw-queue-count-text">Showing 10 of 53 Submissions</span>
    </div>
    <div className="data-table-container compact-table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Risk Level</th>
            <th>Premium</th>
            <th>Submitted</th>
            <th style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="underwriter-full-queue-tbody">
        </tbody>
      </table>
    </div>
    <div className="table-pagination-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0.25rem 0.5rem', borderTop: '1px solid var(--gray-200)', marginTop: '0.75rem'}}>
      <span style={{fontSize: '0.825rem', color: 'var(--gray-600)'}} id="uw-queue-page-text">Page 1 of 6</span>
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "handleUnderwriterQueuePagination(-1)")} data-tooltip="Previous page">‹</button>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "handleUnderwriterQueuePagination(1)")} data-tooltip="Next page">›</button>
      </div>
    </div>
    <button className="btn-show-more-toggle" onClick={(event) => window.__iaCall(event, "toggleCardShowMore(this)")} aria-expanded="false">
      <span>Show more</span>
      <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
  </div>
</section>
  );
}
