export default function CustomerProfile() {
  return (
<section id="page-customer-profile" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Profile &amp; Settings</h2>
      <p className="page-subtitle">Manage your policyholder account, communication preferences, and security settings.</p>
    </div>
  </div>
  <div className="profile-header card" style={{marginBottom: '1.5rem'}}>
    <div className="profile-avatar-large" id="cust-profile-avatar">SM</div>
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10}}>
        <div>
          <h3 style={{fontSize: '1.45rem', color: 'var(--blue-900)', fontWeight: 700}} id="cust-profile-name">Customer</h3>
          <p style={{color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 2}}>Customer ID: <strong id="cust-profile-id">CUS-2024-89102</strong> · Member Since: <strong id="cust-profile-since">January 2019</strong></p>
        </div>
        <span className="badge badge-active" style={{fontSize: '0.8rem', padding: '0.4rem 0.85rem'}} id="cust-profile-tier">Active Policyholder</span>
      </div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Customer Information</h3>
          <div className="card-subtitle">Verified policyholder identity details</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value" id="cust-info-fullname">Customer</span></div>
      <div className="detail-row"><span className="detail-label">Date of Birth</span><span className="detail-value" id="cust-info-dob">March 12, 1985</span></div>
      <div className="detail-row"><span className="detail-label">Primary Address</span><span className="detail-value" id="cust-info-address">742 Evergreen Terrace, Springfield, OR</span></div>
      <div className="detail-row"><span className="detail-label">Account Status</span><span className="badge badge-active" id="cust-info-status">Active Policyholder</span></div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Contact Details</h3>
          <div className="card-subtitle">Primary channels for policy notices</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Email Address</span><span className="detail-value" id="cust-contact-email">customer@insureassist.com</span></div>
      <div className="detail-row"><span className="detail-label">Primary Phone</span><span className="detail-value" id="cust-contact-phone">(555) 234-5678</span></div>
      <div className="detail-row"><span className="detail-label">Emergency Contact</span><span className="detail-value" id="cust-contact-emergency">James Mitchell — (555) 234-7891</span></div>
      <div className="detail-row"><span className="detail-label">Assigned Agent</span><span className="detail-value" style={{color: 'var(--blue-700)', fontWeight: 700}} id="cust-contact-agent">Alex Rivera (Senior Advisor)</span></div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Communication Preferences</h3>
          <div className="card-subtitle">Manage how you receive policy updates and alerts</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Email notifications</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive policy updates and renewal notices by email</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Email notifications" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>SMS alerts for renewals</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive SMS reminders 30 days before policy expiration</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle SMS renewal alerts" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Marketing communications</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive product announcements and promotional offers</div>
        </div>
        <div className="toggle" data-toggle data-tooltip="Toggle Marketing communications" />
      </div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Privacy Settings</h3>
          <div className="card-subtitle">Control data sharing and account security</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Share data for AI improvements</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Allow anonymized queries to improve AI policy assistant accuracy</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle AI data sharing" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Two-factor authentication</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Require an authentication code when signing into your account</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Two-factor authentication" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Activity tracking</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Track in-app browsing to personalize coverage recommendations</div>
        </div>
        <div className="toggle" data-toggle data-tooltip="Toggle Activity tracking" />
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recent Login Activity</h3>
        <div className="card-subtitle">Review sessions and devices that have accessed your account</div>
      </div>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Session security log refreshed.')")} data-tooltip="Refresh security log">Refresh Log</button>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: 'var(--blue-50)', color: 'var(--blue-600)'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={3} width={20} height={14} rx={2} ry={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Today, 9:15 AM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Chrome on Windows · Springfield, IL</div>
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
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Mobile App · iOS · Springfield, IL</div>
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
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Chrome on Windows · Chicago, IL</div>
          </div>
        </div>
        <span style={{fontSize: '0.775rem', color: 'var(--gray-500)', fontWeight: 500}}>Logged out</span>
      </div>
    </div>
  </div>
</section>
  );
}
