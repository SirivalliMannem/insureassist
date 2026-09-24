export default function UnderwriterProfile() {
  return (
<section id="page-underwriter-profile" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Profile &amp; Settings</h2>
      <p className="page-subtitle">Manage your underwriter account, communication preferences, and security settings.</p>
    </div>
  </div>
  <div className="profile-header card" style={{marginBottom: '1.5rem'}}>
    <div className="profile-avatar-large underwriter-avatar">AV</div>
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10}}>
        <div>
          <h3 style={{fontSize: '1.45rem', color: 'var(--blue-900)', fontWeight: 700}}>Alex Vance</h3>
          <p style={{color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 2}}>Underwriter ID: <strong>UW-88210</strong> · Role: <strong>Senior Risk Underwriter (CPCU)</strong> · Member Since: <strong>August 2020</strong></p>
          <p style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 4}}>Department: Underwriting &amp; Risk Evaluation · Team: Midwest Regional Underwriting Unit</p>
        </div>
        <span className="badge badge-active" style={{background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9', fontSize: '0.8rem', padding: '0.4rem 0.85rem'}}>Senior Underwriter (CPCU)</span>
      </div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Underwriter Information</h3>
          <div className="card-subtitle">Underwriting authority and operational group</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value">Alex Vance</span></div>
      <div className="detail-row"><span className="detail-label">Underwriter ID</span><span className="detail-value" style={{fontFamily: 'monospace', fontWeight: 700}}>UW-88210</span></div>
      <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">Underwriting &amp; Risk Evaluation</span></div>
      <div className="detail-row"><span className="detail-label">Team</span><span className="detail-value">Midwest Regional Underwriting Unit</span></div>
      <div className="detail-row"><span className="detail-label">Account Status</span><span className="badge badge-active">Active Senior Authority ($2.5M Binding)</span></div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Contact Details</h3>
          <div className="card-subtitle">Work communication and risk officer channels</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Email Address</span><span className="detail-value">alex.vance@insureassist.com</span></div>
      <div className="detail-row"><span className="detail-label">Primary Phone</span><span className="detail-value">(555) 942-5678</span></div>
      <div className="detail-row"><span className="detail-label">Office / Team Info</span><span className="detail-value">Chicago Underwriting Center #600</span></div>
      <div className="detail-row"><span className="detail-label">Manager / Supervisor</span><span className="detail-value" style={{color: 'var(--blue-700)', fontWeight: 700}}>Diana Reyes (Chief Underwriting Officer)</span></div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Communication Preferences</h3>
          <div className="card-subtitle">Manage submission notices and case alerts</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Email notifications</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive email alerts when new cases enter your queue</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Email notifications" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>SMS alerts</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive urgent high-risk case escalations via SMS</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle SMS alerts" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Underwriting alerts</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Notify immediately when broker responds to information requests</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Underwriting alerts" />
      </div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Privacy Settings</h3>
          <div className="card-subtitle">Control risk data processing and login security</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Share data for AI improvements</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Allow anonymized decision logs to improve AI risk scoring</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle AI data sharing" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Two-factor authentication</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Require multi-factor authorization for binding actions</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Two-factor authentication" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Activity tracking</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Log audit trails for regulatory compliance reviews</div>
        </div>
        <div className="toggle" data-toggle data-tooltip="Toggle Activity tracking" />
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recent Login Activity</h3>
        <div className="card-subtitle">Review underwriter sessions and secure terminals</div>
      </div>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Underwriter audit log refreshed.')")} data-tooltip="Refresh audit log">Refresh Log</button>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: '#f5f3ff', color: '#7c3aed'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={3} width={20} height={14} rx={2} ry={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Today, 9:15 AM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Chrome on Windows · Hyderabad, India</div>
          </div>
        </div>
        <span className="badge badge-active">Current</span>
      </div>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: 'var(--gray-100)', color: 'var(--gray-600)'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={5} y={2} width={14} height={20} rx={2} ry={2} /><line x1={12} y1={18} x2="12.01" y2={18} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Yesterday, 6:42 PM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Mobile App · iOS · Hyderabad, India</div>
          </div>
        </div>
        <span style={{fontSize: '0.775rem', color: 'var(--gray-500)', fontWeight: 500}}>Logged out</span>
      </div>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: 'var(--gray-100)', color: 'var(--gray-600)'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={3} width={20} height={14} rx={2} ry={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Mar 28, 2026, 2:10 PM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Chrome on Windows · Hyderabad, India</div>
          </div>
        </div>
        <span style={{fontSize: '0.775rem', color: 'var(--gray-500)', fontWeight: 500}}>Logged out</span>
      </div>
    </div>
  </div>
</section>
  );
}
