const AUTH_SERVICE_URL = 'http://127.0.0.1:8001';
const CUSTOMER_SERVICE_URL = 'http://127.0.0.1:8002';
const AGENT_SERVICE_URL = 'http://127.0.0.1:8003';

/**
     * MOCK DATA REPOSITORIES (ORGANIZED SEPARATELY)
     */
const MOCK_DB = {
  currentRole: 'customer', // 'customer', 'agent', or 'underwriter'

  // Underwriter Decision Portal Data (Alex Vance)
  underwriter: {
    id: 'UW-88210',
    name: 'Alex Vance',
    email: 'alex.vance@insureassist.com',
    initials: 'AV',
    title: 'Senior Underwriter · CPCU Authority',
    stats: {
      pendingReviews: 14,
      highRiskCases: 4,
      approved: 28,
      needsMoreInfo: 6,
      totalCases: 53
    }
  },

  // Underwriting Queue Data (53 Lifetime Submissions with 14 Pending)
  underwriterQueue: [
    // 14 PENDING (1 High, 7 Medium, 6 Low)
    {
      id: 'UW-1001', customer: 'Sarah Mitchell', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 48, premium: '$1,840', submitted: 'Today', status: 'Pending',
      requestedCoverage: '$350,000 Dwelling Replacement', deductible: '$1,000', effectiveDate: '15 Apr 2026',
      riskFactors: ['Property age: 12 years (modern copper wiring & updated roof)', 'Previous claims: 1 minor wind loss in 2023 ($2,400 paid)', 'Requested coverage: $350,000 (Adequate 100% replacement ratio)', 'Location risk: Moderate (Midwest wind/hail zone)'],
      coverages: ['Dwelling ($350,000)', 'Personal Property ($175,000)', 'Personal Liability ($500,000)', 'Loss of Use ($70,000)'],
      exclusions: ['Flood & Rising Water', 'Earth Movement / Seismic', 'Wear, Tear & Deterioration'],
      documents: ['Application Form (PDF)', 'Property Inspection (PDF)', 'Identification (PDF)', 'Loss History Report (PDF)']
    },
    {
      id: 'UW-1002', customer: 'John Carter', product: 'Auto Insurance', riskLevel: 'High', riskScore: 78, premium: '$1,260', submitted: 'Yesterday', status: 'Pending',
      requestedCoverage: '$500,000 Combined Single Limit', deductible: '$500 Collision / $250 Comp', effectiveDate: '01 May 2026',
      riskFactors: ['2 speeding violations on MVR within preceding 24 months', 'High performance vehicle (2024 BMW M340i, 382 hp)', 'High density metropolitan commuter territory', 'Telematics score: 62/100 (Frequent rapid braking events)'],
      coverages: ['Bodily Injury ($250k/$500k)', 'Property Damage ($100,000)', 'Comprehensive ($250 Ded)', 'Collision ($500 Ded)'],
      exclusions: ['Track/Racing Use', 'Commercial rideshare delivery without endorsement', 'Unlisted regular drivers'],
      documents: ['Auto Application (PDF)', 'Motor Vehicle Record (PDF)', 'Driver License Verification', 'Telematics Log (PDF)']
    },
    {
      id: 'UW-1003', customer: 'Emily Johnson', product: 'Commercial Property', riskLevel: 'Low', riskScore: 18, premium: '$1,850', submitted: '2 days ago', status: 'Pending',
      requestedCoverage: '$1,000,000 Commercial Property & Building', deductible: '$2,500', effectiveDate: '10 May 2026',
      riskFactors: ['Fire resistive steel frame commercial construction (2021)', 'Monitored central station fire and burglar alarm systems', 'Clean 5-year commercial property loss run record', 'Located 0.5 miles from municipal fire hydrant station'],
      coverages: ['Commercial Building ($1,000,000)', 'Business Personal Property ($500,000)', 'Equipment Breakdown Rider'],
      exclusions: ['Flood and surface water', 'Government seizure or condemnation'],
      documents: ['Commercial Property App (PDF)', 'Building Inspection Report (PDF)', 'Alarm Certification', 'Loss Run History']
    },
    {
      id: 'UW-1006', customer: 'Lisa Anderson', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 42, premium: '$2,100', submitted: '3 days ago', status: 'Pending',
      requestedCoverage: '$420,000 HO-3 Special Form', deductible: '$1,500', effectiveDate: '20 May 2026',
      riskFactors: ['Proximity to coastal waterway: 4.8 miles', 'Hurricane impact straps and secondary water barrier roof (2022)', 'In-ground swimming pool with self-closing locking perimeter fence', 'No prior water damage or hail claims'],
      coverages: ['Dwelling ($420,000)', 'Other Structures ($42,000)', 'Personal Property ($210,000)', 'Personal Liability ($500,000)'],
      exclusions: ['Flood & Rising Water', 'Earthquake', 'Sewer Back-up without Rider'],
      documents: ['Residential App (PDF)', 'Wind Mitigation Certificate', 'Pool Safety Verification', 'CLUE Property Loss Report']
    },
    {
      id: 'UW-1007', customer: 'James Wilson', product: 'Business Insurance', riskLevel: 'Medium', riskScore: 58, premium: '$3,200', submitted: '4 days ago', status: 'Pending',
      requestedCoverage: '$1,500,000 Commercial General Liability', deductible: '$2,500', effectiveDate: '01 Jun 2026',
      riskFactors: ['Regional commercial distribution warehouse', 'Clean 3-year loss run history', 'Modern surveillance and fire detection network', 'Standard commercial terms apply'],
      coverages: ['General Liability ($1,500,000)', 'Property Damage ($500,000)', 'Product Liability ($1,000,000)'],
      exclusions: ['Hazardous materials', 'Nuclear hazard'],
      documents: ['Commercial App (PDF)', 'Premises Inspection (PDF)', 'Loss Runs (PDF)']
    },
    {
      id: 'UW-1011', customer: 'Jessica Taylor', product: 'Home Insurance', riskLevel: 'Low', riskScore: 16, premium: '$1,420', submitted: '4 days ago', status: 'Pending',
      requestedCoverage: '$320,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '15 Jun 2026',
      riskFactors: ['Suburban single-family dwelling built 2018', 'Gated community with 24/7 security patrol', 'Zero prior claims in 10-year homeowner history', 'Tile roofing with hail-resistant rating'],
      coverages: ['Dwelling ($320,000)', 'Personal Property ($160,000)', 'Liability ($300,000)'], exclusions: ['Flood', 'Earthquake'], documents: ['App Form (PDF)', 'Inspection (PDF)']
    },
    {
      id: 'UW-1012', customer: 'Robert Martinez', product: 'Auto Insurance', riskLevel: 'Medium', riskScore: 38, premium: '$1,150', submitted: '5 days ago', status: 'Pending',
      requestedCoverage: '$250k/$500k Auto Liability', deductible: '$500', effectiveDate: '20 Jun 2026',
      riskFactors: ['Clean MVR for principal driver', 'Secondary driver has 1 minor parking incident in 2024', 'Garage kept vehicle with anti-theft tracking'],
      coverages: ['Bodily Injury ($250k/$500k)', 'Collision ($500)', 'Comprehensive ($250)'], exclusions: ['Unapproved drivers'], documents: ['Auto App (PDF)', 'MVR Record']
    },
    {
      id: 'UW-1013', customer: 'Amanda Wilson', product: 'Home Insurance', riskLevel: 'Low', riskScore: 22, premium: '$1,650', submitted: '5 days ago', status: 'Pending',
      requestedCoverage: '$380,000 Homeowners HO-3', deductible: '$1,000', effectiveDate: '25 Jun 2026',
      riskFactors: ['Brick construction built 2015', 'Central heating/AC with smart thermostat monitoring', 'Deadbolt locks and connected smoke detectors'],
      coverages: ['Dwelling ($380,000)', 'Contents ($190,000)', 'Liability ($500,000)'], exclusions: ['Flood', 'Earthquake'], documents: ['App Form', 'Inspection Report']
    },
    {
      id: 'UW-1014', customer: 'Brian Anderson', product: 'Commercial Property', riskLevel: 'Medium', riskScore: 45, premium: '$2,400', submitted: '6 days ago', status: 'Pending',
      requestedCoverage: '$1,200,000 Commercial Retail Space', deductible: '$2,500', effectiveDate: '01 Jul 2026',
      riskFactors: ['Boutique retail clothing shop in downtown district', 'Sprinkler system inspected annually', 'Clean 5-year claims record'],
      coverages: ['Building ($1,200,000)', 'Inventory BPP ($400,000)'], exclusions: ['Flood', 'Riot/Civil Commotion'], documents: ['ACORD 125', 'Building Inspection']
    },
    {
      id: 'UW-1015', customer: 'Catherine Lee', product: 'Home Insurance', riskLevel: 'Low', riskScore: 14, premium: '$1,350', submitted: '1 week ago', status: 'Pending',
      requestedCoverage: '$290,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '05 Jul 2026',
      riskFactors: ['Newly constructed home in master-planned neighborhood', 'Impact-resistant windows and smart water shutoff valve', 'Excellent credit score (>780)'],
      coverages: ['Dwelling ($290,000)', 'Personal Property ($145,000)', 'Liability ($500,000)'], exclusions: ['Flood'], documents: ['Application (PDF)', 'Builder Warranty']
    },
    {
      id: 'UW-1016', customer: 'Daniel White', product: 'Auto Insurance', riskLevel: 'Low', riskScore: 20, premium: '$980', submitted: '1 week ago', status: 'Pending',
      requestedCoverage: '$300k Combined Single Limit', deductible: '$500', effectiveDate: '10 Jul 2026',
      riskFactors: ['Electric vehicle (2024 Tesla Model Y)', 'Commute distance < 15 miles/day', 'Driver age 42 with flawless 10-year driving record'],
      coverages: ['CSL Liability ($300k)', 'Collision ($500 Ded)', 'EV Battery Protection'], exclusions: ['Track Racing'], documents: ['Auto App Form', 'MVR Verification']
    },
    {
      id: 'UW-1017', customer: 'Elizabeth Harris', product: 'Umbrella Liability', riskLevel: 'Low', riskScore: 12, premium: '$450', submitted: '1 week ago', status: 'Pending',
      requestedCoverage: '$2,000,000 Personal Umbrella', deductible: '$1,000', effectiveDate: '15 Jul 2026',
      riskFactors: ['Underlying policies with standard carrier in good standing', 'No recreational property hazards or teenage drivers', 'Zero prior liability claims'],
      coverages: ['Personal Umbrella Excess ($2,000,000)'], exclusions: ['Business activities'], documents: ['Umbrella App', 'Underlying Dec Pages']
    },
    {
      id: 'UW-1018', customer: 'George Clark', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 50, premium: '$2,250', submitted: '1 week ago', status: 'Pending',
      requestedCoverage: '$450,000 HO-3 Coverage', deductible: '$1,500', effectiveDate: '20 Jul 2026',
      riskFactors: ['Property age: 28 years with recent roof replacement (2023)', 'Finished basement with sump pump battery backup', 'Suburban wooded lot'],
      coverages: ['Dwelling ($450,000)', 'Personal Property ($225,000)', 'Liability ($500,000)'], exclusions: ['Flood', 'Seismic'], documents: ['Home App (PDF)', 'Roof Inspection']
    },
    {
      id: 'UW-1019', customer: 'Hannah Lewis', product: 'Business Insurance', riskLevel: 'Medium', riskScore: 52, premium: '$3,800', submitted: '2 weeks ago', status: 'Pending',
      requestedCoverage: '$1,000,000 Professional Office BOP', deductible: '$2,000', effectiveDate: '01 Aug 2026',
      riskFactors: ['Architecture and design firm office', 'Monitored alarm and electronic badge entry', 'No heavy equipment or hazardous operations'],
      coverages: ['Commercial Property ($1,000,000)', 'General Liability ($2,000,000)'], exclusions: ['E&O (requires separate policy)'], documents: ['BOP Form', 'Lease Agreement']
    },

    // 6 NEEDS MORE INFORMATION (2 High, 4 Medium)
    {
      id: 'UW-1004', customer: 'Michael Brown', product: 'Business Insurance', riskLevel: 'High', riskScore: 82, premium: '$4,500', submitted: '3 days ago', status: 'Needs More Information',
      requestedCoverage: '$2,000,000 Commercial General Liability', deductible: '$5,000', effectiveDate: '15 May 2026',
      riskFactors: ['Light industrial manufacturing facility with warehouse storage', 'Flammable solvent storage on premises', 'Annual revenue: $4.2M (32 on-site shop floor employees)', 'Pending: Updated fire suppression & certified annual sprinkler test'],
      coverages: ['Commercial General Liability ($2,000,000)', 'Business Personal Property ($850,000)', 'Business Income Interruption ($400,000)'],
      exclusions: ['Pollution & Asbestos Liability', 'Cyber Extortion', 'Professional Errors & Omissions'],
      documents: ['Commercial App (ACORD 125)', 'Premises Inspection Log', 'Fire Sprinkler Test (Missing)', 'Financial Statements (PDF)']
    },
    {
      id: 'UW-1009', customer: 'Robert Taylor', product: 'Home Insurance', riskLevel: 'High', riskScore: 88, premium: '$6,400', submitted: '1 week ago', status: 'Needs More Information',
      requestedCoverage: '$1,850,000 High-Value Estate', deductible: '$5,000', effectiveDate: '01 Jun 2026',
      riskFactors: ['Historic stone masonry estate built in 1928', 'Custom imported woodworking and antique slate roofing', 'Wildfire interface zone rating: Moderate-High', 'Missing: Specialist fine arts appraisal and electrical modernization certificate'],
      coverages: ['Dwelling Guaranteed Replacement ($1,850,000)', 'Fine Arts Rider ($250,000)', 'Personal Liability ($1,000,000)'],
      exclusions: ['Wear/Tear on Historic Features', 'Seismic', 'Flood'],
      documents: ['High Value Estate App', 'Historic Property Survey', 'Fine Arts Appraisal (Missing)', 'Electrical Inspection Notice']
    },
    {
      id: 'UW-1020', customer: 'Ian Walker', product: 'Commercial Property', riskLevel: 'Medium', riskScore: 55, premium: '$3,100', submitted: '1 week ago', status: 'Needs More Information',
      requestedCoverage: '$1,500,000 Warehouse Facility', deductible: '$5,000', effectiveDate: '10 Jun 2026',
      riskFactors: ['Distribution warehouse for consumer goods', 'Forklift charging station verification needed', 'Pending updated fire egress documentation'],
      coverages: ['Building ($1,500,000)', 'Equipment ($500,000)'], exclusions: ['Flood', 'Contamination'], documents: ['Warehouse App', 'Safety Inspection (Pending)']
    },
    {
      id: 'UW-1021', customer: 'Julia Hall', product: 'Auto Insurance', riskLevel: 'Medium', riskScore: 44, premium: '$1,450', submitted: '2 weeks ago', status: 'Needs More Information',
      requestedCoverage: '$500,000 Commercial Van Policy', deductible: '$1,000', effectiveDate: '15 Jun 2026',
      riskFactors: ['Catering business delivery van', 'Awaiting verified driver list MVR confirmation', 'Clean operating record past 36 months'],
      coverages: ['Commercial Auto CSL ($500,000)', 'Cargo Rider ($25,000)'], exclusions: ['Rideshare use'], documents: ['Commercial Auto App', 'Driver Licenses (Pending)']
    },
    {
      id: 'UW-1022', customer: 'Kevin Young', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 49, premium: '$2,350', submitted: '2 weeks ago', status: 'Needs More Information',
      requestedCoverage: '$520,000 Coastal Residence', deductible: '$2,500', effectiveDate: '20 Jun 2026',
      riskFactors: ['Property located 2.5 miles from shoreline', 'Storm shutter certification needed', 'Elevated foundation with modern tie-downs'],
      coverages: ['Dwelling ($520,000)', 'Contents ($260,000)', 'Liability ($500,000)'], exclusions: ['Flood', 'Wave Surge'], documents: ['Coastal App', 'Shutter Certification (Pending)']
    },
    {
      id: 'UW-1023', customer: 'Laura King', product: 'Business Insurance', riskLevel: 'Medium', riskScore: 46, premium: '$2,900', submitted: '3 weeks ago', status: 'Needs More Information',
      requestedCoverage: '$1,000,000 Medical Clinic BOP', deductible: '$2,500', effectiveDate: '01 Jul 2026',
      riskFactors: ['Outpatient physical therapy clinic', 'Biohazard disposal protocol log required', 'No overnight inpatient accommodations'],
      coverages: ['Property ($1,000,000)', 'General Liability ($2,000,000)'], exclusions: ['Medical Malpractice'], documents: ['Clinic App', 'Biohazard Disposal Log (Pending)']
    },

    // 5 REJECTED (1 High, 4 Medium/Low)
    {
      id: 'UW-1010', customer: 'William Clark', product: 'Business Insurance', riskLevel: 'High', riskScore: 94, premium: '$12,500', submitted: '2 weeks ago', status: 'Rejected',
      requestedCoverage: '$3,500,000 Commercial Property', deductible: '$10,000', effectiveDate: 'Declined',
      riskFactors: ['Wood recycling and timber processing facility', 'Severe unmitigated combustible dust accumulation', 'Inadequate municipal water pressure for hydrant fire suppression', '3 industrial fire claims with prior carriers in 4 years'],
      coverages: ['Building & Machinery ($3,500,000)', 'Business Interruption ($1,000,000)'],
      exclusions: ['Unsprinklered structures', 'Dust ignition liability'],
      documents: ['Commercial Application', 'Risk Engineering Inspection Report', 'Decline Notice Letter (PDF)']
    },
    {
      id: 'UW-1024', customer: 'Nicholas Green', product: 'Auto Insurance', riskLevel: 'Medium', riskScore: 64, premium: '$3,200', submitted: '3 weeks ago', status: 'Rejected',
      requestedCoverage: '$500,000 Auto Policy', deductible: '$1,000', effectiveDate: 'Declined',
      riskFactors: ['Multiple major moving violations within 12 months', 'Suspended license history with prior carrier', 'Exceeds standard underwriting loss ratio guidelines'],
      coverages: ['Liability ($500k)'], exclusions: ['All coverage'], documents: ['MVR Report', 'Decline Notice']
    },
    {
      id: 'UW-1025', customer: 'Olivia Baker', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 62, premium: '$4,100', submitted: '1 month ago', status: 'Rejected',
      requestedCoverage: '$600,000 Homeowners HO-3', deductible: '$2,500', effectiveDate: 'Declined',
      riskFactors: ['Severe unaddressed foundation subsidence and structural cracking', 'Prior water damage claim history with unverified repairs', 'Inspector recommended structural rebuild before binding'],
      coverages: ['Dwelling ($600,000)'], exclusions: ['Structural failure'], documents: ['Property Inspection', 'Decline Notice']
    },
    {
      id: 'UW-1026', customer: 'Patrick Adams', product: 'Commercial Property', riskLevel: 'Medium', riskScore: 60, premium: '$5,500', submitted: '1 month ago', status: 'Rejected',
      requestedCoverage: '$2,000,000 Commercial Building', deductible: '$5,000', effectiveDate: 'Declined',
      riskFactors: ['Unoccupied commercial building vacant for >180 days', 'Broken security perimeter and disconnected fire alarms', 'Underwriting guidelines prohibit vacant industrial property binding without endorsement'],
      coverages: ['Building ($2,000,000)'], exclusions: ['Vandalism', 'Freeze'], documents: ['Vacancy Survey', 'Decline Notice']
    },
    {
      id: 'UW-1027', customer: 'Quinn Scott', product: 'Business Insurance', riskLevel: 'Medium', riskScore: 58, premium: '$4,800', submitted: '1 month ago', status: 'Rejected',
      requestedCoverage: '$1,500,000 Bar & Nightclub BOP', deductible: '$5,000', effectiveDate: 'Declined',
      riskFactors: ['Late-night entertainment venue with dancing and live pyrotechnics', 'Multiple open assault liability claims with previous insurer', 'Outside core risk appetite guidelines'],
      coverages: ['General Liability ($1,500,000)'], exclusions: ['Liquor liability claims'], documents: ['Nightclub Survey', 'Decline Notice']
    },

    // 28 APPROVED (19 Low, 9 Medium)
    {
      id: 'UW-1005', customer: 'David Chen', product: 'Umbrella Liability', riskLevel: 'Low', riskScore: 15, premium: '$650', submitted: '4 days ago', status: 'Approved',
      requestedCoverage: '$3,000,000 Personal Excess Umbrella', deductible: '$1,000 (SIR)', effectiveDate: '01 Apr 2026',
      riskFactors: ['Underlying auto ($500k) and homeowners ($500k) limits verified', '0 personal liability claims in 15-year insured history', 'No high-risk recreational vehicles or watercraft', 'Clean civil public background record'],
      coverages: ['Worldwide Excess Liability ($3,000,000)', 'Excess Uninsured Motorist Protection ($1,000,000)'],
      exclusions: ['Intentional Acts', 'Commercial business operations', 'Aircraft ownership'],
      documents: ['Umbrella Application Form', 'Underlying Policy Dec Pages', 'Motor Vehicle Reports', 'Underwriter Approval Signoff']
    },
    {
      id: 'UW-1008', customer: 'Maria Rodriguez', product: 'Business Insurance', riskLevel: 'Low', riskScore: 20, premium: '$1,240', submitted: '1 week ago', status: 'Approved',
      requestedCoverage: '$750,000 Business Owners Policy', deductible: '$1,000', effectiveDate: '15 Mar 2026',
      riskFactors: ['Low-hazard professional consulting firm office space', 'Strict premises security and access controls', 'No retail foot traffic or hazardous machinery on site', 'Clean civil liability background check'],
      coverages: ['Commercial General Liability ($1,000,000)', 'Office Contents ($250,000)', 'Business Income Interruption'],
      exclusions: ['Off-premises utility failure', 'Professional malpractice (requires separate E&O)'],
      documents: ['BOP Application Form', 'Office Lease Verification', 'Approved Policy Packet (PDF)']
    },
    {
      id: 'UW-1028', customer: 'Rachel Murphy', product: 'Home Insurance', riskLevel: 'Low', riskScore: 14, premium: '$1,480', submitted: '1 week ago', status: 'Approved',
      requestedCoverage: '$360,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '15 Mar 2026',
      riskFactors: ['Suburban residential home with modern security', 'Zero claims in past 10 years', 'Preferred credit tier 1'],
      coverages: ['Dwelling ($360,000)', 'Personal Property ($180,000)'], exclusions: ['Flood'], documents: ['Application Form', 'Binder Packet']
    },
    {
      id: 'UW-1029', customer: 'Samuel Reed', product: 'Auto Insurance', riskLevel: 'Low', riskScore: 17, premium: '$1,050', submitted: '1 week ago', status: 'Approved',
      requestedCoverage: '$250k/$500k Auto Comprehensive', deductible: '$500', effectiveDate: '20 Mar 2026',
      riskFactors: ['Clean MVR for all listed operators', 'Garaged in low-theft zip code', 'Anti-theft GPS enabled'],
      coverages: ['Bodily Injury ($250k/$500k)', 'Property Damage ($100k)'], exclusions: ['Commercial use'], documents: ['Auto App', 'MVR Clearance']
    },
    {
      id: 'UW-1030', customer: 'Theresa Bell', product: 'Commercial Property', riskLevel: 'Low', riskScore: 19, premium: '$2,100', submitted: '1 week ago', status: 'Approved',
      requestedCoverage: '$1,100,000 Commercial Office Unit', deductible: '$2,500', effectiveDate: '22 Mar 2026',
      riskFactors: ['Modern medical office building unit', 'Central fire alarm with 24/7 monitoring', 'No hazardous materials'],
      coverages: ['Building ($1,100,000)', 'BPP ($300,000)'], exclusions: ['Flood'], documents: ['ACORD App', 'Inspection Log']
    },
    {
      id: 'UW-1031', customer: 'Tyler Hughes', product: 'Home Insurance', riskLevel: 'Low', riskScore: 16, premium: '$1,520', submitted: '2 weeks ago', status: 'Approved',
      requestedCoverage: '$340,000 HO-3 Form', deductible: '$1,000', effectiveDate: '25 Mar 2026',
      riskFactors: ['Single story brick ranch home', 'Upgraded architectural shingle roof (2023)', 'Monitored security system'],
      coverages: ['Dwelling ($340,000)', 'Personal Property ($170,000)'], exclusions: ['Flood'], documents: ['Inspection Report', 'Approval Letter']
    },
    {
      id: 'UW-1032', customer: 'Victoria Price', product: 'Umbrella Liability', riskLevel: 'Low', riskScore: 11, premium: '$400', submitted: '2 weeks ago', status: 'Approved',
      requestedCoverage: '$1,000,000 Excess Umbrella', deductible: '$1,000', effectiveDate: '28 Mar 2026',
      riskFactors: ['Underlying auto and home limits exceed minimum requirements', 'Clean liability history', 'Zero claims'],
      coverages: ['Excess Liability ($1,000,000)'], exclusions: ['Business operations'], documents: ['Umbrella Binder', 'Dec Pages']
    },
    {
      id: 'UW-1033', customer: 'Walter Sanders', product: 'Auto Insurance', riskLevel: 'Low', riskScore: 18, premium: '$920', submitted: '2 weeks ago', status: 'Approved',
      requestedCoverage: '$300,000 CSL Auto', deductible: '$500', effectiveDate: '01 Apr 2026',
      riskFactors: ['Preferred driver profile', 'Vehicle stored in private locked garage', 'Telematics safety score 92/100'],
      coverages: ['CSL Liability ($300k)', 'Comprehensive/Collision'], exclusions: ['Rideshare'], documents: ['MVR Record', 'Policy Document']
    },
    {
      id: 'UW-1034', customer: 'Yvonne Foster', product: 'Home Insurance', riskLevel: 'Low', riskScore: 15, premium: '$1,680', submitted: '2 weeks ago', status: 'Approved',
      requestedCoverage: '$390,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '01 Apr 2026',
      riskFactors: ['Single family home built 2020', 'Automatic main water shutoff system', 'Zero prior loss history'],
      coverages: ['Dwelling ($390,000)', 'Contents ($195,000)', 'Liability ($500k)'], exclusions: ['Earthquake'], documents: ['App Form', 'Inspection Verification']
    },
    {
      id: 'UW-1035', customer: 'Zachary Morgan', product: 'Commercial Property', riskLevel: 'Low', riskScore: 22, premium: '$2,750', submitted: '2 weeks ago', status: 'Approved',
      requestedCoverage: '$1,400,000 Commercial Office Space', deductible: '$2,500', effectiveDate: '05 Apr 2026',
      riskFactors: ['Accounting firm multi-tenant office building', 'Sprinkler certified log current', 'Clean 5-year commercial record'],
      coverages: ['Building ($1,400,000)', 'BPP ($450,000)'], exclusions: ['Flood'], documents: ['Commercial Inspection', 'Approval Certificate']
    },
    {
      id: 'UW-1036', customer: 'Abigail Bailey', product: 'Home Insurance', riskLevel: 'Low', riskScore: 13, premium: '$1,390', submitted: '3 weeks ago', status: 'Approved',
      requestedCoverage: '$310,000 Residential HO-3', deductible: '$1,000', effectiveDate: '08 Apr 2026',
      riskFactors: ['Master-planned residential community', 'Underground utilities and municipal fire hydrant across street', 'Excellent credit rating'],
      coverages: ['Dwelling ($310,000)', 'Personal Property ($155,000)'], exclusions: ['Flood'], documents: ['App Form', 'Binder Packet']
    },
    {
      id: 'UW-1037', customer: 'Brandon Cooper', product: 'Auto Insurance', riskLevel: 'Low', riskScore: 19, premium: '$1,120', submitted: '3 weeks ago', status: 'Approved',
      requestedCoverage: '$250k/$500k Personal Auto', deductible: '$500', effectiveDate: '10 Apr 2026',
      riskFactors: ['2 drivers over age 35 with 0 infractions past 7 years', 'Suburban low-density territory', 'Factory anti-theft immobilizer'],
      coverages: ['Liability ($250k/$500k)', 'Full Comprehensive & Collision'], exclusions: ['Commercial use'], documents: ['Driver Records', 'Approval Dec Page']
    },
    {
      id: 'UW-1038', customer: 'Chloe Richardson', product: 'Home Insurance', riskLevel: 'Low', riskScore: 15, premium: '$1,740', submitted: '3 weeks ago', status: 'Approved',
      requestedCoverage: '$400,000 HO-3 Dwelling', deductible: '$1,000', effectiveDate: '12 Apr 2026',
      riskFactors: ['Brick veneer single family home built 2017', 'Fully enclosed perimeter fencing', 'Smart security alarm with video monitoring'],
      coverages: ['Dwelling ($400,000)', 'Contents ($200,000)', 'Liability ($500,000)'], exclusions: ['Flood', 'Earthquake'], documents: ['Home App', 'Approved Binder']
    },
    {
      id: 'UW-1039', customer: 'Dominic Cox', product: 'Business Insurance', riskLevel: 'Low', riskScore: 21, premium: '$1,650', submitted: '3 weeks ago', status: 'Approved',
      requestedCoverage: '$1,000,000 Tech Consulting BOP', deductible: '$1,500', effectiveDate: '15 Apr 2026',
      riskFactors: ['Software engineering consultancy office', 'No inventory storage on site', 'Secure badge access only'],
      coverages: ['Commercial Liability ($1,000,000)', 'Electronic Equipment ($150,000)'], exclusions: ['Product liability'], documents: ['BOP Binder', 'Lease Proof']
    },
    {
      id: 'UW-1040', customer: 'Eva Ward', product: 'Home Insurance', riskLevel: 'Low', riskScore: 18, premium: '$1,580', submitted: '3 weeks ago', status: 'Approved',
      requestedCoverage: '$350,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '18 Apr 2026',
      riskFactors: ['Suburban subdivision dwelling', 'Modern copper plumbing with backflow preventer', 'Clean loss history past 10 years'],
      coverages: ['Dwelling ($350,000)', 'Personal Property ($175,000)'], exclusions: ['Flood'], documents: ['Inspection Report', 'Approval Letter']
    },
    {
      id: 'UW-1041', customer: 'Felix Torres', product: 'Auto Insurance', riskLevel: 'Low', riskScore: 16, premium: '$990', submitted: '4 weeks ago', status: 'Approved',
      requestedCoverage: '$500,000 Combined Single Limit', deductible: '$500', effectiveDate: '20 Apr 2026',
      riskFactors: ['Single operator with clean driving record', 'Low annual mileage (<8,000 miles/yr)', 'Garage parked'],
      coverages: ['CSL Auto ($500k)', 'Comprehensive & Collision'], exclusions: ['Racing'], documents: ['MVR Report', 'Approval Signoff']
    },
    {
      id: 'UW-1042', customer: 'Grace Peterson', product: 'Commercial Property', riskLevel: 'Low', riskScore: 24, premium: '$2,850', submitted: '4 weeks ago', status: 'Approved',
      requestedCoverage: '$1,300,000 Retail Storefront', deductible: '$2,500', effectiveDate: '22 Apr 2026',
      riskFactors: ['Bookstore in commercial strip shopping center', 'Full automatic fire suppression sprinkler system', 'Clean 5-year claims experience'],
      coverages: ['Building ($1,300,000)', 'BPP ($350,000)'], exclusions: ['Flood'], documents: ['ACORD Form', 'Sprinkler Inspection']
    },
    {
      id: 'UW-1043', customer: 'Henry Gray', product: 'Home Insurance', riskLevel: 'Low', riskScore: 14, premium: '$1,620', submitted: '4 weeks ago', status: 'Approved',
      requestedCoverage: '$370,000 HO-3 Policy', deductible: '$1,000', effectiveDate: '25 Apr 2026',
      riskFactors: ['Single-family residence built 2019', 'Impact resistant roof shingles and storm gutters', 'No prior claims'],
      coverages: ['Dwelling ($370,000)', 'Personal Property ($185,000)', 'Liability ($500,000)'], exclusions: ['Flood', 'Earthquake'], documents: ['App Form', 'Binder Packet']
    },
    {
      id: 'UW-1044', customer: 'Isla Ramirez', product: 'Umbrella Liability', riskLevel: 'Low', riskScore: 12, premium: '$420', submitted: '4 weeks ago', status: 'Approved',
      requestedCoverage: '$1,500,000 Personal Umbrella', deductible: '$1,000', effectiveDate: '28 Apr 2026',
      riskFactors: ['Underlying policies with top tier rating verified', 'No high risk swimming pools or dangerous dog breeds', 'Zero liability claims'],
      coverages: ['Excess Liability ($1,500,000)'], exclusions: ['Business activities'], documents: ['Umbrella Binder', 'Underlying Dec Pages']
    },
    // 9 Medium Risk Approved
    {
      id: 'UW-1045', customer: 'Jacob James', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 35, premium: '$1,920', submitted: '4 weeks ago', status: 'Approved',
      requestedCoverage: '$410,000 HO-3 Coverage', deductible: '$1,500', effectiveDate: '01 May 2026',
      riskFactors: ['Property age: 22 years with new electrical panel (2022)', '1 weather claim 4 years ago resolved', 'Monitored security'],
      coverages: ['Dwelling ($410,000)', 'Contents ($205,000)'], exclusions: ['Flood'], documents: ['Electrical Certification', 'Approval Signoff']
    },
    {
      id: 'UW-1046', customer: 'Kayla Watson', product: 'Auto Insurance', riskLevel: 'Medium', riskScore: 32, premium: '$1,280', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$250k/$500k Auto Policy', deductible: '$500', effectiveDate: '01 May 2026',
      riskFactors: ['Clean MVR for 36 months after 1 minor non-moving infraction', 'Suburban driving territory', 'Anti-theft GPS equipped'],
      coverages: ['Liability ($250k/$500k)', 'Collision/Comp'], exclusions: ['Rideshare'], documents: ['MVR Clearance', 'Auto Policy Binder']
    },
    {
      id: 'UW-1047', customer: 'Lucas Brooks', product: 'Commercial Property', riskLevel: 'Medium', riskScore: 38, premium: '$3,200', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$1,600,000 Commercial Plaza', deductible: '$3,000', effectiveDate: '05 May 2026',
      riskFactors: ['Mixed-use commercial and professional building', 'Security cameras and centralized alarm monitoring', 'Clean 3-year loss history'],
      coverages: ['Building ($1,600,000)', 'BPP ($500,000)'], exclusions: ['Flood'], documents: ['Inspection Survey', 'Approved Dec Page']
    },
    {
      id: 'UW-1048', customer: 'Mia Kelly', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 36, premium: '$1,860', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$390,000 Residential HO-3', deductible: '$1,500', effectiveDate: '08 May 2026',
      riskFactors: ['Swimming pool with locking gate and safety cover verified', 'Roof replaced in 2021', 'Preferred credit tier 1'],
      coverages: ['Dwelling ($390,000)', 'Liability ($500,000)'], exclusions: ['Flood'], documents: ['Pool Inspection', 'Binder Packet']
    },
    {
      id: 'UW-1049', customer: 'Noah Sanders', product: 'Business Insurance', riskLevel: 'Medium', riskScore: 40, premium: '$2,450', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$1,000,000 Retail Store BOP', deductible: '$2,000', effectiveDate: '10 May 2026',
      riskFactors: ['General retail boutique in suburban shopping center', 'Fire extinguishers inspected and certified', 'Clean civil record'],
      coverages: ['General Liability ($1,000,000)', 'BPP ($300,000)'], exclusions: ['Off-premises power'], documents: ['BOP Application', 'Approval Letter']
    },
    {
      id: 'UW-1050', customer: 'Penelope Price', product: 'Auto Insurance', riskLevel: 'Medium', riskScore: 30, premium: '$1,190', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$300,000 CSL Auto', deductible: '$500', effectiveDate: '12 May 2026',
      riskFactors: ['Principal driver has clean record past 5 years', 'Vehicle equipped with forward collision warning and automatic braking', 'Garaged nightly'],
      coverages: ['CSL Auto ($300k)', 'Comprehensive & Collision'], exclusions: ['Track Racing'], documents: ['MVR Report', 'Policy Binder']
    },
    {
      id: 'UW-1051', customer: 'Quentin Bennett', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 34, premium: '$1,780', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$375,000 HO-3 Coverage', deductible: '$1,000', effectiveDate: '15 May 2026',
      riskFactors: ['Suburban home with smart security sensors', 'No claims in past 7 years', 'Roof inspected and certified in good order'],
      coverages: ['Dwelling ($375,000)', 'Personal Property ($185,000)'], exclusions: ['Flood'], documents: ['Home Survey', 'Approval Dec']
    },
    {
      id: 'UW-1052', customer: 'Ruby Wood', product: 'Commercial Property', riskLevel: 'Medium', riskScore: 42, premium: '$3,600', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$1,800,000 Commercial Office Building', deductible: '$5,000', effectiveDate: '18 May 2026',
      riskFactors: ['Multi-tenant professional office building', 'Sprinkler certified log current', 'Clean 5-year commercial claims history'],
      coverages: ['Building ($1,800,000)', 'BPP ($600,000)'], exclusions: ['Flood'], documents: ['ACORD Form', 'Inspection Signoff']
    },
    {
      id: 'UW-1053', customer: 'Thomas Barnes', product: 'Home Insurance', riskLevel: 'Medium', riskScore: 33, premium: '$1,820', submitted: '1 month ago', status: 'Approved',
      requestedCoverage: '$385,000 HO-3 Special Form', deductible: '$1,000', effectiveDate: '20 May 2026',
      riskFactors: ['Single family home with modern electrical panel and copper plumbing', 'Fenced yard and security cameras', 'Zero claims in 8 years'],
      coverages: ['Dwelling ($385,000)', 'Personal Property ($190,000)', 'Personal Liability ($500,000)'], exclusions: ['Flood', 'Earthquake'], documents: ['Application Form', 'Binder Packet']
    }
  ],

  // Agent Workspace Data (Aarav Sharma)
  agent: {
    id: 'AGT-1321',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@insureassist.com',
    initials: 'AS',
    title: 'Senior Licensed Broker · 18 Assigned Customers',
    stats: {
      assignedCustomers: 18,
      activePolicies: 32,
      upcomingRenewals: 5,
      annualPremiumPortfolio: '$48,650'
    }
  },

  // Assigned Customers to Agent Aarav Sharma (18 Complete Static Records)
  assignedCustomers: [
    {
      id: 'CUST-001',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '(555) 234-7890',
      address: '124 Grand Avenue, Suite 100, Springfield, IL 62701',
      city: 'Springfield',
      totalPolicies: 3,
      activePolicies: 3,
      nextRenewal: '45 days',
      renewalDate: '15 Mar 2027',
      policies: [
        { id: 'POL-002', type: 'Homeowners HO-3', status: 'Active', premium: '$1,840', deductible: '$1,000', expiry: '15 Mar 2027', category: 'Property' },
        { id: 'POL-001', type: 'Auto Comprehensive', status: 'Active', premium: '$1,260', deductible: 'Collision $500 / Comp $250', expiry: '02 Apr 2027', category: 'Vehicle' },
        { id: 'POL-004', type: 'Personal Umbrella', status: 'Active', premium: '$400', deductible: '$0 Retention', expiry: '01 Jun 2027', category: 'Commercial' }
      ],
      claims: [
        { id: 'CLM-2024-8831', date: '28 Aug 2025', type: 'Water Damage', amount: '$4,850', status: 'Settled', desc: 'Kitchen supply line burst causing floor water damage. Remediation completed and claim settled.' }
      ]
    },
    {
      id: 'CUST-002',
      name: 'John Carter',
      email: 'john.carter@email.com',
      phone: '(555) 456-1122',
      address: '742 Evergreen Terrace, Evanston, IL 60201',
      city: 'Evanston',
      totalPolicies: 2,
      activePolicies: 2,
      nextRenewal: '63 days',
      renewalDate: '02 Apr 2027',
      policies: [
        { id: 'POL-003', type: 'Auto Comprehensive', status: 'Active', premium: '$980', deductible: 'Collision $500 / Comp $250', expiry: '15 Jun 2027', category: 'Vehicle' },
        { id: 'POL-014', type: 'Homeowners HO-3', status: 'Active', premium: '$2,100', deductible: '$1,000', expiry: '02 Apr 2027', category: 'Property' }
      ],
      claims: [
        { id: 'CLM-2025-4421', date: '12 Jan 2026', type: 'Glass / Windshield', amount: '$350', status: 'Settled', desc: 'Highway pebble damage to front windshield. OEM glass replaced.' }
      ]
    },
    {
      id: 'CUST-003',
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '(555) 789-3344',
      address: '510 Main Street, Suite 3B, Naperville, IL 60540',
      city: 'Naperville',
      totalPolicies: 3,
      activePolicies: 3,
      nextRenewal: '20 days',
      renewalDate: '22 Apr 2027',
      policies: [
        { id: 'POL-015', type: 'Commercial General Liability', status: 'Active', premium: '$2,400', deductible: '$1,000', expiry: '22 Apr 2027', category: 'Specialty' },
        { id: 'POL-016', type: 'Business Property', status: 'Active', premium: '$3,200', deductible: '$2,500', expiry: '12 Jul 2027', category: 'Property' },
        { id: 'POL-017', type: 'Commercial Auto Fleet', status: 'Active', premium: '$4,100', deductible: '$1,000', expiry: '19 Sep 2027', category: 'Vehicle' }
      ],
      claims: []
    },
    {
      id: 'CUST-004',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '(555) 901-5566',
      address: '88 Pine Ridge Road, Oak Park, IL 60302',
      city: 'Oak Park',
      totalPolicies: 2,
      activePolicies: 2,
      nextRenewal: '90 days',
      renewalDate: '10 May 2027',
      policies: [
        { id: 'POL-018', type: 'Commercial Property', status: 'Active', premium: '$890', deductible: '$1,000', expiry: '10 May 2027', category: 'Commercial' },
        { id: 'POL-019', type: 'Condo Unit HO-6', status: 'Active', premium: '$750', deductible: '$500', expiry: '14 Aug 2027', category: 'Property' }
      ],
      claims: [
        { id: 'CLM-2025-1190', date: '04 Oct 2025', type: 'Water Backup', amount: '$1,200', status: 'Settled', desc: 'Basement sump pump power failure backup during thunderstorm.' }
      ]
    },
    {
      id: 'CUST-005',
      name: 'David Chen',
      email: 'david.chen@email.com',
      phone: '(555) 345-6789',
      address: '230 North Michigan Avenue, Apt 14B, Chicago, IL 60601',
      city: 'Chicago',
      totalPolicies: 3,
      activePolicies: 3,
      nextRenewal: '108 days',
      renewalDate: '28 May 2027',
      policies: [
        { id: 'POL-020', type: 'Watercraft & Boat Shield', status: 'Active', premium: '$650', deductible: '$500', expiry: '28 May 2027', category: 'Specialty' },
        { id: 'POL-021', type: 'Auto Comprehensive', status: 'Active', premium: '$1,450', deductible: '$500', expiry: '10 Nov 2027', category: 'Vehicle' },
        { id: 'POL-022', type: 'Homeowners HO-3', status: 'Active', premium: '$2,300', deductible: '$1,000', expiry: '05 Jan 2028', category: 'Property' }
      ],
      claims: []
    },
    {
      id: 'CUST-006',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@email.com',
      phone: '(555) 678-9012',
      address: '44 Woodfield Road, Schaumburg, IL 60173',
      city: 'Schaumburg',
      totalPolicies: 2,
      activePolicies: 2,
      nextRenewal: '142 days',
      renewalDate: '15 Jul 2027',
      policies: [
        { id: 'POL-023', type: 'Scheduled Jewelry Floater', status: 'Active', premium: '$420', deductible: '$0', expiry: '15 Jul 2027', category: 'Specialty' },
        { id: 'POL-024', type: 'Homeowners HO-3', status: 'Active', premium: '$1,950', deductible: '$1,000', expiry: '20 Oct 2027', category: 'Property' }
      ],
      claims: []
    },
    {
      id: 'CUST-007',
      name: 'Robert Martinez',
      email: 'robert.m@email.com',
      phone: '(555) 123-4567',
      address: '102 River Drive, Peoria, IL 61602',
      city: 'Peoria',
      totalPolicies: 2,
      activePolicies: 2,
      nextRenewal: '160 days',
      renewalDate: '01 Aug 2027',
      policies: [
        { id: 'POL-025', type: 'Auto Collision', status: 'Active', premium: '$1,100', deductible: '$500', expiry: '01 Aug 2027', category: 'Vehicle' },
        { id: 'POL-038', type: 'Personal Umbrella', status: 'Active', premium: '$400', deductible: '$0 Retention', expiry: '12 Sep 2027', category: 'Commercial' }
      ],
      claims: [
        { id: 'CLM-2024-9901', date: '19 Nov 2024', type: 'Collision Impact', amount: '$3,400', status: 'Settled', desc: 'Rear bumper fender repair following minor intersection incident.' }
      ]
    },
    {
      id: 'CUST-008',
      name: 'Amanda Wilson',
      email: 'amanda.w@email.com',
      phone: '(555) 234-5678',
      address: '90 Fox Valley Way, Aurora, IL 60504',
      city: 'Aurora',
      totalPolicies: 2,
      activePolicies: 2,
      nextRenewal: '185 days',
      renewalDate: '25 Aug 2027',
      policies: [
        { id: 'POL-026', type: 'Pet Comprehensive Health', status: 'Active', premium: '$480', deductible: '$250', expiry: '25 Aug 2027', category: 'Specialty' },
        { id: 'POL-027', type: 'Condo HO-6', status: 'Active', premium: '$860', deductible: '$500', expiry: '14 Dec 2027', category: 'Property' }
      ],
      claims: []
    },
    { id: 'CUST-009', name: 'Brian Anderson', email: 'brian.a@email.com', phone: '(555) 345-6780', address: '18 State Street, Rockford, IL 61101', city: 'Rockford', totalPolicies: 2, activePolicies: 2, nextRenewal: '210 days', renewalDate: '20 Sep 2027', policies: [{ id: 'POL-028', type: 'Business Owners Policy', status: 'Active', premium: '$720', deductible: '$1,000', expiry: '20 Sep 2027', category: 'Commercial' }, { id: 'POL-039', type: 'Commercial Property', status: 'Active', premium: '$1,800', deductible: '$2,500', expiry: '15 Oct 2027', category: 'Property' }], claims: [] },
    { id: 'CUST-010', name: 'Catherine Lee', email: 'catherine.l@email.com', phone: '(555) 456-7891', address: '400 Western Ave, Joliet, IL 60435', city: 'Joliet', totalPolicies: 2, activePolicies: 2, nextRenewal: '230 days', renewalDate: '10 Oct 2027', policies: [{ id: 'POL-029', type: 'Auto Comp', status: 'Active', premium: '$1,320', deductible: '$250', expiry: '10 Oct 2027', category: 'Vehicle' }, { id: 'POL-040', type: 'Personal Cyber Shield', status: 'Active', premium: '$320', deductible: '$0', expiry: '01 Nov 2027', category: 'Specialty' }], claims: [] },
    { id: 'CUST-011', name: 'Daniel White', email: 'daniel.w@email.com', phone: '(555) 567-8902', address: '75 Highland Ave, Elgin, IL 60120', city: 'Elgin', totalPolicies: 2, activePolicies: 2, nextRenewal: '250 days', renewalDate: '30 Oct 2027', policies: [{ id: 'POL-030', type: 'Homeowners HO-3', status: 'Active', premium: '$2,050', deductible: '$1,000', expiry: '30 Oct 2027', category: 'Property' }, { id: 'POL-041', type: 'Auto Comprehensive', status: 'Active', premium: '$1,150', deductible: '$500', expiry: '15 Nov 2027', category: 'Vehicle' }], claims: [] },
    { id: 'CUST-012', name: 'Elizabeth Harris', email: 'elizabeth.h@email.com', phone: '(555) 678-9013', address: '22 Lakefront Blvd, Waukegan, IL 60085', city: 'Waukegan', totalPolicies: 1, activePolicies: 1, nextRenewal: '270 days', renewalDate: '20 Nov 2027', policies: [{ id: 'POL-031', type: 'Umbrella Liability', status: 'Active', premium: '$450', deductible: '$0', expiry: '20 Nov 2027', category: 'Commercial' }], claims: [] },
    { id: 'CUST-013', name: 'George Clark', email: 'george.c@email.com', phone: '(555) 789-0124', address: '610 University Ave, Champaign, IL 61820', city: 'Champaign', totalPolicies: 1, activePolicies: 1, nextRenewal: '290 days', renewalDate: '10 Dec 2027', policies: [{ id: 'POL-032', type: 'Cyber Shield', status: 'Active', premium: '$310', deductible: '$0', expiry: '10 Dec 2027', category: 'Specialty' }], claims: [] },
    { id: 'CUST-014', name: 'Hannah Lewis', email: 'hannah.l@email.com', phone: '(555) 890-1235', address: '305 College Ave, Bloomington, IL 61701', city: 'Bloomington', totalPolicies: 1, activePolicies: 1, nextRenewal: '310 days', renewalDate: '30 Dec 2027', policies: [{ id: 'POL-033', type: 'Condo Unit', status: 'Active', premium: '$790', deductible: '$500', expiry: '30 Dec 2027', category: 'Property' }], claims: [] },
    { id: 'CUST-015', name: 'Ian Walker', email: 'ian.w@email.com', phone: '(555) 901-2346', address: '144 Prairie View, Decatur, IL 62521', city: 'Decatur', totalPolicies: 1, activePolicies: 1, nextRenewal: '320 days', renewalDate: '10 Jan 2028', policies: [{ id: 'POL-034', type: 'Auto Collision', status: 'Active', premium: '$1,150', deductible: '$500', expiry: '10 Jan 2028', category: 'Vehicle' }], claims: [] },
    { id: 'CUST-016', name: 'Julia Hall', email: 'julia.h@email.com', phone: '(555) 012-3457', address: '88 Oakton Street, Des Plaines, IL 60018', city: 'Des Plaines', totalPolicies: 1, activePolicies: 1, nextRenewal: '340 days', renewalDate: '30 Jan 2028', policies: [{ id: 'POL-035', type: 'Homeowners', status: 'Active', premium: '$1,920', deductible: '$1,000', expiry: '30 Jan 2028', category: 'Property' }], claims: [] },
    { id: 'CUST-017', name: 'Kevin Young', email: 'kevin.y@email.com', phone: '(555) 123-7890', address: '1200 Grove Ave, Berwyn, IL 60402', city: 'Berwyn', totalPolicies: 1, activePolicies: 1, nextRenewal: '350 days', renewalDate: '10 Feb 2028', policies: [{ id: 'POL-036', type: 'Commercial Auto', status: 'Active', premium: '$840', deductible: '$1,000', expiry: '10 Feb 2028', category: 'Commercial' }], claims: [] },
    { id: 'CUST-018', name: 'Laura King', email: 'laura.k@email.com', phone: '(555) 234-8901', address: '500 Lincoln Ave, Skokie, IL 60077', city: 'Skokie', totalPolicies: 1, activePolicies: 1, nextRenewal: '360 days', renewalDate: '20 Feb 2028', policies: [{ id: 'POL-037', type: 'Auto Comp', status: 'Active', premium: '$1,290', deductible: '$250', expiry: '20 Feb 2028', category: 'Vehicle' }], claims: [] }
  ],

  // Customer Personalized Policy Recommendations (Req)
  recommendations: [
    {
      id: 'REC-001',
      recommendation_id: 'REC-001',
      title: 'Umbrella Insurance',
      category: 'Coverage Recommendation',
      policy_type: 'Coverage Recommendation',
      tagClass: 'blue',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      description: 'Based on your existing Home and Auto coverage, you may consider additional liability protection.',
      reason: 'Your dwelling property ($450,000) and multi-vehicle assets exceed standard $300k liability limits.',
      action: 'Learn More →',
      overview: 'An Umbrella policy provides secondary liability protection that attaches above your primary Auto Comprehensive ($100k/$300k) and Homeowners HO-3 ($300k) liability limits.',
      benefits: [
        '$1,000,000 to $5,000,000 additional liability shield for catastrophic claims',
        'Full legal defense costs covered in addition to policy limits',
        'Worldwide personal liability coverage including travel and recreational activities'
      ],
      estimatedCost: '~$380 – $450 / year ($32/month)',
      primaryActionText: 'Request Agent Quote'
    },
    {
      id: 'REC-002',
      recommendation_id: 'REC-002',
      title: 'Coverage Review',
      category: 'Policy Optimization',
      policy_type: 'Policy Optimization',
      tagClass: 'amber',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      description: 'One of your policies is approaching renewal. Review your current coverage and deductible.',
      reason: 'Homeowners HO-3 (POL-002) renews in 45 days. Reviewing deductible can optimize your annual rate.',
      action: 'Review Policy →',
      overview: 'Your Homeowners HO-3 policy (POL-002) is scheduled for renewal on 15 Mar 2026 ($1,840/yr). Reviewing your $1,000 all-perils deductible and eligible bundling discounts ensures the most cost-effective protection.',
      benefits: [
        'Explore multi-policy discount potential with Auto Comprehensive (POL-001)',
        'Verify recent home security upgrades or roof inspection for premium credits',
        'Lock in guaranteed renewal rates prior to the 30-day notice window'
      ],
      estimatedCost: 'Potential $140 – $220/yr savings with deductible adjustment',
      primaryActionText: 'Review POL-002 Details'
    },
    {
      id: 'REC-003',
      recommendation_id: 'REC-003',
      title: 'Commercial Property',
      category: 'Business Protection',
      policy_type: 'Commercial Recommendation',
      tagClass: 'teal',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      description: 'Protect business structures, inventory, and office equipment against unforeseen physical property damage.',
      reason: 'Based on your multi-line assets, consider dedicated commercial property coverage for home office or business equipment.',
      action: 'Explore →',
      overview: 'Your active Commercial Property policy (POL-003) provides $500,000 building & inventory coverage with business income interruption protection.',
      benefits: [
        'Up to $500,000 structural and inventory replacement value protection',
        'Business income interruption coverage during covered building repairs',
        'Equipment breakdown and electronic data recovery riders included'
      ],
      estimatedCost: 'Currently $780 / year ($65/month)',
      primaryActionText: 'Review Commercial Details'
    }
  ],

  // Multi-Role AI Assistant Mock Conversations Repository (Role-Specific Contexts & Histories)
  roleAiChat: {
    customer: {
      activeConversationId: 'conv-cust-1',
      searchQuery: '',
      conversations: [
        {
          conversation_id: 'conv-cust-1',
          title: 'Understanding My Home Policy',
          created_at: '2026-03-28 10:30',
          updated_at: '2026-03-28 10:35',
          messages: [
            { message_id: 'msg-c1', conversation_id: 'conv-cust-1', sender: 'user', content: 'What does my home insurance cover?', timestamp: '10:30 AM' },
            { message_id: 'msg-c2', conversation_id: 'conv-cust-1', sender: 'bot', content: 'Your sample Home Insurance policy includes dwelling ($450,000), personal property ($225,000), liability ($300,000), and loss-of-use coverage.', timestamp: '10:30 AM', source: 'Policy Information', confidence: '94%' },
            { message_id: 'msg-c3', conversation_id: 'conv-cust-1', sender: 'user', content: 'What is my deductible?', timestamp: '10:32 AM' },
            { message_id: 'msg-c4', conversation_id: 'conv-cust-1', sender: 'bot', content: 'Your current sample policy has a $1,000 all-perils deductible and a $2,500 wind/hail deductible.', timestamp: '10:32 AM', source: 'Policy Information', confidence: '96%' }
          ]
        },
        {
          conversation_id: 'conv-cust-2',
          title: 'Auto Insurance Coverage',
          created_at: '2026-03-26 14:15',
          updated_at: '2026-03-26 14:20',
          messages: [
            { message_id: 'msg-c5', conversation_id: 'conv-cust-2', sender: 'user', content: 'Does my auto policy include liability coverage?', timestamp: '2:15 PM' },
            { message_id: 'msg-c6', conversation_id: 'conv-cust-2', sender: 'bot', content: 'Your sample Auto Insurance policy includes bodily injury liability ($100k/$300k), collision ($500 ded.), and comprehensive coverage ($250 ded.).', timestamp: '2:15 PM', source: 'Policy Information', confidence: '95%' }
          ]
        },
        {
          conversation_id: 'conv-cust-3',
          title: 'Policy Renewal Question',
          created_at: '2026-03-24 09:00',
          updated_at: '2026-03-24 09:05',
          messages: [
            { message_id: 'msg-c7', conversation_id: 'conv-cust-3', sender: 'user', content: 'When is my policy renewal?', timestamp: '9:00 AM' },
            { message_id: 'msg-c8', conversation_id: 'conv-cust-3', sender: 'bot', content: 'Your sample policy is scheduled for renewal in 45 days (March 15, 2026).', timestamp: '9:00 AM', source: 'Policy Information', confidence: '98%' }
          ]
        },
        {
          conversation_id: 'conv-cust-4',
          title: 'Understanding Deductible',
          created_at: '2026-03-20 16:40',
          updated_at: '2026-03-20 16:45',
          messages: [
            { message_id: 'msg-c9', conversation_id: 'conv-cust-4', sender: 'user', content: 'What is my deductible?', timestamp: '4:40 PM' },
            { message_id: 'msg-c10', conversation_id: 'conv-cust-4', sender: 'bot', content: 'Your current sample deductible is $1,000 for standard property losses.', timestamp: '4:40 PM', source: 'Policy Information', confidence: '97%' }
          ]
        },
        {
          conversation_id: 'conv-cust-5',
          title: 'Water Backup Protection',
          created_at: '2026-03-15 15:10',
          updated_at: '2026-03-15 15:15',
          messages: [
            { message_id: 'msg-c11', conversation_id: 'conv-cust-5', sender: 'user', content: 'Are water backups covered under standard home insurance?', timestamp: '3:10 PM' },
            { message_id: 'msg-c12', conversation_id: 'conv-cust-5', sender: 'bot', content: 'Standard HO-3 excludes sewer/drain backup unless an endorsement is attached. Your sample portfolio includes an active Water Backup Rider providing up to $25,000 in coverage.', timestamp: '3:10 PM', source: 'Policy Information', confidence: '95%' }
          ]
        }
      ]
    },
    agent: {
      activeConversationId: 'conv-agent-1',
      searchQuery: '',
      conversations: [
        {
          conversation_id: 'conv-agent-1',
          title: 'Sarah Mitchell Portfolio Review',
          created_at: '2026-03-29 11:00',
          updated_at: '2026-03-29 11:15',
          messages: [
            { message_id: 'msg-a1', conversation_id: 'conv-agent-1', sender: 'user', content: 'Summarize Sarah Mitchell\'s active policies and upcoming renewal dates.', timestamp: '11:00 AM' },
            { message_id: 'msg-a2', conversation_id: 'conv-agent-1', sender: 'bot', content: 'Sarah Mitchell (CUST-001) holds 12 total active policies with $4,840/yr total premium portfolio. Her Homeowners HO-3 (POL-002, $1,840/yr) renews in 45 days. Her Auto Comprehensive (POL-001, $1,260/yr) renews in 60 days.', timestamp: '11:01 AM', source: 'Agency Portfolio Ledger', confidence: '96%' }
          ]
        },
        {
          conversation_id: 'conv-agent-2',
          title: 'Emily Johnson Commercial Renewal',
          created_at: '2026-03-27 14:30',
          updated_at: '2026-03-27 14:45',
          messages: [
            { message_id: 'msg-a3', conversation_id: 'conv-agent-2', sender: 'user', content: 'Show coverage limits for Emily Johnson\'s commercial policy', timestamp: '2:30 PM' },
            { message_id: 'msg-a4', conversation_id: 'conv-agent-2', sender: 'bot', content: 'Emily Johnson (CUST-003) has 3 active commercial policies totaling $9,700/yr. Her Commercial General Liability policy is approaching renewal in 20 days (April 22, 2027) with $1,000,000 per-occurrence limit.', timestamp: '2:31 PM', source: 'Agency Portfolio Ledger', confidence: '95%' }
          ]
        },
        {
          conversation_id: 'conv-agent-3',
          title: 'Upcoming 90-Day Renewal Pipeline',
          created_at: '2026-03-25 09:20',
          updated_at: '2026-03-25 09:35',
          messages: [
            { message_id: 'msg-a5', conversation_id: 'conv-agent-3', sender: 'user', content: 'Which clients have renewals in the next 30 days?', timestamp: '9:20 AM' },
            { message_id: 'msg-a6', conversation_id: 'conv-agent-3', sender: 'bot', content: 'Across your 18 assigned clients, 5 policies are approaching renewal in the next 90 days: Sarah Mitchell (Home), John Carter (Auto), Emily Johnson (Commercial), Michael Brown (Commercial Property), and David Chen (Boat).', timestamp: '9:21 AM', source: 'Agency Portfolio Ledger', confidence: '98%' }
          ]
        },
        {
          conversation_id: 'conv-agent-4',
          title: 'High-Value Customer Book Breakdown',
          created_at: '2026-03-22 16:10',
          updated_at: '2026-03-22 16:25',
          messages: [
            { message_id: 'msg-a7', conversation_id: 'conv-agent-4', sender: 'user', content: 'What is my total commercial book value?', timestamp: '4:10 PM' },
            { message_id: 'msg-a8', conversation_id: 'conv-agent-4', sender: 'bot', content: 'Your assigned book of business consists of 18 active clients, 32 total policies, and an annual premium portfolio of $48,650 (Home: 38%, Auto: 31%, Commercial: 20%, Umbrella: 11%).', timestamp: '4:11 PM', source: 'Agency Portfolio Ledger', confidence: '97%' }
          ]
        }
      ]
    },
    underwriter: {
      activeConversationId: 'conv-uw-1',
      searchQuery: '',
      conversations: [
        {
          conversation_id: 'conv-uw-1',
          title: 'APP-8802 High-Risk Review',
          created_at: '2026-03-29 13:00',
          updated_at: '2026-03-29 13:20',
          messages: [
            { message_id: 'msg-u1', conversation_id: 'conv-uw-1', sender: 'user', content: 'Review risk score factors for APP-8802', timestamp: '1:00 PM' },
            { message_id: 'msg-u2', conversation_id: 'conv-uw-1', sender: 'bot', content: 'Application UW-1002 (John Carter) is rated High Risk (Score 78) due to 2 recent speeding violations within 24 months, high vehicle horsepower (BMW M340i), and aggressive braking telematics score (62/100).', timestamp: '1:01 PM', source: 'Underwriting Risk Model', confidence: '96%' }
          ]
        },
        {
          conversation_id: 'conv-uw-2',
          title: 'Tier 3 Coastal Property Guidelines',
          created_at: '2026-03-26 10:15',
          updated_at: '2026-03-26 10:30',
          messages: [
            { message_id: 'msg-u3', conversation_id: 'conv-uw-2', sender: 'user', content: 'What are the Tier 3 property exposure guidelines?', timestamp: '10:15 AM' },
            { message_id: 'msg-u4', conversation_id: 'conv-uw-2', sender: 'bot', content: 'Tier 3 exposure guidelines require minimum 5% named hurricane deductible, mandatory hurricane shutter verification, and exclusion of exterior unattached structures without separate rating.', timestamp: '10:16 AM', source: 'Underwriting Guidelines Tier 3', confidence: '94%' }
          ]
        },
        {
          conversation_id: 'conv-uw-3',
          title: 'Commercial Auto Loss Runs',
          created_at: '2026-03-23 15:40',
          updated_at: '2026-03-23 15:55',
          messages: [
            { message_id: 'msg-u5', conversation_id: 'conv-uw-3', sender: 'user', content: 'What is the loss ratio threshold for commercial auto?', timestamp: '3:40 PM' },
            { message_id: 'msg-u6', conversation_id: 'conv-uw-3', sender: 'bot', content: 'Standard target 3-year loss ratio threshold for commercial auto fleets is < 55%. Accounts exceeding 65% loss ratio require senior underwriter referral and safety telematics mandatory mandate.', timestamp: '3:41 PM', source: 'Underwriting Guidelines', confidence: '97%' }
          ]
        }
      ]
    },
    admin: {
      activeConversationId: 'conv-admin-1',
      searchQuery: '',
      conversations: [
        {
          conversation_id: 'conv-admin-1',
          title: 'Enterprise RBAC Role Privilege Audit',
          created_at: '2026-03-30 09:00',
          updated_at: '2026-03-30 09:20',
          messages: [
            { message_id: 'msg-adm1', conversation_id: 'conv-admin-1', sender: 'user', content: 'What are the RBAC permissions for Underwriters?', timestamp: '9:00 AM' },
            { message_id: 'msg-adm2', conversation_id: 'conv-admin-1', sender: 'bot', content: 'Underwriter role has permissions to: view submissions queue, execute risk score evaluations, request loss runs, approve/bind policies up to $5.0M authority, and attach standard exclusion riders.', timestamp: '9:01 AM', source: 'System Governance Matrix', confidence: '98%' }
          ]
        },
        {
          conversation_id: 'conv-admin-2',
          title: 'System Users by Status',
          created_at: '2026-03-28 11:30',
          updated_at: '2026-03-28 11:45',
          messages: [
            { message_id: 'msg-adm3', conversation_id: 'conv-admin-2', sender: 'user', content: 'How many users are currently in Pending status?', timestamp: '11:30 AM' },
            { message_id: 'msg-adm4', conversation_id: 'conv-admin-2', sender: 'bot', content: 'Currently 1 user (USR-012, Rachel Green) is in Pending status awaiting identity verification. 247 other enterprise accounts are fully Active.', timestamp: '11:31 AM', source: 'User Directory Ledger', confidence: '99%' }
          ]
        },
        {
          conversation_id: 'conv-admin-3',
          title: 'Enterprise Policy Totals',
          created_at: '2026-03-25 14:00',
          updated_at: '2026-03-25 14:15',
          messages: [
            { message_id: 'msg-adm5', conversation_id: 'conv-admin-3', sender: 'user', content: 'Summarize enterprise policy count by category', timestamp: '2:00 PM' },
            { message_id: 'msg-adm6', conversation_id: 'conv-admin-3', sender: 'bot', content: 'The enterprise policy registry holds 426 total policies (378 active): Property (148), Vehicle (124), Commercial (96), and Specialty Lines (58), totaling $1.42M annual in-force portfolio.', timestamp: '2:01 PM', source: 'Enterprise Policy Ledger', confidence: '97%' }
          ]
        }
      ]
    }
  },

  // Customer Persistent Policies from API
  customerPolicies: [],

  glossary: [
    { term: 'Deductible', definition: 'The amount of money you pay out-of-pocket on an insured loss before the insurance company pays any expenses.', example: 'If a storm causes $4,000 in roof damage and your deductible is $1,000, you pay $1,000 and your insurer covers the remaining $3,000.' },
    { term: 'Premium', definition: 'The recurring amount of money paid to an insurance company in exchange for insurance coverage.', example: 'Sarah pays an annual premium of $1,840 for her homeowners policy, billed in monthly installments.' },
    { term: 'Liability Coverage', definition: 'Coverage that protects you against financial loss if you are found legally responsible for injuring someone or damaging property.', example: 'If a guest slips on your property and incurs medical bills, liability coverage helps pay legal expenses and settlements.' },
    { term: 'Exclusion', definition: 'Specific events, perils, damages, or circumstances listed in a policy that the insurer will not pay for.', example: 'Most standard homeowners policies exclude flood and earthquake damage unless added via a separate endorsement.' },
    { term: 'Endorsement / Rider', definition: 'An amendment or addition to a standard insurance policy that modifies, broadens, or restricts coverage terms.', example: 'Sarah has an optional Water Backup Endorsement attached to her Homeowners HO-3 policy.' },
    { term: 'Umbrella Policy', definition: 'Secondary liability insurance that provides extra coverage beyond the limits of regular home and auto policies.', example: 'If an auto accident claim exceeds your $300,000 limit, your $1,000,000 umbrella policy covers the remainder.' }
  ],

  scenarios: {
    pipe: { covered: true, title: 'Covered under Homeowners HO-3', desc: 'Sudden and accidental water discharge from a plumbing system is covered.', reason: 'Sudden and accidental water damage caused by a burst pipe inside the dwelling is a standard covered peril. Your $1,000 deductible applies.', clause: '"We insure for direct physical loss to property described in Coverage A caused by accidental discharge of water or steam from within a plumbing system." — Section I Perils', ref: 'POL-002 (Homeowners HO-3) · Section I Perils Insured Against #17' },
    theft: { covered: true, title: 'Covered under Personal Property (Coverage C)', desc: 'Personal property theft is covered anywhere worldwide.', reason: 'Theft of personal belongings (laptops, electronics, jewelry subject to category limits) is covered worldwide under Coverage C, minus your $1,000 deductible.', clause: '"We insure for direct physical loss to personal property caused by theft, including property stolen away from the residence premises." — Coverage C', ref: 'POL-002 (Homeowners HO-3) · Section I Coverage C' },
    flood: { covered: true, title: 'Covered under Supplemental NFIP (POL-011)', desc: 'External flood coverage is active under your dedicated NFIP policy.', reason: 'While excluded from base HO-3, your portfolio has an active Supplemental NFIP Flood Policy (POL-011) covering up to $250k structure & $100k contents.', clause: '"We insure for direct physical loss by or from flood as defined herein." — NFIP Policy Contract', ref: 'POL-011 (Flood NFIP Supplemental) · Section I' },
    accident: { covered: true, title: 'Covered under Auto Comprehensive', desc: 'Liability and collision protections apply up to policy limits.', reason: 'Auto liability protects bodily injury ($100k/$300k) and property damage ($100k). Collision covers repair of your vehicle after your $500 deductible.', clause: '"We will pay damages for bodily injury or property damage for which any insured becomes legally responsible because of an auto accident." — Part A Liability', ref: 'POL-001 (Auto Comprehensive) · Part A & Part B' },
    medical: { covered: false, title: 'Not Covered for International Travel', desc: 'Domestic policies do not cover international medical emergency costs abroad.', reason: 'Auto medical payments and domestic personal policies only cover incidents within the US/Canada. International travel medical insurance is needed for overseas trips.', clause: 'Territory definition: "Covered territory includes the United States, its territories and possessions, and Canada." — General Policy Provisions', ref: 'Standard Territorial Limitation — Dedicated Travel Policy Required' },
    default: { covered: true, title: 'Likely Covered (Subject to Policy Review)', desc: 'Sudden and accidental damages are typically covered under standard perils.', reason: 'Based on your portfolio, this event may qualify under standard perils. Review specific deductible and proof of loss requirements.', clause: 'Coverage depends on specific cause of loss. Refer to declarations page and Section I perils.', ref: 'POL-002 (Homeowners HO-3) · General Terms' }
  },

  // Admin Platform Governance Data (Req 1, 4, 6, 9, 10, 11)
  admin: {
    id: 'ADM-001',
    name: 'Jordan Taylor',
    email: 'admin@insureassist.com',
    initials: 'AD',
    title: 'Chief System Administrator · Platform Governance',
    stats: {
      totalUsers: 248,
      totalCustomers: 180,
      totalAgents: 32,
      totalUnderwriters: 24,
      totalPolicies: 426,
      activePolicies: 378
    }
  },

  // System-Wide Users Directory (248 Total Registered, 12 Detailed in Mock Table)
  users: [
    { id: 'USR-001', name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', phone: '(555) 234-5678', role: 'Customer', status: 'Active', created: 'Jan 12, 2026', assignedInfo: 'Assigned Agent: Alex Rivera (AGT-401-92)', policiesCount: 12 },
    { id: 'USR-002', name: 'Alex Rivera', email: 'alex.rivera@insureassist.com', phone: '(555) 892-4411', role: 'Agent', status: 'Active', created: 'Jan 10, 2026', assignedInfo: 'Assigned Customers: 18 Active Client Accounts', policiesCount: 32 },
    { id: 'USR-003', name: 'Alex Vance', email: 'alex.vance@insureassist.com', phone: '(555) 901-4433', role: 'Underwriter', status: 'Active', created: 'Jan 08, 2026', assignedInfo: 'Pending Reviews: 14 Active Applications', policiesCount: 53 },
    { id: 'USR-004', name: 'Jordan Taylor', email: 'admin@insureassist.com', phone: '(555) 019-2831', role: 'Admin', status: 'Active', created: 'Oct 15, 2025', assignedInfo: 'System Administrator (Root Authority)', policiesCount: 426 },
    { id: 'USR-005', name: 'John Carter', email: 'john.carter@email.com', phone: '(555) 345-6789', role: 'Customer', status: 'Active', created: 'Jan 14, 2026', assignedInfo: 'Assigned Agent: Alex Rivera (AGT-401-92)', policiesCount: 2 },
    { id: 'USR-006', name: 'Emily Johnson', email: 'emily.johnson@email.com', phone: '(555) 456-7890', role: 'Customer', status: 'Active', created: 'Jan 18, 2026', assignedInfo: 'Assigned Agent: Alex Rivera (AGT-401-92)', policiesCount: 3 },
    { id: 'USR-007', name: 'Maria Smith', email: 'maria.smith@insureassist.com', phone: '(555) 678-1234', role: 'Agent', status: 'Active', created: 'Jan 05, 2026', assignedInfo: 'Assigned Customers: 22 Active Client Accounts', policiesCount: 45 },
    { id: 'USR-008', name: 'Michael Brown', email: 'michael.brown@email.com', phone: '(555) 567-8901', role: 'Customer', status: 'Active', created: 'Feb 01, 2026', assignedInfo: 'Assigned Agent: Maria Smith (AGT-302-14)', policiesCount: 2 },
    { id: 'USR-009', name: 'Diana Reyes', email: 'diana.reyes@insureassist.com', phone: '(555) 888-9900', role: 'Underwriter', status: 'Active', created: 'Dec 12, 2025', assignedInfo: 'Chief Underwriting Officer · Authority $5.0M', policiesCount: 120 },
    { id: 'USR-010', name: 'David Chen', email: 'david.chen@email.com', phone: '(555) 678-9012', role: 'Customer', status: 'Active', created: 'Feb 10, 2026', assignedInfo: 'Assigned Agent: Alex Rivera (AGT-401-92)', policiesCount: 2 },
    { id: 'USR-011', name: 'Marcus Brody', email: 'marcus.brody@insureassist.com', phone: '(555) 234-8899', role: 'Admin', status: 'Active', created: 'Nov 02, 2025', assignedInfo: 'Security & Audit Officer', policiesCount: 426 },
    { id: 'USR-012', name: 'Rachel Green', email: 'rachel.green@email.com', phone: '(555) 901-2345', role: 'Customer', status: 'Pending', created: 'Mar 25, 2026', assignedInfo: 'Assigned Agent: Maria Smith (Pending ID Verification)', policiesCount: 1 }
  ],

  // System-Wide Policies Ledger (426 Total Policies, Sample Detailed for Table)
  allPolicies: [
    { id: 'POL-001', customer: 'Sarah Mitchell', type: 'Homeowners HO-3', status: 'Active', premium: '$1,840/yr', agent: 'Alex Rivera', effective: '15 Mar 2025', expiry: '15 Mar 2026', deductible: '$1,000' },
    { id: 'POL-002', customer: 'Sarah Mitchell', type: 'Auto Comprehensive', status: 'Active', premium: '$1,260/yr', agent: 'Alex Rivera', effective: '02 Apr 2025', expiry: '02 Apr 2026', deductible: '$500' },
    { id: 'POL-003', customer: 'John Carter', type: 'Auto Shield 2024', status: 'Active', premium: '$980/yr', agent: 'Alex Rivera', effective: '15 Jun 2025', expiry: '15 Jun 2026', deductible: '$500' },
    { id: 'POL-004', customer: 'Emily Johnson', type: 'Commercial Liability', status: 'Active', premium: '$2,400/yr', agent: 'Alex Rivera', effective: '22 Apr 2025', expiry: '22 Apr 2026', deductible: '$1,500' },
    { id: 'POL-005', customer: 'Emily Johnson', type: 'Business Property', status: 'Active', premium: '$4,200/yr', agent: 'Alex Rivera', effective: '10 May 2025', expiry: '10 May 2026', deductible: '$2,500' },
    { id: 'POL-006', customer: 'Michael Brown', type: 'Commercial Property', status: 'Pending', premium: '$890/yr', agent: 'Maria Smith', effective: 'Pending Review', expiry: 'Pending', deductible: '$1,000' },
    { id: 'POL-007', customer: 'David Chen', type: 'Watercraft & Boat', status: 'Active', premium: '$650/yr', agent: 'Alex Rivera', effective: '28 May 2025', expiry: '28 May 2026', deductible: '$500' },
    { id: 'POL-008', customer: 'Rachel Green', type: 'Condo Unit HO-6', status: 'Pending', premium: '$790/yr', agent: 'Maria Smith', effective: 'Pending Binding', expiry: 'Pending', deductible: '$500' },
    { id: 'POL-009', customer: 'Sarah Mitchell', type: 'Personal Umbrella', status: 'Active', premium: '$400/yr', agent: 'Alex Rivera', effective: '01 Jun 2025', expiry: '01 Jun 2026', deductible: '$0' },
    { id: 'POL-010', customer: 'Robert Martinez', type: 'Cyber Defense Enterprise', status: 'Active', premium: '$3,800/yr', agent: 'Maria Smith', effective: '01 Jan 2025', expiry: '01 Jan 2026', deductible: '$2,000' }
  ],

  // Audit & Monitoring Activity Logs (Req 11)
  auditLogs: [
    { time: 'Today, 9:15 AM', user: 'Alex Rivera', role: 'Agent', action: 'User logged in to Agent Workspace', meta: 'Web Terminal · Chrome Windows · IP: 106.51.72.19 (Hyderabad, India)' },
    { time: 'Today, 9:05 AM', user: 'Jordan Taylor', role: 'Admin', action: 'Created new user account USR-0248 (David Vance)', meta: 'Provisioned with Underwriter role · RBAC Group: Midwest Risk Unit' },
    { time: 'Yesterday, 5:40 PM', user: 'Alex Vance', role: 'Underwriter', action: 'Underwriting application UW-1004 approved & bound', meta: 'Applicant: Michael Brown · Commercial Property Policy POL-2024-9104 · $4,200/yr' },
    { time: 'Yesterday, 4:15 PM', user: 'Alex Rivera', role: 'Agent', action: 'Customer policy POL-002 endorsement updated', meta: 'Policyholder: Sarah Mitchell · Added Water Backup Rider ($45/yr)' },
    { time: 'Yesterday, 11:20 AM', user: 'Sarah Mitchell', role: 'Customer', action: 'Executed Coverage Checker inquiry for water damage event', meta: 'Inquiry: "Burst pipe in basement" · Policy Ref: POL-002 (Covered)' },
    { time: 'Mar 30, 2:45 PM', user: 'Jordan Taylor', role: 'Admin', action: 'RBAC Security Matrix verified and audited', meta: '4 Roles Audited: Customer (180), Agent (32), Underwriter (24), Admin (12)' },
    { time: 'Mar 29, 6:10 PM', user: 'Diana Reyes', role: 'Underwriter', action: 'Requested additional information on application UW-1004', meta: 'Dispatched notification to Broker for commercial fire sprinkler inspection report' }
  ],

  // Enterprise Roles (RBAC) Data Store
  roles: [
    {
      id: 'customer',
      name: 'Customer',
      subtitle: 'Policyholder User',
      userCount: 180,
      badgeStyle: 'background:var(--blue-50);color:var(--blue-800);',
      iconBg: 'background:var(--blue-50);color:var(--blue-600);',
      iconSvg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      description: 'End-user insurance consumers who own, view, and manage individual insurance policies.',
      permissions: [
        'View Personal Portfolio Dashboard',
        'View Own Insurance Policies',
        'Compare Coverage & Endorsements',
        'Download Digital Policy Documents',
        'Access Policy AI Assistant'
      ]
    },
    {
      id: 'agent',
      name: 'Agent',
      subtitle: 'Client Advisory Broker',
      userCount: 32,
      badgeStyle: 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;',
      iconBg: 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;',
      iconSvg: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      description: 'Licensed insurance advisors managing client advisory portfolios, renewals, and accounts.',
      permissions: [
        'View Business Book KPI Metrics',
        'View Assigned Customer Policies',
        'Compare Coverage & Endorsements',
        'View Client Contact Records',
        'Manage Renewal Alerts & Reminders',
        'Log Customer Advisory Notes',
        'Access Advisory AI Assistant'
      ]
    },
    {
      id: 'underwriter',
      name: 'Underwriter',
      subtitle: 'Risk Assessment Officer',
      userCount: 24,
      badgeStyle: 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;',
      iconBg: 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;',
      iconSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
      description: 'Risk analysts evaluating intake queues, hazard scoring models, and binding decisions.',
      permissions: [
        'View Underwriting Loss Runs & Tiers',
        'View Application Intake Queue',
        'Evaluate Risk Factors & Loss Ratios',
        'Approve / Bind Insurance Applications',
        'Issue Requests for Information (RFI)',
        'Reject High-Risk Applications',
        'Access Underwriter Risk AI Assistant'
      ]
    },
    {
      id: 'admin',
      name: 'Admin',
      subtitle: 'System Governance & Security',
      userCount: 12,
      badgeStyle: 'background:#0f172a;color:#ffffff;',
      iconBg: 'background:#0f172a;color:#ffffff;',
      iconSvg: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      description: 'Platform administrators with unrestricted enterprise user, RBAC, and policy governance.',
      permissions: [
        'View Platform Enterprise System Overview',
        'View User Directory',
        'Create & Provision New Accounts',
        'View Enterprise Global Policy Ledger',
        'Access Admin Governance AI Assistant',
        'Access System Audit Trail & Logs',
        'Configure Role RBAC & Permissions',
        'Manage Authentication & Security Toggles'
      ]
    }
  ]
};

/**
 * MASTER RBAC CATEGORIZED PERMISSIONS
 */
const RBAC_PERMISSION_CATEGORIES = [
  {
    category: 'Dashboard & Overview',
    permissions: [
      { name: 'View Personal Portfolio Dashboard', desc: 'Access consumer overview & policy breakdown' },
      { name: 'View Business Book KPI Metrics', desc: 'Access agency premium & renewal analytics' },
      { name: 'View Underwriting Loss Runs & Tiers', desc: 'Access loss ratios, risk scores & pipeline insights' },
      { name: 'View Platform Enterprise System Overview', desc: 'Access enterprise counts & directory overview' }
    ]
  },
  {
    category: 'User Management',
    permissions: [
      { name: 'View User Directory', desc: 'Browse enterprise identity roster & status' },
      { name: 'Create & Provision New Accounts', desc: 'Create new users with assigned credentials' },
      { name: 'Edit User Profiles & Contact Data', desc: 'Modify email, phone & profile parameters' },
      { name: 'Deactivate & Suspend User Accounts', desc: 'Temporarily lock or terminate access' }
    ]
  },
  {
    category: 'Policy Management',
    permissions: [
      { name: 'View Own Insurance Policies', desc: 'Access personal policies and declarations' },
      { name: 'View Assigned Customer Policies', desc: 'Inspect policy schedules in advisor portfolio' },
      { name: 'View Enterprise Global Policy Ledger', desc: 'Access all system-wide active/pending contracts' },
      { name: 'Compare Coverage & Endorsements', desc: 'Side-by-side policy terms & rider analysis' },
      { name: 'Download Digital Policy Documents', desc: 'Export PDF endorsements and schedules' }
    ]
  },
  {
    category: 'Underwriting',
    permissions: [
      { name: 'View Application Intake Queue', desc: 'Inspect incoming underwriting applications' },
      { name: 'Evaluate Risk Factors & Loss Ratios', desc: 'Review hazard scores & actuarial metrics' },
      { name: 'Approve / Bind Insurance Applications', desc: 'Grant binding authority on approved files' },
      { name: 'Issue Requests for Information (RFI)', desc: 'Request additional documentation from brokers' },
      { name: 'Reject High-Risk Applications', desc: 'Decline submissions exceeding tolerance tiers' }
    ]
  },
  {
    category: 'Customer Management',
    permissions: [
      { name: 'View Client Contact Records', desc: 'Access assigned customer profile records' },
      { name: 'Manage Renewal Alerts & Reminders', desc: 'Dispatch upcoming renewal notifications' },
      { name: 'Log Customer Advisory Notes', desc: 'Add CRM advisory interactions & client logs' }
    ]
  },
  {
    category: 'AI Assistant',
    permissions: [
      { name: 'Access Policy AI Assistant', desc: 'Interact with consumer policy AI assistant' },
      { name: 'Access Advisory AI Assistant', desc: 'Interact with broker agency advisory AI' },
      { name: 'Access Underwriter Risk AI Assistant', desc: 'Interact with actuarial underwriting AI' },
      { name: 'Access Admin Governance AI Assistant', desc: 'Interact with system governance AI' }
    ]
  },
  {
    category: 'Reports & Monitoring',
    permissions: [
      { name: 'Generate Premium & Revenue Reports', desc: 'Export book revenue & distribution summaries' },
      { name: 'Export Policy Book Performance Data', desc: 'Download CSV portfolio datasets' },
      { name: 'Access System Audit Trail & Logs', desc: 'Inspect immutable enterprise security logs' }
    ]
  },
  {
    category: 'Administration',
    permissions: [
      { name: 'Configure Role RBAC & Permissions', desc: 'Manage access control matrices & roles' },
      { name: 'Manage Authentication & Security Toggles', desc: 'Configure MFA, timeouts & logging' },
      { name: 'Manage Global Platform Settings', desc: 'Adjust platform configuration & environment defaults' }
    ]
  }
];

/**
 * MOCK AI CHATBOT RESPONSES (MULTI-ROLE ENGINE)
 */

function getAuthToken() {
  return (typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('auth_token')
    : null) ||
    (typeof localStorage !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null);
}

function getAuthHeaders() {
  const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_token') : null) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

const MOCK_AI_RESPONSES = {
  customer: [
    { keywords: ['home', 'what does my home insurance cover', 'home insurance', 'house'], text: 'Your sample Home Insurance policy includes dwelling, personal property, liability, and loss-of-use coverage.' },
    { keywords: ['deductible', 'what is a deductible', 'deductibles', 'what is my deductible'], text: 'Your current sample deductible is $1,000.' },
    { keywords: ['include liability', 'does my auto policy include liability', 'auto liability'], text: 'Your sample Auto Insurance policy includes liability coverage subject to the policy limits and terms.' },
    { keywords: ['auto', 'auto policy', 'car', 'vehicle', 'what does my auto policy cover'], text: 'Your sample Auto Insurance policy includes collision, comprehensive, bodily injury liability ($100k/$300k), and 24/7 roadside assistance.' },
    { keywords: ['renewal', 'renewals', 'renew', 'when is my renewal', 'when is my policy renewal', 'when does my policy expire'], text: 'Your sample policy is scheduled for renewal in 45 days.' },
    { keywords: ['exclusion', 'exclusions', 'what are my exclusions', 'explain my exclusions', 'what is excluded'], text: 'Standard policy exclusions on your sample policies include external surface flood, earthquake earth movement, intentional criminal acts, and standard wear & tear.' },
    { keywords: ['compare', 'compare my policies', 'comparing', 'difference'], text: 'You can compare any two policies side-by-side in the Policy Comparison tab. For instance, your Homeowners policy ($1,840/yr) covers real property while your Auto policy covers vehicular collision and bodily injury.' },
    { keywords: ['liability', 'what does liability coverage mean', 'liability coverage', 'liability meaning'], text: 'Liability coverage protects you financially if you are found legally responsible for property damage or bodily injuries caused to others. Your Homeowners policy provides $300,000 personal liability, and your Auto policy provides $100k/$300k bodily injury liability.' },
    { keywords: ['cover', 'coverage', 'what does my policy cover', 'what is covered'], text: 'Your active policies cover your residential dwelling ($450k), personal property ($225k), vehicles, commercial property, and umbrella liability protection.' },
    { keywords: ['flood', 'flooding', 'water damage', 'water backup'], text: 'Standard Homeowners HO-3 excludes external storm floods. However, your customer account holds an active Supplemental Flood Policy (POL-011) covering up to $250,000 structure and $100,000 contents, plus a $25k Water Backup Rider.' },
    { keywords: ['policies available', 'available policies', 'what policies', 'available'], text: 'InsureAssist supports Property & Casualty coverage including Homeowners (HO-3/HO-6), Auto Comprehensive, Commercial Property, Personal Umbrella, Flood (NFIP), and Specialty lines.' }
  ],
  agent: [
    { keywords: ['sarah', "sarah's home", 'sarah home', 'sarah coverage'], text: "Based on the sample policy data, Sarah Mitchell's Homeowners HO-3 policy (POL-002) includes $450k dwelling, $225k personal property, $300k liability, and $90k loss-of-use coverage." },
    { keywords: ['john', "john's auto", 'john auto', 'john car'], text: "John Carter's sample auto policy (POL-003) expires on June 15, 2027 ($980/yr premium). It is currently active with zero recorded incidents." },
    { keywords: ['emily', 'commercial', 'johnson'], text: "Emily Johnson (CUST-003) has 3 active commercial policies totaling $9,700/yr. Her Commercial General Liability policy is approaching renewal in 20 days (April 22, 2027)." },
    { keywords: ['renewals', 'upcoming renewals', 'who is renewing'], text: "Across your 18 assigned clients, 5 policies are approaching renewal in the next 90 days: Sarah Mitchell (Home), John Carter (Auto), Emily Johnson (Commercial), Michael Brown (Commercial Property), and David Chen (Boat)." },
    { keywords: ['portfolio', 'total premium', 'clients'], text: "Your assigned book of business consists of 18 active clients, 32 total policies, and an annual premium portfolio of $48,650 (Home: 38%, Auto: 31%, Commercial: 20%, Umbrella: 11%)." }
  ],
  underwriter: [
    { keywords: ['risk factors', 'risk', 'review', 'what risk factors'], text: "Review the applicant's previous claims, requested coverage amount, property or vehicle characteristics, location risk, and other underwriting information available in the application." },
    { keywords: ['summarize', 'summary', 'application', 'summarize this application'], text: "This sample application is for Home Insurance with medium risk, $350,000 requested coverage, and a $1,000 deductible." },
    { keywords: ['john', 'uw-1002', 'carter', 'auto risk'], text: "Application UW-1002 (John Carter) is rated High Risk (Score 78) due to 2 recent speeding violations within 24 months, high vehicle horsepower (BMW M340i), and aggressive braking telematics." },
    { keywords: ['michael', 'brown', 'uw-1004', 'needs more info'], text: "Application UW-1004 (Michael Brown) is in 'Needs More Information' status pending receipt and verification of the certified commercial sprinkler inspection report." },
    { keywords: ['decision', 'guidelines', 'approve', 'reject'], text: "Underwriting decisions: Low risk applications (< 25 score) are eligible for fast-track binding approval; Medium risk (26-65 score) requires standard endorsements; High risk (> 66 score) requires supervisory sign-off or mitigation riders." }
  ],
  admin: [
    { keywords: ['active policies', 'how many active policies', 'total active'], text: "There are 378 active policies in the current sample dataset (out of 426 total enterprise policies across Property, Vehicle, Commercial, and Specialty lines)." },
    { keywords: ['agents', 'how many agents', 'registered agents'], text: "There are 32 registered agents in the current sample dataset managing 180 customer accounts." },
    { keywords: ['users', 'total users', 'how many users'], text: "There are 248 total registered users on the platform: 180 Customers (73%), 32 Agents (13%), 24 Underwriters (10%), and 12 Administrators (5%)." },
    { keywords: ['underwriters', 'how many underwriters'], text: "There are 24 registered underwriters managing an active queue of 14 pending applications and 4 high-risk reviews." },
    { keywords: ['audit', 'recent activity', 'logs'], text: "Recent system activity: Alex Morgan (Agent) logged in today at 9:15 AM; Admin created user USR-0248 at 9:05 AM; Underwriting application UW-1004 was approved yesterday at 5:40 PM." }
  ]
};

let chatHistory = {
  customer: [{ sender: 'bot', text: 'Hello Sarah! I am your AI Policy Assistant. How can I help you with your insurance policies today? (Prototype Demo Mode)' }],
  agent: [{ sender: 'bot', text: "Hello Agent Alex Rivera! I am your Client & Policy Support AI Assistant. How can I assist you with your assigned portfolio today?" }],
  underwriter: [{ sender: 'bot', text: "Hello Underwriter Alex Vance! I am your Risk & Underwriting Decision AI Assistant. How can I assist with your application review queue today?" }],
  admin: [{ sender: 'bot', text: "Hello Administrator Jordan Taylor! I am your Enterprise Platform Governance AI Assistant. How can I assist with system metrics, user governance, or policy data today?" }]
};

function getMockChatResponse(query, role) {
  const q = query.toLowerCase().trim();
  const list = MOCK_AI_RESPONSES[role] || MOCK_AI_RESPONSES.customer;
  for (const item of list) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.text;
    }
  }
  if (role === 'admin') {
    return `Platform Governance Query "${query}": The InsureAssist platform is currently operating normally with 248 users, 426 total policies ($48.6k agent book), and 4 active RBAC security roles.`;
  }
  if (role === 'underwriter') {
    return `Underwriting Risk Query "${query}": Review the applicant's loss run history, credit rating, structural parameters, and location hazard zone score before issuing a binding decision.`;
  }
  return role === 'agent'
    ? `Regarding "${query}": In this prototype, simulated responses demonstrate agent customer support prior to connecting the FastAPI gateway and RAG policy database.`
    : `Your question regarding "${query}" is noted. In this prototype demonstration, simulated responses illustrate policy assistance before the full FastAPI backend and RAG model are connected.`;
}

// Render Chatbot inside Right-Side Slide-Out Panel
function openAIChatSlidePanel() {
  const role = MOCK_DB.currentRole;
  const history = chatHistory[role];
  const userInitials = role === 'admin' ? 'AD' : role === 'agent' ? 'AR' : role === 'underwriter' ? 'AV' : 'SM';

  const messagesHtml = history.map(m => `
        <div class="chat-msg ${m.sender}">
          <div class="chat-avatar">${m.sender === 'bot' ? '🤖' : userInitials}</div>
          <div>
            <div class="chat-bubble">${m.text}</div>
            <div class="chat-bubble-meta">${m.sender === 'bot' ? '<span>InsureAssist AI</span> · <span>Prototype Response</span>' : '<span>You</span>'}</div>
          </div>
        </div>
      `).join('');

  const adminChips = `
        <button class="chat-chip" onclick="handleChatPromptClick('How many active policies are currently in the system?')">Active policies count?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('How many agents are registered?')">Registered agents?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('How many total users are registered?')">Total users count?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Show recent audit activity')">Recent audit activity</button>
      `;

  const underwriterChips = `
        <button class="chat-chip" onclick="handleChatPromptClick('What risk factors should I review for this application?')">What risk factors to review?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Summarize this application.')">Summarize application</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Explain risk rating for John Carter (UW-1002)')">Risk for John Carter?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('What are the decision guidelines?')">Decision guidelines?</button>
      `;

  const agentChips = `
        <button class="chat-chip" onclick="handleChatPromptClick('What coverage does Sarah\\'s home policy include?')">Sarah's home coverage?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('When does John\\'s auto policy expire?')">John's auto expiry?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Who are my upcoming renewals?')">Upcoming renewals?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Overview of Emily Johnson\\'s account')">Emily Johnson overview</button>
      `;

  const customerChips = `
        <button class="chat-chip" onclick="handleChatPromptClick('What is a deductible?')">What is a deductible?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('What does my auto policy cover?')">What does my auto policy cover?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('What policies are available?')">What policies are available?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Am I covered for flood damage?')">Am I covered for flood damage?</button>
      `;

  const roleBannerText = role === 'admin'
    ? 'Enterprise Platform Governance & System Telemetry'
    : role === 'underwriter'
      ? 'Underwriting Risk Analysis & Case Evaluation'
      : role === 'agent'
        ? 'Agent Customer Support'
        : 'Customer Guidance';

  const rolePlaceholder = role === 'admin'
    ? 'Ask about total users, active policies, agents, or audit activity...'
    : role === 'underwriter'
      ? 'Ask about risk factors, application summary, or underwriting guidelines...'
      : role === 'agent'
        ? 'Ask about an assigned client or policy...'
        : 'Ask about your policies...';

  const contentHtml = `
        <div class="chat-container-layout">
          <div class="chat-prototype-banner">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span><strong>Prototype Mode:</strong> Predefined mock responses for ${roleBannerText}. RAG backend connects in Phase 2.</span>
          </div>

          <div class="chat-messages-scroll" id="panel-chat-scroll">
            ${messagesHtml}
          </div>

          <div class="chat-chips-area">
            <div style="font-size:0.75rem;color:var(--gray-500);width:100%;margin-bottom:2px;">Quick Prompts to try:</div>
            ${role === 'admin' ? adminChips : role === 'underwriter' ? underwriterChips : role === 'agent' ? agentChips : customerChips}
          </div>

          <div class="chat-input-wrapper">
            <input type="text" id="panel-chat-input" placeholder="${rolePlaceholder}" autocomplete="off">
            <button class="btn btn-primary btn-sm" id="panel-chat-send-btn" style="padding:10px 14px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      `;

  openOrUpdateSlidePanel(
    role === 'admin' ? 'Enterprise Governance AI Assistant' : role === 'underwriter' ? 'Underwriting AI Assistant' : role === 'agent' ? 'Agent AI Assistant' : 'AI Policy Assistant',
    role === 'admin' ? 'Platform Management & System Telemetry' : role === 'underwriter' ? 'Risk Evaluation & Decision Guidance' : role === 'agent' ? 'Client & Policy Support Assistant' : 'Interactive prototype assistance',
    contentHtml
  );
  attachChatEventListeners();
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const scrollArea = document.getElementById('panel-chat-scroll');
  if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
}

function attachChatEventListeners() {
  const input = document.getElementById('panel-chat-input');
  const sendBtn = document.getElementById('panel-chat-send-btn');
  if (!input || !sendBtn) return;

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    const role = MOCK_DB.currentRole;
    chatHistory[role].push({ sender: 'user', text: text });
    openAIChatSlidePanel();

    setTimeout(() => {
      const reply = getMockChatResponse(text, role);
      chatHistory[role].push({ sender: 'bot', text: reply });
      openAIChatSlidePanel();
    }, 450);
  };

  sendBtn.onclick = sendMessage;
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };
}

function handleChatPromptClick(promptText) {
  const role = MOCK_DB.currentRole;
  chatHistory[role].push({ sender: 'user', text: promptText });
  openAIChatSlidePanel();

  setTimeout(() => {
    const reply = getMockChatResponse(promptText, role);
    chatHistory[role].push({ sender: 'bot', text: reply });
    openAIChatSlidePanel();
  }, 400);
};

/**
 * MODERN SAAS TOOLTIP CONTROLLER (CARD HOVER TRIGGER + SMART VIEWPORT POSITIONING)
 */
let currentTooltipTarget = null;

function showGlobalTooltipFor(target) {
  if (!target) return;
  const text = target.getAttribute('data-tooltip');
  if (!text || !text.trim()) return;

  currentTooltipTarget = target;

  const tooltipEl = document.getElementById('global-tooltip');
  const tooltipText = document.getElementById('global-tooltip-text');
  const arrowEl = document.getElementById('global-tooltip-arrow');
  if (!tooltipEl || !tooltipText) return;

  tooltipText.textContent = text.trim();

  // Temporarily render to calculate accurate layout metrics
  tooltipEl.style.visibility = 'hidden';
  tooltipEl.style.display = 'block';
  tooltipEl.classList.add('visible');

  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width || 220;
  const tooltipHeight = tooltipRect.height || 36;
  const isSidebar = Boolean(target.closest('.sidebar'));

  let top, left, placement;
  const padding = 12;

  if (isSidebar && rect.right + tooltipWidth + padding <= window.innerWidth) {
    placement = 'arrow-left';
    top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
    left = rect.right + 10;
  } else {
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove >= tooltipHeight + 12 || spaceAbove >= spaceBelow) {
      placement = 'arrow-bottom';
      top = rect.top - tooltipHeight - 8;
    } else {
      placement = 'arrow-top';
      top = rect.bottom + 8;
    }

    left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
  }

  // Horizontal viewport boundary constraints
  if (left < padding) {
    left = padding;
  } else if (left + tooltipWidth > window.innerWidth - padding) {
    left = window.innerWidth - tooltipWidth - padding;
  }

  // Vertical viewport boundary constraints
  if (top < padding) {
    top = padding;
  } else if (top + tooltipHeight > window.innerHeight - padding) {
    top = window.innerHeight - tooltipHeight - padding;
  }

  // Dynamic arrow alignment pointing directly to trigger center
  if (arrowEl) {
    if (placement === 'arrow-bottom' || placement === 'arrow-top') {
      const targetCenterX = rect.left + (rect.width / 2);
      let arrowLeft = targetCenterX - left - 4;
      arrowLeft = Math.max(10, Math.min(tooltipWidth - 14, arrowLeft));
      arrowEl.style.left = `${Math.round(arrowLeft)}px`;
      arrowEl.style.top = '';
    } else if (placement === 'arrow-left' || placement === 'arrow-right') {
      const targetCenterY = rect.top + (rect.height / 2);
      let arrowTop = targetCenterY - top - 4;
      arrowTop = Math.max(8, Math.min(tooltipHeight - 12, arrowTop));
      arrowEl.style.top = `${Math.round(arrowTop)}px`;
      arrowEl.style.left = '';
    }
  }

  tooltipEl.className = `visible ${placement}`;
  tooltipEl.style.top = `${Math.round(top)}px`;
  tooltipEl.style.left = `${Math.round(left)}px`;
  tooltipEl.style.visibility = '';
  tooltipEl.style.display = '';
  tooltipEl.style.opacity = '';
}

function hideGlobalTooltip() {
  currentTooltipTarget = null;
  const tooltipEl = document.getElementById('global-tooltip');
  if (tooltipEl) {
    tooltipEl.className = '';
    tooltipEl.style.display = 'none';
    tooltipEl.style.visibility = 'hidden';
    tooltipEl.style.opacity = '0';
  }
}

function initGlobalTooltips() {
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      showGlobalTooltipFor(target);
    } else {
      hideGlobalTooltip();
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const related = e.relatedTarget;
    if (!related || !related.closest('[data-tooltip]')) {
      hideGlobalTooltip();
    }
  }, { passive: true });

  document.addEventListener('focusin', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) showGlobalTooltipFor(target);
  });

  document.addEventListener('focusout', () => {
    hideGlobalTooltip();
  });

  window.addEventListener('scroll', () => {
    if (currentTooltipTarget) {
      const rect = currentTooltipTarget.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        hideGlobalTooltip();
      } else {
        showGlobalTooltipFor(currentTooltipTarget);
      }
    }
  }, { passive: true });
}

/**
 * THEME CONTROLLER (LIGHT / DARK THEME TOGGLE)
 */
function toggleTheme() {
  const current = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  if (document.body) document.body.setAttribute('data-theme', next);
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem('app_theme', next);
  } catch (e) {}
  updateThemeIcon(next);
  if (typeof showToast === 'function') {
    showToast(next === 'dark' ? 'Dark theme enabled.' : 'Light theme enabled.');
  }
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-toggle-icon');
  if (!iconContainer) return;
  if (theme === 'dark') {
    iconContainer.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  } else {
    iconContainer.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

function initTheme() {
  let saved = 'light';
  try {
    if (typeof localStorage !== 'undefined') {
      saved = localStorage.getItem('app_theme') || 'light';
    }
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', saved);
  if (document.body) document.body.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

/**
 * CUSTOMER DASHBOARD COMPACT LIST TOGGLE
 */
function toggleCustomerRenewalsList() {
  const container = document.getElementById('customer-dashboard-renewals-container');
  const btn = document.getElementById('cust-renewals-show-more-btn');
  const btnText = document.getElementById('cust-renewals-btn-text');
  const btnIcon = document.getElementById('cust-renewals-btn-icon');
  if (!container || !btn) return;

  const isExpanded = container.classList.contains('expanded');

  if (isExpanded) {
    container.classList.remove('expanded');
    btn.setAttribute('aria-expanded', 'false');
    if (btnText) btnText.textContent = 'Show more';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    container.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    if (btnText) btnText.textContent = 'Show less';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="18 15 12 9 6 15"/>';
    container.scrollBy({ top: 90, behavior: 'smooth' });
  }
};

/**
 * AGENT DASHBOARD COMPACT LIST TOGGLE
 */
function toggleAgentRenewalsList() {
  const container = document.getElementById('agent-dashboard-renewals-list');
  const btn = document.getElementById('agent-renewals-show-more-btn');
  const btnText = document.getElementById('agent-renewals-btn-text');
  const btnIcon = document.getElementById('agent-renewals-btn-icon');
  if (!container || !btn) return;

  const isExpanded = container.classList.contains('expanded');

  if (isExpanded) {
    container.classList.remove('expanded');
    btn.setAttribute('aria-expanded', 'false');
    if (btnText) btnText.textContent = 'Show more';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    container.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    if (btnText) btnText.textContent = 'Show less';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="18 15 12 9 6 15"/>';
    container.scrollBy({ top: 90, behavior: 'smooth' });
  }
};

/**
 * AGENT DASHBOARD CUSTOMERS TABLE TOGGLE
 */
function toggleAgentCustomersTable() {
  const container = document.getElementById('agent-dashboard-customers-table-container');
  const btn = document.getElementById('agent-customers-table-show-more-btn');
  const btnText = document.getElementById('agent-customers-table-btn-text');
  const btnIcon = document.getElementById('agent-customers-table-btn-icon');
  if (!container || !btn) return;

  const isExpanded = container.classList.contains('expanded');

  if (isExpanded) {
    container.classList.remove('expanded');
    btn.setAttribute('aria-expanded', 'false');
    if (btnText) btnText.textContent = 'Show more';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    container.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    if (btnText) btnText.textContent = 'Show less';
    if (btnIcon) btnIcon.innerHTML = '<polyline points="18 15 12 9 6 15"/>';
    container.scrollBy({ top: 120, behavior: 'smooth' });
  }
};

/**
 * AGENT FULL CUSTOMERS DIRECTORY TABLE TOGGLE
 */
function toggleAgentFullCustomersTable() {
  const btn = document.getElementById('agent-full-customers-show-more-btn');
  if (btn) toggleCardShowMore(btn);
};

/**
 * UNIVERSAL GLOBAL SHOW MORE / SHOW LESS HANDLER
 * Operates consistently across all roles, pages, tables, lists, and cards.
 */
function toggleCardShowMore(btn) {
  if (!btn) return;
  const card = btn.closest('.card') || btn.parentElement;
  if (!card) return;

  const container = card.querySelector('.compact-list-scroll, .compact-table-scroll, .table-responsive, .data-table-container, [id$="-container"], [id$="-list"], [id$="-tbody"]');
  if (!container) return;

  const isExpanded = container.classList.contains('expanded');
  const textSpan = btn.querySelector('span, .btn-show-more-text') || btn;
  const iconSvg = btn.querySelector('svg, .btn-show-more-icon');

  if (isExpanded) {
    container.classList.remove('expanded');
    btn.setAttribute('aria-expanded', 'false');
    if (textSpan) textSpan.textContent = 'Show more';
    if (iconSvg) iconSvg.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    container.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    if (textSpan) textSpan.textContent = 'Show less';
    if (iconSvg) iconSvg.innerHTML = '<polyline points="18 15 12 9 6 15"/>';
    container.scrollBy({ top: 120, behavior: 'smooth' });
  }
};

/**
 * SLIDE-OUT PANEL CONTROLLERS (SINGLE STATE, NO BLUR, IN-PLACE UPDATES, CLICK OUTSIDE TO CLOSE)
 * INTEGRATED MULTI-LEVEL NESTED NAVIGATION HISTORY & BACK BUTTON
 */
const slidePanel = document.getElementById('slide-panel');
const panelTitle = document.getElementById('panel-title');
const panelSubtitle = document.getElementById('panel-subtitle');
const panelBody = document.getElementById('panel-body');

const panelState = {
  isOpen: false,
  activeItemKey: null
};

let panelHistory = []; // Stack of { title, subtitle, contentHtml, itemKey, scrollTop }

function updatePanelBackButton() {
  const backBtn = document.getElementById('panel-back-btn');
  if (!backBtn) return;
  if (panelHistory.length > 0) {
    backBtn.style.display = 'inline-flex';
  } else {
    backBtn.style.display = 'none';
  }
}

let savedBodyScrollY = 0;

function lockBodyScroll() {
  savedBodyScrollY = (typeof window !== 'undefined' && window.scrollY) || (document.documentElement && document.documentElement.scrollTop) || 0;
  if (document.body && document.body.classList) document.body.classList.add('panel-open');
}

function unlockBodyScroll() {
  if (document.body && document.body.classList) document.body.classList.remove('panel-open');
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo(0, savedBodyScrollY);
}


function openOrUpdateSlidePanel(title, subtitle, contentHtml, itemKey = null, isNavigatingBack = false) {
  if (!slidePanel) return;

  // Lock body scroll on first opening
  if (!panelState.isOpen) {
    lockBodyScroll();
  }

  // If panel is already open and this is a forward navigation (e.g. customer -> policy)
  if (panelState.isOpen && !isNavigatingBack) {
    // Record current panel snapshot in navigation history
    panelHistory.push({
      title: panelTitle.textContent,
      subtitle: panelSubtitle.textContent,
      contentHtml: panelBody.innerHTML,
      itemKey: panelState.activeItemKey,
      scrollTop: panelBody.scrollTop || 0
    });
  } else if (!panelState.isOpen) {
    // Fresh opening from underlying page/dashboard
    panelHistory = [];
  }

  panelTitle.textContent = title;
  panelSubtitle.textContent = subtitle || '';
  panelSubtitle.style.display = subtitle ? 'block' : 'none';
  panelBody.innerHTML = contentHtml;

  panelState.isOpen = true;
  panelState.activeItemKey = itemKey;

  slidePanel.classList.add('open');
  slidePanel.setAttribute('aria-hidden', 'false');

  updatePanelBackButton();

  if (!isNavigatingBack) {
    panelBody.scrollTop = 0;
  }
}

function slidePanelGoBack() {
  if (panelHistory.length === 0) return;

  const previousView = panelHistory.pop();
  if (!previousView) return;

  openOrUpdateSlidePanel(previousView.title, previousView.subtitle, previousView.contentHtml, previousView.itemKey, true);

  if (previousView.scrollTop) {
    setTimeout(() => {
      if (panelBody) panelBody.scrollTop = previousView.scrollTop;
    }, 10);
  }
};

function closeSlidePanel() {
  if (!slidePanel) return;
  slidePanel.classList.remove('open');
  slidePanel.setAttribute('aria-hidden', 'true');
  panelState.isOpen = false;
  panelState.activeItemKey = null;
  panelHistory = []; // Clear history stack on full exit
  updatePanelBackButton();
  document.querySelectorAll('.stat-card, .admin-stat-item').forEach(c => c.classList.remove('active-card'));
  unlockBodyScroll();
}

function initSlidePanelListeners() {
  const closeBtn = document.getElementById('panel-close-btn');
  const singleCloseBtn = document.getElementById('panel-single-close-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeSlidePanel);
  if (singleCloseBtn) singleCloseBtn.addEventListener('click', closeSlidePanel);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panelState.isOpen) {
      closeSlidePanel();
    }
  });

  // Click outside panel to close
  document.addEventListener('click', (e) => {
    if (!panelState.isOpen && !slidePanel.classList.contains('open')) return;

    // If click is inside the slide panel, do not close
    if (slidePanel.contains(e.target)) return;

    // If click is on any trigger element or button designed to open/update the slide panel, do not close
    if (e.target.closest('.stat-card, .admin-stat-item, #card-admin-users, #card-admin-customers, #card-admin-agents, #card-admin-underwriters, #card-admin-policies, #card-admin-active, #btn-admin-create-user, #btn-admin-dash-create-user, #btn-admin-create-role, [onclick*="openCreateUserPanel"], [onclick*="openCreateRolePanel"], [onclick*="openConfigureRolePermissionsPanel"], [onclick*="openUserDetailsPanel"], [onclick*="openPolicyDetailsPanel"], [onclick*="openOrUpdateSlidePanel"], .policy-card, .recommendation-card, .renewal-item, .chart-row, [data-policy], [data-panel-trigger], #sidebar-customer-ai-btn, #sidebar-agent-ai-btn, #sidebar-underwriter-ai-btn, #sidebar-admin-ai-btn, #customer-view-renewals-btn, #agent-view-renewals-btn, .panel-policy-list-item, button, [onclick]')) {
      return;
    }

    // If clicking on sidebar navigation item, navigateTo handles closing and switching
    if (e.target.closest('.nav-item, [data-nav]')) {
      return;
    }

    // Any other click outside closes the panel
    closeSlidePanel();
  });
}

function mapPolicyCategoryFrontend(type) {
  const t = String(type || '').toLowerCase();
  if (t.includes('home') || t.includes('property') || t.includes('renter') || t.includes('dwelling')) return 'Property';
  if (t.includes('auto') || t.includes('vehicle') || t.includes('car') || t.includes('fleet')) return 'Vehicle';
  if (t.includes('commercial') || t.includes('business') || t.includes('liability') || t.includes('general liability')) return 'Commercial';
  if (t.includes('umbrella') || t.includes('watercraft') || t.includes('specialty')) return 'Specialty';
  return 'General';
}

// Open Customer Details Panel (for Agent view)
function openCustomerDetailsPanel(custId) {
  const allCusts = (window.agentCustomersData && window.agentCustomersData.customers) ||
                   (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                   MOCK_DB.assignedCustomers || [];

  const cust = allCusts.find(c => String(c.customer_id || c.id) === String(custId));
  if (!cust) {
    showToast(`Customer record (${custId}) not found.`);
    return;
  }

  const custName = cust.name || 'Customer';
  const displayId = cust.customer_id || cust.id;
  const email = cust.email || 'N/A';
  const phone = cust.mobile || cust.phone || '+91-98949-36898';
  const address = cust.address || (cust.city ? `${cust.city}, IL` : '124 Grand Avenue, Chicago, IL 60611');
  const agentDisplayName = getAgentDisplayName();

  // Find policies for this customer
  let policiesList = Array.isArray(cust.policies) && cust.policies.length > 0 ? cust.policies : [];
  if (policiesList.length === 0 && window.agentPoliciesData && Array.isArray(window.agentPoliciesData.policies)) {
    policiesList = window.agentPoliciesData.policies.filter(p => String(p.customer_id) === String(displayId));
  }

  // Calculate total annual premium for this customer
  const totalCustomerPremium = policiesList.reduce((acc, p) => {
    const amt = typeof p.premium_amount === 'number' ? p.premium_amount : parseFloat(String(p.premium || '0').replace(/[^0-9.]/g, '')) || 0;
    return acc + amt;
  }, 0);

  // Policies cards
  let policiesHtml = '';
  if (policiesList.length > 0) {
    policiesHtml = policiesList.map(p => {
      const polId = p.policy_id || p.id;
      const polNumber = p.policy_number || p.code || polId;
      const polType = p.policy_type || p.type || 'Comprehensive Policy';
      const polCat = p.category || mapPolicyCategoryFrontend(polType);
      const polStatus = p.status || 'Active';
      const polPrem = p.premium || (typeof p.premium_amount === 'number' ? `$${p.premium_amount.toLocaleString()}/yr` : '$0/yr');
      const formattedPrem = polPrem.includes('/yr') ? polPrem : `${polPrem}/yr`;
      const polDeductible = p.deductible || (polType.toLowerCase().includes('auto') ? 'Collision $500 · Comp $250' : 'All Perils $1,000');
      const polExpiry = p.expiry_date || p.end_date || p.expiry || 'N/A';
      const statusBadgeClass = polStatus.toLowerCase() === 'active' ? 'badge-active' : polStatus.toLowerCase() === 'pending' ? 'badge-pending' : 'badge-info';

      return `
        <div class="panel-policy-list-item" style="display:flex;justify-content:space-between;align-items:center;background:var(--white);border:1px solid var(--gray-200);border-radius:8px;padding:12px;margin-bottom:8px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <strong style="color:var(--blue-900);font-size:0.925rem;">${polType}</strong>
              <span class="badge ${statusBadgeClass}" style="font-size:0.7rem;padding:2px 6px;">${polStatus}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--gray-600);font-family:monospace;margin-bottom:4px;">
              ${polNumber} · <span style="font-weight:700;color:var(--blue-900);">${formattedPrem}</span> · ${polCat} Line
            </div>
            <div style="font-size:0.775rem;color:var(--gray-500);">
              Deductible: <strong>${polDeductible}</strong> · Expiry: <strong>${polExpiry}</strong>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" style="flex-shrink:0;margin-left:12px;" onclick="openPolicyDetailsPanel('${polId || polNumber}', '${custName}')">
            View Policy →
          </button>
        </div>
      `;
    }).join('');
  } else {
    policiesHtml = `
      <div style="padding:1rem;text-align:center;color:var(--gray-500);font-size:0.85rem;background:var(--white);border:1px dashed var(--gray-300);border-radius:8px;">
        No active insurance contracts on file for this client.
      </div>
    `;
  }

  // Claims history
  let claimsHtml = '';
  const claimsList = Array.isArray(cust.claims) ? cust.claims : [];
  if (claimsList.length > 0) {
    claimsHtml = claimsList.map(cl => `
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <strong style="color:var(--blue-900);font-size:0.875rem;">${cl.type || cl.incident_type || 'Property Loss'}</strong>
          <span class="badge ${String(cl.status || cl.claim_status).toLowerCase().includes('settled') ? 'badge-active' : 'badge-pending'}" style="font-size:0.7rem;padding:2px 6px;">${cl.status || cl.claim_status || 'Under Review'}</span>
        </div>
        <div style="font-size:0.8rem;color:var(--gray-600);margin-bottom:4px;">
          Claim <code>${cl.id || cl.claim_number || 'CLM-1001'}</code> · Date: ${cl.date || cl.incident_date || 'Recent'} · Amount: <strong style="color:var(--blue-900);">${cl.amount || (cl.claim_amount ? '$' + Number(cl.claim_amount).toLocaleString() : '$0')}</strong>
        </div>
        <div style="font-size:0.775rem;color:var(--gray-500);line-height:1.4;">
          ${cl.desc || cl.incident_description || 'First notice of loss filed.'}
        </div>
      </div>
    `).join('');
  } else {
    claimsHtml = `
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 14px;color:#166534;font-size:0.825rem;display:flex;align-items:center;gap:8px;">
        <svg width="18" height="18" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>No claims on file — Clean loss history across all active policies.</span>
      </div>
    `;
  }

  // Renewal Info
  const primaryPolicy = policiesList[0] || {};
  const renewalDue = cust.renewal_date || cust.renewalDate || (primaryPolicy.expiry_date || primaryPolicy.end_date || primaryPolicy.expiry || 'Scheduled');
  const nextRenewalDays = cust.next_renewal || cust.nextRenewal || 'Scheduled';
  const renewalBadgeClass = String(nextRenewalDays).toLowerCase().includes('day') && parseInt(nextRenewalDays) <= 30 ? 'badge-pending' : 'badge-info';

  const contentHtml = `
    <!-- 1. Customer Overview Section -->
    <div class="detail-section">
      <div class="detail-section-title">Client Identity & Contact Information</div>
      <div class="detail-row"><span class="detail-label">Customer Name</span><span class="detail-value" style="font-size:1.05rem;font-weight:700;color:var(--blue-900)">${custName}</span></div>
      <div class="detail-row"><span class="detail-label">Customer ID</span><span class="detail-value"><code style="font-size:0.85rem;background:var(--gray-100);padding:3px 8px;border-radius:4px;color:var(--blue-900);font-weight:600;">${displayId}</code></span></div>
      <div class="detail-row"><span class="detail-label">Email Address</span><span class="detail-value"><a href="mailto:${email}" style="color:var(--blue-600);text-decoration:none;">${email}</a></span></div>
      <div class="detail-row"><span class="detail-label">Primary Phone</span><span class="detail-value">${phone}</span></div>
      <div class="detail-row"><span class="detail-label">Street Address</span><span class="detail-value">${address}</span></div>
      <div class="detail-row"><span class="detail-label">Assigned Agent</span><span class="detail-value"><strong>${agentDisplayName}</strong> (Agent ID: 1321)</span></div>
      <div class="detail-row"><span class="detail-label">Account Status</span><span class="badge badge-active">Assigned & In Good Standing</span></div>
    </div>

    <!-- 2. Upcoming Renewal Information -->
    <div class="detail-section">
      <div class="detail-section-title">Upcoming Renewal Schedule</div>
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <strong style="color:#92400E;font-size:0.875rem;">Next Renewal Due: ${renewalDue}</strong>
          <span class="badge ${renewalBadgeClass}">${nextRenewalDays}</span>
        </div>
        <div style="font-size:0.8rem;color:#78350F;">
          Primary policy scheduled for renewal review: <strong>${primaryPolicy.policy_type || primaryPolicy.type || 'Commercial / General'}</strong> (${primaryPolicy.policy_number || primaryPolicy.id || 'Active'}) · Estimated Premium: <strong>${primaryPolicy.premium || (primaryPolicy.premium_amount ? '$' + Number(primaryPolicy.premium_amount).toLocaleString() + '/yr' : '$0/yr')}</strong>
        </div>
      </div>
    </div>

    <!-- 3. Policy Portfolio -->
    <div class="detail-section">
      <div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>Active Policy Portfolio (${policiesList.length})</span>
        <span style="font-size:0.825rem;font-weight:700;color:var(--blue-900);">Total: $${Number(totalCustomerPremium.toFixed(2)).toLocaleString()}/yr</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.4rem;margin-top:8px;">
        ${policiesHtml}
      </div>
    </div>

    <!-- 4. Claims Record -->
    <div class="detail-section">
      <div class="detail-section-title">Claims History & Loss Records</div>
      <div style="margin-top:8px;">
        ${claimsHtml}
      </div>
    </div>

    <!-- 5. Quick Actions -->
    <div style="display:flex;gap:10px;margin-top:1.25rem;">
      <button class="btn btn-outline btn-block btn-sm" onclick="showToast('Advisory renewal reminder queued for ${custName}.')">
        Send Renewal Reminder
      </button>
      <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('agent-policies'); closeSlidePanel();">
        Inspect Policies Ledger →
      </button>
    </div>
  `;

  openOrUpdateSlidePanel(`Customer: ${custName}`, `Client ID: ${displayId} · Assigned to Agent ${agentDisplayName}`, contentHtml);
}

/**
 * DYNAMIC CONTEXTUAL POLICY DESCRIPTIONS (2-3 LINES)
 */
function getPolicyContextualDescription(policy, customerName) {
  const typeLower = (policy.type || '').toLowerCase();

  if (typeLower.includes('home') || typeLower.includes('ho-3') || typeLower.includes('dwelling')) {
    return `Your active homeowners policy provides coverage for your dwelling, personal property, liability, and loss of use. Review the policy details, coverage limits, exclusions, and supporting documents below.`;
  }
  if (typeLower.includes('condo') || typeLower.includes('ho-6')) {
    return `Your active condo unitowners policy protects your interior dwelling improvements, personal property, liability, and HOA loss assessments. Review the policy schedule, exclusions, and terms below.`;
  }
  if (typeLower.includes('auto') || typeLower.includes('car') || typeLower.includes('vehicle')) {
    return `Your active auto insurance policy provides protection against vehicular collision, comprehensive physical damage, liability, and 24/7 roadside emergencies. Review the coverage limits, deductibles, and schedules below.`;
  }
  if (typeLower.includes('motorcycle')) {
    return `Your active motorcycle policy provides dedicated road protection including collision, comprehensive, bodily injury liability, and custom gear coverage. Review the policy schedule and limits below.`;
  }
  if (typeLower.includes('commercial property') || typeLower.includes('business property') || typeLower.includes('building')) {
    return `Your active commercial property policy protects your physical building assets, business personal property, and operational continuity against covered perils. Review the commercial schedule and terms below.`;
  }
  if (typeLower.includes('commercial liability') || typeLower.includes('general liability') || typeLower.includes('commercial general')) {
    return `Your commercial general liability policy protects business operations against third-party bodily injury, property damage, and legal defense expenses. Review the coverage limits and terms below.`;
  }
  if (typeLower.includes('fleet') || typeLower.includes('commercial auto')) {
    return `Your commercial fleet auto policy provides commercial liability, collision, and comprehensive physical damage protection across all registered enterprise vehicles. Review the policy terms below.`;
  }
  if (typeLower.includes('umbrella')) {
    return `Your personal umbrella policy provides high-limit secondary liability protection extending above your primary auto and homeowners policies. Review the coverage limits and retention terms below.`;
  }
  if (typeLower.includes('pet')) {
    return `Your comprehensive pet health policy reimburses veterinary care, emergency surgery, diagnostic evaluations, and prescription medications. Review the coverage schedule and limits below.`;
  }
  if (typeLower.includes('watercraft') || typeLower.includes('boat') || typeLower.includes('marine')) {
    return `Your marine watercraft policy provides hull physical damage protection, on-water towing assistance, and watercraft liability coverage. Review the policy schedule and terms below.`;
  }
  if (typeLower.includes('jewelry') || typeLower.includes('valuable') || typeLower.includes('floater')) {
    return `Your scheduled valuables floater provides agreed-value worldwide protection against accidental theft, damage, and mysterious disappearance. Review the itemized schedule below.`;
  }
  if (typeLower.includes('cyber') || typeLower.includes('identity')) {
    return `Your personal cyber and identity theft policy provides dark web monitoring, comprehensive identity restoration services, and extortion protection. Review the policy details below.`;
  }
  if (typeLower.includes('flood') || typeLower.includes('nfip')) {
    return `Your supplemental flood policy covers direct physical damage to dwelling structures and contents resulting from rising waters and storm surges. Review the coverage terms and deductibles below.`;
  }
  if (typeLower.includes('earthquake')) {
    return `Your earthquake endorsement protects your residential structure, foundation, and personal property from ground movement and seismic events. Review the coverage terms and percentage deductibles below.`;
  }

  // Dynamic fallback for any other policy line
  return `Your active ${policy.type} policy provides dedicated insurance coverage for your declared assets and liabilities. Review the policy details, coverage limits, exclusions, and supporting documents below.`;
}

// Open Policy Details Panel (Consistent Universal Experience using Real Database Data)
async function openPolicyDetailsPanel(policyId, customerName = '') {
  if (!policyId) return;

  // 1. Try fetching live policy details directly from Agent Service / Customer Service API
  let liveDetail = null;
  const token = getAuthToken();
  const currentRole = ((window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.role) || (MOCK_DB && MOCK_DB.currentRole) || 'customer').toLowerCase();

  if (token && ['agent', 'broker'].includes(currentRole)) {
    try {
      const resp = await fetch(`${AGENT_SERVICE_URL}/agent/policies/${encodeURIComponent(policyId)}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (resp.ok) {
        liveDetail = await resp.json();
      }
    } catch (e) {
      console.warn('Could not fetch policy detail from /agent/policies/:', e);
    }
  }

  // 2. If liveDetail is returned from backend, use real database fields
  if (liveDetail) {
    const pNumber = liveDetail.policy_number || liveDetail.policy_id || policyId;
    const pType = liveDetail.policy_type || 'Insurance Policy';
    const cName = liveDetail.customer_name || customerName || 'Assigned Policyholder';
    const cId = liveDetail.customer_id || 'Not available';
    const pStatus = liveDetail.status || 'Active';
    const pCategory = liveDetail.category || 'General';
    const pPrem = liveDetail.premium || (liveDetail.premium_amount ? `$${liveDetail.premium_amount.toLocaleString()}/yr` : 'Not available');
    const pStart = liveDetail.start_date || 'Not available';
    const pEnd = liveDetail.end_date || 'Not available';

    const coveragesList = (Array.isArray(liveDetail.coverages) && liveDetail.coverages.length > 0)
      ? liveDetail.coverages
      : [];

    const exclusionsList = (Array.isArray(liveDetail.exclusions) && liveDetail.exclusions.length > 0)
      ? liveDetail.exclusions
      : [];

    const claimsList = (Array.isArray(liveDetail.claims) && liveDetail.claims.length > 0)
      ? liveDetail.claims
      : [];

    const renewalsList = (Array.isArray(liveDetail.renewals) && liveDetail.renewals.length > 0)
      ? liveDetail.renewals
      : [];

    const statusBadgeClass = (pStatus.toLowerCase() === 'active') ? 'badge-active' : (pStatus.toLowerCase().includes('pending') ? 'badge-pending' : 'badge-info');

    const contentHtml = `
      <div class="policy-context-desc-box" style="margin-bottom: 1.25rem; padding: 0.95rem 1.15rem; background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: 8px;">
        <p style="font-size: 0.85rem; color: var(--blue-900); line-height: 1.5; margin: 0; font-weight: 500;">
          Official policy record for <strong>${cName}</strong> (${pNumber}). Underwritten under the <strong>${pCategory}</strong> line.
        </p>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Policy Overview</div>
        <div class="detail-row"><span class="detail-label">Policyholder</span><span class="detail-value" style="color:var(--blue-900);font-weight:700">${cName} ${cId !== 'Not available' ? `<span style="font-size:0.75rem;color:var(--gray-500);font-weight:normal">(${cId})</span>` : ''}</span></div>
        <div class="detail-row"><span class="detail-label">Policy Number</span><span class="detail-value" style="font-family:monospace;font-weight:600">${pNumber}</span></div>
        <div class="detail-row"><span class="detail-label">Policy Type</span><span class="detail-value">${pType}</span></div>
        <div class="detail-row"><span class="detail-label">Category</span><span class="badge badge-info">${pCategory}</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="badge ${statusBadgeClass}">${pStatus}</span></div>
        <div class="detail-row"><span class="detail-label">Annual Premium</span><span class="detail-value" style="color:var(--blue-900);font-size:1rem;font-weight:700;">${pPrem}</span></div>
        <div class="detail-row"><span class="detail-label">Effective Date</span><span class="detail-value">${pStart}</span></div>
        <div class="detail-row"><span class="detail-label">Expiration Date</span><span class="detail-value">${pEnd}</span></div>
        ${liveDetail.customer_email ? `<div class="detail-row"><span class="detail-label">Customer Email</span><span class="detail-value">${liveDetail.customer_email}</span></div>` : ''}
        ${liveDetail.customer_phone ? `<div class="detail-row"><span class="detail-label">Customer Phone</span><span class="detail-value">${liveDetail.customer_phone}</span></div>` : ''}
      </div>

      <!-- Real Coverages from PostgreSQL -->
      <div class="detail-section">
        <div class="detail-section-title">Coverages & Policy Limits (${coveragesList.length})</div>
        ${coveragesList.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${coveragesList.map(cov => `
              <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:6px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="font-weight:600;font-size:0.85rem;color:var(--blue-900);">${cov.coverage_name}</div>
                  <div style="font-size:0.75rem;color:var(--gray-500);">Limit: <strong>${cov.formatted_limit || 'Not available'}</strong> · Deductible: <strong>${cov.formatted_deductible || 'Not available'}</strong></div>
                </div>
                <span class="badge ${(cov.status || '').toLowerCase() === 'active' ? 'badge-active' : 'badge-info'}" style="font-size:0.7rem;">${cov.status || 'Active'}</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="font-size:0.85rem;color:var(--gray-500);padding:0.5rem 0;">No specific coverage breakdown records on file for this policy.</div>
        `}
      </div>

      <!-- Real Exclusions from PostgreSQL -->
      <div class="detail-section">
        <div class="detail-section-title">Policy Exclusions (${exclusionsList.length})</div>
        ${exclusionsList.length > 0 ? `
          <ul class="bullet-list exclusion-list">
            ${exclusionsList.map(ex => `
              <li><strong>${ex.exclusion_name}:</strong> ${ex.description || 'Excluded from policy terms.'}</li>
            `).join('')}
          </ul>
        ` : `
          <div style="font-size:0.85rem;color:var(--gray-500);padding:0.5rem 0;">No specific exclusion records recorded for this policy.</div>
        `}
      </div>

      <!-- Real Claims from PostgreSQL -->
      <div class="detail-section">
        <div class="detail-section-title">Claims History (${claimsList.length})</div>
        ${claimsList.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${claimsList.map(cl => `
              <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:6px;padding:8px 12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:var(--blue-900);font-size:0.85rem;">${cl.claim_number} · ${cl.incident_type || 'Claim'}</strong>
                  <span class="badge badge-pending" style="font-size:0.7rem;">${cl.claim_status || 'Under Review'}</span>
                </div>
                <div style="font-size:0.75rem;color:var(--gray-600);margin-top:2px;">Amount: <strong>${cl.formatted_amount || 'Not available'}</strong> · Date: ${cl.incident_date || 'N/A'}</div>
                ${cl.incident_description ? `<div style="font-size:0.75rem;color:var(--gray-500);margin-top:2px;">${cl.incident_description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="font-size:0.85rem;color:var(--gray-500);padding:0.5rem 0;">No claims filed against this policy.</div>
        `}
      </div>

      <!-- Real Renewal Requests from PostgreSQL -->
      <div class="detail-section" style="border-bottom:none;">
        <div class="detail-section-title">Renewal Information (${renewalsList.length})</div>
        ${renewalsList.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${renewalsList.map(rn => `
              <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div>
                  <div style="font-weight:700;color:#92400E;font-size:0.85rem;">${rn.renewal_id}</div>
                  <div style="font-size:0.75rem;color:#78350F;">Renewal Date: <strong>${rn.renewal_date || 'Upcoming'}</strong> · Premium: <strong>${rn.formatted_renewal_premium || 'Not available'}</strong></div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span class="badge ${rn.status === 'Approved' ? 'badge-active' : 'badge-pending'}">${rn.status}</span>
                  ${(rn.status === 'Pending Approval' && ['agent', 'broker'].includes(currentRole)) ? `
                    <button class="btn btn-primary btn-sm" style="background:#16a34a;border-color:#16a34a;color:#fff;font-size:0.75rem;padding:3px 10px;" onclick="event.stopPropagation(); handleAgentApproveRenewal('${rn.renewal_id}')">Approve</button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="font-size:0.85rem;color:var(--gray-500);padding:0.5rem 0;">Policy is in good standing. No pending renewal requests.</div>
        `}
      </div>
    `;

    openOrUpdateSlidePanel(`${pType}`, `Policy: ${pNumber} · ${cName}`, contentHtml);
    return;
  }

  // 3. Fallback to cached agent/customer policy lists if API call was not available
  const allKnownPolicies = [
    ...(window.agentPoliciesData && window.agentPoliciesData.policies ? window.agentPoliciesData.policies : []),
    ...(window.customerPoliciesData || []),
    ...(MOCK_DB.assignedCustomers ? MOCK_DB.assignedCustomers.flatMap(c => c.policies.map(p => ({ ...p, customer_name: c.name, customer_id: c.id }))) : []),
    ...(MOCK_DB.allPolicies || [])
  ];

  const p = allKnownPolicies.find(item =>
    String(item.policy_id || item.id) === String(policyId) ||
    String(item.policy_number || item.code) === String(policyId)
  );

  if (!p) {
    showToast(`Policy details for ${policyId} not available.`);
    return;
  }

  const pNumber = p.policy_number || p.code || p.id || policyId;
  const pType = p.policy_type || p.type || 'Insurance Policy';
  const cName = p.customer_name || p.custName || customerName || 'Policyholder';
  const cId = p.customer_id || p.custId || 'Not available';
  const pStatus = p.status || 'Active';
  const pCategory = p.category || 'General';
  const pPrem = p.formatted_premium || (p.premium ? (typeof p.premium === 'number' ? `$${p.premium.toLocaleString()}/yr` : p.premium) : 'Not available');
  const pStart = p.start_date || p.effective || 'Not available';
  const pEnd = p.end_date || p.expiry || 'Not available';

  const statusBadgeClass = (pStatus.toLowerCase() === 'active') ? 'badge-active' : 'badge-pending';

  const contentHtml = `
    <div class="policy-context-desc-box" style="margin-bottom: 1.25rem; padding: 0.95rem 1.15rem; background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: 8px;">
      <p style="font-size: 0.85rem; color: var(--blue-900); line-height: 1.5; margin: 0; font-weight: 500;">
        Policy record for <strong>${cName}</strong> (${pNumber}). Underwritten under the <strong>${pCategory}</strong> line.
      </p>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Policy Overview</div>
      <div class="detail-row"><span class="detail-label">Policyholder</span><span class="detail-value" style="color:var(--blue-900);font-weight:700">${cName} ${cId !== 'Not available' ? `<span style="font-size:0.75rem;color:var(--gray-500);font-weight:normal">(${cId})</span>` : ''}</span></div>
      <div class="detail-row"><span class="detail-label">Policy Number</span><span class="detail-value" style="font-family:monospace;font-weight:600">${pNumber}</span></div>
      <div class="detail-row"><span class="detail-label">Policy Type</span><span class="detail-value">${pType}</span></div>
      <div class="detail-row"><span class="detail-label">Category</span><span class="badge badge-info">${pCategory}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="badge ${statusBadgeClass}">${pStatus}</span></div>
      <div class="detail-row"><span class="detail-label">Annual Premium</span><span class="detail-value" style="color:var(--blue-900);font-size:1rem;font-weight:700;">${pPrem}</span></div>
      <div class="detail-row"><span class="detail-label">Effective Date</span><span class="detail-value">${pStart}</span></div>
      <div class="detail-row"><span class="detail-label">Expiration Date</span><span class="detail-value">${pEnd}</span></div>
    </div>
  `;

  openOrUpdateSlidePanel(`${pType}`, `Policy: ${pNumber} · ${cName}`, contentHtml);
}


// Render Agent Renewals Slide-Out Panel
async function openAgentRenewalsSlidePanel() {
  highlightActiveCard('agent-card-renewals');

  // Fetch latest renewal items from Agent Service
  await fetchAgentRenewals();
  const backendRenewals = (window.agentRenewalsData && window.agentRenewalsData.length > 0)
    ? window.agentRenewalsData
    : ((window.agentDashboardData && window.agentDashboardData.assigned_renewals) || []);

  const allRenewals = backendRenewals.map(r => {
    const name = r.customer_name || 'Client';
    const policyNum = r.policy_number || r.policy_id || 'N/A';
    const policyId = r.policy_id || r.policy_number;
    const polType = r.policy_type || 'Policy';
    const renDate = r.renewal_date || 'Upcoming';
    const daysLeft = r.days_until_expiry != null ? `${r.days_until_expiry} days` : 'Upcoming';
    const rawPrem = r.renewal_premium != null ? r.renewal_premium : r.prem;
    const prem = rawPrem != null
      ? (typeof rawPrem === 'number' ? `$${rawPrem.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : rawPrem)
      : 'Not available';
    const status = r.status || 'Approaching Expiry';
    const renewalId = r.renewal_id || null;
    const reminderSent = Boolean(r.reminder_sent);
    const reminderSentAt = r.reminder_sent_at || null;

    return {
      name,
      policy: policyNum,
      policy_id: policyId,
      type: polType,
      date: renDate,
      days: daysLeft,
      prem,
      status,
      renewal_id: renewalId,
      reminder_sent: reminderSent,
      reminder_sent_at: reminderSentAt
    };
  });

  const pendingCount = allRenewals.filter(r => (r.status || '').toLowerCase() === 'pending approval').length;

  if (allRenewals.length === 0) {
    const emptyHtml = `
      <div style="padding: 2.5rem 1rem; text-align: center; color: var(--gray-500);">
        <div style="font-weight: 600; font-size: 1rem; color: var(--blue-900); margin-bottom: 6px;">No Approaching Renewals</div>
        <div style="font-size: 0.85rem;">None of your assigned customer policies are expiring within 30 days or pending approval.</div>
      </div>
    `;
    openOrUpdateSlidePanel('Approaching Renewals (0)', 'Assigned Customer Policy Expirations & Approvals', emptyHtml);
    return;
  }

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Showing <strong>${allRenewals.length} approaching renewals</strong> (${pendingCount} pending approval) across your customer accounts:
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;width:100%;box-sizing:border-box;">
          ${allRenewals.map(r => {
            const isPending = (r.status || '').toLowerCase() === 'pending approval';
            const isApproved = (r.status || '').toLowerCase() === 'approved';
            const badgeClass = isApproved ? 'badge-active' : (isPending ? 'badge-pending' : 'badge-info');
            const statusLabel = r.status || 'Approaching Expiry';

            let actionButtons = '';
            if (isPending && r.renewal_id) {
              actionButtons = `
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${r.policy_id || r.policy}', '${r.name}')">Inspect Policy</button>
                <button class="btn btn-primary btn-sm" style="background:#16a34a;border-color:#16a34a;color:#fff;" onclick="event.stopPropagation(); handleAgentApproveRenewal('${r.renewal_id}')">Approve</button>
              `;
            } else if (isApproved) {
              actionButtons = `
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${r.policy_id || r.policy}', '${r.name}')">Inspect Policy</button>
                <span class="badge badge-active" style="padding:4px 10px;">Renewal Approved</span>
              `;
            } else if (r.reminder_sent) {
              actionButtons = `
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${r.policy_id || r.policy}', '${r.name}')">Inspect Policy</button>
                <button class="btn btn-sm" style="background:var(--gray-100);color:var(--gray-600);border:1px solid var(--gray-300);cursor:default;font-weight:600;padding:4px 10px;" disabled title="Reminder recorded in database on ${r.reminder_sent_at}">✓ Reminder Sent (${r.reminder_sent_at || 'Recorded'})</button>
              `;
            } else {
              actionButtons = `
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${r.policy_id || r.policy}', '${r.name}')">Inspect Policy</button>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); handleAgentSendRenewalReminder('${r.policy_id || r.policy}', '${r.name}')">Send Client Reminder</button>
              `;
            }

            return `
              <div class="card" style="padding:1.15rem 1.25rem;width:100%;box-sizing:border-box;align-self:stretch;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;gap:10px;">
                  <div style="min-width:0;flex:1;">
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.95rem;">${r.type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);margin-top:2px;">Client: <strong style="color:var(--gray-700);">${r.name}</strong> · <span style="font-family:monospace">${r.policy}</span></div>
                  </div>
                  <span class="badge ${badgeClass}" style="flex-shrink:0;">${statusLabel}</span>
                </div>
                <div class="detail-row"><span class="detail-label">Renewal Date</span><span class="detail-value">${r.date}</span></div>
                <div class="detail-row"><span class="detail-label">Renewal Premium</span><span class="detail-value" style="color:var(--blue-900);font-weight:700">${r.prem}</span></div>
                <div class="detail-row"><span class="detail-label">Current Status</span><span class="detail-value" style="font-weight:600;">${statusLabel}</span></div>
                <div style="margin-top:0.85rem;display:flex;justify-content:flex-end;align-items:center;gap:8px;flex-wrap:wrap;">
                  ${actionButtons}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

  openOrUpdateSlidePanel(`Approaching Renewals (${allRenewals.length})`, 'Assigned Customer Policy Expirations & Approvals', contentHtml);
}


// Render Agent Customers Slide Panel List
function openAgentCustomersSlidePanel() {
  highlightActiveCard('agent-card-customers');
  const agentName = getAgentDisplayName();
  const rawCustomers = (window.agentCustomersData && window.agentCustomersData.customers) ||
                       (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                       MOCK_DB.assignedCustomers || [];
  const totalCount = rawCustomers.length;

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          All <strong>${totalCount} assigned customer accounts</strong> currently under your agent care:
        </div>
        <div class="compact-list-scroll" style="max-height: 480px; display:flex;flex-direction:column;gap:0.65rem;">
          ${rawCustomers.map(c => {
            const cId = c.customer_id || c.id;
            const cName = c.name;
            const totalPols = c.total_policies != null ? c.total_policies : (c.totalPolicies || (c.policies ? c.policies.length : 0));
            const location = c.phone || c.city || 'Primary Client';
            return `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openCustomerDetailsPanel('${cId}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${cName}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${cId} · ${totalPols} Policies · ${location}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openCustomerDetailsPanel('${cId}')">View Client →</button>
            </div>
          `;}).join('')}
        </div>
      `;

  openOrUpdateSlidePanel(`Assigned Customers (${totalCount})`, `Agent ${agentName} Directory`, contentHtml);
}

// Render Agent Policies Slide Panel List
function openAgentPoliciesSlidePanel() {
  highlightActiveCard('agent-card-policies');
  const policiesList = (window.agentPoliciesData && window.agentPoliciesData.policies) ||
                       (window.agentCustomersData && window.agentCustomersData.customers && window.agentCustomersData.customers.flatMap(c => (c.policies || []).map(p => ({ ...p, custName: c.name, custId: c.customer_id })))) ||
                       MOCK_DB.assignedCustomers.flatMap(c => c.policies.map(p => ({ ...p, custName: c.name })));
  const count = policiesList.length;
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          ${count} active policies belonging to your assigned customer accounts:
        </div>
        <div class="compact-list-scroll" style="max-height: 480px; display:flex;flex-direction:column;gap:0.65rem;">
          ${policiesList.map(p => {
            const pId = p.policy_number || p.policy_id || p.id || '';
            const pCust = p.customer_name || p.custName || 'Assigned Client';
            const pType = p.policy_type || p.type || 'Insurance Policy';
            const pPrem = p.formatted_premium || (p.premium ? (typeof p.premium === 'number' ? `$${p.premium.toLocaleString()}` : p.premium) : '$0');
            const pExp = p.end_date || p.expiry || 'N/A';
            return `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${pId}', '${pCust}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${pType}</div>
                <div style="font-size:0.8rem;color:var(--gray-500)">Client: ${pCust} · <span style="font-family:monospace">${pId}</span></div>
                <div style="font-size:0.75rem;color:var(--gray-500)">Premium: ${pPrem}/yr · Renews: ${pExp}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${pId}', '${pCust}')">Inspect →</button>
            </div>
          `;}).join('')}
        </div>
      `;

  openOrUpdateSlidePanel(`Assigned Customer Policies (${count})`, 'Active Client Policy Portfolio', contentHtml);
}

// Render Agent Premium Breakdown Slide Panel
function openAgentPremiumSlidePanel() {
  highlightActiveCard('agent-card-premium');
  const dash = window.agentDashboardData || {};
  const formattedPrem = dash.formatted_annual_premium || '$538,507.33';
  const totalCust = dash.total_assigned_customers || 6;
  const totalPol = dash.total_policies || 15;
  const pbt = (dash.premium_by_type && dash.premium_by_type.length > 0) ? dash.premium_by_type : [
    { policy_type: 'General Liability', formatted_premium: '$169,909.29', percentage: 31.6 },
    { policy_type: 'Commercial Property', formatted_premium: '$159,960.02', percentage: 29.7 },
    { policy_type: 'Auto', formatted_premium: '$136,435.16', percentage: 25.3 },
    { policy_type: 'Homeowners', formatted_premium: '$59,503.09', percentage: 11.0 }
  ];

  const contentHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Assigned Annual Premium Portfolio</div>
          <div style="font-size:2.2rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">${formattedPrem}<span style="font-size:1rem;color:var(--gray-500);font-weight:normal">/year</span></div>
          <p style="font-size:0.85rem;color:var(--gray-600)">Total portfolio across ${totalCust} assigned customers and ${totalPol} policies.</p>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Portfolio Line Distribution</div>
          ${pbt.map(item => `
            <div class="detail-row"><span class="detail-label">${item.policy_type}</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">${item.formatted_premium} (${item.percentage}%)</span></div>
          `).join('')}
        </div>
      `;

  openOrUpdateSlidePanel(`Premium Portfolio (${formattedPrem})`, '', contentHtml);
}

/**
 * ADMIN DASHBOARD SLIDE PANELS (TOTAL USERS, CUSTOMERS, AGENTS, UNDERWRITERS, POLICIES, ACTIVE)
 */
function openAdminUsersSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-users');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Showing enterprise distribution across <strong>248 registered accounts</strong>:
        </div>
        <div class="detail-section" style="margin-bottom:1rem;">
          <div class="detail-row"><span class="detail-label">Customers</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">180 (73%)</span></div>
          <div class="detail-row"><span class="detail-label">Licensed Agents</span><span class="detail-value" style="font-weight:700;color:#0d9488">32 (13%)</span></div>
          <div class="detail-row"><span class="detail-label">Risk Underwriters</span><span class="detail-value" style="font-weight:700;color:#7c3aed">24 (10%)</span></div>
          <div class="detail-row"><span class="detail-label">System Administrators</span><span class="detail-value" style="font-weight:700;color:#0f172a">12 (5%)</span></div>
        </div>
        <div style="font-size:0.825rem;font-weight:700;color:var(--blue-900);margin-bottom:0.5rem;">Sample Registered User Accounts:</div>
        <div class="compact-list-scroll" style="max-height: 400px; display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1rem;">
          ${MOCK_DB.users.map(u => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openUserDetailsPanel('${u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.id} · <span class="badge" style="font-size:0.7rem;padding:2px 6px;">${u.role}</span> · ${u.email}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-block btn-sm" onclick="openCreateUserPanel()">Create User</button>
          <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('admin-users'); closeSlidePanel();">Open User Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Total Registered Users (248)', 'Enterprise Identity Directory', contentHtml);
};

function openAdminCustomersSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-customers');
  const customers = MOCK_DB.users.filter(u => u.role === 'Customer');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>180 registered customers</strong> across active property, vehicle, and commercial policies.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${customers.map(u => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openUserDetailsPanel('${u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.id} · ${u.email} · ${u.policiesCount || 2} Policies</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Customer';renderAdminUsersTable('Customer','all','');}navigateTo('admin-users');closeSlidePanel();">View All Customers in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Total Customers (180)', 'Registered Policyholders', contentHtml);
};

function openAdminAgentsSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-agents');
  const agents = MOCK_DB.users.filter(u => u.role === 'Agent');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>32 licensed insurance agents</strong> actively managing client advisory portfolios.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${agents.map(u => `
            <div class="panel-policy-list-item" style="border-left:3px solid #0d9488;cursor:pointer;" onclick="openUserDetailsPanel('${u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.id} · ${u.assignedInfo}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Agent';renderAdminUsersTable('Agent','all','');}navigateTo('admin-users');closeSlidePanel();">Manage Agents in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Total Agents (32)', 'Licensed Advisory Brokers', contentHtml);
};

function openAdminUnderwritersSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-underwriters');
  const underwriters = MOCK_DB.users.filter(u => u.role === 'Underwriter');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>24 risk assessment underwriters</strong> managing application queues.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${underwriters.map(u => `
            <div class="panel-policy-list-item" style="border-left:3px solid #7c3aed;cursor:pointer;" onclick="openUserDetailsPanel('${u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.id} · ${u.assignedInfo}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Underwriter';renderAdminUsersTable('Underwriter','all','');}navigateTo('admin-users');closeSlidePanel();">Manage Underwriters in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Total Underwriters (24)', 'Risk Decision Officers', contentHtml);
};

function openAdminPoliciesSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-policies');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Platform repository holds <strong>426 total insurance policies</strong>:
        </div>
        <div class="detail-section" style="margin-bottom:1rem;">
          <div class="detail-row"><span class="detail-label">Active Policies</span><span class="detail-value" style="font-weight:700;color:#059669">378 (89%)</span></div>
          <div class="detail-row"><span class="detail-label">Pending Approval</span><span class="detail-value" style="font-weight:700;color:#d97706">24 (6%)</span></div>
          <div class="detail-row"><span class="detail-label">Expired Policies</span><span class="detail-value" style="font-weight:700;color:var(--gray-500)">14 (3%)</span></div>
          <div class="detail-row"><span class="detail-label">Cancelled Policies</span><span class="detail-value" style="font-weight:700;color:#dc2626">10 (2%)</span></div>
        </div>
        <div style="font-size:0.825rem;font-weight:700;color:var(--blue-900);margin-bottom:0.5rem;">Sample Policies in Ledger:</div>
        <div class="compact-list-scroll" style="max-height: 400px; display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1rem;">
          ${MOCK_DB.allPolicies.map(p => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${p.id}', '${p.customer}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${p.type} · ${p.customer}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${p.id} · ${p.premium} · <span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}" style="font-size:0.7rem;padding:2px 6px;">${p.status}</span></div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.id}', '${p.customer}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div>
          <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('admin-policies'); closeSlidePanel();">Open Policy Management Ledger →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Total Policies (426)', 'Enterprise Policy Repository', contentHtml);
};

function openAdminActivePoliciesSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-active');
  const activePolicies = MOCK_DB.allPolicies.filter(p => p.status === 'Active');
  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Showing <strong>378 active in-force policies</strong> currently bound in the platform.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${activePolicies.map(p => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${p.id}', '${p.customer}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${p.type} · ${p.customer}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${p.id} · ${p.premium} · Agent: ${p.agent}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.id}', '${p.customer}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const s=document.getElementById('admin-policy-status-filter');if(s){s.value='Active';renderAdminPoliciesTable('all','Active','');}navigateTo('admin-policies');closeSlidePanel();">View All Active Policies in Ledger →</button>
        </div>
      `;
  openOrUpdateSlidePanel('Active Policies (378)', 'In-Force Insurance Contracts', contentHtml);
};

function highlightActiveCard(cardId) {
  document.querySelectorAll('.stat-card, .admin-stat-item').forEach(c => c.classList.remove('active-card'));
  const active = document.getElementById(cardId);
  if (active) active.classList.add('active-card');
}

function getAgentDisplayName() {
  return (MOCK_DB.agent && MOCK_DB.agent.name) ||
         (window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.name) ||
         'Aarav Sharma';
}

function renderAgentProfile() {
  const profile = MOCK_DB.agent || (window.CURRENT_AUTH && window.CURRENT_AUTH.user) || {};
  const name = profile.name || 'Aarav Sharma';
  const email = profile.email || 'aarav.sharma@insureassist.com';
  const userId = profile.id || profile.user_id || 'AGT-1321';
  const role = profile.role || 'Agent';
  const initials = profile.initials || 'AS';

  const welcomeEl = document.getElementById('agent-welcome-title');
  if (welcomeEl) welcomeEl.textContent = `Welcome back, ${name.split(' ')[0]}!`;

  const headerName = document.getElementById('header-user-name');
  if (headerName && MOCK_DB.currentRole === 'agent') headerName.textContent = name;

  const headerAvatar = document.getElementById('header-user-avatar');
  if (headerAvatar && MOCK_DB.currentRole === 'agent') headerAvatar.textContent = initials;

  const profAvatar = document.getElementById('agent-profile-avatar');
  if (profAvatar) profAvatar.textContent = initials;

  const profName = document.getElementById('agent-profile-name');
  if (profName) profName.textContent = name;

  const profFullname = document.getElementById('agent-profile-fullname');
  if (profFullname) profFullname.textContent = name;

  const profId = document.getElementById('agent-profile-id');
  if (profId) profId.textContent = userId;

  const profIdSub = document.getElementById('agent-profile-id-sub');
  if (profIdSub) profIdSub.textContent = userId;

  const profRoleSub = document.getElementById('agent-profile-role-sub');
  if (profRoleSub) profRoleSub.textContent = role;

  const profRole = document.getElementById('agent-profile-role');
  if (profRole) profRole.textContent = role;

  const profEmail = document.getElementById('agent-profile-email');
  if (profEmail) profEmail.textContent = email;
}

function renderAgentDashboard() {
  renderAgentProfile();

  const dash = window.agentDashboardData;
  const custData = window.agentCustomersData;
  const polData = window.agentPoliciesData;

  const totalCustomers = (dash && dash.total_assigned_customers != null)
    ? dash.total_assigned_customers
    : ((custData && custData.total != null) ? custData.total : (MOCK_DB.assignedCustomers ? MOCK_DB.assignedCustomers.length : 6));

  const activePolicies = (dash && dash.active_policies_count != null)
    ? dash.active_policies_count
    : ((polData && polData.policies) ? polData.policies.filter(p => (p.status || '').toLowerCase() === 'active').length : 8);

  const upcomingRenewalsCount = (dash && dash.assigned_renewals)
    ? dash.assigned_renewals.length
    : ((window.agentRenewalsData && window.agentRenewalsData.length) ? window.agentRenewalsData.length : 2);

  const pendingRenewals = (dash && dash.pending_renewals_count != null)
    ? dash.pending_renewals_count
    : 1;

  const formattedPrem = (dash && dash.formatted_annual_premium)
    ? dash.formatted_annual_premium
    : '$538,507.33';

  // 1. Four Summary Cards
  const custEl = document.getElementById('agent-stat-customers');
  if (custEl) custEl.textContent = totalCustomers;

  const polEl = document.getElementById('agent-stat-policies');
  if (polEl) polEl.textContent = activePolicies;

  const renEl = document.getElementById('agent-stat-renewals');
  if (renEl) renEl.textContent = upcomingRenewalsCount;

  const premEl = document.getElementById('agent-stat-premium');
  if (premEl) premEl.textContent = formattedPrem;

  // 2. Chart Header & Subtitle
  const chartSubtitle = document.getElementById('agent-premium-chart-subtitle');
  if (chartSubtitle) chartSubtitle.textContent = `Distribution across your assigned ${activePolicies} active client policies`;

  const chartTotal = document.getElementById('agent-premium-chart-total');
  if (chartTotal) chartTotal.textContent = `${formattedPrem} Total`;

  // 3. Dynamic Horizontal Premium by Policy Type Chart
  const chartBarsContainer = document.getElementById('agent-premium-chart-bars');
  if (chartBarsContainer) {
    const premiumByType = (dash && dash.premium_by_type && dash.premium_by_type.length > 0)
      ? dash.premium_by_type
      : [
        { policy_type: 'General Liability', category: 'Commercial', formatted_premium: '$169,909.29', percentage: 31.6 },
        { policy_type: 'Commercial Property', category: 'Property', formatted_premium: '$159,960.02', percentage: 29.7 },
        { policy_type: 'Auto', category: 'Vehicle', formatted_premium: '$136,435.16', percentage: 25.3 },
        { policy_type: 'Homeowners', category: 'Property', formatted_premium: '$59,503.09', percentage: 11.0 },
        { policy_type: 'Renters', category: 'Property', formatted_premium: '$12,699.77', percentage: 2.4 }
      ];

    const accents = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'];
    chartBarsContainer.innerHTML = premiumByType.map((item, idx) => {
      const accent = accents[idx % accents.length];
      const iconSvg = getPolicyCardIcon(item.category || item.policy_type, item.policy_type);
      return `
        <div class="chart-row" data-tooltip="${item.policy_type}: ${item.formatted_premium} (${item.percentage}%)">
          <div class="chart-row-label">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              ${iconSvg}
            </svg>
            ${item.policy_type}
          </div>
          <div class="chart-row-track">
            <div class="chart-row-fill ${accent}" style="width: ${Math.max(item.percentage, 8)}%;">${item.percentage}%</div>
          </div>
          <div class="chart-row-val">${item.formatted_premium}</div>
        </div>
      `;
    }).join('');
  }

  // 4. Renewals Header
  const renHeader = document.getElementById('agent-dashboard-renewals-title');
  if (renHeader) renHeader.textContent = `Assigned Customer Renewals (${upcomingRenewalsCount})`;

  // 5. Section Counts and Labels
  const quickSearch = document.getElementById('agent-quick-search-count');
  if (quickSearch) quickSearch.textContent = `${totalCustomers} assigned client accounts`;

  const pageTitle = document.getElementById('agent-customers-page-title');
  if (pageTitle) pageTitle.textContent = `My Assigned Customers (${totalCustomers})`;

  const portalTag = document.getElementById('agent-customers-portal-tag');
  if (portalTag) portalTag.textContent = `${totalCustomers} Assigned Clients`;

  renderAgentDashboardTable();
  renderAgentDashboardRenewals();
  renderAgentFullCustomersDirectory();
  renderAgentPoliciesTable();
}

/**
 * RENDERERS FOR AGENT TABLES & PAGES
 */
function renderAgentDashboardTable(searchTerm = '') {
  const tbody = document.getElementById('agent-dashboard-customers-tbody');
  if (!tbody) return;

  const agentName = getAgentDisplayName();
  const rawCustomers = (window.agentCustomersData && window.agentCustomersData.customers) ||
                       (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                       MOCK_DB.assignedCustomers || [];
  const q = searchTerm.toLowerCase().trim();

  let list = rawCustomers.filter(c => {
    const name = c.name || '';
    const id = c.customer_id || c.id || '';
    const email = c.email || '';
    const city = c.city || c.phone || '';
    return name.toLowerCase().includes(q) ||
           id.toLowerCase().includes(q) ||
           email.toLowerCase().includes(q) ||
           city.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:var(--gray-500);padding:2.5rem;">
          <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px;color:var(--blue-900);">No Assigned Customers Found</div>
          <div style="font-size:0.85rem;">No client accounts matched "${searchTerm}" under Agent <strong>${agentName}</strong>.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.slice(0, 8).map(c => {
    const cId = c.customer_id || c.id || '';
    const cName = c.name || '';
    const totalPols = c.total_policies != null ? c.total_policies : (c.totalPolicies || (c.policies ? c.policies.length : 0));
    const activePols = c.active_policies != null ? c.active_policies : (c.activePolicies || (c.policies ? c.policies.filter(p => (p.status || '').toLowerCase() === 'active').length : 0));
    const nextRen = c.next_renewal || c.nextRenewal || 'N/A';
    return `
    <tr onclick="openCustomerDetailsPanel('${cId}')" title="Click to view details for ${cName}" style="cursor:pointer;">
      <td><strong style="color:var(--blue-900)">${cName}</strong></td>
      <td><code style="font-size:0.8rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${cId}</code></td>
      <td>${totalPols}</td>
      <td>${activePols}</td>
      <td><span class="badge badge-info">${nextRen}</span></td>
      <td style="text-align:right">
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openCustomerDetailsPanel('${cId}')">View Details →</button>
      </td>
    </tr>
  `;}).join('');
}

let agentCustomerCurrentPage = 1;
const agentCustomerPageSize = 10;

function renderAgentFullCustomersDirectory(searchTerm = '') {
  const tbody = document.getElementById('agent-full-customers-tbody');
  if (!tbody) return;

  const agentName = getAgentDisplayName();
  const q = (searchTerm || '').toLowerCase().trim();
  const statusFilter = document.getElementById('agent-full-customer-status-filter')?.value || 'all';

  const rawCustomers = (window.agentCustomersData && window.agentCustomersData.customers) ||
                       (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                       MOCK_DB.assignedCustomers || [];

  let list = rawCustomers.filter(c => {
    const name = c.name || '';
    const id = c.customer_id || c.id || '';
    const email = c.email || '';
    const phone = c.phone || c.city || '';
    return name.toLowerCase().includes(q) ||
           id.toLowerCase().includes(q) ||
           email.toLowerCase().includes(q) ||
           phone.toLowerCase().includes(q);
  });

  if (statusFilter === 'renewal') {
    list = list.filter(c => {
      const ren = c.next_renewal || c.nextRenewal || '';
      return ren && ren !== 'N/A';
    });
  }

  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / agentCustomerPageSize) || 1;
  if (agentCustomerCurrentPage > totalPages) agentCustomerCurrentPage = 1;

  const pageText = document.getElementById('agent-customers-page-text');
  if (pageText) pageText.textContent = `Page ${totalItems === 0 ? 0 : agentCustomerCurrentPage} of ${totalItems === 0 ? 0 : totalPages}`;

  const pageRange = document.getElementById('agent-customers-page-range');
  if (pageRange) {
    const start = totalItems === 0 ? 0 : (agentCustomerCurrentPage - 1) * agentCustomerPageSize + 1;
    const end = Math.min(agentCustomerCurrentPage * agentCustomerPageSize, totalItems);
    pageRange.textContent = `${start}-${end}`;
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;color:var(--gray-500);padding:2.5rem;">
          <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px;color:var(--blue-900);">No Assigned Customers Found</div>
          <div style="font-size:0.85rem;">No client accounts matched your filter under Agent <strong>${agentName}</strong>.</div>
        </td>
      </tr>
    `;
    return;
  }

  const paginatedList = list.slice((agentCustomerCurrentPage - 1) * agentCustomerPageSize, agentCustomerCurrentPage * agentCustomerPageSize);

  tbody.innerHTML = paginatedList.map(c => {
    const cId = c.customer_id || c.id || '';
    const cName = c.name || '';
    const totalPols = c.total_policies != null ? c.total_policies : (c.totalPolicies || (c.policies ? c.policies.length : 0));
    const renDate = c.renewal_date || c.renewalDate || c.next_renewal || c.nextRenewal || 'N/A';
    return `
    <tr onclick="openCustomerDetailsPanel('${cId}')" title="Click to view details for ${cName}" style="cursor:pointer;">
      <td><strong style="color:var(--blue-900)">${cName}</strong></td>
      <td><code style="font-size:0.8rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${cId}</code></td>
      <td>${c.email || 'N/A'}</td>
      <td>${c.phone || 'N/A'}</td>
      <td>${totalPols}</td>
      <td>${renDate}</td>
      <td style="text-align:right">
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openCustomerDetailsPanel('${cId}')" title="View details for ${cName}">
          View Details →
        </button>
      </td>
    </tr>
  `;}).join('');
}

function handleAgentCustomerPagination(direction) {
  const q = document.getElementById('agent-full-customer-search')?.value || '';
  const rawCustomers = (window.agentCustomersData && window.agentCustomersData.customers) ||
                       (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                       MOCK_DB.assignedCustomers || [];
  const list = rawCustomers.filter(c => {
    const name = c.name || '';
    const id = c.customer_id || c.id || '';
    const email = c.email || '';
    return name.toLowerCase().includes(q.toLowerCase()) ||
           id.toLowerCase().includes(q.toLowerCase()) ||
           email.toLowerCase().includes(q.toLowerCase());
  });
  const totalPages = Math.ceil(list.length / agentCustomerPageSize) || 1;
  const newPage = agentCustomerCurrentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    agentCustomerCurrentPage = newPage;
    renderAgentFullCustomersDirectory(q);
    showToast(`Navigated to page ${agentCustomerCurrentPage}`);
  } else {
    showToast(direction > 0 ? 'You are on the last page.' : 'You are on the first page.');
  }
}

function handleAgentFullCustomerFilter() {
  agentCustomerCurrentPage = 1;
  const q = document.getElementById('agent-full-customer-search')?.value || '';
  renderAgentFullCustomersDirectory(q);
}

function renderAgentPoliciesTable(categoryFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('agent-policies-tbody');
  if (!tbody) return;

  const agentName = getAgentDisplayName();
  const q = searchTerm.toLowerCase().trim();
  const catF = (categoryFilter || 'all').toLowerCase();

  const rawPolicies = (window.agentPoliciesData && window.agentPoliciesData.policies) ||
                      (window.agentCustomersData && window.agentCustomersData.customers && window.agentCustomersData.customers.flatMap(c => (c.policies || []).map(p => ({ ...p, custName: c.name, custId: c.customer_id })))) ||
                      MOCK_DB.assignedCustomers.flatMap(c => c.policies.map(p => ({
                        ...p,
                        custName: c.name,
                        custId: c.id
                      })));

  const totalCount = rawPolicies.length;
  const activeCount = rawPolicies.filter(p => (p.status || '').toLowerCase() === 'active').length;
  const inactiveCount = totalCount - activeCount;
  const totalCust = (window.agentCustomersData && window.agentCustomersData.total) || 6;

  const pageTitle = document.getElementById('agent-policies-page-title');
  if (pageTitle) {
    pageTitle.textContent = `Assigned Customer Policies (${totalCount})`;
  }

  const pageSubtitle = document.getElementById('agent-policies-page-subtitle');
  if (pageSubtitle) {
    pageSubtitle.textContent = `${totalCount} total policies across your ${totalCust} assigned customer accounts (${activeCount} Active · ${inactiveCount} Inactive/Expired)`;
  }

  const portalTag = document.getElementById('agent-policies-portal-tag');
  if (portalTag) {
    portalTag.textContent = `${totalCount} Total · ${activeCount} Active`;
  }

  const filtered = rawPolicies.filter(p => {
    const pType = p.policy_type || p.type || '';
    const pId = p.policy_number || p.policy_id || p.id || '';
    const pCat = p.category || '';
    const pCust = p.customer_name || p.custName || '';
    const matchesCategory = catF === 'all' || pCat.toLowerCase() === catF;
    const matchesSearch = !q || pType.toLowerCase().includes(q) || pId.toLowerCase().includes(q) || pCust.toLowerCase().includes(q) || pCat.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:var(--gray-500);padding:2.5rem;">
          <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px;color:var(--blue-900);">No Assigned Policies Found</div>
          <div style="font-size:0.85rem;">No customer policies matched your criteria under Agent <strong>${agentName}</strong>.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const custName = p.customer_name || p.custName || 'Policyholder';
    const custId = p.customer_id || p.custId || '';
    const polId = p.policy_number || p.policy_id || p.id || '';
    const polType = p.policy_type || p.type || '';
    const prem = p.formatted_premium || (p.premium ? (typeof p.premium === 'number' ? `$${p.premium.toLocaleString()}` : p.premium) : '$0');
    const expiry = p.end_date || p.expiry || 'N/A';

    return `
      <tr onclick="openPolicyDetailsPanel('${polId}', '${custName}')" title="Click to inspect policy ${polId}" style="cursor:pointer;">
        <td><strong>${custName}</strong> ${custId ? `<span style="font-size:0.75rem;color:var(--gray-500)">(${custId})</span>` : ''}</td>
        <td><code style="font-size:0.8rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${polId}</code></td>
        <td>${polType}</td>
        <td><span class="badge badge-info">${p.category || 'General'}</span></td>
        <td><span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}">${p.status || 'Active'}</span></td>
        <td style="font-weight:700;color:var(--blue-900)">${prem}${prem.endsWith('/yr') ? '' : '/yr'}</td>
        <td>${expiry}</td>
        <td style="text-align:right">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${polId}', '${custName}')">Inspect →</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAgentDashboardRenewals() {
  const container = document.getElementById('agent-dashboard-renewals-list');
  if (!container) return;

  const renewals = (window.agentDashboardData && window.agentDashboardData.assigned_renewals && window.agentDashboardData.assigned_renewals.length > 0)
    ? window.agentDashboardData.assigned_renewals
    : ((window.agentRenewalsData && window.agentRenewalsData.length > 0)
      ? window.agentRenewalsData
      : []);

  if (renewals.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--gray-500); font-size: 0.85rem;">
        No pending renewals requiring outreach.
      </div>
    `;
    return;
  }

  container.innerHTML = renewals.map(r => {
    const name = r.customer_name || r.name || 'Client';
    const policyNum = r.policy_number || r.policy || 'POL';
    const policyId = r.policy_id || r.policy_number || r.policy || '';
    const polType = r.policy_type || r.type || 'Policy';
    const renDate = r.renewal_date || r.date || 'Upcoming';
    const prem = r.renewal_premium ? (typeof r.renewal_premium === 'number' ? `$${r.renewal_premium.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}/yr` : r.renewal_premium) : (r.prem || 'Not available');
    const days = r.days_until_expiry != null ? `${r.days_until_expiry} days` : (r.days || 'Upcoming');
    const status = r.status || 'Approaching Expiry';
    const isPending = (status || '').toLowerCase().includes('pending');
    const isApproved = (status || '').toLowerCase().includes('approved');

    return `
      <div class="renewal-item" onclick="openPolicyDetailsPanel('${policyId}', '${name}')" data-tooltip="${name}: ${polType} (${days} · ${status})" style="cursor:pointer;">
        <div class="renewal-left">
          <div class="renewal-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div class="renewal-name">${polType} · ${name}</div>
            <div class="renewal-meta">Renews ${renDate} · ${prem}</div>
          </div>
        </div>
        <span class="badge ${isPending ? 'badge-pending' : (isApproved ? 'badge-active' : 'badge-info')}">${days}</span>
      </div>
    `;
  }).join('');
}

/**
 * RENDERERS FOR UNDERWRITER QUEUE & DECISION PANELS
 */
function renderUnderwriterQueueTable(statusFilter = 'all', riskFilter = 'all', productFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('underwriter-queue-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const filtered = MOCK_DB.underwriterQueue.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRisk = riskFilter === 'all' || item.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    const matchesProduct = productFilter === 'all' || item.product.toLowerCase().includes(productFilter.toLowerCase());
    const matchesSearch = item.id.toLowerCase().includes(q) || item.customer.toLowerCase().includes(q) || item.product.toLowerCase().includes(q);
    return matchesStatus && matchesRisk && matchesProduct && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--gray-500);padding:2rem;">No underwriting applications matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const riskBadgeClass = item.riskLevel === 'Low' ? 'badge-risk-low' : item.riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    const statusBadgeClass = item.status === 'Approved' ? 'badge-active' : item.status === 'Needs More Information' ? 'badge-info' : item.status === 'Rejected' ? 'badge-risk-high' : 'badge-pending';
    return `
          <tr onclick="openUnderwriterReviewPanel('${item.id}')" title="Click to review application ${item.id}">
            <td><code style="font-size:0.825rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:3px 8px;border-radius:4px;">${item.id}</code></td>
            <td><strong style="color:var(--blue-900)">${item.customer}</strong></td>
            <td>${item.product}</td>
            <td><span class="badge ${riskBadgeClass}">● ${item.riskLevel} (${item.riskScore})</span></td>
            <td style="font-weight:700;color:var(--blue-900)">${item.premium}/yr</td>
            <td><span style="font-size:0.825rem;color:var(--gray-600)">${item.submitted}</span></td>
            <td><span class="badge ${statusBadgeClass}" id="status-badge-${item.id}">${item.status}</span></td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openUnderwriterReviewPanel('${item.id}')" data-tooltip="Review ${item.id} (${item.customer})">Review →</button>
            </td>
          </tr>
        `;
  }).join('');
}

let uwQueueCurrentPage = 1;
const UW_PAGE_SIZE = 10;

function updateUnderwriterFilterCounts() {
  if (!MOCK_DB || !MOCK_DB.underwriterQueue) return;
  const total = MOCK_DB.underwriterQueue.length;
  const pending = MOCK_DB.underwriterQueue.filter(i => i.status === 'Pending').length;
  const info = MOCK_DB.underwriterQueue.filter(i => i.status === 'Needs More Information').length;
  const approved = MOCK_DB.underwriterQueue.filter(i => i.status === 'Approved').length;
  const rejected = MOCK_DB.underwriterQueue.filter(i => i.status === 'Rejected').length;

  const low = MOCK_DB.underwriterQueue.filter(i => i.riskLevel === 'Low').length;
  const med = MOCK_DB.underwriterQueue.filter(i => i.riskLevel === 'Medium').length;
  const high = MOCK_DB.underwriterQueue.filter(i => i.riskLevel === 'High').length;

  const statusSelect = document.getElementById('uw-full-status-filter');
  if (statusSelect) {
    const cur = statusSelect.value || 'all';
    statusSelect.innerHTML = `
          <option value="all">All Statuses (${total})</option>
          <option value="Pending">Pending (${pending})</option>
          <option value="Needs More Information">Needs More Info (${info})</option>
          <option value="Approved">Approved (${approved})</option>
          <option value="Rejected">Rejected (${rejected})</option>
        `;
    statusSelect.value = cur;
  }

  const riskSelect = document.getElementById('uw-full-risk-filter');
  if (riskSelect) {
    const cur = riskSelect.value || 'all';
    riskSelect.innerHTML = `
          <option value="all">Risk Level: All (${total})</option>
          <option value="Low">Low Risk (${low})</option>
          <option value="Medium">Medium Risk (${med})</option>
          <option value="High">High Risk (${high})</option>
        `;
    riskSelect.value = cur;
  }
}

function renderUnderwriterFullQueue(statusFilter, riskFilter, productFilter, searchTerm, keepPage = false) {
  const tbody = document.getElementById('underwriter-full-queue-tbody');
  if (!tbody) return;

  updateUnderwriterFilterCounts();

  const statusVal = statusFilter !== undefined ? statusFilter : (document.getElementById('uw-full-status-filter')?.value || 'all');
  const riskVal = riskFilter !== undefined ? riskFilter : (document.getElementById('uw-full-risk-filter')?.value || 'all');
  const prodVal = productFilter !== undefined ? productFilter : (document.getElementById('uw-full-product-filter')?.value || 'all');
  const searchVal = searchTerm !== undefined ? searchTerm : (document.getElementById('uw-full-queue-search')?.value || '');

  const q = (searchVal || '').toLowerCase().trim();

  const filtered = MOCK_DB.underwriterQueue.filter(item => {
    const matchesStatus = statusVal === 'all' || item.status.toLowerCase() === statusVal.toLowerCase();
    const matchesRisk = riskVal === 'all' || item.riskLevel.toLowerCase() === riskVal.toLowerCase();
    const matchesProduct = prodVal === 'all' || item.product.toLowerCase().includes(prodVal.toLowerCase());
    const matchesSearch = !q || item.id.toLowerCase().includes(q) || item.customer.toLowerCase().includes(q) || item.product.toLowerCase().includes(q);
    return matchesStatus && matchesRisk && matchesProduct && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / UW_PAGE_SIZE) || 1;
  if (!keepPage || uwQueueCurrentPage > totalPages) {
    if (!keepPage) uwQueueCurrentPage = 1;
    else uwQueueCurrentPage = Math.min(uwQueueCurrentPage, totalPages);
  }

  const startIdx = (uwQueueCurrentPage - 1) * UW_PAGE_SIZE;
  const endIdx = Math.min(startIdx + UW_PAGE_SIZE, filtered.length);
  const pagedItems = filtered.slice(startIdx, endIdx);

  const countEl = document.getElementById('uw-queue-count-text');
  if (countEl) {
    countEl.textContent = `Showing ${pagedItems.length} of ${filtered.length} Submissions`;
  }

  const pageTextEl = document.getElementById('uw-queue-page-text');
  if (pageTextEl) {
    pageTextEl.textContent = `Page ${uwQueueCurrentPage} of ${totalPages}`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--gray-500);padding:2.5rem;">No underwriting applications matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = pagedItems.map(item => {
    const riskBadgeClass = item.riskLevel === 'Low' ? 'badge-risk-low' : item.riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    const statusBadgeClass = item.status === 'Approved' ? 'badge-active' : item.status === 'Needs More Information' ? 'badge-info' : item.status === 'Rejected' ? 'badge-risk-high' : 'badge-pending';
    return `
          <tr onclick="openUnderwriterReviewPanel('${item.id}')" title="Click to review application ${item.id}">
            <td><code style="font-size:0.825rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:3px 8px;border-radius:4px;">${item.id}</code></td>
            <td><strong style="color:var(--blue-900)">${item.customer}</strong></td>
            <td>${item.product}</td>
            <td><span class="badge ${riskBadgeClass}">● ${item.riskLevel} (${item.riskScore})</span></td>
            <td style="font-weight:700;color:var(--blue-900)">${item.premium}/yr</td>
            <td><span style="font-size:0.825rem;color:var(--gray-600)">${item.submitted}</span></td>
            <td><span class="badge ${statusBadgeClass}" id="status-badge-${item.id}">${item.status}</span></td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openUnderwriterReviewPanel('${item.id}')">Review Case →</button>
            </td>
          </tr>
        `;
  }).join('');
}

function handleUnderwriterQueuePagination(delta) {
  const searchVal = document.getElementById('uw-full-queue-search')?.value || '';
  const statusVal = document.getElementById('uw-full-status-filter')?.value || 'all';
  const riskVal = document.getElementById('uw-full-risk-filter')?.value || 'all';
  const prodVal = document.getElementById('uw-full-product-filter')?.value || 'all';

  const q = (searchVal || '').toLowerCase().trim();
  const filtered = MOCK_DB.underwriterQueue.filter(item => {
    const matchesStatus = statusVal === 'all' || item.status.toLowerCase() === statusVal.toLowerCase();
    const matchesRisk = riskVal === 'all' || item.riskLevel.toLowerCase() === riskVal.toLowerCase();
    const matchesProduct = prodVal === 'all' || item.product.toLowerCase().includes(prodVal.toLowerCase());
    const matchesSearch = item.id.toLowerCase().includes(q) || item.customer.toLowerCase().includes(q) || item.product.toLowerCase().includes(q);
    return matchesStatus && matchesRisk && matchesProduct && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / UW_PAGE_SIZE) || 1;
  const newPage = uwQueueCurrentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    uwQueueCurrentPage = newPage;
    renderUnderwriterFullQueue(statusVal, riskVal, prodVal, searchVal, true);
  }
};

// Open Underwriting Review Slide-Out Panel (Req 8, 9, 10, 11, 12)
function openUnderwriterReviewPanel(appId) {
  const app = MOCK_DB.underwriterQueue.find(item => item.id === appId);
  if (!app) return;

  const riskPinPosition = app.riskLevel === 'Low' ? '15%' : app.riskLevel === 'Medium' ? '50%' : '85%';
  const riskBadgeClass = app.riskLevel === 'Low' ? 'badge-risk-low' : app.riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
  const statusBadgeClass = app.status === 'Approved' ? 'badge-active' : app.status === 'Needs More Information' ? 'badge-info' : app.status === 'Rejected' ? 'badge-risk-high' : 'badge-pending';

  const contentHtml = `
        <!-- Application Meta Overview -->
        <div class="detail-section">
          <div class="detail-section-title">Application Details</div>
          <div class="detail-row"><span class="detail-label">Application ID</span><span class="detail-value" style="font-family:monospace;font-weight:700;color:var(--blue-900)">${app.id}</span></div>
          <div class="detail-row"><span class="detail-label">Applicant Customer</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">${app.customer}</span></div>
          <div class="detail-row"><span class="detail-label">Product Type</span><span class="detail-value">${app.product}</span></div>
          <div class="detail-row"><span class="detail-label">Requested Coverage</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">${app.requestedCoverage}</span></div>
          <div class="detail-row"><span class="detail-label">Calculated Premium</span><span class="detail-value" style="color:var(--blue-700);font-weight:700;font-size:1rem">${app.premium}/yr</span></div>
          <div class="detail-row"><span class="detail-label">Standard Deductible</span><span class="detail-value">${app.deductible}</span></div>
          <div class="detail-row"><span class="detail-label">Proposed Effective Date</span><span class="detail-value">${app.effectiveDate}</span></div>
          <div class="detail-row">
            <span class="detail-label">Current Case Status</span>
            <span class="badge ${statusBadgeClass}" id="panel-status-badge">${app.status}</span>
          </div>
        </div>

        <!-- 9. RISK ASSESSMENT & VISUAL GAUGE -->
        <div class="detail-section">
          <div class="detail-section-title">Risk Assessment (${app.riskLevel} Risk · Score ${app.riskScore}/100)</div>
          
          <div class="risk-gauge-box">
            <div class="risk-gauge-labels">
              <span style="color:#059669;">LOW</span>
              <span style="color:#d97706;">MEDIUM</span>
              <span style="color:#dc2626;">HIGH</span>
            </div>
            <div class="risk-gauge-track">
              <div class="risk-gauge-pin" style="left: ${riskPinPosition};" data-tooltip="Score: ${app.riskScore}/100 (${app.riskLevel} Risk)"></div>
            </div>
          </div>

          <div style="font-size:0.825rem;font-weight:700;color:var(--gray-700);margin-bottom:0.5rem;">Identified Risk Factors:</div>
          <ul class="bullet-list coverage-list">
            ${app.riskFactors.map(rf => `<li>${rf}</li>`).join('')}
          </ul>
        </div>

        <!-- 10. COVERAGE / POLICY DETAILS -->
        <div class="detail-section">
          <div class="detail-section-title">Coverage Schedule</div>
          <ul class="bullet-list coverage-list">
            ${app.coverages.map(c => `<li>${c}</li>`).join('')}
          </ul>

          <div style="font-size:0.825rem;font-weight:700;color:var(--gray-700);margin-top:0.85rem;margin-bottom:0.5rem;">Policy Exclusions:</div>
          <ul class="bullet-list exclusion-list">
            ${app.exclusions.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>

        <!-- 11. DOCUMENTS -->
        <div class="detail-section">
          <div class="detail-section-title">Supporting Documents (${app.documents.length})</div>
          ${app.documents.map(doc => `
            <div class="doc-item-row">
              <div class="doc-item-title">
                <svg width="18" height="18" fill="none" stroke="var(--blue-600)" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                ${doc}
              </div>
              <button class="btn btn-outline btn-sm" onclick="showToast('Viewing verified document: ${doc}')">View</button>
            </div>
          `).join('')}
        </div>

        <!-- 12. UNDERWRITING DECISION ACTIONS (Req 12) -->
        <div class="detail-section" style="border-bottom:none;background:var(--gray-50);padding:1.25rem;border-radius:10px;border:1px solid var(--gray-200);">
          <div class="detail-section-title" style="margin-bottom:0.75rem;">Underwriting Decision</div>
          <p style="font-size:0.8rem;color:var(--gray-600);margin-bottom:1rem;">Select an underwriting action to update this case status in real-time:</p>
          
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn btn-success btn-block" onclick="makeUnderwritingDecision('${app.id}', 'Approved')">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Approve & Bind Policy
            </button>
            <button class="btn btn-warning btn-block" onclick="makeUnderwritingDecision('${app.id}', 'Needs More Information')">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Request More Information
            </button>
            <button class="btn btn-danger btn-block" onclick="makeUnderwritingDecision('${app.id}', 'Rejected')">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject Application
            </button>
          </div>
        </div>
      `;

  openOrUpdateSlidePanel(`Underwriting Review: ${app.id}`, `Applicant: ${app.customer} · ${app.product}`, contentHtml);
}

// Execute Underwriting Decision (Updates UI dynamically)
function makeUnderwritingDecision(appId, decision) {
  const app = MOCK_DB.underwriterQueue.find(item => item.id === appId);
  if (!app) return;

  app.status = decision;

  // Update badge in slide panel
  const panelBadge = document.getElementById('panel-status-badge');
  if (panelBadge) {
    panelBadge.textContent = decision;
    panelBadge.className = decision === 'Approved' ? 'badge badge-active' : decision === 'Needs More Information' ? 'badge badge-info' : 'badge badge-risk-high';
  }

  // Update badge in open tables
  const statusBadge = document.getElementById(`status-badge-${appId}`);
  if (statusBadge) {
    statusBadge.textContent = decision;
    statusBadge.className = decision === 'Approved' ? 'badge badge-active' : decision === 'Needs More Information' ? 'badge badge-info' : 'badge badge-risk-high';
  }

  // Recalculate stats dynamically from source of truth
  const pendingCount = MOCK_DB.underwriterQueue.filter(i => i.status === 'Pending').length;
  const highRiskCount = MOCK_DB.underwriterQueue.filter(i => i.riskLevel === 'High' && i.status !== 'Rejected').length;
  const approvedCount = MOCK_DB.underwriterQueue.filter(i => i.status === 'Approved').length;
  const infoCount = MOCK_DB.underwriterQueue.filter(i => i.status === 'Needs More Information').length;

  MOCK_DB.underwriter.stats.pendingReviews = pendingCount;
  MOCK_DB.underwriter.stats.highRiskCases = highRiskCount;
  MOCK_DB.underwriter.stats.approved = approvedCount;
  MOCK_DB.underwriter.stats.needsMoreInfo = infoCount;

  const elPending = document.querySelector('#card-uw-pending .stat-value');
  if (elPending) elPending.textContent = pendingCount;
  const elHighRisk = document.querySelector('#card-uw-high-risk .stat-value');
  if (elHighRisk) elHighRisk.textContent = highRiskCount;
  const elApproved = document.querySelector('#card-uw-approved .stat-value');
  if (elApproved) elApproved.textContent = approvedCount;
  const elInfo = document.querySelector('#card-uw-info .stat-value');
  if (elInfo) elInfo.textContent = infoCount;

  // Add to audit trail
  if (MOCK_DB.auditLogs) {
    MOCK_DB.auditLogs.unshift({
      time: 'Just now',
      user: 'Alex Vance',
      role: 'Underwriter',
      action: `Underwriting Decision: ${decision} (${app.id})`,
      meta: `Applicant: ${app.customer} · Product: ${app.product} · Premium: ${app.premium}`
    });
    renderAdminAuditLogs();
  }

  const toastMessage = decision === 'Approved'
    ? `Application ${appId} Approved! Policy bind instruction dispatched.`
    : decision === 'Needs More Information'
      ? `Information request notification sent to broker for ${appId}.`
      : `Application ${appId} Rejected due to underwriting risk criteria.`;

  showToast(toastMessage);

  // Re-render queue with current filter inputs
  const searchVal = document.getElementById('uw-search-input')?.value || '';
  const statusVal = document.getElementById('uw-status-filter')?.value || 'all';
  const riskVal = document.getElementById('uw-risk-filter')?.value || 'all';
  const prodVal = document.getElementById('uw-product-filter')?.value || 'all';
  renderUnderwriterQueueTable(statusVal, riskVal, prodVal, searchVal);
  renderUnderwriterFullQueue(statusVal, riskVal, prodVal, searchVal, true);
}

/**
 * RENDERERS FOR ADMIN PORTAL (USER GOVERNANCE, RBAC, POLICIES, AUDIT)
 */
function renderAdminDashboardUsersTable() {
  const tbody = document.getElementById('admin-dashboard-users-tbody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_DB.users.map(u => {
    const roleBadge = u.role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : u.role === 'Underwriter' ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : u.role === 'Agent' ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
    const statusBadge = u.status === 'Active' ? 'badge-active' : 'badge-pending';
    return `
          <tr onclick="openUserDetailsPanel('${u.id}')" title="Click to view details for ${u.name}" data-tooltip="View full identity and privilege profile for ${u.name}">
            <td><strong style="color:var(--blue-900)">${u.name}</strong></td>
            <td><code style="font-size:0.8rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;">${u.id}</code></td>
            <td>${u.email}</td>
            <td><span class="badge" style="${roleBadge}">${u.role}</span></td>
            <td><span class="badge ${statusBadge}">${u.status}</span></td>
            <td>${u.created}</td>
            <td style="text-align:right">
              <button class="btn btn-outline btn-sm table-action-btn" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')" data-tooltip="Inspect ${u.name}'s account">View →</button>
            </td>
          </tr>
        `;
  }).join('');
}

function renderAdminUsersTable(roleFilter = 'all', statusFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('admin-full-users-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const filtered = MOCK_DB.users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No system users matched your search/filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(u => {
    const roleBadge = u.role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : u.role === 'Underwriter' ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : u.role === 'Agent' ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
    const statusBadge = u.status === 'Active' ? 'badge-active' : 'badge-pending';
    return `
          <tr onclick="openUserDetailsPanel('${u.id}')" title="Click to view details for ${u.name}" data-tooltip="View full identity and privilege profile for ${u.name}">
            <td><strong style="color:var(--blue-900)">${u.name}</strong></td>
            <td><code style="font-size:0.8rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;">${u.id}</code></td>
            <td>${u.email}</td>
            <td><span class="badge" style="${roleBadge}">${u.role}</span></td>
            <td><span class="badge ${statusBadge}">${u.status}</span></td>
            <td>${u.created}</td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm table-action-btn" onclick="event.stopPropagation(); openUserDetailsPanel('${u.id}')" data-tooltip="Inspect ${u.name}'s account">View →</button>
            </td>
          </tr>
        `;
  }).join('');
}

// Open User Details Right-Side Slide Panel (Req 8)
function openUserDetailsPanel(userId) {
  const u = MOCK_DB.users.find(item => item.id === userId);
  if (!u) return;

  const roleBadge = u.role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : u.role === 'Underwriter' ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : u.role === 'Agent' ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';

  const contentHtml = `
        <div class="detail-section">
          <div class="detail-section-title">User Account Details</div>
          <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value" style="font-weight:700;color:var(--blue-900);font-size:1rem;">${u.name}</span></div>
          <div class="detail-row"><span class="detail-label">User ID</span><span class="detail-value" style="font-family:monospace;font-weight:700;">${u.id}</span></div>
          <div class="detail-row"><span class="detail-label">Email Address</span><span class="detail-value">${u.email}</span></div>
          <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${u.phone || '(555) 012-3456'}</span></div>
          <div class="detail-row"><span class="detail-label">Assigned Role</span><span class="badge" style="${roleBadge}">${u.role}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span class="badge ${u.status === 'Active' ? 'badge-active' : 'badge-pending'}">${u.status}</span></div>
          <div class="detail-row"><span class="detail-label">Created Date</span><span class="detail-value">${u.created}</span></div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Assigned Information</div>
          <div class="card" style="padding:1rem;background:var(--gray-50);border:1px solid var(--gray-200);">
            <div style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">
              ${u.role === 'Customer' ? 'Customer Account Hierarchy' : u.role === 'Agent' ? 'Assigned Broker Portfolio' : u.role === 'Underwriter' ? 'Risk Authority & Queue' : 'Administrator Superuser Scope'}
            </div>
            <div style="font-size:0.85rem;color:var(--gray-700);">${u.assignedInfo}</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-block btn-sm" onclick="showToast('Password reset link dispatched for ${u.name}.')">Send Password Reset</button>
          <button class="btn btn-primary btn-block btn-sm" onclick="showToast('User record verified.')">Confirm RBAC</button>
        </div>
      `;

  openOrUpdateSlidePanel(`User: ${u.name}`, `ID: ${u.id} · ${u.role} Account`, contentHtml);
}

// Open Create User Slide-Out Panel (Req 7)
function openCreateUserPanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const contentHtml = `
        <div class="detail-section" style="border-bottom:none;">
          <p style="font-size:0.85rem;color:var(--gray-600);margin-bottom:1.25rem;">
            Fill in the information below to provision a new user account with enterprise role assignment.
          </p>

          <form id="admin-create-user-form" onsubmit="handleCreateUserSubmit(event)">
            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-user-name" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Full Name *</label>
              <input type="text" id="new-user-name" class="form-control" placeholder="e.g. Rachel Adams" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-user-email" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Email Address *</label>
              <input type="email" id="new-user-email" class="form-control" placeholder="rachel.adams@email.com" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-user-phone" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Phone Number *</label>
              <input type="tel" id="new-user-phone" class="form-control" placeholder="(555) 345-6789" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-user-role" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Role Assignment *</label>
              <select id="new-user-role" class="form-control" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;background:var(--white);">
                <option value="Customer">Customer (Retail Policyholder)</option>
                <option value="Agent">Agent (Advisory & Brokerage)</option>
                <option value="Underwriter">Underwriter (Risk Assessment)</option>
                <option value="Admin">Admin (Platform Governance)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-user-status" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Account Status *</label>
              <select id="new-user-status" class="form-control" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;background:var(--white);">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label for="new-user-dept" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Organization / Portfolio Notes</label>
              <input type="text" id="new-user-dept" class="form-control" placeholder="e.g. Northeast Region · Commercial Advisory" style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div style="display:flex;gap:10px;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--gray-200);">
              <button type="button" class="btn btn-outline btn-block" onclick="closeSlidePanel()">Cancel</button>
              <button type="submit" class="btn btn-primary btn-block">Create User</button>
            </div>
          </form>
        </div>
      `;

  openOrUpdateSlidePanel('Create New User', 'Provision New InsureAssist Account', contentHtml);
};

// Handle Create User Submission (persists to state and updates UI)
function handleCreateUserSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('new-user-name');
  const emailInput = document.getElementById('new-user-email');
  const phoneInput = document.getElementById('new-user-phone');
  const roleInput = document.getElementById('new-user-role');
  const statusInput = document.getElementById('new-user-status');
  const deptInput = document.getElementById('new-user-dept');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '(555) 123-4567';
  const role = roleInput ? roleInput.value : 'Customer';
  const status = statusInput ? statusInput.value : 'Active';
  const dept = deptInput ? deptInput.value.trim() : '';

  // Form validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name) {
    showToast('Please enter the user\'s full name.');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!email || !emailRegex.test(email)) {
    showToast('Please enter a valid email address.');
    if (emailInput) emailInput.focus();
    return;
  }
  if (!phone) {
    showToast('Please enter a phone number.');
    if (phoneInput) phoneInput.focus();
    return;
  }

  // Generate ID according to existing convention
  const count = MOCK_DB.users.length + 1;
  const newId = `USR-${String(count).padStart(3, '0')}`;

  const assignedInfo = dept || (
    role === 'Customer' ? 'Assigned Agent: Alex Rivera' :
      role === 'Agent' ? 'Assigned Customers: 0 Accounts' :
        role === 'Underwriter' ? 'Senior Risk Officer · Queue Authority' :
          'System Governance & Root RBAC'
  );

  const newUser = {
    id: newId,
    name: name,
    email: email,
    phone: phone,
    role: role,
    status: status,
    created: 'Today',
    assignedInfo: assignedInfo,
    policiesCount: 0
  };

  // Add to data store
  MOCK_DB.users.unshift(newUser);

  // Add audit log
  MOCK_DB.auditLogs.unshift({
    time: 'Just now',
    user: 'Jordan Taylor',
    role: 'Admin',
    action: `Created new user account ${newId} (${name})`,
    meta: `Assigned role: ${role} · Status: ${status} · Email: ${email}`
  });

  // Update relevant dashboard counts
  const totalUsersEl = document.getElementById('admin-stat-total-users-val');
  if (totalUsersEl) {
    const cur = parseInt(totalUsersEl.textContent, 10) || 248;
    totalUsersEl.textContent = cur + 1;
  }

  if (role === 'Customer') {
    const totalCustEl = document.getElementById('admin-stat-total-customers-val');
    if (totalCustEl) {
      const cur = parseInt(totalCustEl.textContent, 10) || 180;
      totalCustEl.textContent = cur + 1;
    }
  } else if (role === 'Agent') {
    const totalAgtEl = document.getElementById('admin-stat-total-agents-val');
    if (totalAgtEl) {
      const cur = parseInt(totalAgtEl.textContent, 10) || 32;
      totalAgtEl.textContent = cur + 1;
    }
  } else if (role === 'Underwriter') {
    const totalUwEl = document.getElementById('admin-stat-total-underwriters-val');
    if (totalUwEl) {
      const cur = parseInt(totalUwEl.textContent, 10) || 24;
      totalUwEl.textContent = cur + 1;
    }
  }

  // Re-render user tables and audit logs
  renderAdminDashboardUsersTable();
  renderAdminUsersTable();
  renderAdminAuditLogs();

  // Show user details in the open panel with success notification
  openUserDetailsPanel(newId);
  showToast(`User ${name} (${newId}) created successfully as ${role}!`);
};

/**
 * ADMIN ROLE MANAGEMENT RENDERERS & RBAC CONTROLLERS
 */
function renderAdminRolesGrid() {
  const container = document.getElementById('admin-roles-grid-container');
  const countTag = document.getElementById('admin-roles-count-tag');
  if (countTag) countTag.textContent = `${MOCK_DB.roles.length} System Roles`;
  if (!container) return;

  container.innerHTML = MOCK_DB.roles.map(r => `
        <div class="admin-role-card">
          <div>
            <div class="admin-role-card-top">
              <div style="display:flex;align-items:center;gap:10px;">
                <div class="stat-icon-wrapper" style="width:40px;height:40px;margin-bottom:0;${r.iconBg || 'background:var(--blue-50);color:var(--blue-600);'}">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${r.iconSvg || '<circle cx="12" cy="12" r="10"/>'}</svg>
                </div>
                <div>
                  <h3 style="font-size:1.1rem;font-weight:700;color:var(--blue-900);margin:0;">${r.name}</h3>
                  <span style="font-size:0.8rem;color:var(--gray-500);">${r.subtitle || 'System Role'}</span>
                </div>
              </div>
              <span class="badge" style="${r.badgeStyle || 'background:var(--blue-50);color:var(--blue-800);'}font-size:0.825rem;font-weight:700;">${r.userCount} users</span>
            </div>

            <p class="admin-role-desc">${r.description}</p>

            <div style="font-size:0.8rem;font-weight:700;color:var(--gray-700);margin-bottom:0.4rem;display:flex;justify-content:space-between;align-items:center;">
              <span>Assigned Permissions (${r.permissions.length}):</span>
              <span style="font-size:0.75rem;color:var(--blue-600);font-weight:600;">Active RBAC</span>
            </div>
            
            <div class="admin-role-perms-box">
              <ul class="admin-role-perms-list">
                ${r.permissions.map(p => `
                  <li>
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${p}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="admin-role-card-footer">
            <button class="btn btn-outline btn-block btn-sm" data-panel-trigger="true" onclick="event.stopPropagation(); openConfigureRolePermissionsPanel('${r.id}')">
              Configure Permissions
            </button>
          </div>
        </div>
      `).join('');
};

// Open Configure Role Permissions Slide-Out Panel
function openConfigureRolePermissionsPanel(roleId) {
  const role = MOCK_DB.roles.find(r => r.id === roleId);
  if (!role) return;

  const categoriesHtml = RBAC_PERMISSION_CATEGORIES.map((cat, catIdx) => {
    const permsHtml = cat.permissions.map((p, pIdx) => {
      const isChecked = role.permissions.includes(p.name);
      const inputId = `perm-cb-${catIdx}-${pIdx}`;
      return `
            <label class="rbac-perm-row" for="${inputId}">
              <input type="checkbox" id="${inputId}" name="role-perm-cb" value="${p.name}" ${isChecked ? 'checked' : ''}>
              <div class="rbac-perm-label-group">
                <span class="rbac-perm-name">${p.name}</span>
                <span class="rbac-perm-desc">${p.desc}</span>
              </div>
            </label>
          `;
    }).join('');

    return `
          <div class="rbac-category-card">
            <div class="rbac-category-header">
              <span>${cat.category}</span>
              <span style="font-size:0.75rem;color:var(--gray-500);font-weight:500;">${cat.permissions.length} Available</span>
            </div>
            <div class="rbac-category-body">
              ${permsHtml}
            </div>
          </div>
        `;
  }).join('');

  const contentHtml = `
        <div class="detail-section" style="border-bottom:none;padding:0.5rem 0;">
          <div style="background:var(--blue-50);border:1px solid var(--blue-100);border-radius:8px;padding:0.85rem 1rem;margin-bottom:1.25rem;">
            <div style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:2px;">
              Configuring Privileges for ${role.name}
            </div>
            <div style="font-size:0.8rem;color:var(--blue-700);">
              Enable or disable granular feature access for all ${role.userCount} assigned accounts.
            </div>
          </div>

          <form id="rbac-role-config-form" onsubmit="event.preventDefault(); saveRolePermissions('${role.id}');">
            <div style="margin-bottom:1rem;">
              ${categoriesHtml}
            </div>

            <div style="display:flex;gap:10px;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--gray-200);">
              <button type="button" class="btn btn-outline btn-block" onclick="closeSlidePanel()">Cancel</button>
              <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
            </div>
          </form>
        </div>
      `;

  openOrUpdateSlidePanel(`Configure Permissions: ${role.name}`, `${role.subtitle || 'Role Policies'} · ${role.userCount} Users`, contentHtml);
};

// Save Updated Permissions for Role
function saveRolePermissions(roleId) {
  const role = MOCK_DB.roles.find(r => r.id === roleId);
  if (!role) return;

  const checkedCbs = document.querySelectorAll('input[name="role-perm-cb"]:checked');
  const selectedPerms = Array.from(checkedCbs).map(cb => cb.value);

  role.permissions = selectedPerms;

  // Add to audit log
  MOCK_DB.auditLogs.unshift({
    time: 'Just now',
    user: 'Jordan Taylor',
    role: 'Admin',
    action: `Updated RBAC permissions for ${role.name} role`,
    meta: `Saved ${selectedPerms.length} assigned privileges across platform matrix`
  });

  renderAdminRolesGrid();
  renderAdminAuditLogs();

  closeSlidePanel();
  showToast(`Permissions updated successfully for ${role.name} (${selectedPerms.length} active)!`);
};

// Open Create Role Slide-Out Panel
function openCreateRolePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();

  const categoriesHtml = RBAC_PERMISSION_CATEGORIES.map((cat, catIdx) => {
    const permsHtml = cat.permissions.map((p, pIdx) => {
      const inputId = `new-role-perm-${catIdx}-${pIdx}`;
      return `
            <label class="rbac-perm-row" for="${inputId}">
              <input type="checkbox" id="${inputId}" name="new-role-perm-cb" value="${p.name}">
              <div class="rbac-perm-label-group">
                <span class="rbac-perm-name">${p.name}</span>
                <span class="rbac-perm-desc">${p.desc}</span>
              </div>
            </label>
          `;
    }).join('');

    return `
          <div class="rbac-category-card">
            <div class="rbac-category-header">
              <span>${cat.category}</span>
              <span style="font-size:0.75rem;color:var(--gray-500);font-weight:500;">${cat.permissions.length} Available</span>
            </div>
            <div class="rbac-category-body">
              ${permsHtml}
            </div>
          </div>
        `;
  }).join('');

  const contentHtml = `
        <div class="detail-section" style="border-bottom:none;padding:0.5rem 0;">
          <p style="font-size:0.85rem;color:var(--gray-600);margin-bottom:1.25rem;">
            Define a custom enterprise security role and select authorized capabilities.
          </p>

          <form id="admin-create-role-form" onsubmit="handleCreateRoleSubmit(event)">
            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-role-name" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Role Name *</label>
              <input type="text" id="new-role-name" class="form-control" placeholder="e.g. Compliance Officer" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label for="new-role-subtitle" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Subtitle / Scope *</label>
              <input type="text" id="new-role-subtitle" class="form-control" placeholder="e.g. Regulatory & Risk Audit" required style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label for="new-role-desc" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Role Description *</label>
              <textarea id="new-role-desc" class="form-control" placeholder="Describe the responsibilities and scope of this role..." required rows="2" style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;resize:vertical;"></textarea>
            </div>

            <div style="font-weight:700;font-size:0.875rem;color:var(--blue-900);margin-bottom:0.75rem;">
              Select Role Permissions *
            </div>
            
            <div style="margin-bottom:1rem;">
              ${categoriesHtml}
            </div>

            <div style="display:flex;gap:10px;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--gray-200);">
              <button type="button" class="btn btn-outline btn-block" onclick="closeSlidePanel()">Cancel</button>
              <button type="submit" class="btn btn-primary btn-block">Create Role</button>
            </div>
          </form>
        </div>
      `;

  openOrUpdateSlidePanel('Create Role', 'Define Custom Enterprise RBAC Policy', contentHtml);
};

// Handle Create Role Submission
function handleCreateRoleSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('new-role-name');
  const subtitleInput = document.getElementById('new-role-subtitle');
  const descInput = document.getElementById('new-role-desc');

  const name = nameInput ? nameInput.value.trim() : '';
  const subtitle = subtitleInput ? subtitleInput.value.trim() : 'Custom Role';
  const desc = descInput ? descInput.value.trim() : '';

  if (!name) {
    showToast('Please enter a role name.');
    if (nameInput) nameInput.focus();
    return;
  }

  // Check unique name
  const existing = MOCK_DB.roles.find(r => r.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    showToast(`A role named "${name}" already exists. Please choose a unique name.`);
    if (nameInput) nameInput.focus();
    return;
  }

  const checkedCbs = document.querySelectorAll('input[name="new-role-perm-cb"]:checked');
  const selectedPerms = Array.from(checkedCbs).map(cb => cb.value);

  if (selectedPerms.length === 0) {
    showToast('Please select at least one permission for this role.');
    return;
  }

  const newId = `role-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const newRole = {
    id: newId,
    name: name,
    subtitle: subtitle,
    userCount: 0,
    badgeStyle: 'background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;',
    iconBg: 'background:#eff6ff;color:#2563eb;',
    iconSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    description: desc,
    permissions: selectedPerms
  };

  MOCK_DB.roles.push(newRole);

  // Add to audit log
  MOCK_DB.auditLogs.unshift({
    time: 'Just now',
    user: 'Jordan Taylor',
    role: 'Admin',
    action: `Created new enterprise role: ${name}`,
    meta: `Configured ${selectedPerms.length} initial access privileges`
  });

  renderAdminRolesGrid();
  renderAdminAuditLogs();

  closeSlidePanel();
  showToast(`Role "${name}" created successfully with ${selectedPerms.length} permissions!`);
};

// Render Policy Management Table (Req 10)
function renderAdminPoliciesTable(typeFilter = 'all', statusFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('admin-policies-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const filtered = MOCK_DB.allPolicies.filter(p => {
    const matchesType = typeFilter === 'all' || p.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = p.id.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.agent.toLowerCase().includes(q);
    return matchesType && matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No system policies matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
        <tr onclick="openPolicyDetailsPanel('${p.id}', '${p.customer}')" title="Click to view policy ${p.id}">
          <td><code style="font-size:0.825rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:3px 8px;border-radius:4px;">${p.id}</code></td>
          <td><strong style="color:var(--blue-900)">${p.customer}</strong></td>
          <td>${p.type}</td>
          <td><span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}">${p.status}</span></td>
          <td style="font-weight:700;color:var(--blue-900)">${p.premium}</td>
          <td><span style="font-size:0.85rem;color:var(--gray-700)">${p.agent}</span></td>
          <td style="text-align:right">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.id}', '${p.customer}')">View →</button>
          </td>
        </tr>
      `).join('');
}

// Render Audit Logs (Req 11)
function renderAdminAuditLogs() {
  const container = document.getElementById('admin-audit-log-container');
  if (!container) return;

  container.innerHTML = MOCK_DB.auditLogs.map(log => {
    const badgeColor = log.role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : log.role === 'Underwriter' ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : log.role === 'Agent' ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
    return `
          <div class="panel-policy-list-item" style="padding: 1rem 1.15rem;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div class="renewal-icon" style="margin-top:2px;">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                  <span style="font-weight:700;color:var(--blue-900);font-size:0.925rem;">${log.action}</span>
                  <span class="badge" style="${badgeColor};font-size:0.7rem;padding:1px 6px;">${log.role} · ${log.user}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--gray-600);">${log.meta}</div>
              </div>
            </div>
            <span style="font-size:0.775rem;color:var(--gray-500);font-weight:600;white-space:nowrap;">${log.time}</span>
          </div>
        `;
  }).join('');
}

/**
 * UNIFIED MULTI-ROLE AI CHAT CONTROLLERS
 */
function getRoleAiData(role) {
  if (!MOCK_DB.roleAiChat) MOCK_DB.roleAiChat = {};
  if (!MOCK_DB.roleAiChat[role]) {
    MOCK_DB.roleAiChat[role] = {
      activeConversationId: null,
      searchQuery: '',
      conversations: []
    };
  }
  return MOCK_DB.roleAiChat[role];
}

function searchRoleChat(role, query) {
  const data = getRoleAiData(role);
  data.searchQuery = (query || '').toLowerCase().trim();
  renderRoleChatHistory(role);
}

function renderRoleChatHistory(role) {
  const listContainer = document.getElementById(`${role}-chat-history-list`);
  if (!listContainer) return;

  const data = getRoleAiData(role);
  const activeId = data.activeConversationId;
  const q = (data.searchQuery || '').toLowerCase().trim();

  const filtered = data.conversations.filter(conv => {
    if (!q) return true;
    const matchesTitle = conv.title.toLowerCase().includes(q);
    const matchesMsg = conv.messages && conv.messages.some(m => m.content.toLowerCase().includes(q));
    return matchesTitle || matchesMsg;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
          <div style="padding: 1.5rem 0.5rem; text-align: center; color: var(--gray-500); font-size: 0.85rem;">
            No conversations found
          </div>
        `;
    return;
  }

  listContainer.innerHTML = filtered.map(conv => `
        <button class="chat-history-item ${conv.conversation_id === activeId ? 'active' : ''}" 
                onclick="selectRoleChatConversation('${role}', '${conv.conversation_id}')"
                data-tooltip="${conv.title}">
          <span class="chat-history-item-icon">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <span class="chat-history-item-text">${conv.title}</span>
        </button>
      `).join('');
}

function renderRoleChatMessages(role, conversationId) {
  const container = document.getElementById(`${role}-chat-messages-container`);
  const titleEl = document.getElementById(`${role}-chat-current-title`);
  if (!container) return;

  const data = getRoleAiData(role);
  const conv = conversationId ? data.conversations.find(c => c.conversation_id === conversationId) : null;

  const roleDefaults = {
    customer: { title: 'AI Insurance Assistant', avatar: 'SM', welcomeTitle: 'How can I help with your insurance today?', welcomeDesc: 'Ask questions about your policies, coverage, renewals, deductibles, and more.' },
    agent: { title: 'Agent AI Assistant', avatar: 'AR', welcomeTitle: 'How can I assist your client book today?', welcomeDesc: 'Ask questions about assigned customer policies, renewals, book value, or coverage limits.' },
    underwriter: { title: 'Underwriting Risk Assistant', avatar: 'AV', welcomeTitle: 'How can I assist your underwriting queue today?', welcomeDesc: 'Consult risk assessment models, loss runs, hazard scoring, or tier guidelines.' },
    admin: { title: 'Enterprise Governance Assistant', avatar: 'JT', welcomeTitle: 'How can I assist platform governance today?', welcomeDesc: 'Ask questions about enterprise users, RBAC roles, audit logs, or system metrics.' }
  };
  const def = roleDefaults[role] || roleDefaults.customer;

  if (!conv || !conv.messages || conv.messages.length === 0) {
    if (titleEl) titleEl.textContent = def.title;
    container.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:2.5rem 1.5rem;color:var(--gray-500);">
            <div style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg, var(--blue-600), var(--blue-500));color:white;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1rem;box-shadow:0 8px 20px rgba(13,110,253,0.25);">
              🤖
            </div>
            <h3 style="font-size:1.25rem;color:var(--blue-900);font-weight:700;margin-bottom:6px;">${def.welcomeTitle}</h3>
            <p style="font-size:0.875rem;color:var(--gray-600);max-width:460px;line-height:1.5;margin-bottom:1.25rem;">${def.welcomeDesc}</p>
          </div>
        `;
    return;
  }

  if (titleEl) titleEl.textContent = conv.title;

  container.innerHTML = conv.messages.map(m => `
        <div class="message ${m.sender}">
          <div class="message-avatar">${m.sender === 'bot' ? '🤖' : def.avatar}</div>
          <div>
            <div class="message-bubble">${m.content}</div>
            <div class="message-meta">
              <span>${m.timestamp || 'Just now'}</span>
              ${m.source ? `<span class="meta-badge"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> Source: ${m.source}</span>` : ''}
              ${m.confidence ? `<span class="confidence-tag">✓ ${m.confidence} Confidence</span>` : ''}
            </div>
          </div>
        </div>
      `).join('');

  container.scrollTop = container.scrollHeight;
}

function selectRoleChatConversation(role, convId) {
  const data = getRoleAiData(role);
  data.activeConversationId = convId;
  renderRoleChatHistory(role);
  renderRoleChatMessages(role, convId);
}

function startNewRoleChat(role) {
  const data = getRoleAiData(role);
  data.activeConversationId = null;
  renderRoleChatHistory(role);
  renderRoleChatMessages(role, null);
  const input = document.getElementById(`${role}-page-chat-input`);
  if (input) {
    input.value = '';
    input.focus();
  }
}

function sendRoleChatMessage(role, customText = null) {
  const input = document.getElementById(`${role}-page-chat-input`);
  const text = (customText || (input ? input.value : '')).trim();
  if (!text) return;

  const data = getRoleAiData(role);

  if (!data.activeConversationId) {
    const newId = `conv-${role}-${Date.now()}`;
    const newTitle = text.length > 32 ? text.substring(0, 29) + '...' : text;
    const newConv = {
      conversation_id: newId,
      title: newTitle,
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString(),
      messages: []
    };
    data.conversations.unshift(newConv);
    data.activeConversationId = newId;
  }

  let conv = data.conversations.find(c => c.conversation_id === data.activeConversationId);
  if (!conv) return;

  const userMsg = {
    message_id: `msg-${Date.now()}`,
    conversation_id: conv.conversation_id,
    sender: 'user',
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  conv.messages.push(userMsg);

  if (input) input.value = '';
  renderRoleChatHistory(role);
  renderRoleChatMessages(role, conv.conversation_id);

  setTimeout(() => {
    const botReply = getMockChatResponse(text, role);
    const sourceMap = {
      customer: 'Policy Information',
      agent: 'Agency Portfolio Ledger',
      underwriter: 'Underwriting Guidelines & Risk Model',
      admin: 'System Governance Matrix'
    };
    const botMsg = {
      message_id: `msg-${Date.now() + 1}`,
      conversation_id: conv.conversation_id,
      sender: 'bot',
      content: botReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: sourceMap[role] || 'System Knowledge Base',
      confidence: '95%'
    };
    conv.messages.push(botMsg);
    renderRoleChatMessages(role, conv.conversation_id);
  }, 450);
}

function handleRoleChatPrompt(role, promptText) {
  sendRoleChatMessage(role, promptText);
}

// Customer aliases for backwards-compatibility
function searchCustomerChatConversations(query) { searchRoleChat('customer', query); }
function renderCustomerChatHistory() { renderRoleChatHistory('customer'); }
function renderCustomerChatMessages(id) { renderRoleChatMessages('customer', id); }
function selectCustomerChatConversation(id) { selectRoleChatConversation('customer', id); }
function startNewCustomerChat() { startNewRoleChat('customer'); }
function sendCustomerChatMessage(text) { sendRoleChatMessage('customer', text); }
function handleCustomerPagePrompt(text) { handleRoleChatPrompt('customer', text); }

function initAllRoleChatListeners() {
  ['customer', 'agent', 'underwriter', 'admin'].forEach(role => {
    const searchInput = document.getElementById(`${role}-chat-search-input`);
    if (searchInput) {
      searchInput.addEventListener('input', (e) => searchRoleChat(role, e.target.value));
    }

    const newChatBtn = document.getElementById(`${role}-new-chat-btn`);
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => startNewRoleChat(role));
    }

    const sendBtn = document.getElementById(`${role}-page-chat-send-btn`);
    if (sendBtn) {
      sendBtn.addEventListener('click', () => sendRoleChatMessage(role));
    }

    const chatInput = document.getElementById(`${role}-page-chat-input`);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendRoleChatMessage(role);
        }
      });
    }
  });
}

// Assign customerAiChat reference
MOCK_DB.customerAiChat = MOCK_DB.roleAiChat.customer;

function renderCustomerRecommendations() {
  const container = document.getElementById('customer-recommendations-container');
  if (!container) return;

  container.innerHTML = MOCK_DB.recommendations.map(rec => `
        <div class="recommendation-card" id="rec-card-${(rec.id || rec.recommendation_id).toLowerCase()}">
          <div class="rec-card-body">
            <div class="rec-card-header">
              <div class="rec-icon ${rec.tagClass || ''}">
                ${rec.icon}
              </div>
              <span class="rec-tag ${rec.tagClass || ''}">${rec.category}</span>
            </div>
            <div class="rec-title">${rec.title}</div>
            <div class="rec-desc">${rec.description}</div>
          </div>
          <div class="rec-actions">
            <button class="btn btn-primary btn-sm" onclick="openRecommendationDetailsPanel('${rec.id || rec.recommendation_id}')">
              ${rec.action}
            </button>
          </div>
        </div>
      `).join('');
}

function openRecommendationDetailsPanel(recId) {
  const rec = MOCK_DB.recommendations.find(r => (r.id === recId || r.recommendation_id === recId));
  if (!rec) return;

  const contentHtml = `
        <div class="detail-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="rec-tag ${rec.tagClass || ''}" style="font-size:0.75rem;padding:4px 10px;">${rec.policy_type}</span>
            <span style="font-size:0.8rem;color:var(--gray-500);font-weight:600;">Ref: ${rec.recommendation_id}</span>
          </div>
          <h3 style="font-size:1.25rem;color:var(--blue-900);font-weight:700;margin-bottom:8px;">${rec.title}</h3>
          <p style="font-size:0.875rem;color:var(--gray-700);line-height:1.5;">${rec.overview}</p>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Why This Is Recommended For You</div>
          <div class="card" style="padding:1rem;background:var(--blue-50);border:1px solid var(--blue-100);">
            <div style="font-size:0.85rem;color:var(--blue-900);line-height:1.45;display:flex;align-items:flex-start;gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="flex-shrink:0;color:var(--blue-600);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>${rec.reason}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Key Protection Benefits</div>
          <ul class="bullet-list coverage-list">
            ${rec.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Estimated Pricing / Financial Impact</div>
          <div style="font-size:1.15rem;font-weight:700;color:var(--blue-900);">${rec.estimatedCost}</div>
          <div style="font-size:0.775rem;color:var(--gray-500);margin-top:2px;">Demonstration prototype estimate based on your 12-policy portfolio.</div>
        </div>

        <div style="display:flex;gap:10px;margin-top:1rem;">
          <button class="btn btn-primary btn-block" onclick="showToast('${rec.title} request sent to your assigned agent Alex Rivera.')">
            ${rec.primaryActionText}
          </button>
          <button class="btn btn-outline btn-block" onclick="closeSlidePanel()">
            Close
          </button>
        </div>
      `;

  openOrUpdateSlidePanel(`Suggestion: ${rec.title}`, `${rec.policy_type} · ${rec.recommendation_id}`, contentHtml);
}


async function fetchCustomerProfile() {
  try {
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.warn('Customer Service /customer/profile status:', response.status);
      return null;
    }
    const profile = await response.json();
    window.customerProfileData = profile;

    const elName = document.getElementById('cust-profile-name');
    const elId = document.getElementById('cust-profile-id');
    const elTier = document.getElementById('cust-profile-tier');
    const elAvatar = document.getElementById('cust-profile-avatar');

    if (elName) elName.textContent = profile.name;
    if (elId) elId.textContent = profile.id;
    const polCountText = `${profile.active_policies_count} ${profile.active_policies_count === 1 ? 'Policy' : 'Policies'}`;
    if (elTier) elTier.textContent = `Active Tier (${polCountText})`;
    if (elAvatar && profile.name) {
      const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      elAvatar.textContent = initials;
    }

    const elInfoFull = document.getElementById('cust-info-fullname');
    const elInfoAddr = document.getElementById('cust-info-address');
    const elInfoStatus = document.getElementById('cust-info-status');
    if (elInfoFull) elInfoFull.textContent = profile.name;
    if (elInfoAddr) elInfoAddr.textContent = profile.address || '124 Grand Avenue, Suite 400, Chicago, IL 60611';
    if (elInfoStatus) elInfoStatus.textContent = `Active Multi-Line (${polCountText})`;

    const elEmail = document.getElementById('cust-contact-email');
    const elPhone = document.getElementById('cust-contact-phone');
    if (elEmail) elEmail.textContent = profile.email;
    if (elPhone) elPhone.textContent = profile.phone || '(555) 000-0000';

    // Update Dashboard Welcome Element
    const elWelcome = document.getElementById('cust-dash-welcome');
    if (elWelcome && profile.name) {
      const firstName = profile.name.split(' ')[0];
      elWelcome.textContent = `Welcome back, ${firstName}!`;
    }

    if (MOCK_DB.currentRole === 'customer') {
      const headerName = document.getElementById('user-name');
      const headerAvatar = document.getElementById('user-avatar');
      const headerRoleLabel = document.getElementById('user-role-label');
      if (headerName && profile.name) headerName.textContent = profile.name;
      if (headerRoleLabel) headerRoleLabel.textContent = `Policyholder · ${polCountText}`;
      if (headerAvatar && profile.name) {
        const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        headerAvatar.textContent = initials;
      }
    }
    if (typeof renderCustomerDashboard === 'function') {
      renderCustomerDashboard(window.customerPoliciesData || MOCK_DB.customerPolicies);
    }
    return profile;
  } catch (err) {
    console.error('Failed to fetch from Customer Service (/customer/profile):', err);
    return null;
  }
}

async function fetchCustomerPolicies(filterCategory = 'all') {
  try {
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/policies`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.warn('Customer Service /customer/policies status:', response.status);
      renderCustomerPolicyCards(filterCategory);
      if (typeof renderCustomerDashboard === 'function') renderCustomerDashboard();
      return;
    }
    const policies = await response.json();
    if (Array.isArray(policies)) {
      const formattedPolicies = policies.map((p, idx) => ({
        id: p.id,
        code: p.policy_number || p.code || ('POL-' + (idx + 1).toString().padStart(3, '0')),
        type: p.type,
        category: p.category || 'Property',
        status: p.status || 'Active',
        premium: p.premium,
        premiumNum: parseFloat(String(p.premium || '0').replace(/[^0-9.]/g, '')) || 0,
        effective: p.effective_date || p.effective || '2024-01-15',
        expiry: p.expiry_date || p.expiry || '2025-01-15',
        deductible: p.deductible || '$1,000',
        coverage: ['Primary Coverage Schedule', 'Liability & Property Terms'],
        exclusions: ['Standard exclusions apply']
      }));
      MOCK_DB.customerPolicies = formattedPolicies;
      window.customerPoliciesData = formattedPolicies;

      if (typeof renderCustomerDashboard === 'function') {
        renderCustomerDashboard(formattedPolicies);
      }
    }
    renderCustomerPolicyCards(filterCategory);
    renderComparisonSelectors();
    if (typeof renderFnolPolicySelection === 'function') {
      renderFnolPolicySelection();
    }
  } catch (err) {
    console.error('Failed to fetch from Customer Service (/customer/policies):', err);
    renderCustomerPolicyCards(filterCategory);
    if (typeof renderCustomerDashboard === 'function') renderCustomerDashboard();
    if (typeof renderFnolPolicySelection === 'function') renderFnolPolicySelection();
  }
}

async function fetchCustomerClaims() {
  try {
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/claims`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.warn('Customer Service /customer/claims status:', response.status);
      renderCustomerClaimsList();
      return;
    }
    const backendClaims = await response.json();
    if (Array.isArray(backendClaims)) {
      const mappedClaims = backendClaims.map(c => {
        const existing = (window.customerClaimsData || []).find(ec => ec.id === c.id);
        if (existing) return existing;
        return {
          id: c.id,
          policyId: c.policy_id,
          policyType: c.policy_name,
          policyCode: c.policy_id,
          policyVehicle: c.policy_name,
          claimType: 'Peril Loss',
          dateLoss: c.incident_date,
          timeLoss: '10:00 AM',
          location: 'Primary Insured Location',
          description: c.incident_description,
          amount: c.estimated_amount,
          deductible: '$1,000',
          status: c.status,
          statusBadgeClass: (c.status === 'Closed' || c.status === 'Closed · Settled') ? 'badge-info' : 'badge-active',
          severity: 'Moderate Severity',
          severityScore: 45,
          timelineStep: 2,
          timelineDates: {
            step1: c.incident_date + ' · Incident Filed',
            step2: 'Triage Review Active',
            step3: 'Adjuster Inspection Scheduled',
            step4: 'Pending Appraisal',
            step5: 'Estimated 2 business days',
            step6: 'Pending'
          },
          aiSummary: c.incident_description,
          evidence: ['incident_report.pdf'],
          policeReport: 'None Filed',
          witness: 'None Recorded',
          adjuster: {
            name: 'Marcus Vance',
            title: 'Senior Claims Examiner',
            phone: '(555) 881-3022',
            email: 'm.vance@feuji-insure.com',
            avatar: 'MV'
          },
          nextAction: 'Adjuster review and onsite assessment in progress.'
        };
      });
      const localNewClaims = (window.customerClaimsData || []).filter(lc => !mappedClaims.some(mc => mc.id === lc.id));
      window.customerClaimsData = [...localNewClaims, ...mappedClaims];
    }
    if (typeof window.renderCustomerClaimsList === 'function') {
      window.renderCustomerClaimsList();
    }
  } catch (err) {
    console.error('Failed to fetch from Customer Service (/customer/claims):', err);
    if (typeof window.renderCustomerClaimsList === 'function') {
      window.renderCustomerClaimsList();
    }
  }
}

async function fetchCustomerRenewals() {
  try {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/renewals`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const renewals = await response.json();
      window.customerRenewalsData = Array.isArray(renewals) ? renewals : [];
      return window.customerRenewalsData;
    }
  } catch (err) {
    console.warn('Customer Service /customer/renewals error:', err);
  }
  return [];
}

async function fetchAgentRenewals() {
  try {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${AGENT_SERVICE_URL}/agent/renewals`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const renewals = await response.json();
      window.agentRenewalsData = Array.isArray(renewals) ? renewals : [];
      renderAgentDashboardRenewals();
      return window.agentRenewalsData;
    }
  } catch (err) {
    console.warn('Agent Service /agent/renewals error:', err);
  }
  return [];
}

async function fetchAgentProfile() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const response = await fetch(`${AGENT_SERVICE_URL}/agent/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const profile = await response.json();
      window.agentProfileData = profile;
      if (MOCK_DB && MOCK_DB.agent) {
        MOCK_DB.agent.name = profile.name;
        MOCK_DB.agent.email = profile.email;
        MOCK_DB.agent.id = profile.user_id;
      }
      renderAgentProfile();
      return profile;
    }
  } catch (err) {
    console.warn('Agent Service /agent/me error:', err);
  }
  return null;
}

async function fetchAgentDashboard() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const response = await fetch(`${AGENT_SERVICE_URL}/agent/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const dashboard = await response.json();
      window.agentDashboardData = dashboard;
      renderAgentDashboard();
      return dashboard;
    }
  } catch (err) {
    console.warn('Agent Service /agent/dashboard error:', err);
  }
  return null;
}

async function fetchAgentCustomers() {
  try {
    const token = getAuthToken();
    if (!token) return { customers: [], total: 0 };
    const response = await fetch(`${AGENT_SERVICE_URL}/agent/customers`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.agentCustomersData = data;
      renderAgentDashboardTable();
      renderAgentFullCustomersDirectory();
      return data;
    }
  } catch (err) {
    console.warn('Agent Service /agent/customers error:', err);
  }
  return { customers: [], total: 0 };
}

async function fetchAgentPolicies() {
  try {
    const token = getAuthToken();
    if (!token) return { policies: [], total: 0 };
    const response = await fetch(`${AGENT_SERVICE_URL}/agent/policies`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.agentPoliciesData = data;
      renderAgentPoliciesTable();
      return data;
    }
  } catch (err) {
    console.warn('Agent Service /agent/policies error:', err);
  }
  return { policies: [], total: 0 };
}

async function fetchNotifications() {
  try {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const notifications = await response.json();
      window.workflowNotificationsData = Array.isArray(notifications) ? notifications : [];
      renderNotifications(window.workflowNotificationsData);
      return window.workflowNotificationsData;
    }
  } catch (err) {
    console.warn('Notifications fetch error:', err);
  }
  return [];
}

function renderNotifications(notifications) {
  const listContainer = document.getElementById('header-notification-list');
  const dotEl = document.getElementById('header-notification-dot');
  if (!notifications) notifications = window.workflowNotificationsData || [];

  const unreadCount = notifications.filter(n => !n.is_read).length;
  if (dotEl) {
    dotEl.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  if (!listContainer) return;

  if (notifications.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--gray-500); font-size: 0.85rem;">
        No workflow notifications.
      </div>
    `;
    return;
  }

  const role = ((window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.role) || MOCK_DB.currentRole || '').toLowerCase();
  const isStaff = ['agent', 'broker', 'underwriter', 'admin'].includes(role);

  listContainer.innerHTML = notifications.map(n => {
    const isUnread = !n.is_read;
    const isPending = (n.status || '').toLowerCase().includes('pending');
    const isApproved = (n.status || '').toLowerCase().includes('approved');
    const badgeColor = isApproved ? 'badge-active' : (isPending ? 'badge-pending' : 'badge-info');

    let actionButton = '';
    if (isStaff && isPending && n.renewal_id) {
      actionButton = `
        <button class="btn btn-primary btn-sm" style="font-size:0.75rem;padding:4px 12px;" onclick="event.stopPropagation(); handleAgentApproveRenewal('${n.renewal_id}')">
          Approve Renewal
        </button>
      `;
    }

    return `
      <div class="notification-card ${isUnread ? 'unread' : ''}" onclick="markNotificationRead('${n.notification_id}')">
        <div class="notification-card-top">
          <div class="notification-card-title">${n.title}</div>
          <span class="badge ${badgeColor}" style="font-size:0.7rem;padding:2px 7px;">${n.status || (isApproved ? 'Approved' : 'Pending Approval')}</span>
        </div>
        <div class="notification-card-msg">${n.message}</div>
        <div class="notification-card-meta">
          ${n.customer_name ? `<span><strong>Client:</strong> ${n.customer_name}</span>` : ''}
          ${n.policy_type ? `<span><strong>Type:</strong> ${n.policy_type}</span>` : ''}
          ${n.policy_number ? `<span><strong>Policy:</strong> ${n.policy_number}</span>` : ''}
          ${n.renewal_date ? `<span><strong>Renewal Date:</strong> ${n.renewal_date}</span>` : ''}
          ${n.renewal_premium ? `<span><strong>Premium:</strong> ${n.renewal_premium}</span>` : ''}
        </div>
        ${actionButton ? `<div class="notification-card-actions">${actionButton}</div>` : ''}
      </div>
    `;
  }).join('');
}

async function handleCustomerConfirmRenewal(policyId, policyNumber) {
  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Authentication session missing. Please log in.');
      return;
    }
    const targetId = policyId || policyNumber;
    showToast('Submitting renewal request for agent approval...');

    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/renewals/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ policy_id: targetId })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      showToast(`Renewal submission failed: ${errData.detail || 'Error'}`);
      return;
    }

    const data = await response.json();
    showToast('Renewal request submitted successfully. Waiting for Agent approval.');

    // Refresh policies, renewals list from PostgreSQL & update notifications
    await fetchCustomerPolicies();
    await fetchCustomerRenewals();
    await fetchNotifications();

    // Re-render Customer Dashboard
    if (typeof renderCustomerDashboard === 'function' && window.customerPoliciesData) {
      renderCustomerDashboard(window.customerPoliciesData);
    }

    // If slide panel is open, refresh it with updated status
    const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
    if (slidePanel && slidePanel.classList.contains('open')) {
      const panelTitleEl = document.getElementById('panel-title');
      const panelTitle = panelTitleEl ? panelTitleEl.textContent : '';
      if (panelTitle.includes('Upcoming Renewals') || panelTitle.includes('Approaching')) {
        const upcomingRenewalsCard = document.getElementById('card-upcoming-renewals');
        if (upcomingRenewalsCard) upcomingRenewalsCard.click();
      } else {
        openPolicyDetailsPanel(targetId, custName);
      }
    }
  } catch (err) {
    console.error('Failed to confirm renewal:', err);
    showToast('Network error while submitting renewal request.');
  }
}


async function handleAgentApproveRenewal(renewalId) {
  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Authentication session missing. Please log in.');
      return;
    }
    showToast('Approving customer renewal request...');

    const response = await fetch(`${AGENT_SERVICE_URL}/agent/renewals/${renewalId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      showToast(`Approval failed: ${errData.detail || 'Error'}`);
      return;
    }

    const data = await response.json();
    showToast(`Policy renewal approved! ${data.message || ''}`);

    // Refresh notifications & agent renewals
    await fetchNotifications();
    await fetchAgentRenewals();

    // If Agent slide panel is open, refresh it
    if (slidePanel && slidePanel.classList.contains('open')) {
      openAgentRenewalsSlidePanel();
    }
  } catch (err) {
    console.error('Failed to approve renewal:', err);
    showToast('Network error while approving renewal.');
  }
}

async function handleAgentSendRenewalReminder(policyId, customerName) {
  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Authentication session missing. Please log in.');
      return;
    }
    showToast(`Sending renewal reminder to ${customerName || 'customer'}...`);

    const response = await fetch(`${AGENT_SERVICE_URL}/agent/policies/${policyId}/send-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      showToast(`Failed to send reminder: ${errData.detail || 'Server error'}`);
      return;
    }

    const data = await response.json();
    showToast(`Renewal reminder recorded & sent to ${customerName}!`);

    // Refresh renewals from backend and update slide panel
    await fetchAgentRenewals();
    if (slidePanel && slidePanel.classList.contains('open')) {
      openAgentRenewalsSlidePanel();
    }
  } catch (err) {
    console.error('Send renewal reminder error:', err);
    showToast('Network error while sending renewal reminder.');
  }
}

function toggleNotificationPopover(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const dropdown = document.getElementById('header-notification-dropdown');
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeNotificationPopover();
  } else {
    fetchNotifications();
    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
  }
}

function closeNotificationPopover() {
  const dropdown = document.getElementById('header-notification-dropdown');
  if (dropdown && dropdown.classList.contains('open')) {
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
  }
}

function initNotificationListeners() {
  // Outside click to close notification popover
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('header-notification-dropdown');
    if (!dropdown || !dropdown.classList.contains('open')) return;

    const btn = document.getElementById('header-notification-btn');
    const wrapper = document.getElementById('header-notification-wrapper');

    // If click is inside the dropdown or on the notification toggle button / wrapper, do not close
    if ((dropdown && dropdown.contains(e.target)) || (btn && btn.contains(e.target)) || (wrapper && wrapper.contains(e.target))) {
      return;
    }

    closeNotificationPopover();
  });

  // ESC key to close notification popover
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNotificationPopover();
    }
  });
}

// ==========================================================================
// CLIENT-SIDE PDF GENERATOR & SUMMARY DOWNLOAD ENGINE
// ==========================================================================

function escapePDFText(text) {
  if (text == null) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]+/g, ' ');
}

function wrapPDFText(text, maxChars = 75) {
  if (!text) return [];
  const words = String(text).split(/\s+/);
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function generatePDFDocument({ title, subtitle, meta = {}, sections = [] }) {
  let ops = [];

  // Top Header Banner (Dark Navy Brand Color)
  ops.push('0.14 0.22 0.38 rg');
  ops.push('40 730 532 38 re f');

  // Title in Header
  ops.push('BT /F1 14 Tf 1 1 1 rg 52 744 Td (' + escapePDFText(title || 'INSUREASSIST INSURANCE REPORT') + ') Tj ET');

  // Subtitle
  if (subtitle) {
    ops.push('BT /F2 8.5 Tf 0.35 0.35 0.35 rg 40 714 Td (' + escapePDFText(subtitle) + ') Tj ET');
  }

  // Divider line
  ops.push('0.82 0.84 0.88 RG 1 w');
  ops.push('40 704 m 572 704 l S');

  let currentY = 688;

  // Metadata Grid Box
  if (meta && Object.keys(meta).length > 0) {
    const keys = Object.keys(meta);
    const rowCount = Math.ceil(keys.length / 2);
    const boxHeight = rowCount * 15 + 12;

    ops.push('0.96 0.97 0.98 rg');
    ops.push('40 ' + (currentY - boxHeight + 8) + ' 532 ' + boxHeight + ' re f');
    ops.push('0.85 0.87 0.90 RG 1 w');
    ops.push('40 ' + (currentY - boxHeight + 8) + ' 532 ' + boxHeight + ' re S');

    const col1 = keys.slice(0, rowCount);
    const col2 = keys.slice(rowCount);

    let rowY = currentY - 6;
    col1.forEach(k => {
      ops.push('BT /F1 8 Tf 0.2 0.2 0.25 rg 52 ' + rowY + ' Td (' + escapePDFText(k + ':') + ') Tj ET');
      ops.push('BT /F2 8 Tf 0.1 0.1 0.1 rg 135 ' + rowY + ' Td (' + escapePDFText(meta[k]) + ') Tj ET');
      rowY -= 15;
    });

    rowY = currentY - 6;
    col2.forEach(k => {
      ops.push('BT /F1 8 Tf 0.2 0.2 0.25 rg 305 ' + rowY + ' Td (' + escapePDFText(k + ':') + ') Tj ET');
      ops.push('BT /F2 8 Tf 0.1 0.1 0.1 rg 390 ' + rowY + ' Td (' + escapePDFText(meta[k]) + ') Tj ET');
      rowY -= 15;
    });

    currentY -= (boxHeight + 12);
  }

  // Sections
  (sections || []).forEach(sec => {
    if (currentY < 90) return;

    // Section Header Box / Accent Bar
    ops.push('0.92 0.94 0.97 rg');
    ops.push('40 ' + (currentY - 15) + ' 532 17 re f');
    ops.push('0.14 0.22 0.38 rg');
    ops.push('40 ' + (currentY - 15) + ' 4 17 re f');

    ops.push('BT /F1 9 Tf 0.14 0.22 0.38 rg 50 ' + (currentY - 12) + ' Td (' + escapePDFText(sec.title) + ') Tj ET');
    currentY -= 26;

    if (sec.items && sec.items.length > 0) {
      sec.items.forEach(item => {
        if (currentY < 75) return;
        if (item.label && item.value !== undefined) {
          ops.push('BT /F1 8 Tf 0.25 0.25 0.3 rg 50 ' + currentY + ' Td (' + escapePDFText(item.label + ':') + ') Tj ET');
          const valLines = wrapPDFText(item.value, item.fullWidth ? 78 : 66);
          valLines.forEach((vl, vIdx) => {
            const xPos = item.fullWidth ? 50 : 160;
            const yPos = item.fullWidth ? (currentY - 11 - (vIdx * 10.5)) : (currentY - (vIdx * 10.5));
            ops.push('BT /F2 8 Tf 0.1 0.1 0.1 rg ' + xPos + ' ' + yPos + ' Td (' + escapePDFText(vl) + ') Tj ET');
          });
          currentY -= (item.fullWidth ? (valLines.length * 10.5 + 13) : Math.max(13, valLines.length * 10.5 + 3));
        } else if (item.text) {
          const textLines = wrapPDFText(item.text, 80);
          textLines.forEach((tl, tIdx) => {
            ops.push('BT /F2 8 Tf 0.15 0.15 0.15 rg 50 ' + (currentY - (tIdx * 11)) + ' Td (' + escapePDFText(tl) + ') Tj ET');
          });
          currentY -= (textLines.length * 11 + 5);
        }
      });
    }

    currentY -= 6;
  });

  // Footer
  ops.push('0.82 0.84 0.88 RG 0.75 w');
  ops.push('40 45 m 572 45 l S');
  ops.push('BT /F2 7.5 Tf 0.5 0.5 0.5 rg 40 32 Td (InsureAssist Intelligent Insurance Platform | Official Summary Document | Confidential) Tj ET');
  const nowStr = new Date().toLocaleString();
  ops.push('BT /F2 7.5 Tf 0.5 0.5 0.5 rg 380 32 Td (' + escapePDFText('Generated: ' + nowStr) + ') Tj ET');

  const contentStream = ops.join('\n');
  const streamLen = (typeof Buffer !== 'undefined') ? Buffer.byteLength(contentStream, 'utf-8') : new TextEncoder().encode(contentStream).length;

  let objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('6 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + contentStream + '\nendstream\nendobj\n');

  let header = '%PDF-1.4\n';
  let body = '';
  let xref = 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
  let offset = (typeof Buffer !== 'undefined') ? Buffer.byteLength(header, 'utf-8') : new TextEncoder().encode(header).length;

  objects.forEach(obj => {
    let offStr = ('0000000000' + offset).slice(-10);
    xref += offStr + ' 00000 n \n';
    body += obj;
    offset += (typeof Buffer !== 'undefined') ? Buffer.byteLength(obj, 'utf-8') : new TextEncoder().encode(obj).length;
  });

  let trailer = 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + offset + '\n%%EOF\n';
  return header + body + xref + trailer;
}

function downloadPDFFile(pdfString, filename) {
  try {
    const blob = new Blob([pdfString], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'InsureAssist_Summary.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (err) {
    console.error('Download failed:', err);
    return false;
  }
}

function downloadFNOLClaimSummaryPDF() {
  try {
    const s = window.fnolState || {};
    const claimId = s.submittedClaimId || 'CLM-2026-88914';
    const isFraud = s.classification === 'Potential Fraud';
    const claimStatusText = isFraud ? 'Submitted · Routing to Special Investigation Unit' : 'Submitted · Adjuster Assigned';
    const nextActionText = isFraud ?
      'A senior claims investigator will contact you within 1 business day for additional documentation and verification.' :
      'Your assigned claims examiner will contact you within 2 business hours. Repair estimate authorization is being processed.';

    const customerName = (window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.name) ||
      (MOCK_DB.customerProfile && MOCK_DB.customerProfile.name) || 'Insured Customer';

    const evidenceList = (s.files || []).map(f => (typeof f === 'string' ? f : (f && f.name) || '')).filter(Boolean).join(', ') || 'No attached evidence files';

    const pdfContent = generatePDFDocument({
      title: 'INSUREASSIST - FIRST NOTICE OF LOSS (FNOL) SUMMARY',
      subtitle: 'Official Claim Filing Confirmation & AI Triage Summary',
      meta: {
        'Claim Reference': claimId,
        'Filing Status': claimStatusText,
        'Covered Policy': `${s.policyType || 'Active Policy'} (${s.policyCode || s.policyId || 'N/A'})`,
        'Insured Customer': customerName,
        'Incident Date & Time': `${s.dateLoss || 'N/A'}${s.timeLoss ? ' at ' + s.timeLoss : ''}`,
        'Incident Location': s.location || 'N/A'
      },
      sections: [
        {
          title: '1. Incident & Loss Description',
          items: [
            { label: 'Incident Peril/Type', value: s.claimType || 'Peril / Collision Loss' },
            { label: 'Detailed Description', value: s.description || 'First notice of loss filed by policyholder.', fullWidth: true },
            { label: 'Attached Evidence', value: evidenceList }
          ]
        },
        {
          title: '2. AI Triage & Assessment Summary',
          items: [
            { label: 'AI Classification', value: `${s.classification || 'Standard Assessment'} (Confidence Score: ${s.classificationScore || 90}/100)` },
            { label: 'Overview Assessment', value: (s.claimSummary && s.claimSummary.overview) || 'Incident report received and processed through AI triage engine.' },
            { label: 'Estimated Damages', value: (s.claimSummary && s.claimSummary.damages) || 'Damage scope estimated based on submitted incident details.' },
            { label: 'Coverage Triggered', value: (s.claimSummary && s.claimSummary.coverageTriggered) || 'Applicable Policy Schedule & Peril Endorsements.' }
          ]
        },
        {
          title: '3. Next Steps & Claims Resolution Workflow',
          items: [
            { label: 'Recommended Action', value: (s.claimSummary && s.claimSummary.recommendedNextAction) || nextActionText, fullWidth: true },
            { label: 'Support & Inquiries', value: 'InsureAssist Claims Department | 1-800-555-INSURE | claims@insureassist.com' }
          ]
        }
      ]
    });

    const success = downloadPDFFile(pdfContent, `InsureAssist_Claim_Summary_${claimId}.pdf`);
    if (success) {
      showToast('Claim PDF Summary downloaded successfully.');
    } else {
      showToast('Failed to download Claim PDF Summary.');
    }
  } catch (err) {
    console.error('Error generating FNOL Claim PDF:', err);
    showToast('Error generating Claim PDF Summary.');
  }
}

function downloadCustomerClaimDetailsPDF(claimId) {
  try {
    const allClaims = window.customerClaimsData || MOCK_DB.customerClaims || [];
    const claim = (window.currentViewingClaim && window.currentViewingClaim.id === claimId ? window.currentViewingClaim : null) ||
      allClaims.find(c => c.id === claimId) ||
      window.currentViewingClaim ||
      {
        id: claimId || 'CLM-8802',
        status: 'In Review',
        severity: 'Moderate',
        policyType: 'Insurance Policy',
        policyCode: 'POL-001',
        dateLoss: '2026-03-24',
        timeLoss: '11:15 AM',
        location: 'Primary Insured Location',
        claimType: 'Peril Loss',
        description: 'Claim details on file.',
        amount: '$0',
        deductible: '$1,000',
        adjuster: { name: 'Marcus Vance', title: 'Senior Claims Examiner', phone: '(555) 881-3022', email: 'm.vance@feuji-insure.com' },
        nextAction: 'Adjuster onsite inspection in progress.'
      };

    const customerName = (window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.name) ||
      (MOCK_DB.customerProfile && MOCK_DB.customerProfile.name) || 'Insured Customer';

    const pdfContent = generatePDFDocument({
      title: 'INSUREASSIST - CLAIM DETAILS SUMMARY',
      subtitle: `Official Claim Summary for Claim ${claim.id}`,
      meta: {
        'Claim Reference': claim.id,
        'Claim Status': claim.status || 'In Review',
        'Severity Level': claim.severity || 'Moderate',
        'Covered Policy': `${claim.policyType || 'Policy'} (${claim.policyCode || claim.policyId || 'N/A'})`,
        'Insured Customer': customerName,
        'Loss Date & Time': `${claim.dateLoss || 'N/A'}${claim.timeLoss ? ' at ' + claim.timeLoss : ''}`,
        'Incident Location': claim.location || 'Primary Insured Location'
      },
      sections: [
        {
          title: '1. Incident & Claim Overview',
          items: [
            { label: 'Incident Peril/Type', value: claim.claimType || 'Peril Loss' },
            { label: 'Incident Description', value: claim.description || 'N/A', fullWidth: true }
          ]
        },
        {
          title: '2. Financial & Coverage Trigger Scope',
          items: [
            { label: 'Coverage Triggered', value: (claim.aiSummary && claim.aiSummary.coverageTriggered) || 'Applicable Policy Schedule & Endorsements' },
            { label: 'Applicable Deductible', value: claim.deductible || '$1,000' },
            { label: 'Estimated Repair Scope', value: claim.amount || '$0' }
          ]
        },
        {
          title: '3. Assigned Claims Adjuster & Contacts',
          items: [
            { label: 'Assigned Adjuster', value: `${(claim.adjuster && claim.adjuster.name) || 'Marcus Vance'} - ${(claim.adjuster && claim.adjuster.title) || 'Senior Claims Examiner'}` },
            { label: 'Adjuster Phone & Email', value: `${(claim.adjuster && claim.adjuster.phone) || '(555) 881-3022'} | ${(claim.adjuster && claim.adjuster.email) || 'm.vance@feuji-insure.com'}` }
          ]
        },
        {
          title: '4. Next Recommended Step',
          items: [
            { label: 'Next Action', value: claim.nextAction || 'Adjuster onsite inspection in progress.', fullWidth: true }
          ]
        }
      ]
    });

    const success = downloadPDFFile(pdfContent, `InsureAssist_Claim_Summary_${claim.id}.pdf`);
    if (success) {
      showToast('Claim PDF Summary downloaded successfully.');
    } else {
      showToast('Failed to download Claim PDF Summary.');
    }
  } catch (err) {
    console.error('Error downloading Claim Details PDF:', err);
    showToast('Error generating Claim PDF Summary.');
  }
}

function downloadPolicyDocument(policyId, docName) {
  try {
    const allPolicies = window.customerPoliciesData || MOCK_DB.policies || MOCK_DB.customerPolicies || [];
    const p = allPolicies.find(pol => (pol.id === policyId || pol.code === policyId || pol.policy_id === policyId || pol.policy_number === policyId)) || {
      id: policyId || 'POL-DOC',
      code: policyId || 'POL-DOC',
      type: 'Insurance Policy',
      status: 'Active',
      premium: '$1,200/yr',
      deductible: '$1,000'
    };

    const customerName = (window.CURRENT_AUTH && window.CURRENT_AUTH.user && window.CURRENT_AUTH.user.name) ||
      (MOCK_DB.customerProfile && MOCK_DB.customerProfile.name) || 'Insured Policyholder';

    const pdfContent = generatePDFDocument({
      title: 'INSUREASSIST - POLICY ENDORSEMENT & SCHEDULE',
      subtitle: `Official Digital Document: ${docName || 'Policy Declarations'}`,
      meta: {
        'Policy Number': p.code || p.id || p.policy_number || 'N/A',
        'Policy Type': p.type || p.policy_type || 'Comprehensive Coverage',
        'Policy Status': p.status || 'Active',
        'Named Insured': customerName,
        'Annual Premium': p.premium || p.premium_amount || '$1,200',
        'Effective Date': p.effectiveDate || p.start_date || '2026-01-01',
        'Expiration Date': p.expirationDate || p.end_date || '2027-01-01'
      },
      sections: [
        {
          title: '1. Policy Coverage Limits & Endorsements',
          items: (p.coverage || [
            'Comprehensive & Collision Coverage',
            'Bodily Injury Liability: $250,000 / $500,000',
            'Property Damage Liability: $100,000'
          ]).map(cov => ({ text: `• ${cov}` }))
        },
        {
          title: '2. Key Terms & Associated Declarations',
          items: [
            { label: 'Document Name', value: docName || 'Policy Schedule' },
            { label: 'Deductible', value: p.deductible || '$1,000' },
            { label: 'Underwriting Office', value: 'InsureAssist Underwriting Division | underwriting@insureassist.com' }
          ]
        }
      ]
    });

    const safeDocName = (docName || 'Policy_Document').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const filename = safeDocName.toLowerCase().endsWith('.pdf') ? safeDocName : `${safeDocName}.pdf`;
    const success = downloadPDFFile(pdfContent, filename);
    if (success) {
      showToast(`Downloaded document: ${docName}`);
    } else {
      showToast(`Failed to download ${docName}.`);
    }
  } catch (err) {
    console.error('Error generating policy document PDF:', err);
    showToast(`Error downloading document: ${docName}`);
  }
}

async function markAllNotificationsRead(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const notifs = window.workflowNotificationsData || [];
  for (const n of notifs) {
    if (!n.is_read) {
      await markNotificationRead(n.notification_id, false);
    }
  }
  const dotEl = document.getElementById('header-notification-dot');
  if (dotEl) dotEl.style.display = 'none';
  showToast('All notifications marked as read.');
  fetchNotifications();
}

async function markNotificationRead(notificationId, refresh = true) {
  try {
    const token = getAuthToken();
    if (!token) return;
    await fetch(`${CUSTOMER_SERVICE_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (refresh) fetchNotifications();
  } catch (err) {
    console.warn('Failed to mark notification read:', err);
  }
}

function isPolicyCurrentlyActive(p) {
  if (!p) return false;
  const status = String(p.status || '').toLowerCase().trim();
  return status === 'active';
}


// 3. UPCOMING RENEWALS HELPER (Active policies with valid upcoming expiration dates >= today)
function getUpcomingRenewals(policies) {
  if (!policies) policies = window.customerPoliciesData || MOCK_DB.customerPolicies || [];
  const activePolicies = policies.filter(p => isPolicyCurrentlyActive(p));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renewalsMap = {};
  (window.customerRenewalsData || []).forEach(r => {
    if (r.policy_id) renewalsMap[String(r.policy_id)] = r;
    if (r.policy_number) renewalsMap[String(r.policy_number)] = r;
  });

  return activePolicies.map(p => {
    let diffDays = null;
    let expFormatted = p.expiry || 'TBD';
    const expStr = p.expiry_date || p.expiry;
    if (expStr) {
      const expDate = new Date(expStr);
      if (!isNaN(expDate.getTime())) {
        expDate.setHours(0, 0, 0, 0);
        const diffTime = expDate.getTime() - today.getTime();
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = expDate.getDate().toString().padStart(2, '0');
        expFormatted = `${day} ${months[expDate.getMonth()]} ${expDate.getFullYear()}`;
      }
    }
    const ren = renewalsMap[String(p.id)] || renewalsMap[String(p.code)] || null;
    const renewalStatus = ren ? ren.status : null;
    const renewalId = ren ? ren.renewal_id : null;

    return {
      ...p,
      diffDays,
      expFormatted,
      renewalStatus,
      renewalId
    };
  }).filter(p => {
    // If renewal was approved, policy was extended, so it disappears from approaching renewals
    if (p.renewalStatus === 'Approved') {
      return false;
    }
    return p.diffDays !== null && p.diffDays >= 0;
  }).sort((a, b) => a.diffDays - b.diffDays);
}



function renderCustomerDashboard(policies) {
  if (!policies) policies = window.customerPoliciesData || MOCK_DB.customerPolicies || [];
  const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';

  // 1. ACTIVE POLICIES (Using backend status field: policy.status === 'Active')
  const activePolicies = policies.filter(p => isPolicyCurrentlyActive(p));
  const activeCount = activePolicies.length;

  const elDashPolicies = document.getElementById('cust-dash-active-policies');
  if (elDashPolicies) elDashPolicies.textContent = activeCount;
  const elDashSubtext = document.getElementById('cust-dash-policies-subtext');
  if (elDashSubtext) {
    elDashSubtext.textContent = activeCount > 0
      ? `${activeCount} ${activeCount === 1 ? 'policy' : 'policies'} in good standing`
      : 'No active policies in portfolio';
  }

  // 2. ANNUAL PREMIUM
  const totalPrem = activePolicies.reduce((acc, p) => acc + (p.premiumNum || 0), 0);
  const elPrem = document.getElementById('cust-dash-annual-premium');
  if (elPrem) {
    elPrem.textContent = totalPrem > 0
      ? (Number.isInteger(totalPrem) ? '$' + totalPrem.toLocaleString() : '$' + totalPrem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      : '$0';
  }
  const elPremSub = document.getElementById('cust-dash-premium-subtext');
  if (elPremSub) {
    if (totalPrem > 0) {
      const monthly = totalPrem / 12;
      const monthlyStr = Number.isInteger(monthly) ? Math.round(monthly).toLocaleString() : monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      elPremSub.textContent = `Billed ~$${monthlyStr}/month`;
    } else {
      elPremSub.textContent = 'No active policies in portfolio';
    }
  }
  const elPremBadge = document.getElementById('cust-dash-premium-badge');
  if (elPremBadge) {
    const totalStr = Number.isInteger(totalPrem) ? totalPrem.toLocaleString() : totalPrem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    elPremBadge.textContent = totalPrem > 0 ? `Total $${totalStr}/yr` : 'Total $0/yr';
    elPremBadge.setAttribute('data-tooltip', totalPrem > 0
      ? `Combined premium across ${activeCount} active ${activeCount === 1 ? 'policy' : 'policies'}`
      : 'No active policies contributing to annual premium');
  }

  // 3. UPCOMING RENEWALS (Active policies with valid upcoming expiration details)
  const approachingRenewals = getUpcomingRenewals(policies);

  const elRenewals = document.getElementById('cust-dash-upcoming-renewals');
  if (elRenewals) {
    elRenewals.textContent = approachingRenewals.length;
  }
  const elRenewSubtext = document.getElementById('cust-dash-renewals-subtext');
  if (elRenewSubtext) {
    elRenewSubtext.textContent = approachingRenewals.length > 0
      ? `${approachingRenewals.length} approaching review`
      : 'No upcoming renewals';
  }
  const elRenewTitle = document.getElementById('cust-dash-renewals-title');
  if (elRenewTitle) {
    elRenewTitle.textContent = `Approaching Renewals (${approachingRenewals.length})`;
  }

  // 4. PREMIUM BY POLICY TYPE CHART
  const chartContainer = document.getElementById('customer-dashboard-chart-container');
  if (chartContainer) {
    if (activePolicies.length === 0) {
      chartContainer.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--gray-500);font-size:0.875rem;">No active policies in portfolio.</div>';
    } else {
      const groups = {};
      activePolicies.forEach(p => {
        const cat = p.type || p.category || 'General';
        if (!groups[cat]) groups[cat] = { name: cat, total: 0, count: 0, policies: [] };
        groups[cat].total += p.premiumNum || 0;
        groups[cat].count += 1;
        groups[cat].policies.push(p);
      });

      const groupList = Object.values(groups).sort((a, b) => b.total - a.total);
      const accents = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'];

      function getCategoryIcon(catName) {
        const c = (catName || '').toLowerCase();
        if (c.includes('auto') || c.includes('vehicle') || c.includes('car')) {
          return '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 8"/></svg>';
        }
        if (c.includes('home') || c.includes('property') || c.includes('dwelling') || c.includes('condo')) {
          return '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
        }
        if (c.includes('commercial') || c.includes('business')) {
          return '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
        }
        if (c.includes('umbrella') || c.includes('liability')) {
          return '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
        }
        return '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      }

      chartContainer.innerHTML = groupList.map((g, idx) => {
        const pct = totalPrem > 0 ? Math.round((g.total / totalPrem) * 100) : 0;
        const displayPct = (groupList.length === 1 && totalPrem > 0) ? 100 : pct;
        const accent = accents[idx % accents.length];
        const iconSvg = getCategoryIcon(g.name);
        const policyTarget = g.policies[0] ? (g.policies[0].code || g.policies[0].id) : '';
        const formattedVal = Number.isInteger(g.total) ? g.total.toLocaleString() : g.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `
              <div class="chart-row" data-policy="${policyTarget}" data-tooltip="${g.name}: $${formattedVal}/yr (${displayPct}%)" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${policyTarget}', '${custName}')">
                <div class="chart-row-label">
                  ${iconSvg}
                  ${g.name}
                </div>
                <div class="chart-row-track">
                  <div class="chart-row-fill ${accent}" style="width: ${Math.max(displayPct, 12)}%;">${displayPct}%</div>
                </div>
                <div class="chart-row-val">$${formattedVal}</div>
              </div>
            `;
      }).join('');
    }
  }

  // 5. APPROACHING RENEWALS LIST (Iterating over every matching upcoming renewal policy)
  const renewalsContainer = document.getElementById('customer-dashboard-renewals-container');
  if (renewalsContainer) {
    if (approachingRenewals.length === 0) {
      renewalsContainer.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--gray-500);font-size:0.875rem;">No upcoming policy renewals.</div>';
    } else {
      function getRenewalIcon(catName) {
        const c = (catName || '').toLowerCase();
        if (c.includes('auto') || c.includes('vehicle') || c.includes('car')) {
          return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 8"/></svg>';
        }
        if (c.includes('home') || c.includes('property') || c.includes('dwelling') || c.includes('condo')) {
          return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
        }
        if (c.includes('commercial') || c.includes('business')) {
          return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
        }
        if (c.includes('umbrella') || c.includes('liability')) {
          return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
        }
        return '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      }

      renewalsContainer.innerHTML = approachingRenewals.map(p => {
        const policyCode = p.code || p.id;
        const iconSvg = getRenewalIcon(p.category || p.type);
        const isPending = p.renewalStatus === 'Pending Approval';
        const daysBadge = isPending ? 'Pending Approval' : (p.diffDays !== null ? (p.diffDays === 0 ? 'Today' : (p.diffDays > 0 ? `${p.diffDays} days` : `Review Due`)) : 'Active');
        const tooltipDays = isPending ? 'Renewal requested - Waiting for agent approval' : (p.diffDays !== null && p.diffDays > 0 ? `${p.diffDays} days remaining` : 'Renewal review due');
        const badgeClass = isPending ? 'badge-pending' : ((p.diffDays !== null && p.diffDays <= 90) ? 'badge-pending' : 'badge-info');
        const premStr = p.premium ? (p.premium.includes('$') ? p.premium : `$${p.premium}`) : `$${(p.premiumNum || 0).toLocaleString()}/yr`;
        const metaInfo = isPending
          ? `Renews ${p.expFormatted} · ${premStr} · <strong style="color:#92400E;">Waiting for Agent Approval</strong>`
          : `Renews ${p.expFormatted} · ${premStr}`;

        return `
              <div class="renewal-item" onclick="openPolicyDetailsPanel('${policyCode}', '${custName}')" data-tooltip="${p.type} (${tooltipDays})">
                <div class="renewal-left">
                  <div class="renewal-icon">
                    ${iconSvg}
                  </div>
                  <div>
                    <div class="renewal-name">${p.type} (${policyCode})</div>
                    <div class="renewal-meta">${metaInfo}</div>
                  </div>
                </div>
                <span class="badge ${badgeClass}">${daysBadge}</span>
              </div>
            `;
      }).join('');
    }
  }

  // Show more button toggle

  const showMoreBtn = document.getElementById('cust-renewals-show-more-btn');
  if (showMoreBtn) {
    if (approachingRenewals.length <= 3) {
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = 'flex';
    }
  }
}

function getPolicyStatusBadgeClass(status) {
  const s = String(status || '').toLowerCase().trim();
  if (s === 'active' || s === 'in force' || s === 'in-force') return 'badge-active';
  if (s === 'expired') return 'badge-pending';
  if (s === 'cancelled' || s === 'canceled') return 'badge-info';
  return 'badge-info';
}

function getPolicyCardIcon(category, type) {
  const c = String(category || type || '').toLowerCase();
  if (c.includes('auto') || c.includes('vehicle') || c.includes('car')) {
    return '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 8"/>';
  }
  if (c.includes('home') || c.includes('property') || c.includes('dwelling') || c.includes('condo')) {
    return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';
  }
  if (c.includes('commercial') || c.includes('business')) {
    return '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>';
  }
  if (c.includes('umbrella') || c.includes('liability')) {
    return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
  }
  return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
}

function getStatusSortRank(status) {
  const s = String(status || '').toLowerCase().trim();
  if (s === 'active' || s === 'in force' || s === 'in-force') return 1;
  if (s === 'expired') return 2;
  if (s === 'cancelled' || s === 'canceled') return 3;
  return 4;
}

let currentCustomerPolicyStatusFilter = 'all';
let currentCustomerPolicyTypeFilter = 'all';

function renderCustomerPolicyCards(filterParam) {
  const grid = document.getElementById('customer-policies-grid');
  const policies = window.customerPoliciesData || MOCK_DB.customerPolicies || [];

  // 1. Compute dynamic Status Counts & Policy Type Counts from actual policies
  const statusMap = {};
  const typeMap = {};

  policies.forEach(p => {
    // Status
    const rawStatus = (p.status || 'Active').trim();
    const canonicalStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
    statusMap[canonicalStatus] = (statusMap[canonicalStatus] || 0) + 1;

    // Policy Type (actual policy_type / type)
    const rawType = (p.type || p.category || 'General').trim();
    typeMap[rawType] = (typeMap[rawType] || 0) + 1;
  });

  // Handle filterParam arguments if passed
  if (filterParam !== undefined && filterParam !== null) {
    if (typeof filterParam === 'string') {
      const fp = filterParam.trim();
      if (fp === 'all') {
        currentCustomerPolicyStatusFilter = 'all';
        currentCustomerPolicyTypeFilter = 'all';
      } else if (fp.startsWith('status:')) {
        currentCustomerPolicyStatusFilter = fp.replace('status:', '').trim();
      } else if (fp.startsWith('type:')) {
        currentCustomerPolicyTypeFilter = fp.replace('type:', '').trim();
      } else {
        // Check if matches status or type
        const matchedStatus = Object.keys(statusMap).find(s => s.toLowerCase() === fp.toLowerCase());
        const matchedType = Object.keys(typeMap).find(t => t.toLowerCase() === fp.toLowerCase());
        if (matchedStatus) {
          currentCustomerPolicyStatusFilter = matchedStatus;
        } else if (matchedType) {
          currentCustomerPolicyTypeFilter = matchedType;
        } else {
          currentCustomerPolicyStatusFilter = 'all';
          currentCustomerPolicyTypeFilter = 'all';
        }
      }
    } else if (typeof filterParam === 'object') {
      if (filterParam.status !== undefined) currentCustomerPolicyStatusFilter = filterParam.status;
      if (filterParam.type !== undefined) currentCustomerPolicyTypeFilter = filterParam.type;
    }
  }

  // 2. Dynamic Page Heading & Active Tag
  const elTitle = document.getElementById('cust-policies-title');
  if (elTitle) elTitle.textContent = `My Policies (${policies.length})`;

  const activeCount = policies.filter(p => isPolicyCurrentlyActive(p)).length;
  const elTag = document.getElementById('cust-policies-active-tag');
  if (elTag) elTag.textContent = `${activeCount} Active Policies`;

  // 3. Render Filter Bar: [ All Policies (N) ] [ Status ▾ ] [ Policy Type ▾ ]
  const sortedStatuses = Object.keys(statusMap).sort((a, b) => {
    const rA = getStatusSortRank(a);
    const rB = getStatusSortRank(b);
    return rA - rB || a.localeCompare(b);
  });

  const sortedTypes = Object.keys(typeMap).sort((a, b) => typeMap[b] - typeMap[a] || a.localeCompare(b));

  const isAllActive = (currentCustomerPolicyStatusFilter === 'all' && currentCustomerPolicyTypeFilter === 'all');
  const isStatusFiltered = currentCustomerPolicyStatusFilter !== 'all';
  const isTypeFiltered = currentCustomerPolicyTypeFilter !== 'all';

  const tabsContainer = document.getElementById('cust-policy-filter-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = `
          <button class="filter-tab ${isAllActive ? 'active' : ''}" id="cust-filter-all-btn" data-customer-filter="all">
            All Policies (${policies.length})
          </button>
          <select id="cust-filter-status-select" class="filter-dropdown-select ${isStatusFiltered ? 'active' : ''}" aria-label="Filter by Status">
            <option value="all">All Statuses</option>
            ${sortedStatuses.map(st => {
      const isSelected = currentCustomerPolicyStatusFilter.toLowerCase() === st.toLowerCase();
      return `<option value="${st}" ${isSelected ? 'selected' : ''}>${st} (${statusMap[st]})</option>`;
    }).join('')}
          </select>
          <select id="cust-filter-type-select" class="filter-dropdown-select ${isTypeFiltered ? 'active' : ''}" aria-label="Filter by Policy Type">
            <option value="all">All Types</option>
            ${sortedTypes.map(tp => {
      const isSelected = currentCustomerPolicyTypeFilter.toLowerCase() === tp.toLowerCase();
      return `<option value="${tp}" ${isSelected ? 'selected' : ''}>${tp} (${typeMap[tp]})</option>`;
    }).join('')}
          </select>
        `;

    const allBtn = document.getElementById('cust-filter-all-btn');
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        currentCustomerPolicyStatusFilter = 'all';
        currentCustomerPolicyTypeFilter = 'all';
        renderCustomerPolicyCards();
      });
    }

    const statusSelect = document.getElementById('cust-filter-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        currentCustomerPolicyStatusFilter = e.target.value;
        renderCustomerPolicyCards();
      });
    }

    const typeSelect = document.getElementById('cust-filter-type-select');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        currentCustomerPolicyTypeFilter = e.target.value;
        renderCustomerPolicyCards();
      });
    }
  }

  if (!grid) return;

  // 4. Filter List (Combining status and type filters)
  let filtered = [...policies];
  if (currentCustomerPolicyStatusFilter && currentCustomerPolicyStatusFilter !== 'all') {
    const targetStatus = currentCustomerPolicyStatusFilter.toLowerCase().trim();
    filtered = filtered.filter(p => (p.status || '').toLowerCase().trim() === targetStatus);
  }
  if (currentCustomerPolicyTypeFilter && currentCustomerPolicyTypeFilter !== 'all') {
    const targetType = currentCustomerPolicyTypeFilter.toLowerCase().trim();
    filtered = filtered.filter(p => (p.type || p.category || '').toLowerCase().trim() === targetType);
  }

  // 5. Sort List:
  // Always order: 1. Active, 2. Expired, 3. Cancelled (preserving stable relative order within status)
  filtered.sort((a, b) => {
    const rankA = getStatusSortRank(a.status);
    const rankB = getStatusSortRank(b.status);
    return rankA - rankB;
  });

  // 6. Render Grid
  if (filtered.length === 0) {
    grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; color: var(--gray-500); background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--gray-300);">
            <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin: 0 auto 0.75rem; color: var(--gray-400); display: block;">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 0.25rem;">No Policies Found</div>
            <div style="font-size: 0.875rem;">There are no policies matching the selected filters under your account.</div>
          </div>
        `;
    return;
  }

  const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
  grid.innerHTML = filtered.map(p => {
    const badgeCls = getPolicyStatusBadgeClass(p.status);
    const iconSvgPath = getPolicyCardIcon(p.category, p.type);
    const policyCode = p.code || p.id;
    return `
          <div class="policy-card" onclick="openPolicyDetailsPanel('${p.id || policyCode}', '${custName}')">
            <div>
              <div class="policy-card-top">
                <div class="policy-card-icon-title">
                  <div class="policy-type-icon">
                    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      ${iconSvgPath}
                    </svg>
                  </div>
                  <div>
                    <div class="policy-type-name">${p.type}</div>
                    <div class="policy-number-code">${policyCode}</div>
                  </div>
                </div>
                <span class="badge ${badgeCls}">${p.status}</span>
              </div>

              <div class="policy-specs-grid">
                <div class="spec-item"><label>Premium</label><span>${p.premium}</span></div>
                <div class="spec-item"><label>Expires</label><span>${p.expiry}</span></div>
                <div class="spec-item"><label>Effective</label><span>${p.effective}</span></div>
                <div class="spec-item"><label>Category</label><span>${p.category || p.type} Line</span></div>
              </div>
            </div>

            <div class="policy-card-actions">
              <span style="font-size:0.8rem;color:var(--gray-500);font-weight:500;">Deductible: ${(p.deductible || '$1,000').split('·')[0]}</span>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.id || policyCode}', '${custName}')">
                View Details →
              </button>
            </div>
          </div>
        `;
  }).join('');
}

function renderComparisonSelectors() {
  const selA = document.getElementById('compare-select-a');
  const selB = document.getElementById('compare-select-b');
  const optionsHtml = MOCK_DB.customerPolicies.map(p => `<option value="${p.id}">${p.type} (${p.id})</option>`).join('');
  selA.innerHTML = optionsHtml;
  selB.innerHTML = optionsHtml;
  selA.selectedIndex = 1;
  selB.selectedIndex = 0;
  updateComparisonTable();

  selA.addEventListener('change', updateComparisonTable);
  selB.addEventListener('change', updateComparisonTable);
}

function updateComparisonTable() {
  const idA = document.getElementById('compare-select-a').value;
  const idB = document.getElementById('compare-select-b').value;
  const a = MOCK_DB.customerPolicies.find(p => p.id === idA);
  const b = MOCK_DB.customerPolicies.find(p => p.id === idB);
  if (!a || !b) return;

  document.getElementById('compare-name-a').textContent = `${a.type} (${a.id})`;
  document.getElementById('compare-name-b').textContent = `${b.type} (${b.id})`;

  const rows = [
    ['Annual Premium', a.premium, b.premium],
    ['Policy Status', `<span class="badge badge-active">${a.status}</span>`, `<span class="badge badge-active">${b.status}</span>`],
    ['Primary Limit / Coverage', a.coverage[0] || 'N/A', b.coverage[0] || 'N/A'],
    ['Secondary Coverage', a.coverage[1] || 'N/A', b.coverage[1] || 'N/A'],
    ['Deductible Schedule', a.deductible, b.deductible],
    ['Effective Dates', `${a.effective} to ${a.expiry}`, `${b.effective} to ${b.expiry}`],
    ['Key Exclusion', a.exclusions[0] || 'Standard exclusions apply', b.exclusions[0] || 'Standard exclusions apply']
  ];

  document.getElementById('compare-table-body').innerHTML = rows.map(r => `
        <tr>
          <td><strong>${r[0]}</strong></td>
          <td>${r[1]}</td>
          <td>${r[2]}</td>
        </tr>
      `).join('');

  const cheaper = a.premiumNum <= b.premiumNum ? a : b;
  const premiumDiff = Math.abs(a.premiumNum - b.premiumNum);
  document.getElementById('compare-summary-text').textContent =
    `Comparing ${a.type} and ${b.type}: ${cheaper.type} has a lower annual premium by $${premiumDiff}/year. ` +
    `Both policies provide distinct and complementary coverage lines for complete portfolio protection.`;
}

function runCoverageCheck(query) {
  const q = (query || '').toLowerCase();
  let result = MOCK_DB.scenarios.default;
  if (q.includes('pipe') || q.includes('water') || q.includes('leak') || q.includes('burst')) result = MOCK_DB.scenarios.pipe;
  else if (q.includes('flood') || q.includes('storm surge') || q.includes('rising river')) result = MOCK_DB.scenarios.flood;
  else if (q.includes('theft') || q.includes('stolen') || q.includes('robbery')) result = MOCK_DB.scenarios.theft;
  else if (q.includes('accident') || q.includes('car') || q.includes('collision') || q.includes('auto')) result = MOCK_DB.scenarios.accident;
  else if (q.includes('medical') || q.includes('abroad') || q.includes('travel') || q.includes('international')) result = MOCK_DB.scenarios.medical;

  const resultBox = document.getElementById('coverage-result-box');
  const statusBanner = document.getElementById('coverage-status-banner');

  resultBox.classList.add('visible');
  statusBanner.className = 'coverage-status ' + (result.covered ? 'covered' : 'not-covered');
  document.getElementById('coverage-status-title').textContent = result.covered ? '✓ Covered under Policy' : '✕ Not Covered (Excluded)';
  document.getElementById('coverage-status-desc').textContent = result.desc;
  document.getElementById('coverage-reason-text').textContent = result.reason;
  document.getElementById('coverage-clause-text').textContent = result.clause;
  document.getElementById('coverage-ref-text').textContent = result.ref;
}

function renderGlossaryList(searchTerm = '') {
  const container = document.getElementById('glossary-container');
  const q = searchTerm.toLowerCase().trim();
  const filtered = MOCK_DB.glossary.filter(item =>
    item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--gray-500)">No terms matching "${searchTerm}". Try searching for deductible, premium, or exclusion.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
        <div class="card glossary-term">
          <h4>${item.term}</h4>
          <p class="definition">${item.definition}</p>
          <div class="example"><strong>Example:</strong> ${item.example}</div>
        </div>
      `).join('');
}

function switchRole(role, targetPage = null) {
  const normalizedRole = (role || 'customer').toString().toLowerCase();
  MOCK_DB.currentRole = normalizedRole;
  if (document.body) document.body.setAttribute('data-active-role', normalizedRole);
  const appEl = document.getElementById('app');
  if (appEl) appEl.setAttribute('data-active-role', normalizedRole);

  // Show ONLY the navigation section for the authenticated role
  document.querySelectorAll('.nav-role-section').forEach(sec => {
    if (sec.getAttribute('data-role') === normalizedRole) {
      sec.style.display = 'flex';
    } else {
      sec.style.display = 'none';
    }
  });

  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const roleLabel = document.getElementById('user-role-label');
  const sidebarRole = document.getElementById('sidebar-role-label');
  const portalTag = document.getElementById('header-portal-tag');
  const portalName = document.getElementById('header-portal-name');
  const portalDot = portalTag ? portalTag.querySelector('.portal-dot') : null;

  // Check if user object is stored in localStorage or sessionStorage
  let authUser = null;
  try {
    const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null) ||
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_user') : null);
    if (stored) authUser = JSON.parse(stored);
  } catch (e) { }

  let pageToOpen = targetPage;
  if (!pageToOpen && typeof localStorage !== 'undefined') {
    pageToOpen = localStorage.getItem('active_page');
  }
  if (!pageToOpen || !pageToOpen.startsWith(`${normalizedRole}-`)) {
    pageToOpen = `${normalizedRole}-dashboard`;
  }

  // Dynamic Authenticated User Details
  const currentUserName = (authUser && authUser.name)
    ? authUser.name
    : (authUser && authUser.email ? authUser.email.split('@')[0] : (normalizedRole === 'admin' ? 'Administrator' : normalizedRole === 'underwriter' ? 'Underwriter' : normalizedRole === 'agent' ? 'Agent' : 'Customer'));
  const initials = currentUserName.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'US';

  if (normalizedRole === 'admin') {
    if (avatar) {
      avatar.textContent = initials;
      avatar.className = 'user-avatar admin-avatar';
    }
    if (name) name.textContent = currentUserName;
    if (roleLabel) roleLabel.textContent = 'Administrator · Full Access';
    if (sidebarRole) sidebarRole.textContent = 'Platform Governance';
    if (portalName) portalName.textContent = 'System Administration Active';
    if (portalTag) {
      portalTag.style.background = '#FAF6F2';
      portalTag.style.borderColor = '#EADBCE';
      portalTag.style.color = '#3B241D';
    }
    if (portalDot) portalDot.style.background = '#3B241D';
    fetchNotifications();
    navigateTo(pageToOpen);
  } else if (normalizedRole === 'underwriter') {
    if (avatar) {
      avatar.textContent = initials;
      avatar.className = 'user-avatar underwriter-avatar';
    }
    if (name) name.textContent = currentUserName;
    if (roleLabel) roleLabel.textContent = 'Senior Underwriter';
    if (sidebarRole) sidebarRole.textContent = 'Underwriter Decision Portal';
    if (portalName) portalName.textContent = 'Underwriter Portal Active';
    if (portalTag) {
      portalTag.style.background = '#FAF6F2';
      portalTag.style.borderColor = '#EADBCE';
      portalTag.style.color = '#3B241D';
    }
    if (portalDot) portalDot.style.background = '#8C5343';
    fetchNotifications();
    navigateTo(pageToOpen);
  } else if (normalizedRole === 'agent') {
    if (avatar) {
      avatar.textContent = initials;
      avatar.className = 'user-avatar agent-avatar';
    }
    if (name) name.textContent = currentUserName;
    if (roleLabel) roleLabel.textContent = 'Agent / Broker';
    if (sidebarRole) sidebarRole.textContent = 'Agent Workspace';
    if (portalName) portalName.textContent = 'Agent Workspace Active';
    if (portalTag) {
      portalTag.style.background = '#FAF6F2';
      portalTag.style.borderColor = '#EADBCE';
      portalTag.style.color = '#3B241D';
    }
    if (portalDot) portalDot.style.background = '#7A4A3A';
    fetchAgentProfile();
    fetchAgentDashboard();
    fetchAgentCustomers();
    fetchAgentPolicies();
    fetchAgentRenewals();
    fetchNotifications();
    navigateTo(pageToOpen);
  } else {
    if (avatar) {
      avatar.textContent = initials;
      avatar.className = 'user-avatar customer-avatar';
    }
    if (name) name.textContent = currentUserName;
    if (roleLabel) roleLabel.textContent = 'Policyholder';
    if (sidebarRole) sidebarRole.textContent = 'Customer Portal';
    if (portalName) portalName.textContent = 'Customer Portal Active';
    if (portalTag) {
      portalTag.style.background = '#FAF6F2';
      portalTag.style.borderColor = '#EADBCE';
      portalTag.style.color = '#3B241D';
    }
    if (portalDot) portalDot.style.background = '#C97963';
    fetchCustomerProfile();
    fetchCustomerPolicies('all');
    fetchCustomerClaims();
    fetchCustomerRenewals();
    fetchNotifications();
    navigateTo(pageToOpen);
  }
}

function navigateTo(pageId) {
  closeSlidePanel();
  closeNotificationPopover();

  const currentRole = MOCK_DB.currentRole || 'customer';
  // Restrict navigation strictly to pages belonging to current role
  if (pageId.startsWith('admin-') && currentRole !== 'admin') return;
  if (pageId.startsWith('underwriter-') && currentRole !== 'underwriter') return;
  if (pageId.startsWith('agent-') && currentRole !== 'agent') return;
  if (pageId.startsWith('customer-') && currentRole !== 'customer') return;

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('active_page', pageId);
  }

  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const targetPage = document.getElementById('page-' + pageId);
  if (targetPage) targetPage.classList.add('active');

  const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (targetNav) targetNav.classList.add('active');

  if (pageId === 'underwriter-queue') {
    renderUnderwriterFullQueue();
  } else if (pageId === 'underwriter-dashboard') {
    renderUnderwriterQueueTable();
  } else if (pageId === 'agent-customers') {
    if (typeof fetchAgentCustomers === 'function') {
      fetchAgentCustomers().then(() => renderAgentFullCustomersDirectory());
    } else {
      renderAgentFullCustomersDirectory();
    }
  } else if (pageId === 'agent-dashboard') {
    if (typeof fetchAgentDashboard === 'function') fetchAgentDashboard();
    if (typeof fetchAgentCustomers === 'function') fetchAgentCustomers();
    if (typeof fetchAgentPolicies === 'function') fetchAgentPolicies('all');
    fetchAgentRenewals();
    fetchNotifications();
  } else if (pageId === 'customer-claims') {
    fetchCustomerClaims();
    if (typeof renderCustomerClaimsList === 'function') renderCustomerClaimsList();
    else if (typeof window !== 'undefined' && typeof window.renderCustomerClaimsList === 'function') window.renderCustomerClaimsList();
  } else if (pageId === 'customer-policies') {
    fetchCustomerPolicies('all');
    fetchCustomerRenewals();
  } else if (pageId === 'customer-profile') {
    fetchCustomerProfile();
  } else if (pageId === 'customer-dashboard') {
    fetchCustomerProfile();
    fetchCustomerPolicies('all');
    fetchCustomerClaims();
    fetchCustomerRenewals();
    fetchNotifications();
    if (typeof renderCustomerClaimsList === 'function') renderCustomerClaimsList();
    else if (typeof window !== 'undefined' && typeof window.renderCustomerClaimsList === 'function') window.renderCustomerClaimsList();
  } else if (pageId === 'customer-claim') {
    if (!window.customerPoliciesData || window.customerPoliciesData.length === 0) {
      fetchCustomerPolicies('all').then(() => {
        renderFnolPolicySelection();
        fnolRenderStep(window.fnolState.step || 1);
      });
    } else {
      renderFnolPolicySelection();
      fnolRenderStep(window.fnolState.step || 1);
    }
  } else if (pageId === 'agent-policies') {
    if (typeof fetchAgentPolicies === 'function') {
      fetchAgentPolicies('all').then(() => renderAgentPoliciesTable());
    } else {
      renderAgentPoliciesTable();
    }
    fetchAgentRenewals();
  } else if (pageId === 'admin-users') {
    renderAdminUsersTable();
  } else if (pageId === 'admin-policies') {
    renderAdminPoliciesTable();
  } else if (pageId === 'admin-audit') {
    renderAdminAuditLogs();
  } else if (pageId.endsWith('-ai')) {

    const role = pageId.replace('-ai', '');
    renderRoleChatHistory(role);
    const data = getRoleAiData(role);
    renderRoleChatMessages(role, data.activeConversationId);
  }

  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>${message}</span>
      `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * CLAIMS ENGINE & WORKFLOW
 */

// ==========================================================================
// COMPLETE CLAIMS / FNOL FULL MAIN PAGE ENGINE
// ==========================================================================
window.fnolState = {
  step: 1, // 1: Intake, 2: AI Assessment, 3: Review, 4: Submitted Confirmation
  policyId: null,
  policyType: '',
  policyCode: '',
  policyCategory: '',
  policyDeductible: '',
  policyLimit: '',

  // Step 1: Incident & Supporting Details
  dateLoss: new Date().toISOString().split('T')[0],
  timeLoss: '14:30',
  location: '',
  incidentCategory: 'Vehicle Collision',
  description: '',
  photos: [],
  hasPoliceReport: false,
  policeReportNum: '',
  policeDept: '',
  policeReportFile: '',
  hasWitness: false,
  witnessName: '',
  witnessPhone: '',
  witnessStatement: '',
  additionalDocs: [],

  // Step 2: AI Classification & Summary
  classification: 'Low Severity',
  classificationScore: 18,
  classificationRationale: '',
  claimSummary: {
    overview: '',
    damages: '',
    coverageTriggered: '',
    recommendedNextAction: ''
  },

  // Step 4: Submitted Confirmation
  submittedClaimId: null,
  submissionTimestamp: null
};

function renderFnolPolicySelection() {
  const container = document.getElementById('fnol-policy-list-container');
  if (!container) return;

  const allPolicies = window.customerPoliciesData || [];
  const activePolicies = allPolicies.filter(p => (p.status || '').toLowerCase() === 'active');

  if (activePolicies.length === 0) {
    container.innerHTML = `
      <div style="padding:14px;background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;font-size:0.85rem;color:var(--cust-brown-900);text-align:center;">
        No active policies found for claims filing under this account.
      </div>
    `;
    window.fnolState.policyId = null;
    return;
  }

  // If no policy currently selected, or selected policy is not in active policies, pick first
  const currentSelected = activePolicies.find(p => p.id === window.fnolState.policyId);
  if (!currentSelected) {
    window.fnolState.policyId = activePolicies[0].id;
    window.fnolState.policyType = activePolicies[0].type;
    window.fnolState.policyCode = activePolicies[0].code || activePolicies[0].policy_number || activePolicies[0].id;
    window.fnolState.policyCategory = activePolicies[0].category || 'Property';
    window.fnolState.policyDeductible = activePolicies[0].deductible || '$1,000';
  } else {
    window.fnolState.policyType = currentSelected.type;
    window.fnolState.policyCode = currentSelected.code || currentSelected.policy_number || currentSelected.id;
    window.fnolState.policyCategory = currentSelected.category || 'Property';
    window.fnolState.policyDeductible = currentSelected.deductible || '$1,000';
  }

  let html = '';
  activePolicies.forEach((p) => {
    const isSelected = p.id === window.fnolState.policyId;
    const borderStyle = isSelected ? 'border:1.5px solid var(--cust-brown-700);background:#FDF8F5;' : 'border:1.5px solid var(--cust-cream-border);background:var(--white);';
    const polNumber = p.code || p.policy_number || p.id;
    const polType = p.type || 'Insurance Policy';
    const deductibleText = p.deductible ? ` · Deductible ${p.deductible}` : '';
    const premiumText = p.premium ? ` · Premium ${p.premium}` : '';

    html += `
      <label style="${borderStyle}border-radius:8px;padding:12px 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all 0.2s;">
        <div style="display:flex;align-items:center;gap:10px;">
          <input type="radio" name="fnol-policy-radio" value="${p.id}" ${isSelected ? 'checked' : ''} onchange="fnolSelectPolicy('${p.id}')" style="accent-color:var(--cust-brown-700);">
          <div>
            <div style="font-weight:700;font-size:0.875rem;color:var(--cust-brown-900);">${polNumber} · ${polType}</div>
            <div style="font-size:0.75rem;color:var(--gray-600);margin-top:2px;">${p.category || 'Active Policy'}${deductibleText}${premiumText}</div>
          </div>
        </div>
        <span class="badge badge-active" style="font-size:0.7rem;">Active</span>
      </label>
    `;
  });

  container.innerHTML = html;
}

function openReportClaimAssistant(step = 1) {
  window.fnolState.step = step;
  navigateTo('customer-claim');
  if (!window.customerPoliciesData || window.customerPoliciesData.length === 0) {
    fetchCustomerPolicies('all').then(() => {
      renderFnolPolicySelection();
      window.fnolRenderStep(step);
    });
  } else {
    renderFnolPolicySelection();
    window.fnolRenderStep(step);
  }
}

function fnolSetStep(step) {
  if (step > window.fnolState.step) {
    const isValid = window.fnolValidateStep(window.fnolState.step);
    if (!isValid) return;
  }
  if (step === 2 || step === 3) {
    window.fnolCollectFormInputs();
    window.fnolGenerateAssessment();
  }
  window.fnolState.step = step;
  window.fnolRenderStep(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fnolSelectPolicy(policyId) {
  window.fnolState.policyId = policyId;
  const policies = window.customerPoliciesData || [];
  const p = policies.find(item => item.id === policyId || item.code === policyId);
  if (p) {
    window.fnolState.policyType = p.type;
    window.fnolState.policyCode = p.code || p.policy_number || p.id;
    window.fnolState.policyCategory = p.category || 'Property';
    window.fnolState.policyDeductible = p.deductible || '$1,000';
  }
  renderFnolPolicySelection();
}

function fnolCollectFormInputs() {
  const polRadios = document.getElementsByName('fnol-policy-radio');
  if (polRadios) {
    for (let r of polRadios) {
      if (r.checked) {
        fnolSelectPolicy(r.value);
        break;
      }
    }
  }
  const dateInp = document.getElementById('fnol-date-loss');
  if (dateInp && dateInp.value) window.fnolState.dateLoss = dateInp.value;
  const timeInp = document.getElementById('fnol-time-loss');
  if (timeInp && timeInp.value) window.fnolState.timeLoss = timeInp.value;
  const locInp = document.getElementById('fnol-location');
  if (locInp && locInp.value) window.fnolState.location = locInp.value.trim();
  const catInp = document.getElementById('fnol-category');
  if (catInp && catInp.value) window.fnolState.incidentCategory = catInp.value;
  const descInp = document.getElementById('fnol-description');
  if (descInp && descInp.value) window.fnolState.description = descInp.value.trim();

  const policeCheck = document.getElementById('fnol-police-toggle');
  if (policeCheck) window.fnolState.hasPoliceReport = policeCheck.checked;
  const policeNum = document.getElementById('fnol-police-num');
  if (policeNum) window.fnolState.policeReportNum = policeNum.value.trim();
  const policeDept = document.getElementById('fnol-police-dept');
  if (policeDept) window.fnolState.policeDept = policeDept.value.trim();

  const witnessCheck = document.getElementById('fnol-witness-toggle');
  if (witnessCheck) window.fnolState.hasWitness = witnessCheck.checked;
  const witName = document.getElementById('fnol-witness-name');
  if (witName) window.fnolState.witnessName = witName.value.trim();
  const witPhone = document.getElementById('fnol-witness-phone');
  if (witPhone) window.fnolState.witnessPhone = witPhone.value.trim();
  const witStmt = document.getElementById('fnol-witness-stmt');
  if (witStmt) window.fnolState.witnessStatement = witStmt.value.trim();
}

function fnolValidateStep(step) {
  fnolCollectFormInputs();
  if (step === 1) {
    if (!window.fnolState.policyId) {
      showToast('Please select an active policy.');
      return false;
    }
    if (!window.fnolState.dateLoss) {
      showToast('Please enter the date of loss.');
      const dateEl = document.getElementById('fnol-date-loss');
      if (dateEl) dateEl.focus();
      return false;
    }
    if (!window.fnolState.location) {
      showToast('Please enter the location of the incident.');
      const locEl = document.getElementById('fnol-location');
      if (locEl) locEl.focus();
      return false;
    }
    if (!window.fnolState.description || window.fnolState.description.length < 8) {
      showToast('Please provide a description of what happened (min 8 characters).');
      const descEl = document.getElementById('fnol-description');
      if (descEl) descEl.focus();
      return false;
    }
  }
  return true;
}

function fnolGenerateAssessment() {
  const desc = (window.fnolState.description || '').toLowerCase();
  const cat = (window.fnolState.incidentCategory || '').toLowerCase();
  const polType = window.fnolState.policyType || 'Insurance Policy';
  const polCode = window.fnolState.policyCode || window.fnolState.policyId || '';
  const polDeductible = window.fnolState.policyDeductible || '$1,000';

  if (desc.includes('45 days') || (desc.includes('stolen') && desc.includes('allegedly')) || desc.includes('mismatched') || window.fnolState.classification === 'Potential Fraud') {
    window.fnolState.classification = 'Potential Fraud';
    window.fnolState.classificationScore = 82;
    window.fnolState.classificationRationale = 'Critical anomaly flags: latency in first notice of loss, absence of police documentation for high-value loss, and potential verification discrepancy.';
    window.fnolState.claimSummary = {
      overview: `High-risk loss reported under Policy ${polCode} (${polType}). Documentation audit triggered.`,
      damages: 'Unverified equipment/machinery theft claim. AI optical validation recommends physical audit.',
      coverageTriggered: `Policy ${polCode} subject to proof of loss compliance terms and deductible of ${polDeductible}.`,
      recommendedNextAction: 'Refer file directly to Special Investigation Unit (SIU) for forensic audit and recorded statement prior to claim approval.'
    };
  } else if (desc.includes('multi-vehicle') || desc.includes('airbag') || desc.includes('hospital') || desc.includes('injur') || desc.includes('towed') || desc.includes('heavy') || desc.includes('severe') || window.fnolState.classification === 'High Severity') {
    window.fnolState.classification = 'High Severity';
    window.fnolState.classificationScore = 88;
    window.fnolState.classificationRationale = 'High severity multi-party incident with bodily injury risk, heavy structural damage, or emergency responder dispatch.';
    window.fnolState.claimSummary = {
      overview: `Severe incident reported under Policy ${polCode} (${polType}). High priority emergency claim triage.`,
      damages: 'Extensive property/structural damage with high repair reserve requirement.',
      coverageTriggered: `Policy ${polCode} Comprehensive & Liability Coverage active. Applicable deductible is ${polDeductible}.`,
      recommendedNextAction: 'Assign Priority Senior Field Adjuster within 2 hours; expedite on-site physical appraisal and emergency mitigation.'
    };
  } else if (desc.includes('burst') || desc.includes('water') || desc.includes('leak') || desc.includes('ceiling') || cat.includes('water') || window.fnolState.classification === 'Medium Severity') {
    window.fnolState.classification = 'Medium Severity';
    window.fnolState.classificationScore = 54;
    window.fnolState.classificationRationale = 'Sudden and accidental property/water release incident requiring prompt structural drying and mitigation assessment.';
    window.fnolState.claimSummary = {
      overview: `Property damage incident reported under Policy ${polCode} (${polType}).`,
      damages: 'Interior property moisture saturation and finish repairs. Estimated restoration scope requires contractor review.',
      coverageTriggered: `Policy ${polCode} Property Coverage terms apply. Standard policy deductible is ${polDeductible}.`,
      recommendedNextAction: 'Dispatch certified mitigation vendor within 4 hours; initiate moisture logs and desk adjuster appraisal.'
    };
  } else {
    window.fnolState.classification = 'Low Severity';
    window.fnolState.classificationScore = 18;
    window.fnolState.classificationRationale = 'Isolated low-impact event with cosmetic/localized surface damage. Zero bodily injuries reported, property remains fully functional.';
    window.fnolState.claimSummary = {
      overview: `Cosmetic property damage reported under Policy ${polCode} (${polType}). Standard intake procedure.`,
      damages: 'Light superficial denting and surface damage. Localized repair required.',
      coverageTriggered: `Policy ${polCode} Coverage active. Applicable deductible is ${polDeductible}. Clean in-force policy.`,
      recommendedNextAction: 'Expedite photo-based virtual appraisal without field adjuster delay; direct dispatch to in-network certified repair provider.'
    };
  }
}

function fnolTriggerUpload() {
  const fileInp = document.getElementById('fnol-file-input');
  if (fileInp) fileInp.click();
}

function fnolHandleFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    window.fnolState.photos.push(files[i].name);
  }
  const photoList = document.getElementById('fnol-photos-list');
  if (photoList) {
    photoList.innerHTML = window.fnolState.photos.map((photo, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;background:var(--white);border:1px solid var(--cust-cream-border);padding:8px 12px;border-radius:6px;font-size:0.8rem;">
        <div style="display:flex;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <svg width="14" height="14" fill="none" stroke="#059669" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          <span style="font-weight:500;color:var(--cust-brown-900);">${photo}</span>
        </div>
        <button type="button" onclick="fnolRemovePhoto(${i})" style="border:none;background:transparent;color:#DC2626;cursor:pointer;padding:2px 4px;font-size:0.9rem;" title="Remove file">✕</button>
      </div>
    `).join('');
  }
  showToast(`Added ${files.length} evidence file(s).`);
}

function fnolRemovePhoto(index) {
  if (index >= 0 && index < window.fnolState.photos.length) {
    const removed = window.fnolState.photos.splice(index, 1);
    const photoList = document.getElementById('fnol-photos-list');
    if (photoList) {
      photoList.innerHTML = window.fnolState.photos.map((photo, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--white);border:1px solid var(--cust-cream-border);padding:8px 12px;border-radius:6px;font-size:0.8rem;">
          <div style="display:flex;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            <svg width="14" height="14" fill="none" stroke="#059669" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="font-weight:500;color:var(--cust-brown-900);">${photo}</span>
          </div>
          <button type="button" onclick="fnolRemovePhoto(${i})" style="border:none;background:transparent;color:#DC2626;cursor:pointer;padding:2px 4px;font-size:0.9rem;" title="Remove file">✕</button>
        </div>
      `).join('');
    }
    showToast(`Removed ${removed[0]}`);
  }
}

async function fnolSubmitClaim() {
  fnolCollectFormInputs();

  const policyId = window.fnolState.policyId;
  const dateLoss = window.fnolState.dateLoss || new Date().toISOString().split('T')[0];
  const incidentType = window.fnolState.incidentCategory || 'Property Damage';
  const description = window.fnolState.description || 'Insurance loss claim submitted via FNOL assistant.';
  const location = window.fnolState.location || 'Insured Location';
  const estimatedDamage = window.fnolState.classification === 'High Severity' ? '$31,500' :
                         window.fnolState.classification === 'Medium Severity' ? '$5,200' :
                         window.fnolState.classification === 'Potential Fraud' ? '$22,500' : '$1,100';

  let claimId = 'CLM-2026-' + Math.floor(10000 + Math.random() * 90000);
  let submissionTimestamp = new Date().toLocaleString();

  try {
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customer/claims/fnol`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        policy_id: policyId,
        incident_date: dateLoss,
        incident_type: incidentType,
        description: description,
        location: location,
        estimated_damage: estimatedDamage
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.claim_id) claimId = data.claim_id;
      if (data.submitted_at) submissionTimestamp = data.submitted_at;
      showToast(data.message || `Claim ${claimId} successfully submitted!`);
    } else {
      console.warn('Customer Service FNOL returned status:', response.status);
      showToast(`Claim filed (Customer Service status ${response.status})`);
    }
  } catch (err) {
    console.error('Failed to communicate with Customer Service (/customer/claims/fnol):', err);
    showToast('Claim recorded. Claim ID: ' + claimId);
  }

  window.fnolState.submittedClaimId = claimId;
  window.fnolState.submissionTimestamp = submissionTimestamp;

  if (typeof fetchCustomerClaims === 'function') {
    fetchCustomerClaims();
  }
  if (typeof fetchCustomerProfile === 'function') {
    fetchCustomerProfile();
  }

  window.fnolSetStep(4);
}

function fnolRenderStep(step) {
  const container = document.getElementById('customer-claim-page-container');
  if (!container) return;

  const s = window.fnolState;

  // Stepper Bar HTML
  const stepsList = [
    { num: 1, title: 'Intake & Evidence', desc: 'Policy & Details' },
    { num: 2, title: 'AI Assessment', desc: 'Classification & Summary' },
    { num: 3, title: 'Review Claim', desc: 'Verify Information' },
    { num: 4, title: 'Confirmation', desc: 'Claim ID & Status' }
  ];

  let stepperHtml = `
    <div style="background:var(--white);border:1px solid var(--cust-cream-border);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
      <div style="display:flex;justify-content:space-between;align-items:center;position:relative;gap:12px;flex-wrap:wrap;">
  `;

  stepsList.forEach((item, idx) => {
    const isCurrent = item.num === step;
    const isCompleted = item.num < step;
    const circleBg = isCurrent ? 'var(--cust-brown-700)' : isCompleted ? '#059669' : 'var(--gray-200)';
    const circleColor = isCurrent || isCompleted ? '#ffffff' : 'var(--gray-600)';
    const titleColor = isCurrent ? 'var(--cust-brown-900)' : isCompleted ? '#059669' : 'var(--gray-500)';
    const icon = isCompleted ? '✓' : item.num;

    stepperHtml += `
      <div style="display:flex;align-items:center;gap:10px;cursor:${item.num < step ? 'pointer' : 'default'};" ${item.num < step ? `onclick="fnolSetStep(${item.num})"` : ''}>
        <div style="width:32px;height:32px;border-radius:50%;background:${circleBg};color:${circleColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem;flex-shrink:0;">
          ${icon}
        </div>
        <div>
          <div style="font-size:0.875rem;font-weight:700;color:${titleColor};">${item.title}</div>
          <div style="font-size:0.75rem;color:var(--gray-500);">${item.desc}</div>
        </div>
      </div>
    `;
    if (idx < stepsList.length - 1) {
      stepperHtml += `<div style="flex:1;min-width:20px;height:2px;background:${isCompleted ? '#059669' : 'var(--gray-200)'};"></div>`;
    }
  });
  stepperHtml += `</div></div>`;

  let contentHtml = '';

  // STEP 1: INTAKE & EVIDENCE
  if (step === 1) {
    contentHtml = `
      ${stepperHtml}

      <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:1.5rem;align-items:start;" class="fnol-grid-responsive">
        <!-- Left Column: Policy & Incident Details -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          <!-- Policy Selection Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">1</span>
              Select Covered Policy
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 14px;">Choose which of your active policies this claim relates to:</p>
            
            <div id="fnol-policy-list-container" style="display:flex;flex-direction:column;gap:10px;">
              <div style="padding:14px;background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;font-size:0.85rem;color:var(--cust-brown-900);text-align:center;">
                Loading your active policies...
              </div>
            </div>
          </div>

          <!-- Incident Details Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">2</span>
              Incident Details
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 14px;">Provide the time, location, and a clear description of the incident:</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.825rem;font-weight:600;margin-bottom:6px;display:block;">Date of Loss <span style="color:#DC2626;">*</span></label>
                <input type="date" id="fnol-date-loss" class="form-control" value="${s.dateLoss}" style="font-size:0.875rem;padding:8px 12px;width:100%;box-sizing:border-box;border-radius:6px;" required>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.825rem;font-weight:600;margin-bottom:6px;display:block;">Time of Loss <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span></label>
                <input type="time" id="fnol-time-loss" class="form-control" value="${s.timeLoss}" style="font-size:0.875rem;padding:8px 12px;width:100%;box-sizing:border-box;border-radius:6px;">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" style="font-size:0.825rem;font-weight:600;margin-bottom:6px;display:block;">Location of Incident <span style="color:#DC2626;">*</span></label>
              <input type="text" id="fnol-location" class="form-control" value="${s.location}" placeholder="e.g. 5th Ave & Main St or Home/Business Address" style="font-size:0.875rem;padding:9px 12px;width:100%;box-sizing:border-box;border-radius:6px;" required>
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" style="font-size:0.825rem;font-weight:600;margin-bottom:6px;display:block;">What Happened? (Incident Category)</label>
              <select id="fnol-category" class="form-control" style="font-size:0.875rem;padding:9px 12px;width:100%;box-sizing:border-box;border-radius:6px;">
                <option value="Vehicle Collision" ${s.incidentCategory === 'Vehicle Collision' ? 'selected' : ''}>Vehicle Collision / Impact</option>
                <option value="Water / Pipe Leak" ${s.incidentCategory === 'Water / Pipe Leak' ? 'selected' : ''}>Water Leak / Plumbing Discharge</option>
                <option value="Weather / Storm Damage" ${s.incidentCategory === 'Weather / Storm Damage' ? 'selected' : ''}>Weather / Storm / Hail Damage</option>
                <option value="Theft / Vandalism" ${s.incidentCategory === 'Theft / Vandalism' ? 'selected' : ''}>Theft / Burglary / Vandalism</option>
                <option value="Property Liability" ${s.incidentCategory === 'Property Liability' ? 'selected' : ''}>Property / Third-Party Liability</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.825rem;font-weight:600;margin-bottom:6px;display:block;">Description of Incident <span style="color:#DC2626;">*</span></label>
              <textarea id="fnol-description" class="form-control" placeholder="Describe what happened, any damages noticed, and the sequence of events in detail..." style="font-size:0.875rem;line-height:1.55;padding:12px 14px;width:100%;min-height:145px;box-sizing:border-box;border-radius:8px;resize:vertical;display:block;" required>${s.description}</textarea>
            </div>
          </div>
        </div>

        <!-- Right Column: Supporting Information & Uploads -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          <!-- Photo & Document Upload Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">3</span>
              Photos & Supporting Evidence <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span>
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 14px;">Upload photos of damage, repair estimates, or relevant documents to expedite review:</p>

            <input type="file" id="fnol-file-input" multiple accept="image/*,.pdf" style="display:none;" onchange="fnolHandleFileUpload(event)">
            
            <div onclick="fnolTriggerUpload()" style="border:2px dashed var(--cust-cream-border);background:#FAF6F2;border-radius:8px;padding:22px 16px;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:14px;">
              <svg width="28" height="28" fill="none" stroke="var(--cust-brown-700)" stroke-width="1.8" viewBox="0 0 24 24" style="margin:0 auto 8px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <div style="font-size:0.875rem;font-weight:600;color:var(--cust-brown-900);">Click to browse or drop damage photos here</div>
              <div style="font-size:0.75rem;color:var(--gray-500);margin-top:2px;">JPEG, PNG, HEIC, PDF (Up to 15MB each)</div>
            </div>

            <!-- Uploaded File Badges List -->
            <div id="fnol-photos-list" style="display:flex;flex-direction:column;gap:8px;">
              ${s.photos.map((photo, i) => `
                <div style="display:flex;align-items:center;justify-content:space-between;background:var(--white);border:1px solid var(--cust-cream-border);padding:8px 12px;border-radius:6px;font-size:0.8rem;">
                  <div style="display:flex;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    <svg width="14" height="14" fill="none" stroke="#059669" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style="font-weight:500;color:var(--cust-brown-900);">${photo}</span>
                  </div>
                  <button type="button" onclick="fnolRemovePhoto(${i})" style="border:none;background:transparent;color:#DC2626;cursor:pointer;padding:2px 4px;font-size:0.9rem;" title="Remove file">✕</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Police Report & Witness Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 12px;">
              Police Report & Witnesses <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span>
            </h4>

            <!-- Police Report Accordion / Toggle -->
            <div style="border-bottom:1px solid var(--cust-cream-border);padding-bottom:14px;margin-bottom:14px;">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:0.85rem;color:var(--cust-brown-900);">
                <input type="checkbox" id="fnol-police-toggle" ${s.hasPoliceReport ? 'checked' : ''} onchange="document.getElementById('fnol-police-fields').style.display = this.checked ? 'block' : 'none';" style="accent-color:var(--cust-brown-700);">
                <span>Police or Official Accident Report Filed</span>
              </label>
              <div id="fnol-police-fields" style="display:${s.hasPoliceReport ? 'block' : 'none'};margin-top:12px;padding-left:24px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                  <input type="text" id="fnol-police-num" class="form-control" placeholder="Report / Case Number (Optional)" value="${s.policeReportNum || ''}" style="font-size:0.825rem;padding:8px 10px;border-radius:6px;">
                  <input type="text" id="fnol-police-dept" class="form-control" placeholder="Police Dept / Agency (Optional)" value="${s.policeDept || ''}" style="font-size:0.825rem;padding:8px 10px;border-radius:6px;">
                </div>
              </div>
            </div>

            <!-- Witness Accordion / Toggle -->
            <div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:0.85rem;color:var(--cust-brown-900);">
                <input type="checkbox" id="fnol-witness-toggle" ${s.hasWitness ? 'checked' : ''} onchange="document.getElementById('fnol-witness-fields').style.display = this.checked ? 'block' : 'none';" style="accent-color:var(--cust-brown-700);">
                <span>Witness Information Available</span>
              </label>
              <div id="fnol-witness-fields" style="display:${s.hasWitness ? 'block' : 'none'};margin-top:12px;padding-left:24px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                  <input type="text" id="fnol-witness-name" class="form-control" placeholder="Witness Full Name (Optional)" value="${s.witnessName || ''}" style="font-size:0.825rem;padding:8px 10px;border-radius:6px;">
                  <input type="text" id="fnol-witness-phone" class="form-control" placeholder="Phone or Email (Optional)" value="${s.witnessPhone || ''}" style="font-size:0.825rem;padding:8px 10px;border-radius:6px;">
                </div>
                <textarea id="fnol-witness-stmt" class="form-control" rows="2" placeholder="Brief witness statement or contact notes (Optional)..." style="font-size:0.825rem;padding:8px 10px;border-radius:6px;width:100%;box-sizing:border-box;">${s.witnessStatement || ''}</textarea>
              </div>
            </div>
          </div>

          <!-- Bottom Action Navigation -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
            <button type="button" class="btn btn-outline" onclick="navigateTo('customer-dashboard')">
              Cancel / Return
            </button>
            <button type="button" class="btn btn-primary" onclick="fnolSetStep(2)" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;">
              <span>Continue to AI Assessment</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = contentHtml;
    renderFnolPolicySelection();
  }

  // STEP 2: AI CLAIM ASSESSMENT & 4-PART SUMMARY
  else if (step === 2) {
    const isLow = s.classification === 'Low Severity';
    const isMed = s.classification === 'Medium Severity';
    const isHigh = s.classification === 'High Severity';
    const isFraud = s.classification === 'Potential Fraud';

    const bannerBg = isLow ? '#ECFDF5' : isMed ? '#FFFBEB' : isHigh ? '#FEF2F2' : '#F5F3FF';
    const bannerBorder = isLow ? '#A7F3D0' : isMed ? '#FDE68A' : isHigh ? '#FECACA' : '#DDD6FE';
    const bannerText = isLow ? '#065F46' : isMed ? '#92400E' : isHigh ? '#991B1B' : '#5B21B6';
    const badgeBg = isLow ? '#059669' : isMed ? '#D97706' : isHigh ? '#DC2626' : '#7C3AED';

    const userObj = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('auth_user')) || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth_user')) || '{}');
    const custName = userObj.name || 'Insured Policyholder';

    contentHtml = `
      ${stepperHtml}

      <!-- AI Classification Banner -->
      <div style="background:${bannerBg};border:1.5px solid ${bannerBorder};border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:50%;background:${badgeBg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
              ${isFraud ? '🚩' : isHigh ? '⚠️' : isMed ? '⚡' : '🛡️'}
            </div>
            <div>
              <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;color:${bannerText};">AI Intake Classification</div>
              <h3 style="font-size:1.35rem;font-weight:700;color:${bannerText};margin:0;">${s.classification}</h3>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem;color:${bannerText};font-weight:600;">Intake Severity Score</div>
            <div style="font-size:1.4rem;font-weight:800;color:${bannerText};">${s.classificationScore} / 100</div>
          </div>
        </div>
        <p style="font-size:0.875rem;color:${bannerText};margin:0;line-height:1.5;">${s.classificationRationale}</p>
      </div>

      <!-- Complete 4-Section AI Claim Summary Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;" class="fnol-grid-responsive">
        <!-- Section 1: Claim Overview -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">📋</span> 1. Claim Overview
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.overview}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Policyholder: <strong>${custName}</strong> · Active Policy: <strong>${s.policyCode || s.policyId}</strong></div>
        </div>

        <!-- Section 2: Damages -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">💥</span> 2. Damages Assessed
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.damages}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Supporting Evidence: <strong>${s.photos.length} item(s) attached</strong></div>
        </div>

        <!-- Section 3: Coverage Potentially Triggered -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">🛡️</span> 3. Coverage Potentially Triggered
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.coverageTriggered}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Applicable Deductible: <strong>${s.policyDeductible || '$1,000'}</strong></div>
        </div>

        <!-- Section 4: Recommended Next Action -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">🧭</span> 4. Recommended Next Action
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.recommendedNextAction}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Service SLA: <strong>Adjuster response within 2 business hours</strong></div>
        </div>
      </div>

      <!-- AI Advisory Disclaimer -->
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;margin-bottom:1.5rem;display:flex;align-items:flex-start;gap:10px;font-size:0.8rem;color:#64748B;line-height:1.4;">
        <span style="font-size:1rem;">ℹ️</span>
        <div><strong>AI-Assisted Assessment Notice:</strong> This preliminary analysis is generated automatically to expedite intake routing and estimate preliminary reserve guidelines. This does not constitute a final binding claim decision or confirmation of coverage liability.</div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button type="button" class="btn btn-outline" onclick="fnolSetStep(1)">
          ← Edit Intake Details
        </button>
        <button type="button" class="btn btn-primary" onclick="fnolSetStep(3)" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;">
          <span>Continue to Review</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    `;
    container.innerHTML = contentHtml;
  }

  // STEP 3: REVIEW CLAIM BEFORE SUBMISSION
  else if (step === 3) {
    contentHtml = `
      ${stepperHtml}

      <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;border-bottom:1px solid var(--cust-cream-border);padding-bottom:10px;">
          <div>
            <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;color:var(--cust-brown-900);margin:0 0 4px;">Review Claim Information</h3>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0;">Please verify all details before official submission into the claims processing system.</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="fnolSetStep(1)">Edit All Fields ✎</button>
        </div>

        <!-- Review Rows -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;" class="fnol-grid-responsive">
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);padding:14px;border-radius:8px;">
            <div style="font-weight:700;font-size:0.875rem;color:var(--cust-brown-900);margin-bottom:8px;display:flex;justify-content:space-between;">
              <span>Policy & Coverage</span>
              <a href="javascript:void(0)" onclick="fnolSetStep(1)" style="font-size:0.75rem;color:var(--cust-brown-700);text-decoration:none;">Edit</a>
            </div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Policy</span><span class="detail-value"><strong>${s.policyType}</strong></span></div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Policy Number</span><span class="detail-value">${s.policyCode || s.policyId}</span></div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Deductible</span><span class="detail-value">${s.policyDeductible || '$1,000'}</span></div>
          </div>

          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);padding:14px;border-radius:8px;">
            <div style="font-weight:700;font-size:0.875rem;color:var(--cust-brown-900);margin-bottom:8px;display:flex;justify-content:space-between;">
              <span>Incident Summary</span>
              <a href="javascript:void(0)" onclick="fnolSetStep(1)" style="font-size:0.75rem;color:var(--cust-brown-700);text-decoration:none;">Edit</a>
            </div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Date & Time</span><span class="detail-value">${s.dateLoss} at ${s.timeLoss || 'N/A'}</span></div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Location</span><span class="detail-value">${s.location}</span></div>
            <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Category</span><span class="detail-value">${s.incidentCategory}</span></div>
          </div>
        </div>

        <!-- Description Block -->
        <div style="margin-bottom:1.25rem;">
          <div style="font-size:0.825rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:4px;">Incident Description:</div>
          <div style="font-size:0.85rem;color:var(--gray-700);background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);line-height:1.5;">
            ${s.description}
          </div>
        </div>

        <!-- Evidence & Witnesses Summary -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;" class="fnol-grid-responsive">
          <div>
            <div style="font-size:0.825rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:4px;">Attached Photos & Files (${s.photos.length}):</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${s.photos.length > 0 ? s.photos.map(p => `<span class="badge" style="background:#E2E8F0;color:#334155;font-size:0.75rem;">📎 ${p}</span>`).join('') : '<span style="font-size:0.8rem;color:var(--gray-500);">No files attached</span>'}
            </div>
          </div>

          <div>
            <div style="font-size:0.825rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:4px;">Official Reports & Witnesses:</div>
            <div style="font-size:0.8rem;color:var(--gray-700);">
              <div>Police Report: <strong>${s.hasPoliceReport ? (s.policeReportNum || 'Yes - Filed') : 'None'}</strong></div>
              <div>Witness: <strong>${s.hasWitness ? (s.witnessName || 'Yes') : 'None'}</strong></div>
            </div>
          </div>
        </div>

        <!-- AI Classification Box -->
        <div style="background:#FAF5FF;border:1px solid #E9D5FF;padding:12px 16px;border-radius:8px;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:#6B21A8;">Initial AI Triage Classification:</span>
            <div style="font-size:1.1rem;font-weight:800;color:#581C87;">${s.classification} (Score: ${s.classificationScore}/100)</div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="fnolSetStep(2)" style="font-size:0.75rem;">View AI Assessment</button>
        </div>

        <div style="font-size:0.8rem;color:var(--gray-600);border-top:1px solid var(--cust-cream-border);padding-top:10px;">
          ⚖️ By clicking "Submit Claim", you affirm that the provided information is true, accurate, and complete to the best of your knowledge.
        </div>
      </div>

      <!-- Submission Actions -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button type="button" class="btn btn-outline" onclick="fnolSetStep(2)">
          ← Back to AI Assessment
        </button>
        <button type="button" class="btn btn-primary" onclick="fnolSubmitClaim()" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-size:0.95rem;box-shadow:0 4px 12px rgba(122, 74, 58, 0.25);">
          <span>Submit Claim ✓</span>
        </button>
      </div>
    `;
    container.innerHTML = contentHtml;
  }

  // STEP 4: CONFIRMATION & CLAIM ID STATUS
  else if (step === 4) {
    const isFraud = s.classification === 'Potential Fraud';
    const claimStatusText = isFraud ? 'Submitted · Routing to Special Investigation Unit' : 'Submitted · Adjuster Assigned';
    const nextActionText = isFraud ? 
      'A senior claims investigator will contact you within 1 business day for additional documentation and verification.' :
      'Your assigned claims examiner will contact you within 2 business hours. Repair estimate authorization is being processed.';

    contentHtml = `
      ${stepperHtml}

      <div style="max-width:800px;margin:0 auto;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#ECFDF5;color:#059669;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 6px 16px rgba(5, 150, 105, 0.2);">
          <svg width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;color:var(--cust-brown-900);margin-bottom:6px;">
          Claim Successfully Submitted!
        </h2>
        <p style="font-size:0.925rem;color:var(--gray-600);margin-bottom:1.5rem;">
          Your First Notice of Loss has been officially registered in the claims ledger.
        </p>

        <!-- Confirmation Details Card -->
        <div class="card" style="text-align:left;border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--cust-cream-border);padding-bottom:12px;margin-bottom:12px;">
            <div>
              <span style="font-size:0.8rem;text-transform:uppercase;color:var(--gray-500);font-weight:700;">Generated Claim ID</span>
              <div style="font-size:1.6rem;font-weight:800;color:var(--cust-brown-900);letter-spacing:0.02em;">${s.submittedClaimId || 'CLM-2026-88914'}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-active" style="padding:6px 14px;font-size:0.85rem;">${claimStatusText}</span>
            </div>
          </div>

          <div class="detail-row" style="padding:8px 0;"><span class="detail-label" style="font-size:0.875rem;">Covered Policy</span><span class="detail-value" style="font-size:0.875rem;"><strong>${s.policyType}</strong> (${s.policyCode || s.policyId})</span></div>
          <div class="detail-row" style="padding:8px 0;"><span class="detail-label" style="font-size:0.875rem;">Incident Date & Location</span><span class="detail-value" style="font-size:0.875rem;">${s.dateLoss} · ${s.location}</span></div>
          <div class="detail-row" style="padding:8px 0;"><span class="detail-label" style="font-size:0.875rem;">AI Triage Classification</span><span class="detail-value" style="font-size:0.875rem;"><strong>${s.classification}</strong> (Score: ${s.classificationScore}/100)</span></div>
          <div class="detail-row" style="padding:8px 0;border-bottom:none;"><span class="detail-label" style="font-size:0.875rem;">Recommended Next Action</span><span class="detail-value" style="font-size:0.875rem;color:var(--cust-brown-700);font-weight:600;">${nextActionText}</span></div>
        </div>

        <!-- Confirmation Buttons -->
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="downloadFNOLClaimSummaryPDF()" style="display:inline-flex;align-items:center;gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Summary (PDF)</span>
          </button>
          <button class="btn btn-primary" onclick="navigateTo('customer-dashboard')">
            Return to Customer Dashboard
          </button>
          <button class="btn btn-outline" onclick="window.fnolSetStep(1);">
            File Another Claim
          </button>
        </div>
      </div>
    `;
    container.innerHTML = contentHtml;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Admin Summary Card Direct Click Listeners (Always active)
  const adminUsersCard = document.getElementById('card-admin-users');
  const adminCustomersCard = document.getElementById('card-admin-customers');
  const adminAgentsCard = document.getElementById('card-admin-agents');
  const adminUnderwritersCard = document.getElementById('card-admin-underwriters');
  const adminPoliciesCard = document.getElementById('card-admin-policies');
  const adminActiveCard = document.getElementById('card-admin-active');

  if (adminUsersCard) adminUsersCard.addEventListener('click', window.openAdminUsersSlidePanel);
  if (adminCustomersCard) adminCustomersCard.addEventListener('click', window.openAdminCustomersSlidePanel);
  if (adminAgentsCard) adminAgentsCard.addEventListener('click', window.openAdminAgentsSlidePanel);
  if (adminUnderwritersCard) adminUnderwritersCard.addEventListener('click', window.openAdminUnderwritersSlidePanel);
  if (adminPoliciesCard) adminPoliciesCard.addEventListener('click', window.openAdminPoliciesSlidePanel);
  if (adminActiveCard) adminActiveCard.addEventListener('click', window.openAdminActivePoliciesSlidePanel);

  // Backend Auth Service Configuration
  const AUTH_SERVICE_URL = 'http://127.0.0.1:8001/auth/login';

  // Login Form Submission - Connected to FastAPI Auth Service
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('login-submit-btn');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      showToast('Please enter both email and password.');
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : 'Sign In';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
    }

    try {
      // Send login credentials to FastAPI Auth Service
      const response = await fetch(AUTH_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorDetail = data && data.detail ? data.detail : 'Invalid email or password. Please try again.';
        showToast(errorDetail);
        return;
      }

      // Store JWT token and user info in localStorage and sessionStorage
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        sessionStorage.setItem('auth_token', data.access_token);
      }
      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        sessionStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      // Identify authenticated role from backend (Customer, Agent, Underwriter, Admin)
      const returnedRole = (data.role || (data.user && data.user.role) || 'customer').toString().toLowerCase();

      // Hide login screen and display app shell
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app').classList.add('active');

      // Populate tables and dynamic data for all roles
      renderCustomerPolicyCards('all');
      renderCustomerRecommendations();
      ['customer', 'agent', 'underwriter', 'admin'].forEach(r => {
        renderRoleChatHistory(r);
        renderRoleChatMessages(r, getRoleAiData(r).activeConversationId);
      });
      renderComparisonSelectors();
      renderGlossaryList();
      renderAgentDashboardTable();
      renderAgentFullCustomersDirectory();
      renderAgentPoliciesTable('all', '');
      renderAgentDashboardRenewals();
      renderUnderwriterQueueTable('all', 'all', 'all', '');
      renderUnderwriterFullQueue();
      renderAdminDashboardUsersTable();
      renderAdminUsersTable('all', 'all', '');
      renderAdminPoliciesTable('all', 'all', '');
      renderAdminAuditLogs();

      // Route to the dashboard matching the backend-authenticated role
      switchRole(returnedRole);

      const roleDesc = returnedRole === 'admin'
        ? 'Administrator Platform Governance'
        : returnedRole === 'underwriter'
          ? 'Underwriter Decision Portal'
          : returnedRole === 'agent'
            ? 'Agent Workspace'
            : 'Customer Portal';

      const userName = data.user && data.user.name ? data.user.name : '';
      showToast(`Welcome back${userName ? ', ' + userName : ''}! Signed in to InsureAssist ${roleDesc}.`);
    } catch (err) {
      console.error('Failed to communicate with Auth Service:', err);
      showToast('Unable to connect to Auth Service at http://127.0.0.1:8001. Please ensure the backend is running.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  // Admin AI Assistant Trigger
  const adminAiBtn = document.getElementById('sidebar-admin-ai-btn');
  if (adminAiBtn) adminAiBtn.addEventListener('click', openAIChatSlidePanel);

  // Admin User Management Search & Filter Listeners (Req 6)
  const adminUserSearch = document.getElementById('admin-user-search-input');
  const adminUserRoleFilter = document.getElementById('admin-user-role-filter');
  const adminUserStatusFilter = document.getElementById('admin-user-status-filter');
  const adminUserResetBtn = document.getElementById('admin-user-reset-btn');

  const triggerAdminUserFilter = () => {
    const search = adminUserSearch ? adminUserSearch.value : '';
    const role = adminUserRoleFilter ? adminUserRoleFilter.value : 'all';
    const status = adminUserStatusFilter ? adminUserStatusFilter.value : 'all';
    renderAdminUsersTable(role, status, search);
  };

  if (adminUserSearch) adminUserSearch.addEventListener('input', triggerAdminUserFilter);
  if (adminUserRoleFilter) adminUserRoleFilter.addEventListener('change', triggerAdminUserFilter);
  if (adminUserStatusFilter) adminUserStatusFilter.addEventListener('change', triggerAdminUserFilter);
  if (adminUserResetBtn) {
    adminUserResetBtn.addEventListener('click', () => {
      if (adminUserSearch) adminUserSearch.value = '';
      if (adminUserRoleFilter) adminUserRoleFilter.value = 'all';
      if (adminUserStatusFilter) adminUserStatusFilter.value = 'all';
      renderAdminUsersTable('all', 'all', '');
      showToast('User filters reset.');
    });
  }

  // Admin Policy Management Search & Filter Listeners (Req 10)
  const adminPolicySearch = document.getElementById('admin-policy-search-input');
  const adminPolicyTypeFilter = document.getElementById('admin-policy-type-filter');
  const adminPolicyStatusFilter = document.getElementById('admin-policy-status-filter');
  const adminPolicyResetBtn = document.getElementById('admin-policy-reset-btn');

  const triggerAdminPolicyFilter = () => {
    const search = adminPolicySearch ? adminPolicySearch.value : '';
    const type = adminPolicyTypeFilter ? adminPolicyTypeFilter.value : 'all';
    const status = adminPolicyStatusFilter ? adminPolicyStatusFilter.value : 'all';
    renderAdminPoliciesTable(type, status, search);
  };

  if (adminPolicySearch) adminPolicySearch.addEventListener('input', triggerAdminPolicyFilter);
  if (adminPolicyTypeFilter) adminPolicyTypeFilter.addEventListener('change', triggerAdminPolicyFilter);
  if (adminPolicyStatusFilter) adminPolicyStatusFilter.addEventListener('change', triggerAdminPolicyFilter);
  if (adminPolicyResetBtn) {
    adminPolicyResetBtn.addEventListener('click', () => {
      if (adminPolicySearch) adminPolicySearch.value = '';
      if (adminPolicyTypeFilter) adminPolicyTypeFilter.value = 'all';
      if (adminPolicyStatusFilter) adminPolicyStatusFilter.value = 'all';
      renderAdminPoliciesTable('all', 'all', '');
      showToast('Policy filters reset.');
    });
  }

  // Logout Button
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('active_page');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';

    document.getElementById('app').classList.remove('active');
    document.getElementById('app').removeAttribute('data-active-role');
    document.body.removeAttribute('data-active-role');
    document.getElementById('login-screen').style.display = 'flex';
    closeSlidePanel();
    showToast('Logged out of InsureAssist.');
  });

  // Sidebar Nav Links
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Quick Nav Buttons
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });

  // AI Assistant Page Controls for All Roles
  initAllRoleChatListeners();

  const cardAi = document.getElementById('card-ai-conversations');
  if (cardAi) cardAi.addEventListener('click', () => navigateTo('customer-ai'));
  const quickAi = document.getElementById('customer-quick-action-ai');
  if (quickAi) quickAi.addEventListener('click', () => navigateTo('customer-ai'));

  // Underwriter Summary Cards Event Listeners (Req 4 & 5)
  const uwPendingCard = document.getElementById('card-uw-pending');
  const uwHighRiskCard = document.getElementById('card-uw-high-risk');
  const uwApprovedCard = document.getElementById('card-uw-approved');
  const uwInfoCard = document.getElementById('card-uw-info');

  if (uwPendingCard) {
    uwPendingCard.addEventListener('click', () => {
      highlightActiveCard('card-uw-pending');
      const statusFilter = document.getElementById('uw-full-status-filter');
      if (statusFilter) {
        statusFilter.value = 'Pending';
        renderUnderwriterFullQueue('Pending', 'all', 'all', '');
      }
      const pendingList = MOCK_DB.underwriterQueue.filter(item => item.status === 'Pending');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${pendingList.length} applications</strong> awaiting risk evaluation:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;">
              ${pendingList.map(app => `
                <div class="panel-policy-list-item">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · ${app.premium}/yr · Risk: ${app.riskLevel}</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Review →</button>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:1.25rem;">
              <button class="btn btn-outline btn-block btn-sm" onclick="navigateTo('underwriter-queue')">Open Dedicated Queue Ledger →</button>
            </div>
          `;
      openOrUpdateSlidePanel('Pending Underwriting Reviews (14)', 'Active Submissions Requiring Decision', contentHtml);
    });
  }

  if (uwHighRiskCard) {
    uwHighRiskCard.addEventListener('click', () => {
      highlightActiveCard('card-uw-high-risk');
      const riskFilter = document.getElementById('uw-full-risk-filter');
      if (riskFilter) {
        riskFilter.value = 'High';
        renderUnderwriterFullQueue('all', 'High', 'all', '');
      }
      const highList = MOCK_DB.underwriterQueue.filter(item => item.riskLevel === 'High');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${highList.length} high-exposure cases</strong> flagged for strict review:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;">
              ${highList.map(app => `
                <div class="panel-policy-list-item" style="border-left:3px solid var(--red);">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · Score ${app.riskScore}/100 · ${app.status}</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Review Case →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel('High-Risk Cases (4)', 'Applications with Elevated Hazard Indicators', contentHtml);
    });
  }

  if (uwApprovedCard) {
    uwApprovedCard.addEventListener('click', () => {
      highlightActiveCard('card-uw-approved');
      const statusFilter = document.getElementById('uw-full-status-filter');
      if (statusFilter) {
        statusFilter.value = 'Approved';
        renderUnderwriterFullQueue('Approved', 'all', 'all', '');
      }
      const approvedList = MOCK_DB.underwriterQueue.filter(item => item.status === 'Approved');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${approvedList.length} bound/approved policies</strong>:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;">
              ${approvedList.map(app => `
                <div class="panel-policy-list-item">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · ${app.premium}/yr · Effective ${app.effectiveDate}</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Inspect →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel('Approved Applications (28)', 'Policies Bound and Issued', contentHtml);
    });
  }

  if (uwInfoCard) {
    uwInfoCard.addEventListener('click', () => {
      highlightActiveCard('card-uw-info');
      const statusFilter = document.getElementById('uw-full-status-filter');
      if (statusFilter) {
        statusFilter.value = 'Needs More Information';
        renderUnderwriterFullQueue('Needs More Information', 'all', 'all', '');
      }
      const infoList = MOCK_DB.underwriterQueue.filter(item => item.status === 'Needs More Information');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${infoList.length} applications</strong> awaiting supplemental documents:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;">
              ${infoList.map(app => `
                <div class="panel-policy-list-item" style="border-left:3px solid var(--blue-600);">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · Pending documentation</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">View Details →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel('Needs More Information (6)', 'Cases Awaiting Documentation', contentHtml);
    });
  }

  // Underwriting Dedicated Queue Filter and Search Event Handlers
  const uwFullSearch = document.getElementById('uw-full-queue-search');
  const uwFullStatusFilter = document.getElementById('uw-full-status-filter');
  const uwFullRiskFilter = document.getElementById('uw-full-risk-filter');
  const uwFullProductFilter = document.getElementById('uw-full-product-filter');
  const uwFullResetBtn = document.getElementById('uw-full-reset-filters-btn');

  const triggerUwFullFilter = () => {
    const search = uwFullSearch ? uwFullSearch.value : '';
    const status = uwFullStatusFilter ? uwFullStatusFilter.value : 'all';
    const risk = uwFullRiskFilter ? uwFullRiskFilter.value : 'all';
    const product = uwFullProductFilter ? uwFullProductFilter.value : 'all';
    renderUnderwriterFullQueue(status, risk, product, search);
  };

  if (uwFullSearch) uwFullSearch.addEventListener('input', triggerUwFullFilter);
  if (uwFullStatusFilter) uwFullStatusFilter.addEventListener('change', triggerUwFullFilter);
  if (uwFullRiskFilter) uwFullRiskFilter.addEventListener('change', triggerUwFullFilter);
  if (uwFullProductFilter) uwFullProductFilter.addEventListener('change', triggerUwFullFilter);
  if (uwFullResetBtn) {
    uwFullResetBtn.addEventListener('click', () => {
      if (uwFullSearch) uwFullSearch.value = '';
      if (uwFullStatusFilter) uwFullStatusFilter.value = 'all';
      if (uwFullRiskFilter) uwFullRiskFilter.value = 'all';
      if (uwFullProductFilter) uwFullProductFilter.value = 'all';
      renderUnderwriterFullQueue('all', 'all', 'all', '');
      showToast('Underwriting queue filters reset.');
    });
  }

  // Customer Summary Cards
  document.getElementById('card-active-policies').addEventListener('click', () => {
    highlightActiveCard('card-active-policies');
    const policies = (window.customerPoliciesData && window.customerPoliciesData.length > 0) ? window.customerPoliciesData : (MOCK_DB.customerPolicies || []);
    const activePolicies = policies.filter(p => isPolicyCurrentlyActive(p));
    const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';

    let contentHtml = '';
    if (activePolicies.length === 0) {
      contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">No active policies currently in portfolio.</div>
            <div style="padding: 2rem 1rem; text-align: center; color: var(--gray-500); background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--gray-300);">
              <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 0.25rem;">No Active Coverage</div>
              <div style="font-size: 0.825rem;">All associated policies are expired, pending, or inactive.</div>
            </div>
            <div style="margin-top:1.25rem;">
              <button class="btn btn-outline btn-block btn-sm" onclick="navigateTo('customer-policies')">View All Policies (${policies.length}) →</button>
            </div>
          `;
    } else {
      contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing all <strong>${activePolicies.length}</strong> active ${activePolicies.length === 1 ? 'policy' : 'policies'} in your portfolio:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;">
              ${activePolicies.map(p => `
                <div class="panel-policy-list-item">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.925rem">${p.type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${p.code || p.id} · ${p.premium}</div>
                    <div style="font-size:0.75rem;color:var(--gray-500)">Category: ${p.category} · Expires: ${p.expiry}</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="openPolicyDetailsPanel('${p.code || p.id}', '${custName}')">View Details →</button>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:1.25rem;">
              <button class="btn btn-outline btn-block btn-sm" onclick="navigateTo('customer-policies')">Open Full Policies Page (${activePolicies.length}) →</button>
            </div>
          `;
    }
    openOrUpdateSlidePanel(`Active Policies (${activePolicies.length})`, `Customer ${custName} Portfolio`, contentHtml);
  });

  document.getElementById('card-upcoming-renewals').addEventListener('click', () => {
    highlightActiveCard('card-upcoming-renewals');
    const policies = (window.customerPoliciesData && window.customerPoliciesData.length > 0) ? window.customerPoliciesData : (MOCK_DB.customerPolicies || []);
    const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
    const approachingList = getUpcomingRenewals(policies);

    let contentHtml = '';
    if (approachingList.length === 0) {
      contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">No upcoming policy renewals.</div>
            <div style="padding: 2rem 1rem; text-align: center; color: var(--gray-500); background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--gray-300);">
              <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 0.25rem;">No Renewals Pending</div>
              <div style="font-size: 0.825rem;">There are no active policies currently scheduled for renewal.</div>
            </div>
          `;
    } else {
      contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">The following <strong>${approachingList.length} ${approachingList.length === 1 ? 'policy' : 'policies'}</strong> approaching annual renewal:</div>
            <div style="display:flex;flex-direction:column;gap:0.75rem;width:100%;box-sizing:border-box;">
              ${approachingList.map(p => {
        const isPending = p.renewalStatus === 'Pending Approval';
        const daysText = isPending ? 'Pending Approval' : (p.diffDays !== null ? (p.diffDays === 0 ? 'Today' : `${p.diffDays} days`) : 'Active');
        const badgeClass = isPending ? 'badge-pending' : ((p.diffDays !== null && p.diffDays <= 90) ? 'badge-pending' : 'badge-info');

        let actionArea = '';
        if (isPending) {
          actionArea = `
            <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <span style="font-size:0.8rem;color:#92400E;font-weight:600;display:inline-flex;align-items:center;gap:4px;background:#FEF3C7;padding:4px 10px;border-radius:6px;border:1px solid #FCD34D;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Waiting for Agent Approval
              </span>
              <button class="btn btn-outline btn-sm" onclick="openPolicyDetailsPanel('${p.code || p.id}', '${custName}')">Inspect Terms</button>
            </div>
          `;
        } else {
          actionArea = `
            <div style="margin-top:1rem;display:flex;justify-content:flex-end;gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="openPolicyDetailsPanel('${p.code || p.id}', '${custName}')">Inspect Terms</button>
              <button class="btn btn-primary btn-sm" onclick="handleCustomerConfirmRenewal('${p.id || p.code}', '${p.code || p.id}')">Confirm Renewal</button>
            </div>
          `;
        }

        return `
                  <div class="card" style="padding:1.15rem 1.25rem;width:100%;box-sizing:border-box;align-self:stretch;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;gap:10px;">
                      <div style="min-width:0;flex:1;">
                        <div style="font-weight:700;color:var(--blue-900);font-size:0.95rem;">${p.type}</div>
                      </div>
                      <span class="badge ${badgeClass}" style="flex-shrink:0;">${daysText}</span>
                    </div>
                    <div class="detail-row"><span class="detail-label">Policy ID</span><span class="detail-value" style="font-family:monospace">${p.code || p.id}</span></div>
                    <div class="detail-row"><span class="detail-label">Renewal Date</span><span class="detail-value">${p.expiry}</span></div>
                    <div class="detail-row"><span class="detail-label">Renewal Premium</span><span class="detail-value" style="color:var(--blue-900);font-weight:700;">${p.premium}</span></div>
                    ${actionArea}
                  </div>
                `;
      }).join('')}
            </div>
          `;
    }
    openOrUpdateSlidePanel(`Upcoming Renewals (${approachingList.length})`, 'Approaching Policy Renewals', contentHtml);
  });


  document.getElementById('card-annual-premium').addEventListener('click', () => {
    highlightActiveCard('card-annual-premium');
    const policies = (window.customerPoliciesData && window.customerPoliciesData.length > 0) ? window.customerPoliciesData : (MOCK_DB.customerPolicies || []);
    const activePolicies = policies.filter(p => isPolicyCurrentlyActive(p));
    const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
    const total = activePolicies.reduce((sum, p) => sum + (p.premiumNum || 0), 0);
    const monthly = (total / 12).toFixed(2);

    let contentHtml = '';
    if (activePolicies.length === 0) {
      contentHtml = `
            <div class="detail-section">
              <div class="detail-section-title">Annual Premium Portfolio Total</div>
              <div style="font-size:2rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">$0<span style="font-size:1rem;color:var(--gray-500);font-weight:normal">/year</span></div>
              <p style="font-size:0.85rem;color:var(--gray-600)">No active policies in portfolio.</p>
            </div>
          `;
    } else {
      contentHtml = `
            <div class="detail-section">
              <div class="detail-section-title">Annual Premium Portfolio Total</div>
              <div style="font-size:2rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">$${total.toLocaleString()}<span style="font-size:1rem;color:var(--gray-500);font-weight:normal">/year</span></div>
              <p style="font-size:0.85rem;color:var(--gray-600)">Average monthly installment across ${activePolicies.length} ${activePolicies.length === 1 ? 'policy' : 'policies'}: ~$${parseFloat(monthly).toLocaleString()}/mo</p>
            </div>
            <div class="detail-section">
              <div class="detail-section-title">Breakdown across ${activePolicies.length} ${activePolicies.length === 1 ? 'Policy' : 'Policies'}</div>
              ${activePolicies.map(p => `
                <div class="detail-row" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${p.code || p.id}', '${custName}')">
                  <span class="detail-label">${p.type} (${p.code || p.id})</span>
                  <span class="detail-value" style="color:var(--blue-700)">${p.premium} →</span>
                </div>
              `).join('')}
            </div>
          `;
    }
    openOrUpdateSlidePanel('Annual Premium Breakdown', `$${total.toLocaleString()} across ${activePolicies.length} active ${activePolicies.length === 1 ? 'policy' : 'policies'}`, contentHtml);
  });

  const custRenewBtn = document.getElementById('customer-view-renewals-btn');
  if (custRenewBtn) {
    custRenewBtn.addEventListener('click', () => {
      document.getElementById('card-upcoming-renewals').click();
    });
  }

  // Customer Dashboard chart rows & approaching renewals interactive items
  document.querySelectorAll('#page-customer-dashboard .chart-row[data-policy]').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
      openPolicyDetailsPanel(row.dataset.policy, custName);
    });
  });
  document.querySelectorAll('#page-customer-dashboard .renewal-item[data-policy]').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const custName = (window.customerProfileData && window.customerProfileData.name) || 'Customer';
      openPolicyDetailsPanel(item.dataset.policy, custName);
    });
  });

  // Agent Summary Cards Event Listeners (Req 4)
  const agentCardCust = document.getElementById('agent-card-customers');
  if (agentCardCust) agentCardCust.addEventListener('click', openAgentCustomersSlidePanel);
  const agentCardPol = document.getElementById('agent-card-policies');
  if (agentCardPol) agentCardPol.addEventListener('click', openAgentPoliciesSlidePanel);
  const agentCardRen = document.getElementById('agent-card-renewals');
  if (agentCardRen) agentCardRen.addEventListener('click', openAgentRenewalsSlidePanel);
  const agentCardPrem = document.getElementById('agent-card-premium');
  if (agentCardPrem) agentCardPrem.addEventListener('click', openAgentPremiumSlidePanel);
  const agentViewRenBtn = document.getElementById('agent-view-renewals-btn');
  if (agentViewRenBtn) agentViewRenBtn.addEventListener('click', openAgentRenewalsSlidePanel);

  // Search Inputs for Agent Tables (Req 13)
  document.getElementById('agent-customer-quick-search').addEventListener('input', (e) => {
    renderAgentDashboardTable(e.target.value);
  });
  document.getElementById('agent-full-customer-search').addEventListener('input', (e) => {
    renderAgentFullCustomersDirectory(e.target.value);
  });
  // Search and Category Dropdown Filter for Agent Policies
  const triggerAgentPolicyFilters = () => {
    const searchVal = document.getElementById('agent-policy-search')?.value || '';
    const catVal = document.getElementById('agent-policy-category-filter')?.value || 'all';
    renderAgentPoliciesTable(catVal, searchVal);
  };

  const agentPolicySearch = document.getElementById('agent-policy-search');
  if (agentPolicySearch) agentPolicySearch.addEventListener('input', triggerAgentPolicyFilters);

  const agentPolicyCategoryFilter = document.getElementById('agent-policy-category-filter');
  if (agentPolicyCategoryFilter) agentPolicyCategoryFilter.addEventListener('change', triggerAgentPolicyFilters);

  // Filter tabs for Customer Policies
  document.querySelectorAll('[data-customer-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-customer-filter]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCustomerPolicyCards(tab.dataset.customerFilter);
    });
  });

  // Slide Panel Close Triggers (Single Button & Header X)
  document.getElementById('panel-close-btn').addEventListener('click', closeSlidePanel);
  document.getElementById('panel-single-close-btn').addEventListener('click', closeSlidePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slidePanel.classList.contains('open')) {
      closeSlidePanel();
    }
  });

  // Placeholder Role Toasts
  document.querySelectorAll('.role-placeholder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`The ${btn.dataset.role} Dashboard is scheduled for Phase 2.`);
    });
  });

  // Mobile Menu Toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Coverage Checker
  document.getElementById('coverage-submit-btn').addEventListener('click', () => {
    const query = document.getElementById('coverage-query-input').value;
    if (query.trim()) runCoverageCheck(query);
  });
  document.getElementById('coverage-query-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCoverageCheck(e.target.value);
    }
  });
  document.querySelectorAll('.coverage-quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('coverage-query-input').value = chip.textContent;
      runCoverageCheck(chip.textContent);
    });
  });

  // Glossary Search
  document.getElementById('glossary-search-input').addEventListener('input', (e) => {
    renderGlossaryList(e.target.value);
  });

  // Interactive Preference & Privacy Toggles
  document.querySelectorAll('[data-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      const isNowOn = toggle.classList.contains('on');
      const labelEl = toggle.closest('.toggle-row')?.querySelector('div > div:first-child');
      const label = labelEl ? labelEl.textContent.trim() : 'Preference';
      showToast(`${label} set to ${isNowOn ? 'Enabled (ON)' : 'Disabled (OFF)'}.`);
    });
  });

  // ==========================================================================
  // CUSTOMER PORTAL: MY CLAIMS MANAGEMENT ENGINE
  // ==========================================================================
  window.customerClaimsFilter = 'all';
  window.customerClaimsSearchQuery = '';
  window.customerClaimsData = window.customerClaimsData || [];

  window.renderCustomerClaimsList = function () {
    const container = document.getElementById('customer-claims-list-container');
    if (!container) return;

    const claims = window.customerClaimsData || [];
    const total = claims.length;
    const openCount = claims.filter(c => c.status !== 'Closed' && c.status !== 'Closed · Settled' && c.status !== 'Settled').length;
    const reviewCount = claims.filter(c => (c.status || '').includes('Review') || (c.status || '').includes('Intake') || (c.status || '').includes('Adjuster Assigned') || (c.status || '').includes('Submitted')).length;
    const closedCount = claims.filter(c => c.status === 'Closed' || c.status === 'Closed · Settled' || c.status === 'Settled').length;

    const elTotal = document.getElementById('metric-claims-total');
    const elOpen = document.getElementById('metric-claims-open');
    const elReview = document.getElementById('metric-claims-review');
    const elClosed = document.getElementById('metric-claims-closed');

    if (elTotal) elTotal.innerText = total;
    if (elOpen) elOpen.innerText = openCount;
    if (elReview) elReview.innerText = reviewCount;
    if (elClosed) elClosed.innerText = closedCount;

    let filtered = claims.filter(claim => {
      const statusStr = (claim.status || '').toLowerCase();
      if (window.customerClaimsFilter === 'open' && (statusStr.includes('closed') || statusStr.includes('settled'))) return false;
      if (window.customerClaimsFilter === 'review' && !(statusStr.includes('review') || statusStr.includes('intake') || statusStr.includes('adjuster') || statusStr.includes('submitted'))) return false;
      if (window.customerClaimsFilter === 'closed' && !statusStr.includes('closed') && !statusStr.includes('settled')) return false;

      if (window.customerClaimsSearchQuery) {
        const q = window.customerClaimsSearchQuery.toLowerCase();
        const matchId = (claim.id || '').toLowerCase().includes(q);
        const matchPol = (claim.policyType || claim.policyId || '').toLowerCase().includes(q);
        const matchType = (claim.claimType || '').toLowerCase().includes(q);
        const matchDesc = (claim.description || '').toLowerCase().includes(q);
        if (!matchId && !matchPol && !matchType && !matchDesc) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
          <div class="card" style="text-align:center;padding:3rem 1.5rem;border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;">
            <div style="font-size:2.5rem;margin-bottom:10px;">📋</div>
            <h4 style="color:var(--cust-brown-900);font-size:1.1rem;margin:0 0 6px;">No Claims on Record</h4>
            <p style="font-size:0.85rem;color:var(--gray-500);margin:0 0 1.25rem;">You currently have no active or historical claims filed under this account.</p>
            <button class="btn btn-primary btn-sm" onclick="navigateTo('customer-claim')">Report a Claim →</button>
          </div>
        `;
      return;
    }

    let html = `<div style="display:flex;flex-direction:column;gap:1.25rem;">`;

    filtered.forEach(c => {
      const isClosed = (c.status || '').includes('Closed') || (c.status || '').includes('Settled');
      const sevStr = c.severity || 'Moderate Severity';
      const isLow = sevStr.includes('Low');
      const isMed = sevStr.includes('Medium');
      const isHigh = sevStr.includes('High');

      const severityBadgeBg = isLow ? '#ECFDF5' : isMed ? '#FFFBEB' : isHigh ? '#FEF2F2' : '#F5F3FF';
      const severityBadgeColor = isLow ? '#065F46' : isMed ? '#92400E' : isHigh ? '#991B1B' : '#5B21B6';
      const severityBorder = isLow ? '#A7F3D0' : isMed ? '#FDE68A' : isHigh ? '#FECACA' : '#DDD6FE';

      const statusBadgeBg = isClosed ? '#F3F4F6' : '#EFF6FF';
      const statusBadgeColor = isClosed ? '#4B5563' : '#1D4ED8';
      const statusBorder = isClosed ? '#E5E7EB' : '#BFDBFE';

      html += `
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:12px;">
              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <span style="font-weight:800;font-size:1.1rem;color:var(--cust-brown-900);letter-spacing:0.02em;">${c.id}</span>
                <span style="background:${statusBadgeBg};color:${statusBadgeColor};border:1px solid ${statusBorder};font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:14px;">
                  ● ${c.status || 'Under Review'}
                </span>
                <span style="background:${severityBadgeBg};color:${severityBadgeColor};border:1px solid ${severityBorder};font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:14px;">
                  ${sevStr}
                </span>
              </div>
              <div style="text-align:right;">
                <span style="font-size:0.75rem;color:var(--gray-500);">Estimated Amount</span>
                <div style="font-weight:800;font-size:1.05rem;color:var(--cust-brown-900);">${c.amount || '$0'}</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin-bottom:14px;background:#FAF6F2;padding:12px 14px;border-radius:8px;border:1px solid var(--cust-cream-border);">
              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Covered Policy</div>
                <div style="font-size:0.85rem;font-weight:700;color:var(--cust-brown-900);">${c.policyType || 'Insurance Policy'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${c.policyCode || c.policyId || ''}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Incident Peril</div>
                <div style="font-size:0.85rem;font-weight:700;color:var(--cust-brown-900);">${c.claimType || 'Loss'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">Date: ${c.dateLoss || ''}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Assigned Adjuster</div>
                <div style="font-size:0.85rem;font-weight:700;color:var(--cust-brown-900);">${(c.adjuster && c.adjuster.name) || 'Marcus Vance'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${(c.adjuster && c.adjuster.phone) || '(555) 881-3022'}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Deductible</div>
                <div style="font-size:0.85rem;font-weight:700;color:var(--cust-brown-900);">${c.deductible || '$1,000'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${(c.evidence || []).length} evidence file(s)</div>
              </div>
            </div>

            <p style="font-size:0.85rem;color:var(--gray-700);margin:0 0 12px;line-height:1.45;">
              ${c.description || ''}
            </p>

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-top:1px solid var(--cust-cream-border);padding-top:12px;">
              <div style="display:flex;align-items:center;gap:6px;font-size:0.825rem;color:var(--cust-brown-800);">
                <strong>Next Step:</strong> <span>${c.nextAction || 'Adjuster inspection scheduled.'}</span>
              </div>
              <button class="btn btn-outline btn-sm" onclick="openCustomerClaimDetails('${c.id}')" style="display:inline-flex;align-items:center;gap:6px;font-size:0.825rem;padding:6px 14px;border-color:var(--cust-brown-700);color:var(--cust-brown-800);">
                <span>View Full Claim Details</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
  };

  window.filterCustomerClaims = function (filter, btn) {
    window.customerClaimsFilter = filter;
    document.querySelectorAll('.customer-claims-filter-btn').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = 'inherit';
    });
    if (btn) {
      btn.classList.add('active');
      btn.style.background = 'var(--cust-brown-700)';
      btn.style.color = '#ffffff';
    }
    renderCustomerClaimsList();
  };

  window.searchCustomerClaims = function (query) {
    window.customerClaimsSearchQuery = query;
    renderCustomerClaimsList();
  };

  window.openCustomerClaimDetails = function (claimId) {
    const claims = window.customerClaimsData || [];
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;
    window.currentViewingClaim = claim;

    const modal = document.getElementById('customer-claim-details-modal');
    const content = document.getElementById('customer-claim-details-content');
    if (!modal || !content) return;

    const dates = claim.timelineDates || {};
    const steps = [
      { num: 1, title: 'Claim Submitted', desc: dates.step1 || 'Submitted' },
      { num: 2, title: 'AI Assessment', desc: dates.step2 || 'Completed' },
      { num: 3, title: 'Adjuster Assigned', desc: dates.step3 || 'Assigned' },
      { num: 4, title: 'Investigation', desc: dates.step4 || 'In Progress' },
      { num: 5, title: 'Decision', desc: dates.step5 || 'Pending' },
      { num: 6, title: 'Settlement / Closed', desc: dates.step6 || 'Pending' }
    ];

    let timelineHtml = `
        <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;">
          <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 12px;display:flex;align-items:center;gap:6px;">
            <span>⏱️</span> Claim Resolution Progress Timeline
          </h4>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;gap:8px;flex-wrap:wrap;">
      `;

    steps.forEach((st, idx) => {
      const curStep = claim.timelineStep || 2;
      const isPast = st.num < curStep;
      const isCurrent = st.num === curStep;

      const circleBg = isPast ? '#059669' : isCurrent ? 'var(--cust-brown-700)' : 'var(--gray-200)';
      const circleColor = isPast || isCurrent ? '#ffffff' : 'var(--gray-500)';
      const icon = isPast ? '✓' : st.num;
      const titleColor = isCurrent ? 'var(--cust-brown-900)' : isPast ? '#059669' : 'var(--gray-500)';

      timelineHtml += `
          <div style="display:flex;flex-direction:column;align-items:center;text-align:center;flex:1;min-width:110px;">
            <div style="width:30px;height:30px;border-radius:50%;background:${circleBg};color:${circleColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;margin-bottom:6px;box-shadow:0 2px 5px rgba(0,0,0,0.06);">
              ${icon}
            </div>
            <div style="font-size:0.8rem;font-weight:700;color:${titleColor};margin-bottom:2px;">${st.title}</div>
            <div style="font-size:0.7rem;color:var(--gray-500);line-height:1.2;">${st.desc}</div>
          </div>
        `;
      if (idx < steps.length - 1) {
        timelineHtml += `<div style="flex:0.6;height:2px;background:${isPast ? '#059669' : 'var(--gray-200)'};margin-top:15px;" class="timeline-connector"></div>`;
      }
    });

    timelineHtml += `</div></div>`;

    content.innerHTML = `
        <div style="background:var(--white);padding:1.25rem 1.5rem;border-bottom:1px solid var(--cust-cream-border);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;color:var(--cust-brown-900);margin:0;">${claim.id}</h3>
              <span class="badge badge-active" style="font-size:0.75rem;">${claim.status}</span>
              <span class="badge" style="background:#FAF5FF;color:#6B21A8;border:1px solid #E9D5FF;font-size:0.75rem;">${claim.severity || 'Moderate'}</span>
            </div>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:4px 0 0;">${claim.policyType} (${claim.policyCode || claim.policyId}) · Date of Loss: ${claim.dateLoss}</p>
          </div>
          <button onclick="closeCustomerClaimDetails()" style="border:none;background:#F3F4F6;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;color:var(--gray-600);" title="Close">✕</button>
        </div>

        <div style="padding:1.5rem;max-height:calc(85vh - 120px);overflow-y:auto;">
          ${timelineHtml}

          <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:1.5rem;" class="fnol-grid-responsive">
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              <div class="card" style="border:1px solid var(--cust-cream-border);padding:1.25rem;border-radius:10px;">
                <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 8px;">
                  📋 Claim & Incident Overview
                </h4>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Location</span><span class="detail-value">${claim.location || 'Primary Insured Location'}</span></div>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Loss Timestamp</span><span class="detail-value">${claim.dateLoss} at ${claim.timeLoss || '10:00 AM'}</span></div>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Incident Type</span><span class="detail-value">${claim.claimType || 'Peril Loss'}</span></div>
                <div style="margin-top:10px;font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);">
                  ${claim.description || ''}
                </div>
              </div>

              <div class="card" style="border:1px solid var(--cust-cream-border);padding:1.25rem;border-radius:10px;">
                <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 8px;">
                  🛡️ Coverage Potentially Triggered
                </h4>
                <p style="font-size:0.85rem;color:var(--gray-700);margin:0 0 10px;line-height:1.45;">${(claim.aiSummary && claim.aiSummary.coverageTriggered) || 'Applicable Policy Schedule & Endorsements'}</p>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Applicable Deductible</span><span class="detail-value"><strong>${claim.deductible || '$1,000'}</strong></span></div>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Estimated Repair Scope</span><span class="detail-value"><strong>${claim.amount || '$0'}</strong></span></div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              <div class="card" style="border:1px solid var(--cust-cream-border);padding:1.25rem;border-radius:10px;">
                <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 12px;">
                  👤 Assigned Claims Adjuster
                </h4>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                  <div style="width:42px;height:42px;border-radius:50%;background:var(--cust-brown-700);color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;">
                    ${(claim.adjuster && claim.adjuster.avatar) || 'MV'}
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--cust-brown-900);">${(claim.adjuster && claim.adjuster.name) || 'Marcus Vance'}</div>
                    <div style="font-size:0.75rem;color:var(--gray-500);">${(claim.adjuster && claim.adjuster.title) || 'Senior Claims Examiner'}</div>
                  </div>
                </div>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Phone</span><span class="detail-value">${(claim.adjuster && claim.adjuster.phone) || '(555) 881-3022'}</span></div>
                <div class="detail-row" style="padding:4px 0;"><span class="detail-label">Email</span><span class="detail-value">${(claim.adjuster && claim.adjuster.email) || 'm.vance@feuji-insure.com'}</span></div>
              </div>

              <div class="card" style="border:1px solid var(--cust-cream-border);padding:1.25rem;border-radius:10px;background:#FDF8F3;">
                <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 8px;">
                  🧭 Recommended Next Step
                </h4>
                <p style="font-size:0.85rem;color:var(--cust-brown-900);margin:0 0 10px;line-height:1.45;font-weight:600;">
                  ${claim.nextAction || 'Adjuster onsite inspection in progress.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#FAF6F2;padding:1rem 1.5rem;border-top:1px solid var(--cust-cream-border);display:flex;justify-content:space-between;align-items:center;">
          <button class="btn btn-outline btn-sm" onclick="downloadCustomerClaimDetailsPDF('${claim.id}')">
            📄 Download Claim Summary (PDF)
          </button>
          <button class="btn btn-primary btn-sm" onclick="closeCustomerClaimDetails()">
            Close Details
          </button>
        </div>
      `;

    modal.style.display = 'block';
  };

  window.closeCustomerClaimDetails = function () {
    const modal = document.getElementById('customer-claim-details-modal');
    if (modal) modal.style.display = 'none';
  };


  // Session Restoration on Page Load / Refresh
  const storedToken = (typeof localStorage !== 'undefined' && localStorage.getItem('auth_token')) ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth_token'));
  const storedUser = (typeof localStorage !== 'undefined' && localStorage.getItem('auth_user')) ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth_user'));

  if (storedToken && storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      const userRole = (userObj.role || 'customer').toString().toLowerCase();
      const loginScreen = document.getElementById('login-screen');
      const appShell = document.getElementById('app');
      if (loginScreen) loginScreen.style.display = 'none';
      if (appShell) appShell.classList.add('active');
      const savedPage = (typeof localStorage !== 'undefined' && localStorage.getItem('active_page')) || `${userRole}-dashboard`;
      switchRole(userRole, savedPage);
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  }

  // Initial controllers & renderers
  initTheme();
  initGlobalTooltips();
  initSlidePanelListeners();
  initNotificationListeners();
  renderCustomerPolicyCards('all');
  renderCustomerRecommendations();
  renderComparisonSelectors();
  renderGlossaryList();
  renderAgentDashboardTable();
  renderAgentFullCustomersDirectory();
  renderAgentPoliciesTable('all', '');
  renderAgentDashboardRenewals();
  renderUnderwriterQueueTable('all', 'all', 'all', '');
  renderUnderwriterFullQueue('all', 'all', 'all', '');
  renderAdminDashboardUsersTable();
  renderAdminUsersTable('all', 'all', '');
  renderAdminPoliciesTable('all', 'all', '');
  renderAdminAuditLogs();
  renderAdminRolesGrid();
  ['customer', 'agent', 'underwriter', 'admin'].forEach(r => {
    renderRoleChatHistory(r);
    renderRoleChatMessages(r, getRoleAiData(r).activeConversationId);
  });
});



// Global Window Exports for inline HTML handlers
if (typeof getMockChatResponse === 'function') window.getMockChatResponse = getMockChatResponse;
if (typeof openAIChatSlidePanel === 'function') window.openAIChatSlidePanel = openAIChatSlidePanel;
if (typeof scrollChatToBottom === 'function') window.scrollChatToBottom = scrollChatToBottom;
if (typeof attachChatEventListeners === 'function') window.attachChatEventListeners = attachChatEventListeners;
if (typeof handleChatPromptClick === 'function') window.handleChatPromptClick = handleChatPromptClick;
if (typeof showGlobalTooltipFor === 'function') window.showGlobalTooltipFor = showGlobalTooltipFor;
if (typeof hideGlobalTooltip === 'function') window.hideGlobalTooltip = hideGlobalTooltip;
if (typeof initGlobalTooltips === 'function') window.initGlobalTooltips = initGlobalTooltips;
if (typeof toggleCustomerRenewalsList === 'function') window.toggleCustomerRenewalsList = toggleCustomerRenewalsList;
if (typeof toggleAgentRenewalsList === 'function') window.toggleAgentRenewalsList = toggleAgentRenewalsList;
if (typeof toggleAgentCustomersTable === 'function') window.toggleAgentCustomersTable = toggleAgentCustomersTable;
if (typeof toggleAgentFullCustomersTable === 'function') window.toggleAgentFullCustomersTable = toggleAgentFullCustomersTable;
if (typeof toggleCardShowMore === 'function') window.toggleCardShowMore = toggleCardShowMore;
if (typeof updatePanelBackButton === 'function') window.updatePanelBackButton = updatePanelBackButton;
if (typeof lockBodyScroll === 'function') window.lockBodyScroll = lockBodyScroll;
if (typeof unlockBodyScroll === 'function') window.unlockBodyScroll = unlockBodyScroll;
if (typeof openOrUpdateSlidePanel === 'function') window.openOrUpdateSlidePanel = openOrUpdateSlidePanel;
if (typeof slidePanelGoBack === 'function') window.slidePanelGoBack = slidePanelGoBack;
if (typeof closeSlidePanel === 'function') window.closeSlidePanel = closeSlidePanel;
if (typeof initSlidePanelListeners === 'function') window.initSlidePanelListeners = initSlidePanelListeners;
if (typeof openCustomerDetailsPanel === 'function') window.openCustomerDetailsPanel = openCustomerDetailsPanel;
if (typeof getPolicyContextualDescription === 'function') window.getPolicyContextualDescription = getPolicyContextualDescription;
if (typeof openPolicyDetailsPanel === 'function') window.openPolicyDetailsPanel = openPolicyDetailsPanel;
if (typeof openAgentRenewalsSlidePanel === 'function') window.openAgentRenewalsSlidePanel = openAgentRenewalsSlidePanel;
if (typeof openAgentCustomersSlidePanel === 'function') window.openAgentCustomersSlidePanel = openAgentCustomersSlidePanel;
if (typeof openAgentPoliciesSlidePanel === 'function') window.openAgentPoliciesSlidePanel = openAgentPoliciesSlidePanel;
if (typeof openAgentPremiumSlidePanel === 'function') window.openAgentPremiumSlidePanel = openAgentPremiumSlidePanel;
if (typeof openAdminUsersSlidePanel === 'function') window.openAdminUsersSlidePanel = openAdminUsersSlidePanel;
if (typeof openAdminCustomersSlidePanel === 'function') window.openAdminCustomersSlidePanel = openAdminCustomersSlidePanel;
if (typeof openAdminAgentsSlidePanel === 'function') window.openAdminAgentsSlidePanel = openAdminAgentsSlidePanel;
if (typeof openAdminUnderwritersSlidePanel === 'function') window.openAdminUnderwritersSlidePanel = openAdminUnderwritersSlidePanel;
if (typeof openAdminPoliciesSlidePanel === 'function') window.openAdminPoliciesSlidePanel = openAdminPoliciesSlidePanel;
if (typeof openAdminActivePoliciesSlidePanel === 'function') window.openAdminActivePoliciesSlidePanel = openAdminActivePoliciesSlidePanel;
if (typeof highlightActiveCard === 'function') window.highlightActiveCard = highlightActiveCard;
if (typeof renderAgentDashboardTable === 'function') window.renderAgentDashboardTable = renderAgentDashboardTable;
if (typeof renderAgentFullCustomersDirectory === 'function') window.renderAgentFullCustomersDirectory = renderAgentFullCustomersDirectory;
if (typeof handleAgentCustomerPagination === 'function') window.handleAgentCustomerPagination = handleAgentCustomerPagination;
if (typeof handleAgentFullCustomerFilter === 'function') window.handleAgentFullCustomerFilter = handleAgentFullCustomerFilter;
if (typeof renderAgentPoliciesTable === 'function') window.renderAgentPoliciesTable = renderAgentPoliciesTable;
if (typeof renderAgentDashboardRenewals === 'function') window.renderAgentDashboardRenewals = renderAgentDashboardRenewals;
if (typeof renderUnderwriterQueueTable === 'function') window.renderUnderwriterQueueTable = renderUnderwriterQueueTable;
if (typeof updateUnderwriterFilterCounts === 'function') window.updateUnderwriterFilterCounts = updateUnderwriterFilterCounts;
if (typeof renderUnderwriterFullQueue === 'function') window.renderUnderwriterFullQueue = renderUnderwriterFullQueue;
if (typeof handleUnderwriterQueuePagination === 'function') window.handleUnderwriterQueuePagination = handleUnderwriterQueuePagination;
if (typeof openUnderwriterReviewPanel === 'function') window.openUnderwriterReviewPanel = openUnderwriterReviewPanel;
if (typeof makeUnderwritingDecision === 'function') window.makeUnderwritingDecision = makeUnderwritingDecision;
if (typeof renderAdminDashboardUsersTable === 'function') window.renderAdminDashboardUsersTable = renderAdminDashboardUsersTable;
if (typeof renderAdminUsersTable === 'function') window.renderAdminUsersTable = renderAdminUsersTable;
if (typeof openUserDetailsPanel === 'function') window.openUserDetailsPanel = openUserDetailsPanel;
if (typeof openCreateUserPanel === 'function') window.openCreateUserPanel = openCreateUserPanel;
if (typeof handleCreateUserSubmit === 'function') window.handleCreateUserSubmit = handleCreateUserSubmit;
if (typeof renderAdminRolesGrid === 'function') window.renderAdminRolesGrid = renderAdminRolesGrid;
if (typeof openConfigureRolePermissionsPanel === 'function') window.openConfigureRolePermissionsPanel = openConfigureRolePermissionsPanel;
if (typeof saveRolePermissions === 'function') window.saveRolePermissions = saveRolePermissions;
if (typeof openCreateRolePanel === 'function') window.openCreateRolePanel = openCreateRolePanel;
if (typeof handleCreateRoleSubmit === 'function') window.handleCreateRoleSubmit = handleCreateRoleSubmit;
if (typeof renderAdminPoliciesTable === 'function') window.renderAdminPoliciesTable = renderAdminPoliciesTable;
if (typeof renderAdminAuditLogs === 'function') window.renderAdminAuditLogs = renderAdminAuditLogs;
if (typeof getRoleAiData === 'function') window.getRoleAiData = getRoleAiData;
if (typeof searchRoleChat === 'function') window.searchRoleChat = searchRoleChat;
if (typeof renderRoleChatHistory === 'function') window.renderRoleChatHistory = renderRoleChatHistory;
if (typeof renderRoleChatMessages === 'function') window.renderRoleChatMessages = renderRoleChatMessages;
if (typeof selectRoleChatConversation === 'function') window.selectRoleChatConversation = selectRoleChatConversation;
if (typeof startNewRoleChat === 'function') window.startNewRoleChat = startNewRoleChat;
if (typeof sendRoleChatMessage === 'function') window.sendRoleChatMessage = sendRoleChatMessage;
if (typeof handleRoleChatPrompt === 'function') window.handleRoleChatPrompt = handleRoleChatPrompt;
if (typeof searchCustomerChatConversations === 'function') window.searchCustomerChatConversations = searchCustomerChatConversations;
if (typeof renderCustomerChatHistory === 'function') window.renderCustomerChatHistory = renderCustomerChatHistory;
if (typeof renderCustomerChatMessages === 'function') window.renderCustomerChatMessages = renderCustomerChatMessages;
if (typeof selectCustomerChatConversation === 'function') window.selectCustomerChatConversation = selectCustomerChatConversation;
if (typeof startNewCustomerChat === 'function') window.startNewCustomerChat = startNewCustomerChat;
if (typeof sendCustomerChatMessage === 'function') window.sendCustomerChatMessage = sendCustomerChatMessage;
if (typeof handleCustomerPagePrompt === 'function') window.handleCustomerPagePrompt = handleCustomerPagePrompt;
if (typeof initAllRoleChatListeners === 'function') window.initAllRoleChatListeners = initAllRoleChatListeners;
if (typeof renderCustomerRecommendations === 'function') window.renderCustomerRecommendations = renderCustomerRecommendations;
if (typeof openRecommendationDetailsPanel === 'function') window.openRecommendationDetailsPanel = openRecommendationDetailsPanel;
if (typeof renderCustomerPolicyCards === 'function') window.renderCustomerPolicyCards = renderCustomerPolicyCards;
if (typeof renderComparisonSelectors === 'function') window.renderComparisonSelectors = renderComparisonSelectors;
if (typeof updateComparisonTable === 'function') window.updateComparisonTable = updateComparisonTable;
if (typeof runCoverageCheck === 'function') window.runCoverageCheck = runCoverageCheck;
if (typeof renderGlossaryList === 'function') window.renderGlossaryList = renderGlossaryList;
if (typeof switchRole === 'function') window.switchRole = switchRole;
if (typeof navigateTo === 'function') window.navigateTo = navigateTo;
if (typeof showToast === 'function') window.showToast = showToast;
if (typeof openReportClaimAssistant === 'function') window.openReportClaimAssistant = openReportClaimAssistant;
if (typeof fnolSetStep === 'function') window.fnolSetStep = fnolSetStep;
if (typeof fnolSelectPolicy === 'function') window.fnolSelectPolicy = fnolSelectPolicy;
if (typeof fnolCollectFormInputs === 'function') window.fnolCollectFormInputs = fnolCollectFormInputs;
if (typeof fnolValidateStep === 'function') window.fnolValidateStep = fnolValidateStep;
if (typeof fnolSetPreset === 'function') window.fnolSetPreset = fnolSetPreset;
if (typeof fnolGenerateAssessment === 'function') window.fnolGenerateAssessment = fnolGenerateAssessment;
if (typeof fnolTriggerUpload === 'function') window.fnolTriggerUpload = fnolTriggerUpload;
if (typeof fnolHandleFileUpload === 'function') window.fnolHandleFileUpload = fnolHandleFileUpload;
if (typeof fnolRemovePhoto === 'function') window.fnolRemovePhoto = fnolRemovePhoto;
if (typeof fnolSubmitClaim === 'function') window.fnolSubmitClaim = fnolSubmitClaim;
if (typeof fnolRenderStep === 'function') window.fnolRenderStep = fnolRenderStep;
if (typeof renderFnolPolicySelection === 'function') window.renderFnolPolicySelection = renderFnolPolicySelection;
if (typeof renderCustomerClaimsList === 'function') window.renderCustomerClaimsList = renderCustomerClaimsList;
if (typeof filterCustomerClaims === 'function') window.filterCustomerClaims = filterCustomerClaims;
if (typeof searchCustomerClaims === 'function') window.searchCustomerClaims = searchCustomerClaims;
if (typeof openCustomerClaimDetails === 'function') window.openCustomerClaimDetails = openCustomerClaimDetails;
if (typeof closeCustomerClaimDetails === 'function') window.closeCustomerClaimDetails = closeCustomerClaimDetails;

if (typeof fetchCustomerProfile === 'function') window.fetchCustomerProfile = fetchCustomerProfile;
if (typeof fetchCustomerPolicies === 'function') window.fetchCustomerPolicies = fetchCustomerPolicies;
if (typeof fetchCustomerClaims === 'function') window.fetchCustomerClaims = fetchCustomerClaims;
if (typeof renderCustomerDashboard === 'function') window.renderCustomerDashboard = renderCustomerDashboard;
if (typeof isPolicyCurrentlyActive === 'function') window.isPolicyCurrentlyActive = isPolicyCurrentlyActive;
if (typeof getUpcomingRenewals === 'function') window.getUpcomingRenewals = getUpcomingRenewals;
if (typeof getStatusSortRank === 'function') window.getStatusSortRank = getStatusSortRank;
if (typeof getAuthHeaders === 'function') window.getAuthHeaders = getAuthHeaders;
if (typeof toggleTheme === 'function') window.toggleTheme = toggleTheme;
if (typeof updateThemeIcon === 'function') window.updateThemeIcon = updateThemeIcon;
if (typeof initTheme === 'function') window.initTheme = initTheme;

if (typeof fetchCustomerRenewals === 'function') window.fetchCustomerRenewals = fetchCustomerRenewals;
if (typeof fetchAgentRenewals === 'function') window.fetchAgentRenewals = fetchAgentRenewals;
if (typeof fetchAgentProfile === 'function') window.fetchAgentProfile = fetchAgentProfile;
if (typeof fetchAgentDashboard === 'function') window.fetchAgentDashboard = fetchAgentDashboard;
if (typeof fetchAgentCustomers === 'function') window.fetchAgentCustomers = fetchAgentCustomers;
if (typeof fetchAgentPolicies === 'function') window.fetchAgentPolicies = fetchAgentPolicies;
if (typeof fetchNotifications === 'function') window.fetchNotifications = fetchNotifications;
if (typeof renderNotifications === 'function') window.renderNotifications = renderNotifications;
if (typeof handleCustomerConfirmRenewal === 'function') window.handleCustomerConfirmRenewal = handleCustomerConfirmRenewal;
if (typeof handleAgentApproveRenewal === 'function') window.handleAgentApproveRenewal = handleAgentApproveRenewal;
if (typeof toggleNotificationPopover === 'function') window.toggleNotificationPopover = toggleNotificationPopover;
if (typeof closeNotificationPopover === 'function') window.closeNotificationPopover = closeNotificationPopover;
if (typeof initNotificationListeners === 'function') window.initNotificationListeners = initNotificationListeners;
if (typeof markAllNotificationsRead === 'function') window.markAllNotificationsRead = markAllNotificationsRead;
if (typeof markNotificationRead === 'function') window.markNotificationRead = markNotificationRead;
if (typeof downloadFNOLClaimSummaryPDF === 'function') window.downloadFNOLClaimSummaryPDF = downloadFNOLClaimSummaryPDF;
if (typeof renderAgentDashboard === 'function') window.renderAgentDashboard = renderAgentDashboard;
if (typeof renderAgentProfile === 'function') window.renderAgentProfile = renderAgentProfile;
if (typeof getAgentDisplayName === 'function') window.getAgentDisplayName = getAgentDisplayName;
if (typeof downloadCustomerClaimDetailsPDF === 'function') window.downloadCustomerClaimDetailsPDF = downloadCustomerClaimDetailsPDF;
if (typeof downloadPolicyDocument === 'function') window.downloadPolicyDocument = downloadPolicyDocument;
if (typeof generatePDFDocument === 'function') window.generatePDFDocument = generatePDFDocument;
if (typeof downloadPDFFile === 'function') window.downloadPDFFile = downloadPDFFile;
