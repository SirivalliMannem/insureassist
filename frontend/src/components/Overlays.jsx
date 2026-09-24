export default function Overlays() {
  return (
<>
<div className="uw-modal-backdrop" id="uw-decision-modal" onClick={(event) => window.__iaCall(event, "closeUwModalOnBackdrop(event, 'uw-decision-modal')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")}>
    <div className="uw-modal-header">
      <div>
        <h3 className="card-title" id="uw-modal-decision-title" style={{margin: 0, fontSize: '1.25rem'}}>Confirm Underwriting Decision</h3>
        <div className="card-subtitle" id="uw-modal-decision-sub" style={{marginTop: 2}}>Authorization &amp; binding verification</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeUwModal('uw-decision-modal')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body">
      <div style={{background: '#FAF6F2', border: '1px solid #EADBCE', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: 'var(--gray-600)', fontSize: '0.8rem'}}>Target Policy / Case:</span><strong id="uw-modal-pol-id" style={{fontFamily: 'monospace', color: 'var(--blue-900)'}}>POL-2024-1001</strong></div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: 'var(--gray-600)', fontSize: '0.8rem'}}>Applicant / Insured:</span><strong id="uw-modal-insured-name">Michael Brown</strong></div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: 'var(--gray-600)', fontSize: '0.8rem'}}>Selected Action:</span><span id="uw-modal-action-badge" className="badge badge-active">Approve &amp; Bind</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: 'var(--gray-600)', fontSize: '0.8rem'}}>Authorized Underwriter:</span><strong>Alex Vance, Senior CPCU</strong></div>
      </div>
      <div>
        <label htmlFor="uw-modal-notes" style={{display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--blue-900)', marginBottom: '0.35rem'}}>Underwriter Review Notes &amp; Endorsement Conditions:</label>
        <textarea id="uw-modal-notes" className="input-select" rows={3} style={{width: '100%', resize: 'vertical', fontSize: '0.85rem', padding: '0.75rem', borderRadius: 10, lineHeight: '1.4'}} placeholder="Enter binding conditions, deductible riders, or notes for the customer/broker..." defaultValue={""} />
      </div>
      <div style={{fontSize: '0.775rem', color: 'var(--gray-600)', background: '#FFF9F6', borderLeft: '3px solid #C97963', padding: '8px 12px', borderRadius: '0 8px 8px 0'}}>
        <strong>Binding Authority Notice:</strong> Submitting will commit this decision to the live Underwriter microservice database, update policy term records, and dispatch a real-time notification to the broker.
      </div>
    </div>
    <div className="uw-modal-footer">
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeUwModal('uw-decision-modal')")}>Cancel</button>
      <button className="btn btn-primary btn-sm" id="uw-modal-confirm-btn" onClick={(event) => window.__iaCall(event, "confirmUnderwritingDecision()")}>Confirm &amp; Commit Decision →</button>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="uw-risk-rule-modal" onClick={(event) => window.__iaCall(event, "closeUwModalOnBackdrop(event, 'uw-risk-rule-modal')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")}>
    <div className="uw-modal-header">
      <div>
        <h3 className="card-title" id="uw-rule-modal-title" style={{margin: 0, fontSize: '1.25rem'}}>Underwriting Guideline Rule</h3>
        <div className="card-subtitle" id="uw-rule-modal-sub" style={{marginTop: 2}}>Actuarial rule definitions &amp; binding authority limits</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeUwModal('uw-risk-rule-modal')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" id="uw-rule-modal-body">
    </div>
    <div className="uw-modal-footer">
      <button className="btn btn-primary btn-sm" onClick={(event) => window.__iaCall(event, "closeUwModal('uw-risk-rule-modal')")}>Close Rule Details</button>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="modal-policy-details" onClick={(event) => window.__iaCall(event, "closePolicyAppModal(event, 'modal-policy-details')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")} style={{maxWidth: 760, maxHeight: '85vh', overflowY: 'auto'}}>
    <div className="uw-modal-header" style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: '1rem'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div id="modal-policy-icon-box" style={{width: 40, height: 40, borderRadius: 8, background: 'var(--cust-brown-100)', color: 'var(--cust-brown-800)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <div>
          <h3 className="card-title" id="modal-policy-title" style={{margin: 0, fontSize: '1.25rem', fontFamily: '"Playfair Display",Georgia,serif', color: 'var(--cust-brown-900)'}}>Homeowners Premier Protection</h3>
          <div className="card-subtitle" id="modal-policy-subtitle" style={{marginTop: 2, fontSize: '0.8rem', color: 'var(--gray-600)'}}>Product Overview &amp; Terms Guide</div>
        </div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeModalById('modal-policy-details')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" id="modal-policy-details-body" style={{padding: '1.25rem 0'}}>
    </div>
    <div className="uw-modal-footer" style={{borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between'}}>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeModalById('modal-policy-details')")}>Close Guide</button>
      <button className="btn btn-primary btn-sm" id="modal-policy-apply-btn" onClick={(event) => window.__iaCall(event, "applyFromPolicyModal()")}>Apply For This Policy →</button>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="modal-application-details" onClick={(event) => window.__iaCall(event, "closePolicyAppModal(event, 'modal-application-details')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")} style={{maxWidth: 760, maxHeight: '85vh', overflowY: 'auto'}}>
    <div className="uw-modal-header" style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: '1rem'}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <h3 className="card-title" id="modal-app-record-id" style={{margin: 0, fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--cust-brown-900)'}}>APP-2026-10482</h3>
          <span className="badge" id="modal-app-record-status-badge" style={{background: '#ECFDF5', color: '#065F46'}}>Submitted</span>
        </div>
        <div className="card-subtitle" id="modal-app-record-product" style={{marginTop: 2, fontSize: '0.825rem', color: 'var(--gray-600)'}}>Homeowners Premier Protection (HO-3)</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeModalById('modal-application-details')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" id="modal-app-record-body" style={{padding: '1.25rem 0'}}>
    </div>
    <div className="uw-modal-footer" style={{borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeModalById('modal-application-details')")}>Close</button>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="modal-agent-app-review" onClick={(event) => window.__iaCall(event, "closePolicyAppModal(event, 'modal-agent-app-review')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")} style={{maxWidth: 820, maxHeight: '88vh', overflowY: 'auto'}}>
    <div className="uw-modal-header" style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <h3 className="card-title" id="agent-review-modal-id" style={{margin: 0, fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--cust-brown-900)'}}>APP-2026-10482</h3>
          <span className="badge" id="agent-review-modal-status-badge" style={{background: '#FFFBEB', color: '#92400E', fontSize: '0.78rem'}}>Pending Verification</span>
        </div>
        <div className="card-subtitle" id="agent-review-modal-product" style={{marginTop: 2, fontSize: '0.875rem', color: 'var(--gray-700)'}}>Homeowners Premier Protection (HO-3)</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeModalById('modal-agent-app-review')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" id="agent-review-modal-body" style={{padding: '1.25rem 0'}}>
    </div>
    <div className="uw-modal-footer" id="agent-review-modal-footer" style={{borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
      <div>
        <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeModalById('modal-agent-app-review')")}>Close</button>
      </div>
      <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
        <button className="btn btn-outline btn-sm" id="btn-agent-request-info" onClick={(event) => window.__iaCall(event, "openAgentRequestMoreInfoModal()")} style={{color: '#B45309', borderColor: '#FDE68A', background: '#FFFDF7', fontWeight: 600}}>
          Request More Information
        </button>
        <button className="btn btn-primary btn-sm" id="btn-agent-forward-uw" onClick={(event) => window.__iaCall(event, "submitForwardToUnderwriter()")} style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700}}>
          <span>Forward to Underwriter →</span>
        </button>
      </div>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="modal-agent-request-more-info" onClick={(event) => window.__iaCall(event, "closePolicyAppModal(event, 'modal-agent-request-more-info')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")} style={{maxWidth: 560}}>
    <div className="uw-modal-header" style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: '1rem'}}>
      <div>
        <h3 className="card-title" style={{margin: 0, fontSize: '1.15rem', color: 'var(--cust-brown-900)'}}>Request More Information</h3>
        <div className="card-subtitle" id="agent-req-info-sub" style={{marginTop: 2, fontSize: '0.8rem', color: 'var(--gray-600)'}}>Specify what documentation or details the customer must provide.</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeModalById('modal-agent-request-more-info')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" style={{padding: '1.25rem 0'}}>
      <label htmlFor="agent-req-notes-input" style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 6}}>
        Required Information / Missing Documents:
      </label>
      <textarea id="agent-req-notes-input" className="form-control" rows={4} placeholder="e.g. Please upload a certified property inspection report and updated utility proof." style={{width: '100%', boxSizing: 'border-box', padding: 10, fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)', color: 'var(--cust-brown-900)', resize: 'vertical'}} defaultValue={""} />
    </div>
    <div className="uw-modal-footer" style={{borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: 10}}>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeModalById('modal-agent-request-more-info')")}>Cancel</button>
      <button className="btn btn-primary btn-sm" id="btn-submit-agent-req-info" onClick={(event) => window.__iaCall(event, "submitAgentRequestMoreInfo()")} style={{fontWeight: 700}}>
        Submit Request to Customer
      </button>
    </div>
  </div>
</div>
<div className="uw-modal-backdrop" id="modal-customer-provide-info" onClick={(event) => window.__iaCall(event, "closePolicyAppModal(event, 'modal-customer-provide-info')")}>
  <div className="uw-modal-box" onClick={(event) => window.__iaCall(event, "event.stopPropagation()")} style={{maxWidth: 600}}>
    <div className="uw-modal-header" style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: '1rem'}}>
      <div>
        <h3 className="card-title" style={{margin: 0, fontSize: '1.15rem', color: 'var(--cust-brown-900)'}}>Provide Requested Information</h3>
        <div className="card-subtitle" id="cust-provide-info-sub" style={{marginTop: 2, fontSize: '0.8rem', color: 'var(--gray-600)'}}>Upload the requested documents or provide notes to resume Agent Review.</div>
      </div>
      <button className="panel-close-btn" onClick={(event) => window.__iaCall(event, "closeModalById('modal-customer-provide-info')")} aria-label="Close modal">✕</button>
    </div>
    <div className="uw-modal-body" style={{padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: 14}}>
      <div id="cust-provide-agent-note-banner" style={{background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', fontSize: '0.825rem', color: '#92400E'}}>
        <strong>Agent Note:</strong> <span id="cust-provide-agent-note-text" />
      </div>
      <div>
        <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 6}}>
          Additional Notes / Details:
        </label>
        <textarea id="cust-provide-notes-input" className="form-control" rows={3} placeholder="Explain the attached documents or answer the agent's questions..." style={{width: '100%', boxSizing: 'border-box', padding: 10, fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)', color: 'var(--cust-brown-900)', resize: 'vertical'}} defaultValue={""} />
      </div>
      <div>
        <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 6}}>
          Attach Additional Document (Optional):
        </label>
        <div style={{display: 'flex', gap: 8}}>
          <input type="text" id="cust-provide-doc-type" className="form-control" placeholder="Document Name/Type (e.g. Roof Inspection)" style={{flex: 1, padding: '8px 12px', fontSize: '0.825rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)'}} />
          <input type="text" id="cust-provide-doc-filename" className="form-control" placeholder="File name (e.g. roof_cert.pdf)" style={{flex: 1, padding: '8px 12px', fontSize: '0.825rem', borderRadius: 8, border: '1px solid var(--cust-cream-border)'}} />
        </div>
      </div>
    </div>
    <div className="uw-modal-footer" style={{borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: 10}}>
      <button className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "closeModalById('modal-customer-provide-info')")}>Cancel</button>
      <button className="btn btn-primary btn-sm" id="btn-submit-cust-provide-info" onClick={(event) => window.__iaCall(event, "submitCustomerProvideInfo()")} style={{fontWeight: 700}}>
        Upload &amp; Return to Agent Review
      </button>
    </div>
  </div>
</div>
<div className="toast-container" id="toast-container" />
<div id="global-tooltip" role="tooltip" aria-hidden="true">
  <div id="global-tooltip-text" />
  <div id="global-tooltip-arrow" />
</div>
</>
  );
}
