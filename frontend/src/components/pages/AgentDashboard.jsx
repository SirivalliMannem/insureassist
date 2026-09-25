export default function AgentDashboard() {
  return (
<section className="page" id="page-agent-dashboard">
<div className="page-header editorial-page-header">
<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', width: '100%'}}>
<div>
<div className="header-eyebrow">EMPOWERING AGENTS</div>
<h2 className="page-title editorial-title" id="agent-welcome-title">
                  Hello <span id="agent-dash-name">Aarav</span>,<br/>
<span className="editorial-title-italic">Create better outcomes.</span>
</h2>
<p className="page-subtitle editorial-subtitle">Manage your customers, track applications, and deliver the right protection.</p>
</div>
<div className="portal-identity-badge">
<span className="portal-identity-dot"></span>
<span>Agent Workspace · Serve customers. Create impact.</span>
</div>
</div>
</div>
{/* 4 Agent Summary Cards */}
<div className="grid grid-4" style={{marginBottom: '1.5rem'}}>
{/* Card 1: Assigned Customers */}
<div className="card stat-card" data-tooltip="Customers currently assigned to this agent." id="agent-card-customers">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-cust-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
<lineargradient id="grad-cust-p1" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FCDDCB"></stop>
<stop offset="100%" stop-color="#F5B296"></stop>
</lineargradient>
<lineargradient id="grad-cust-p2" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"></stop>
<stop offset="100%" stop-color="#FDE8DD" stop-opacity="0.85"></stop>
</lineargradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-cust-bg)" r="42"></circle>
{/* Secondary Avatar (Left) */}
<circle cx="48" cy="38" fill="#FCE4D6" r="14" stroke="#F5BAA0" strokeWidth="1.5"></circle>
<path d="M28 74C28 62 37 54 48 54C59 54 68 62 68 74" fill="#FCDDCB" stroke="#F5BAA0" strokeWidth="1.5"></path>
{/* Primary Avatar (Right) */}
<circle cx="76" cy="40" fill="url(#grad-cust-p1)" r="17" stroke="#E88C68" strokeWidth="1.8"></circle>
<path d="M52 82C52 68 63 60 76 60C89 60 100 68 100 82" fill="url(#grad-cust-p2)" stroke="#E88C68" strokeWidth="1.8"></path>
<circle cx="89" cy="28" fill="#E88C68" r="6"></circle>
<path d="M86.5 28L88 29.5L91.5 26" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
</svg>
<div className="stat-card-top">
<div className="stat-icon teal">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
</div>
<span className="stat-card-click-hint">View Panel →</span>
</div>
<div className="stat-value" id="agent-stat-customers">0</div>
<div className="stat-label">Assigned Customers</div>
<div className="stat-subtext">Active accounts under your care</div>
</div>
{/* Card 2: Active Policies */}
<div className="card stat-card" data-tooltip="Policies belonging to your assigned customers." id="agent-card-policies">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-pol-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-pol-bg)" r="42"></circle>
{/* Back Folder */}
<g transform="rotate(-6 55 50)">
<rect fill="#FCE4D6" height="62" rx="7" stroke="#F5BAA0" strokeWidth="1.5" width="48" x="28" y="24"></rect>
</g>
{/* Front Folder */}
<g transform="rotate(3 70 52)">
<rect fill="#FFFFFF" fillOpacity="0.9" height="68" rx="8" stroke="#E88C68" strokeWidth="1.8" width="54" x="42" y="18"></rect>
<rect fill="#FAD2C0" height="14" rx="6" width="54" x="42" y="18"></rect>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2" x1="52" x2="84" y1="42" y2="42"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="52" x2="78" y1="50" y2="50"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="52" x2="70" y1="58" y2="58"></line>
<circle cx="78" cy="68" fill="#F5B296" r="11" stroke="#E88C68" strokeWidth="1.5"></circle>
<path d="M74 68L77 71L83 65" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</g>
</svg>
<div className="stat-card-top">
<div className="stat-icon blue">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
</div>
<span className="stat-card-click-hint">View Panel →</span>
</div>
<div className="stat-value" id="agent-stat-policies">0</div>
<div className="stat-label">Active Policies</div>
<div className="stat-subtext">Multi-line customer contracts</div>
</div>
{/* Card 3: Upcoming Renewals */}
<div className="card stat-card" data-tooltip="Policies approaching renewal within the next 30 days." id="agent-card-renewals">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-aren-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-aren-bg)" r="42"></circle>
{/* Circular Orbital Arc */}
<path d="M68 18A34 34 0 1 1 38 64" stroke="#F5BAA0" strokeDasharray="5 5" strokeLinecap="round" strokeWidth="3"></path>
<polygon fill="#E88C68" points="76 14 68 22 62 14"></polygon>
{/* Central Clock / Gauge */}
<circle cx="68" cy="54" fill="#FFFFFF" fillOpacity="0.92" r="24" stroke="#E88C68" strokeWidth="2"></circle>
<circle cx="68" cy="54" fill="#FCE4D6" fillOpacity="0.6" r="19"></circle>
<polyline points="68 40 68 54 78 58" stroke="#C85A32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6"></polyline>
<circle cx="68" cy="54" fill="#C85A32" r="3"></circle>
</svg>
<div className="stat-card-top">
<div className="stat-icon amber">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><rect height="18" rx="2" width="18" x="3" y="4"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
</div>
<span className="stat-card-click-hint">View Panel →</span>
</div>
<div className="stat-value" id="agent-stat-renewals">0</div>
<div className="stat-label">Upcoming Renewals</div>
<div className="stat-subtext">Approaching in next 30 days</div>
</div>
{/* Card 4: Annual Premium Portfolio */}
<div className="card stat-card" data-tooltip="Total annual premium across your assigned customer policies." id="agent-card-premium">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-aprem-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-aprem-bg)" r="42"></circle>
{/* Volume Growth Bars */}
<rect fill="#FCE4D6" height="28" rx="3.5" stroke="#F5BAA0" strokeWidth="1.2" width="13" x="30" y="56"></rect>
<rect fill="#FAD2C0" height="40" rx="3.5" stroke="#F5BAA0" strokeWidth="1.2" width="13" x="49" y="44"></rect>
<rect fill="#F5B296" height="54" rx="3.5" stroke="#E88C68" strokeWidth="1.5" width="13" x="68" y="30"></rect>
{/* Upward Trend Line */}
<path d="M28 50L49 36L68 24L92 14" stroke="#E28868" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6"></path>
<polygon fill="#E28868" points="94 14 84 14 90 20"></polygon>
{/* Briefcase Icon Overlay (Right) */}
<g transform="translate(64, 46)">
<rect fill="#FFFFFF" fillOpacity="0.92" height="24" rx="4" stroke="#E88C68" strokeWidth="1.8" width="34" x="6" y="12"></rect>
<path d="M16 12V8C16 6.5 17.5 5 19 5H27C28.5 5 30 6.5 30 8V12" stroke="#E88C68" strokeWidth="1.8"></path>
<rect fill="#E88C68" height="5" rx="1" width="6" x="20" y="19"></rect>
</g>
</svg>
<div className="stat-card-top">
<div className="stat-icon green">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="1" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
</div>
<span className="stat-card-click-hint">Breakdown →</span>
</div>
<div className="stat-value" id="agent-stat-premium">$0</div>
<div className="stat-label">Annual Premium Portfolio</div>
<div className="stat-subtext">Your assigned portfolio</div>
</div>
</div>
{/* Agent Independent Two-Column Layout (Premium Chart & Assigned Renewals) */}
<div className="agent-dashboard-layout">
{/* Left Independent Column: Premium by Policy Type */}
<div className="agent-col-left">
<div className="card agent-card-premium">
<div className="card-header">
<div>
<h3 className="card-title">Premium by Policy Type</h3>
<div className="card-subtitle" id="agent-premium-chart-subtitle">Distribution across your assigned client policies</div>
</div>
<span className="badge badge-info" data-tooltip="Total book value" id="agent-premium-chart-total">$0 Total</span>
</div>
<div className="chart-container">
<div className="chart-bars-horizontal" id="agent-premium-chart-bars">
{/* Populated dynamically via GET /agent/dashboard */}
</div>
</div>
</div>
</div>
{/* Right Independent Column: Assigned Customer Renewals */}
<div className="agent-col-right">
<div className="card agent-card-renewals">
<div className="card-header">
<div>
<h3 className="card-title" id="agent-dashboard-renewals-title">Assigned Customer Renewals</h3>
<div className="card-subtitle">Clients requiring renewal outreach</div>
</div>
</div>
<div className="compact-list-scroll" id="agent-dashboard-renewals-list">
{/* Injected via JS */}
</div>
<button aria-expanded="false" className="btn-show-more-toggle" id="agent-renewals-show-more-btn" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'toggleAgentRenewalsList()') : null}>
<span id="agent-renewals-btn-text">Show more</span>
<svg fill="none" height="13" id="agent-renewals-btn-icon" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</div>
</div>
</div>
{/* RECENTLY ASSIGNED CUSTOMERS TABLE SECTION */}
<div className="card">
<div className="card-header">
<div>
<h3 className="card-title">Recently assigned customers</h3>
</div>
</div>
<div className="table-search-bar">
<input className="table-search-input" id="agent-customer-quick-search" placeholder="Filter assigned customers by name or ID..." type="text"/>
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
{/* Populated dynamically via JS */}
</tbody>
</table>
</div>
<button aria-expanded="false" className="btn-show-more-toggle" id="agent-customers-table-show-more-btn" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'toggleAgentCustomersTable()') : null}>
<span id="agent-customers-table-btn-text">Show more</span>
<svg fill="none" height="13" id="agent-customers-table-btn-icon" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</div>
</section>
  );
}
