export default function CustomerAi() {
  return (
<section id="page-customer-ai" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">AI Insurance Assistant</h2>
      <p className="page-subtitle">Interactive plain-language guidance on your policy coverages, deductibles, and renewals.</p>
    </div>
    <div className="portal-tag" style={{background: 'var(--blue-50)', borderColor: 'var(--blue-100)', color: 'var(--blue-800)'}}>
      <span className="portal-dot" style={{background: 'var(--blue-600)'}} />
      Policy Assistant Active
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
        <input type="text" id="customer-chat-search-input" placeholder="Search conversations..." />
      </div>
      <div className="chat-history-action">
        <button className="btn btn-primary btn-block btn-sm" id="customer-new-chat-btn">
          New Conversation
        </button>
      </div>
      <div className="chat-history-list" id="customer-chat-history-list">
      </div>
    </div>
    <div className="chat-main">
      <div className="chat-main-header">
        <div>
          <div className="chat-main-title" id="customer-chat-current-title">AI Insurance Assistant</div>
          <div className="chat-main-subtitle">Your insurance policy assistant</div>
        </div>
      </div>
      <div className="chat-messages" id="customer-chat-messages-container">
      </div>
      <div className="chat-suggestions">
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('What does my policy cover?')")}>What does my policy cover?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('When is my renewal?')")}>When is my renewal?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('What is my deductible?')")}>What is my deductible?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('What are my exclusions?')")}>What are my exclusions?</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('Compare my policies')")}>Compare my policies</button>
        <button className="chat-suggestion-chip" onClick={(event) => window.__iaCall(event, "handleCustomerPagePrompt('What does liability coverage mean?')")}>What does liability coverage mean?</button>
      </div>
      <div className="chat-input-area">
        <input type="text" id="customer-page-chat-input" placeholder="Ask anything about your insurance..." />
        <button className="btn btn-primary" id="customer-page-chat-send-btn">
          <span>Send</span>
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{marginLeft: 4}}><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
