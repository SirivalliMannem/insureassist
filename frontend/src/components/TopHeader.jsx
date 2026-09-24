export default function TopHeader() {
  return (
<header className="top-header">
  <div className="header-left">
    <button className="menu-toggle" id="menu-toggle" aria-label="Toggle sidebar">
      <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={18} x2={21} y2={18} /></svg>
    </button>
    <div className="portal-tag" id="header-portal-tag">
      <span className="portal-dot" />
      <span id="header-portal-name">Customer Portal Active</span>
    </div>
  </div>
  <div className="header-right">
    <button className="btn-header-icon" id="theme-toggle-btn" onClick={(event) => window.__iaCall(event, "toggleTheme()")} data-tooltip="Switch light/dark theme" aria-label="Switch light/dark theme">
      <span id="theme-toggle-icon">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      </span>
    </button>
    <div className="notification-popover-wrapper" id="header-notification-wrapper">
      <button className="btn-header-icon" id="header-notification-btn" onClick={(event) => window.__iaCall(event, "toggleNotificationPopover(event)")} data-tooltip="Notifications" aria-label="Notifications">
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="notification-badge-dot" id="header-notification-dot" style={{display: 'none'}} />
      </button>
      <div className="notification-dropdown" id="header-notification-dropdown" aria-hidden="true">
        <div className="notification-header">
          <div className="notification-title" id="notif-dropdown-title">Notifications</div>
          <button className="btn btn-outline btn-sm" style={{padding: '2px 8px', fontSize: '0.75rem'}} onClick={(event) => window.__iaCall(event, "markAllNotificationsRead(event)")}>Mark all read</button>
        </div>
        <div className="notification-list" id="header-notification-list">
          <div style={{padding: '2rem 1rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem'}}>
            No new notifications.
          </div>
        </div>
      </div>
    </div>
    <div className="header-user-profile">
      <div className="user-avatar-badge" id="user-avatar">SM</div>
      <span className="header-user-name" id="user-name">User</span>
    </div>
    <button className="btn btn-outline btn-sm" id="logout-btn" data-tooltip="Sign out of InsureAssist">
      <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1={21} y1={12} x2={9} y2={12} /></svg>
      Sign out
    </button>
  </div>
</header>
  );
}
