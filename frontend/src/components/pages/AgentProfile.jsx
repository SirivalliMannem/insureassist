export default function AgentProfile() {
  return (
<section id="page-agent-profile" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Profile &amp; Settings</h2>
      <p className="page-subtitle">Manage your agent account, communication preferences, and security settings.</p>
    </div>
  </div>
  <div className="profile-header card" style={{marginBottom: '1.5rem'}}>
    <div className="profile-avatar-large agent-avatar" id="agent-profile-avatar">AN</div>
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10}}>
        <div>
          <h3 id="agent-profile-name" style={{fontSize: '1.45rem', color: 'var(--blue-900)', fontWeight: 700}}>Agent Profile</h3>
          <p id="agent-profile-id-meta" style={{color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 2}}>Agent ID: <strong id="agent-profile-id-sub">1321</strong> · Role: <strong id="agent-profile-role-sub">Agent</strong></p>
          <p style={{fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: 4}}>Department: Retail Brokerage Operations · Status: Licensed Broker</p>
        </div>
        <span className="badge badge-active" id="agent-profile-badge" style={{background: '#f0fdfa', borderColor: '#99f6e4', color: '#0f766e', fontSize: '0.8rem', padding: '0.4rem 0.85rem'}}>Active Licensed Agent</span>
      </div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Agent Information</h3>
          <div className="card-subtitle">Verified broker licensing and operational unit</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value" id="agent-profile-fullname">Agent</span></div>
      <div className="detail-row"><span className="detail-label">Agent ID</span><span className="detail-value" id="agent-profile-id" style={{fontFamily: 'monospace', fontWeight: 700}}>1321</span></div>
      <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">Retail Brokerage Operations</span></div>
      <div className="detail-row"><span className="detail-label">Role</span><span className="detail-value" id="agent-profile-role">Agent</span></div>
      <div className="detail-row"><span className="detail-label">Account Status</span><span className="badge badge-active">Active Licensed Agent</span></div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Contact Details</h3>
          <div className="card-subtitle">Work communication and supervisory channels</div>
        </div>
      </div>
      <div className="detail-row"><span className="detail-label">Email Address</span><span className="detail-value" id="agent-profile-email">agent@example.com</span></div>
      <div className="detail-row"><span className="detail-label">Primary Phone</span><span className="detail-value">(555) 890-1234</span></div>
      <div className="detail-row"><span className="detail-label">Office / Regional Info</span><span className="detail-value">Corporate Brokerage Desk</span></div>
      <div className="detail-row"><span className="detail-label">Operational Status</span><span className="detail-value" style={{color: 'var(--blue-700)', fontWeight: 700}}>Online &amp; Verified</span></div>
    </div>
  </div>
  <div className="grid grid-2" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Communication Preferences</h3>
          <div className="card-subtitle">Manage client alerts and operational updates</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Email notifications</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive policy updates and customer inquiries via email</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Email notifications" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>SMS alerts</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive urgent policyholder messages via SMS</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle SMS alerts" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Policy renewal alerts</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Receive alerts when assigned client policies enter 90-day renewal window</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Policy renewal alerts" />
      </div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Privacy Settings</h3>
          <div className="card-subtitle">Control broker data sharing and workspace security</div>
        </div>
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Share data for AI improvements</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Allow anonymized agent support queries to improve AI recommendations</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle AI data sharing" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Two-factor authentication</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Require multi-factor authorization when accessing client records</div>
        </div>
        <div className="toggle on" data-toggle data-tooltip="Toggle Two-factor authentication" />
      </div>
      <div className="toggle-row">
        <div>
          <div style={{fontWeight: 600, color: 'var(--gray-800)'}}>Activity tracking</div>
          <div style={{fontSize: '0.775rem', color: 'var(--gray-500)'}}>Log workspace navigation to optimize client assignment routing</div>
        </div>
        <div className="toggle" data-toggle data-tooltip="Toggle Activity tracking" />
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recent Login Activity</h3>
        <div className="card-subtitle">Review broker sessions and devices that have accessed your workspace</div>
      </div>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "showToast('Agent security log refreshed.')")} data-tooltip="Refresh security log">Refresh Log</button>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
      <div className="panel-policy-list-item" style={{padding: '0.95rem 1.15rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div className="renewal-icon" style={{background: '#f0fdfa', color: '#0d9488'}}>
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
