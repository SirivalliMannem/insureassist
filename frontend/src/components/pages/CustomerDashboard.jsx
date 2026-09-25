export default function CustomerDashboard() {
  return (
<section className="page active" id="page-customer-dashboard">
<div className="page-header editorial-page-header">
<div className="editorial-header-content">
<div className="header-eyebrow">YOUR INSURANCE. SIMPLIFIED.</div>
<h2 className="page-title editorial-title" id="cust-dash-welcome">
                Welcome back, <span id="cust-dash-name">Sarah</span>!<br/>
<span className="editorial-title-italic">Your protection matters.</span>
</h2>
<p className="page-subtitle editorial-subtitle">Manage your policies, track claims, and get instant guidance with InsureAssist.</p>
</div>
</div>
{/* 3 Customer Summary Cards */}
<div className="grid grid-3" style={{marginBottom: '1.5rem'}}>
<div className="card stat-card" data-tooltip="Total active policies in your customer portfolio." id="card-active-policies">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="35%" id="grad-ap-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
<lineargradient id="grad-ap-doc" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"></stop>
<stop offset="100%" stop-color="#FDEAE0" stop-opacity="0.75"></stop>
</lineargradient>
<lineargradient id="grad-ap-shield" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FAD2C0" stop-opacity="0.95"></stop>
<stop offset="100%" stop-color="#F5B296" stop-opacity="0.85"></stop>
</lineargradient>
</defs>
{/* Ambient background glow */}
<circle cx="75" cy="45" fill="url(#grad-ap-bg)" r="42"></circle>
{/* Document sheet */}
<g transform="rotate(4 65 50)">
<rect fill="url(#grad-ap-doc)" height="70" rx="8" stroke="#F5BAA0" strokeWidth="1.5" width="52" x="36" y="16"></rect>
{/* Document lines */}
<rect fill="#E88C68" fillOpacity="0.5" height="3.5" rx="1.75" width="22" x="44" y="28"></rect>
<rect fill="#F5BAA0" fillOpacity="0.6" height="2.5" rx="1.25" width="36" x="44" y="36"></rect>
<rect fill="#F5BAA0" fillOpacity="0.6" height="2.5" rx="1.25" width="30" x="44" y="42"></rect>
<rect fill="#F5BAA0" fillOpacity="0.6" height="2.5" rx="1.25" width="24" x="44" y="48"></rect>
</g>
{/* Protection Shield */}
<g transform="translate(48, 40)">
<path d="M26 4L46 12V26C46 38 36 46 26 50C16 46 6 38 6 26V12L26 4Z" fill="url(#grad-ap-shield)" stroke="#E28868" strokeLinejoin="round" strokeWidth="1.8"></path>
<path d="M26 9L41 15.5V26C41 35.5 33 42 26 45.5C19 42 11 35.5 11 26V15.5L26 9Z" fill="#FFFFFF" fillOpacity="0.5"></path>
<path d="M19 26L24 31L33 21" stroke="#C85A32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6"></path>
</g>
</svg>
<div className="stat-card-top">
<div className="stat-icon blue">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
</div>
<span className="stat-card-click-hint">View Panel →</span>
</div>
<div className="stat-value" id="cust-dash-active-policies">0</div>
<div className="stat-label">Active Policies</div>
<div className="stat-subtext" id="cust-dash-policies-subtext">Policies in good standing</div>
</div>
<div className="card stat-card" data-tooltip="Policies due for renewal within the next 90 days." id="card-upcoming-renewals">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="60%" cy="40%" id="grad-ren-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
<lineargradient id="grad-ren-cal" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"></stop>
<stop offset="100%" stop-color="#FDE8DD" stop-opacity="0.8"></stop>
</lineargradient>
<lineargradient id="grad-ren-hdr" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" stop-color="#F8C4AE"></stop>
<stop offset="100%" stop-color="#EFA88B"></stop>
</lineargradient>
</defs>
{/* Ambient background glow */}
<circle cx="75" cy="48" fill="url(#grad-ren-bg)" r="42"></circle>
{/* Calendar Body */}
<g transform="rotate(-3 65 52)">
<rect fill="url(#grad-ren-cal)" height="64" rx="10" stroke="#F5BAA0" strokeWidth="1.5" width="62" x="32" y="20"></rect>
{/* Top Header Band */}
<path d="M32 30C32 24.477 36.477 20 42 20H84C89.523 20 94 24.477 94 30V34H32V30Z" fill="url(#grad-ren-hdr)"></path>
{/* Binder Rings */}
<rect fill="#E28868" height="11" rx="2.5" width="5" x="44" y="14"></rect>
<rect fill="#E28868" height="11" rx="2.5" width="5" x="77" y="14"></rect>
{/* Calendar Grid Cells */}
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="40" y="42"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="53" y="42"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="66" y="42"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="79" y="42"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="40" y="53"></rect>
<rect fill="#F0A68A" height="7" rx="2" width="9" x="53" y="53"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="66" y="53"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="79" y="53"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="40" y="64"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="53" y="64"></rect>
<rect fill="#E28868" height="7" rx="2" width="9" x="66" y="64"></rect>
<rect fill="#FCE4D6" height="7" rx="2" width="9" x="79" y="64"></rect>
</g>
</svg>
<div className="stat-card-top">
<div className="stat-icon amber">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><rect height="18" rx="2" width="18" x="3" y="4"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
</div>
<span className="stat-card-click-hint">View Panel →</span>
</div>
<div className="stat-value" id="cust-dash-upcoming-renewals">—</div>
<div className="stat-label">Upcoming Renewals</div>
<div className="stat-subtext" id="cust-dash-renewals-subtext">Portfolio renewals</div>
</div>
<div className="card stat-card" data-tooltip="Total yearly cost across all active policies." id="card-annual-premium">
<svg aria-hidden="true" className="stat-card-watermark" fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialgradient cx="65%" cy="40%" id="grad-prem-bg" r="65%">
<stop offset="0%" stop-color="#FDEFE7" stop-opacity="0.95"></stop>
<stop offset="60%" stop-color="#FCE4D6" stop-opacity="0.6"></stop>
<stop offset="100%" stop-color="#FCE4D6" stop-opacity="0"></stop>
</radialgradient>
<lineargradient id="grad-coin-top" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"></stop>
<stop offset="100%" stop-color="#FCDDCB" stop-opacity="0.85"></stop>
</lineargradient>
<lineargradient id="grad-coin-front" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#FAD2C0"></stop>
<stop offset="100%" stop-color="#F0A68A"></stop>
</lineargradient>
</defs>
{/* Ambient background glow */}
<circle cx="75" cy="48" fill="url(#grad-prem-bg)" r="42"></circle>
{/* Back Stacked Coins (Right) */}
<g transform="translate(62, 22)">
<ellipse cx="22" cy="38" fill="#FCE4D6" rx="19" ry="7.5" stroke="#F5BAA0" strokeWidth="1.2"></ellipse>
<path d="M3 38V46C3 50.142 11.507 53.5 22 53.5C32.493 53.5 41 50.142 41 46V38" fill="#FCD7C4" stroke="#F5BAA0" strokeWidth="1.2"></path>
<path d="M3 46V54C3 58.142 11.507 61.5 22 61.5C32.493 61.5 41 58.142 41 54V46" fill="#F7C4AD" stroke="#F5BAA0" strokeWidth="1.2"></path>
<path d="M3 54V62C3 66.142 11.507 69.5 22 69.5C32.493 69.5 41 66.142 41 62V54" fill="#F2AF93" stroke="#F5BAA0" strokeWidth="1.2"></path>
</g>
{/* Foreground Main Coin (Tilted Left) */}
<g transform="translate(28, 30)">
<circle cx="28" cy="34" fill="url(#grad-coin-front)" r="24" stroke="#E88C68" strokeWidth="1.8"></circle>
<circle cx="28" cy="34" fill="url(#grad-coin-top)" r="19" stroke="#F5BAA0" strokeWidth="1.2"></circle>
{/* Dollar Sign */}
<path d="M28 22V46M22 27H31C33.2 27 35 28.5 35 30.5C35 32.5 33.2 34 31 34H25C22.8 34 21 35.5 21 37.5C21 39.5 22.8 41 25 41H34" stroke="#C85A32" strokeLinecap="round" strokeWidth="2.6"></path>
</g>
</svg>
<div className="stat-card-top">
<div className="stat-icon green">
<svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="1" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
</div>
<span className="stat-card-click-hint">Breakdown →</span>
</div>
<div className="stat-value" id="cust-dash-annual-premium">$0</div>
<div className="stat-label">Annual Premium</div>
<div className="stat-subtext" id="cust-dash-premium-subtext">In-force portfolio</div>
</div>
</div>
{/* Customer Independent Two-Column Layout (Premium Chart & Approaching Renewals) */}
<div className="customer-dashboard-layout">
{/* Left Independent Column: Premium by Policy Type */}
<div className="customer-col-left">
<div className="card customer-card-premium">
<div className="card-header">
<div>
<h3 className="card-title">Premium by Policy Type</h3>
<div className="card-subtitle">Distribution across active coverage categories</div>
</div>
<span className="badge badge-info" data-tooltip="Combined premium across active policies" id="cust-dash-premium-badge">Total $0/yr</span>
</div>
<div className="chart-container">
<div className="chart-bars-horizontal" id="customer-dashboard-chart-container">
{/* Dynamically populated via renderCustomerDashboard() */}
</div>
</div>
</div>
</div>
{/* Right Independent Column: Approaching Renewals Card */}
<div className="customer-col-right">
<div className="card customer-card-renewals">
<div className="card-header">
<div>
<h3 className="card-title" id="cust-dash-renewals-title">Approaching Renewals (0)</h3>
<div className="card-subtitle">Policies approaching automatic review</div>
</div>
</div>
<div className="compact-list-scroll" id="customer-dashboard-renewals-container">
{/* Dynamically populated via renderCustomerDashboard() */}
</div>
<button aria-expanded="false" className="btn-show-more-toggle" id="cust-renewals-show-more-btn" onClick={(e) => window.__iaCall ? window.__iaCall(e, 'toggleCustomerRenewalsList()') : null} style={{display: 'none'}}>
<span id="cust-renewals-btn-text">Show more</span>
<svg fill="none" height="13" id="cust-renewals-btn-icon" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</div>
</div>
</div>
{/* Personalized Policy Recommendations Section */}
<div className="card">
<div className="card-header">
<div>
<h3 className="card-title">Personalized Policy Recommendations</h3>
<div className="card-subtitle">Suggestions based on your current insurance coverage</div>
</div>
</div>
<div className="recommendations-grid" id="customer-recommendations-container">
{/* Dynamically populated via renderCustomerRecommendations() from MOCK_DB.recommendations */}
</div>
</div>
</section>
  );
}
