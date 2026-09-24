export default function LandingPage() {
  return (
<div id="landing-page" className="landing-container">
  <header className="landing-header">
    <div className="landing-brand">
      <div className="landing-brand-logo">
        <svg width={22} height={22} fill="none" stroke="#FFFFFF" strokeWidth="2.3" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      </div>
      <span className="landing-brand-name">InsureAssist</span>
    </div>
    <div className="landing-header-right">
      <button type="button" className="btn-landing-user-signin" id="landing-header-signin-btn" onClick={(event) => window.__iaCall(event, "showLoginScreen()")} title="Sign in to Portal" aria-label="Sign in to Portal">
        <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
        <span>Sign in</span>
      </button>
    </div>
  </header>
  <main className="landing-hero">
    <div className="landing-hero-left">
      <div className="landing-eyebrow">INTELLIGENT INSURANCE PLATFORM</div>
      <h1 className="landing-title">
        One platform.<br />
        <span className="landing-title-italic">Every policy.</span>
      </h1>
      <div className="landing-tagline">Protection, connected.</div>
      <p className="landing-description">
        Manage policies, applications, claims, and intelligent policy guidance in one secure, unified platform.
      </p>
      <div className="landing-actions">
        <button type="button" className="btn btn-hero-cta" id="landing-hero-signin-btn" onClick={(event) => window.__iaCall(event, "showLoginScreen()")}>
          <span>Sign in to Portal</span>
          <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>
    </div>
    <div className="landing-hero-right">
      <div className="hub-visual-container">
        <svg className="hub-svg-backdrop" viewBox="0 0 520 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx={260} cy={250} r={70} stroke="rgba(200, 90, 50, 0.18)" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx={260} cy={250} r={140} stroke="rgba(200, 90, 50, 0.14)" strokeWidth="1.2" />
          <circle cx={260} cy={250} r={205} stroke="rgba(42, 24, 16, 0.08)" strokeWidth={1} strokeDasharray="5 5" />
          <line x1={260} y1={250} x2={260} y2={55} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={260} y1={250} x2={110} y2={120} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={260} y1={250} x2={410} y2={160} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={260} y1={250} x2={110} y2={335} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={260} y1={250} x2={410} y2={380} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={260} y1={250} x2={260} y2={445} stroke="rgba(200, 90, 50, 0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
        </svg>
        <div className="hub-center-logo" title="InsureAssist Platform">
          <div className="hub-center-icon">
            <svg width={26} height={26} fill="none" stroke="#FFFFFF" strokeWidth="2.3" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
        </div>
        <div className="capability-card cap-node-1">
          <div className="capability-icon">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">MY POLICIES</div>
            <div className="capability-desc">Manage Active Policies</div>
          </div>
        </div>
        <div className="capability-card cap-node-2">
          <div className="capability-icon">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">COVERAGE CHECKER</div>
            <div className="capability-desc">Understand Your Coverage</div>
          </div>
        </div>
        <div className="capability-card cap-node-3">
          <div className="capability-icon terracotta-tint">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">AI ASSISTANT</div>
            <div className="capability-desc">Get Policy Guidance</div>
          </div>
        </div>
        <div className="capability-card cap-node-4">
          <div className="capability-icon">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">CLAIMS</div>
            <div className="capability-desc">Track Your Claims</div>
          </div>
        </div>
        <div className="capability-card cap-node-5">
          <div className="capability-icon">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">POLICY APPLICATIONS</div>
            <div className="capability-desc">Apply &amp; Track Policies</div>
          </div>
        </div>
        <div className="capability-card cap-node-6">
          <div className="capability-icon">
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          </div>
          <div className="capability-content">
            <div className="capability-title">INSURANCE GLOSSARY</div>
            <div className="capability-desc">Understand Insurance Terms</div>
          </div>
        </div>
      </div>
    </div>
  </main></div>
  );
}
