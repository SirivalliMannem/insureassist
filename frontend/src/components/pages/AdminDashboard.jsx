export default function AdminDashboard() {
  return (
<section id="page-admin-dashboard" className="page">
  <div className="page-header editorial-page-header">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, width: '100%'}}>
      <div>
        <div className="header-eyebrow">A SECURE AND SCALABLE PLATFORM</div>
        <h2 className="page-title editorial-title" id="admin-welcome-title">
          Hello <span id="admin-dash-name">Sirivalli</span>,<br />
          <span className="editorial-title-italic">Keep everything running smoothly.</span>
        </h2>
        <p className="page-subtitle editorial-subtitle">Manage users, monitor system activity, and ensure a seamless insurance experience.</p>
      </div>
      <div className="portal-identity-badge">
        <span className="portal-identity-dot" style={{background: '#2A1810'}} />
        <span>Admin Portal · Manage. Monitor. Maintain.</span>
      </div>
    </div>
  </div>
  <div className="card admin-stats-combined-card">
    <div className="card-header" style={{marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-200)'}}>
      <div>
        <h3 className="card-title">Enterprise System Overview</h3>
        <div className="card-subtitle">Key platform metrics, user directory distribution, and policy status</div>
      </div>
      <span className="badge badge-active" data-tooltip="Real-time synchronized platform statistics">Live Metrics</span>
    </div>
    <div className="admin-stats-subgrid">
      <div className="admin-stat-item stat-card" id="card-admin-users" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminUsersSlidePanel(event)")} data-tooltip="Total number of registered enterprise platform accounts across all roles (248 users). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Total Users</span>
          <div className="admin-stat-icon-wrapper" style={{background: '#f1f5f9', color: '#0f172a'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
        </div>
        <div id="admin-stat-total-users-val" style={{fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>248</div>
        <div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, pointerEvents: 'none'}}>System-wide accounts</div>
      </div>
      <div className="admin-stat-item stat-card" id="card-admin-customers" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminCustomersSlidePanel(event)")} data-tooltip="Total retail insurance policyholders registered on the platform (180 customers). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Total Customers</span>
          <div className="admin-stat-icon-wrapper" style={{background: 'var(--blue-50)', color: 'var(--blue-600)'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
          </div>
        </div>
        <div id="admin-stat-total-customers-val" style={{fontSize: '1.85rem', fontWeight: 700, color: 'var(--blue-900)', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>180</div>
        <div style={{fontSize: '0.8rem', color: 'var(--blue-600)', fontWeight: 600, pointerEvents: 'none'}}>73% of user base</div>
      </div>
      <div className="admin-stat-item stat-card" id="card-admin-agents" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminAgentsSlidePanel(event)")} data-tooltip="Total licensed brokerage advisors and field agents (32 agents). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Total Agents</span>
          <div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#7A4A3A', border: '1px solid #EADBCE'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={2} y={7} width={20} height={14} rx={2} ry={2} /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          </div>
        </div>
        <div id="admin-stat-total-agents-val" style={{fontSize: '1.85rem', fontWeight: 700, color: '#3B241D', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>32</div>
        <div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, pointerEvents: 'none'}}>Licensed advisors</div>
      </div>
      <div className="admin-stat-item stat-card" id="card-admin-underwriters" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminUnderwritersSlidePanel(event)")} data-tooltip="Total senior CPCU underwriters and risk decision officers (24 underwriters). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Total Underwriters</span>
          <div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#5C3A30', border: '1px solid #EADBCE'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
          </div>
        </div>
        <div id="admin-stat-total-underwriters-val" style={{fontSize: '1.85rem', fontWeight: 700, color: '#3B241D', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>24</div>
        <div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, pointerEvents: 'none'}}>Risk decision makers</div>
      </div>
      <div className="admin-stat-item stat-card" id="card-admin-policies" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminPoliciesSlidePanel(event)")} data-tooltip="Total policies registered across all active product lines (426 policies). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Total Policies</span>
          <div className="admin-stat-icon-wrapper" style={{background: '#FAF6F2', color: '#C97963', border: '1px solid #EADBCE'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
        </div>
        <div id="admin-stat-total-policies-val" style={{fontSize: '1.85rem', fontWeight: 700, color: '#3B241D', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>426</div>
        <div style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, pointerEvents: 'none'}}>All product lines</div>
      </div>
      <div className="admin-stat-item stat-card" id="card-admin-active" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openAdminActivePoliciesSlidePanel(event)")} data-tooltip="Policies that are currently active and in-force (378 policies). Click to view details.">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, pointerEvents: 'none'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)'}}>Active Policies</span>
          <div className="admin-stat-icon-wrapper" style={{background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0'}}>
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        </div>
        <div id="admin-stat-active-policies-val" style={{fontSize: '1.85rem', fontWeight: 700, color: '#059669', lineHeight: '1.1', marginBottom: 4, pointerEvents: 'none'}}>378</div>
        <div style={{fontSize: '0.8rem', color: '#059669', fontWeight: 600, pointerEvents: 'none'}}>89% active rate</div>
      </div>
    </div>
  </div>
  <div className="dashboard-grid" style={{marginBottom: '1.5rem'}}>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Users by Role</h3>
          <div className="card-subtitle">Distribution across 248 enterprise accounts</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem'}}>
        <div data-tooltip="180 registered policyholders (73% of user base)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Customers (180)</span>
            <span style={{fontWeight: 700, color: 'var(--blue-600)'}}>73%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '73%', background: 'var(--blue-600)', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="32 licensed brokerage advisors (13% of user base)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Agents (32)</span>
            <span style={{fontWeight: 700, color: '#0d9488'}}>13%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '13%', background: '#0d9488', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="24 senior risk decision officers (10% of user base)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Underwriters (24)</span>
            <span style={{fontWeight: 700, color: '#7c3aed'}}>10%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '10%', background: '#7c3aed', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="12 platform administration accounts (5% of user base)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Administrators (12)</span>
            <span style={{fontWeight: 700, color: '#0f172a'}}>5%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '5%', background: '#0f172a', borderRadius: 99}} />
          </div>
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Policy Status Overview</h3>
          <div className="card-subtitle">426 Total Policies in Platform</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem'}}>
        <div data-tooltip="378 active in-force policies (89% active rate)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Active Policies (378)</span>
            <span style={{fontWeight: 700, color: '#059669'}}>89%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '89%', background: '#059669', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="24 policies currently awaiting review or binding approval (6%)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Pending Approval (24)</span>
            <span style={{fontWeight: 700, color: '#d97706'}}>6%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '6%', background: '#d97706', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="14 policies past term expiration date (3%)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Expired (14)</span>
            <span style={{fontWeight: 700, color: 'var(--gray-500)'}}>3%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '3%', background: 'var(--gray-400)', borderRadius: 99}} />
          </div>
        </div>
        <div data-tooltip="10 policies terminated or voided (2%)">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4}}>
            <span style={{fontWeight: 600, color: 'var(--blue-900)'}}>Cancelled (10)</span>
            <span style={{fontWeight: 700, color: '#dc2626'}}>2%</span>
          </div>
          <div style={{height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden'}}>
            <div style={{height: '100%', width: '2%', background: '#dc2626', borderRadius: 99}} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header">
      <div>
        <h3 className="card-title">Recent User Registrations</h3>
        <div className="card-subtitle">Latest accounts provisioned on the platform</div>
      </div>
      <div style={{display: 'flex', gap: 8}}>
        <button className="btn btn-outline btn-sm" id="btn-admin-dash-create-user" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openCreateUserPanel(event)")} data-tooltip="Provision a new platform user with custom RBAC permissions">Create User</button>
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
        </tbody>
      </table>
    </div>
    <button className="btn-show-more-toggle" onClick={(event) => window.__iaCall(event, "toggleCardShowMore(this)")} aria-expanded="false">
      <span>Show more</span>
      <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
  </div>
</section>
  );
}
