export default function UnderwriterDashboard() {
  return (
<section className="page" id="page-underwriter-dashboard">
<div className="page-header editorial-page-header">
<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', width: '100%'}}>
<div>
<div className="header-eyebrow">INFORMED DECISIONS</div>
<h2 className="page-title editorial-title" id="uw-dashboard-greeting">
                  Hello <span id="uw-dash-name">Alex</span>,<br/>
<span className="editorial-title-italic">Assess today. Protect tomorrow.</span>
</h2>
<p className="page-subtitle editorial-subtitle">Review applications, assess risk, and help build a safer tomorrow.</p>
</div>
<div className="portal-identity-badge">
<span className="portal-identity-dot" style={{background: '#8C5343'}}></span>
<span>Underwriter Portal · Assess risk. Enable confidence.</span>
</div>
</div>
</div>
{/* 4 Interactive Underwriter Summary Cards (Equal Sizing & Heights) */}
<div className="grid grid-4" style={{marginBottom: '1.5rem'}}>
{/* Pending Reviews */}
<div className="card stat-card" data-tooltip="View pending submissions in the Underwriting Queue" id="card-uw-pending" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'navigateTo('underwriter-queue')') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-uwp-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-uwp-bg)" r="42"></circle>
{/* Dossier Sheet */}
<rect fill="#FFFFFF" fillOpacity="0.9" height="66" rx="8" stroke="#F5BAA0" strokeWidth="1.5" width="54" x="30" y="20"></rect>
<rect fill="#FCE4D6" height="13" rx="6" width="54" x="30" y="20"></rect>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2" x1="40" x2="68" y1="42" y2="42"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="40" x2="62" y1="50" y2="50"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="40" x2="54" y1="58" y2="58"></line>
{/* Clock Overlay */}
<circle cx="76" cy="62" fill="#FAD2C0" r="20" stroke="#E88C68" strokeWidth="1.8"></circle>
<circle cx="76" cy="62" fill="#FFFFFF" r="15"></circle>
<polyline points="76 52 76 62 84 66" stroke="#C85A32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2"></polyline>
</svg>
<div className="stat-card-top">
<div className="stat-icon amber">
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
</div>
<span className="stat-card-click-hint">Queue →</span>
</div>
<div className="stat-value" id="uw-stat-pending-val">--</div>
<div className="stat-label">Pending Reviews</div>
<div className="stat-subtext">Awaiting risk assessment</div>
</div>
{/* High-Risk Cases */}
<div className="card stat-card" data-tooltip="View flagged high-risk cases in the Underwriting Queue" id="card-uw-high-risk" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'navigateTo('underwriter-queue')') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-uwh-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-uwh-bg)" r="42"></circle>
{/* Outer Risk Radar Circle */}
<circle cx="70" cy="52" r="32" stroke="#F5BAA0" strokeDasharray="4 4" strokeWidth="1.5"></circle>
{/* Risk Hazard Triangle */}
<path d="M70 20L98 70C99.5 72.5 97.5 76 94.5 76H45.5C42.5 76 40.5 72.5 42 70L70 20Z" fill="#FAD2C0" stroke="#E88C68" strokeLinejoin="round" strokeWidth="2"></path>
<path d="M70 28L92 68H48L70 28Z" fill="#FFFFFF" fillOpacity="0.6"></path>
<path d="M70 40V54" stroke="#C85A32" strokeLinecap="round" strokeWidth="3"></path>
<circle cx="70" cy="61" fill="#C85A32" r="2.2"></circle>
</svg>
<div className="stat-card-top">
<div className="stat-icon red">
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
</div>
<span className="stat-card-click-hint">Queue →</span>
</div>
<div className="stat-value" id="uw-stat-high-risk-val">--</div>
<div className="stat-label">High-Risk Cases</div>
<div className="stat-subtext">Flagged for strict review</div>
</div>
{/* Approved */}
<div className="card stat-card" data-tooltip="View approved policy applications" id="card-uw-approved" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'navigateTo('underwriter-queue')') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-uwa-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-uwa-bg)" r="42"></circle>
{/* Ribbons */}
<path d="M60 68L50 90L68 82L86 90L76 68" fill="#FAD2C0" stroke="#E88C68" strokeLinejoin="round" strokeWidth="1.5"></path>
{/* Rosette Seal */}
<circle cx="68" cy="48" fill="#FCE4D6" r="28" stroke="#F5BAA0" strokeWidth="1.5"></circle>
<circle cx="68" cy="48" fill="#F5B296" r="22" stroke="#E88C68" strokeWidth="1.8"></circle>
<circle cx="68" cy="48" fill="#FFFFFF" r="16"></circle>
<polyline points="58 48 65 55 79 39" stroke="#C85A32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8"></polyline>
</svg>
<div className="stat-card-top">
<div className="stat-icon green">
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
</div>
<span className="stat-card-click-hint">Queue →</span>
</div>
<div className="stat-value" id="uw-stat-approved-val">--</div>
<div className="stat-label">Approved &amp; Bound</div>
<div className="stat-subtext">Active policies in portfolio</div>
</div>
{/* Needs More Information */}
<div className="card stat-card" data-tooltip="View applications requiring additional documents" id="card-uw-info" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'navigateTo('underwriter-queue')') : null}>
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-uwi-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
</defs>
<circle cx="75" cy="48" fill="url(#grad-uwi-bg)" r="42"></circle>
<rect fill="#FFFFFF" fillOpacity="0.9" height="64" rx="7" stroke="#F5BAA0" strokeWidth="1.5" width="50" x="30" y="20"></rect>
<rect fill="#FCE4D6" height="12" rx="5" width="50" x="30" y="20"></rect>
<line stroke="#E88C68" strokeLinecap="round" strokeWidth="2" x1="38" x2="66" y1="40" y2="40"></line>
<line stroke="#F5BAA0" strokeLinecap="round" strokeWidth="1.8" x1="38" x2="60" y1="48" y2="48"></line>
{/* Inspection Lens with Question mark */}
<circle cx="76" cy="58" fill="#FAD2C0" r="20" stroke="#E88C68" strokeWidth="2"></circle>
<circle cx="76" cy="58" fill="#FFFFFF" r="15"></circle>
<text fill="#C85A32" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="bold" textAnchor="middle" x="76" y="65">?</text>
</svg>
<div className="stat-card-top">
<div className="stat-icon blue">
<svg fill="none" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
</div>
<span className="stat-card-click-hint">Queue →</span>
</div>
<div className="stat-value" id="uw-stat-info-val">--</div>
<div className="stat-label">Info Required</div>
<div className="stat-subtext">Documents pending review</div>
</div>
</div>
{/* Middle Section: Decision Distribution & Urgent Attention Cases */}
<div className="grid grid-2" style={{marginBottom: '1.5rem', alignItems: 'stretch'}}>
{/* Left Card: Underwriting Decision Insights & Distribution */}
<div className="card" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
<div className="card-header">
<div>
<h3 className="card-title">Underwriting Decision Distribution</h3>
<div className="card-subtitle">Portfolio case outcomes &amp; pipeline efficiency</div>
</div>
<div id="uw-decision-total-cases" style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '600'}}>-- Total Cases</div>
</div>
<div id="uw-decision-distribution-container" style={{display: 'flex', flexDirection: 'column', gap: '0.9rem'}}>
{/* Populated dynamically via JS */}
</div>
{/* Executive Performance Indicators */}
<div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)'}}>
<div data-tooltip="Weighted average hazard score of active book" style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--gray-200)'}}>
<div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '600'}}>Avg Risk Score</div>
<div id="uw-avg-risk-score-val" style={{fontSize: '1.1rem', fontWeight: '700', color: 'var(--blue-900)', marginTop: '2px'}}>--</div>
</div>
<div data-tooltip="Active portfolio coverage ratio" style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--gray-200)'}}>
<div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '600'}}>Active Policy Rate</div>
<div id="uw-active-policy-rate-val" style={{fontSize: '1.1rem', fontWeight: '700', color: 'var(--green)', marginTop: '2px'}}>--</div>
</div>
<div data-tooltip="Pending queue volume requiring action" style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--gray-200)'}}>
<div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '600'}}>Queue Triage Volume</div>
<div id="uw-triage-volume-val" style={{fontSize: '1.1rem', fontWeight: '700', color: 'var(--blue-900)', marginTop: '2px'}}>--</div>
</div>
<div data-tooltip="High-risk accounts proportion in queue" style={{background: 'var(--gray-50)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--gray-200)'}}>
<div style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '600'}}>High-Risk Ratio</div>
<div id="uw-high-risk-ratio-val" style={{fontSize: '1.1rem', fontWeight: '700', color: 'var(--blue-600)', marginTop: '2px'}}>--</div>
</div>
</div>
</div>
{/* Right Card: High-Priority Cases Requiring Immediate Attention */}
<div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
<div>
<div className="card-header">
<div>
<h3 className="card-title">Cases Requiring Attention</h3>
<div className="card-subtitle">Urgent triage queue flagged for underwriter intervention</div>
</div>
<span className="badge" id="uw-urgent-badge" style={{background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5'}}>High Priority</span>
</div>
<div id="uw-urgent-attention-list" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
{/* Populated dynamically via JS */}
</div>
</div>
<div style={{marginTop: '1.25rem'}}>
<button className="btn btn-outline btn-block" data-tooltip="Navigate to Underwriting Queue" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'navigateTo('underwriter-queue')') : null}>
                  Open Full Queue →
                </button>
</div>
</div>
</div>
{/* Bottom Section: Portfolio Exposure by Line + Recent Decision Activity */}
<div className="grid grid-2" style={{marginBottom: '1.5rem', alignItems: 'stretch'}}>
{/* Left Card: Portfolio Exposure by Line of Business */}
<div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
<div>
<div className="card-header">
<div>
<h3 className="card-title">Portfolio Exposure by Line</h3>
<div className="card-subtitle">Active insured liability spread across lines of business</div>
</div>
</div>
<div className="chart-bars-horizontal" id="uw-lob-distribution-bars">
{/* Populated dynamically via JS */}
</div>
</div>
</div>
{/* Right Card: Recent Underwriting Decision Activity */}
<div className="card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
<div>
<div className="card-header">
<div>
<h3 className="card-title">Recent Decision Activity</h3>
<div className="card-subtitle">Audit trail of newly bound and processed submissions</div>
</div>
</div>
<div id="uw-recent-activity-list" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
{/* Populated dynamically via JS */}
</div>
</div>
</div>
</div>
</section>
  );
}
