export default function AgentPolicies() {
  return (
<section id="page-agent-policies" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title" id="agent-policies-page-title">Assigned Customer Policies (15)</h2>
      <p className="page-subtitle" id="agent-policies-page-subtitle">15 total policies across your 6 assigned customer accounts (8 Active · 7 Inactive/Expired)</p>
    </div>
    <div className="portal-tag" id="agent-policies-portal-tag">15 Total · 8 Active</div>
  </div>
  <div className="card">
    <div className="table-search-bar" style={{display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
      <input type="text" className="table-search-input" id="agent-policy-search" placeholder="Search by policy ID, customer name, or policy type..." style={{flex: 1, minWidth: 260}} onInput={(event) => window.__iaCall(event, "handleAgentPolicyFilters()")} />
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <label htmlFor="agent-policy-category-filter" style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--blue-900)', whiteSpace: 'nowrap'}}>Category:</label>
        <select id="agent-policy-category-filter" className="input-select" style={{padding: '0.55rem 0.85rem', fontSize: '0.825rem', border: '1px solid var(--gray-300)', borderRadius: 8, background: 'var(--white)', color: 'var(--gray-800)', minWidth: 140, cursor: 'pointer'}} onChange={(event) => window.__iaCall(event, "handleAgentPolicyFilters()")}>
          <option value="all">All</option>
          <option value="Property">Property</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Commercial">Commercial</option>
          <option value="Specialty">Specialty</option>
        </select>
      </div>
    </div>
    <div className="data-table-container compact-table-scroll table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Policy Number</th>
            <th>Policy Type</th>
            <th>Category</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Renewal Date</th>
            <th className="action-column" style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="agent-policies-tbody">
        </tbody>
      </table>
    </div>
    <button className="btn-show-more-toggle" onClick={(event) => window.__iaCall(event, "toggleCardShowMore(this)")} aria-expanded="false">
      <span>Show more</span>
      <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
  </div>
</section>
  );
}
