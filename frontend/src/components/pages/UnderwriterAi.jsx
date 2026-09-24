export default function UnderwriterAi() {
  return (
<section id="page-underwriter-ai" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Underwriting Risk Assistant</h2>
      <p className="page-subtitle">Intelligent decision guidance, hazard scoring models, loss run analysis, and guideline consultation.</p>
    </div>
    <div className="portal-tag" style={{background: '#FAF6F2', borderColor: '#EADBCE', color: '#3B241D'}}>
      <span className="portal-dot" style={{background: '#8C5343'}} />
      Risk Decision AI Active
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
        <button className="btn btn-primary btn-block btn-sm" id="underwriter-new-chat-btn">
          New Conversation
        </button>
      </div>
      <div className="chat-history-list" id="underwriter-chat-history-list">
      </div>
    </div>
    <div className="chat-main">
      <div className="chat-main-header">
        <div>
          <div className="chat-main-title" id="underwriter-chat-current-title">Underwriting Risk Assistant</div>
          <div className="chat-main-subtitle">Underwriting guidelines &amp; risk analysis</div>
        </div>
      </div>
      <div className="chat-messages" id="underwriter-chat-messages-container">
      </div>
      <div className="chat-suggestions">
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'What are the Tier 3 property exposure guidelines?')")}>What are the Tier 3 property exposure guidelines?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Review risk score factors for APP-8802')")}>Review risk score factors for APP-8802</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Explain deductible requirements for coastal properties')")}>Explain deductible requirements for coastal properties</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'Summarize pending queue high-risk applications')")}>Summarize pending queue high-risk applications</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleRoleChatPrompt('underwriter', 'What is the loss ratio threshold for commercial auto?')")}>What is the loss ratio threshold for commercial auto?</button>
      </div>
      <div className="chat-input-area">
        <input type="text" id="underwriter-page-chat-input" placeholder="Ask anything about underwriting guidelines or queue cases..." />
        <button className="btn btn-primary" id="underwriter-page-chat-send-btn">
          <span>Send</span>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{marginLeft: 4}}><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
