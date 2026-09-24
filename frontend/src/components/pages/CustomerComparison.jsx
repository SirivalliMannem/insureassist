export default function CustomerComparison() {
  return (
<section id="page-customer-comparison" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Policy Comparison</h2>
      <p className="page-subtitle">Compare two policies side-by-side to identify coverage gaps and deductible differences.</p>
    </div>
  </div>
  <div className="compare-selectors">
    <div className="form-group">
      <label>Select Policy A</label>
      <select id="compare-select-a" className="input-select" />
    </div>
    <div className="form-group">
      <label>Select Policy B</label>
      <select id="compare-select-b" className="input-select" />
    </div>
  </div>
  <div className="card" style={{overflowX: 'auto', marginBottom: '1.5rem'}}>
    <table className="compare-table">
      <thead>
        <tr>
          <th style={{width: '28%'}}>Feature</th>
          <th id="compare-name-a" style={{width: '36%'}}>Policy A</th>
          <th id="compare-name-b" style={{width: '36%'}}>Policy B</th>
        </tr>
      </thead>
      <tbody id="compare-table-body" />
    </table>
  </div>
  <div className="ai-recommendation">
    <h4>
      <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
      Comparison Summary
    </h4>
    <p id="compare-summary-text">Select two policies above to view a comparison summary.</p>
  </div>
</section>
  );
}
