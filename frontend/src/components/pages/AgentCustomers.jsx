export default function AgentCustomers() {
  return (
<section id="page-agent-customers" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title" id="agent-customers-page-title">My Assigned Customers (0)</h2>
      <p className="page-subtitle">Full directory of client accounts under your active agent management.</p>
    </div>
    <div className="portal-tag" id="agent-customers-portal-tag">0 Assigned Clients</div>
  </div>
  <div className="card">
    <div className="table-search-bar" style={{display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
      <input type="text" className="table-search-input" id="agent-full-customer-search" placeholder="Search by customer name, email, or customer ID..." style={{flex: 1, minWidth: 260}} onInput={(event) => window.__iaCall(event, "renderAgentFullCustomersDirectory(this.value)")} />
      <select className="input-select" id="agent-full-customer-status-filter" style={{width: 'auto', minWidth: 170, padding: '0.65rem 0.85rem', fontSize: '0.85rem', border: '1px solid var(--gray-200)', borderRadius: 8}} onChange={(event) => window.__iaCall(event, "handleAgentFullCustomerFilter()")}>
        <option value="all">All Statuses</option>
        <option value="active">Active Clients</option>
        <option value="renewal">Upcoming Renewal</option>
      </select>
    </div>
    <div className="data-table-container compact-table-scroll" id="agent-full-customers-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer ID</th>
            <th>Contact Email</th>
            <th>Phone</th>
            <th>Policies</th>
            <th>Next Renewal</th>
            <th style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="agent-full-customers-tbody">
        </tbody>
      </table>
    </div>
    <div className="table-pagination-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0.25rem 0.5rem', borderTop: '1px solid var(--gray-200)', marginTop: '0.75rem'}}>
      <div id="agent-customers-pagination-info" style={{fontSize: '0.825rem', color: 'var(--gray-600)'}}>
        Showing <strong id="agent-customers-page-range">0-0</strong> of <strong id="agent-customers-page-total">0</strong> customers
      </div>
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <span style={{fontSize: '0.825rem', color: 'var(--gray-600)'}} id="agent-customers-page-text">Page 1 of 1</span>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "handleAgentCustomerPagination(-1)")} data-tooltip="Previous page">‹</button>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "handleAgentCustomerPagination(1)")} data-tooltip="Next page">›</button>
      </div>
    </div>
    <button className="btn-show-more-toggle" id="agent-full-customers-show-more-btn" onClick={(event) => window.__iaCall(event, "toggleAgentFullCustomersTable()")} aria-expanded="false">
      <span id="agent-full-customers-btn-text">Show more</span>
      <svg id="agent-full-customers-btn-icon" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
  </div>
</section>
  );
}
