export default function AdminRoles() {
  return (
<section id="page-admin-roles" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Role Management</h2>
      <p className="page-subtitle">Role-based access control (RBAC) definitions, privilege policies, and user assignments</p>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div className="portal-tag" id="admin-roles-count-tag">4 System Roles</div>
      <button className="btn btn-primary" id="btn-admin-create-role" data-panel-trigger="true" onClick={(event) => window.__iaCall(event, "event.stopPropagation(); openCreateRolePanel(event)")}>
        Create Role
      </button>
    </div>
  </div>
  <div className="admin-roles-grid" id="admin-roles-grid-container">
  </div>
</section>
  );
}
