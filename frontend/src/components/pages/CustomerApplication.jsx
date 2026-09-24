export default function CustomerApplication() {
  return (
<section id="page-customer-application" className="page">
  <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem'}}>
    <div>
      <h2 className="page-title" style={{margin: '0 0 4px'}}>Policy Application</h2>
      <p className="page-subtitle">Explore available insurance products, configure your coverage, and submit an application with supporting documents.</p>
    </div>
    <div className="portal-tag" style={{background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46'}}>
      <span className="portal-dot" style={{background: '#10B981'}} />
      Online Applications Active
    </div>
  </div>
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--cust-cream-border)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12}}>
    <div style={{display: 'flex', gap: 8}}>
      <button type="button" id="tab-btn-available-policies" className="tab-btn active" onClick={(event) => window.__iaCall(event, "switchPolicyAppTab('available')")} style={{padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', border: 'none', background: 'transparent', borderBottom: '2px solid var(--cust-brown-700)', color: 'var(--cust-brown-900)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}>
        <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        Available Policies
      </button>
      <button type="button" id="tab-btn-my-applications" className="tab-btn" onClick={(event) => window.__iaCall(event, "switchPolicyAppTab('my-applications')")} style={{padding: '10px 20px', fontWeight: 600, fontSize: '0.875rem', border: 'none', background: 'transparent', borderBottom: '2px solid transparent', color: 'var(--gray-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}>
        <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x={9} y={3} width={6} height={4} rx={2} /><path d="M9 14l2 2 4-4" /></svg>
        My Applications
        <span id="my-apps-badge-count" style={{background: 'var(--cust-brown-100)', color: 'var(--cust-brown-800)', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700}}>0</span>
      </button>
    </div>
    <div id="policy-app-tab-right-actions">
      <button type="button" className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "fetchCustomerApplications(true)")} style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem'}}>
        <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
        Refresh
      </button>
    </div>
  </div>
  <div id="view-available-policies-container">
    <div id="policy-catalog-stage">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12}}>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}} id="catalog-category-filter-pills">
          <button type="button" className="btn-filter-pill active" onClick={(event) => window.__iaCall(event, "filterPolicyCatalog('all')")} data-cat="all">All Products (6)</button>
          <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterPolicyCatalog('property')")} data-cat="property">Property &amp; Home</button>
          <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterPolicyCatalog('vehicle')")} data-cat="vehicle">Vehicle &amp; Auto</button>
          <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterPolicyCatalog('commercial')")} data-cat="commercial">Commercial &amp; Business</button>
          <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterPolicyCatalog('umbrella')")} data-cat="umbrella">Personal Umbrella</button>
        </div>
        <div style={{fontSize: '0.825rem', color: 'var(--gray-600)'}}>
          Select a policy to view comprehensive terms or start an instant application.
        </div>
      </div>
      <div className="grid grid-3" id="policy-catalog-cards-grid" style={{gap: '1.5rem', alignItems: 'stretch', gridAutoRows: '1fr'}}>
      </div>
    </div>
    <div id="policy-application-form-stage" style={{display: 'none'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--white)', border: '1px solid var(--cust-cream-border)', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flexWrap: 'wrap', gap: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <button type="button" className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "cancelPolicyApplication()")} style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={19} y1={12} x2={5} y2={12} /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Catalog
          </button>
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cust-brown-600)', fontWeight: 700}}>Applying For</div>
            <div style={{fontSize: '1.05rem', fontWeight: 700, color: 'var(--cust-brown-900)', fontFamily: '"Playfair Display",Georgia,serif'}} id="app-form-product-title">Homeowners Premier Protection (HO-3)</div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <span className="badge" style={{background: 'var(--cust-brown-100)', color: 'var(--cust-brown-800)', fontWeight: 600}} id="app-form-product-category-badge">Property</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={(event) => window.__iaCall(event, "openSelectedProductDetailsModal()")} style={{fontSize: '0.78rem'}}>View Policy Guide</button>
        </div>
      </div>
      <div style={{background: 'var(--white)', border: '1px solid var(--cust-cream-border)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', gap: 8, flexWrap: 'wrap'}} id="policy-app-stepper-bar">
          <div className="stepper-step active" id="step-node-1" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(1)")} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <div className="step-circle" style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--cust-brown-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem'}}>1</div>
            <div>
              <div className="step-title" style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)'}}>Customer Info</div>
              <div className="step-desc" style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>Pre-filled Profile</div>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 15, height: 2, background: 'var(--gray-200)'}} className="step-divider" id="step-div-1" />
          <div className="stepper-step" id="step-node-2" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(2)")} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <div className="step-circle" style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem'}}>2</div>
            <div>
              <div className="step-title" style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--gray-500)'}}>Coverage &amp; Term</div>
              <div className="step-desc" style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>Tiers &amp; Duration</div>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 15, height: 2, background: 'var(--gray-200)'}} className="step-divider" id="step-div-2" />
          <div className="stepper-step" id="step-node-3" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(3)")} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <div className="step-circle" style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem'}}>3</div>
            <div>
              <div className="step-title" style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--gray-500)'}}>Policy Details</div>
              <div className="step-desc" style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>Risk Questions</div>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 15, height: 2, background: 'var(--gray-200)'}} className="step-divider" id="step-div-3" />
          <div className="stepper-step" id="step-node-4" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(4)")} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <div className="step-circle" style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem'}}>4</div>
            <div>
              <div className="step-title" style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--gray-500)'}}>Document Upload</div>
              <div className="step-desc" style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>Verification Files</div>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 15, height: 2, background: 'var(--gray-200)'}} className="step-divider" id="step-div-4" />
          <div className="stepper-step" id="step-node-5" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(5)")} style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <div className="step-circle" style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem'}}>5</div>
            <div>
              <div className="step-title" style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--gray-500)'}}>Review &amp; Submit</div>
              <div className="step-desc" style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>Declaration</div>
            </div>
          </div>
        </div>
      </div>
      <div id="policy-app-steps-content">
        <div id="app-step-pane-1" className="app-step-pane">
          <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.25rem', color: 'var(--cust-brown-900)', margin: '0 0 6px'}}>1. Customer &amp; Applicant Information</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0}}>Your verified identity details have been pre-filled from your authenticated account. Verify your contact details below.</p>
            </div>
            <div className="grid grid-2" style={{gap: '1.25rem', marginBottom: '1.5rem'}}>
              <div className="form-group">
                <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Applicant Full Name</label>
                <input type="text" id="app-cust-name" className="form-control" readOnly style={{background: '#F9F6F0', borderColor: 'var(--cust-cream-border)', color: 'var(--cust-brown-900)', fontWeight: 600}} />
              </div>
              <div className="form-group">
                <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Email Address</label>
                <input type="email" id="app-cust-email" className="form-control" readOnly style={{background: '#F9F6F0', borderColor: 'var(--cust-cream-border)', color: 'var(--cust-brown-900)'}} />
              </div>
              <div className="form-group">
                <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Phone Number</label>
                <input type="text" id="app-cust-phone" className="form-control" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Customer Account Reference ID</label>
                <input type="text" id="app-cust-id" className="form-control" readOnly style={{background: '#F9F6F0', borderColor: 'var(--cust-cream-border)', color: 'var(--gray-600)', fontFamily: 'monospace'}} />
              </div>
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Primary Physical / Mailing Address</label>
              <input type="text" id="app-cust-address" className="form-control" placeholder="124 Grand Avenue, Suite 400, Chicago, IL 60611" />
            </div>
            <div className="form-group" style={{marginBottom: '2rem'}}>
              <label style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--cust-brown-800)', marginBottom: 4, display: 'block'}}>Additional Applicant Notes / Preferred Contact Method (Optional)</label>
              <input type="text" id="app-cust-notes" className="form-control" placeholder="e.g. Best reachable by phone in mornings; existing policyholder discount applied" />
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1.25rem'}}>
              <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "policyAppNextStep(1)")} style={{padding: '10px 24px'}}>
                Continue to Coverage &amp; Term →
              </button>
            </div>
          </div>
        </div>
        <div id="app-step-pane-2" className="app-step-pane" style={{display: 'none'}}>
          <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.25rem', color: 'var(--cust-brown-900)', margin: '0 0 6px'}}>2. Select Coverage Tier &amp; Policy Duration</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0}}>Customize your policy protection level and choose your preferred policy term duration.</p>
            </div>
            <div style={{marginBottom: '1.75rem'}}>
              <label style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 10, display: 'block'}}>Choose Coverage Level</label>
              <div className="grid grid-4" id="app-coverage-tiers-container" style={{gap: '1rem', alignItems: 'stretch', gridAutoRows: '1fr'}}>
              </div>
            </div>
            <div className="grid grid-2" style={{gap: '1.5rem', background: '#FBF9F5', border: '1px solid var(--cust-cream-border)', borderRadius: 10, padding: '1.25rem', marginBottom: '2rem'}}>
              <div>
                <label style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 6, display: 'block'}}>Policy Term Duration</label>
                <div style={{display: 'flex', gap: 8}} id="app-duration-selectors">
                  <button type="button" className="btn-duration-pill" onClick={(event) => window.__iaCall(event, "selectAppDuration(6)")} data-months={6}>6 Months</button>
                  <button type="button" className="btn-duration-pill active" onClick={(event) => window.__iaCall(event, "selectAppDuration(12)")} data-months={12}>1 Year (12 Mos)</button>
                  <button type="button" className="btn-duration-pill" onClick={(event) => window.__iaCall(event, "selectAppDuration(24)")} data-months={24}>2 Years (24 Mos)</button>
                </div>
              </div>
              <div>
                <label style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 6, display: 'block'}}>Requested Effective Start Date</label>
                <input type="date" id="app-effective-date" className="form-control" style={{background: '#fff'}} />
                <span style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4, display: 'block'}}>Coverage takes effect at 12:01 AM on this date upon underwriter binding.</span>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--cust-brown-50)', border: '1px solid var(--cust-brown-200)', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem'}}>
              <div>
                <span style={{fontSize: '0.8rem', color: 'var(--cust-brown-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'}}>Estimated Annual Premium</span>
                <div style={{fontSize: '1.4rem', fontWeight: 700, color: 'var(--cust-brown-900)'}} id="app-estimated-premium-display">$1,840.00 / yr</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <span style={{fontSize: '0.8rem', color: 'var(--gray-600)'}}>Standard Deductible:</span>
                <div style={{fontSize: '1rem', fontWeight: 700, color: 'var(--cust-brown-800)'}} id="app-deductible-display">$1,000</div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1.25rem'}}>
              <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(1)")}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "policyAppNextStep(2)")} style={{padding: '10px 24px'}}>Continue to Policy Details →</button>
            </div>
          </div>
        </div>
        <div id="app-step-pane-3" className="app-step-pane" style={{display: 'none'}}>
          <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.25rem', color: 'var(--cust-brown-900)', margin: '0 0 6px'}}>3. Policy-Specific Risk Details</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0}} id="app-step3-subtitle">Please provide the necessary specifications and property information for this policy type.</p>
            </div>
            <div id="app-policy-specific-fields-container" style={{marginBottom: '2rem'}}>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1.25rem'}}>
              <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(2)")}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "policyAppNextStep(3)")} style={{padding: '10px 24px'}}>Continue to Document Upload →</button>
            </div>
          </div>
        </div>
        <div id="app-step-pane-4" className="app-step-pane" style={{display: 'none'}}>
          <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.25rem', color: 'var(--cust-brown-900)', margin: '0 0 6px'}}>4. Supporting Document Upload</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0}}>Upload the required verification documents to expedite underwriter assessment. All files are securely stored.</p>
            </div>
            <div style={{background: '#FBF9F5', border: '1px solid var(--cust-cream-border)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem'}}>
              <div style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6}}>
                <svg width={16} height={16} fill="none" stroke="#059669" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Required Document Checklist for this Policy
              </div>
              <div id="app-required-docs-checklist" style={{display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.825rem', color: 'var(--gray-700)'}}>
              </div>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <input type="file" id="app-doc-file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" style={{display: 'none'}} onChange={(event) => window.__iaCall(event, "handleAppFileUpload(event)")} />
              <div id="app-upload-dropzone" onClick={(event) => window.__iaCall(event, "triggerAppDocUpload()")} style={{border: '2px dashed var(--cust-cream-border)', background: '#FAF6F2', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'}}>
                <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--cust-brown-100)', color: 'var(--cust-brown-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'}}>
                  <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1={12} y1={3} x2={12} y2={15} /></svg>
                </div>
                <div style={{fontWeight: 700, fontSize: '0.95rem', color: 'var(--cust-brown-900)', marginBottom: 4}}>Click to Browse or Drag &amp; Drop Documents</div>
                <div style={{fontSize: '0.8rem', color: 'var(--gray-500)'}}>Supported formats: PDF, PNG, JPG, DOCX (Max 10MB per file)</div>
              </div>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, display: 'block'}}>Uploaded Files &amp; Attachments</label>
              <div id="app-uploaded-files-container" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              </div>
              <div id="app-no-files-hint" style={{fontSize: '0.8rem', color: 'var(--gray-500)', fontStyle: 'italic', padding: '8px 0'}}>No documents uploaded yet. Please upload at least one required document.</div>
            </div>
            <div id="app-doc-validation-alert" style={{display: 'none', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: 6, fontSize: '0.825rem', marginBottom: '1.5rem'}}>
              Please upload at least one required verification document before continuing.
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1.25rem'}}>
              <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(3)")}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "policyAppNextStep(4)")} style={{padding: '10px 24px'}}>Continue to Review &amp; Submit →</button>
            </div>
          </div>
        </div>
        <div id="app-step-pane-5" className="app-step-pane" style={{display: 'none'}}>
          <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.25rem', color: 'var(--cust-brown-900)', margin: '0 0 6px'}}>5. Review &amp; Confirm Application</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0}}>Please review the summary of your policy selections, risk parameters, and attached documents before final submission.</p>
            </div>
            <div className="grid grid-2" id="app-review-summary-grid" style={{gap: '0.875rem 1.25rem', alignItems: 'stretch', marginBottom: '1.25rem'}}>
              <div className="app-review-summary-card">
                <div style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: 6}}>Applicant &amp; Contact</div>
                <div style={{fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--gray-800)'}}>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Name:</strong> <span id="rev-applicant-name">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Email:</strong> <span id="rev-applicant-email">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Phone:</strong> <span id="rev-applicant-phone">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Address:</strong> <span id="rev-applicant-address">-</span></div>
                </div>
              </div>
              <div className="app-review-summary-card">
                <div style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: 6}}>Policy &amp; Coverage Terms</div>
                <div style={{fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--gray-800)'}}>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Product:</strong> <span id="rev-policy-product">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Coverage Tier:</strong> <span id="rev-coverage-tier">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Limit / Deductible:</strong> <span id="rev-limit-deductible">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Term &amp; Start Date:</strong> <span id="rev-term-dates">-</span></div>
                  <div><strong style={{color: 'var(--cust-brown-900)'}}>Est. Premium:</strong> <span id="rev-premium-value" style={{fontWeight: 700, color: 'var(--cust-brown-900)'}}>-</span></div>
                </div>
              </div>
              <div className="app-review-summary-card">
                <div style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: 6}}>Risk &amp; Specification Data</div>
                <div id="rev-specific-data-summary" style={{fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--gray-800)'}}>
                </div>
              </div>
              <div className="app-review-summary-card">
                <div style={{fontSize: '0.825rem', fontWeight: 700, color: 'var(--cust-brown-900)', marginBottom: 8, borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: 6}}>Attached Documents (<span id="rev-docs-count">0</span>)</div>
                <div id="rev-documents-summary-list" style={{fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--gray-800)'}}>
                </div>
              </div>
            </div>
            <div style={{background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem'}}>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.825rem', color: '#92400E'}}>
                <input type="checkbox" id="app-declaration-checkbox" style={{marginTop: 2, accentColor: 'var(--cust-brown-700)', width: 16, height: 16}} />
                <span>
                  <strong>Applicant Declaration:</strong> I hereby declare that the information provided in this application is accurate, complete, and true to the best of my knowledge. I authorize InsureAssist to evaluate my submission for insurance coverage under standard underwriting guidelines.
                </span>
              </label>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--cust-cream-border)', paddingTop: '1.25rem'}}>
              <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "policyAppGoToStep(4)")}>← Back</button>
              <button type="button" className="btn btn-primary" id="btn-submit-policy-app" onClick={(event) => window.__iaCall(event, "submitFinalPolicyApplication()")} style={{padding: '11px 28px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                Submit Application
              </button>
            </div>
          </div>
        </div>
        <div id="app-step-pane-6" className="app-step-pane" style={{display: 'none'}}>
          <div className="card" style={{border: '1px solid #A7F3D0', background: '#F0FDF4', borderRadius: 12, padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(16,185,129,0.08)', maxWidth: 700, margin: '0 auto'}}>
            <div style={{width: 64, height: 64, borderRadius: '50%', background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
              <svg width={32} height={32} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.6rem', color: '#065F46', margin: '0 0 8px'}}>Application Submitted Successfully!</h3>
            <p style={{fontSize: '0.9rem', color: '#047857', margin: '0 0 20px'}}>Your insurance application has been saved to the underwriting system and assigned for review.</p>
            <div style={{background: '#fff', border: '1px solid #A7F3D0', borderRadius: 10, padding: '1.25rem', marginBottom: 24, display: 'inline-block', minWidth: 320, boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-500)', fontWeight: 700, marginBottom: 4}}>Application Reference Number</div>
              <div style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--cust-brown-900)', fontFamily: 'monospace'}} id="app-confirmed-ref-number">APP-2026-10482</div>
              <div style={{marginTop: 8}}>
                <span className="badge" style={{background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontWeight: 600}}>Status: SUBMITTED (Under Review)</span>
              </div>
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: 24, textAlign: 'left', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '14px 18px'}}>
              <strong style={{color: 'var(--cust-brown-900)', display: 'block', marginBottom: 4}}>What Happens Next?</strong>
              <ul style={{margin: 0, paddingLeft: 18, lineHeight: '1.6'}}>
                <li>Our underwriting team will review your application specifications and uploaded documents.</li>
                <li>You can track the live status at any time in the <strong>My Applications</strong> tab.</li>
                <li>Upon binding approval, your official Policy Schedule and Coverage Certificate will be issued.</li>
              </ul>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap'}}>
              <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "switchPolicyAppTab('my-applications')")} style={{padding: '10px 22px'}}>
                View in My Applications
              </button>
              <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "resetPolicyAppFlow()")} style={{padding: '10px 22px'}}>
                Explore Other Insurance Policies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="view-my-applications-container" style={{display: 'none'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12}}>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}} id="my-apps-status-filter-pills">
        <button type="button" className="btn-filter-pill active" onClick={(event) => window.__iaCall(event, "filterMyApplications('all')")} data-status="all">All Applications</button>
        <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterMyApplications('submitted')")} data-status="submitted">Submitted</button>
        <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterMyApplications('under review')")} data-status="under review">Under Review</button>
        <button type="button" className="btn-filter-pill" onClick={(event) => window.__iaCall(event, "filterMyApplications('approved')")} data-status="approved">Approved</button>
      </div>
      <div>
        <button type="button" className="btn btn-primary btn-sm" onClick={(event) => window.__iaCall(event, "switchPolicyAppTab('available')")} style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
          <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
          New Policy Application
        </button>
      </div>
    </div>
    <div id="my-applications-cards-container" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
    </div>
  </div>
</section>
  );
}
