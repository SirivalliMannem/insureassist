export default function LoginScreen() {
  return (
<div id="login-screen" style={{display: 'none'}}>
  <div className="login-wrapper">
    <button type="button" className="login-back-btn" onClick={(event) => window.__iaCall(event, "showLandingPage()")}>
      <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1={19} y1={12} x2={5} y2={12} /><polyline points="12 19 5 12 12 5" /></svg>
      <span>Back to Overview</span>
    </button>
    <div className="login-split-container">
      <div className="login-left-brand">
        <div className="login-brand-header">
          <div className="login-brand-logo-sq">
            <svg width={26} height={26} fill="none" stroke="#FFFFFF" strokeWidth="2.3" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <h2 className="login-brand-heading">InsureAssist</h2>
        </div>
        <div className="login-editorial-block">
          <h3 className="login-editorial-title">
            One platform.<br />
            <span className="editorial-italic">Every policy.</span>
          </h3>
          <div className="login-editorial-tagline">Protection, connected.</div>
          <p className="login-editorial-desc">
            Manage your insurance with clarity, confidence, and intelligent guidance.
          </p>
        </div>
        <div className="login-footer-pill">
          <span className="dot-indicator" />
          <span>Enterprise Insurance Portal</span>
        </div>
      </div>
      <div className="login-right-card">
        <div className="login-card-inner">
          <div className="login-card-header">
            <h3 id="login-title">Welcome back</h3>
            <p className="subtitle" id="login-subtitle">Sign in to continue to your portal</p>
          </div>
          <form id="login-form">
            <div className="form-group">
              <label htmlFor="email" id="login-email-label">Email Address</label>
              <div className="input-with-icon">
                <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input type="email" id="email" placeholder="name@example.com" required autoComplete="email" />
              </div>
            </div>
            <div className="form-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-with-icon">
                <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input type="password" id="password" placeholder="Enter your password" required autoComplete="current-password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-login-submit" id="login-submit-btn">
              <span>Sign In</span>
              <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </form>
          <div className="login-hint-clean">
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><line x1={12} y1={16} x2={12} y2={12} /><line x1={12} y1={8} x2="12.01" y2={8} /></svg>
            <span id="login-hint-text">Your portal dashboard and permissions are automatically authenticated by the backend service.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
