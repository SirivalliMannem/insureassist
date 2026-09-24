export default function AdminUsers() {
  return (
<section id="page-admin-users" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">User Management</h2>
      <p className="page-subtitle">Enterprise identity directory, role assignment, and access governance</p>
    </div>
    <button className="btn btn-primary" id="btn-admin-create-user" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openCreateUserPanel(event)")}>
      Create User
    </button>
  </div>
  <div className="card">
    <div className="queue-filter-bar" style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem'}}>
      <div className="search-input-wrapper" style={{flex: 1, minWidth: 240, marginBottom: 0}}>
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
        <input type="text" id="admin-user-search-input" placeholder="Search users by name, email, or ID..." />
      </div>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <select id="admin-user-role-filter" className="form-control" style={{width: 'auto', padding: '7px 12px', fontSize: '0.85rem', border: '1px solid var(--gray-300)', borderRadius: 6}}>
          <option value="all">All Roles (4)</option>
          <option value="Customer">Customer</option>
          <option value="Agent">Agent</option>
          <option value="Underwriter">Underwriter</option>
          <option value="Admin">Admin</option>
        </select>
        <select id="admin-user-status-filter" className="form-control" style={{width: 'auto', padding: '7px 12px', fontSize: '0.85rem', border: '1px solid var(--gray-300)', borderRadius: 6}}>
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="btn btn-outline btn-sm" id="admin-user-reset-btn">Reset</button>
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
        <tbody id="admin-full-users-tbody">
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
