export default function AdminPolicies() {
  return (
<section id="page-admin-policies" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Policy Management</h2>
      <p className="page-subtitle">System-wide insurance policy ledger across all customers, brokers, and underwriters</p>
    </div>
    <div className="portal-tag" id="admin-policies-count-tag">Enterprise Policies</div>
  </div>
  <div className="card">
    <div className="queue-filter-bar" style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem'}}>
      <div className="search-input-wrapper" style={{flex: 1, minWidth: 240, marginBottom: 0}}>
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
        <input type="text" id="admin-policy-search-input" placeholder="Search by policy number, customer name, or type..." />
      </div>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <select id="admin-policy-type-filter" className="form-control" style={{width: 'auto', padding: '7px 12px', fontSize: '0.85rem', border: '1px solid var(--gray-300)', borderRadius: 6}}>
          <option value="all">All Lines</option>
          <option value="Home">Home</option>
          <option value="Auto">Auto</option>
          <option value="Commercial">Commercial</option>
          <option value="Umbrella">Umbrella</option>
          <option value="Specialty">Specialty</option>
        </select>
        <select id="admin-policy-status-filter" className="form-control" style={{width: 'auto', padding: '7px 12px', fontSize: '0.85rem', border: '1px solid var(--gray-300)', borderRadius: 6}}>
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
        </select>
        <button className="btn btn-outline btn-sm" id="admin-policy-reset-btn">Reset</button>
      </div>
    </div>
    <div className="table-responsive compact-table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Policy ID</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Status</th>
            <th>Annual Premium</th>
            <th>Assigned Agent</th>
            <th style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="admin-policies-tbody">
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
