export default function UnderwriterAi() {
  return (
<section id="page-underwriter-ai" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Underwriting Decision Support Assistant</h2>
      <p className="page-subtitle">Review applications, risk information, policy coverage, claims, documents, and underwriting requirements.</p>
    </div>
    <div className="portal-tag" style={{background: '#FAF6F2', borderColor: '#EADBCE', color: '#3B241D'}}>
      <span className="portal-dot" style={{background: '#8C5343'}} />
      Underwriter Decision Support Active
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
        <input type="text" id="underwriter-chat-search-input" placeholder="Search conversations..." />
      </div>
      <div className="chat-history-action">
        <button className="btn btn-primary btn-block btn-sm" id="underwriter-new-chat-btn" onClick={(event) => window.__iaCall(event, "startNewRoleChat('underwriter')")}>
          New Conversation
        </button>
      </div>
      <div className="chat-history-list" id="underwriter-chat-history-list">
      </div>
    </div>
    <div className="chat-main">
      <div className="chat-main-header">
        <div>
          <div className="chat-main-title" id="underwriter-chat-current-title">Underwriting AI Assistant</div>
          <div className="chat-main-subtitle">Decision support, risk assessment, and queue review</div>
        </div>
      </div>
      <div className="chat-messages" id="underwriter-chat-messages-container">
      </div>
      <div className="chat-suggestions">
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Show applications awaiting my review')")}>Show applications awaiting my review</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Summarize my pending applications')")}>Summarize my pending applications</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'What information is missing?')")}>What information is missing?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Review this application')")}>Review this application</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Show relevant claims')")}>Show relevant claims</button>
      </div>
      <div className="chat-input-area">
        <input type="text" id="underwriter-page-chat-input" placeholder="Ask anything about applications, risk factors, or queue requirements..." />
        <button className="btn btn-primary" id="underwriter-page-chat-send-btn" onClick={(event) => window.__iaCall(event, "sendRoleChatMessage('underwriter')")}>
          <span>Send</span>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{marginLeft: 4}}><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
