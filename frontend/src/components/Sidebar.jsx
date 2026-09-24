export default function Sidebar() {
  return (
<aside className="sidebar" id="sidebar">
  <div className="sidebar-header">
    <div className="sidebar-brand">
      <div className="sidebar-brand-icon">
        <svg width={22} height={22} fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      </div>
      <div className="sidebar-brand-text">
        <span className="sidebar-brand-title">InsureAssist</span>
        <span className="sidebar-brand-subtitle" id="sidebar-role-label">Customer Portal</span>
      </div>
    </div>
  </div>
  <nav className="sidebar-nav">
    <div className="nav-role-section" data-role="customer">
      <div className="nav-section-title">
        <span>Customer</span>
        <span style={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)'}}>Portal</span>
      </div>
      <button className="nav-item active" data-role="customer" data-page="customer-dashboard" data-tooltip="Overview of customer portfolio">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
        Dashboard
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-policies" data-tooltip="Manage active customer policies">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        My Policies
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-application" id="sidebar-customer-application-btn" data-tooltip="Explore available policies and submit an application">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={12} y1={18} x2={12} y2={12} /><line x1={9} y1={15} x2={15} y2={15} /></svg>
        Policy Application
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-comparison" data-tooltip="Compare policy coverage side-by-side">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></svg>
        Policy Comparison
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-coverage" data-tooltip="Verify event or damage coverage">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
        Coverage Checker
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-glossary" data-tooltip="Definitions of insurance terms">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        Insurance Glossary
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-claim" id="sidebar-customer-claim-btn" data-tooltip="Report a new claim / First Notice of Loss (FNOL)">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2="12.01" y2={17} /></svg>
        Report a Claim
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-claims" id="sidebar-customer-claims-btn" data-tooltip="Track and manage all submitted claims">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x={9} y={3} width={6} height={4} rx={2} /><path d="M9 14l2 2 4-4" /></svg>
        My Claims
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-ai" id="sidebar-customer-ai-btn" data-tooltip="Interactive plain-language AI assistant">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        AI Assistant
      </button>
      <button className="nav-item" data-role="customer" data-page="customer-profile" data-tooltip="Customer account details and preferences">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
        Profile &amp; Settings
      </button>
    </div>
    <div className="nav-role-section" data-role="agent">
      <div className="nav-section-title">
        <span>Agent</span>
        <span style={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)'}}>Workspace</span>
      </div>
      <button className="nav-item" data-role="agent" data-page="agent-dashboard" data-tooltip="Overview of assigned customer portfolio">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
        Dashboard
      </button>
      <button className="nav-item" data-role="agent" data-page="agent-customers" data-tooltip="View and manage 18 assigned customers">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        My Customers
      </button>
      <button className="nav-item" data-role="agent" data-page="agent-policies" data-tooltip="Policies of assigned customers only">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        Customer Policies
      </button>
      <button className="nav-item" data-role="agent" data-page="agent-applications" data-tooltip="Review customer applications & forward to underwriting">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
        Policy Applications
      </button>
      <button className="nav-item" data-role="agent" data-page="agent-ai" id="sidebar-agent-ai-btn" data-tooltip="Agent AI for customer policy support">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        AI Assistant
      </button>
      <button className="nav-item" data-role="agent" data-page="agent-profile" data-tooltip="Agent settings and portfolio profile">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
        Profile &amp; Settings
      </button>
    </div>
    <div className="nav-role-section" data-role="underwriter">
      <div className="nav-section-title">
        <span>Underwriter</span>
        <span style={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)'}}>Decision Portal</span>
      </div>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-dashboard" data-tooltip="Overview of underwriting cases and metrics">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
        Dashboard
      </button>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-queue" data-tooltip="Underwriting application queue">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
        Underwriting Queue
      </button>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-risk" data-tooltip="Risk assessment & exposure analysis">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
        Risk Assessment
      </button>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-review" data-tooltip="Policy coverage & exclusion review">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
        Policy Review
      </button>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-ai" id="sidebar-underwriter-ai-btn" data-tooltip="Underwriter AI for risk guidance">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        AI Assistant
      </button>
      <button className="nav-item" data-role="underwriter" data-page="underwriter-profile" data-tooltip="Underwriter credentials and settings">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
        Profile &amp; Settings
      </button>
    </div>
    <div className="nav-role-section" data-role="admin">
      <div className="nav-section-title">
        <span>Admin</span>
        <span style={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)'}}>Platform Governance</span>
      </div>
      <button className="nav-item" data-role="admin" data-page="admin-dashboard" data-tooltip="System metrics and enterprise overview">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
        Dashboard
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-users" data-tooltip="Manage system users & accounts">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        User Management
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-roles" data-tooltip="RBAC permissions and role governance">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
        Role Management
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-policies" data-tooltip="System-wide insurance policy ledger">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        Policy Management
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-audit" data-tooltip="Audit logs and system activity monitoring">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg>
        Audit &amp; Monitoring
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-ai" id="sidebar-admin-ai-btn" data-tooltip="Admin AI for platform queries & metrics">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        AI Assistant
      </button>
      <button className="nav-item" data-role="admin" data-page="admin-profile" data-tooltip="Administrator settings and security controls">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
        Profile &amp; Settings
      </button>
    </div>
  </nav>
  <div className="sidebar-footer">
    <span>© 2026 InsureAssist</span>
    <span className="sidebar-footer-badge">v1.0 POC</span>
  </div>
</aside>
  );
}
