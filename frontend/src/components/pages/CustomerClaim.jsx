export default function CustomerClaim() {
  return (
<section id="page-customer-claim" className="page">
  <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem'}}>
    <div>
      <h2 className="page-title" style={{margin: '0 0 4px'}}>Report a Claim (FNOL Assistant)</h2>
      <p className="page-subtitle">Tell us what happened and we’ll guide you through your claim.</p>
    </div>
    <div className="portal-tag" style={{background: '#FFF7ED', borderColor: '#FFEDD5', color: '#9A3412'}}>
      <span className="portal-dot" style={{background: '#C2410C'}} />
      Claims Intake Active
    </div>
  </div>
  <div id="customer-claim-page-container">
    <div style={{background: 'var(--white)', border: '1px solid var(--cust-cream-border)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', gap: 12, flexWrap: 'wrap'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}} onClick={(event) => window.__iaCall(event, "fnolSetStep(1)")}>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--cust-brown-700)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0}}>1</div>
          <div>
            <div style={{fontSize: '0.875rem', fontWeight: 700, color: 'var(--cust-brown-900)'}}>Intake &amp; Evidence</div>
            <div style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>Policy &amp; Details</div>
          </div>
        </div>
        <div style={{flex: 1, minWidth: 20, height: 2, background: 'var(--gray-200)'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'default'}}>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0}}>2</div>
          <div>
            <div style={{fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-500)'}}>Risk Factor</div>
            <div style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>Risk Classification &amp; Key Factors</div>
          </div>
        </div>
        <div style={{flex: 1, minWidth: 20, height: 2, background: 'var(--gray-200)'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'default'}}>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0}}>3</div>
          <div>
            <div style={{fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-500)'}}>Review Claim</div>
            <div style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>Verify Information</div>
          </div>
        </div>
        <div style={{flex: 1, minWidth: 20, height: 2, background: 'var(--gray-200)'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'default'}}>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0}}>4</div>
          <div>
            <div style={{fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-500)'}}>Confirmation</div>
            <div style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>Claim ID &amp; Status</div>
          </div>
        </div>
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start'}} className="fnol-grid-responsive">
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
          <h4 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.1rem', color: 'var(--cust-brown-900)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{background: 'var(--cust-brown-100)', color: 'var(--cust-brown-700)', width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'}}>1</span>
            Select Covered Policy
          </h4>
          <p style={{fontSize: '0.825rem', color: 'var(--gray-600)', margin: '0 0 12px'}}>Choose which of your active policies this claim relates to:</p>
          <div id="fnol-policy-list-container" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{padding: 14, background: '#FAF6F2', border: '1px solid var(--cust-cream-border)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--cust-brown-900)', textAlign: 'center'}}>
              Loading your active policies...
            </div>
          </div>
        </div>
        <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
          <h4 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.1rem', color: 'var(--cust-brown-900)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{background: 'var(--cust-brown-100)', color: 'var(--cust-brown-700)', width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'}}>2</span>
            Incident Details
          </h4>
          <p style={{fontSize: '0.825rem', color: 'var(--gray-600)', margin: '0 0 12px'}}>Provide the time, location, and a clear description of the incident:</p>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10}}>
            <div className="form-group" style={{marginBottom: 0}}>
              <label className="form-label" style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, display: 'block'}}>Date of Loss <span style={{color: '#DC2626'}}>*</span></label>
              <input type="date" id="fnol-date-loss" className="form-control" defaultValue="2026-09-07" style={{fontSize: '0.85rem', padding: '7px 10px', width: '100%', boxSizing: 'border-box', borderRadius: 6}} required />
            </div>
            <div className="form-group" style={{marginBottom: 0}}>
              <label className="form-label" style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, display: 'block'}}>Time of Loss <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--gray-500)'}}>(Optional)</span></label>
              <input type="time" id="fnol-time-loss" className="form-control" defaultValue="14:30" style={{fontSize: '0.85rem', padding: '7px 10px', width: '100%', boxSizing: 'border-box', borderRadius: 6}} />
            </div>
          </div>
          <div className="form-group" style={{marginBottom: 10}}>
            <label className="form-label" style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, display: 'block'}}>Location of Incident <span style={{color: '#DC2626'}}>*</span></label>
            <input type="text" id="fnol-location" className="form-control" defaultValue="Oakridge Blvd & 5th Ave, Springfield, IL" placeholder="e.g. 5th Ave & Main St or Home Address" style={{fontSize: '0.85rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box', borderRadius: 6}} required />
          </div>
          <div className="form-group" style={{marginBottom: 10}}>
            <label className="form-label" style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, display: 'block'}}>What Happened? (Incident Category)</label>
            <select id="fnol-category" className="form-control" style={{fontSize: '0.85rem', padding: '8px 10px', width: '100%', boxSizing: 'border-box', borderRadius: 6}}>
              <option value="Vehicle Collision">Vehicle Collision / Impact</option>
              <option value="Water / Pipe Leak">Water Leak / Plumbing Discharge</option>
              <option value="Weather / Storm Damage">Weather / Storm / Hail Damage</option>
              <option value="Theft / Vandalism">Theft / Burglary / Vandalism</option>
              <option value="Property Liability">Property / Third-Party Liability</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label className="form-label" style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, display: 'block'}}>Description of Incident <span style={{color: '#DC2626'}}>*</span></label>
            <textarea id="fnol-description" className="form-control" placeholder="Describe what happened, any damages noticed, and the sequence of events in detail..." style={{fontSize: '0.85rem', lineHeight: '1.5', padding: '8px 10px', width: '100%', minHeight: 85, height: 90, boxSizing: 'border-box', borderRadius: 6, resize: 'vertical', display: 'block'}} required defaultValue={"Minor parking lot contact while reversing into a space. Rear bumper cover has a light dent and scratches. No injuries or frame damage."} />
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
          <h4 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.1rem', color: 'var(--cust-brown-900)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{background: 'var(--cust-brown-100)', color: 'var(--cust-brown-700)', width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'}}>3</span>
            Photos &amp; Supporting Evidence <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--gray-500)'}}>(Optional)</span>
          </h4>
          <p style={{fontSize: '0.825rem', color: 'var(--gray-600)', margin: '0 0 12px'}}>Upload photos of damage, repair estimates, or relevant documents to expedite review:</p>
          <input type="file" id="fnol-file-input" multiple accept="image/*,.pdf" style={{display: 'none'}} onChange={(event) => window.__iaCall(event, "fnolHandleFileUpload(event)")} />
          <div onClick={(event) => window.__iaCall(event, "fnolTriggerUpload()")} style={{border: '2px dashed var(--cust-cream-border)', background: '#FAF6F2', borderRadius: 8, padding: '18px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 12}}>
            <svg width={26} height={26} fill="none" stroke="var(--cust-brown-700)" strokeWidth="1.8" viewBox="0 0 24 24" style={{margin: '0 auto 6px'}}><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--cust-brown-900)'}}>Click to browse or drop damage photos here</div>
            <div style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2}}>JPEG, PNG, HEIC, PDF (Up to 15MB each)</div>
          </div>
          <div id="fnol-photos-list" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid var(--cust-cream-border)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                <svg width={14} height={14} fill="none" stroke="#059669" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{fontWeight: 500, color: 'var(--cust-brown-900)'}}>damage_rear_bumper.jpg</span>
              </div>
              <button type="button" onClick={(event) => window.__iaCall(event, "fnolRemovePhoto(0)")} style={{border: 'none', background: 'transparent', color: '#DC2626', cursor: 'pointer', padding: '2px 4px', fontSize: '0.9rem'}} title="Remove file">✕</button>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid var(--cust-cream-border)', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                <svg width={14} height={14} fill="none" stroke="#059669" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{fontWeight: 500, color: 'var(--cust-brown-900)'}}>scene_parking_bay.png</span>
              </div>
              <button type="button" onClick={(event) => window.__iaCall(event, "fnolRemovePhoto(1)")} style={{border: 'none', background: 'transparent', color: '#DC2626', cursor: 'pointer', padding: '2px 4px', fontSize: '0.9rem'}} title="Remove file">✕</button>
            </div>
          </div>
        </div>
        <div className="card" style={{border: '1px solid var(--cust-cream-border)', background: 'var(--white)', borderRadius: 12, padding: '1.25rem 1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'}}>
          <h4 style={{fontFamily: '"Playfair Display",Georgia,serif', fontSize: '1.1rem', color: 'var(--cust-brown-900)', margin: '0 0 12px'}}>
            Police Report &amp; Witnesses <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--gray-500)'}}>(Optional)</span>
          </h4>
          <div style={{borderBottom: '1px solid var(--cust-cream-border)', paddingBottom: 12, marginBottom: 12}}>
            <label style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--cust-brown-900)'}}>
              <input type="checkbox" id="fnol-police-toggle" onChange={(event) => window.__iaCall(event, "document.getElementById('fnol-police-fields').style.display = this.checked ? 'block' : 'none';")} style={{accentColor: 'var(--cust-brown-700)'}} />
              <span>Police or Official Accident Report Filed</span>
            </label>
            <div id="fnol-police-fields" style={{display: 'none', marginTop: 10, paddingLeft: 24}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                <input type="text" id="fnol-police-num" className="form-control" placeholder="Report / Case Number (Optional)" style={{fontSize: '0.825rem', padding: '7px 10px', borderRadius: 6}} />
                <input type="text" id="fnol-police-dept" className="form-control" placeholder="Police Dept / Agency (Optional)" style={{fontSize: '0.825rem', padding: '7px 10px', borderRadius: 6}} />
              </div>
            </div>
          </div>
          <div>
            <label style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--cust-brown-900)'}}>
              <input type="checkbox" id="fnol-witness-toggle" onChange={(event) => window.__iaCall(event, "document.getElementById('fnol-witness-fields').style.display = this.checked ? 'block' : 'none';")} style={{accentColor: 'var(--cust-brown-700)'}} />
              <span>Witness Information Available</span>
            </label>
            <div id="fnol-witness-fields" style={{display: 'none', marginTop: 10, paddingLeft: 24}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10}}>
                <input type="text" id="fnol-witness-name" className="form-control" placeholder="Witness Full Name (Optional)" style={{fontSize: '0.825rem', padding: '7px 10px', borderRadius: 6}} />
                <input type="text" id="fnol-witness-phone" className="form-control" placeholder="Phone or Email (Optional)" style={{fontSize: '0.825rem', padding: '7px 10px', borderRadius: 6}} />
              </div>
              <textarea id="fnol-witness-stmt" className="form-control" rows={2} placeholder="Brief witness statement or contact notes (Optional)..." style={{fontSize: '0.825rem', padding: '7px 10px', borderRadius: 6, width: '100%', boxSizing: 'border-box'}} defaultValue={""} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem'}}>
      <button type="button" className="btn btn-outline" onClick={(event) => window.__iaCall(event, "navigateTo('customer-dashboard')")}>
        Cancel / Return
      </button>
      <button type="button" className="btn btn-primary" onClick={(event) => window.__iaCall(event, "fnolSetStep(2)")} style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8}}>
        <span>Continue to Risk Factor</span>
        <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>
      </button>
    </div>
  </div>
</section>
  );
}
