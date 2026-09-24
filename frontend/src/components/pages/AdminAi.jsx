export default function AdminAi() {
  return (
<section id="page-admin-ai" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Enterprise Governance Assistant</h2>
      <p className="page-subtitle">Platform intelligence, user identity governance, RBAC privilege audits, and system metrics.</p>
    </div>
    <div className="portal-tag" style={{background: '#0f172a', color: '#ffffff', borderColor: '#0f172a'}}>
      <span className="portal-dot" style={{background: '#22c55e'}} />
      Governance AI Active
    </div>
  </div>
  <div className="chat-layout">
    <div className="chat-history-panel">
      <div className="chat-history-header">
        <h4>
          <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg>
          Chat History
        </h4>
      </div>
      <div className="chat-history-search">
        <input type="text" id="admin-chat-search-input" placeholder="Search conversations..." />
      </div>
      <div className="chat-history-action">
        <button className="btn btn-primary btn-block btn-sm" id="admin-new-chat-btn">
          New Conversation
        </button>
      </div>
      <div className="chat-history-list" id="admin-chat-history-list">
      </div>
    </div>
    <div className="chat-main">
      <div className="chat-main-header">
        <div>
          <div className="chat-main-title" id="admin-chat-current-title">Enterprise Governance Assistant</div>
          <div className="chat-main-subtitle">Enterprise platform &amp; security intelligence</div>
        </div>
      </div>
      <div className="chat-messages" id="admin-chat-messages-container">
      </div>
      <div className="chat-suggestions">
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('admin', 'How many users are currently in Pending status?')")}>How many users are currently in Pending status?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('admin', 'Summarize enterprise policy count by category')")}>Summarize enterprise policy count by category</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('admin', 'Show recent administrator privilege changes')")}>Show recent administrator privilege changes</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('admin', 'What are the RBAC permissions for Underwriters?')")}>What are the RBAC permissions for Underwriters?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('admin', 'Check audit log for failed login attempts')")}>Check audit log for failed login attempts</button>
      </div>
      <div className="chat-input-area">
        <input type="text" id="admin-page-chat-input" placeholder="Ask anything about enterprise users, policies, or system security..." />
        <button className="btn btn-primary" id="admin-page-chat-send-btn">
          <span>Send</span>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{marginLeft: 4}}><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
