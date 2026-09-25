export default function AdminDashboard() {
  return (
<section className="page" id="page-admin-dashboard">
<div className="page-header editorial-page-header">
<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', width: '100%'}}>
<div>
<div className="header-eyebrow">A SECURE AND SCALABLE PLATFORM</div>
<h2 className="page-title editorial-title" id="admin-welcome-title">
                  Hello <span id="admin-dash-name">Sirivalli</span>,<br/>
<span className="editorial-title-italic">Keep everything running smoothly.</span>
</h2>
<p className="page-subtitle editorial-subtitle">Manage users, monitor system activity, and ensure a seamless insurance experience.</p>
</div>
<div className="portal-identity-badge">
<span className="portal-identity-dot" style={{background: '#2A1810'}}></span>
<span>Admin Portal · Manage. Monitor. Maintain.</span>
</div>
</div>
</div>
{/* 1. Combined Dashboard Statistics Box (3 + 3 Layout) */}
<div className="card admin-stats-combined-card">
<div className="card-header" style={{marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-200)'}}>
<div>
<h3 className="card-title">Enterprise System Overview</h3>
<div className="card-subtitle">Key platform metrics, user directory distribution, and policy status</div>
</div>
<span className="badge badge-active" data-tooltip="Real-time synchronized platform statistics">Live Metrics</span>
</div>
{/* Responsive 3 + 3 Grid of 6 Statistics Sub-Sections */}
<div className="admin-stats-subgrid">
{/* Row 1, Card 1: Total Users */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Total number of registered enterprise platform accounts across all roles (248 users). Click to view details." id="card-admin-users" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminUsersSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-adm-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-adm-bg)" r="42"></circle>
{/* Multi-user nodes */}
<circle cx="44" cy="40" fill="#FCE4D6" r="12" stroke="#F5BAA0" strokeWidth="1.5"></circle>
<path d="M26 72C26 62 34 56 44 56C54 56 62 62 62 72" fill="#FCDDCB" stroke="#F5BAA0" strokeWidth="1.5"></path>
<circle cx="78" cy="36" fill="#F5B296" r="15" stroke="#E88C68" strokeWidth="1.8"></circle>
<path d="M56 78C56 65 66 58 78 58C90 58 100 65 100 78" fill="#FFFFFF" fillOpacity="0.9" stroke="#E88C68" strokeWidth="1.8"></path>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Total Users</span>
<div className="admin-stat-icon-wrapper" style={{background: '#f1f5f9', color: '#0f172a'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
</div>
</div>
<div id="admin-stat-total-users-val" style={{fontSize: '1.85rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>248</div>
<div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '500', pointerEvents: 'none'}}>System-wide accounts</div>
</div>
{/* Row 1, Card 2: Total Customers */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Total retail insurance policyholders registered on the platform (180 customers). Click to view details." id="card-admin-customers" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminCustomersSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-admc-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-admc-bg)" r="42"></circle>
<rect fill="#FFFFFF" fillOpacity="0.92" height="64" rx="8" stroke="#F5BAA0" strokeWidth="1.5" width="56" x="30" y="24"></rect>
<circle cx="58" cy="44" fill="#FAD2C0" r="13" stroke="#E88C68" strokeWidth="1.8"></circle>
<path d="M42 68C42 60 49 55 58 55C67 55 74 60 74 68" fill="#FCE4D6" stroke="#E88C68" strokeWidth="1.5"></path>
<circle cx="82" cy="68" fill="#F5B296" r="13" stroke="#E88C68" strokeWidth="1.8"></circle>
<path d="M78 68L81 71L87 65" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Total Customers</span>
<div className="admin-stat-icon-wrapper" style={{background: 'var(--blue-50)', color: 'var(--blue-600)'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
</div>
</div>
<div id="admin-stat-total-customers-val" style={{fontSize: '1.85rem', fontWeight: '700', color: 'var(--blue-900)', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>180</div>
<div style={{fontSize: '0.8rem', color: 'var(--blue-600)', fontWeight: '600', pointerEvents: 'none'}}>73% of user base</div>
</div>
{/* Row 1, Card 3: Total Agents */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Total licensed brokerage advisors and field agents (32 agents). Click to view details." id="card-admin-agents" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminAgentsSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-adma-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-adma-bg)" r="42"></circle>
<rect fill="#FAD2C0" height="46" rx="9" stroke="#E88C68" strokeWidth="2" width="62" x="30" y="38"></rect>
<path d="M48 38V28C48 24.5 51 22 55 22H67C71 22 74 24.5 74 28V38" stroke="#E88C68" strokeWidth="2.2"></path>
<line stroke="#FFFFFF" strokeWidth="2" x1="30" x2="92" y1="56" y2="56"></line>
<rect fill="#FFFFFF" height="12" rx="2.5" stroke="#E88C68" strokeWidth="1.8" width="14" x="54" y="51"></rect>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Total Agents</span>
<div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#7A4A3A', border: '1px solid #EADBCE'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><rect height="14" rx="2" ry="2" width="20" x="2" y="7"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
</div>
</div>
<div id="admin-stat-total-agents-val" style={{fontSize: '1.85rem', fontWeight: '700', color: '#3B241D', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>32</div>
<div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '500', pointerEvents: 'none'}}>Licensed advisors</div>
</div>
{/* Row 2, Card 1: Total Underwriters */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Total senior CPCU underwriters and risk decision officers (24 underwriters). Click to view details." id="card-admin-underwriters" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminUnderwritersSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-admu-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-admu-bg)" r="42"></circle>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2.8" x1="68" x2="68" y1="20" y2="84"></line>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2.2" x1="38" x2="98" y1="36" y2="36"></line>
<circle cx="68" cy="20" fill="#F5B296" r="5" stroke="#E88C68" strokeWidth="1.5"></circle>
<path d="M38 36L26 60H50L38 36Z" fill="#FAD2C0" stroke="#E88C68" strokeLinejoin="round" strokeWidth="1.8"></path>
<path d="M98 36L86 60H110L98 36Z" fill="#F5B296" stroke="#E88C68" strokeLinejoin="round" strokeWidth="1.8"></path>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2.8" x1="52" x2="84" y1="84" y2="84"></line>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Total Underwriters</span>
<div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#5C3A30', border: '1px solid #EADBCE'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
</div>
</div>
<div id="admin-stat-total-underwriters-val" style={{fontSize: '1.85rem', fontWeight: '700', color: '#3B241D', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>24</div>
<div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '500', pointerEvents: 'none'}}>Risk decision makers</div>
</div>
{/* Row 2, Card 2: Total Policies */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Total policies registered across all active product lines (426 policies). Click to view details." id="card-admin-policies" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminPoliciesSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-admp-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-admp-bg)" r="42"></circle>
{/* Layer 1 */}
<rect fill="#FCE4D6" height="54" rx="7" stroke="#F5BAA0" strokeWidth="1.5" width="46" x="26" y="38"></rect>
{/* Layer 2 */}
<rect fill="#FAD2C0" height="58" rx="7" stroke="#F5BAA0" strokeWidth="1.5" width="48" x="38" y="28"></rect>
{/* Layer 3 */}
<rect fill="#FFFFFF" fillOpacity="0.95" height="62" rx="8" stroke="#E88C68" strokeWidth="1.8" width="50" x="50" y="18"></rect>
<rect fill="#F5B296" height="13" rx="6" width="50" x="50" y="18"></rect>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2" x1="60" x2="88" y1="40" y2="40"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="60" x2="82" y1="48" y2="48"></line>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Total Policies</span>
<div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#C97963', border: '1px solid #EADBCE'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
</div>
</div>
<div id="admin-stat-total-policies-val" style={{fontSize: '1.85rem', fontWeight: '700', color: '#3B241D', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>426</div>
<div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '500', pointerEvents: 'none'}}>All product lines</div>
</div>
{/* Row 2, Card 3: Active Policies */}
<div className="admin-stat-item stat-card" data-panel-trigger="true" data-tooltip="Policies that are currently active and in-force (378 policies). Click to view details." id="card-admin-active" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openAdminActivePoliciesSlidePanel(event)') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-admh-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-admh-bg)" r="42"></circle>
{/* Server Blade 1 */}
<rect fill="#FFFFFF" fillOpacity="0.92" height="18" rx="5" stroke="#F5BAA0" strokeWidth="1.5" width="64" x="30" y="24"></rect>
<circle cx="40" cy="33" fill="#059669" r="3.5"></circle>
<line stroke="#FCE4D6" strokeLinecap="round" strokeWidth="2" x1="52" x2="82" y1="33" y2="33"></line>
{/* Server Blade 2 */}
<rect fill="#FFFFFF" fillOpacity="0.92" height="18" rx="5" stroke="#F5BAA0" strokeWidth="1.5" width="64" x="30" y="48"></rect>
<circle cx="40" cy="57" fill="#059669" r="3.5"></circle>
<line stroke="#FCE4D6" strokeLinecap="round" strokeWidth="2" x1="52" x2="82" y1="57" y2="57"></line>
{/* Check Circle */}
<circle cx="82" cy="74" fill="#F5B296" r="16" stroke="#E88C68" strokeWidth="1.8"></circle>
<path d="M76 74L80 78L88 70" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4"></path>
</svg>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', pointerEvents: 'none'}}>
<span style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)'}}>Active Policies</span>
<div className="admin-stat-icon-wrapper" style={{background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0'}}>
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><polyline points="20 6 9 17 4 12"></polyline></svg>
</div>
</div>
<div id="admin-stat-active-policies-val" style={{fontSize: '1.85rem', fontWeight: '700', color: '#059669', lineHeight: '1.1', marginBottom: '4px', pointerEvents: 'none'}}>378</div>
<div style={{fontSize: '0.8rem', color: '#059669', fontWeight: '600', pointerEvents: 'none'}}>89% active rate</div>
</div>
</div>
</div>
{/* Charts Row (Req 12) */}
<div className="dashboard-grid" style={{marginBottom: '1.5rem'}}>
{/* Chart 1: Users by Role */}
<div className="card">
<div className="card-header">
<div>
<h3 className="card-title">Users by Role</h3>
<div className="card-subtitle">Distribution across 248 enterprise accounts</div>
</div>
</div>
<div id="admin-users-by-role-chart" style={{marginTop: '0.5rem', minHeight: '200px'}}>
{/* Populated with InsureAssist Donut Chart via renderAdminDashboardCharts() */}
</div>
</div>
{/* Chart 2: Policy Status Overview */}
<div className="card">
<div className="card-header">
<div>
<h3 className="card-title">Policy Status Overview</h3>
<div className="card-subtitle">426 Total Policies in Platform</div>
</div>
</div>
<div id="admin-policy-status-chart" style={{marginTop: '0.5rem', minHeight: '200px'}}>
{/* Populated with InsureAssist Donut Chart via renderAdminDashboardCharts() */}
</div>
</div>
</div>
{/* Quick User Management Preview Table & Audit Snip */}
<div className="card">
<div className="card-header">
<div>
<h3 className="card-title">Recent User Registrations</h3>
<div className="card-subtitle">Latest accounts provisioned on the platform</div>
</div>
<div style={{display: 'flex', gap: '8px'}}>
<button className="btn btn-outline btn-sm" data-panel-trigger="true" data-tooltip="Provision a new platform user with custom RBAC permissions" id="btn-admin-dash-create-user" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'event.stopPropagation(); openCreateUserPanel(event)') : null}>Create User</button>
</div>
</div>
<div className="table-responsive compact-table-scroll">
<table className="data-table">
<thead>
<tr>
<th>User</th>
<th>User ID</th>
<th>Email Address</th>
<th>Role</th>
<th>Status</th>
<th>Created</th>
<th style={{textAlign: 'right'}}>Action</th>
</tr>
</thead>
<tbody id="admin-dashboard-users-tbody">
{/* Injected via JS */}
</tbody>
</table>
</div>
<button aria-expanded="false" className="btn-show-more-toggle" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'toggleCardShowMore(this)') : null}>
<span>Show more</span>
<svg fill="none" height="13" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</div>
</section>
  );
}
