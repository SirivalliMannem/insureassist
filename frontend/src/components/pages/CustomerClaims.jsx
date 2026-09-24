export default function CustomerClaims() {
  return (
<section id="page-customer-claims" className="page">
  <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem'}}>
    <div>
      <h2 className="page-title" style={{margin: '0 0 4px'}}>My Claims</h2>
      <p className="page-subtitle">Track status, review AI triage summaries, and monitor resolution timelines for your claims.</p>
    </div>
    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
      <button className="btn btn-primary btn-sm" onClick={(event) => window.__iaCall(event, "navigateTo('customer-claim')")} style={{padding: '8px 16px', fontWeight: 600}}>
        Report a Claim
      </button>
    </div>
  </div>
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem'}} id="customer-claims-metrics">
    <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: 6}}>Total Claims</div>
      <div style={{fontSize: '1.85rem', fontWeight: 800, color: 'var(--cust-brown-900)', lineHeight: '1.2'}} id="metric-claims-total">3</div>
      <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4}}>Across all active policies</div>
    </div>
    <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: 6}}>Open Claims</div>
      <div style={{fontSize: '1.85rem', fontWeight: 800, color: 'var(--cust-brown-900)', lineHeight: '1.2'}} id="metric-claims-open">2</div>
      <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4}}>Active adjusting &amp; intake</div>
    </div>
    <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: 6}}>In Review</div>
      <div style={{fontSize: '1.85rem', fontWeight: 800, color: 'var(--cust-brown-900)', lineHeight: '1.2'}} id="metric-claims-review">1</div>
      <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4}}>Under AI &amp; desk review</div>
    </div>
    <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: 6}}>Closed / Settled</div>
      <div style={{fontSize: '1.85rem', fontWeight: 800, color: 'var(--cust-brown-900)', lineHeight: '1.2'}} id="metric-claims-closed">1</div>
      <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4}}>Payment finalized &amp; closed</div>
    </div>
  </div>
  <div style={{background: 'var(--white)', border: '1px solid var(--cust-cream-border)', borderRadius: 12, padding: '1.1rem 1.35rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
      <button type="button" className="btn btn-sm customer-claims-filter-btn active" onClick={(event) => window.__iaCall(event, "filterCustomerClaims('all', this)")} style={{borderRadius: 20, padding: '6px 16px', fontSize: '0.825rem', background: 'var(--cust-brown-700)', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>All Claims</button>
      <button type="button" className="btn btn-outline btn-sm customer-claims-filter-btn" onClick={(event) => window.__iaCall(event, "filterCustomerClaims('review', this)")} style={{borderRadius: 20, padding: '6px 16px', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer'}}>In Review</button>
      <button type="button" className="btn btn-outline btn-sm customer-claims-filter-btn" onClick={(event) => window.__iaCall(event, "filterCustomerClaims('closed', this)")} style={{borderRadius: 20, padding: '6px 16px', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer'}}>Closed</button>
    </div>
    <div style={{position: 'relative', flex: 1, maxWidth: 380, minWidth: 280}} className="claims-search-wrapper">
      <svg width={16} height={16} fill="none" stroke="var(--cust-brown-700)" strokeWidth={2} viewBox="0 0 24 24" style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: '0.75'}}><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
      <input type="text" id="customer-claims-search" className="form-control" placeholder="Search by Claim ID, Policy, or Type" onInput={(event) => window.__iaCall(event, "searchCustomerClaims(this.value)")} style={{padding: '9px 14px 9px 38px', fontSize: '0.825rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)', background: 'var(--white)', width: '100%', boxSizing: 'border-box', color: 'var(--cust-brown-900)'}} />
    </div>
  </div>
  <div id="customer-claims-list-container" style={{marginBottom: '1.5rem', width: '100%'}} />
  <div id="customer-claim-details-modal" style={{display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.55)', zIndex: 9999, overflowY: 'auto', padding: '2rem 1rem', boxSizing: 'border-box'}}>
    <div style={{background: 'var(--white)', maxWidth: 960, margin: '0 auto', borderRadius: 14, border: '1px solid var(--cust-cream-border)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)', overflow: 'hidden', position: 'relative'}} id="customer-claim-details-content">
    </div>
  </div>
</section>
  );
}
