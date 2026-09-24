export default function AgentDashboard() {
  return (
<section id="page-agent-dashboard" className="page">
  <div className="page-header editorial-page-header">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, width: '100%'}}>
      <div>
        <div className="header-eyebrow">EMPOWERING AGENTS</div>
        <h2 className="page-title editorial-title" id="agent-welcome-title">
          Hello <span id="agent-dash-name">Aarav</span>,<br />
          <span className="editorial-title-italic">Create better outcomes.</span>
        </h2>
        <p className="page-subtitle editorial-subtitle">Manage your customers, track applications, and deliver the right protection.</p>
      </div>
      <div className="portal-identity-badge">
        <span className="portal-identity-dot" />
        <span>Agent Workspace · Serve customers. Create impact.</span>
      </div>
    </div>
  </div>
  <div className="grid grid-4" style={{marginBottom: '1.5rem'}}>
    <div className="card stat-card" id="agent-card-customers" data-tooltip="Customers currently assigned to this agent.">
      <div className="stat-card-top">
        <div className="stat-icon teal">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <span className="stat-card-click-hint">View Panel →</span>
      </div>
      <div className="stat-value" id="agent-stat-customers">0</div>
      <div className="stat-label">Assigned Customers</div>
      <div className="stat-subtext">Active accounts under your care</div>
    </div>
    <div className="card stat-card" id="agent-card-policies" data-tooltip="Policies belonging to your assigned customers.">
      <div className="stat-card-top">
        <div className="stat-icon blue">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <span className="stat-card-click-hint">View Panel →</span>
      </div>
      <div className="stat-value" id="agent-stat-policies">0</div>
      <div className="stat-label">Active Policies</div>
      <div className="stat-subtext">Multi-line customer contracts</div>
    </div>
    <div className="card stat-card" id="agent-card-renewals" data-tooltip="Policies approaching renewal within the next 30 days.">
      <div className="stat-card-top">
        <div className="stat-icon amber">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={4} width={18} height={18} rx={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>
        </div>
        <span className="stat-card-click-hint">View Panel →</span>
      </div>
      <div className="stat-value" id="agent-stat-renewals">0</div>
      <div className="stat-label">Upcoming Renewals</div>
      <div className="stat-subtext">Approaching in next 30 days</div>
    </div>
    <div className="card stat-card" id="agent-card-premium" data-tooltip="Total annual premium across your assigned customer policies.">
      <div className="stat-card-top">
        <div className="stat-icon green">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={12} y1={1} x2={12} y2={23} /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
        <span className="stat-card-click-hint">Breakdown →</span>
      </div>
      <div className="stat-value" id="agent-stat-premium">$0</div>
      <div className="stat-label">Annual Premium Portfolio</div>
      <div className="stat-subtext">Your assigned portfolio</div>
    </div>
  </div>
  <div className="agent-dashboard-layout">
    <div className="agent-col-left">
      <div className="card agent-card-premium">
        <div className="card-header">
          <div>
            <h3 className="card-title">Premium by Policy Type</h3>
            <div className="card-subtitle" id="agent-premium-chart-subtitle">Distribution across your assigned client policies</div>
          </div>
          <span className="badge badge-info" id="agent-premium-chart-total" data-tooltip="Total book value">$0 Total</span>
        </div>
        <div className="chart-container">
          <div className="chart-bars-horizontal" id="agent-premium-chart-bars">
          </div>
        </div>
      </div>
    </div>
    <div className="agent-col-right">
      <div className="card agent-card-renewals">
        <div className="card-header">
          <div>
            <h3 className="card-title" id="agent-dashboard-renewals-title">Assigned Customer Renewals</h3>
            <div className="card-subtitle">Clients requiring renewal outreach</div>
          </div>
        </div>
        <div className="compact-list-scroll" id="agent-dashboard-renewals-list">
        </div>
        <button className="btn-show-more-toggle" id="agent-renewals-show-more-btn" onClick={(event) => window.__iaCall(event, "toggleAgentRenewalsList()")} aria-expanded="false">
          <span id="agent-renewals-btn-text">Show more</span>
          <svg id="agent-renewals-btn-icon" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recently assigned customers</h3>
      </div>
    </div>
    <div className="table-search-bar">
      <input type="text" className="table-search-input" id="agent-customer-quick-search" placeholder="Filter assigned customers by name or ID..." />
      <div id="agent-quick-search-count" style={{fontSize: '0.8rem', color: 'var(--gray-500)'}}>0 assigned client accounts</div>
    </div>
    <div className="data-table-container compact-table-scroll" id="agent-dashboard-customers-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer ID</th>
            <th>Total Policies</th>
            <th>Active Policies</th>
            <th>Next Renewal</th>
            <th style={{textAlign: 'right'}}>Action</th>
          </tr>
        </thead>
        <tbody id="agent-dashboard-customers-tbody">
        </tbody>
      </table>
    </div>
    <button className="btn-show-more-toggle" id="agent-customers-table-show-more-btn" onClick={(event) => window.__iaCall(event, "toggleAgentCustomersTable()")} aria-expanded="false">
      <span id="agent-customers-table-btn-text">Show more</span>
      <svg id="agent-customers-table-btn-icon" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
  </div>
</section>
  );
}
