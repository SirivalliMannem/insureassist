export default function AdminProfile() {
  return (
<section id="page-admin-profile" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Profile &amp; Settings</h2>
      <p className="page-subtitle">Manage your administrator account, communication preferences, and security settings.</p>
    </div>
    <div className="portal-tag" style={{background: '#0f172a', color: '#ffffff', borderColor: '#0f172a'}}>
      <span className="portal-dot" style={{background: '#22c55e'}} />
      Admin Account Active
    </div>
  </div>
  <div className="card" style={{marginBottom: '1.5rem'}}>
    <div className="profile-card-header">
      <div className="profile-avatar-large admin-avatar">AD</div>
      <div className="profile-card-info">
        <h3 className="profile-name">Jordan Taylor</h3>
        <div className="profile-badge-line">
          <span className="profile-id-code">ADM-001</span>
          <span className="badge" style={{background: '#0f172a', color: '#ffffff'}}>Chief System Administrator</span>
          <span className="badge badge-info">IT &amp; Enterprise Governance</span>
        </div>
        <div className="profile-meta-text">
          <span><strong>Member Since:</strong> Oct 2021</span> · 
          <span><strong>Permission Level:</strong> Superuser (Root)</span> · 
          <span><strong>Status:</strong> Active</span>
        </div>
      </div>
    </div>
  </div>
  <div className="dashboard-grid" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Admin Information</h3>
          <div className="card-subtitle">System credentials and administrative authority</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Admin authority details are read-only in prototype.')")}>Edit</button>
      </div>
      <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value" style={{fontWeight: 700, color: 'var(--blue-900)'}}>Jordan Taylor</span></div>
      <div className="detail-row"><span className="detail-label">Admin ID</span><span className="detail-value" style={{fontFamily: 'monospace', fontWeight: 700}}>ADM-001</span></div>
      <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">Enterprise IT &amp; Platform Security</span></div>
      <div className="detail-row"><span className="detail-label">Account Status</span><span className="badge badge-active">Active</span></div>
      <div className="detail-row"><span className="detail-label">Permission Level</span><span className="detail-value" style={{fontWeight: 700, color: 'var(--blue-900)'}}>Superuser / Full Platform Access</span></div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Contact Details</h3>
          <div className="card-subtitle">Official administrative communications channel</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Contact details updated.')")}>Edit</button>
      </div>
      <div className="detail-row"><span className="detail-label">Email Address</span><span className="detail-value" style={{color: 'var(--blue-700)'}}>admin@insureassist.com</span></div>
      <div className="detail-row"><span className="detail-label">Primary Phone</span><span className="detail-value">(555) 019-2831</span></div>
      <div className="detail-row"><span className="detail-label">Office Location</span><span className="detail-value">Global HQ · Cloud Operations Center</span></div>
      <div className="detail-row"><span className="detail-label">Manager / Supervisor</span><span className="detail-value">Board of Directors · Technology Committee</span></div>
    </div>
  </div>
  <div className="dashboard-grid" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Communication Preferences</h3>
          <div className="card-subtitle">Administrative alerts and system notifications</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">Email notifications</div>
            <div className="toggle-desc">Receive critical system outage and security notifications via email</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={(event) => window.__iaCall(event, "showToast('Email notifications ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">SMS alerts</div>
            <div className="toggle-desc">Urgent two-factor and high-severity platform SMS alerts</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={(event) => window.__iaCall(event, "showToast('SMS alerts ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">System alerts</div>
            <div className="toggle-desc">Real-time alerts on new user sign-ups and underwriting backlog spikes</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={(event) => window.__iaCall(event, "showToast('System alerts ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Privacy &amp; Security</h3>
          <div className="card-subtitle">Enterprise governance and authentication settings</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">Share data for AI improvements</div>
            <div className="toggle-desc">Permit anonymized telemetry for AI model tuning and workflow optimization</div>
          </div>
          <label className="switch">
            <input type="checkbox" onChange={(event) => window.__iaCall(event, "showToast('AI telemetry sharing ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">Two-factor authentication</div>
            <div className="toggle-desc">Enforce hardware security key or TOTP authenticator on admin login</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={(event) => window.__iaCall(event, "showToast('2FA enforcement ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
        <div className="toggle-setting-row">
          <div className="toggle-info">
            <div className="toggle-title">Activity tracking</div>
            <div className="toggle-desc">Record full administrative audit log and user provisioning trails</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={(event) => window.__iaCall(event, "showToast('Activity tracking ' + (this.checked ? 'enabled' : 'disabled'))")} />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recent Login Activity</h3>
        <div className="card-subtitle">Review administrator authentication sessions and active terminals</div>
      </div>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Administrator audit log refreshed.')")} data-tooltip="Refresh audit log">Refresh Log</button>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: '#0f172a', color: '#ffffff'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={3} width={20} height={14} rx={2} ry={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Today, 9:05 AM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Chrome on Windows (Admin Terminal) · Hyderabad, India</div>
          </div>
        </div>
        <span className="badge badge-active">Current</span>
      </div>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: 'var(--gray-100)', color: 'var(--gray-600)'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={3} width={20} height={14} rx={2} ry={2} /><line x1={8} y1={21} x2={16} y2={21} /><line x1={12} y1={17} x2={12} y2={21} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Yesterday, 4:15 PM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Firefox on Windows · Hyderabad, India</div>
          </div>
        </div>
        <span style={{fontSize: '0.775rem', color: 'var(--gray-500)', fontWeight: 500}}>Logged out</span>
      </div>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: 'var(--gray-100)', color: 'var(--gray-600)'}}>
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={5} y={2} width={14} height={20} rx={2} ry={2} /><line x1={12} y1={18} x2="12.01" y2={18} /></svg>
          </div>
          <div>
            <div style={{fontWeight: 700, color: 'var(--blue-900)', fontSize: '0.925rem'}}>Mar 28, 2026, 11:30 AM</div>
            <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 2}}>Admin Authenticator Mobile · iOS · Hyderabad, India</div>
          </div>
        </div>
        <span style={{fontSize: '0.775rem', color: 'var(--gray-500)', fontWeight: 500}}>Logged out</span>
      </div>
    </div>
  </div>
</section>
  );
}
