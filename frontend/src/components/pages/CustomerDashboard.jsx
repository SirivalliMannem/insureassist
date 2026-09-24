export default function CustomerDashboard() {
  return (
<section id="page-customer-dashboard" className="page active">
  <div className="page-header editorial-page-header">
    <div className="editorial-header-content">
      <div className="header-eyebrow">YOUR INSURANCE. SIMPLIFIED.</div>
      <h2 className="page-title editorial-title" id="cust-dash-welcome">
        Welcome back, <span id="cust-dash-name">Sarah</span>!<br />
        <span className="editorial-title-italic">Your protection matters.</span>
      </h2>
      <p className="page-subtitle editorial-subtitle">Manage your policies, track claims, and get instant guidance with InsureAssist.</p>
    </div>
  </div>
  <div className="grid grid-3" style={{marginBottom: '1.5rem'}}>
    <div className="card stat-card" id="card-active-policies" data-tooltip="Total active policies in your customer portfolio.">
      <div className="stat-card-top">
        <div className="stat-icon blue">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <span className="stat-card-click-hint">View Panel →</span>
      </div>
      <div className="stat-value" id="cust-dash-active-policies">0</div>
      <div className="stat-label">Active Policies</div>
      <div className="stat-subtext" id="cust-dash-policies-subtext">Policies in good standing</div>
    </div>
    <div className="card stat-card" id="card-upcoming-renewals" data-tooltip="Policies due for renewal within the next 90 days.">
      <div className="stat-card-top">
        <div className="stat-icon amber">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={4} width={18} height={18} rx={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>
        </div>
        <span className="stat-card-click-hint">View Panel →</span>
      </div>
      <div className="stat-value" id="cust-dash-upcoming-renewals">—</div>
      <div className="stat-label">Upcoming Renewals</div>
      <div className="stat-subtext" id="cust-dash-renewals-subtext">Portfolio renewals</div>
    </div>
    <div className="card stat-card" id="card-annual-premium" data-tooltip="Total yearly cost across all active policies.">
      <div className="stat-card-top">
        <div className="stat-icon green">
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={12} y1={1} x2={12} y2={23} /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
        <span className="stat-card-click-hint">Breakdown →</span>
      </div>
      <div className="stat-value" id="cust-dash-annual-premium">$0</div>
      <div className="stat-label">Annual Premium</div>
      <div className="stat-subtext" id="cust-dash-premium-subtext">In-force portfolio</div>
    </div>
  </div>
  <div className="customer-dashboard-layout">
    <div className="customer-col-left">
      <div className="card customer-card-premium">
        <div className="card-header">
          <div>
            <h3 className="card-title">Premium by Policy Type</h3>
            <div className="card-subtitle">Distribution across active coverage categories</div>
          </div>
          <span className="badge badge-info" id="cust-dash-premium-badge" data-tooltip="Combined premium across active policies">Total $0/yr</span>
        </div>
        <div className="chart-container">
          <div className="chart-bars-horizontal" id="customer-dashboard-chart-container">
          </div>
        </div>
      </div>
    </div>
    <div className="customer-col-right">
      <div className="card customer-card-renewals">
        <div className="card-header">
          <div>
            <h3 className="card-title" id="cust-dash-renewals-title">Approaching Renewals (0)</h3>
            <div className="card-subtitle">Policies approaching automatic review</div>
          </div>
        </div>
        <div className="compact-list-scroll" id="customer-dashboard-renewals-container">
        </div>
        <button className="btn-show-more-toggle" id="cust-renewals-show-more-btn" onClick={(event) => window.__iaCall(event, "toggleCustomerRenewalsList()")} aria-expanded="false" style={{display: 'none'}}>
          <span id="cust-renewals-btn-text">Show more</span>
          <svg id="cust-renewals-btn-icon" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Personalized Policy Recommendations</h3>
        <div className="card-subtitle">Suggestions based on your current insurance coverage</div>
      </div>
    </div>
    <div className="recommendations-grid" id="customer-recommendations-container">
    </div>
  </div>
</section>
  );
}
