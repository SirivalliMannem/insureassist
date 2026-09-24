export default function UnderwriterRisk() {
  return (
<section id="page-underwriter-risk" className="page">
  <div className="page-header" style={{marginBottom: '1.15rem'}}>
    <div>
      <h2 className="page-title">Risk Assessment Guidelines</h2>
      <p className="page-subtitle">Underwriting exposure tiers, assessment workflow, and decision criteria.</p>
    </div>
    <div className="portal-tag" style={{background: '#FAF6F2', borderColor: '#EADBCE', color: '#3B241D'}}>
      <span className="portal-dot" style={{background: '#8C5343'}} />
      Guidelines Active
    </div>
  </div>
  <div className="card" style={{marginBottom: '1.15rem', padding: '1.15rem 1.25rem'}}>
    <div className="card-header" style={{marginBottom: '0.75rem'}}>
      <div>
        <h3 className="card-title" style={{fontSize: '1rem', margin: 0}}>Risk Score Tiers</h3>
      </div>
    </div>
    <div className="grid grid-3 uw-risk-cards-grid" style={{alignItems: 'stretch', gap: 12}}>
      <div id="risk-card-low" className="card risk-tier-card interactive-risk-card" onClick={(event) => window.__iaCall(event, "toggleRiskTierCard('low')")} style={{borderTop: '4px solid var(--green)', padding: '1.1rem 1.15rem'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--green)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
            Low Risk
          </h4>
          <span className="badge badge-risk-low" style={{fontSize: '0.725rem', fontWeight: 700, padding: '2px 7px'}}>Score: 0–25</span>
        </div>
        <ul className="uw-risk-tier-bullets">
          <li>Fewer risk concerns are identified.</li>
          <li>Required documents are generally complete.</li>
          <li>No major issues are found during the initial review.</li>
          <li>Standard underwriting checks should be performed.</li>
          <li>Normal underwriting approval may be sufficient.</li>
        </ul>
      </div>
      <div id="risk-card-medium" className="card risk-tier-card interactive-risk-card" onClick={(event) => window.__iaCall(event, "toggleRiskTierCard('medium')")} style={{borderTop: '4px solid var(--amber)', padding: '1.1rem 1.15rem'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--amber)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2="12.01" y2={16} /></svg>
            Medium Risk
          </h4>
          <span className="badge badge-risk-medium" style={{fontSize: '0.725rem', fontWeight: 700, padding: '2px 7px'}}>Score: 26–65</span>
        </div>
        <ul className="uw-risk-tier-bullets">
          <li>Some additional risk concerns may exist.</li>
          <li>Supporting documents may need further verification.</li>
          <li>Certain policy details may require clarification.</li>
          <li>Additional review or evidence may be necessary.</li>
          <li>Approval may depend on resolving the identified concerns.</li>
        </ul>
      </div>
      <div id="risk-card-high" className="card risk-tier-card interactive-risk-card" onClick={(event) => window.__iaCall(event, "toggleRiskTierCard('high')")} style={{borderTop: '4px solid var(--red)', padding: '1.1rem 1.15rem'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--red)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2="12.01" y2={16} /></svg>
            High Risk
          </h4>
          <span className="badge badge-risk-high" style={{fontSize: '0.725rem', fontWeight: 700, padding: '2px 7px'}}>Score: 66–100</span>
        </div>
        <ul className="uw-risk-tier-bullets">
          <li>Higher risk concerns are present.</li>
          <li>Important documents or information may require detailed verification.</li>
          <li>Multiple risk factors may affect the application.</li>
          <li>Senior underwriting review may be required.</li>
          <li>Additional verification or special approval may be necessary.</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="card" style={{marginBottom: '1.15rem', padding: '1.15rem 1.25rem'}}>
    <div className="card-header" style={{marginBottom: '0.75rem'}}>
      <div>
        <h3 className="card-title" style={{fontSize: '1rem', margin: 0}}>Underwriter Assessment Guide</h3>
      </div>
    </div>
    <div className="uw-guide-flow-grid">
      <div id="guide-step-card-1" className="uw-guide-flow-card interactive-step-card" onClick={(event) => window.__iaCall(event, "toggleGuideStepDetail(1)")}>
        <div className="uw-guide-flow-header">
          <div className="uw-guide-flow-num">1</div>
          <div className="uw-step-icon">
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /></svg>
          </div>
          <div className="uw-guide-flow-arrow">→</div>
        </div>
        <h4 className="uw-guide-flow-title">Check Documents</h4>
        <p className="uw-guide-flow-text">Verify that all required documents are available and complete.</p>
      </div>
      <div id="guide-step-card-2" className="uw-guide-flow-card interactive-step-card" onClick={(event) => window.__iaCall(event, "toggleGuideStepDetail(2)")}>
        <div className="uw-guide-flow-header">
          <div className="uw-guide-flow-num">2</div>
          <div className="uw-step-icon">
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2="12.01" y2={17} /></svg>
          </div>
          <div className="uw-guide-flow-arrow">→</div>
        </div>
        <h4 className="uw-guide-flow-title">Review Risk Factors</h4>
        <p className="uw-guide-flow-text">Review claims history, property details, location, and coverage information.</p>
      </div>
      <div id="guide-step-card-3" className="uw-guide-flow-card interactive-step-card" onClick={(event) => window.__iaCall(event, "toggleGuideStepDetail(3)")}>
        <div className="uw-guide-flow-header">
          <div className="uw-guide-flow-num">3</div>
          <div className="uw-step-icon">
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div className="uw-guide-flow-arrow">→</div>
        </div>
        <h4 className="uw-guide-flow-title">Understand Risk Score</h4>
        <p className="uw-guide-flow-text">Check the calculated score and the main factors affecting it.</p>
      </div>
      <div id="guide-step-card-4" className="uw-guide-flow-card interactive-step-card" onClick={(event) => window.__iaCall(event, "toggleGuideStepDetail(4)")}>
        <div className="uw-guide-flow-header">
          <div className="uw-guide-flow-num">4</div>
          <div className="uw-step-icon">
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </div>
        </div>
        <h4 className="uw-guide-flow-title">Decide Next Step</h4>
        <p className="uw-guide-flow-text">Approve, request more information, reject, or send for senior review.</p>
      </div>
    </div>
    <div id="uw-guide-step-detail-panel" className="uw-expandable-panel" style={{display: 'none', marginTop: '1rem'}}>
    </div>
  </div>
  <div className="card" style={{padding: '1.15rem 1.25rem'}}>
    <div className="card-header" style={{marginBottom: '0.75rem'}}>
      <div>
        <h3 className="card-title" style={{fontSize: '1rem', margin: 0}}>Decision Support</h3>
      </div>
    </div>
    <div className="grid grid-3 uw-decision-cards-grid" style={{alignItems: 'stretch', gap: 12}}>
      <div id="decision-card-ready" className="card interactive-decision-card" onClick={(event) => window.__iaCall(event, "toggleDecisionSupportDetail('ready')")} style={{borderLeft: '4px solid var(--green)', padding: '1.1rem 1.15rem', background: '#FAF6F2'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--green)', fontSize: '0.925rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            Ready for Approval
          </h4>
          <span className="badge badge-active" style={{fontSize: '0.7rem', padding: '2px 6px'}}>Approval</span>
        </div>
        <ul className="uw-decision-card-list">
          <li>Documents are complete.</li>
          <li>Risk factors have been reviewed.</li>
          <li>No major concerns remain.</li>
        </ul>
      </div>
      <div id="decision-card-info" className="card interactive-decision-card" onClick={(event) => window.__iaCall(event, "toggleDecisionSupportDetail('info')")} style={{borderLeft: '4px solid var(--amber)', padding: '1.1rem 1.15rem', background: '#FAF6F2'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--amber)', fontSize: '0.925rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2="12.01" y2={16} /></svg>
            More Information Required
          </h4>
          <span className="badge badge-pending" style={{fontSize: '0.7rem', padding: '2px 6px'}}>Info Request</span>
        </div>
        <ul className="uw-decision-card-list">
          <li>Documents are missing or incomplete.</li>
          <li>Some information needs clarification.</li>
          <li>Additional evidence is required.</li>
        </ul>
      </div>
      <div id="decision-card-senior" className="card interactive-decision-card" onClick={(event) => window.__iaCall(event, "toggleDecisionSupportDetail('senior')")} style={{borderLeft: '4px solid var(--red)', padding: '1.1rem 1.15rem', background: '#FAF6F2'}}>
        <div className="card-header" style={{marginBottom: '0.5rem', alignItems: 'center'}}>
          <h4 className="card-title" style={{color: 'var(--red)', fontSize: '0.925rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6}}>
            <svg width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2="12.01" y2={16} /></svg>
            Senior Review Required
          </h4>
          <span className="badge badge-risk-high" style={{fontSize: '0.7rem', padding: '2px 6px'}}>Senior Review</span>
        </div>
        <ul className="uw-decision-card-list">
          <li>Risk score is high.</li>
          <li>The case contains complex risk factors.</li>
          <li>Special approval may be required.</li>
        </ul>
      </div>
    </div>
    <div id="uw-decision-support-detail-panel" className="uw-expandable-panel" style={{display: 'none', marginTop: '1rem'}}>
    </div>
  </div>
</section>
  );
}
