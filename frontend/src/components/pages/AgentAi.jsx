export default function AgentAi() {
  return (
<section id="page-agent-ai" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Agent AI Assistant</h2>
      <p className="page-subtitle">Interactive intelligence on your assigned client portfolio, policy coverages, and upcoming renewals.</p>
    </div>
    <div className="portal-tag" style={{background: '#FAF6F2', borderColor: '#EADBCE', color: '#3B241D'}}>
      <span className="portal-dot" style={{background: '#7A4A3A'}} />
      Client Advisory AI Active
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
        <input type="text" id="agent-chat-search-input" placeholder="Search conversations..." />
      </div>
      <div className="chat-history-action">
        <button className="btn btn-primary btn-block btn-sm" id="agent-new-chat-btn">
          New Conversation
        </button>
      </div>
      <div className="chat-history-list" id="agent-chat-history-list">
      </div>
    </div>
    <div className="chat-main">
      <div className="chat-main-header">
        <div>
          <div className="chat-main-title" id="agent-chat-current-title">Agent AI Assistant</div>
          <div className="chat-main-subtitle">Assigned customer &amp; policy advisory</div>
        </div>
      </div>
      <div className="chat-messages" id="agent-chat-messages-container">
      </div>
      <div className="chat-suggestions">
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('agent', 'Which clients have renewals in the next 30 days?')")}>Which clients have renewals in the next 30 days?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('agent', 'Summarize Sarah Mitchell\\'s active policies')")}>Summarize Sarah Mitchell's active policies</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('agent', 'What is my total commercial book value?')")}>What is my total commercial book value?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('agent', 'Identify cross-sell opportunities for auto policyholders')")}>Identify cross-sell opportunities for auto policyholders</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('agent', 'Show coverage limits for Emily Johnson\\'s commercial policy')")}>Show coverage limits for Emily Johnson's commercial policy</button>
      </div>
      <div className="chat-input-area">
        <input type="text" id="agent-page-chat-input" placeholder="Ask anything about your assigned client book..." />
        <button className="btn btn-primary" id="agent-page-chat-send-btn">
          <span>Send</span>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{marginLeft: 4}}><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
