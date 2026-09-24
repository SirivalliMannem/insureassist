export default function SlidePanel() {
  return (
<div className="slide-panel" id="slide-panel" aria-hidden="true">
  <div className="panel-header">
    <div style={{display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1}}>
      <button className="panel-back-btn" id="panel-back-btn" aria-label="Go back" data-tooltip="Back" style={{display: 'none'}} onClick={(event) => window.__iaCall(event, "slidePanelGoBack()")}>
        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={19} y1={12} x2={5} y2={12} /><polyline points="12 19 5 12 12 5" /></svg>
      </button>
      <div className="panel-title-group" style={{minWidth: 0, flex: 1}}>
        <h3 className="panel-title" id="panel-title">Panel Details</h3>
        <span className="panel-subtitle" id="panel-subtitle">InsureAssist Information</span>
      </div>
    </div>
    <button className="panel-close-btn" id="panel-close-btn" aria-label="Close panel" data-tooltip="Close Panel">
      <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
    </button>
  </div>
  <div className="panel-body" id="panel-body">
  </div>
  <div className="panel-footer" id="panel-footer">
    <button className="btn btn-primary btn-sm" id="panel-single-close-btn">Close Panel</button>
  </div>
</div>
  );
}
