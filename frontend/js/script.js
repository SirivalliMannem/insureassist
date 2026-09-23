const AUTH_SERVICE_URL = 'http://127.0.0.1:8001';
const CUSTOMER_SERVICE_URL = 'http://127.0.0.1:8002';
const AGENT_SERVICE_URL = 'http://127.0.0.1:8003';
const UNDERWRITER_SERVICE_URL = 'http://127.0.0.1:8004';
const ADMIN_SERVICE_URL = 'http://127.0.0.1:8005';
const AI_SERVICE_URL = 'http://127.0.0.1:8006';

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

  // Underwriting Queue Data (Empty - loaded from real database)
  underwriterQueue: [],

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
            { message_id: 'msg-c2', conversation_id: 'conv-cust-1', sender: 'bot', content: 'Your sample Home Insurance policy includes dwelling ($450,000), personal property ($225,000), liability ($300,000), and loss-of-use coverage.', timestamp: '10:30 AM' },
            { message_id: 'msg-c3', conversation_id: 'conv-cust-1', sender: 'user', content: 'What is my deductible?', timestamp: '10:32 AM' },
            { message_id: 'msg-c4', conversation_id: 'conv-cust-1', sender: 'bot', content: 'Your current sample policy has a $1,000 all-perils deductible and a $2,500 wind/hail deductible.', timestamp: '10:32 AM' }
          ]
        },
        {
          conversation_id: 'conv-cust-2',
          title: 'Auto Insurance Coverage',
          created_at: '2026-03-26 14:15',
          updated_at: '2026-03-26 14:20',
          messages: [
            { message_id: 'msg-c5', conversation_id: 'conv-cust-2', sender: 'user', content: 'Does my auto policy include liability coverage?', timestamp: '2:15 PM' },
            { message_id: 'msg-c6', conversation_id: 'conv-cust-2', sender: 'bot', content: 'Your sample Auto Insurance policy includes bodily injury liability ($100k/$300k), collision ($500 ded.), and comprehensive coverage ($250 ded.).', timestamp: '2:15 PM' }
          ]
        },
        {
          conversation_id: 'conv-cust-3',
          title: 'Policy Renewal Question',
          created_at: '2026-03-24 09:00',
          updated_at: '2026-03-24 09:05',
          messages: [
            { message_id: 'msg-c7', conversation_id: 'conv-cust-3', sender: 'user', content: 'When is my policy renewal?', timestamp: '9:00 AM' },
            { message_id: 'msg-c8', conversation_id: 'conv-cust-3', sender: 'bot', content: 'Your sample policy is scheduled for renewal in 45 days (March 15, 2026).', timestamp: '9:00 AM' }
          ]
        },
        {
          conversation_id: 'conv-cust-4',
          title: 'Understanding Deductible',
          created_at: '2026-03-20 16:40',
          updated_at: '2026-03-20 16:45',
          messages: [
            { message_id: 'msg-c9', conversation_id: 'conv-cust-4', sender: 'user', content: 'What is my deductible?', timestamp: '4:40 PM' },
            { message_id: 'msg-c10', conversation_id: 'conv-cust-4', sender: 'bot', content: 'Your current sample deductible is $1,000 for standard property losses.', timestamp: '4:40 PM' }
          ]
        },
        {
          conversation_id: 'conv-cust-5',
          title: 'Water Backup Protection',
          created_at: '2026-03-15 15:10',
          updated_at: '2026-03-15 15:15',
          messages: [
            { message_id: 'msg-c11', conversation_id: 'conv-cust-5', sender: 'user', content: 'Are water backups covered under standard home insurance?', timestamp: '3:10 PM' },
            { message_id: 'msg-c12', conversation_id: 'conv-cust-5', sender: 'bot', content: 'Standard HO-3 excludes sewer/drain backup unless an endorsement is attached. Your sample portfolio includes an active Water Backup Rider providing up to $25,000 in coverage.', timestamp: '3:10 PM' }
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
            { message_id: 'msg-a2', conversation_id: 'conv-agent-1', sender: 'bot', content: 'Sarah Mitchell (CUST-001) holds 12 total active policies with $4,840/yr total premium portfolio. Her Homeowners HO-3 (POL-002, $1,840/yr) renews in 45 days. Her Auto Comprehensive (POL-001, $1,260/yr) renews in 60 days.', timestamp: '11:01 AM' }
          ]
        },
        {
          conversation_id: 'conv-agent-2',
          title: 'Emily Johnson Commercial Renewal',
          created_at: '2026-03-27 14:30',
          updated_at: '2026-03-27 14:45',
          messages: [
            { message_id: 'msg-a3', conversation_id: 'conv-agent-2', sender: 'user', content: 'Show coverage limits for Emily Johnson\'s commercial policy', timestamp: '2:30 PM' },
            { message_id: 'msg-a4', conversation_id: 'conv-agent-2', sender: 'bot', content: 'Emily Johnson (CUST-003) has 3 active commercial policies totaling $9,700/yr. Her Commercial General Liability policy is approaching renewal in 20 days (April 22, 2027) with $1,000,000 per-occurrence limit.', timestamp: '2:31 PM' }
          ]
        },
        {
          conversation_id: 'conv-agent-3',
          title: 'Upcoming 90-Day Renewal Pipeline',
          created_at: '2026-03-25 09:20',
          updated_at: '2026-03-25 09:35',
          messages: [
            { message_id: 'msg-a5', conversation_id: 'conv-agent-3', sender: 'user', content: 'Which clients have renewals in the next 30 days?', timestamp: '9:20 AM' },
            { message_id: 'msg-a6', conversation_id: 'conv-agent-3', sender: 'bot', content: 'Across your 18 assigned clients, 5 policies are approaching renewal in the next 90 days: Sarah Mitchell (Home), John Carter (Auto), Emily Johnson (Commercial), Michael Brown (Commercial Property), and David Chen (Boat).', timestamp: '9:21 AM' }
          ]
        },
        {
          conversation_id: 'conv-agent-4',
          title: 'High-Value Customer Book Breakdown',
          created_at: '2026-03-22 16:10',
          updated_at: '2026-03-22 16:25',
          messages: [
            { message_id: 'msg-a7', conversation_id: 'conv-agent-4', sender: 'user', content: 'What is my total commercial book value?', timestamp: '4:10 PM' },
            { message_id: 'msg-a8', conversation_id: 'conv-agent-4', sender: 'bot', content: 'Your assigned book of business consists of 18 active clients, 32 total policies, and an annual premium portfolio of $48,650 (Home: 38%, Auto: 31%, Commercial: 20%, Umbrella: 11%).', timestamp: '4:11 PM' }
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
            { message_id: 'msg-u2', conversation_id: 'conv-uw-1', sender: 'bot', content: 'Application UW-1002 (John Carter) is rated High Risk (Score 78) due to 2 recent speeding violations within 24 months, high vehicle horsepower (BMW M340i), and aggressive braking telematics score (62/100).', timestamp: '1:01 PM' }
          ]
        },
        {
          conversation_id: 'conv-uw-2',
          title: 'Tier 3 Coastal Property Guidelines',
          created_at: '2026-03-26 10:15',
          updated_at: '2026-03-26 10:30',
          messages: [
            { message_id: 'msg-u3', conversation_id: 'conv-uw-2', sender: 'user', content: 'What are the Tier 3 property exposure guidelines?', timestamp: '10:15 AM' },
            { message_id: 'msg-u4', conversation_id: 'conv-uw-2', sender: 'bot', content: 'Tier 3 exposure guidelines require minimum 5% named hurricane deductible, mandatory hurricane shutter verification, and exclusion of exterior unattached structures without separate rating.', timestamp: '10:16 AM' }
          ]
        },
        {
          conversation_id: 'conv-uw-3',
          title: 'Commercial Auto Loss Runs',
          created_at: '2026-03-23 15:40',
          updated_at: '2026-03-23 15:55',
          messages: [
            { message_id: 'msg-u5', conversation_id: 'conv-uw-3', sender: 'user', content: 'What is the loss ratio threshold for commercial auto?', timestamp: '3:40 PM' },
            { message_id: 'msg-u6', conversation_id: 'conv-uw-3', sender: 'bot', content: 'Standard target 3-year loss ratio threshold for commercial auto fleets is < 55%. Accounts exceeding 65% loss ratio require senior underwriter referral and safety telematics mandatory mandate.', timestamp: '3:41 PM' }
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
            { message_id: 'msg-adm2', conversation_id: 'conv-admin-1', sender: 'bot', content: 'Underwriter role has permissions to: view submissions queue, execute risk score evaluations, request loss runs, approve/bind policies up to $5.0M authority, and attach standard exclusion riders.', timestamp: '9:01 AM' }
          ]
        },
        {
          conversation_id: 'conv-admin-2',
          title: 'System Users by Status',
          created_at: '2026-03-28 11:30',
          updated_at: '2026-03-28 11:45',
          messages: [
            { message_id: 'msg-adm3', conversation_id: 'conv-admin-2', sender: 'user', content: 'How many users are currently in Pending status?', timestamp: '11:30 AM' },
            { message_id: 'msg-adm4', conversation_id: 'conv-admin-2', sender: 'bot', content: 'Currently 1 user (USR-012, Rachel Green) is in Pending status awaiting identity verification. 247 other enterprise accounts are fully Active.', timestamp: '11:31 AM' }
          ]
        },
        {
          conversation_id: 'conv-admin-3',
          title: 'Enterprise Policy Totals',
          created_at: '2026-03-25 14:00',
          updated_at: '2026-03-25 14:15',
          messages: [
            { message_id: 'msg-adm5', conversation_id: 'conv-admin-3', sender: 'user', content: 'Summarize enterprise policy count by category', timestamp: '2:00 PM' },
            { message_id: 'msg-adm6', conversation_id: 'conv-admin-3', sender: 'bot', content: 'The enterprise policy registry holds 426 total policies (378 active): Property (148), Vehicle (124), Commercial (96), and Specialty Lines (58), totaling $1.42M annual in-force portfolio.', timestamp: '2:01 PM' }
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

/**
 * Downloads an authenticated document referenced in AI Chat responses
 */
async function downloadOrViewDoc(docName, docRef) {
  if (!docName && !docRef) return;
  const cleanName = (docName || 'Policy Document').replace(/[^\w\s\-\.]/g, '').trim();
  const cleanRef = (docRef || '').trim();

  try {
    const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_token') : null) ||
                  (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null) ||
                  (typeof MOCK_DB !== 'undefined' && MOCK_DB.authToken ? MOCK_DB.authToken : null);

    const headers = { 'Accept': 'application/pdf, application/json, */*' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const params = new URLSearchParams();
    if (cleanRef) params.append('ref', cleanRef);
    if (cleanName) params.append('name', cleanName);

    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/documents/download?${params.toString()}`, {
      method: 'GET',
      headers: headers
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 403) {
        showToast('Document currently unavailable.', 'error');
        return;
      }
      const errData = await res.json().catch(() => ({}));
      showToast(errData.detail || 'Document currently unavailable.', 'error');
      return;
    }

    // Extract filename from Content-Disposition header
    let filename = '';
    const disposition = res.headers.get('Content-Disposition') || res.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename=["']?([^"';]+)["']?/i);
      if (match && match[1]) filename = match[1].trim();
    }
    if (!filename) {
      filename = cleanRef.toLowerCase().endsWith('.pdf') ? cleanRef : `${(cleanRef || cleanName).replace(/\s+/g, '_')}.pdf`;
    }

    // Trigger native browser download via Blob
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 250);

    showToast(`Downloaded: ${filename}`);
  } catch (err) {
    console.error('Error downloading document:', err);
    showToast('Document currently unavailable.', 'error');
  }
}
window.downloadOrViewDoc = downloadOrViewDoc;

/**
 * Robust Client-Side Markdown Formatter for InsureAssist AI Chatbot
 */
function renderChatMarkdown(rawText) {
  if (!rawText) return '';
  let text = String(rawText).trim();

  // If already contains typing indicator markup, return untouched
  if (text.includes('chat-typing-indicator')) return text;

  // Escape basic HTML entities
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Format Multi-line Code Blocks
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="chat-code-block"><code>${code.trim()}</code></pre>`;
  });

  // Format Inline Code
  text = text.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

  // Format Markdown Tables if present
  const lines = text.split('\n');
  let inTable = false;
  let tableHtml = '';
  let processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (/^\|[\s\-:|]+\|$/.test(line)) {
        continue;
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        inTable = true;
        tableHtml = '<div class="chat-table-wrapper"><table class="chat-table"><thead><tr>';
        cells.forEach(c => { tableHtml += `<th>${c}</th>`; });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>';
        cells.forEach(c => { tableHtml += `<td>${c}</td>`; });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table></div>';
        processedLines.push(tableHtml);
        tableHtml = '';
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table></div>';
    processedLines.push(tableHtml);
  }

  text = processedLines.join('\n');

  // Format Headings
  text = text.replace(/^### (.*$)/gim, '<h4 class="chat-heading-3">$1</h4>');
  text = text.replace(/^## (.*$)/gim, '<h3 class="chat-heading-2">$1</h3>');
  text = text.replace(/^# (.*$)/gim, '<h2 class="chat-heading-1">$1</h2>');

  // Format Document Attachment Cards
  text = text.replace(/📄\s*(?:\*\*(.*?)\*\*|(.*?))(?:\s*\((.*?)\)|\r?\n\s*([A-Za-z0-9]+-[A-Za-z0-9-]+))?(?:\r?\n|\s)*(?:(?:\[?(?:Download\s+(?:PDF|Document)(?:\s*↓)?|View\s+Document(?:\s*→)?)\]?(?:\([^)]*\))?)|(?:Download\s+(?:PDF|Document)|View\s*Document))/gi, (match, titleBold, titlePlain, refParen, refLine) => {
    let title = (titleBold || titlePlain || 'Policy Document').trim();
    let cleanRef = (refParen || refLine || '').trim();

    if (title.includes('\n')) {
      const parts = title.split('\n').map(p => p.trim()).filter(Boolean);
      title = parts[0] || 'Policy Document';
      if (!cleanRef && parts[1] && /[A-Za-z0-9]+-[A-Za-z0-9-]+/.test(parts[1])) {
        cleanRef = parts[1];
      }
    }

    if (!cleanRef) {
      const idMatch = title.match(/([A-Za-z0-9]+-[A-Za-z0-9-]+)/);
      if (idMatch) {
        cleanRef = idMatch[1];
      }
    }

    const safeTitle = title.replace(/'/g, "\\'");
    const safeRef = cleanRef.replace(/'/g, "\\'");
    const refBadge = cleanRef ? `<span class="chat-doc-id">(${cleanRef})</span>` : '';
    return `<div class="chat-doc-card">
      <div class="chat-doc-icon">📄</div>
      <div class="chat-doc-info">
        <div class="chat-doc-title">${title} ${refBadge}</div>
        <div class="chat-doc-action" onclick="downloadOrViewDoc('${safeTitle}', '${safeRef}')">
          <span>Download PDF</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </div>
      </div>
    </div>`;
  });

  // Format Standalone Document Links ([📄 Download PDF: Title](#) or [📄 View Document: Title](#))
  text = text.replace(/\[📄\s*([^\]]+)\]\([^)]*\)/gi, (match, title) => {
    const safeTitle = title.replace(/'/g, "\\'");
    return `<div class="chat-doc-card">
      <div class="chat-doc-icon">📄</div>
      <div class="chat-doc-info">
        <div class="chat-doc-title">${title}</div>
        <div class="chat-doc-action" onclick="downloadOrViewDoc('${safeTitle}', '')">
          <span>Download PDF</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </div>
      </div>
    </div>`;
  });

  // Format Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Format Italic (avoid matching within filenames with underscores like doc_file_name.pdf)
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/(?:\b|\s)_([a-zA-Z0-9 ]+?)_(?:\b|\s)/g, ' <em>$1</em> ');

  // Format Bullet Lists (* or - or •)
  text = text.replace(/(?:^[ \t]*[\*\-\•][ \t]+(.+)(?:\r?\n|$))+/gm, (match) => {
    const items = match.trim().split(/\r?\n/).map(item => {
      const cleaned = item.replace(/^[ \t]*[\*\-\•][ \t]+/, '').trim();
      return `<li>${cleaned}</li>`;
    }).join('');
    return `<ul class="chat-bullet-list">${items}</ul>`;
  });

  // Format Numbered Lists (1. item)
  text = text.replace(/(?:^[ \t]*\d+\.[ \t]+(.+)(?:\r?\n|$))+/gm, (match) => {
    const items = match.trim().split(/\r?\n/).map(item => {
      const cleaned = item.replace(/^[ \t]*\d+\.[ \t]+/, '').trim();
      return `<li>${cleaned}</li>`;
    }).join('');
    return `<ol class="chat-numbered-list">${items}</ol>`;
  });

  // Clean Paragraph Formatting
  const paragraphs = text.split(/\n\s*\n/);
  const formattedParagraphs = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<pre')) {
      return trimmed;
    }
    return `<p class="chat-p">${trimmed.replace(/\n/g, '<br>')}</p>`;
  });

  return formattedParagraphs.filter(Boolean).join('');
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
            <div class="chat-bubble">${renderChatMarkdown(m.text || m.content)}</div>
            <div class="chat-bubble-meta"><span>${m.timestamp || 'Just now'}</span></div>
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
        <button class="chat-chip" onclick="handleChatPromptClick('What is my deductible?')">What is my deductible?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('What does my policy cover?')">What does my policy cover?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('What is the status of my application?')">Application status?</button>
        <button class="chat-chip" onclick="handleChatPromptClick('Do I have any claims?')">Do I have any claims?</button>
      `;

  const roleBannerText = role === 'admin'
    ? 'Enterprise Platform Governance & System Telemetry'
    : role === 'underwriter'
      ? 'Underwriting Risk Analysis & Case Evaluation'
      : role === 'agent'
        ? 'Agent Customer Support'
        : 'Customer Policy Guidance';

  const rolePlaceholder = role === 'admin'
    ? 'Ask about total users, active policies, agents, or audit activity...'
    : role === 'underwriter'
      ? 'Ask about risk factors, application summary, or underwriting guidelines...'
      : role === 'agent'
        ? 'Ask about an assigned client or policy...'
        : 'Ask about your policies, deductible, coverage, claims...';

  const contentHtml = `
        <div class="chat-container-layout">
          <div class="chat-prototype-banner">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span><strong>AI Assistant:</strong> Conversational insurance and policy guidance.</span>
          </div>

          <div class="chat-messages-scroll" id="panel-chat-scroll">
            ${messagesHtml}
          </div>

          <div class="chat-chips-area">
            <div style="font-size:0.75rem;color:var(--gray-500);width:100%;margin-bottom:2px;">Quick Prompts:</div>
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
    role === 'admin' ? 'Platform Management & System Telemetry' : role === 'underwriter' ? 'Risk Evaluation & Decision Guidance' : role === 'agent' ? 'Client & Policy Support Assistant' : 'Live Grounded Insurance Guidance',
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

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    const role = MOCK_DB.currentRole;
    chatHistory[role].push({ sender: 'user', text: text });
    if (input) input.value = '';

    if (role === 'customer') {
      // Add typing indicator
      chatHistory[role].push({
        sender: 'bot',
        text: '<div class="chat-typing-indicator"><span></span><span></span><span></span></div>',
        isTyping: true
      });
      openAIChatSlidePanel();

      try {
        const headers = getAuthHeaders();
        const currentCustomerId = (typeof MOCK_DB !== 'undefined' && MOCK_DB.customer && MOCK_DB.customer.id) ? MOCK_DB.customer.id : 'CUST-001';
        const res = await fetch(`${AI_SERVICE_URL}/api/v1/ai/customer/chat`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            message: text,
            customer_id: currentCustomerId
          })
        });

        // Remove typing indicator
        const typingIdx = chatHistory[role].findIndex(m => m.isTyping);
        if (typingIdx !== -1) chatHistory[role].splice(typingIdx, 1);

        if (res.ok) {
          const data = await res.json();
          const botReply = data.response || 'No response received from AI service.';
          chatHistory[role].push({ sender: 'bot', text: botReply });
          openAIChatSlidePanel();
          return;
        }
      } catch (err) {
        console.warn('Slide panel AI call error:', err);
        const typingIdx = chatHistory[role].findIndex(m => m.isTyping);
        if (typingIdx !== -1) chatHistory[role].splice(typingIdx, 1);
      }
    }

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

async function handleChatPromptClick(promptText) {
  const role = MOCK_DB.currentRole;
  chatHistory[role].push({ sender: 'user', text: promptText });

  if (role === 'customer') {
    chatHistory[role].push({
      sender: 'bot',
      text: '<div class="chat-typing-indicator"><span></span><span></span><span></span></div>',
      isTyping: true
    });
    openAIChatSlidePanel();

    try {
      const headers = getAuthHeaders();
      const currentCustomerId = (typeof MOCK_DB !== 'undefined' && MOCK_DB.customer && MOCK_DB.customer.id) ? MOCK_DB.customer.id : 'CUST-001';
      const res = await fetch(`${AI_SERVICE_URL}/api/v1/ai/customer/chat`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: promptText,
          customer_id: currentCustomerId
        })
      });

      const typingIdx = chatHistory[role].findIndex(m => m.isTyping);
      if (typingIdx !== -1) chatHistory[role].splice(typingIdx, 1);

      if (res.ok) {
        const data = await res.json();
        const botReply = data.response || 'No response received from AI service.';
        chatHistory[role].push({ sender: 'bot', text: botReply });
        openAIChatSlidePanel();
        return;
      }
    } catch (err) {
      console.warn('Chat prompt AI call error:', err);
      const typingIdx = chatHistory[role].findIndex(m => m.isTyping);
      if (typingIdx !== -1) chatHistory[role].splice(typingIdx, 1);
    }
  }

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

  // 3. Fallback to cached admin/agent/customer policy lists if API call was not available
  const allKnownPolicies = [
    ...(window.adminPoliciesData && window.adminPoliciesData.policies ? window.adminPoliciesData.policies : []),
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
  const pCategory = p.category || (pType.includes('Auto') ? 'Vehicle' : (pType.includes('Home') ? 'Property' : (pType.includes('Commercial') ? 'Commercial' : 'General')));
  const pPrem = p.formatted_premium || (p.premium ? (typeof p.premium === 'number' ? `$${p.premium.toLocaleString()}/yr` : p.premium) : 'Not available');
  const pStart = p.start_date || p.effective || 'Not available';
  const pEnd = p.end_date || p.expiry || 'Not available';
  const pAgent = p.assigned_agent || p.agent_name || 'Unassigned';
  const pEmail = p.customer_email || '';

  const statusBadgeClass = (pStatus.toLowerCase() === 'active') ? 'badge-active' : (pStatus.toLowerCase() === 'expired' ? 'badge-risk-high' : 'badge-pending');

  const contentHtml = `
    <div class="policy-context-desc-box" style="margin-bottom: 1.25rem; padding: 0.95rem 1.15rem; background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: 8px;">
      <p style="font-size: 0.85rem; color: var(--blue-900); line-height: 1.5; margin: 0; font-weight: 500;">
        Policy record for <strong>${cName}</strong> (${pNumber}). Underwritten under the <strong>${pCategory}</strong> line.
      </p>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Policy Overview</div>
      <div class="detail-row"><span class="detail-label">Policyholder</span><span class="detail-value" style="color:var(--blue-900);font-weight:700">${cName} ${cId !== 'Not available' ? `<span style="font-size:0.75rem;color:var(--gray-500);font-weight:normal">(${cId})</span>` : ''}</span></div>
      ${pEmail ? `<div class="detail-row"><span class="detail-label">Customer Email</span><span class="detail-value">${pEmail}</span></div>` : ''}
      <div class="detail-row"><span class="detail-label">Policy Number</span><span class="detail-value" style="font-family:monospace;font-weight:600">${pNumber}</span></div>
      <div class="detail-row"><span class="detail-label">Policy Type</span><span class="detail-value">${pType}</span></div>
      <div class="detail-row"><span class="detail-label">Category</span><span class="badge badge-info">${pCategory}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="badge ${statusBadgeClass}">${pStatus}</span></div>
      <div class="detail-row"><span class="detail-label">Annual Premium</span><span class="detail-value" style="color:var(--blue-900);font-size:1rem;font-weight:700;">${pPrem}</span></div>
      <div class="detail-row"><span class="detail-label">Assigned Agent</span><span class="detail-value" style="font-weight:600;color:var(--blue-900);">${pAgent}</span></div>
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
  const stats = window.adminStatsData || {};
  const total = stats.total_users || 501;
  const customers = stats.customer_user_count || 321;
  const agents = stats.agent_count || 70;
  const underwriters = stats.underwriter_count || 45;
  const admins = stats.admin_count || 15;

  const usersList = (window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : [];

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Showing enterprise distribution across <strong>${total} registered accounts</strong> from PostgreSQL database:
        </div>
        <div class="detail-section" style="margin-bottom:1rem;">
          <div class="detail-row"><span class="detail-label">Customers</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">${customers} (${Math.round((customers / (total || 1)) * 100)}%)</span></div>
          <div class="detail-row"><span class="detail-label">Licensed Agents</span><span class="detail-value" style="font-weight:700;color:#0d9488">${agents} (${Math.round((agents / (total || 1)) * 100)}%)</span></div>
          <div class="detail-row"><span class="detail-label">Risk Underwriters</span><span class="detail-value" style="font-weight:700;color:#7c3aed">${underwriters} (${Math.round((underwriters / (total || 1)) * 100)}%)</span></div>
          <div class="detail-row"><span class="detail-label">System Administrators</span><span class="detail-value" style="font-weight:700;color:#0f172a">${admins} (${Math.round((admins / (total || 1)) * 100)}%)</span></div>
        </div>
        <div style="font-size:0.825rem;font-weight:700;color:var(--blue-900);margin-bottom:0.5rem;">Database User Accounts:</div>
        <div class="compact-list-scroll" style="max-height: 400px; display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1rem;">
          ${usersList.slice(0, 15).map(u => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openUserDetailsPanel('${u.user_id || u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.user_id || u.id} · <span class="badge" style="font-size:0.7rem;padding:2px 6px;">${u.role}</span> · ${u.email}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.user_id || u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-block btn-sm" onclick="openCreateUserPanel()">Create User</button>
          <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('admin-users'); closeSlidePanel();">Open User Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Total Registered Users (${total})`, 'Enterprise Identity Directory', contentHtml);
};

function openAdminCustomersSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-customers');
  const stats = window.adminStatsData || {};
  const totalCust = stats.total_customers || stats.customer_user_count || 321;
  const usersList = ((window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : []).filter(u => (u.role || '').toLowerCase() === 'customer');

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>${totalCust} registered customers</strong> across active property, vehicle, and commercial policies.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${usersList.slice(0, 15).map(u => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openUserDetailsPanel('${u.user_id || u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.user_id || u.id} · ${u.email}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.user_id || u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Customer';fetchAdminUsers('Customer','all','');}navigateTo('admin-users');closeSlidePanel();">View All Customers in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Total Customers (${totalCust})`, 'Registered Policyholders', contentHtml);
};

function openAdminAgentsSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-agents');
  const stats = window.adminStatsData || {};
  const totalAgents = stats.agent_count || 70;
  const usersList = ((window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : []).filter(u => (u.role || '').toLowerCase().startsWith('agent'));

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>${totalAgents} licensed insurance agents</strong> actively managing client advisory portfolios.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${usersList.slice(0, 15).map(u => `
            <div class="panel-policy-list-item" style="border-left:3px solid #0d9488;cursor:pointer;" onclick="openUserDetailsPanel('${u.user_id || u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.user_id || u.id} · ${u.email} · Agent</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.user_id || u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Agent';fetchAdminUsers('Agent','all','');}navigateTo('admin-users');closeSlidePanel();">Manage Agents in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Total Agents (${totalAgents})`, 'Licensed Advisory Brokers', contentHtml);
};

function openAdminUnderwritersSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-underwriters');
  const stats = window.adminStatsData || {};
  const totalUw = stats.underwriter_count || 45;
  const usersList = ((window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : []).filter(u => (u.role || '').toLowerCase().includes('underwriter'));

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          <strong>${totalUw} risk assessment underwriters</strong> managing application queues.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${usersList.slice(0, 15).map(u => `
            <div class="panel-policy-list-item" style="border-left:3px solid #7c3aed;cursor:pointer;" onclick="openUserDetailsPanel('${u.user_id || u.id}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${u.name}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${u.user_id || u.id} · ${u.email} · Underwriter</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openUserDetailsPanel('${u.user_id || u.id}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const f=document.getElementById('admin-user-role-filter');if(f){f.value='Underwriter';fetchAdminUsers('Underwriter','all','');}navigateTo('admin-users');closeSlidePanel();">Manage Underwriters in Directory →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Total Underwriters (${totalUw})`, 'Risk Decision Officers', contentHtml);
};

function openAdminPoliciesSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-policies');
  const stats = window.adminStatsData || {};
  const total = stats.total_policies || 791;
  const active = stats.active_policies || 357;
  const pending = stats.pending_renewals || 1;
  const policiesList = ((window.adminPoliciesData && window.adminPoliciesData.policies) ? window.adminPoliciesData.policies : []);

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Platform repository holds <strong>${total} total insurance policies</strong> from PostgreSQL:
        </div>
        <div class="detail-section" style="margin-bottom:1rem;">
          <div class="detail-row"><span class="detail-label">Active Policies</span><span class="detail-value" style="font-weight:700;color:#059669">${active} (${Math.round((active / (total || 1)) * 100)}%)</span></div>
          <div class="detail-row"><span class="detail-label">Pending Renewals</span><span class="detail-value" style="font-weight:700;color:#d97706">${pending}</span></div>
          <div class="detail-row"><span class="detail-label">Other Statuses</span><span class="detail-value" style="font-weight:700;color:var(--gray-500)">${total - active}</span></div>
        </div>
        <div style="font-size:0.825rem;font-weight:700;color:var(--blue-900);margin-bottom:0.5rem;">Sample Policies in Ledger:</div>
        <div class="compact-list-scroll" style="max-height: 400px; display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1rem;">
          ${policiesList.slice(0, 15).map(p => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${p.policy_id || p.id}', '${p.customer_name || p.customer}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${p.policy_type || p.type} · ${p.customer_name || p.customer}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${p.policy_number || p.id} · ${p.premium} · <span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}" style="font-size:0.7rem;padding:2px 6px;">${p.status}</span></div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.policy_id || p.id}', '${p.customer_name || p.customer}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div>
          <button class="btn btn-primary btn-block btn-sm" onclick="navigateTo('admin-policies'); closeSlidePanel();">Open Policy Management Ledger →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Total Policies (${total})`, 'Enterprise Policy Repository', contentHtml);
};

function openAdminActivePoliciesSlidePanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  highlightActiveCard('card-admin-active');
  const stats = window.adminStatsData || {};
  const activeCount = stats.active_policies || 357;
  const policiesList = ((window.adminPoliciesData && window.adminPoliciesData.policies) ? window.adminPoliciesData.policies : []).filter(p => p.status === 'Active');

  const contentHtml = `
        <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">
          Showing <strong>${activeCount} active in-force policies</strong> currently bound in the platform.
        </div>
        <div class="compact-list-scroll" style="max-height: 460px; display:flex;flex-direction:column;gap:0.65rem;">
          ${policiesList.slice(0, 15).map(p => `
            <div class="panel-policy-list-item" style="cursor:pointer;" onclick="openPolicyDetailsPanel('${p.policy_id || p.id}', '${p.customer_name || p.customer}')">
              <div>
                <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${p.policy_type || p.type} · ${p.customer_name || p.customer}</div>
                <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${p.policy_number || p.id} · ${p.premium}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openPolicyDetailsPanel('${p.policy_id || p.id}', '${p.customer_name || p.customer}')">Inspect →</button>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1.25rem;">
          <button class="btn btn-primary btn-block btn-sm" onclick="const s=document.getElementById('admin-policy-status-filter');if(s){s.value='Active';fetchAdminPolicies('all','Active','');}navigateTo('admin-policies');closeSlidePanel();">View All Active Policies in Ledger →</button>
        </div>
      `;
  openOrUpdateSlidePanel(`Active Policies (${activeCount})`, 'In-Force Insurance Contracts', contentHtml);
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
    let premiumByType = (dash && dash.premium_by_type && dash.premium_by_type.length > 0)
      ? dash.premium_by_type
      : null;

    if (!premiumByType || premiumByType.length === 0) {
      const rawPolicies = (window.agentPoliciesData && window.agentPoliciesData.policies)
        ? window.agentPoliciesData.policies
        : ((window.agentCustomersData && window.agentCustomersData.customers)
          ? window.agentCustomersData.customers.flatMap(c => (c.policies || []))
          : (MOCK_DB.assignedCustomers || []).flatMap(c => (c.policies || [])));

      const activePols = rawPolicies.filter(p => (p.status || '').toLowerCase() === 'active');
      const totalBookValue = activePols.reduce((sum, p) => {
        const val = typeof p.premium === 'number' ? p.premium : parseFloat(String(p.premium || '0').replace(/[^0-9.]/g, '')) || 0;
        return sum + val;
      }, 0);

      const typeMap = {};
      activePols.forEach(p => {
        const pt = p.policy_type || p.type || 'Standard Policy';
        const cat = p.category || 'General';
        const val = typeof p.premium === 'number' ? p.premium : parseFloat(String(p.premium || '0').replace(/[^0-9.]/g, '')) || 0;
        if (!typeMap[pt]) {
          typeMap[pt] = { policy_type: pt, category: cat, total_premium: 0, count: 0 };
        }
        typeMap[pt].total_premium += val;
        typeMap[pt].count += 1;
      });

      premiumByType = Object.values(typeMap).map(item => {
        const pct = totalBookValue > 0 ? Math.round((item.total_premium / totalBookValue) * 1000) / 10 : 0;
        return {
          policy_type: item.policy_type,
          category: item.category,
          total_premium: item.total_premium,
          formatted_premium: `$${item.total_premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          count: item.count,
          percentage: pct
        };
      }).sort((a, b) => b.total_premium - a.total_premium);
    }

    const accents = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'];
    chartBarsContainer.innerHTML = premiumByType.map((item, idx) => {
      const accent = accents[idx % accents.length];
      const iconSvg = getPolicyCardIcon(item.category || item.policy_type, item.policy_type);
      const pctValue = (typeof item.percentage === 'number') ? item.percentage : parseFloat(item.percentage) || 0;
      return `
        <div class="chart-row" data-tooltip="${item.policy_type}: ${item.formatted_premium} (${pctValue}%)">
          <div class="chart-row-label">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              ${iconSvg}
            </svg>
            ${item.policy_type}
          </div>
          <div class="chart-row-track">
            <div class="chart-row-fill ${accent}" style="width: ${pctValue}%;">
              <span class="chart-row-pct">${pctValue}%</span>
            </div>
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
      <td title="${cName}"><strong style="color:var(--blue-900)">${cName}</strong></td>
      <td title="${cId}"><code style="font-size:0.775rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${cId}</code></td>
      <td title="${totalPols} total policies">${totalPols}</td>
      <td title="${activePols} active policies">${activePols}</td>
      <td title="${nextRen}"><span class="badge badge-info">${nextRen}</span></td>
      <td style="text-align:right">
        <button class="btn btn-outline btn-sm table-action-btn" onclick="event.stopPropagation(); openCustomerDetailsPanel('${cId}')" title="View details for ${cName}">View Details →</button>
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

  const totalAssigned = (window.agentCustomersData && window.agentCustomersData.total != null)
    ? window.agentCustomersData.total
    : rawCustomers.length;

  // 1. Dynamic Page Heading & Badge
  const pageTitle = document.getElementById('agent-customers-page-title');
  if (pageTitle) {
    pageTitle.textContent = `My Assigned Customers (${totalAssigned})`;
  }

  const portalTag = document.getElementById('agent-customers-portal-tag');
  if (portalTag) {
    portalTag.textContent = `${totalAssigned} Assigned Clients`;
  }

  // 2. Dynamic Status Dropdown Counts
  const totalActive = rawCustomers.filter(c => (c.status || 'active').toLowerCase() === 'active').length || rawCustomers.length;
  const totalRenewals = rawCustomers.filter(c => {
    const ren = c.next_renewal || c.nextRenewal || c.renewal_date || '';
    return ren && ren !== 'N/A';
  }).length;

  const filterSelect = document.getElementById('agent-full-customer-status-filter');
  if (filterSelect) {
    const currentVal = filterSelect.value || 'all';
    filterSelect.innerHTML = `
      <option value="all">All Statuses (${totalAssigned})</option>
      <option value="active">Active Clients (${totalActive})</option>
      <option value="renewal">Upcoming Renewal (${totalRenewals})</option>
    `;
    filterSelect.value = currentVal;
  }

  // 3. Filtering logic
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
      const ren = c.next_renewal || c.nextRenewal || c.renewal_date || '';
      return ren && ren !== 'N/A';
    });
  } else if (statusFilter === 'active') {
    list = list.filter(c => (c.status || 'active').toLowerCase() === 'active');
  }

  // 4. Pagination calculations
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / agentCustomerPageSize) || 1;
  if (agentCustomerCurrentPage > totalPages) agentCustomerCurrentPage = 1;

  const pageText = document.getElementById('agent-customers-page-text');
  if (pageText) {
    pageText.textContent = `Page ${totalItems === 0 ? 0 : agentCustomerCurrentPage} of ${totalItems === 0 ? 0 : totalPages}`;
  }

  const start = totalItems === 0 ? 0 : (agentCustomerCurrentPage - 1) * agentCustomerPageSize + 1;
  const end = Math.min(agentCustomerCurrentPage * agentCustomerPageSize, totalItems);

  const pageInfo = document.getElementById('agent-customers-pagination-info');
  if (pageInfo) {
    pageInfo.innerHTML = `Showing <strong id="agent-customers-page-range">${start}-${end}</strong> of <strong id="agent-customers-page-total">${totalItems}</strong> customers`;
  } else {
    const pageRange = document.getElementById('agent-customers-page-range');
    if (pageRange) pageRange.textContent = `${start}-${end}`;
    const pageTotal = document.getElementById('agent-customers-page-total');
    if (pageTotal) pageTotal.textContent = `${totalItems}`;
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
    const cEmail = c.email || 'N/A';
    const cPhone = c.phone || 'N/A';
    const totalPols = c.total_policies != null ? c.total_policies : (c.totalPolicies || (c.policies ? c.policies.length : 0));
    const renDate = c.renewal_date || c.renewalDate || c.next_renewal || c.nextRenewal || 'N/A';
    return `
    <tr onclick="openCustomerDetailsPanel('${cId}')" title="Click to view details for ${cName}" style="cursor:pointer;">
      <td title="${cName}"><strong style="color:var(--blue-900)">${cName}</strong></td>
      <td title="${cId}"><code style="font-size:0.775rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${cId}</code></td>
      <td title="${cEmail}">${cEmail}</td>
      <td title="${cPhone}">${cPhone}</td>
      <td title="${totalPols} total policies">${totalPols}</td>
      <td title="${renDate}">${renDate}</td>
      <td style="text-align:right">
        <button class="btn btn-outline btn-sm table-action-btn" onclick="event.stopPropagation(); openCustomerDetailsPanel('${cId}')" title="View details for ${cName}">
          View Details →
        </button>
      </td>
    </tr>
  `;}).join('');
}

function handleAgentCustomerPagination(direction) {
  const q = document.getElementById('agent-full-customer-search')?.value || '';
  const statusFilter = document.getElementById('agent-full-customer-status-filter')?.value || 'all';
  const rawCustomers = (window.agentCustomersData && window.agentCustomersData.customers) ||
                       (window.agentDashboardData && window.agentDashboardData.assigned_customers) ||
                       MOCK_DB.assignedCustomers || [];
  let list = rawCustomers.filter(c => {
    const name = c.name || '';
    const id = c.customer_id || c.id || '';
    const email = c.email || '';
    const phone = c.phone || c.city || '';
    return name.toLowerCase().includes(q.toLowerCase()) ||
           id.toLowerCase().includes(q.toLowerCase()) ||
           email.toLowerCase().includes(q.toLowerCase()) ||
           phone.toLowerCase().includes(q.toLowerCase());
  });

  if (statusFilter === 'renewal') {
    list = list.filter(c => {
      const ren = c.next_renewal || c.nextRenewal || c.renewal_date || '';
      return ren && ren !== 'N/A';
    });
  } else if (statusFilter === 'active') {
    list = list.filter(c => (c.status || 'active').toLowerCase() === 'active');
  }

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

function getAgentPolicyStatusClass(status) {
  const s = (status || '').toLowerCase().trim();
  if (s === 'active' || s === 'approved') return 'status-active';
  if (s.includes('cancel') || s.includes('expired') || s.includes('reject') || s.includes('inactive')) return 'status-cancelled';
  if (s.includes('pending') || s.includes('review') || s.includes('expir')) return 'status-pending';
  return 'status-other';
}

function handleAgentPolicyFilters() {
  const searchVal = document.getElementById('agent-policy-search')?.value || '';
  const catVal = document.getElementById('agent-policy-category-filter')?.value || 'all';
  renderAgentPoliciesTable(catVal, searchVal);
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
    const cat = p.category || 'General';
    const status = p.status || 'Active';
    const statusClass = getAgentPolicyStatusClass(status);

    return `
      <tr onclick="openPolicyDetailsPanel('${polId}', '${custName}')" title="Click to inspect policy ${polId}" style="cursor:pointer;">
        <td title="${custName}${custId ? ` (${custId})` : ''}"><strong>${custName}</strong> ${custId ? `<span style="font-size:0.75rem;color:var(--gray-500)">(${custId})</span>` : ''}</td>
        <td title="${polId}"><code style="font-size:0.775rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;color:var(--blue-900);font-weight:600;">${polId}</code></td>
        <td title="${polType}">${polType}</td>
        <td title="${cat}"><span class="category-text">${cat}</span></td>
        <td title="${status}"><span class="status-text ${statusClass}">${status}</span></td>
        <td title="${prem}/yr" style="font-weight:700;color:var(--blue-900)">${prem}${prem.endsWith('/yr') ? '' : '/yr'}</td>
        <td title="${expiry}">${expiry}</td>
        <td class="action-cell" style="text-align:right">
          <button class="btn btn-outline btn-sm table-action-btn inspect-button" onclick="event.stopPropagation(); openPolicyDetailsPanel('${polId}', '${custName}')" title="Inspect ${polId}">Inspect →</button>
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

// Underwriter Status Mapping & Badge Class Helpers
function mapUnderwriterStatus(rawStatus) {
  if (!rawStatus) return 'Pending Review';
  const s = String(rawStatus).trim();
  const lower = s.toLowerCase();

  if (lower === 'approved' || lower === 'active') return 'Approved';
  if (lower === 'rejected' || lower === 'cancelled' || lower === 'declined') return 'Rejected';
  if (lower === 'info required' || lower === 'needs more information' || lower.includes('information') || lower.includes('info_required')) return 'Info Required';
  if (lower === 'pending approval') return 'Pending Approval';
  if (lower === 'pending review' || lower === 'forwarded' || lower === 'forwarded_to_underwriter' || lower === 'submitted' || lower === 'pending') {
    return 'Pending Review';
  }
  return s;
}

function getUnderwriterStatusBadgeClass(status) {
  const s = mapUnderwriterStatus(status);
  if (s === 'Approved') return 'badge-active';
  if (s === 'Rejected') return 'badge-risk-high';
  if (s === 'Info Required') return 'badge-info';
  if (s === 'Pending Approval') return 'badge-pending-approval';
  return 'badge-pending-review';
}

function renderUnderwriterQueueTable(statusFilter = 'all', riskFilter = 'all', productFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('underwriter-queue-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const queue = window.underwriterQueueData || [];

  const filtered = queue.filter(item => {
    const mappedStatus = mapUnderwriterStatus(item.status);
    const matchesStatus = statusFilter === 'all' || mappedStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesRisk = riskFilter === 'all' || (item.risk_level || item.riskLevel || '').toLowerCase() === riskFilter.toLowerCase();
    const matchesProduct = productFilter === 'all' || (item.product || item.policy_type || '').toLowerCase().includes(productFilter.toLowerCase());
    const matchesSearch = !q || (item.id || '').toLowerCase().includes(q) || (item.customer || '').toLowerCase().includes(q) || (item.product || item.policy_type || '').toLowerCase().includes(q);
    return matchesStatus && matchesRisk && matchesProduct && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No underwriting applications matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const riskLevel = item.risk_level || item.riskLevel || 'Low';
    const riskScore = item.risk_score || item.riskScore || 20;
    const riskBadgeClass = riskLevel === 'Low' ? 'badge-risk-low' : riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    const premium = item.premium || 'N/A';
    const submitted = item.submitted_date || item.submitted || 'Recent';

    return `
          <tr onclick="openUnderwriterReviewPanel('${item.id}')" title="Click to review application ${item.id}">
            <td><code style="font-size:0.825rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:3px 8px;border-radius:4px;">${item.id}</code></td>
            <td><strong style="color:var(--blue-900)">${item.customer}</strong></td>
            <td>${item.product || item.policy_type || 'Policy'}</td>
            <td><span class="badge ${riskBadgeClass}">● ${riskLevel} (${riskScore})</span></td>
            <td style="font-weight:700;color:var(--blue-900)">${premium}</td>
            <td><span style="font-size:0.825rem;color:var(--gray-600)">${submitted}</span></td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openUnderwriterReviewPanel('${item.id}')" data-tooltip="Review ${item.id} (${item.customer})">Review</button>
            </td>
          </tr>
        `;
  }).join('');
}

let uwQueueCurrentPage = 1;
const UW_PAGE_SIZE = 10;

function updateUnderwriterFilterCounts() {
  const queue = window.underwriterQueueData || [];
  const total = queue.length;
  const pendingReview = queue.filter(i => mapUnderwriterStatus(i.status) === 'Pending Review').length;
  const pendingApproval = queue.filter(i => mapUnderwriterStatus(i.status) === 'Pending Approval').length;
  const approved = queue.filter(i => mapUnderwriterStatus(i.status) === 'Approved').length;
  const infoReq = queue.filter(i => mapUnderwriterStatus(i.status) === 'Info Required').length;
  const rejected = queue.filter(i => mapUnderwriterStatus(i.status) === 'Rejected').length;

  const low = queue.filter(i => (i.risk_level || i.riskLevel || '').toLowerCase() === 'low').length;
  const med = queue.filter(i => (i.risk_level || i.riskLevel || '').toLowerCase() === 'medium').length;
  const high = queue.filter(i => (i.risk_level || i.riskLevel || '').toLowerCase() === 'high').length;

  const statusSelect = document.getElementById('uw-full-status-filter');
  if (statusSelect) {
    const cur = statusSelect.value || 'all';
    statusSelect.innerHTML = `
          <option value="all">All Statuses (${total})</option>
          <option value="Pending Review">Pending Review (${pendingReview})</option>
          <option value="Pending Approval">Pending Approval (${pendingApproval})</option>
          <option value="Approved">Approved (${approved})</option>
          <option value="Info Required">Info Required (${infoReq})</option>
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

  const productSelect = document.getElementById('uw-full-product-filter');
  if (productSelect) {
    const cur = productSelect.value || 'all';
    const prodCounts = {};
    queue.forEach(i => {
      const p = i.product || i.policy_type || 'General';
      prodCounts[p] = (prodCounts[p] || 0) + 1;
    });
    let optionsHtml = `<option value="all">Product: All (${total})</option>`;
    Object.keys(prodCounts).sort().forEach(p => {
      optionsHtml += `<option value="${p}">${p} (${prodCounts[p]})</option>`;
    });
    productSelect.innerHTML = optionsHtml;
    productSelect.value = cur;
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
  const queue = window.underwriterQueueData || [];

  const filtered = queue.filter(item => {
    const mappedStatus = mapUnderwriterStatus(item.status);
    const matchesStatus = statusVal === 'all' || mappedStatus.toLowerCase() === statusVal.toLowerCase();
    const matchesRisk = riskVal === 'all' || (item.risk_level || item.riskLevel || '').toLowerCase() === riskVal.toLowerCase();
    const matchesProduct = prodVal === 'all' || (item.product || item.policy_type || '').toLowerCase().includes(prodVal.toLowerCase());
    const matchesSearch = !q || (item.id || '').toLowerCase().includes(q) || (item.customer || '').toLowerCase().includes(q) || (item.product || item.policy_type || '').toLowerCase().includes(q);
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2.5rem;">No underwriting applications matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = pagedItems.map(item => {
    const riskLevel = item.risk_level || item.riskLevel || 'Low';
    const riskScore = item.risk_score || item.riskScore || 20;
    const riskBadgeClass = riskLevel === 'Low' ? 'badge-risk-low' : riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    const premium = item.premium || 'N/A';
    const submitted = item.submitted_date || item.submitted || 'Recent';

    return `
          <tr onclick="openUnderwriterReviewPanel('${item.id}')" title="Click to review application ${item.id}">
            <td><code style="font-size:0.825rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:3px 8px;border-radius:4px;">${item.id}</code></td>
            <td><strong style="color:var(--blue-900)">${item.customer}</strong></td>
            <td>${item.product || item.policy_type || 'Policy'}</td>
            <td><span class="badge ${riskBadgeClass}">● ${riskLevel} (${riskScore})</span></td>
            <td style="font-weight:700;color:var(--blue-900)">${premium}</td>
            <td><span style="font-size:0.825rem;color:var(--gray-600)">${submitted}</span></td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openUnderwriterReviewPanel('${item.id}')" data-tooltip="Review ${item.id} (${item.customer})">Review</button>
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
  const queue = window.underwriterQueueData || [];
  const filtered = queue.filter(item => {
    const mappedStatus = mapUnderwriterStatus(item.status);
    const matchesStatus = statusVal === 'all' || mappedStatus.toLowerCase() === statusVal.toLowerCase();
    const matchesRisk = riskVal === 'all' || (item.risk_level || item.riskLevel || '').toLowerCase() === riskVal.toLowerCase();
    const matchesProduct = prodVal === 'all' || (item.product || item.policy_type || '').toLowerCase().includes(prodVal.toLowerCase());
    const matchesSearch = !q || (item.id || '').toLowerCase().includes(q) || (item.customer || '').toLowerCase().includes(q) || (item.product || item.policy_type || '').toLowerCase().includes(q);
    return matchesStatus && matchesRisk && matchesProduct && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / UW_PAGE_SIZE) || 1;
  const newPage = uwQueueCurrentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    uwQueueCurrentPage = newPage;
    renderUnderwriterFullQueue(statusVal, riskVal, prodVal, searchVal, true);
  }
};

// Open Underwriting Review Slide-Out Panel (Real Database Backed)
function openUnderwriterReviewPanel(appId) {
  const queue = window.underwriterQueueData || [];
  const app = queue.find(item => item.id === appId || item.policy_id === appId);
  if (!app) return;

  const riskLevel = app.risk_level || app.riskLevel || 'Low';
  const riskScore = app.risk_score || app.riskScore || 20;
  const riskPinPosition = riskLevel === 'Low' ? '15%' : riskLevel === 'Medium' ? '50%' : '85%';
  const riskBadgeClass = riskLevel === 'Low' ? 'badge-risk-low' : riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
  const status = mapUnderwriterStatus(app.status);
  const statusBadgeClass = getUnderwriterStatusBadgeClass(status);
  const coverages = app.coverages && app.coverages.length > 0 ? app.coverages : ['Comprehensive Property & Peril Coverage', 'Standard Liability Terms'];
  const exclusions = app.exclusions && app.exclusions.length > 0 ? app.exclusions : ['Intentional damages', 'Unregistered perils'];
  const documents = app.documents && app.documents.length > 0 ? app.documents : ['Policy Schedule', 'Coverage Certificate'];

  const contentHtml = `
        <!-- Application Meta Overview -->
        <div class="detail-section">
          <div class="detail-section-title">Application Details</div>
          <div class="detail-row"><span class="detail-label">Application / Policy ID</span><span class="detail-value" style="font-family:monospace;font-weight:700;color:var(--blue-900)">${app.id}</span></div>
          <div class="detail-row"><span class="detail-label">Applicant Customer</span><span class="detail-value" style="font-weight:700;color:var(--blue-900)">${app.customer}</span></div>
          <div class="detail-row"><span class="detail-label">Customer Email</span><span class="detail-value">${app.customer_email || 'Verified Insured'}</span></div>
          <div class="detail-row"><span class="detail-label">Product Type</span><span class="detail-value">${app.product || app.policy_type}</span></div>
          <div class="detail-row"><span class="detail-label">Calculated Premium</span><span class="detail-value" style="color:var(--blue-700);font-weight:700;font-size:1rem">${app.premium}</span></div>
          <div class="detail-row"><span class="detail-label">Effective Date</span><span class="detail-value">${app.effective_date || app.end_date || 'Standard Term'}</span></div>
          <div class="detail-row"><span class="detail-label">Days to Expiry / Renewal</span><span class="detail-value" style="font-weight:700;">${app.days_remaining != null ? app.days_remaining + ' days' : 'Current'}</span></div>
          <div class="detail-row">
            <span class="detail-label">Current Case Status</span>
            <span class="badge ${statusBadgeClass}" id="panel-status-badge">${status}</span>
          </div>
        </div>

        <!-- RISK ASSESSMENT & VISUAL GAUGE (Muted & Accessible) -->
        <div class="detail-section">
          <div class="detail-section-title">Risk Assessment (${riskLevel} Risk · Score ${riskScore}/100)</div>
          
          <div class="risk-gauge-box">
            <div class="risk-gauge-labels">
              <span class="risk-label-low">LOW (0–25)</span>
              <span class="risk-label-medium">MEDIUM (26–75)</span>
              <span class="risk-label-high">HIGH (76–100)</span>
            </div>
            <div class="risk-gauge-track">
              <div class="risk-gauge-pin" style="left: ${riskPinPosition};" data-tooltip="Score: ${riskScore}/100 (${riskLevel} Risk)"></div>
            </div>
          </div>

          <div style="font-size:0.825rem;font-weight:700;color:var(--gray-700);margin-bottom:0.5rem;">Identified Risk Profile:</div>
          <ul class="bullet-list coverage-list">
            <li>Calculated underwriting premium: <strong>${app.premium}</strong></li>
            <li>Policy risk categorization: <span class="badge ${riskBadgeClass}">● ${riskLevel} Risk</span></li>
            <li>Automated actuarial tier: <strong>Score ${riskScore}/100</strong></li>
          </ul>
        </div>

        <!-- COVERAGE / POLICY DETAILS -->
        <div class="detail-section">
          <div class="detail-section-title">Coverage Schedule</div>
          <ul class="bullet-list coverage-list">
            ${coverages.map(c => `<li>${c}</li>`).join('')}
          </ul>

          <div style="font-size:0.825rem;font-weight:700;color:var(--gray-700);margin-top:0.85rem;margin-bottom:0.5rem;">Policy Exclusions:</div>
          <ul class="bullet-list exclusion-list">
            ${exclusions.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>

        <!-- DOCUMENTS -->
        <div class="detail-section">
          <div class="detail-section-title">Supporting Documents (${documents.length})</div>
          ${documents.map(doc => `
            <div class="doc-item-row" style="background:#FAF6F2;border:1px solid #EADBCE;border-radius:8px;margin-bottom:6px;padding:0.65rem 0.85rem;">
              <div class="doc-item-title" style="color:#3B241D;font-weight:600;font-size:0.85rem;">
                <svg width="16" height="16" fill="none" stroke="#7A4A3A" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                ${doc}
              </div>
              <button class="btn btn-outline btn-sm" style="font-size:0.775rem;padding:3px 10px;" onclick="showToast('Viewing verified document: ${doc}')">View</button>
            </div>
          `).join('')}
        </div>

        <!-- UNDERWRITING DECISION ACTIONS (Compact Layout) -->
        <div class="detail-section" style="border-bottom:none;background:#FAF6F2;padding:1.15rem;border-radius:12px;border:1px solid #EADBCE;">
          <div class="detail-section-title" style="margin-bottom:0.4rem;">Underwriting Decision</div>
          <p style="font-size:0.8rem;color:#7A4A3A;margin-bottom:0.85rem;">Select an underwriting action or launch the full workspace:</p>
          
          <button class="btn btn-block btn-uw-workspace" id="btn-uw-workspace" onclick="navigateTo('underwriter-review'); selectPolicyForReview('${app.id}'); closeSlidePanel();" style="margin-bottom:8px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Open in Policy Review Workspace →
          </button>
          
          <div class="uw-decision-btn-row">
            <button class="btn btn-uw-approve btn-sm" id="btn-uw-approve" onclick="makeUnderwritingDecision('${app.id}', 'Approved')" style="font-weight:700;padding:0.5rem 0.6rem;font-size:0.825rem;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Approve
            </button>
            <button class="btn btn-uw-info btn-sm" id="btn-uw-info" onclick="promptUnderwritingDecision('Info Required', '${app.id}')" style="font-weight:700;padding:0.5rem 0.6rem;font-size:0.825rem;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              More Info
            </button>
            <button class="btn btn-uw-reject btn-sm" id="btn-uw-reject" onclick="promptUnderwritingDecision('Rejected', '${app.id}')" style="font-weight:700;padding:0.5rem 0.6rem;font-size:0.825rem;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject
            </button>
          </div>
        </div>
      `;

  openOrUpdateSlidePanel(`Underwriting Review: ${app.id}`, `Applicant: ${app.customer} · ${app.product || app.policy_type}`, contentHtml);
}

// Execute Underwriting Decision (Persists to Backend & Database with Proper Loading State)
async function makeUnderwritingDecision(appId, decision, customNotes = '') {
  const token = getAuthToken();
  if (!token) {
    showToast('Authentication token required for underwriter action.');
    return;
  }

  const displayDecision = mapUnderwriterStatus(decision);
  const backendDecision = (decision === 'Info Required' || decision === 'Needs More Information') ? 'Needs More Information' : decision;

  // Find panel action buttons
  const approveBtn = document.getElementById('btn-uw-approve');
  const infoBtn = document.getElementById('btn-uw-info');
  const rejectBtn = document.getElementById('btn-uw-reject');
  const pageApproveBtn = document.getElementById('btn-page-uw-approve');
  const pageInfoBtn = document.getElementById('btn-page-uw-info');
  const pageRejectBtn = document.getElementById('btn-page-uw-reject');
  const workspaceBtn = document.getElementById('btn-uw-workspace');
  const dockApproveBtn = document.getElementById('btn-dock-approve');
  const dockInfoBtn = document.getElementById('btn-dock-info');
  const dockRejectBtn = document.getElementById('btn-dock-reject');
  const allButtons = [approveBtn, infoBtn, rejectBtn, pageApproveBtn, pageInfoBtn, pageRejectBtn, workspaceBtn, dockApproveBtn, dockInfoBtn, dockRejectBtn].filter(Boolean);

  // Identify active button
  let activeBtn = null;
  if (displayDecision === 'Approved') activeBtn = pageApproveBtn || approveBtn || dockApproveBtn;
  else if (displayDecision === 'Info Required') activeBtn = pageInfoBtn || infoBtn || dockInfoBtn;
  else if (displayDecision === 'Rejected') activeBtn = pageRejectBtn || rejectBtn || dockRejectBtn;

  const originalHtml = activeBtn ? activeBtn.innerHTML : '';

  try {
    // Disable all buttons to prevent double-submit
    allButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('btn-uw-disabled');
    });

    if (activeBtn) {
      activeBtn.innerHTML = `
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block; margin-right: 6px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        Processing...
      `;
    }

    const notes = customNotes || (
      displayDecision === 'Approved'
        ? `Policy ${appId} approved and bound under standard actuarial guidelines.`
        : displayDecision === 'Info Required'
          ? `Additional loss runs and inspection documentation requested for ${appId}.`
          : `Application ${appId} rejected due to risk profile exceeding threshold.`
    );

    const response = await fetch(`${UNDERWRITER_SERVICE_URL}/underwriter/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        item_id: appId,
        decision: backendDecision,
        notes: notes
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const errorMsg = err.detail || 'Failed to record underwriting decision';
      showToast(`Decision error: ${errorMsg}`, 'error');
      // Re-enable buttons so user can retry
      allButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('btn-uw-disabled');
      });
      if (activeBtn) activeBtn.innerHTML = originalHtml;
      return;
    }

    const result = await response.json();

    // Update local item status in queue data
    const queue = window.underwriterQueueData || [];
    const item = queue.find(i => i.id === appId || i.policy_id === appId);
    if (item) item.status = displayDecision;

    // Update badge in slide panel
    const panelBadge = document.getElementById('panel-status-badge');
    if (panelBadge) {
      panelBadge.textContent = displayDecision;
      panelBadge.className = `badge ${getUnderwriterStatusBadgeClass(displayDecision)}`;
    }

    // Update badge in table row
    const statusBadge = document.getElementById(`status-badge-${appId}`);
    if (statusBadge) {
      statusBadge.textContent = displayDecision;
      statusBadge.className = `badge ${getUnderwriterStatusBadgeClass(displayDecision)}`;
    }

    // Update active review workspace if open
    if (window.activeUnderwriterReviewPolicy && (window.activeUnderwriterReviewPolicy.id === appId || window.activeUnderwriterReviewPolicy.policy_id === appId)) {
      window.activeUnderwriterReviewPolicy.status = displayDecision;
      const statusBadgeElem = document.getElementById('uw-rev-status-badge');
      if (statusBadgeElem) {
        statusBadgeElem.textContent = displayDecision;
        statusBadgeElem.className = `badge ${getUnderwriterStatusBadgeClass(displayDecision)}`;
      }
      const tabStatusElem = document.getElementById('uw-tab-policy-status');
      if (tabStatusElem) {
        tabStatusElem.innerHTML = `<span class="badge ${getUnderwriterStatusBadgeClass(displayDecision)}">${displayDecision}</span>`;
      }
    }

    const toastMessage = displayDecision === 'Approved'
      ? `Policy ${appId} approved and bound successfully.`
      : displayDecision === 'Info Required'
        ? `Additional information requested for application ${appId}.`
        : `Policy ${appId} rejected successfully.`;

    showToast(toastMessage, displayDecision === 'Rejected' ? 'error' : displayDecision === 'Info Required' ? 'warning' : 'success');

    // Refresh live stats, queue, and notifications from real backend
    await Promise.allSettled([
      fetchUnderwriterStats(),
      fetchUnderwriterQueue(),
      fetchNotifications(),
      (typeof fetchUnderwriterPolicies === 'function' ? fetchUnderwriterPolicies() : Promise.resolve())
    ]);

    // Restore buttons
    allButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('btn-uw-disabled');
    });
    if (activeBtn) activeBtn.innerHTML = originalHtml;

  } catch (err) {
    console.error('Error submitting underwriting decision:', err);
    showToast('Unable to connect to the service. Please try again.', 'error');
    allButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('btn-uw-disabled');
    });
    if (activeBtn) activeBtn.innerHTML = originalHtml;
  }
}

// ==========================================================================
// UNDERWRITER MODAL & DRAWER CONTROLLERS
// ==========================================================================
function openUwModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
  }
}

function closeUwModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  }
}

function closeUwModalOnBackdrop(e, modalId) {
  if (e.target === e.currentTarget) {
    closeUwModal(modalId);
  }
}

// Global Escape listener for Underwriter modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.uw-modal-backdrop.open').forEach(m => {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
  }
});

// PART 1 REQ 1: Interactive Risk Tier Modal
function openRiskTierModal(tier) {
  const modal = document.getElementById('uw-risk-rule-modal');
  const title = document.getElementById('uw-rule-modal-title');
  const sub = document.getElementById('uw-rule-modal-sub');
  const body = document.getElementById('uw-rule-modal-body');
  if (!modal || !body) return;

  if (tier === 'low') {
    title.innerHTML = `<span style="color:var(--green)">●</span> Low Risk Tier Underwriting Rules`;
    sub.textContent = 'Preferred Rate Classification · Automated STP Binding Eligible';
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:0.5rem;">
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Score Range</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--green);">0 – 25 / 100</div>
        </div>
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Approval Authority</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--blue-900);">$1.0M – $2.5M Limit</div>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Risk Tier Meaning</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          Represents accounts with pristine loss history, excellent structural maintenance, high credit classification, and no adverse territorial exposures. Auto-eligible for standard baseline rates and preferred discounts.
        </p>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Eligibility Conditions</h4>
        <ul class="bullet-list coverage-list" style="font-size:0.825rem;">
          <li>Zero paid or open claims within the preceding 60 months (5-year clean CLUE record).</li>
          <li>Primary applicant Credit Tier 1 (FICO score &gt; 720).</li>
          <li>Structure age &lt; 15 years with modern 200A electrical breakers and copper/PEX plumbing.</li>
          <li>Standard deductible baseline ($500 – $1,000).</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Required Document Verification</h4>
        <ul class="bullet-list coverage-list" style="font-size:0.825rem;">
          <li>Completed ACORD 125 / 126 application form.</li>
          <li>Prior carrier Declarations Page verifying continuous coverage.</li>
          <li>Credit score verification record.</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Authorized Underwriting Actions & Typical Outcomes</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          <strong>Action:</strong> Automated or one-click approval on standard admitted form.<br>
          <strong>Outcome:</strong> Immediate policy binding at preferred tier discount (-10% to -15%).
        </p>
      </div>

      <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:0.75rem;font-size:0.8rem;color:#065F46;">
        <strong>Example Scenario:</strong> 8-year-old single-family residential property, FICO 780, zero prior claims, centrally monitored burglar and fire alarm systems.
      </div>
    `;
  } else if (tier === 'medium') {
    title.innerHTML = `<span style="color:var(--amber)">●</span> Medium Risk Tier Underwriting Rules`;
    sub.textContent = 'Standard Rate with Conditions · Endorsement Riders Required';
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:0.5rem;">
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Score Range</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--amber);">26 – 65 / 100</div>
        </div>
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Approval Authority</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--blue-900);">$2.5M – $5.0M Limit</div>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Risk Tier Meaning</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          Standard risk classification where minor loss history, older building systems, or moderate geographic exposure require deductible endorsements, inspection verifications, or protective safeguard riders.
        </p>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Eligibility Conditions</h4>
        <ul class="bullet-list coverage-list" style="font-size:0.825rem;">
          <li>Maximum 1 minor non-weather loss in 36 months (&lt; $5,000 indemnity).</li>
          <li>Structure age 15–35 years with certified 4-point inspection report.</li>
          <li>Mandatory increased deductible ($1,500 – $2,500).</li>
          <li>Standard earthquake and flood exclusion endorsements apply.</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Required Document Verification</h4>
        <ul class="bullet-list coverage-list" style="font-size:0.825rem;">
          <li>3-Year Verified Loss Run report from prior insurance carrier.</li>
          <li>Roof condition & plumbing inspection audit certificate.</li>
          <li>Signed protective safeguard endorsement rider acknowledgment.</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Authorized Underwriting Actions & Typical Outcomes</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          <strong>Action:</strong> Approve with Conditions / Attach Deductible Riders.<br>
          <strong>Outcome:</strong> Conditional binding with $1,500+ deductible endorsement and standard surcharge (+5% to +15%).
        </p>
      </div>

      <div style="background:#FFF7ED;border:1px solid #FFEDD5;border-radius:10px;padding:0.75rem;font-size:0.8rem;color:#9A3412;">
        <strong>Example Scenario:</strong> 28-year-old commercial retail building with 1 weather loss ($4,200) 30 months ago, architectural shingle roof replaced 4 years ago, monitored burglar alarm.
      </div>
    `;
  } else {
    title.innerHTML = `<span style="color:var(--red)">●</span> High Risk Tier Underwriting Rules`;
    sub.textContent = 'Substandard / Surplus Lines · Mandatory Supervisory Referral';
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:0.5rem;">
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Score Range</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--red);">66 – 100 / 100</div>
        </div>
        <div style="background:#FAF6F2;padding:0.75rem;border-radius:10px;border:1px solid #EADBCE;">
          <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:600;">Approval Authority</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--blue-900);">Chief Underwriting Officer (CUO)</div>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Risk Tier Meaning</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          Substandard exposure tier with elevated loss frequency, severe environmental hazard exposure (FEMA Flood Zone A/V, coastal wind tier, wildfire interface), or limits exceeding standard treaty capacity.
        </p>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Eligibility Conditions</h4>
        <ul class="bullet-list exclusion-list" style="font-size:0.825rem;">
          <li>2+ paid or open claims in the past 24 months.</li>
          <li>Severe coastal storm, high wildfire, or special flood hazard zone.</li>
          <li>Commercial liability limit &gt; $2,000,000 or aging structure &gt;45 years.</li>
          <li>Mandatory supervisory sign-off before binder issuance.</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Required Document Verification</h4>
        <ul class="bullet-list exclusion-list" style="font-size:0.825rem;">
          <li>5-Year Official Loss Runs with complete adjuster narrative notes.</li>
          <li>Structural engineering & electrical wiring audit report.</li>
          <li>FEMA Flood Zone Elevation Certificate and Wildfire Clearance.</li>
          <li>Audited business financial statements.</li>
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">Authorized Underwriting Actions & Typical Outcomes</h4>
        <p style="font-size:0.825rem;color:var(--gray-700);line-height:1.45;margin:0;">
          <strong>Action:</strong> Refer to Senior Underwriter / Decline / Require Substantial Deductible ($5,000+).<br>
          <strong>Outcome:</strong> Supervisory sign-off on non-standard surplus lines form, or formal decline notice.
        </p>
      </div>

      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:0.75rem;font-size:0.8rem;color:#991B1B;">
        <strong>Example Scenario:</strong> Coastal commercial warehouse situated in flood zone with 2 storm water claims in 18 months ($68,000 aggregate loss) and $3.5M replacement limit.
      </div>
    `;
  }

  openUwModal('uw-risk-rule-modal');
}

// PART 1 REQ 2: Interactive Workflow Steps Modal
function openWorkflowStepModal(stepNum) {
  const modal = document.getElementById('uw-risk-rule-modal');
  const title = document.getElementById('uw-rule-modal-title');
  const sub = document.getElementById('uw-rule-modal-sub');
  const body = document.getElementById('uw-rule-modal-body');
  if (!modal || !body) return;

  const steps = [
    {
      num: 1,
      name: 'Submission Ingestion',
      purpose: 'Ingest broker submission, ACORD forms, applicant identity, and prior loss run history into the Underwriting Queue.',
      checked: 'Application completeness, broker licensing, applicant tax ID / SSN, prior carrier declarations, active queue deduplication.',
      input: 'ACORD 125/126 forms, prior policy declarations, applicant MVR reports.',
      output: 'Normalized submission record in Underwriting Queue with indexed metadata.',
      outcomes: 'Ingestion validated (Proceed to Risk Scoring) OR Rejected for Incomplete Intake Data.',
      role: 'Intake Underwriting Assistant / Automated OCR Ingestion Service',
      next: 'Step 2: Risk Scoring'
    },
    {
      num: 2,
      name: 'Risk Scoring',
      purpose: 'Compute automated quantitative actuarial risk score (0–100) using property age, claims frequency, and territory metrics.',
      checked: '5-year CLUE loss frequency, FEMA flood hazard mapping, dwelling/structure age, credit classification.',
      input: 'Property geospatial coordinates, CLUE loss database, territory loss cost indices.',
      output: 'Actuarial Risk Score (0–100) and automated exposure rating.',
      outcomes: 'Low Risk Tier (0–25), Medium Risk Tier (26–65), High Risk Tier (66–100).',
      role: 'Automated Actuarial Scoring Engine',
      next: 'Step 3: Risk Classification'
    },
    {
      num: 3,
      name: 'Risk Classification',
      purpose: 'Assign standardized exposure tier, baseline deductible retentions, and pricing multipliers.',
      checked: 'Product line underwriting manuals, territorial rate factors, class code eligibility.',
      input: 'Computed Risk Score, ISO class code, construction type (ISO 1–6).',
      output: 'Tier assignment and calculated preliminary gross premium.',
      outcomes: 'Preferred Tier, Standard Tier with Conditions, Non-Standard / Surplus Lines.',
      role: 'Underwriting Decision Specialist',
      next: 'Step 4: Guideline Check'
    },
    {
      num: 4,
      name: 'Guideline Check',
      purpose: 'Audit submission against binding authority caps, mandatory inspection requirements, and exclusion endorsements.',
      checked: 'Binding authority limits ($1.0M–$5.0M), building inspection age thresholds, coastal distance rules, exclusion riders.',
      input: 'Certified 4-point inspection report, roof condition audit, flood hazard elevation certificate.',
      output: 'Guideline compliance validation checklist.',
      outcomes: 'Fully Compliant, Compliance with Endorsement Riders, Supervisory Referral Triggered.',
      role: 'Certified CPCU Underwriter',
      next: 'Step 5: Final Underwriting Decision'
    },
    {
      num: 5,
      name: 'Final Underwriting Decision',
      purpose: 'Authorize binding approval, attach conditional riders, issue information request, or execute formal decline.',
      checked: 'Final loss limit authorization, binder documentation, signed customer acceptance.',
      input: 'Completed underwriting audit checklist, signed proposal, payment binding receipt.',
      output: 'Policy Bound & Active status, or formal Notice of Information Request.',
      outcomes: 'Approved & Bound, Approved with Conditions, Needs More Information, Rejected.',
      role: 'Senior Underwriter / Supervising Director',
      next: 'Policy Issuance & Customer Delivery'
    }
  ];

  const s = steps[stepNum - 1] || steps[0];

  title.textContent = `Workflow Step ${s.num}: ${s.name}`;
  sub.textContent = `Standard Underwriting Operating Procedure · Responsible: ${s.role}`;
  body.innerHTML = `
    <div style="background:#FAF6F2;padding:0.85rem;border-radius:10px;border:1px solid #EADBCE;margin-bottom:0.5rem;">
      <div style="font-size:0.75rem;color:var(--gray-600);text-transform:uppercase;font-weight:700;">Operational Purpose</div>
      <div style="font-size:0.9rem;font-weight:600;color:var(--blue-900);margin-top:2px;">${s.purpose}</div>
    </div>

    <div class="detail-section" style="border:none;padding:0;">
      <div class="detail-row"><span class="detail-label">What is Checked</span><span class="detail-value" style="font-weight:500;">${s.checked}</span></div>
      <div class="detail-row"><span class="detail-label">Required Input Data</span><span class="detail-value">${s.input}</span></div>
      <div class="detail-row"><span class="detail-label">Expected Output</span><span class="detail-value" style="font-weight:600;color:var(--green);">${s.output}</span></div>
      <div class="detail-row"><span class="detail-label">Possible Outcomes</span><span class="detail-value">${s.outcomes}</span></div>
      <div class="detail-row"><span class="detail-label">Responsible Role</span><span class="detail-value" style="font-weight:700;">${s.role}</span></div>
      <div class="detail-row"><span class="detail-label">Next Workflow Phase</span><span class="detail-value" style="font-weight:700;color:var(--blue-700);">${s.next}</span></div>
    </div>
  `;

  openUwModal('uw-risk-rule-modal');
}

// Interactive Consideration Pillars Modal
function openConsiderationModal(key) {
  const modal = document.getElementById('uw-risk-rule-modal');
  const title = document.getElementById('uw-rule-modal-title');
  const sub = document.getElementById('uw-rule-modal-sub');
  const body = document.getElementById('uw-rule-modal-body');
  if (!modal || !body) return;

  const data = {
    property: {
      title: 'Property & Building Condition Actuarial Standards',
      sub: 'Roof Age, Plumbing, Wiring & Fire Protection Standards',
      desc: 'Roof condition accounts for 40% of residential property loss frequency. Structures over 15 years require certified inspection verifying 200A electrical panel, absence of aluminum/knob-and-tube wiring, and operational plumbing with no prior leak history. Distance to nearest municipal fire hydrant must be &lt; 1,000 feet.'
    },
    claims: {
      title: 'Claims Frequency & Loss Run Verification',
      sub: '5-Year CLUE Database & Loss History Standards',
      desc: 'Frequency of past claims is the single highest predictor of future loss severity. Underwriters must inspect full 5-year carrier loss runs. 1 weather claim is permissible; 2+ non-weather water or liability claims trigger mandatory deductible increases ($2,500+) or supervisory referral.'
    },
    location: {
      title: 'Location & Natural Hazards Geospatial Evaluation',
      sub: 'FEMA Flood Tiers, Wildfire Interface & Coastal Wind Zones',
      desc: 'Properties in FEMA Special Flood Hazard Areas (Zones A, AE, V) strictly exclude flood from standard HO-3/BOP forms and require proof of separate NFIP or private flood policy. Coastal properties within 2,500 feet of tidal water require 2% to 5% hurricane named-storm deductibles.'
    },
    financial: {
      title: 'Financial Valuation & Underwriting Authority Limits',
      sub: 'Total Insured Value (TIV) & Binding Caps',
      desc: 'Binding authority specifies the maximum policy limit an underwriter may bind autonomously. Staff underwriters hold $1.0M authority; Senior CPCU underwriters hold $5.0M authority. Risks exceeding $5.0M TIV require Chief Underwriting Officer (CUO) and facultative reinsurance sign-off.'
    }
  };

  const item = data[key] || data.property;
  title.textContent = item.title;
  sub.textContent = item.sub;
  body.innerHTML = `
    <div style="background:#FAF6F2;padding:1rem;border-radius:12px;border:1px solid #EADBCE;line-height:1.55;font-size:0.875rem;color:var(--gray-800);">
      ${item.desc}
    </div>
  `;

  openUwModal('uw-risk-rule-modal');
}

// PART 1 REQ 3: Required Documents Checklist Filter & Interactive Toggle
const UW_RISK_DOCUMENTS = [
  {
    id: 'doc-acord',
    name: 'Application Form',
    technicalName: 'ACORD 125 / 126 Commercial & Personal Application',
    tiers: ['low', 'medium', 'high'],
    tierLabel: 'All Risk Levels',
    status: 'Complete',
    desc: 'Completed and signed application form with applicant details and coverage history.'
  },
  {
    id: 'doc-prior',
    name: 'Previous Insurance Proof',
    technicalName: 'Proof of Prior Continuous Coverage (Declarations Page)',
    tiers: ['low', 'medium', 'high'],
    tierLabel: 'All Risk Levels',
    status: 'Complete',
    desc: 'Verifies previous continuous insurance coverage without coverage lapses.'
  },
  {
    id: 'doc-credit',
    name: 'Identity Verification',
    technicalName: 'Credit Tier & Identity Verification Statement',
    tiers: ['low', 'medium', 'high'],
    tierLabel: 'All Risk Levels',
    status: 'Complete',
    desc: 'Applicant identity check and credit tier confirmation.'
  },
  {
    id: 'doc-lossruns',
    name: 'Previous Claims History',
    technicalName: '3-Year Verified Prior Carrier Loss Runs',
    tiers: ['medium', 'high'],
    tierLabel: 'Medium & High Risk',
    status: 'Needs Review',
    desc: 'Official 3-year record of previous insurance claims and payouts.'
  },
  {
    id: 'doc-inspection',
    name: 'Property Inspection Report',
    technicalName: 'Certified 4-Point Roof & Plumbing Inspection',
    tiers: ['medium', 'high'],
    tierLabel: 'Medium & High Risk',
    status: 'Needs Review',
    desc: 'Inspection report covering roof, plumbing, electrical, and heating systems.'
  },
  {
    id: 'doc-flood',
    name: 'Flood Zone Certificate',
    technicalName: 'FEMA Flood Zone Elevation Certificate (Zone A/V)',
    tiers: ['high'],
    tierLabel: 'High Risk Only',
    status: 'Missing',
    desc: 'Elevation certificate confirming flood hazard boundaries and building elevation.'
  },
  {
    id: 'doc-financials',
    name: 'Financial Documents',
    technicalName: 'Audited Business Balance Sheet & P&L Statement',
    tiers: ['high'],
    tierLabel: 'High Risk Only',
    status: 'Missing',
    desc: 'Financial records and business balance sheet to confirm financial stability.'
  }
];

// ==========================================================================
// INTERACTIVE RISK ASSESSMENT GUIDELINES CONTROLLER
// ==========================================================================

let currentActiveRiskTier = null;

function toggleRiskTierCard(tier) {
  if (currentActiveRiskTier === tier) {
    currentActiveRiskTier = null;
    document.querySelectorAll('.interactive-risk-card').forEach(card => card.classList.remove('selected-card'));
    return;
  }
  currentActiveRiskTier = tier;
  document.querySelectorAll('.interactive-risk-card').forEach(card => card.classList.remove('selected-card'));
  const activeCard = document.getElementById(`risk-card-${tier}`);
  if (activeCard) activeCard.classList.add('selected-card');
}

// 2. Interactive Guide Step Workflow
const UW_GUIDE_STEP_DETAILS = {
  1: {
    num: 1,
    title: 'Step 1: Check Documents',
    subtitle: 'Verify document completeness and validate customer information',
    points: [
      'Verify the application form is complete.',
      'Check identity and supporting documents.',
      'Confirm property or asset details.',
      'Identify missing or inconsistent information.'
    ]
  },
  2: {
    num: 2,
    title: 'Step 2: Review Risk Factors',
    subtitle: 'Examine claims history, property location, and coverage limits',
    points: [
      'Review the applicant’s claims history.',
      'Check property, location, and asset details.',
      'Review coverage amount and deductible.',
      'Identify unusual or high-risk factors.'
    ]
  },
  3: {
    num: 3,
    title: 'Step 3: Understand Risk Score',
    subtitle: 'Analyze calculated exposure score and score driving factors',
    points: [
      'Check the overall calculated risk score.',
      'Identify the factors increasing the score.',
      'Compare the score with the risk category.',
      'Confirm whether additional review is required.'
    ]
  },
  4: {
    num: 4,
    title: 'Step 4: Decide Next Step',
    subtitle: 'Execute authoritative decision or forward for senior sign-off',
    points: [
      'Approve when all requirements are satisfied.',
      'Request information if details are missing.',
      'Refer the case for senior review when required.',
      'Reject only when policy requirements are not met.'
    ]
  }
};

let currentActiveGuideStep = null;

function toggleGuideStepDetail(stepNum) {
  const panel = document.getElementById('uw-guide-step-detail-panel');
  if (!panel) return;

  if (currentActiveGuideStep === stepNum) {
    closeGuideStepDetail();
    return;
  }

  currentActiveGuideStep = stepNum;
  const data = UW_GUIDE_STEP_DETAILS[stepNum];
  if (!data) return;

  // Highlight selected step
  document.querySelectorAll('.interactive-step-card').forEach(card => card.classList.remove('selected-step'));
  const activeCard = document.getElementById(`guide-step-card-${stepNum}`);
  if (activeCard) activeCard.classList.add('selected-step');

  // Render detail panel
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="border-left: 4px solid #7A4A3A; padding-left: 1rem; position: relative;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.6rem; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="uw-guide-flow-num" style="width:24px; height:24px; font-size:0.75rem;">${data.num}</div>
          <div>
            <h4 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--text-main);">${data.title}</h4>
            <div style="font-size:0.75rem; color:#7A4A3A;">${data.subtitle}</div>
          </div>
        </div>
        <button type="button" onclick="closeGuideStepDetail()" style="background:none; border:none; color:#7A4A3A; font-size:1.1rem; cursor:pointer; padding:2px 6px; line-height:1;" title="Collapse details">✕</button>
      </div>
      <div>
        <div style="font-size: 0.775rem; font-weight: 600; color: #7A4A3A; margin-bottom: 6px;">Step Verification Checklist:</div>
        <div class="uw-step-checklist-grid" style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px;">
          ${data.points.map(p => `
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8125rem; color:var(--text-main);">
              <svg width="15" height="15" fill="none" stroke="#2F9E78" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${p}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function closeGuideStepDetail() {
  currentActiveGuideStep = null;
  const panel = document.getElementById('uw-guide-step-detail-panel');
  if (panel) panel.style.display = 'none';
  document.querySelectorAll('.interactive-step-card').forEach(card => card.classList.remove('selected-step'));
}

// 3. Interactive Decision Support
const UW_DECISION_SUPPORT_DETAILS = {
  ready: {
    title: 'Ready for Approval',
    subtitle: 'Standard underwriting criteria met. Documents and risk review complete.',
    badge: 'Approval',
    badgeClass: 'badge-active',
    borderColor: 'var(--green)',
    points: [
      'Documents are complete.',
      'Risk factors have been reviewed.',
      'No major concerns remain.'
    ]
  },
  info: {
    title: 'More Information Required',
    subtitle: 'Additional documentation or clarification needed from applicant/agent.',
    badge: 'Info Request',
    badgeClass: 'badge-pending',
    borderColor: 'var(--amber)',
    points: [
      'Documents are missing or incomplete.',
      'Some information needs clarification.',
      'Additional evidence is required.'
    ]
  },
  senior: {
    title: 'Senior Review Required',
    subtitle: 'Application risk parameters exceed standard threshold or require special sign-off.',
    badge: 'Senior Review',
    badgeClass: 'badge-risk-high',
    borderColor: 'var(--red)',
    points: [
      'Risk score is high.',
      'The case contains complex risk factors.',
      'Special approval may be required.'
    ]
  }
};

let currentActiveDecision = null;

function toggleDecisionSupportDetail(decisionKey) {
  const panel = document.getElementById('uw-decision-support-detail-panel');
  if (!panel) return;

  if (currentActiveDecision === decisionKey) {
    closeDecisionSupportDetail();
    return;
  }

  currentActiveDecision = decisionKey;
  const data = UW_DECISION_SUPPORT_DETAILS[decisionKey];
  if (!data) return;

  // Highlight selected card
  document.querySelectorAll('.interactive-decision-card').forEach(card => card.classList.remove('selected-decision'));
  const activeCard = document.getElementById(`decision-card-${decisionKey}`);
  if (activeCard) activeCard.classList.add('selected-decision');

  // Render detail panel
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="border-left: 4px solid ${data.borderColor}; padding-left: 1rem; position: relative;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.6rem; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div>
            <h4 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--text-main);">${data.title}</h4>
            <div style="font-size:0.75rem; color:#7A4A3A;">${data.subtitle}</div>
          </div>
          <span class="badge ${data.badgeClass}" style="font-size:0.75rem; padding: 2px 8px;">${data.badge}</span>
        </div>
        <button type="button" onclick="closeDecisionSupportDetail()" style="background:none; border:none; color:#7A4A3A; font-size:1.1rem; cursor:pointer; padding:2px 6px; line-height:1;" title="Collapse details">✕</button>
      </div>
      <div>
        <div style="font-size: 0.775rem; font-weight: 600; color: #7A4A3A; margin-bottom: 6px;">Checklist & Evaluation Criteria:</div>
        <ul class="uw-guideline-bullets" style="margin: 0; padding-left: 1.25rem; font-size: 0.8125rem; line-height: 1.6; color: var(--text-main);">
          ${data.points.map(p => `<li style="margin-bottom: 3px;">${p}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function closeDecisionSupportDetail() {
  currentActiveDecision = null;
  const panel = document.getElementById('uw-decision-support-detail-panel');
  if (panel) panel.style.display = 'none';
  document.querySelectorAll('.interactive-decision-card').forEach(card => card.classList.remove('selected-decision'));
}

function initRiskAssessmentGuidelines() {
  // Reset any open subpanels on page entry
  closeGuideStepDetail();
  closeDecisionSupportDetail();
  document.querySelectorAll('.interactive-risk-card').forEach(card => card.classList.remove('selected-card'));
}

// ==========================================================================
// PART 2: POLICY REVIEW WORKSPACE CONTROLLERS
// ==========================================================================
window.activeUnderwriterReviewPolicy = null;

function initUnderwriterReviewPage(requestedId = null) {
  const queue = window.underwriterQueueData || [];

  if (queue.length === 0) {
    fetchUnderwriterQueue().then(() => {
      populateReviewPolicySelector(requestedId);
    });
  } else {
    populateReviewPolicySelector(requestedId);
  }
}

function populateReviewPolicySelector(requestedId = null) {
  const queue = window.underwriterQueueData || [];
  const selectElem = document.getElementById('uw-review-policy-select');
  const countPill = document.getElementById('uw-review-queue-count-pill');
  if (countPill) countPill.textContent = `${queue.length} Cases in Queue`;

  if (!selectElem) return;

  if (queue.length === 0) {
    selectElem.innerHTML = '<option value="">No applications in review queue</option>';
    return;
  }

  selectElem.innerHTML = queue.map(item => {
    return `<option value="${item.id}">${item.id} · ${item.customer} (${item.product || item.policy_type}) — ${item.status || 'Pending'}</option>`;
  }).join('');

  const targetId = requestedId || (queue[0] ? queue[0].id : null);
  if (targetId) {
    selectElem.value = targetId;
    selectPolicyForReview(targetId);
  }
}

function selectPolicyForReview(appId) {
  const queue = window.underwriterQueueData || [];
  const app = queue.find(item => item.id === appId) || queue[0];
  if (!app) return;

  window.activeUnderwriterReviewPolicy = app;

  const riskLevel = app.risk_level || 'Low';
  const riskScore = app.risk_score || 20;
  const status = app.status || 'Pending Review';
  const statusBadgeClass = status === 'Approved' ? 'badge-active' : status === 'Needs More Information' ? 'badge-info' : status === 'Rejected' ? 'badge-risk-high' : 'badge-pending';
  const isCommercial = (app.product && app.product.includes('Commercial')) || (app.policy_type && app.policy_type.includes('Commercial'));

  // Summary Banner
  const titleElem = document.getElementById('uw-rev-title');
  if (titleElem) titleElem.textContent = `${app.policy_number || app.id} · ${app.product || app.policy_type || 'Commercial Property'}`;
  const statusElem = document.getElementById('uw-rev-status-badge');
  if (statusElem) {
    statusElem.textContent = status;
    statusElem.className = `badge ${statusBadgeClass}`;
  }
  const custSubElem = document.getElementById('uw-rev-customer-sub');
  if (custSubElem) custSubElem.textContent = `Applicant: ${app.customer || 'Michael Brown'} · Queue ID: ${app.id} · Line: ${app.product || app.policy_type || 'Standard Property'}`;

  const numElem = document.getElementById('uw-rev-policy-num');
  if (numElem) numElem.textContent = app.policy_number || app.id;
  const nameElem = document.getElementById('uw-rev-insured-name');
  if (nameElem) nameElem.textContent = app.customer || 'Michael Brown';
  const premElem = document.getElementById('uw-rev-premium-val');
  if (premElem) premElem.textContent = app.premium || '$4,200.00/yr';
  const limitElem = document.getElementById('uw-rev-limit-val');
  if (limitElem) limitElem.textContent = isCommercial ? '$5,000,000 Policy Limit' : '$1,000,000 Policy Limit';

  const riskBadgeElem = document.getElementById('uw-rev-risk-badge');
  if (riskBadgeElem) {
    const rClass = riskLevel === 'Low' ? 'badge-risk-low' : riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    riskBadgeElem.innerHTML = `<span class="badge ${rClass}">Score: ${riskScore}/100 · ${riskLevel} Risk</span>`;
  }

  const effElem = document.getElementById('uw-rev-effective-date');
  if (effElem) effElem.textContent = app.effective_date || '2026-04-01';
  const expElem = document.getElementById('uw-rev-expiry-date');
  if (expElem) expElem.textContent = app.end_date || app.expiry_date || '2027-04-01';
  const daysElem = document.getElementById('uw-rev-days-val');
  if (daysElem) daysElem.textContent = app.days_remaining != null ? `${app.days_remaining} days remaining` : '14 days remaining';

  // Tab 1: Policy & Insured (Clean equal-height cards)
  const tabPolId = document.getElementById('uw-tab-pol-id');
  if (tabPolId) tabPolId.textContent = app.policy_number || app.id;
  const tabPType = document.getElementById('uw-tab-product-type');
  if (tabPType) tabPType.textContent = app.product || app.policy_type || 'Commercial Property';
  const tabStatus = document.getElementById('uw-tab-policy-status');
  if (tabStatus) tabStatus.innerHTML = `<span class="badge ${statusBadgeClass}">${status}</span>`;
  const tabEff = document.getElementById('uw-tab-eff-date');
  if (tabEff) tabEff.textContent = app.effective_date || '2026-04-01';
  const tabExp = document.getElementById('uw-tab-exp-date');
  if (tabExp) tabExp.textContent = app.end_date || app.expiry_date || '2027-04-01';
  const tabPrem = document.getElementById('uw-tab-premium-val');
  if (tabPrem) tabPrem.textContent = app.premium || '$4,200.00';

  const tabCustName = document.getElementById('uw-tab-cust-name');
  if (tabCustName) tabCustName.textContent = app.customer || 'Michael Brown';
  const tabCustEmail = document.getElementById('uw-tab-cust-email');
  if (tabCustEmail) tabCustEmail.textContent = app.customer_email || `${(app.customer || 'michael.brown').toLowerCase().replace(/[^a-z]/g, '')}@example.com`;
  const tabCustId = document.getElementById('uw-tab-cust-id');
  if (tabCustId) tabCustId.textContent = app.customer_id || 'CUST-0024';
  const tabAddress = document.getElementById('uw-tab-property-address');
  if (tabAddress) tabAddress.textContent = app.address || app.property_address || (isCommercial ? '104 Corporate Plaza, Suite 400, Chicago, IL 60606' : '742 Evergreen Terrace, Springfield, IL 62704');
  const tabAgent = document.getElementById('uw-tab-servicing-agent');
  if (tabAgent) tabAgent.textContent = app.agent || app.servicing_agent || 'Alex Rivera (Agent Unit 4)';
  const tabRiskClass = document.getElementById('uw-tab-risk-class');
  if (tabRiskClass) {
    const rClass = riskLevel === 'Low' ? 'badge-risk-low' : riskLevel === 'Medium' ? 'badge-risk-medium' : 'badge-risk-high';
    tabRiskClass.innerHTML = `<span class="badge ${rClass}">${riskLevel} Risk Tier (Score: ${riskScore})</span>`;
  }

  // Tab 2: Coverage & Limits Schedule (Equal-sized cards)
  const covContainer = document.getElementById('uw-tab-coverages-container');
  if (covContainer) {
    const rawCoverages = app.coverages && app.coverages.length > 0 ? app.coverages : ['Building & Core Structure', 'Business Personal Property', 'General Liability Protection', 'Loss of Income / Business Interruption'];
    const rawExclusions = app.exclusions && app.exclusions.length > 0 ? app.exclusions : ['Earthquake & Seismic Rider', 'Flood Zone Endorsement'];

    const coverageCards = [
      ...rawCoverages.map(c => ({
        name: c,
        limit: isCommercial ? '$2,500,000' : '$750,000',
        deductible: '$2,500',
        premium: 'Included in Base',
        status: 'Included',
        desc: 'Standard comprehensive policy protection against covered perils.'
      })),
      ...rawExclusions.map(e => ({
        name: e,
        limit: isCommercial ? '$1,000,000' : '$250,000',
        deductible: '$5,000',
        premium: 'Endorsement Rider',
        status: 'Excluded',
        desc: 'Specialized endorsement required prior to binding authorization.'
      }))
    ];

    covContainer.innerHTML = coverageCards.map(item => `
      <div class="uw-coverage-card">
        <div>
          <div class="uw-coverage-card-header">
            <div class="uw-coverage-card-title">${item.name}</div>
            <span class="badge ${item.status === 'Included' ? 'badge-active' : 'badge-pending'}" style="font-size:0.75rem;">${item.status}</span>
          </div>
          <div class="uw-coverage-card-desc">${item.desc}</div>
        </div>
        <div class="uw-coverage-metrics-row">
          <div class="uw-coverage-metric-item">
            <span class="uw-coverage-metric-label">Coverage Limit</span>
            <span class="uw-coverage-metric-val">${item.limit}</span>
          </div>
          <div class="uw-coverage-metric-item">
            <span class="uw-coverage-metric-label">Deductible</span>
            <span class="uw-coverage-metric-val">${item.deductible}</span>
          </div>
          <div class="uw-coverage-metric-item">
            <span class="uw-coverage-metric-label">Premium</span>
            <span class="uw-coverage-metric-val" style="color:var(--blue-700);">${item.premium}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Tab 3: Risk Factors (Clean, simple format with no duplicate side content)
  const factorsContainer = document.getElementById('uw-tab-risk-factors-container');
  if (factorsContainer) {
    const factors = [
      {
        name: 'Building & Structural Integrity',
        desc: 'Physical structure constructed within modern building code standards with certified roof inspection.',
        finding: 'Roof Age < 12 yrs (Class 4 Hail Rated)',
        impact: 'Low Impact',
        impactClass: 'uw-impact-low',
        status: '<span class="badge badge-active">Verified</span>'
      },
      {
        name: 'Prior Loss & Claims Record',
        desc: 'Carrier loss runs report 5-year claims history across relevant property & liability lines.',
        finding: riskLevel === 'High' ? '1 Open Fire Loss Claim' : '0 Prior Claims in 60 Mo',
        impact: riskLevel === 'High' ? 'High Impact' : 'Low Impact',
        impactClass: riskLevel === 'High' ? 'uw-impact-high' : 'uw-impact-low',
        status: riskLevel === 'High' ? '<span class="badge badge-risk-high">Review Required</span>' : '<span class="badge badge-active">Verified</span>'
      },
      {
        name: 'Territory Hazard & Flood Exposure',
        desc: 'Geospatial catastrophe mapping and FEMA flood zone boundary classification.',
        finding: 'Zone X (Minimal Flood Risk)',
        impact: 'Low Impact',
        impactClass: 'uw-impact-low',
        status: '<span class="badge badge-active">Within Guidelines</span>'
      },
      {
        name: '4-Point Inspection & Electrical Safety',
        desc: 'Physical 4-point audit of electrical 200A service, plumbing lines, HVAC, and fire suppression.',
        finding: 'Copper Plumbing / Updated Breakers',
        impact: 'Moderate Impact',
        impactClass: 'uw-impact-med',
        status: '<span class="badge badge-pending">Inspection Verified</span>'
      },
      {
        name: 'Binding Authority Threshold',
        desc: 'Total insured value and liability exposure evaluated against CPCU underwriter authorization limit.',
        finding: `$${isCommercial ? '5.0M' : '1.0M'} Limit / Standard Authority`,
        impact: 'Low Impact',
        impactClass: 'uw-impact-low',
        status: '<span class="badge badge-active">Within Guidelines</span>'
      }
    ];

    factorsContainer.innerHTML = factors.map(f => `
      <div class="uw-risk-factor-row">
        <div class="uw-factor-left">
          <div class="uw-factor-title">${f.name}</div>
          <div class="uw-factor-desc">${f.desc}</div>
        </div>
        <div class="uw-factor-meta-pills">
          <div class="uw-factor-finding">${f.finding}</div>
          <div class="uw-factor-impact ${f.impactClass}">${f.impact}</div>
          <div>${f.status}</div>
        </div>
      </div>
    `).join('');
  }

  // Tab 4: Documents Checklist Table (Proper responsive columns, no clipping)
  const docsTbody = document.getElementById('uw-tab-docs-tbody');
  if (docsTbody) {
    const rawDocs = app.documents && app.documents.length > 0 ? app.documents : ['Application Form', 'Previous Insurance Proof', 'Property Inspection Report', '5-Year Loss Runs Statement', 'Identity & Business Verification'];
    const docTypes = ['Application Schedule', 'Continuous Coverage', 'Physical Audit', 'Financial Loss History', 'Compliance & KYC'];

    docsTbody.innerHTML = rawDocs.map((doc, idx) => {
      const docType = docTypes[idx % docTypes.length];
      return `
        <tr>
          <td><strong style="color:var(--blue-900);font-size:0.875rem;">${doc}</strong></td>
          <td><span style="font-size:0.8rem;color:#7A4A3A;">${docType}</span></td>
          <td><span class="badge badge-active">Submitted</span></td>
          <td>
            <select class="uw-doc-select" onchange="updateDocChecklistStatus(${idx}, this.value)">
              <option value="Reviewed" selected>Reviewed & Verified</option>
              <option value="Pending">Pending Review</option>
              <option value="Requires Attention">Requires Attention</option>
            </select>
          </td>
          <td style="text-align:right;">
            <span class="badge badge-active" id="doc-status-cell-${idx}">Reviewed & Verified</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Reset selected state on decision cards
  document.querySelectorAll('.uw-decision-card').forEach(c => c.classList.remove('selected-decision'));
}

function switchReviewTab(tabName, btnElem = null) {
  if (btnElem) {
    document.querySelectorAll('.uw-review-tab-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }

  document.querySelectorAll('.uw-tab-panel').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById(`uw-panel-${tabName}`);
  if (targetPanel) targetPanel.classList.add('active');
}

function updateDocChecklistStatus(idx, status) {
  const cell = document.getElementById(`doc-status-cell-${idx}`);
  if (cell) {
    cell.textContent = status;
    cell.className = status === 'Reviewed' || status === 'Reviewed & Verified' ? 'badge badge-active' : status === 'Requires Attention' || status === 'Missing' ? 'badge badge-risk-high' : 'badge badge-pending';
  }
}

function selectAndPromptDecision(decisionType, cardElem) {
  document.querySelectorAll('.uw-decision-card').forEach(c => c.classList.remove('selected-decision'));
  if (cardElem) {
    cardElem.classList.add('selected-decision');
  }
  promptUnderwritingDecision(decisionType);
}

// Decision Confirmation Modal Controller
let pendingDecisionType = 'Approved';

function promptUnderwritingDecision(decisionType, specificAppId = null) {
  let app = null;
  if (specificAppId) {
    const queue = window.underwriterQueueData || [];
    app = queue.find(i => i.id === specificAppId || i.policy_id === specificAppId);
    if (app) {
      window.activeUnderwriterReviewPolicy = app;
    }
  }
  if (!app) {
    app = window.activeUnderwriterReviewPolicy;
  }
  if (!app) {
    showToast('Please select an active policy from the queue first.');
    return;
  }

  pendingDecisionType = decisionType;

  const modal = document.getElementById('uw-decision-modal');
  const title = document.getElementById('uw-modal-decision-title');
  const sub = document.getElementById('uw-modal-decision-sub');
  const polId = document.getElementById('uw-modal-pol-id');
  const insured = document.getElementById('uw-modal-insured-name');
  const actionBadge = document.getElementById('uw-modal-action-badge');
  const notes = document.getElementById('uw-modal-notes');
  if (!modal) return;

  const displayDecisionName = decisionType === 'Approved' ? 'Approve & Bind' : (decisionType === 'Info Required' || decisionType === 'Needs More Information') ? 'Request More Information' : 'Reject';
  title.textContent = `Confirm Decision: ${displayDecisionName}`;
  sub.textContent = `Binding authorization for ${app.policy_number || app.id}`;
  if (polId) polId.textContent = app.policy_number || app.id;
  if (insured) insured.textContent = app.customer || 'Michael Brown';

  if (actionBadge) {
    actionBadge.textContent = displayDecisionName;
    actionBadge.className = decisionType === 'Approved' ? 'badge badge-active' : (decisionType === 'Info Required' || decisionType === 'Needs More Information') ? 'badge badge-info' : 'badge badge-risk-high';
  }

  if (notes) {
    notes.value = decisionType === 'Approved'
      ? `Underwriting review verified: application meets standard guidelines. Policy approved and bound for annual term.`
      : (decisionType === 'Info Required' || decisionType === 'Needs More Information')
        ? `Please provide updated carrier loss runs and certified electrical system audit before final determination.`
        : `Application declined: risk score and hazard assessment exceed allowable binding guidelines for this coverage line.`;
  }

  openUwModal('uw-decision-modal');
}

async function confirmUnderwritingDecision() {
  const app = window.activeUnderwriterReviewPolicy;
  if (!app) return;

  const notes = document.getElementById('uw-modal-notes')?.value || '';
  closeUwModal('uw-decision-modal');

  // Map user decision to backend supported decision: 'Approved' | 'Rejected' | 'Info Required'
  let backendDecision = 'Approved';
  if (pendingDecisionType === 'Rejected') backendDecision = 'Rejected';
  else if (pendingDecisionType === 'Info Required' || pendingDecisionType === 'Needs More Information') backendDecision = 'Info Required';
  else backendDecision = 'Approved';

  await makeUnderwritingDecision(app.id, backendDecision, notes);
}

/**
 * RENDERERS FOR ADMIN PORTAL (USER GOVERNANCE, RBAC, POLICIES, AUDIT)
 */
function renderAdminDashboardUsersTable() {
  const tbody = document.getElementById('admin-dashboard-users-tbody');
  if (!tbody) return;

  const users = (window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : [];

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No system users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.slice(0, 10).map(u => {
    const role = u.role || 'Customer';
    const roleBadge = role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : role.startsWith('Underwriter') ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : role.startsWith('Agent') ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
    const status = u.status || 'Active';
    const statusBadge = status === 'Active' ? 'badge-active' : 'badge-pending';
    const userId = u.user_id || u.id;
    return `
          <tr onclick="openUserDetailsPanel('${userId}')" title="Click to view details for ${u.name}" data-tooltip="View full identity and privilege profile for ${u.name}">
            <td title="${u.name}"><strong style="color:var(--blue-900)">${u.name}</strong></td>
            <td title="${userId}"><code style="font-size:0.775rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;">${userId}</code></td>
            <td class="td-email" title="${u.email}" data-tooltip="${u.email}">${u.email}</td>
            <td><span class="badge" style="${roleBadge}">${role}</span></td>
            <td><span class="badge ${statusBadge}">${status}</span></td>
            <td title="${u.created_at || u.created || 'Recorded'}">${u.created_at || u.created || 'Recorded'}</td>
            <td style="text-align:right">
              <button class="btn btn-outline btn-sm table-action-btn" onclick="event.stopPropagation(); openUserDetailsPanel('${userId}')" data-tooltip="Inspect ${u.name}'s account">View →</button>
            </td>
          </tr>
        `;
  }).join('');
}

function renderAdminUsersTable(roleFilter = 'all', statusFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('admin-full-users-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const users = (window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : [];

  const filtered = users.filter(u => {
    const role = (u.role || '').toLowerCase();
    const matchesRole = roleFilter === 'all' || role.includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();
    const userId = (u.user_id || u.id || '').toLowerCase();
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const matchesSearch = !q || name.includes(q) || userId.includes(q) || email.includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No system users matched your search/filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(u => {
    const role = u.role || 'Customer';
    const roleBadge = role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : role.startsWith('Underwriter') ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : role.startsWith('Agent') ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
    const status = u.status || 'Active';
    const statusBadge = status === 'Active' ? 'badge-active' : 'badge-pending';
    const userId = u.user_id || u.id;
    return `
          <tr onclick="openUserDetailsPanel('${userId}')" title="Click to view details for ${u.name}" data-tooltip="View full identity and privilege profile for ${u.name}">
            <td title="${u.name}"><strong style="color:var(--blue-900)">${u.name}</strong></td>
            <td title="${userId}"><code style="font-size:0.775rem;background:var(--gray-100);padding:2px 6px;border-radius:4px;">${userId}</code></td>
            <td class="td-email" title="${u.email}" data-tooltip="${u.email}">${u.email}</td>
            <td><span class="badge" style="${roleBadge}">${role}</span></td>
            <td><span class="badge ${statusBadge}">${status}</span></td>
            <td title="${u.created_at || u.created || 'Recorded'}">${u.created_at || u.created || 'Recorded'}</td>
            <td style="text-align:right">
              <button class="btn btn-primary btn-sm table-action-btn" onclick="event.stopPropagation(); openUserDetailsPanel('${userId}')" data-tooltip="Inspect ${u.name}'s account">View →</button>
            </td>
          </tr>
        `;
  }).join('');
}

// Open User Details Right-Side Slide Panel (Real Database Data)
function openUserDetailsPanel(userId) {
  const users = (window.adminUsersData && window.adminUsersData.users) ? window.adminUsersData.users : [];
  const u = users.find(item => (item.user_id === userId || item.id === userId));
  if (!u) return;

  const rawRole = u.role || 'Customer';
  let normRole = 'Customer';
  if (rawRole.toLowerCase().includes('agent')) normRole = 'Agent';
  else if (rawRole.toLowerCase().includes('underwriter')) normRole = 'Underwriter';
  else if (rawRole.toLowerCase().includes('admin')) normRole = 'Admin';
  else if (rawRole.toLowerCase().includes('customer')) normRole = 'Customer';
  else normRole = rawRole;

  const roleBadge = normRole === 'Admin' ? 'background:#3B241D;color:#ffffff;' : normRole === 'Underwriter' ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : normRole === 'Agent' ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;';
  const idStr = u.user_id || u.id;
  const status = u.status || 'Active';
  const created = u.created_at || u.created || 'Database Record';

  const assignedDesc = normRole === 'Customer'
    ? `Retail Policyholder · Associated with ${u.policies_count || 0} active policies`
    : normRole === 'Agent'
      ? 'Licensed Insurance Broker · Portfolio Advisor'
      : normRole === 'Underwriter'
        ? 'Risk Decision Authority · Queue Reviewer'
        : 'Enterprise Platform Superuser';

  const contentHtml = `
        <div class="detail-section">
          <div class="detail-section-title">User Account Details</div>
          <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value" style="font-weight:700;color:var(--blue-900);font-size:1rem;">${u.name}</span></div>
          <div class="detail-row"><span class="detail-label">User ID</span><span class="detail-value" style="font-family:monospace;font-weight:700;">${idStr}</span></div>
          <div class="detail-row"><span class="detail-label">Email Address</span><span class="detail-value">${u.email}</span></div>
          <div class="detail-row"><span class="detail-label">Assigned Role</span><span class="badge" style="${roleBadge}">${normRole}</span></div>
          <div class="detail-row"><span class="detail-label">Status</span><span class="badge ${status === 'Active' ? 'badge-active' : 'badge-pending'}">${status}</span></div>
          <div class="detail-row"><span class="detail-label">Created Date</span><span class="detail-value">${created}</span></div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Assigned Scope & Privileges</div>
          <div class="card" style="padding:1rem;background:var(--gray-50);border:1px solid var(--gray-200);">
            <div style="font-size:0.875rem;font-weight:700;color:var(--blue-900);margin-bottom:4px;">
              ${normRole} Authority Scope
            </div>
            <div style="font-size:0.85rem;color:var(--gray-700);">${assignedDesc}</div>
          </div>
        </div>

        <div style="display:flex;gap:8px;align-items:center;width:100%;">
          <button class="btn btn-outline btn-sm" style="flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0.45rem 0.5rem;font-size:0.775rem;" id="btn-admin-panel-pwd-reset" title="Send Password Reset to ${normRole}" onclick="handleAdminPasswordReset('${idStr}', '${u.email}', '${normRole}', this)">Send Password Reset to ${normRole}</button>
          <button class="btn btn-primary btn-sm" style="flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0.45rem 0.5rem;font-size:0.775rem;" id="btn-admin-panel-confirm-rbac" title="Confirm as ${normRole}" onclick="handleAdminConfirmAccess('${idStr}', '${normRole}', this)">Confirm as ${normRole}</button>
        </div>
      `;

  openOrUpdateSlidePanel(`User: ${u.name}`, `ID: ${idStr} · ${normRole} Account`, contentHtml);
}

async function handleAdminPasswordReset(userId, email, role, btnElem) {
  if (!btnElem) return;
  if (btnElem.disabled) return;

  const originalHtml = btnElem.innerHTML;
  btnElem.disabled = true;
  btnElem.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:4px;"></span> Sending...`;

  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Authentication token required for admin action.');
      btnElem.disabled = false;
      btnElem.innerHTML = originalHtml;
      return;
    }

    const response = await fetch(`${ADMIN_SERVICE_URL}/admin/users/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: userId,
        email: email || '',
        role: role
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showToast(`Error: ${err.detail || 'Failed to dispatch password reset.'}`);
      btnElem.disabled = false;
      btnElem.innerHTML = originalHtml;
      return;
    }

    const data = await response.json();
    showToast(data.message || `Password reset link sent to the ${role} successfully.`);

    // Update button text and keep disabled to prevent duplicate actions
    btnElem.innerHTML = `Password Reset Sent to ${role}`;
    btnElem.disabled = true;
    btnElem.style.opacity = '0.85';
    btnElem.style.cursor = 'default';

    if (typeof fetchAdminAudit === 'function') fetchAdminAudit();
  } catch (err) {
    console.error('Password reset error:', err);
    showToast(`Error connecting to Admin service: ${err.message}`);
    btnElem.disabled = false;
    btnElem.innerHTML = originalHtml;
  }
}

async function handleAdminConfirmAccess(userId, role, btnElem) {
  if (!btnElem) return;
  if (btnElem.disabled) return;

  const originalHtml = btnElem.innerHTML;
  btnElem.disabled = true;
  btnElem.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:4px;"></span> Confirming...`;

  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Authentication token required for admin action.');
      btnElem.disabled = false;
      btnElem.innerHTML = originalHtml;
      return;
    }

    const response = await fetch(`${ADMIN_SERVICE_URL}/admin/users/confirm-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: userId,
        role: role
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showToast(`Error: ${err.detail || 'Failed to confirm access.'}`);
      btnElem.disabled = false;
      btnElem.innerHTML = originalHtml;
      return;
    }

    const data = await response.json();
    showToast(data.message || `${role} access confirmed successfully.`);

    // Update button text and keep disabled to prevent duplicate submissions
    btnElem.innerHTML = `${role} Confirmed`;
    btnElem.disabled = true;
    btnElem.style.opacity = '0.85';
    btnElem.style.cursor = 'default';

    if (typeof fetchAdminAudit === 'function') fetchAdminAudit();
  } catch (err) {
    console.error('Confirm access error:', err);
    showToast(`Error connecting to Admin service: ${err.message}`);
    btnElem.disabled = false;
    btnElem.innerHTML = originalHtml;
  }
}


// Open Create User Slide-Out Panel
function openCreateUserPanel(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const contentHtml = `
        <div class="detail-section" style="border-bottom:none;">
          <p style="font-size:0.85rem;color:var(--gray-600);margin-bottom:1.25rem;">
            Fill in the information below to provision a new user account with PostgreSQL persistence.
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
              <label for="new-user-phone" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Phone Number</label>
              <input type="tel" id="new-user-phone" class="form-control" placeholder="(555) 345-6789" style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
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
              <label for="new-user-status" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Account Status</label>
              <select id="new-user-status" class="form-control" style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;background:var(--white);">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label for="new-user-dept" style="display:block;font-weight:600;font-size:0.85rem;color:var(--gray-700);margin-bottom:4px;">Address / Location Notes</label>
              <input type="text" id="new-user-dept" class="form-control" placeholder="124 Grand Avenue, Suite 400, Chicago, IL 60611" style="width:100%;padding:10px 12px;border:1px solid var(--gray-300);border-radius:8px;font-size:0.875rem;">
            </div>

            <div style="display:flex;gap:10px;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--gray-200);">
              <button type="button" class="btn btn-outline btn-block" onclick="closeSlidePanel()">Cancel</button>
              <button type="submit" class="btn btn-primary btn-block" id="btn-admin-submit-user">Create User</button>
            </div>
          </form>
        </div>
      `;

  openOrUpdateSlidePanel('Create New User', 'Provision New Database User Account', contentHtml);
};

// Handle Create User Submission (Persists to Backend & Database)
async function handleCreateUserSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('new-user-name');
  const emailInput = document.getElementById('new-user-email');
  const phoneInput = document.getElementById('new-user-phone');
  const roleInput = document.getElementById('new-user-role');
  const deptInput = document.getElementById('new-user-dept');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const role = roleInput ? roleInput.value : 'Customer';
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

  try {
    const token = getAuthToken();
    if (!token) {
      showToast('Admin authentication token required.');
      return;
    }

    const response = await fetch(`${ADMIN_SERVICE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        email: email,
        role: role,
        mobile: phone,
        address: dept || '124 Grand Avenue, Suite 400, Chicago, IL 60611',
        password: 'password123'
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showToast(`Creation failed: ${err.detail || 'Could not create user'}`);
      return;
    }

    const result = await response.json();
    showToast(`User ${name} (${result.user_id}) created in PostgreSQL database!`);

    // Refresh admin data
    await fetchAdminUsers();
    await fetchAdminStats();
    await fetchAdminAudit();

    // Re-render and open user panel
    openUserDetailsPanel(result.user_id);

  } catch (err) {
    console.error('Error creating user via Admin API:', err);
    showToast('Network error while creating user in database.');
  }
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

// Render Policy Management Table (Real Database Data)
function renderAdminPoliciesTable(typeFilter = 'all', statusFilter = 'all', searchTerm = '') {
  const tbody = document.getElementById('admin-policies-tbody');
  if (!tbody) return;
  const q = searchTerm.toLowerCase().trim();

  const policies = (window.adminPoliciesData && window.adminPoliciesData.policies) ? window.adminPoliciesData.policies : [];

  const filtered = policies.filter(p => {
    const polType = (p.policy_type || p.type || '').toLowerCase();
    const matchesType = typeFilter === 'all' || polType.includes(typeFilter.toLowerCase());
    const polStatus = (p.status || '').toLowerCase();
    const matchesStatus = statusFilter === 'all' || polStatus === statusFilter.toLowerCase();
    const polNum = (p.policy_number || p.id || '').toLowerCase();
    const custName = (p.customer_name || p.customer || '').toLowerCase();
    const custEmail = (p.customer_email || '').toLowerCase();
    const agentName = (p.assigned_agent || p.agent_name || '').toLowerCase();
    const matchesSearch = !q || polNum.includes(q) || custName.includes(q) || custEmail.includes(q) || polType.includes(q) || agentName.includes(q);
    return matchesType && matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-500);padding:2rem;">No system policies matched your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const polId = p.policy_id || p.id || '';
    const polNum = p.policy_number || p.id || '';
    const custName = p.customer_name || p.customer || 'Unknown';
    const polType = p.policy_type || p.type || 'Standard Policy';
    const status = p.status || 'Active';
    const premium = p.premium || 'N/A';
    const assignedAgent = p.assigned_agent || p.agent_name || 'Unassigned';
    const statusBadge = status.toLowerCase() === 'active' ? 'badge-active' : (status.toLowerCase() === 'expired' ? 'badge-risk-high' : 'badge-pending');

    return `
        <tr onclick="openPolicyDetailsPanel('${polId}', '${custName}')" title="Click to view details for policy ${polNum}" style="cursor:pointer;">
          <td><code style="font-size:0.8125rem;font-weight:700;background:var(--blue-50);color:var(--blue-800);padding:2px 6px;border-radius:4px;white-space:nowrap;" title="${polNum}">${polNum}</code></td>
          <td><strong style="color:var(--blue-900)" title="${custName}">${custName}</strong></td>
          <td><span title="${polType}">${polType}</span></td>
          <td><span class="badge ${statusBadge}">${status}</span></td>
          <td style="font-weight:700;color:var(--blue-900);white-space:nowrap;">${premium}</td>
          <td><span style="font-size:0.8125rem;color:var(--gray-700);font-weight:500;" title="${assignedAgent}">${assignedAgent}</span></td>
          <td style="text-align:right">
            <button class="btn btn-outline btn-sm table-action-btn" onclick="event.stopPropagation(); openPolicyDetailsPanel('${polId}', '${custName}')" title="View policy ${polNum}">View →</button>
          </td>
        </tr>
      `;
  }).join('');
}

// Render Audit Logs (Real Database Activity)
function renderAdminAuditLogs() {
  const container = document.getElementById('admin-audit-log-container');
  if (!container) return;

  const logs = (window.adminAuditData && window.adminAuditData.audit_logs)
    ? window.adminAuditData.audit_logs
    : ((window.workflowNotificationsData && window.workflowNotificationsData.length > 0) ? window.workflowNotificationsData : []);

  if (logs.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--gray-500);">No system audit activity recorded yet.</div>`;
    return;
  }

  container.innerHTML = logs.map(log => {
    const role = log.recipient_role || log.role || 'System';
    const badgeColor = role === 'Admin' ? 'background:#3B241D;color:#ffffff;' : (role.includes('Underwriter') ? 'background:#FAF6F2;color:#5C3A30;border:1px solid #EADBCE;' : (role.includes('Agent') ? 'background:#FAF6F2;color:#7A4A3A;border:1px solid #EADBCE;' : 'background:#FAF6F2;color:#C97963;border:1px solid #EADBCE;'));
    const title = log.title || log.action || 'System Event';
    const message = log.message || log.meta || '';
    const time = log.timestamp || log.created_at || log.time || 'Recent';

    return `
          <div class="panel-policy-list-item" style="padding: 1rem 1.15rem;">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div class="renewal-icon" style="margin-top:2px;">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                  <span style="font-weight:700;color:var(--blue-900);font-size:0.925rem;">${title}</span>
                  <span class="badge" style="${badgeColor};font-size:0.7rem;padding:1px 6px;">${role}</span>
                </div>
                <div style="font-size:0.8rem;color:var(--gray-600);">${message}</div>
              </div>
            </div>
            <span style="font-size:0.775rem;color:var(--gray-500);font-weight:600;white-space:nowrap;">${time}</span>
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

/**
 * Loads persistent Customer AI chat conversations from PostgreSQL.
 */
async function loadCustomerChatHistoryFromBackend() {
  try {
    const headers = (typeof getAuthHeaders === 'function') ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/chat/conversations`, {
      method: 'GET',
      headers: headers
    });

    if (!res.ok) {
      console.warn('Unable to load chat conversations from backend:', res.status);
      return;
    }

    const conversations = await res.json();
    const data = getRoleAiData('customer');

    data.conversations = (conversations || []).map(c => ({
      conversation_id: c.conversation_id,
      title: c.title || 'Conversation',
      created_at: c.created_at,
      updated_at: c.updated_at,
      last_message: c.last_message,
      message_count: c.message_count || 0,
      messages: []
    }));

    if (data.conversations.length > 0) {
      if (!data.activeConversationId || !data.conversations.some(c => c.conversation_id === data.activeConversationId)) {
        data.activeConversationId = data.conversations[0].conversation_id;
      }
      await fetchConversationMessages('customer', data.activeConversationId);
    } else {
      data.activeConversationId = null;
      renderRoleChatMessages('customer', null);
    }
    renderRoleChatHistory('customer');
  } catch (err) {
    console.error('Error loading customer chat history:', err);
  }
}
window.loadCustomerChatHistoryFromBackend = loadCustomerChatHistoryFromBackend;

function formatChatTimestamp(val) {
  if (!val) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  try {
    let d;
    if (val instanceof Date) {
      d = val;
    } else if (typeof val === 'string') {
      if (val.includes('T') && !val.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(val)) {
        d = new Date(val + 'Z');
      } else {
        d = new Date(val);
      }
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) {
      return typeof val === 'string' ? val : 'Just now';
    }
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return 'Just now';
  }
}
window.formatChatTimestamp = formatChatTimestamp;

/**
 * Fetches all persistent messages for a specific conversation from PostgreSQL.
 */
async function fetchConversationMessages(role, conversationId) {
  if (!conversationId) return;
  if (role !== 'customer') return;

  const data = getRoleAiData(role);
  const conv = data.conversations.find(c => c.conversation_id === conversationId);
  if (!conv) return;

  try {
    const headers = (typeof getAuthHeaders === 'function') ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers: headers
    });

    if (res.ok) {
      const messages = await res.json();
      conv.messages = (messages || []).map(m => {
        return {
          message_id: m.message_id,
          conversation_id: m.conversation_id,
          sender: m.sender_type,
          content: m.message,
          timestamp: formatChatTimestamp(m.created_at)
        };
      });
      renderRoleChatMessages(role, conversationId);
    }
  } catch (err) {
    console.error('Error fetching conversation messages:', err);
  }
}
window.fetchConversationMessages = fetchConversationMessages;

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
            <div class="message-bubble">${renderChatMarkdown(m.content || m.text)}</div>
            <div class="message-meta">
              <span>${m.timestamp || 'Just now'}</span>
            </div>
          </div>
        </div>
      `).join('');

  container.scrollTop = container.scrollHeight;
}

async function selectRoleChatConversation(role, convId) {
  const data = getRoleAiData(role);
  data.activeConversationId = convId;
  renderRoleChatHistory(role);
  if (role === 'customer') {
    const conv = data.conversations.find(c => c.conversation_id === convId);
    if (!conv || !conv.messages || conv.messages.length === 0) {
      await fetchConversationMessages(role, convId);
    } else {
      renderRoleChatMessages(role, convId);
    }
  } else {
    renderRoleChatMessages(role, convId);
  }
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

async function sendRoleChatMessage(role, customText = null) {
  const input = document.getElementById(`${role}-page-chat-input`);
  const text = (customText || (input ? input.value : '')).trim();
  if (!text) return;

  const data = getRoleAiData(role);

  if (role === 'customer') {
    let conv = data.activeConversationId ? data.conversations.find(c => c.conversation_id === data.activeConversationId) : null;
    if (!conv) {
      const tempId = `temp-${Date.now()}`;
      const newTitle = text.length > 32 ? text.substring(0, 29) + '...' : text;
      conv = {
        conversation_id: tempId,
        title: newTitle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: []
      };
      data.conversations.unshift(conv);
      data.activeConversationId = tempId;
    }

    const userMsg = {
      message_id: `msg-${Date.now()}`,
      conversation_id: conv.conversation_id,
      sender: 'user',
      content: text,
      timestamp: formatChatTimestamp(new Date())
    };
    conv.messages.push(userMsg);
    if (input) input.value = '';
    renderRoleChatHistory(role);

    // Show typing animation
    const typingMsg = {
      message_id: `msg-typing-${Date.now()}`,
      conversation_id: conv.conversation_id,
      sender: 'bot',
      content: '<div class="chat-typing-indicator"><span></span><span></span><span></span></div>',
      timestamp: 'Thinking...',
      isTyping: true
    };
    conv.messages.push(typingMsg);
    renderRoleChatMessages(role, conv.conversation_id);

    try {
      const headers = (typeof getAuthHeaders === 'function') ? getAuthHeaders() : { 'Content-Type': 'application/json' };
      const targetConvId = (conv.conversation_id && !conv.conversation_id.startsWith('temp-')) ? conv.conversation_id : null;
      const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/chat/messages`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: text,
          conversation_id: targetConvId
        })
      });

      // Remove typing indicator
      const typingIdx = conv.messages.findIndex(m => m.isTyping);
      if (typingIdx !== -1) conv.messages.splice(typingIdx, 1);

      if (res.ok) {
        const chatData = await res.json();
        if (chatData.conversation_id) {
          conv.conversation_id = chatData.conversation_id;
          data.activeConversationId = chatData.conversation_id;
        }
        if (chatData.title) {
          conv.title = chatData.title;
        }

        const botMsg = {
          message_id: chatData.message_id || `msg-${Date.now() + 1}`,
          conversation_id: conv.conversation_id,
          sender: 'bot',
          content: chatData.response,
          timestamp: formatChatTimestamp(chatData.created_at || new Date())
        };
        conv.messages.push(botMsg);
        renderRoleChatHistory(role);
        renderRoleChatMessages(role, conv.conversation_id);
        return;
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson.detail || 'Unable to send message.', 'error');
      }
    } catch (err) {
      console.warn('Persistent chat send error:', err);
      const typingIdx = conv.messages.findIndex(m => m.isTyping);
      if (typingIdx !== -1) conv.messages.splice(typingIdx, 1);
      showToast('Unable to connect to chat service.', 'error');
    }
    renderRoleChatMessages(role, conv.conversation_id);
    return;
  }

  // Non-customer roles fallback
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
    const botMsg = {
      message_id: `msg-${Date.now() + 1}`,
      conversation_id: conv.conversation_id,
      sender: 'bot',
      content: botReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

/**
 * UNDERWRITER & ADMIN REAL-TIME DATABASE FETCH SERVICES
 */
async function fetchUnderwriterStats() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const response = await fetch(`${UNDERWRITER_SERVICE_URL}/underwriter/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const stats = await response.json();
      window.underwriterStatsData = stats;

      // Summary KPI Cards
      const elPending = document.getElementById('uw-stat-pending-val') || document.querySelector('#card-uw-pending .stat-value');
      if (elPending) elPending.textContent = stats.pending_reviews != null ? stats.pending_reviews : 0;
      const elHighRisk = document.getElementById('uw-stat-high-risk-val') || document.querySelector('#card-uw-high-risk .stat-value');
      if (elHighRisk) elHighRisk.textContent = stats.high_risk_cases != null ? stats.high_risk_cases : 0;
      const elApproved = document.getElementById('uw-stat-approved-val') || document.querySelector('#card-uw-approved .stat-value');
      if (elApproved) elApproved.textContent = stats.approved != null ? stats.approved : 0;
      const elInfo = document.getElementById('uw-stat-info-val') || document.querySelector('#card-uw-info .stat-value');
      if (elInfo) elInfo.textContent = stats.needs_more_info != null ? stats.needs_more_info : 0;

      // Dynamic Card Tooltips
      const cardPending = document.getElementById('card-uw-pending');
      if (cardPending) cardPending.setAttribute('data-tooltip', `View ${stats.pending_reviews || 0} pending submissions in the Underwriting Queue`);
      const cardHighRisk = document.getElementById('card-uw-high-risk');
      if (cardHighRisk) cardHighRisk.setAttribute('data-tooltip', `View ${stats.high_risk_cases || 0} flagged high-risk cases`);
      const cardApproved = document.getElementById('card-uw-approved');
      if (cardApproved) cardApproved.setAttribute('data-tooltip', `View ${stats.approved || 0} active policies in portfolio`);
      const cardInfo = document.getElementById('card-uw-info');
      if (cardInfo) cardInfo.setAttribute('data-tooltip', `View ${stats.needs_more_info || 0} cases requiring additional information`);

      // Decision distribution total
      const totalPol = stats.total_policies || 791;
      const totalEl = document.getElementById('uw-decision-total-cases');
      if (totalEl) totalEl.textContent = `${totalPol} Total Policies`;

      // Decision distribution bars
      const distContainer = document.getElementById('uw-decision-distribution-container');
      if (distContainer) {
        const appPct = Math.round(((stats.approved || 0) / totalPol) * 100);
        const pendPct = Math.round(((stats.pending_reviews || 0) / totalPol) * 100);
        const infoPct = Math.round(((stats.needs_more_info || 0) / totalPol) * 100);
        const highPct = Math.round(((stats.high_risk_cases || 0) / totalPol) * 100);

        const distItems = [
          {
            label: 'Approved & Active',
            count: stats.approved || 0,
            pct: appPct,
            color: '#2F9E78',
            tooltip: `${stats.approved || 0} active/approved policies (${appPct}%)`
          },
          {
            label: 'Pending Review',
            count: stats.pending_reviews || 0,
            pct: pendPct,
            color: '#C98245',
            tooltip: `${stats.pending_reviews || 0} pending review submissions (${pendPct}%)`
          },
          {
            label: 'High Risk Flagged',
            count: stats.high_risk_cases || 0,
            pct: highPct,
            color: '#D65A5A',
            tooltip: `${stats.high_risk_cases || 0} high risk flagged accounts (${highPct}%)`
          },
          {
            label: 'Needs More Info',
            count: stats.needs_more_info || 0,
            pct: infoPct,
            color: '#9A6B55',
            tooltip: `${stats.needs_more_info || 0} cases requiring additional information (${infoPct}%)`
          }
        ];

        // Sort ascending: smallest percentage at top -> largest percentage at bottom
        distItems.sort((a, b) => a.pct - b.pct);

        distContainer.innerHTML = distItems.map(item => `
          <div data-tooltip="${item.tooltip}">
            <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-bottom:5px;">
              <span style="font-weight:600;color:var(--blue-900)">${item.label}</span>
              <span style="color:${item.color};font-weight:700">${item.count} (${item.pct}%)</span>
            </div>
            <div style="background:#F4EDE4;height:8px;border-radius:4px;overflow:hidden;">
              <div style="background:${item.color};width:${Math.min(item.pct, 100)}%;height:100%;border-radius:4px;"></div>
            </div>
          </div>
        `).join('');
      }

      // Performance Indicators
      const avgRiskEl = document.getElementById('uw-avg-risk-score-val');
      if (avgRiskEl) avgRiskEl.innerHTML = `48 <span style="font-size:0.75rem;font-weight:600;color:var(--amber);">(Moderate)</span>`;
      const activeRateEl = document.getElementById('uw-active-policy-rate-val');
      if (activeRateEl) activeRateEl.textContent = `${Math.round(((stats.total_active_policies || 0) / totalPol) * 100)}%`;
      const triageVolEl = document.getElementById('uw-triage-volume-val');
      if (triageVolEl) triageVolEl.textContent = `${stats.pending_reviews || 0} cases`;
      const highRiskRatioEl = document.getElementById('uw-high-risk-ratio-val');
      if (highRiskRatioEl) highRiskRatioEl.textContent = `${Math.round(((stats.high_risk_cases || 0) / totalPol) * 100)}%`;

      // LOB Distribution Bars
      const lobContainer = document.getElementById('uw-lob-distribution-bars');
      if (lobContainer && Array.isArray(stats.lob_distribution)) {
        lobContainer.innerHTML = stats.lob_distribution.map((item, idx) => {
          const accentNum = (idx % 4) + 1;
          const pctValue = (typeof item.percentage === 'number') ? item.percentage : parseFloat(item.percentage) || 0;
          return `
            <div class="chart-row" onclick="navigateTo('underwriter-queue')" data-tooltip="${item.policy_type} (${item.count} policies): ${item.total_premium_formatted} (${pctValue}%)">
              <span class="chart-row-label">${item.policy_type}</span>
              <div class="chart-row-track">
                <div class="chart-row-fill accent-${accentNum}" style="width: ${pctValue}%;">
                  <span class="chart-row-pct">${pctValue}%</span>
                </div>
              </div>
              <span class="chart-row-val">${item.total_premium_formatted}</span>
            </div>
          `;
        }).join('');
      }

      return stats;
    }
  } catch (err) {
    console.warn('Underwriter /underwriter/stats fetch error:', err);
  }
  return null;
}

async function fetchUnderwriterQueue() {
  try {
    const token = getAuthToken();
    if (!token) return [];
    const response = await fetch(`${UNDERWRITER_SERVICE_URL}/underwriter/queue`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const queue = await response.json();
      window.underwriterQueueData = Array.isArray(queue) ? queue : [];

      // Update queue page header count
      const queueTitle = document.getElementById('uw-queue-page-title');
      if (queueTitle) queueTitle.textContent = `Underwriting Queue (${window.underwriterQueueData.length} Cases)`;

      // Render Dashboard Urgent Attention Queue
      const urgentListEl = document.getElementById('uw-urgent-attention-list');
      if (urgentListEl) {
        const highPriority = window.underwriterQueueData.filter(i => (i.risk_level === 'High' || i.premium_raw > 10000)).slice(0, 2);
        const displayItems = highPriority.length > 0 ? highPriority : window.underwriterQueueData.slice(0, 2);
        if (displayItems.length === 0) {
          urgentListEl.innerHTML = `<div style="color:var(--gray-500);font-size:0.875rem;padding:1rem;">No urgent triage cases in queue.</div>`;
        } else {
          urgentListEl.innerHTML = displayItems.map(item => `
            <div class="panel-policy-list-item" style="border-left:3px solid var(--red);padding:0.85rem 1rem;" data-tooltip="${item.customer}: ${item.product || item.policy_type} (${item.premium}). Risk: ${item.risk_level} (Score ${item.risk_score})">
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                  <span style="font-weight:700;color:var(--blue-900);font-size:0.9rem;">${item.customer}</span>
                  <span class="badge ${item.risk_level === 'High' ? 'badge-risk-high' : 'badge-risk-medium'}" style="font-size:0.7rem;padding:1px 6px;">Score ${item.risk_score} · ${item.risk_level} Risk</span>
                </div>
                <div style="font-size:0.8rem;color:var(--gray-600);">${item.product || item.policy_type} · ${item.premium} · Policy ID: ${item.id}</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="openUnderwriterReviewPanel('${item.id}')" data-tooltip="Review ${item.customer}'s application">Review →</button>
            </div>
          `).join('');
        }
      }

      // Render Dashboard Recent Decision Activity
      const recentListEl = document.getElementById('uw-recent-activity-list');
      if (recentListEl) {
        const processed = window.underwriterQueueData.slice(0, 3);
        recentListEl.innerHTML = processed.map(item => `
          <div class="panel-policy-list-item" style="padding:0.75rem 0.95rem;" data-tooltip="${item.id}: ${item.customer} - ${item.status}">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
                <span style="font-weight:700;color:var(--blue-900);font-size:0.875rem;">${item.id} · ${item.customer}</span>
                <span class="badge ${item.status === 'Approved' ? 'badge-active' : (item.status === 'Needs More Information' ? 'badge-info' : 'badge-pending')}" style="font-size:0.685rem;padding:1px 6px;">${item.status}</span>
              </div>
              <div style="font-size:0.785rem;color:var(--gray-600);">${item.product || item.policy_type} · ${item.premium} · Risk: ${item.risk_level}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="openUnderwriterReviewPanel('${item.id}')">Inspect →</button>
          </div>
        `).join('');
      }

      renderUnderwriterQueueTable();
      renderUnderwriterFullQueue();
      return window.underwriterQueueData;
    }
  } catch (err) {
    console.warn('Underwriter /underwriter/queue fetch error:', err);
  }
  return [];
}

async function fetchUnderwriterPolicies(statusFilter = 'all', policyType = 'all', search = '', limit = 100, offset = 0) {
  try {
    const token = getAuthToken();
    if (!token) return { policies: [], total: 0 };
    let url = `${UNDERWRITER_SERVICE_URL}/underwriter/policies?limit=${limit}&offset=${offset}`;
    if (statusFilter && statusFilter !== 'all') url += `&status=${encodeURIComponent(statusFilter)}`;
    if (policyType && policyType !== 'all') url += `&type=${encodeURIComponent(policyType)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.underwriterPoliciesData = data;
      return data;
    }
  } catch (err) {
    console.warn('Underwriter /underwriter/policies fetch error:', err);
  }
  return { policies: [], total: 0 };
}

async function fetchAdminStats() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    const response = await fetch(`${ADMIN_SERVICE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const stats = await response.json();
      window.adminStatsData = stats;

      const elUsers = document.getElementById('admin-stat-total-users-val');
      if (elUsers) elUsers.textContent = stats.total_users != null ? stats.total_users : 502;
      const elCust = document.getElementById('admin-stat-total-customers-val');
      if (elCust) elCust.textContent = stats.total_customers != null ? stats.total_customers : (stats.customer_user_count || 321);
      const elAgents = document.getElementById('admin-stat-total-agents-val');
      if (elAgents) elAgents.textContent = stats.agent_count != null ? stats.agent_count : 71;
      const elUw = document.getElementById('admin-stat-total-underwriters-val');
      if (elUw) elUw.textContent = stats.underwriter_count != null ? stats.underwriter_count : 45;
      const elPolicies = document.getElementById('admin-stat-total-policies-val');
      if (elPolicies) elPolicies.textContent = stats.total_policies != null ? stats.total_policies : 791;
      const elActive = document.getElementById('admin-stat-active-policies-val');
      if (elActive) elActive.textContent = stats.active_policies != null ? stats.active_policies : 357;

      return stats;
    }
  } catch (err) {
    console.warn('Admin /admin/stats fetch error:', err);
  }
  return null;
}

async function fetchAdminUsers(role = 'all', search = '', limit = 100, offset = 0) {
  try {
    const token = getAuthToken();
    if (!token) return { users: [], total: 0 };
    let url = `${ADMIN_SERVICE_URL}/admin/users?limit=${limit}&offset=${offset}`;
    if (role && role !== 'all') url += `&role=${encodeURIComponent(role)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.adminUsersData = data;
      renderAdminDashboardUsersTable();
      renderAdminUsersTable(role, 'all', search);
      return data;
    }
  } catch (err) {
    console.warn('Admin /admin/users fetch error:', err);
  }
  return { users: [], total: 0 };
}

async function fetchAdminPolicies(typeFilter = 'all', statusFilter = 'all', search = '', limit = 100, offset = 0) {
  const tbody = document.getElementById('admin-policies-tbody');
  const tag = document.getElementById('admin-policies-count-tag');

  if (tbody && (!window.adminPoliciesData || !window.adminPoliciesData.policies || window.adminPoliciesData.policies.length === 0)) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray-500);"><div class="spinner" style="margin:0 auto 8px;"></div>Loading enterprise policies...</td></tr>`;
  }

  try {
    const token = getAuthToken();
    if (!token) return { policies: [], total: 0 };
    let url = `${ADMIN_SERVICE_URL}/admin/policies?limit=${limit}&offset=${offset}`;
    if (statusFilter && statusFilter !== 'all') url += `&status=${encodeURIComponent(statusFilter)}`;
    if (typeFilter && typeFilter !== 'all') url += `&type=${encodeURIComponent(typeFilter)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.adminPoliciesData = data;
      const totalCount = (data.total !== undefined) ? data.total : (data.policies ? data.policies.length : 0);
      if (tag) {
        tag.textContent = `${totalCount.toLocaleString()} Enterprise Policies`;
      }
      renderAdminPoliciesTable(typeFilter, statusFilter, search);
      return data;
    } else {
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:2rem;">Failed to load policies (Status ${response.status}).</td></tr>`;
      }
      showToast('Failed to load enterprise policies.');
    }
  } catch (err) {
    console.warn('Admin /admin/policies fetch error:', err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:2rem;">Unable to connect to policy service.</td></tr>`;
    }
    showToast('Network error while loading policies.');
  }
  return { policies: [], total: 0 };
}

async function fetchAdminAudit(limit = 50, offset = 0) {
  try {
    const token = getAuthToken();
    if (!token) return { audit_logs: [], total: 0 };
    const response = await fetch(`${ADMIN_SERVICE_URL}/admin/audit?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      window.adminAuditData = data;
      renderAdminAuditLogs();
      return data;
    }
  } catch (err) {
    console.warn('Admin /admin/audit fetch error:', err);
  }
  return { audit_logs: [], total: 0 };
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
        const pct = totalPrem > 0 ? Math.round((g.total / totalPrem) * 1000) / 10 : 0;
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
                  <div class="chart-row-fill ${accent}" style="width: ${displayPct}%;">
                    <span class="chart-row-pct">${displayPct}%</span>
                  </div>
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

function cleanCoverageText(txt) {
  if (!txt) return '';
  return txt
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '$1');
}

function renderCoverageResult(data) {
  const resultBox = document.getElementById('coverage-result-box');
  if (!resultBox) return;

  const assessment = data.assessment || 'Requires Policy Review';
  let bannerClass = 'coverage-status review';
  let iconSvg = '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  if (assessment.toLowerCase().includes('potentially covered') || assessment.toLowerCase().includes('covered')) {
    bannerClass = 'coverage-status covered';
    iconSvg = '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (assessment.toLowerCase().includes('not listed') || assessment.toLowerCase().includes('not covered') || assessment.toLowerCase().includes('excluded')) {
    bannerClass = 'coverage-status not-covered';
    iconSvg = '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  let cardsHtml = '';

  // Why (Explanation & Details)
  if (data.reason) {
    cardsHtml += `
      <div class="card" style="margin-bottom: 1rem;">
        <div class="card-title" style="margin-bottom: 0.5rem; font-size: 0.95rem; font-weight: 700; color: #3B241D;">Why</div>
        <p style="color: var(--gray-700); font-size: 0.9rem; line-height: 1.6; margin: 0;">${cleanCoverageText(data.reason)}</p>
      </div>
    `;
  }

  // Policy & Coverage Details (Relevant Policy, Relevant Coverage, Deductible)
  const hasPolicyInfo = data.relevant_policy || data.relevant_coverage || data.applicable_deductible;
  if (hasPolicyInfo) {
    let policyDetails = [];
    if (data.relevant_policy) {
      policyDetails.push(`
        <div style="flex: 1; min-width: 200px;">
          <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px;">Relevant Policy</div>
          <div style="font-weight: 600; color: #1E3A8A; font-size: 0.95rem;">${cleanCoverageText(data.relevant_policy)}</div>
        </div>
      `);
    }
    if (data.relevant_coverage) {
      policyDetails.push(`
        <div style="flex: 1; min-width: 200px;">
          <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px;">Relevant Coverage</div>
          <div style="font-weight: 600; color: #065F46; font-size: 0.95rem;">${cleanCoverageText(data.relevant_coverage)}</div>
        </div>
      `);
    }
    if (data.applicable_deductible) {
      policyDetails.push(`
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-500); margin-bottom: 4px;">Deductible</div>
          <div style="font-weight: 700; color: #3B241D; font-size: 0.95rem;">${cleanCoverageText(data.applicable_deductible)}</div>
        </div>
      `);
    }

    cardsHtml += `
      <div class="card" style="margin-bottom: 1rem; background: #FAF5F0; border: 1px solid #EADBCE;">
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start;">
          ${policyDetails.join('')}
        </div>
      </div>
    `;
  }

  // Important (Relevant Exclusion or Limitation)
  if (data.relevant_exclusion) {
    cardsHtml += `
      <div class="card" style="margin-bottom: 1rem; background: #FFFBEB; border: 1px solid #FDE68A;">
        <div class="card-title" style="margin-bottom: 0.4rem; font-size: 0.9rem; font-weight: 700; color: #92400E; display: flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Important
        </div>
        <p style="color: #78350F; font-size: 0.875rem; line-height: 1.5; margin: 0;">${cleanCoverageText(data.relevant_exclusion)}</p>
      </div>
    `;
  }

  // Next Step
  if (data.recommended_action) {
    cardsHtml += `
      <div class="card" style="background: #F0FDF4; border: 1px solid #BBF7D0;">
        <div class="card-title" style="margin-bottom: 0.4rem; font-size: 0.9rem; font-weight: 700; color: #166534; display: flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Next Step
        </div>
        <p style="color: #14532D; font-size: 0.875rem; line-height: 1.5; margin: 0;">${cleanCoverageText(data.recommended_action)}</p>
      </div>
    `;
  }

  resultBox.innerHTML = `
    <div class="${bannerClass}" id="coverage-status-banner">
      ${iconSvg}
      <div>
        <h3 id="coverage-status-title">${cleanCoverageText(assessment)}</h3>
        ${data.status_description ? `<p id="coverage-status-desc" style="font-size: 0.9rem; margin-top: 2px;">${cleanCoverageText(data.status_description)}</p>` : ''}
      </div>
    </div>
    ${cardsHtml}
  `;
}

async function runCoverageCheck(query) {
  if (!query || !query.trim()) return;

  const submitBtn = document.getElementById('coverage-submit-btn');
  const resultBox = document.getElementById('coverage-result-box');

  const originalBtnText = submitBtn ? submitBtn.textContent : 'Check Coverage';
  if (submitBtn) {
    submitBtn.textContent = 'Checking Coverage...';
    submitBtn.disabled = true;
  }

  if (resultBox) {
    resultBox.classList.add('visible');
    resultBox.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--gray-600); background: #FAF5F0; border: 1px solid #EADBCE; border-radius: 16px;">
        <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #D97706; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 0.75rem;"></div>
        <div style="font-weight: 600; color: #3B241D; font-size: 0.95rem;">Checking Coverage...</div>
        <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 4px;">Evaluating scenario against your active policies, deductibles, and exclusions</div>
      </div>
    `;
  }

  try {
    const headers = (typeof getAuthHeaders === 'function') ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/coverage/check`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ scenario: query.trim() })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Coverage check failed (${res.status})`);
    }

    const data = await res.json();
    renderCoverageResult(data);
  } catch (err) {
    console.error('Coverage check error:', err);
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="coverage-status not-covered">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <div>
            <h3>Unable to Check Coverage</h3>
            <p style="font-size: 0.9rem; margin-top: 2px;">${err.message || 'Please verify your connection and try again.'}</p>
          </div>
        </div>
      `;
    }
  } finally {
    if (submitBtn) {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

function cleanGlossaryText(txt) {
  if (!txt) return '';
  return txt
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '$1');
}

const glossaryAiCache = {};

async function explainGlossaryTermWithAI(term, definition, termId) {
  const resultContainer = document.getElementById(`glossary-ai-result-${termId}`);
  const btn = document.getElementById(`btn-explain-${termId}`);
  if (!resultContainer) return;

  // Toggle if already visible
  if (resultContainer.dataset.expanded === 'true') {
    resultContainer.innerHTML = '';
    resultContainer.dataset.expanded = 'false';
    if (btn) btn.innerHTML = '✨ Explain with AI';
    return;
  }

  // If cached, render immediately
  if (glossaryAiCache[termId]) {
    renderGlossaryAiCard(glossaryAiCache[termId], termId);
    resultContainer.dataset.expanded = 'true';
    if (btn) btn.innerHTML = '✨ Hide AI Explanation';
    return;
  }

  // Show loading indicator
  if (btn) {
    btn.classList.add('loading');
    btn.innerHTML = '✨ Generating...';
  }
  resultContainer.innerHTML = `
    <div class="glossary-ai-card">
      <div class="glossary-ai-card-title">✨ AI Explanation</div>
      <div class="chat-typing-indicator" style="margin: 0.5rem 0;"><span></span><span></span><span></span></div>
      <div style="font-size:0.825rem; color:#7A4A3A;">Analyzing insurance concept and your active policies...</div>
    </div>
  `;

  try {
    const headers = (typeof getAuthHeaders === 'function') ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/glossary/explain`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        term: term,
        definition: definition
      })
    });

    if (res.ok) {
      const data = await res.json();
      glossaryAiCache[termId] = data;
      renderGlossaryAiCard(data, termId);
      resultContainer.dataset.expanded = 'true';
      if (btn) {
        btn.classList.remove('loading');
        btn.innerHTML = '✨ Hide AI Explanation';
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      resultContainer.innerHTML = '';
      if (btn) {
        btn.classList.remove('loading');
        btn.innerHTML = '✨ Explain with AI';
      }
      showToast(errJson.detail || 'Unable to generate AI explanation.', 'error');
    }
  } catch (err) {
    console.error('Glossary AI error:', err);
    resultContainer.innerHTML = '';
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = '✨ Explain with AI';
    }
    showToast('Unable to connect to AI explanation service.', 'error');
  }
}

function renderGlossaryAiCard(data, termId) {
  const resultContainer = document.getElementById(`glossary-ai-result-${termId}`);
  if (!resultContainer) return;

  const simplified = cleanGlossaryText(data.simplified_explanation || '');
  const example = cleanGlossaryText(data.example || '');
  const policyCtx = cleanGlossaryText(data.your_policy_context || '');
  const takeaways = Array.isArray(data.key_takeaways) ? data.key_takeaways : [];

  resultContainer.innerHTML = `
    <div class="glossary-ai-card">
      <div class="glossary-ai-card-title">✨ AI Explanation</div>
      
      <div class="glossary-ai-section">
        <div class="glossary-ai-content">${simplified}</div>
      </div>

      <div class="glossary-ai-section">
        <div class="glossary-ai-label">Real-world example</div>
        <div class="glossary-ai-content">${example}</div>
      </div>

      ${policyCtx ? `
      <div class="glossary-ai-section">
        <div class="glossary-ai-label">In your policy</div>
        <div class="glossary-ai-policy-box">${policyCtx}</div>
      </div>` : ''}

      ${takeaways.length > 0 ? `
      <div class="glossary-ai-section">
        <div class="glossary-ai-label">Key takeaways</div>
        <ul class="glossary-ai-takeaways-list">
          ${takeaways.map(t => `<li>${cleanGlossaryText(t)}</li>`).join('')}
        </ul>
      </div>` : ''}
    </div>
  `;
}

function renderGlossaryList(searchTerm = '') {
  const container = document.getElementById('glossary-container');
  if (!container) return;
  const q = searchTerm.toLowerCase().trim();
  const filtered = MOCK_DB.glossary.filter(item =>
    item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--gray-500)">No terms matching "${searchTerm}". Try searching for deductible, premium, or exclusion.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const termId = item.term.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeTerm = item.term.replace(/'/g, "\\'");
    const safeDef = item.definition.replace(/'/g, "\\'");

    return `
      <div class="card glossary-term" id="glossary-term-${termId}">
        <div class="glossary-term-header">
          <h4>${item.term}</h4>
          <button class="btn-ai-explain" id="btn-explain-${termId}" onclick="explainGlossaryTermWithAI('${safeTerm}', '${safeDef}', '${termId}')">
            ✨ Explain with AI
          </button>
        </div>
        <p class="definition">${item.definition}</p>
        <div class="example"><strong>Example:</strong> ${item.example}</div>
        <div id="glossary-ai-result-${termId}" data-expanded="false"></div>
      </div>
    `;
  }).join('');
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
    fetchAdminStats();
    fetchAdminUsers();
    fetchAdminPolicies();
    fetchAdminAudit();
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
    fetchUnderwriterStats();
    fetchUnderwriterQueue();
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
    loadCustomerChatHistoryFromBackend();
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
    fetchUnderwriterQueue();
  } else if (pageId === 'underwriter-dashboard') {
    fetchUnderwriterStats();
    fetchUnderwriterQueue();
  } else if (pageId === 'underwriter-risk') {
    if (typeof initRiskAssessmentGuidelines === 'function') initRiskAssessmentGuidelines();
  } else if (pageId === 'underwriter-review') {
    if (typeof initUnderwriterReviewPage === 'function') initUnderwriterReviewPage();
  } else if (pageId === 'admin-dashboard') {
    fetchAdminStats();
    fetchAdminUsers();
  } else if (pageId === 'admin-users') {
    fetchAdminUsers();
  } else if (pageId === 'admin-policies') {
    fetchAdminPolicies();
  } else if (pageId === 'admin-audit') {
    fetchAdminAudit();
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
  } else if (pageId === 'customer-application') {
    if (typeof initPolicyApplicationModule === 'function') initPolicyApplicationModule();
    if (typeof fetchCustomerApplications === 'function') fetchCustomerApplications();
  } else if (pageId === 'agent-policies') {
    if (typeof fetchAgentPolicies === 'function') {
      fetchAgentPolicies('all').then(() => renderAgentPoliciesTable());
    } else {
      renderAgentPoliciesTable();
    }
    fetchAgentRenewals();
  } else if (pageId === 'agent-applications') {
    if (typeof fetchAgentApplications === 'function') fetchAgentApplications();
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

function showToast(message, type) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Infer toast type if not explicitly supplied
  let toastType = type;
  if (!toastType) {
    const lower = (message || '').toLowerCase();
    if (lower.includes('error') || lower.includes('failed') || lower.includes('could not') || lower.includes('unable to') || lower.includes('rejected') || lower.includes('missing') || lower.includes('not found') || lower.includes('denied')) {
      toastType = 'error';
    } else if (lower.includes('success') || lower.includes('approved') || lower.includes('confirmed') || lower.includes('created') || lower.includes('saved') || lower.includes('enabled') || lower.includes('bound') || lower.includes('updated') || lower.includes('refreshed') || lower.includes('downloaded') || lower.includes('submitted')) {
      toastType = 'success';
    } else if (lower.includes('warning') || lower.includes('required') || lower.includes('already exists') || lower.includes('please select') || lower.includes('please enter') || lower.includes('attention') || lower.includes('read-only')) {
      toastType = 'warning';
    } else {
      toastType = 'info';
    }
  }

  const icons = {
    success: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${toastType}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[toastType] || icons.info}</div>
    <div class="toast-content">${message}</div>
    <button class="toast-close-btn" aria-label="Close notification">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 280);
  };

  const timer = setTimeout(dismiss, 3500);

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(timer);
      dismiss();
    });
  }
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
    { num: 2, title: 'Risk Factor', desc: 'Risk Classification & Key Factors' },
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

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;" class="fnol-grid-responsive">
        <!-- Left Column: Policy & Incident Details -->
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          <!-- Policy Selection Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem 1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">1</span>
              Select Covered Policy
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 12px;">Choose which of your active policies this claim relates to:</p>
            
            <div id="fnol-policy-list-container" style="display:flex;flex-direction:column;gap:8px;">
              <div style="padding:14px;background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;font-size:0.85rem;color:var(--cust-brown-900);text-align:center;">
                Loading your active policies...
              </div>
            </div>
          </div>

          <!-- Incident Details Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem 1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">2</span>
              Incident Details
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 12px;">Provide the time, location, and a clear description of the incident:</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.8rem;font-weight:600;margin-bottom:4px;display:block;">Date of Loss <span style="color:#DC2626;">*</span></label>
                <input type="date" id="fnol-date-loss" class="form-control" value="${s.dateLoss}" style="font-size:0.85rem;padding:7px 10px;width:100%;box-sizing:border-box;border-radius:6px;" required>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.8rem;font-weight:600;margin-bottom:4px;display:block;">Time of Loss <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span></label>
                <input type="time" id="fnol-time-loss" class="form-control" value="${s.timeLoss}" style="font-size:0.85rem;padding:7px 10px;width:100%;box-sizing:border-box;border-radius:6px;">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:0.8rem;font-weight:600;margin-bottom:4px;display:block;">Location of Incident <span style="color:#DC2626;">*</span></label>
              <input type="text" id="fnol-location" class="form-control" value="${s.location}" placeholder="e.g. 5th Ave & Main St or Home/Business Address" style="font-size:0.85rem;padding:8px 10px;width:100%;box-sizing:border-box;border-radius:6px;" required>
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:0.8rem;font-weight:600;margin-bottom:4px;display:block;">What Happened? (Incident Category)</label>
              <select id="fnol-category" class="form-control" style="font-size:0.85rem;padding:8px 10px;width:100%;box-sizing:border-box;border-radius:6px;">
                <option value="Vehicle Collision" ${s.incidentCategory === 'Vehicle Collision' ? 'selected' : ''}>Vehicle Collision / Impact</option>
                <option value="Water / Pipe Leak" ${s.incidentCategory === 'Water / Pipe Leak' ? 'selected' : ''}>Water Leak / Plumbing Discharge</option>
                <option value="Weather / Storm Damage" ${s.incidentCategory === 'Weather / Storm Damage' ? 'selected' : ''}>Weather / Storm / Hail Damage</option>
                <option value="Theft / Vandalism" ${s.incidentCategory === 'Theft / Vandalism' ? 'selected' : ''}>Theft / Burglary / Vandalism</option>
                <option value="Property Liability" ${s.incidentCategory === 'Property Liability' ? 'selected' : ''}>Property / Third-Party Liability</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:0.8rem;font-weight:600;margin-bottom:4px;display:block;">Description of Incident <span style="color:#DC2626;">*</span></label>
              <textarea id="fnol-description" class="form-control" placeholder="Describe what happened, any damages noticed, and the sequence of events in detail..." style="font-size:0.85rem;line-height:1.5;padding:8px 10px;width:100%;min-height:85px;height:90px;box-sizing:border-box;border-radius:6px;resize:vertical;display:block;" required>${s.description}</textarea>
            </div>
          </div>
        </div>

        <!-- Right Column: Supporting Information & Uploads -->
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          <!-- Photo & Document Upload Card -->
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem 1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <span style="background:var(--cust-brown-100);color:var(--cust-brown-700);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:bold;">3</span>
              Photos & Supporting Evidence <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span>
            </h4>
            <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 12px;">Upload photos of damage, repair estimates, or relevant documents to expedite review:</p>

            <input type="file" id="fnol-file-input" multiple accept="image/*,.pdf" style="display:none;" onchange="fnolHandleFileUpload(event)">
            
            <div onclick="fnolTriggerUpload()" style="border:2px dashed var(--cust-cream-border);background:#FAF6F2;border-radius:8px;padding:18px 14px;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:12px;">
              <svg width="26" height="26" fill="none" stroke="var(--cust-brown-700)" stroke-width="1.8" viewBox="0 0 24 24" style="margin:0 auto 6px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <div style="font-size:0.85rem;font-weight:600;color:var(--cust-brown-900);">Click to browse or drop damage photos here</div>
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
          <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem 1.35rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--cust-brown-900);margin:0 0 12px;">
              Police Report & Witnesses <span style="font-size:0.75rem;font-weight:normal;color:var(--gray-500);">(Optional)</span>
            </h4>

            <!-- Police Report Accordion / Toggle -->
            <div style="border-bottom:1px solid var(--cust-cream-border);padding-bottom:12px;margin-bottom:12px;">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:0.85rem;color:var(--cust-brown-900);">
                <input type="checkbox" id="fnol-police-toggle" ${s.hasPoliceReport ? 'checked' : ''} onchange="document.getElementById('fnol-police-fields').style.display = this.checked ? 'block' : 'none';" style="accent-color:var(--cust-brown-700);">
                <span>Police or Official Accident Report Filed</span>
              </label>
              <div id="fnol-police-fields" style="display:${s.hasPoliceReport ? 'block' : 'none'};margin-top:10px;padding-left:24px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                  <input type="text" id="fnol-police-num" class="form-control" placeholder="Report / Case Number (Optional)" value="${s.policeReportNum || ''}" style="font-size:0.825rem;padding:7px 10px;border-radius:6px;">
                  <input type="text" id="fnol-police-dept" class="form-control" placeholder="Police Dept / Agency (Optional)" value="${s.policeDept || ''}" style="font-size:0.825rem;padding:7px 10px;border-radius:6px;">
                </div>
              </div>
            </div>

            <!-- Witness Accordion / Toggle -->
            <div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:0.85rem;color:var(--cust-brown-900);">
                <input type="checkbox" id="fnol-witness-toggle" ${s.hasWitness ? 'checked' : ''} onchange="document.getElementById('fnol-witness-fields').style.display = this.checked ? 'block' : 'none';" style="accent-color:var(--cust-brown-700);">
                <span>Witness Information Available</span>
              </label>
              <div id="fnol-witness-fields" style="display:${s.hasWitness ? 'block' : 'none'};margin-top:10px;padding-left:24px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                  <input type="text" id="fnol-witness-name" class="form-control" placeholder="Witness Full Name (Optional)" value="${s.witnessName || ''}" style="font-size:0.825rem;padding:7px 10px;border-radius:6px;">
                  <input type="text" id="fnol-witness-phone" class="form-control" placeholder="Phone or Email (Optional)" value="${s.witnessPhone || ''}" style="font-size:0.825rem;padding:7px 10px;border-radius:6px;">
                </div>
                <textarea id="fnol-witness-stmt" class="form-control" rows="2" placeholder="Brief witness statement or contact notes (Optional)..." style="font-size:0.825rem;padding:7px 10px;border-radius:6px;width:100%;box-sizing:border-box;">${s.witnessStatement || ''}</textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Action Navigation -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;">
        <button type="button" class="btn btn-outline" onclick="navigateTo('customer-dashboard')">
          Cancel / Return
        </button>
        <button type="button" class="btn btn-primary" onclick="fnolSetStep(2)" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;">
          <span>Continue to Risk Factor</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    `;
    container.innerHTML = contentHtml;
    renderFnolPolicySelection();
  }

  // STEP 2: RISK FACTOR & CLASSIFICATION
  else if (step === 2) {
    const isLow = s.classification === 'Low Severity';
    const isMed = s.classification === 'Medium Severity';
    const isHigh = s.classification === 'High Severity';
    const isFraud = s.classification === 'Potential Fraud';

    const riskLabel = isLow ? 'Low Risk' : isMed ? 'Medium Risk' : isHigh ? 'High Risk' : 'Elevated Risk (Verification Flagged)';
    const bannerBg = isLow ? '#ECFDF5' : isMed ? '#FFFBEB' : isHigh ? '#FEF2F2' : '#F5F3FF';
    const bannerBorder = isLow ? '#A7F3D0' : isMed ? '#FDE68A' : isHigh ? '#FECACA' : '#DDD6FE';
    const bannerText = isLow ? '#065F46' : isMed ? '#92400E' : isHigh ? '#991B1B' : '#5B21B6';
    const badgeBg = isLow ? '#059669' : isMed ? '#D97706' : isHigh ? '#DC2626' : '#7C3AED';

    const userObj = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('auth_user')) || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth_user')) || '{}');
    const custName = userObj.name || 'Insured Policyholder';

    // Derived Risk Factors
    const descText = (s.description || '').toLowerCase();
    const damageSeverityText = isLow ? 'Low' : isMed ? 'Moderate' : 'High';
    const bodilyInjuryText = (descText.includes('injur') || descText.includes('hospital') || descText.includes('medic') || descText.includes('doctor')) ? 'Reported (Medical Review Required)' : 'None reported';
    const propFunctionalityText = (descText.includes('towed') || descText.includes('uninhabitable') || descText.includes('total') || descText.includes('non-functional') || descText.includes('destroyed')) ? 'Impaired / Non-functional' : 'Fully functional';
    const coverageStatusText = s.policyType ? `Potentially covered` : 'Potentially covered';
    const supportingEvidenceText = (s.photos && s.photos.length > 0) ? `${s.photos.length} attachment(s) provided` : 'No attachments provided';
    const claimComplexityText = (s.classificationScore <= 25) ? 'Low' : (s.classificationScore <= 60) ? 'Moderate' : 'High';

    const riskSummaryText = isLow ?
      'The claim currently presents a low-risk profile based on the information provided. Further verification may be required before the claim is finalized.' :
      isMed ?
      'The claim currently presents a moderate-risk profile based on the information provided. Further verification may be required before the claim is finalized.' :
      'The claim currently presents an elevated-risk profile based on the information provided. Further verification may be required before the claim is finalized.';

    contentHtml = `
      ${stepperHtml}

      <!-- Risk Factor Assessment Banner -->
      <div style="background:${bannerBg};border:1.5px solid ${bannerBorder};border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:50%;background:${badgeBg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
              ${isFraud ? '🚩' : isHigh ? '⚠️' : isMed ? '⚡' : '🛡️'}
            </div>
            <div>
              <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;color:${bannerText};">RISK FACTOR ASSESSMENT</div>
              <h3 style="font-size:1.35rem;font-weight:700;color:${bannerText};margin:0;">${riskLabel}</h3>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem;color:${bannerText};font-weight:600;">Risk Score</div>
            <div style="font-size:1.4rem;font-weight:800;color:${bannerText};">Risk Score: ${s.classificationScore} / 100</div>
          </div>
        </div>
        <p style="font-size:0.875rem;color:${bannerText};margin:0;line-height:1.5;">${s.classificationRationale}</p>
      </div>

      <!-- Complete 4-Section Assessment Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem;" class="fnol-grid-responsive">
        <!-- Section 1: Claim Overview -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">📋</span> Claim Overview
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.overview}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Policyholder: <strong>${custName}</strong> · Active Policy: <strong>${s.policyCode || s.policyId}</strong></div>
        </div>

        <!-- Section 2: Damage Assessment -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">💥</span> Damage Assessment
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.damages}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Supporting Evidence: <strong>${s.photos.length} item(s) attached</strong></div>
        </div>

        <!-- Section 3: Coverage Check -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">🛡️</span> Coverage Check
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.coverageTriggered}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Applicable Deductible: <strong>${s.policyDeductible || '$1,000'}</strong></div>
        </div>

        <!-- Section 4: Recommended Next Action -->
        <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--cust-brown-900);font-weight:700;font-size:0.95rem;">
            <span style="font-size:1.1rem;">🧭</span> Recommended Next Action
          </div>
          <div style="font-size:0.85rem;color:var(--gray-700);line-height:1.5;background:#FAF6F2;padding:12px;border-radius:8px;border:1px solid var(--cust-cream-border);flex:1;">
            ${s.claimSummary.recommendedNextAction}
          </div>
          <div style="font-size:0.75rem;color:var(--gray-500);">Service SLA: <strong>Adjuster response within 2 business hours</strong></div>
        </div>
      </div>

      <!-- Risk Factors Identified Card -->
      <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.35rem;margin-bottom:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 12px;display:flex;align-items:center;gap:8px;">
          <span style="color:var(--cust-brown-700);font-size:1.1rem;">🔍</span>
          Risk Factors Identified
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;">
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Damage Severity</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${damageSeverityText}</span>
          </div>
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Bodily Injury</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${bodilyInjuryText}</span>
          </div>
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Property Functionality</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${propFunctionalityText}</span>
          </div>
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Coverage Status</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${coverageStatusText}</span>
          </div>
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Supporting Evidence</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${supportingEvidenceText}</span>
          </div>
          <div style="background:#FAF6F2;border:1px solid var(--cust-cream-border);border-radius:8px;padding:10px 14px;display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;">Claim Complexity</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--cust-brown-900);">${claimComplexityText}</span>
          </div>
        </div>
      </div>

      <!-- Risk Summary Card -->
      <div class="card" style="border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.25rem 1.35rem;margin-bottom:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;color:var(--cust-brown-900);margin:0 0 8px;display:flex;align-items:center;gap:8px;">
          <span style="color:var(--cust-brown-700);font-size:1.1rem;">📊</span>
          Risk Summary
        </h4>
        <p style="font-size:0.875rem;color:var(--gray-700);margin:0;line-height:1.55;">
          ${riskSummaryText}
        </p>
      </div>

      <!-- AI-Assisted Analysis Notice -->
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;margin-bottom:1.5rem;display:flex;align-items:flex-start;gap:10px;font-size:0.8rem;color:#64748B;line-height:1.45;">
        <span style="font-size:1rem;flex-shrink:0;">ℹ️</span>
        <div><strong>AI-Assisted Analysis Notice:</strong> This preliminary analysis supports claim intake and routing. It does not constitute a final claim decision or confirmation of coverage liability.</div>
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
    const isLow = s.classification === 'Low Severity';
    const isMed = s.classification === 'Medium Severity';
    const isHigh = s.classification === 'High Severity';
    const riskLabel = isLow ? 'Low Risk' : isMed ? 'Medium Risk' : isHigh ? 'High Risk' : 'Elevated Risk (Verification Flagged)';

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

        <!-- Risk Factor Assessment Box -->
        <div style="background:#FAF5FF;border:1px solid #E9D5FF;padding:12px 16px;border-radius:8px;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <span style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:#6B21A8;">Initial Risk Factor Assessment:</span>
            <div style="font-size:1.1rem;font-weight:800;color:#581C87;">${riskLabel} (Score: ${s.classificationScore}/100)</div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="fnolSetStep(2)" style="font-size:0.75rem;">View Risk Factor</button>
        </div>

        <div style="font-size:0.8rem;color:var(--gray-600);border-top:1px solid var(--cust-cream-border);padding-top:10px;">
          ⚖️ By clicking "Submit Claim", you affirm that the provided information is true, accurate, and complete to the best of your knowledge.
        </div>
      </div>

      <!-- Submission Actions -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button type="button" class="btn btn-outline" onclick="fnolSetStep(2)">
          ← Back to Risk Factor
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
    const isLow = s.classification === 'Low Severity';
    const isMed = s.classification === 'Medium Severity';
    const isHigh = s.classification === 'High Severity';
    const riskLabel = isLow ? 'Low Risk' : isMed ? 'Medium Risk' : isHigh ? 'High Risk' : 'Elevated Risk (Verification Flagged)';

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
          <div class="detail-row" style="padding:8px 0;"><span class="detail-label" style="font-size:0.875rem;">Risk Factor Assessment</span><span class="detail-value" style="font-size:0.875rem;"><strong>${riskLabel}</strong> (Risk Score: ${s.classificationScore}/100)</span></div>
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

  let adminPolicyDebounceTimer = null;
  const triggerAdminPolicyFilter = (fetchRemote = false) => {
    const search = adminPolicySearch ? adminPolicySearch.value.trim() : '';
    const type = adminPolicyTypeFilter ? adminPolicyTypeFilter.value : 'all';
    const status = adminPolicyStatusFilter ? adminPolicyStatusFilter.value : 'all';

    if (fetchRemote) {
      fetchAdminPolicies(type, status, search);
    } else {
      renderAdminPoliciesTable(type, status, search);
    }
  };

  if (adminPolicySearch) {
    adminPolicySearch.addEventListener('input', () => {
      // Instant local search filter
      triggerAdminPolicyFilter(false);
      // Debounced backend query
      clearTimeout(adminPolicyDebounceTimer);
      adminPolicyDebounceTimer = setTimeout(() => {
        triggerAdminPolicyFilter(true);
      }, 350);
    });
  }
  if (adminPolicyTypeFilter) adminPolicyTypeFilter.addEventListener('change', () => triggerAdminPolicyFilter(true));
  if (adminPolicyStatusFilter) adminPolicyStatusFilter.addEventListener('change', () => triggerAdminPolicyFilter(true));
  if (adminPolicyResetBtn) {
    adminPolicyResetBtn.addEventListener('click', () => {
      if (adminPolicySearch) adminPolicySearch.value = '';
      if (adminPolicyTypeFilter) adminPolicyTypeFilter.value = 'all';
      if (adminPolicyStatusFilter) adminPolicyStatusFilter.value = 'all';
      fetchAdminPolicies('all', 'all', '');
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
        statusFilter.value = 'Pending Review';
        renderUnderwriterFullQueue('Pending Review', 'all', 'all', '');
      }
      const queue = window.underwriterQueueData || [];
      const pendingList = queue.filter(item => {
        const s = mapUnderwriterStatus(item.status);
        return s === 'Pending Review' || s === 'Pending Approval';
      });
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${pendingList.length} applications</strong> awaiting risk evaluation:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;max-height:400px;overflow-y:auto;">
              ${pendingList.slice(0, 15).map(app => `
                <div class="panel-policy-list-item">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product || app.policy_type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · ${app.premium} · Risk: ${app.risk_level || 'Low'}</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Review →</button>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:1.25rem;">
              <button class="btn btn-outline btn-block btn-sm" onclick="navigateTo('underwriter-queue')">Open Dedicated Queue Ledger (${queue.length}) →</button>
            </div>
          `;
      openOrUpdateSlidePanel(`Pending Underwriting Reviews (${pendingList.length})`, 'Active Submissions Requiring Decision', contentHtml);
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
      const queue = window.underwriterQueueData || [];
      const highList = queue.filter(item => (item.risk_level || '').toLowerCase() === 'high' || item.premium_raw > 10000);
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${highList.length} high-exposure cases</strong> flagged for strict review:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;max-height:400px;overflow-y:auto;">
              ${highList.slice(0, 15).map(app => `
                <div class="panel-policy-list-item" style="border-left:3px solid var(--red);">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product || app.policy_type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · Score ${app.risk_score || 75}/100 · ${mapUnderwriterStatus(app.status)}</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Review Case →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel(`High-Risk Cases (${highList.length})`, 'Applications with Elevated Hazard Indicators', contentHtml);
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
      const queue = window.underwriterQueueData || [];
      const approvedList = queue.filter(item => mapUnderwriterStatus(item.status) === 'Approved');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${approvedList.length} bound/approved policies</strong>:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;max-height:400px;overflow-y:auto;">
              ${approvedList.map(app => `
                <div class="panel-policy-list-item">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product || app.policy_type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · ${app.premium} · Effective ${app.effective_date || 'Current'}</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">Inspect →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel(`Approved Applications (${approvedList.length})`, 'Policies Bound and Issued', contentHtml);
    });
  }

  if (uwInfoCard) {
    uwInfoCard.addEventListener('click', () => {
      highlightActiveCard('card-uw-info');
      const statusFilter = document.getElementById('uw-full-status-filter');
      if (statusFilter) {
        statusFilter.value = 'Info Required';
        renderUnderwriterFullQueue('Info Required', 'all', 'all', '');
      }
      const queue = window.underwriterQueueData || [];
      const infoList = queue.filter(item => mapUnderwriterStatus(item.status) === 'Info Required');
      const contentHtml = `
            <div style="font-size:0.875rem;color:var(--gray-600);margin-bottom:0.75rem;">Showing <strong>${infoList.length} applications</strong> awaiting supplemental documents:</div>
            <div style="display:flex;flex-direction:column;gap:0.65rem;max-height:400px;overflow-y:auto;">
              ${infoList.length === 0 ? '<div style="color:var(--gray-500);padding:1rem;">No policies currently pending supplemental documents.</div>' : infoList.map(app => `
                <div class="panel-policy-list-item" style="border-left:3px solid var(--blue-600);">
                  <div>
                    <div style="font-weight:700;color:var(--blue-900);font-size:0.9rem">${app.customer} · ${app.product || app.policy_type}</div>
                    <div style="font-size:0.8rem;color:var(--gray-500);font-family:monospace">${app.id} · Pending documentation</div>
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="openUnderwriterReviewPanel('${app.id}')">View Details →</button>
                </div>
              `).join('')}
            </div>
          `;
      openOrUpdateSlidePanel(`Info Required (${infoList.length})`, 'Cases Awaiting Documentation', contentHtml);
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

    let html = `<div style="display:flex;flex-direction:column;gap:1.25rem;width:100%;">`;

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
          <div class="card" style="width:100%;box-sizing:border-box;border:1px solid var(--cust-cream-border);background:var(--white);border-radius:12px;padding:1.5rem 1.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:14px;">
              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <span style="font-weight:800;font-size:1.15rem;color:var(--cust-brown-900);letter-spacing:0.02em;font-family:monospace;">${c.id}</span>
                <span style="background:${statusBadgeBg};color:${statusBadgeColor};border:1px solid ${statusBorder};font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;display:inline-flex;align-items:center;gap:6px;">
                  <span style="width:6px;height:6px;border-radius:50%;background:${statusBadgeColor};"></span>
                  ${c.status || 'Under Review'}
                </span>
                <span style="background:${severityBadgeBg};color:${severityBadgeColor};border:1px solid ${severityBorder};font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:14px;">
                  ${sevStr}
                </span>
              </div>
              <div style="text-align:right;">
                <span style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;display:block;">Estimated Amount</span>
                <div style="font-weight:800;font-size:1.15rem;color:var(--cust-brown-900);">${c.amount || '$0'}</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:16px;margin-bottom:14px;background:#FAF6F2;padding:14px 18px;border-radius:8px;border:1px solid var(--cust-cream-border);" class="claims-card-grid-responsive">
              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Covered Policy</div>
                <div style="font-size:0.875rem;font-weight:700;color:var(--cust-brown-900);">${c.policyType || 'Insurance Policy'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${c.policyCode || c.policyId || ''}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Incident Peril</div>
                <div style="font-size:0.875rem;font-weight:700;color:var(--cust-brown-900);">${c.claimType || 'Loss'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">Date: ${c.dateLoss || 'N/A'}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Assigned Adjuster</div>
                <div style="font-size:0.875rem;font-weight:700;color:var(--cust-brown-900);">${(c.adjuster && c.adjuster.name) || 'Marcus Vance'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${(c.adjuster && c.adjuster.phone) || '(555) 881-3022'}</div>
              </div>

              <div>
                <div style="font-size:0.725rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Deductible & Evidence</div>
                <div style="font-size:0.875rem;font-weight:700;color:var(--cust-brown-900);">${c.deductible || '$1,000'}</div>
                <div style="font-size:0.75rem;color:var(--gray-600);">${(c.evidence || []).length} evidence file(s)</div>
              </div>
            </div>

            <div style="margin-bottom:14px;background:#fff;border:1px solid var(--cust-cream-border);border-radius:8px;padding:12px 16px;">
              <div style="font-size:0.75rem;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px;">Incident Description</div>
              <p style="font-size:0.85rem;color:var(--gray-700);margin:0;line-height:1.5;">
                ${c.description || ''}
              </p>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-top:1px solid var(--cust-cream-border);padding-top:12px;">
              <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--cust-brown-900);">
                <span style="font-weight:700;color:var(--cust-brown-700);">Next Step:</span>
                <span style="color:var(--gray-700);">${c.nextAction || 'Adjuster inspection scheduled.'}</span>
              </div>
              <button class="btn btn-outline btn-sm" onclick="openCustomerClaimDetails('${c.id}')" style="display:inline-flex;align-items:center;gap:6px;font-size:0.825rem;padding:7px 16px;border-color:var(--cust-brown-700);color:var(--cust-brown-800);font-weight:600;border-radius:8px;">
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
      { num: 2, title: 'Risk Assessment', desc: dates.step2 || 'Completed' },
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
if (typeof explainGlossaryTermWithAI === 'function') window.explainGlossaryTermWithAI = explainGlossaryTermWithAI;
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
if (typeof fetchUnderwriterStats === 'function') window.fetchUnderwriterStats = fetchUnderwriterStats;
if (typeof fetchUnderwriterQueue === 'function') window.fetchUnderwriterQueue = fetchUnderwriterQueue;
if (typeof fetchUnderwriterPolicies === 'function') window.fetchUnderwriterPolicies = fetchUnderwriterPolicies;
if (typeof fetchAdminStats === 'function') window.fetchAdminStats = fetchAdminStats;
if (typeof fetchAdminUsers === 'function') window.fetchAdminUsers = fetchAdminUsers;
if (typeof fetchAdminPolicies === 'function') window.fetchAdminPolicies = fetchAdminPolicies;
if (typeof fetchAdminAudit === 'function') window.fetchAdminAudit = fetchAdminAudit;
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
if (typeof toggleRiskTierCard === 'function') window.toggleRiskTierCard = toggleRiskTierCard;
if (typeof toggleGuideStepDetail === 'function') window.toggleGuideStepDetail = toggleGuideStepDetail;
if (typeof closeGuideStepDetail === 'function') window.closeGuideStepDetail = closeGuideStepDetail;
if (typeof toggleDecisionSupportDetail === 'function') window.toggleDecisionSupportDetail = toggleDecisionSupportDetail;
if (typeof closeDecisionSupportDetail === 'function') window.closeDecisionSupportDetail = closeDecisionSupportDetail;
if (typeof initRiskAssessmentGuidelines === 'function') window.initRiskAssessmentGuidelines = initRiskAssessmentGuidelines;
if (typeof initUnderwriterReviewPage === 'function') window.initUnderwriterReviewPage = initUnderwriterReviewPage;
if (typeof populateReviewPolicySelector === 'function') window.populateReviewPolicySelector = populateReviewPolicySelector;
if (typeof selectPolicyForReview === 'function') window.selectPolicyForReview = selectPolicyForReview;
if (typeof switchReviewTab === 'function') window.switchReviewTab = switchReviewTab;
if (typeof toggleRiskFactorExplanation === 'function') window.toggleRiskFactorExplanation = toggleRiskFactorExplanation;
if (typeof updateDocChecklistStatus === 'function') window.updateDocChecklistStatus = updateDocChecklistStatus;
if (typeof jumpToMissingRequirements === 'function') window.jumpToMissingRequirements = jumpToMissingRequirements;
if (typeof promptUnderwritingDecision === 'function') window.promptUnderwritingDecision = promptUnderwritingDecision;
if (typeof selectAndPromptDecision === 'function') window.selectAndPromptDecision = selectAndPromptDecision;
if (typeof confirmUnderwritingDecision === 'function') window.confirmUnderwritingDecision = confirmUnderwritingDecision;
if (typeof openUwModal === 'function') window.openUwModal = openUwModal;
if (typeof closeUwModal === 'function') window.closeUwModal = closeUwModal;
if (typeof closeUwModalOnBackdrop === 'function') window.closeUwModalOnBackdrop = closeUwModalOnBackdrop;
if (typeof handleAdminPasswordReset === 'function') window.handleAdminPasswordReset = handleAdminPasswordReset;
if (typeof handleAdminConfirmAccess === 'function') window.handleAdminConfirmAccess = handleAdminConfirmAccess;
if (typeof renderAgentPoliciesTable === 'function') window.renderAgentPoliciesTable = renderAgentPoliciesTable;
if (typeof handleAgentPolicyFilters === 'function') window.handleAgentPolicyFilters = handleAgentPolicyFilters;
if (typeof getAgentPolicyStatusClass === 'function') window.getAgentPolicyStatusClass = getAgentPolicyStatusClass;

/* ==========================================================================
   CUSTOMER POLICY APPLICATION FLOW (AVAILABLE PRODUCTS, INTAKE & TRACKING)
   ========================================================================== */

const AVAILABLE_POLICY_PRODUCTS = [
  {
    id: 'prod-homeowners',
    policyType: 'Homeowners',
    title: 'Homeowners Premier Protection (HO-3)',
    category: 'property',
    categoryLabel: 'Property & Home',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    description: 'Comprehensive physical damage protection for your primary dwelling, personal belongings, and personal liability against unexpected perils.',
    highlights: [
      'Dwelling replacement coverage up to $750,000',
      'Personal property replacement cost up to $300,000',
      'Personal liability safeguard up to $500,000',
      'Loss of use & temporary living expenses up to $75,000',
      'Sudden pipe discharge & hail storm protection'
    ],
    eligibility: 'Owner-occupied single family residence, townhouse, or approved condo structure in good structural condition.',
    basePremiumYear: 1840,
    basePremiumMonth: 154,
    coverageTiers: {
      Basic: { label: 'Basic', limit: '$300,000 Dwelling / $100,000 Liability', limitNum: 300000, deductible: '$1,500', deductibleNum: 1500, premiumYear: 1450, desc: 'Essential coverage for smaller homes or high-deductible preferences.' },
      Standard: { label: 'Standard (Recommended)', limit: '$450,000 Dwelling / $300,000 Liability', limitNum: 450000, deductible: '$1,000', deductibleNum: 1000, premiumYear: 1840, desc: 'Most popular tier with balanced deductible and comprehensive personal property protection.' },
      Enhanced: { label: 'Enhanced', limit: '$600,000 Dwelling / $500,000 Liability', limitNum: 600000, deductible: '$1,000', deductibleNum: 1000, premiumYear: 2280, desc: 'Expanded limits for higher-value homes including extended replacement cost.' },
      Premium: { label: 'Premium', limit: '$850,000 Dwelling / $1,000,000 Liability', limitNum: 850000, deductible: '$500', deductibleNum: 500, premiumYear: 2950, desc: 'Top-tier executive coverage with minimal deductible and full open-perils protection.' }
    },
    exclusions: [
      'Damage resulting from external flood / storm surge (requires supplemental NFIP flood endorsement)',
      'Earthquake or earth movement unless added by rider',
      'Intentional damage, illegal actions, or normal wear and tear',
      'Undeclared commercial business operations on premises'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Valid Driver License, Passport, or State ID', sample: 'drivers_license.pdf' },
      { type: 'Proof of Ownership', desc: 'Property Deed, Purchase Agreement, or Recent Property Tax Bill', sample: 'property_deed.pdf' },
      { type: 'Home Inspection / Photos', desc: 'Recent home inspection report or 4-corner exterior photos', sample: 'home_photos.pdf' }
    ],
    fields: [
      { id: 'prop_type', label: 'Property Type', type: 'select', options: ['Single Family Home', 'Townhouse / Rowhouse', 'Condominium Unit', 'Multi-Family (2-4 Units)'], required: true },
      { id: 'year_built', label: 'Year Built', type: 'number', placeholder: 'e.g. 2016', required: true },
      { id: 'sqft', label: 'Estimated Living Area (Sq. Ft.)', type: 'number', placeholder: 'e.g. 2400', required: true },
      { id: 'stories', label: 'Number of Stories', type: 'select', options: ['1 Story', '2 Stories', '3+ Stories', 'Split-Level'], required: true },
      { id: 'roof_type', label: 'Roof Material & Age', type: 'select', options: ['Asphalt Shingles (< 10 yrs)', 'Tile / Slate (< 15 yrs)', 'Metal Roofing', 'Flat / Membrane (< 10 yrs)', 'Other / Unknown'], required: true },
      { id: 'security', label: 'Fire & Security Alarms', type: 'select', options: ['Monitored Security & Smoke Alarm', 'Local Smoke Detectors Only', 'Smart Home Security System', 'Gated Community / Guarded'], required: true },
      { id: 'replacement_val', label: 'Estimated Replacement Cost ($)', type: 'number', placeholder: 'e.g. 450000', required: true }
    ]
  },
  {
    id: 'prod-auto',
    policyType: 'Auto',
    title: 'Auto Comprehensive & Collision Protection',
    category: 'vehicle',
    categoryLabel: 'Vehicle & Auto',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    description: 'Complete vehicular coverage protecting against collision impacts, theft, vandalism, weather perils, and high-limit bodily injury liability.',
    highlights: [
      'Bodily injury liability up to $250k / $500k',
      'Property damage liability up to $100,000',
      'Comprehensive & collision protection ($500 standard deductible)',
      '24/7 Roadside Assistance & Emergency Towing included',
      'Rental car reimbursement during collision repair'
    ],
    eligibility: 'Licensed drivers with registered private passenger car, SUV, or light pickup truck.',
    basePremiumYear: 1260,
    basePremiumMonth: 105,
    coverageTiers: {
      Basic: { label: 'State Minimum', limit: '$50k/$100k Liability / $25k Property Damage', limitNum: 50000, deductible: '$1,000', deductibleNum: 1000, premiumYear: 890, desc: 'Meets legal requirements with higher out-of-pocket deductibles.' },
      Standard: { label: 'Standard (Recommended)', limit: '$100k/$300k Liability / $100k Property Damage', limitNum: 100000, deductible: '$500', deductibleNum: 500, premiumYear: 1260, desc: 'Solid protection with comprehensive collision and roadside service.' },
      Enhanced: { label: 'Enhanced', limit: '$250k/$500k Liability / $250k Property Damage', limitNum: 250000, deductible: '$500', deductibleNum: 500, premiumYear: 1650, desc: 'High liability limits and original equipment manufacturer (OEM) parts guarantee.' },
      Premium: { label: 'Premium Total Protect', limit: '$500k Combined Single Limit', limitNum: 500000, deductible: '$250', deductibleNum: 250, premiumYear: 2150, desc: 'Maximum single limit with zero deductible glass replacement and gap coverage.' }
    },
    exclusions: [
      'Commercial rideshare or delivery use without commercial vehicle endorsement',
      'Unlicensed or non-declared household operators',
      'Intentional racing or off-road track events',
      'Normal vehicle wear, engine breakdown, or tire puncture'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Valid Driver’s License of Primary Operator', sample: 'drivers_license.pdf' },
      { type: 'Vehicle Registration / Title', desc: 'Current State Vehicle Registration or Title Certificate', sample: 'vehicle_registration.pdf' },
      { type: 'Prior Insurance Proof', desc: 'Previous auto declarations page or proof of continuous coverage', sample: 'prior_auto_policy.pdf' }
    ],
    fields: [
      { id: 'veh_year', label: 'Vehicle Year', type: 'number', placeholder: 'e.g. 2022', required: true },
      { id: 'veh_make', label: 'Vehicle Make', type: 'text', placeholder: 'e.g. Honda, Toyota, Ford, Tesla', required: true },
      { id: 'veh_model', label: 'Vehicle Model', type: 'text', placeholder: 'e.g. Accord, RAV4, F-150, Model 3', required: true },
      { id: 'veh_vin', label: 'Vehicle Identification Number (VIN)', type: 'text', placeholder: '17-character VIN (e.g. 1HGCR2F83HA000000)', required: true },
      { id: 'veh_usage', label: 'Primary Vehicle Usage', type: 'select', options: ['Commute to Work / School', 'Pleasure / Personal Use Only', 'Business / Sales Calls', 'Commercial / Rideshare'], required: true },
      { id: 'annual_miles', label: 'Estimated Annual Mileage', type: 'select', options: ['Under 7,500 miles/yr (Low Mileage)', '7,500 - 12,000 miles/yr (Average)', '12,000 - 18,000 miles/yr', 'Over 18,000 miles/yr'], required: true },
      { id: 'primary_parking', label: 'Night Parking Location', type: 'select', options: ['Enclosed Private Garage', 'Private Driveway', 'Assigned Parking Lot / Carport', 'Street Parking'], required: true }
    ]
  },
  {
    id: 'prod-commercial',
    policyType: 'Commercial Property',
    title: 'Commercial Property & Asset Protection',
    category: 'commercial',
    categoryLabel: 'Commercial & Business',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
    description: 'Safeguard your commercial buildings, leased office premises, inventory, industrial machinery, and business interruption losses.',
    highlights: [
      'Building replacement protection up to $2,000,000',
      'Business personal property & inventory up to $750,000',
      'Business interruption & lost revenue up to 12 months',
      'Electronic data & computer equipment rider included',
      'Equipment breakdown & machinery protection'
    ],
    eligibility: 'Registered business entities, commercial building owners, or commercial enterprise tenants.',
    basePremiumYear: 2450,
    basePremiumMonth: 204,
    coverageTiers: {
      Basic: { label: 'Small Business Basic', limit: '$500,000 Building / $200,000 Inventory', limitNum: 500000, deductible: '$2,500', deductibleNum: 2500, premiumYear: 1850, desc: 'Ideal for small retail shops or consulting offices.' },
      Standard: { label: 'Standard Commercial', limit: '$1,000,000 Building / $500,000 Inventory', limitNum: 1000000, deductible: '$1,500', deductibleNum: 1500, premiumYear: 2450, desc: 'Balanced commercial protection with business interruption coverage.' },
      Enhanced: { label: 'Enhanced Enterprise', limit: '$2,000,000 Building / $1,000,000 Inventory', limitNum: 2000000, deductible: '$1,000', deductibleNum: 1000, premiumYear: 3600, desc: 'Designed for manufacturing, warehousing, and multi-tenant commercial centers.' }
    },
    exclusions: [
      'War, terrorism, or civil unrest unless specific TRIA rider is attached',
      'Flood / storm surge without specialized commercial NFIP policy',
      'Employee theft or embezzlement (requires Commercial Crime coverage)',
      'Unattended vacancy exceeding 60 consecutive days'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Driver License or Passport of Authorized Officer', sample: 'officer_id.pdf' },
      { type: 'Business Registration / License', desc: 'Articles of Incorporation, LLC Certificate, or Business License', sample: 'business_registration.pdf' },
      { type: 'Commercial Lease or Property Deed', desc: 'Current commercial lease agreement or building deed', sample: 'commercial_lease.pdf' }
    ],
    fields: [
      { id: 'business_name', label: 'Legal Business Name', type: 'text', placeholder: 'e.g. Acme Logistics LLC', required: true },
      { id: 'biz_type', label: 'Commercial Property Use', type: 'select', options: ['Office Premises', 'Retail Storefront', 'Restaurant / Food Service', 'Warehouse / Distribution', 'Light Manufacturing', 'Medical / Clinic'], required: true },
      { id: 'building_construction', label: 'Building Construction Type', type: 'select', options: ['Fire-Resistive Concrete / Steel', 'Masonry / Non-Combustible', 'Joisted Masonry', 'Wood Frame'], required: true },
      { id: 'building_age', label: 'Building Construction Year', type: 'number', placeholder: 'e.g. 2012', required: true },
      { id: 'sqft_occupied', label: 'Total Commercial Square Footage', type: 'number', placeholder: 'e.g. 5000', required: true },
      { id: 'inventory_value', label: 'Estimated Machinery & Inventory Value ($)', type: 'number', placeholder: 'e.g. 250000', required: true },
      { id: 'fire_suppression', label: 'Fire Suppression Systems', type: 'select', options: ['Full Automatic Sprinkler System', 'Partial Sprinklers with Central Alarm', 'Fire Extinguishers & Smoke Detectors Only'], required: true }
    ]
  },
  {
    id: 'prod-liability',
    policyType: 'General Liability',
    title: 'Commercial General Liability (CGL)',
    category: 'commercial',
    categoryLabel: 'Commercial & Business',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    description: 'Defend your business against third-party bodily injury, property damage lawsuits, advertising liabilities, and legal defense costs.',
    highlights: [
      '$1,000,000 per occurrence / $2,000,000 aggregate liability',
      'Third-party bodily injury & property damage defense',
      'Products & completed operations liability protection',
      'Personal & advertising injury safeguard',
      'Immediate legal defense and court settlement funding'
    ],
    eligibility: 'Operating businesses, independent contractors, professional consultancies, and commercial services.',
    basePremiumYear: 1650,
    basePremiumMonth: 137,
    coverageTiers: {
      Basic: { label: 'Small Business Basic', limit: '$500k Occurrence / $1M Aggregate', limitNum: 500000, deductible: '$1,000', deductibleNum: 1000, premiumYear: 1100, desc: 'Essential baseline protection for sole proprietors and independent consultants.' },
      Standard: { label: 'Standard CGL (Recommended)', limit: '$1M Occurrence / $2M Aggregate', limitNum: 1000000, deductible: '$500', deductibleNum: 500, premiumYear: 1650, desc: 'Industry standard required by most corporate clients, landlords, and contracts.' },
      Enhanced: { label: 'Enhanced Enterprise', limit: '$2M Occurrence / $4M Aggregate', limitNum: 2000000, deductible: '$500', deductibleNum: 500, premiumYear: 2450, desc: 'High liability buffer for high-footfall retail, contractors, and hospitality businesses.' }
    },
    exclusions: [
      'Professional errors and omissions (requires dedicated E&O / Professional Liability)',
      'Worker workplace injury (requires statutory Workers’ Compensation)',
      'Pollution or environmental contamination incidents',
      'Cyber data breaches (requires separate Cyber Security coverage)'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Driver License or Passport of Business Owner', sample: 'owner_id.pdf' },
      { type: 'Business Tax Return / Revenue Proof', desc: 'Recent business tax return or 12-month revenue statement', sample: 'tax_return.pdf' },
      { type: 'Commercial Certificate of Good Standing', desc: 'State corporate registration or active license', sample: 'state_license.pdf' }
    ],
    fields: [
      { id: 'cgl_biz_name', label: 'Company / Operating Name', type: 'text', placeholder: 'e.g. Apex Consulting Group Inc.', required: true },
      { id: 'cgl_industry', label: 'Industry & Business Activity', type: 'select', options: ['Professional / IT Services / Consulting', 'Retail Store / E-Commerce', 'Contractor / Building Trades', 'Hospitality / Food & Beverage', 'Health / Fitness / Personal Care', 'Wholesale & Trade'], required: true },
      { id: 'cgl_employees', label: 'Number of Full-Time Employees', type: 'number', placeholder: 'e.g. 8', required: true },
      { id: 'cgl_gross_rev', label: 'Estimated Annual Gross Revenue ($)', type: 'number', placeholder: 'e.g. 750000', required: true },
      { id: 'cgl_years_op', label: 'Years in Continuous Operation', type: 'select', options: ['Under 1 Year (New Venture)', '1 - 3 Years', '3 - 5 Years', '5+ Years Established'], required: true },
      { id: 'cgl_subcontractors', label: 'Do you utilize subcontractors?', type: 'select', options: ['No, 100% In-House Staff', 'Yes, with verified certificates of insurance', 'Yes, occasional freelance assistance'], required: true }
    ]
  },
  {
    id: 'prod-renters',
    policyType: 'Renters',
    title: 'Renters Protection Policy (HO-4)',
    category: 'property',
    categoryLabel: 'Property & Home',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="12" y1="15" x2="12" y2="21"/></svg>`,
    description: 'Affordable safeguard for tenants renting apartments, condos, or single-family homes covering personal belongings, electronics, and personal liability.',
    highlights: [
      'Personal property replacement cost up to $100,000',
      'Personal liability coverage up to $300,000',
      'Worldwide theft protection for laptops & valuables',
      'Temporary loss of use & hotel reimbursement up to $25,000',
      'Guest medical payments protection included'
    ],
    eligibility: 'Tenants residing in leased apartments, rental condominiums, or single-family rental dwellings.',
    basePremiumYear: 360,
    basePremiumMonth: 30,
    coverageTiers: {
      Basic: { label: 'Essential Renters', limit: '$25,000 Belongings / $100,000 Liability', limitNum: 25000, deductible: '$500', deductibleNum: 500, premiumYear: 240, desc: 'Great for studio or 1-bedroom apartments.' },
      Standard: { label: 'Standard (Recommended)', limit: '$50,000 Belongings / $300,000 Liability', limitNum: 50000, deductible: '$500', deductibleNum: 500, premiumYear: 360, desc: 'Complete coverage satisfying all standard landlord lease requirements.' },
      Enhanced: { label: 'Enhanced Protection', limit: '$100,000 Belongings / $500,000 Liability', limitNum: 100000, deductible: '$250', deductibleNum: 250, premiumYear: 490, desc: 'Designed for larger residences with high-value electronics and jewelry schedules.' }
    },
    exclusions: [
      'Building physical structure or landlord fixtures (covered under Landlord policy)',
      'Floods or water backup unless optional rider is selected',
      'Intentional loss or roommate property without co-insured endorsement'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Valid Driver’s License or Passport', sample: 'drivers_license.pdf' },
      { type: 'Residential Lease Agreement', desc: 'Current signed tenant lease agreement indicating address and unit', sample: 'lease_agreement.pdf' }
    ],
    fields: [
      { id: 'rental_address', label: 'Rental Unit Address & Unit Number', type: 'text', placeholder: 'e.g. 742 Evergreen Terrace, Apt 4B', required: true },
      { id: 'landlord_name', label: 'Landlord / Property Management Name', type: 'text', placeholder: 'e.g. Skyline Property Management', required: true },
      { id: 'lease_term', label: 'Current Lease Term', type: 'select', options: ['12-Month Standard Lease', '6-Month Lease', 'Month-to-Month', '2-Year Multi-Year Lease'], required: true },
      { id: 'personal_belongings_val', label: 'Estimated Personal Belongings Value ($)', type: 'number', placeholder: 'e.g. 45000', required: true },
      { id: 'has_roommates', label: 'Any Unrelated Roommates?', type: 'select', options: ['No, Single Tenant / Family Only', 'Yes, 1 Roommate', 'Yes, 2+ Roommates'], required: true }
    ]
  },
  {
    id: 'prod-umbrella',
    policyType: 'Personal Umbrella',
    title: 'Personal Umbrella Excess Liability',
    category: 'umbrella',
    categoryLabel: 'Personal Umbrella',
    iconSvg: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12A10 10 0 0 0 12 2v10z"/><path d="M12 12a10 10 0 0 0-10 0v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2a10 10 0 0 0 5-5"/></svg>`,
    description: 'High-limit secondary liability protection that attaches above your primary Auto and Homeowners policies against severe, multimillion-dollar claims.',
    highlights: [
      'Additional $1,000,000 to $5,000,000 in excess liability protection',
      'Worldwide territory protection for auto accidents and personal acts',
      'Coverage for personal injury lawsuits, libel, slander, and false arrest',
      'Pays legal defense fees above policy limits without deductible',
      'Protects family savings, investments, home equity, and future wages'
    ],
    eligibility: 'Individuals holding underlying active Auto ($250k/$500k) and Homeowners ($300k) policies in good standing.',
    basePremiumYear: 480,
    basePremiumMonth: 40,
    coverageTiers: {
      Standard: { label: '$1,000,000 Umbrella', limit: '$1,000,000 Excess Limit', limitNum: 1000000, deductible: '$0 Self-Insured Retention', deductibleNum: 0, premiumYear: 380, desc: 'Essential protection for families with primary home and vehicle.' },
      Enhanced: { label: '$2,000,000 Umbrella (Popular)', limit: '$2,000,000 Excess Limit', limitNum: 2000000, deductible: '$0 Self-Insured Retention', deductibleNum: 0, premiumYear: 520, desc: 'High-recommendation tier for homeowners with teen drivers or rental assets.' },
      Premium: { label: '$5,000,000 Umbrella', limit: '$5,000,000 Excess Limit', limitNum: 5000000, deductible: '$0 Self-Insured Retention', deductibleNum: 0, premiumYear: 890, desc: 'High-net-worth protection shielding substantial real estate and investment portfolios.' }
    },
    exclusions: [
      'Commercial or business enterprise activities (requires Commercial Umbrella)',
      'Intentional criminal acts or punitive damage penalties where prohibited by law',
      'Damage to personal property owned by the policyholder (liability-only policy)'
    ],
    requiredDocs: [
      { type: 'Government ID Proof', desc: 'Valid Driver’s License or Passport', sample: 'drivers_license.pdf' },
      { type: 'Underlying Auto Policy Dec Page', desc: 'Current declarations page showing minimum $250k/$500k liability', sample: 'auto_declarations.pdf' },
      { type: 'Underlying Homeowners Dec Page', desc: 'Current declarations page showing minimum $300k personal liability', sample: 'home_declarations.pdf' }
    ],
    fields: [
      { id: 'underlying_auto_pol', label: 'Primary Auto Policy Number', type: 'text', placeholder: 'e.g. POL-2025-0100006', required: true },
      { id: 'underlying_home_pol', label: 'Primary Homeowners / Renters Policy Number', type: 'text', placeholder: 'e.g. POL-2025-0100002', required: true },
      { id: 'num_vehicles', label: 'Total Number of Household Vehicles', type: 'number', placeholder: 'e.g. 2', required: true },
      { id: 'num_drivers', label: 'Number of Licensed Drivers in Household', type: 'number', placeholder: 'e.g. 2', required: true },
      { id: 'has_watercraft', label: 'Do you own boats, recreational vehicles, or rental properties?', type: 'select', options: ['No recreational watercraft or secondary rentals', 'Yes, watercraft / RV owned', 'Yes, secondary rental properties owned'], required: true }
    ]
  }
];

window.policyAppState = {
  activeTab: 'available',
  activeCategory: 'all',
  step: 1,
  selectedProduct: null,
  selectedTier: 'Standard',
  durationMonths: 12,
  effectiveDate: '',
  applicantInfo: {},
  policySpecificData: {},
  uploadedDocs: [],
  applications: []
};

function initPolicyApplicationModule() {
  renderAvailablePoliciesCatalog();
  // Ensure customer profile data is populated for Step 1
  if (window.customerProfileData) {
    window.policyAppState.applicantInfo = {
      name: window.customerProfileData.name || '',
      email: window.customerProfileData.email || '',
      phone: window.customerProfileData.phone || '',
      address: window.customerProfileData.address || '',
      id: window.customerProfileData.id || ''
    };
  }
}

function renderAvailablePoliciesCatalog() {
  const grid = document.getElementById('policy-catalog-cards-grid');
  if (!grid) return;

  const currentCat = window.policyAppState.activeCategory || 'all';
  const products = AVAILABLE_POLICY_PRODUCTS.filter(p => {
    if (currentCat === 'all') return true;
    return p.category === currentCat;
  });

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">No insurance products found in this category.</div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="policy-product-card">
      <div class="policy-product-card-body" style="display:flex;flex-direction:column;flex:1 1 auto;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--cust-brown-100);color:var(--cust-brown-800);display:flex;align-items:center;justify-content:center;">
            ${p.iconSvg}
          </div>
          <span class="badge" style="background:#FAF6F0;border:1px solid var(--cust-cream-border);color:var(--cust-brown-800);font-size:0.75rem;font-weight:600;">
            ${p.categoryLabel}
          </span>
        </div>

        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;color:var(--cust-brown-900);margin:0 0 8px;line-height:1.3;">
          ${p.title}
        </h3>
        <p style="font-size:0.825rem;color:var(--gray-600);margin:0 0 16px;line-height:1.5;">
          ${p.description}
        </p>

        <div style="margin-bottom:16px;">
          <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700;color:var(--cust-brown-700);margin-bottom:8px;">
            Key Coverage Highlights:
          </div>
          <ul style="margin:0;padding-left:16px;font-size:0.8rem;color:var(--gray-700);line-height:1.6;">
            ${p.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="policy-product-card-footer" style="border-top:1px solid var(--cust-cream-border);padding-top:14px;margin-top:auto;flex-shrink:0;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <span style="font-size:0.78rem;color:var(--gray-500);">Starting from:</span>
          <div>
            <span style="font-size:1.25rem;font-weight:800;color:var(--cust-brown-900);">$${p.basePremiumYear.toLocaleString()}</span>
            <span style="font-size:0.78rem;color:var(--gray-600);">/yr</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:8px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="openPolicyDetailsModal('${p.id}', 'catalog')" style="font-weight:600;font-size:0.8rem;">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="startPolicyApplication('${p.id}')" style="font-weight:700;font-size:0.8rem;display:flex;align-items:center;justify-content:center;gap:4px;">
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPolicyCatalog(category) {
  window.policyAppState.activeCategory = category;
  document.querySelectorAll('#catalog-category-filter-pills .btn-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
  });
  renderAvailablePoliciesCatalog();
}

function switchPolicyAppTab(tab) {
  window.policyAppState.activeTab = tab;
  const availContainer = document.getElementById('view-available-policies-container');
  const myAppsContainer = document.getElementById('view-my-applications-container');
  const btnAvail = document.getElementById('tab-btn-available-policies');
  const btnMyApps = document.getElementById('tab-btn-my-applications');

  if (tab === 'available') {
    if (availContainer) availContainer.style.display = 'block';
    if (myAppsContainer) myAppsContainer.style.display = 'none';
    if (btnAvail) {
      btnAvail.classList.add('active');
      btnAvail.style.borderBottom = '2px solid var(--cust-brown-700)';
      btnAvail.style.color = 'var(--cust-brown-900)';
    }
    if (btnMyApps) {
      btnMyApps.classList.remove('active');
      btnMyApps.style.borderBottom = '2px solid transparent';
      btnMyApps.style.color = 'var(--gray-500)';
    }
  } else {
    if (availContainer) availContainer.style.display = 'none';
    if (myAppsContainer) myAppsContainer.style.display = 'block';
    if (btnMyApps) {
      btnMyApps.classList.add('active');
      btnMyApps.style.borderBottom = '2px solid var(--cust-brown-700)';
      btnMyApps.style.color = 'var(--cust-brown-900)';
    }
    if (btnAvail) {
      btnAvail.classList.remove('active');
      btnAvail.style.borderBottom = '2px solid transparent';
      btnAvail.style.color = 'var(--gray-500)';
    }
    fetchCustomerApplications();
  }
}

function openPolicyDetailsModal(productId, context) {
  const product = AVAILABLE_POLICY_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('modal-policy-details');
  const title = document.getElementById('modal-policy-title');
  const sub = document.getElementById('modal-policy-subtitle');
  const body = document.getElementById('modal-policy-details-body');
  const applyBtn = document.getElementById('modal-policy-apply-btn');
  const modalFooter = modal ? modal.querySelector('.uw-modal-footer') : null;

  if (title) title.textContent = product.title;
  if (sub) sub.textContent = `${product.categoryLabel} · Starting from $${product.basePremiumYear.toLocaleString()}/yr ($${product.basePremiumMonth}/mo)`;

  const formStage = document.getElementById('policy-application-form-stage');
  const isInsideActiveApp = (context === 'active_app') || (context !== 'catalog' && formStage && formStage.style.display !== 'none' && formStage.style.display !== '');

  if (applyBtn) {
    if (isInsideActiveApp) {
      applyBtn.style.display = 'none';
      if (modalFooter) modalFooter.style.justifyContent = 'flex-end';
    } else {
      applyBtn.style.display = 'inline-flex';
      applyBtn.setAttribute('onclick', `applyFromPolicyModal('${product.id}')`);
      if (modalFooter) modalFooter.style.justifyContent = 'space-between';
    }
  }

  if (body) {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <!-- Description Banner -->
        <div style="background:#FAF6F0;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem 1.25rem;font-size:0.875rem;color:var(--cust-brown-900);line-height:1.5;">
          <strong>Overview:</strong> ${product.description}
        </div>

        <!-- 2 Columns: What is Covered vs Exclusions -->
        <div class="grid grid-2" style="gap:1rem;">
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:1rem 1.25rem;">
            <div style="font-size:0.825rem;font-weight:700;color:#166534;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <svg width="16" height="16" fill="none" stroke="#16A34A" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              What is Covered
            </div>
            <ul style="margin:0;padding-left:18px;font-size:0.8rem;color:#15803D;line-height:1.6;">
              ${product.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>

          <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:1rem 1.25rem;">
            <div style="font-size:0.825rem;font-weight:700;color:#9A3412;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <svg width="16" height="16" fill="none" stroke="#EA580C" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              What is Not Covered (Exclusions)
            </div>
            <ul style="margin:0;padding-left:18px;font-size:0.8rem;color:#C2410C;line-height:1.6;">
              ${product.exclusions.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Coverage Tiers Table -->
        <div style="background:#fff;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem 1.25rem;">
          <div style="font-size:0.825rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;">
            Coverage Tiers & Deductible Options
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${Object.entries(product.coverageTiers).map(([tierKey, tier]) => `
              <div style="display:flex;justify-content:space-between;align-items:center;background:#FAF6F0;border-radius:6px;padding:8px 12px;font-size:0.8rem;flex-wrap:wrap;gap:6px;">
                <div>
                  <strong style="color:var(--cust-brown-900);">${tier.label}:</strong>
                  <span style="color:var(--gray-700);margin-left:4px;">${tier.limit}</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                  <span style="color:var(--gray-600);">Deductible: <strong>${tier.deductible}</strong></span>
                  <span style="font-weight:700;color:var(--cust-brown-800);background:#fff;border:1px solid var(--cust-cream-border);padding:2px 8px;border-radius:4px;">
                    ~$${tier.premiumYear}/yr
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Required Information & Documents -->
        <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem 1.25rem;">
          <div style="font-size:0.825rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:6px;">
            Required Verification Documents:
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:0.8rem;color:var(--gray-700);">
            ${product.requiredDocs.map(d => `
              <div>• <strong>${d.type}:</strong> ${d.desc}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (modal) modal.style.display = 'flex';
}

function closePolicyAppModal(event, modalId) {
  const modal = document.getElementById(modalId);
  if (modal && event.target === modal) {
    modal.style.display = 'none';
  }
}

function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

function applyFromPolicyModal(productId) {
  closeModalById('modal-policy-details');
  if (productId) {
    startPolicyApplication(productId);
  } else if (window.policyAppState.selectedProduct) {
    startPolicyApplication(window.policyAppState.selectedProduct.id);
  }
}

function openSelectedProductDetailsModal() {
  if (window.policyAppState.selectedProduct) {
    openPolicyDetailsModal(window.policyAppState.selectedProduct.id, 'active_app');
  }
}

function startPolicyApplication(productId) {
  const product = AVAILABLE_POLICY_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  window.policyAppState.selectedProduct = product;
  window.policyAppState.selectedTier = 'Standard';
  window.policyAppState.durationMonths = 12;
  window.policyAppState.uploadedDocs = [];
  window.policyAppState.policySpecificData = {};

  // Pre-fill effective date to tomorrow (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  window.policyAppState.effectiveDate = tomorrowStr;

  // Toggle stage visibility
  const catalogStage = document.getElementById('policy-catalog-stage');
  const formStage = document.getElementById('policy-application-form-stage');
  if (catalogStage) catalogStage.style.display = 'none';
  if (formStage) formStage.style.display = 'block';

  // Set Product Header Info
  const titleEl = document.getElementById('app-form-product-title');
  const catEl = document.getElementById('app-form-product-category-badge');
  if (titleEl) titleEl.textContent = product.title;
  if (catEl) catEl.textContent = product.categoryLabel;

  // Populate Step 1 Pre-filled Customer Info
  populateCustomerInfoStep();

  // Populate Step 2 Coverage Tiers
  renderCoverageTiers();

  // Populate Step 3 Dynamic Fields
  renderPolicySpecificFields();

  // Populate Step 4 Required Docs
  renderRequiredDocsChecklist();
  renderUploadedFilesList();

  // Go to step 1
  policyAppGoToStep(1);
}

function cancelPolicyApplication() {
  const catalogStage = document.getElementById('policy-catalog-stage');
  const formStage = document.getElementById('policy-application-form-stage');
  if (catalogStage) catalogStage.style.display = 'block';
  if (formStage) formStage.style.display = 'none';
  window.policyAppState.selectedProduct = null;
}

function resetPolicyAppFlow() {
  cancelPolicyApplication();
  renderAvailablePoliciesCatalog();
}

function populateCustomerInfoStep() {
  const prof = window.customerProfileData || {};
  const nameInp = document.getElementById('app-cust-name');
  const emailInp = document.getElementById('app-cust-email');
  const phoneInp = document.getElementById('app-cust-phone');
  const idInp = document.getElementById('app-cust-id');
  const addrInp = document.getElementById('app-cust-address');

  if (nameInp) nameInp.value = prof.name || 'Valued Customer';
  if (emailInp) emailInp.value = prof.email || 'customer@example.com';
  if (phoneInp) phoneInp.value = prof.phone || '(555) 234-5678';
  if (idInp) idInp.value = prof.id || '50001';
  if (addrInp) addrInp.value = prof.address || '124 Grand Avenue, Suite 400, Chicago, IL 60611';
}

function policyAppGoToStep(targetStep) {
  if (targetStep < 1 || targetStep > 6) return;
  window.policyAppState.step = targetStep;

  // Update step panes visibility
  for (let i = 1; i <= 6; i++) {
    const pane = document.getElementById(`app-step-pane-${i}`);
    if (pane) pane.style.display = (i === targetStep) ? 'block' : 'none';
  }

  // Update stepper bar visual nodes
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (!node) continue;
    const circle = node.querySelector('.step-circle');
    const title = node.querySelector('.step-title');

    if (i < targetStep) {
      // Completed step
      node.classList.add('completed');
      node.classList.remove('active');
      if (circle) {
        circle.style.background = '#059669';
        circle.style.color = '#fff';
        circle.innerHTML = '✓';
      }
      if (title) title.style.color = '#059669';
    } else if (i === targetStep) {
      // Active step
      node.classList.add('active');
      node.classList.remove('completed');
      if (circle) {
        circle.style.background = 'var(--cust-brown-700)';
        circle.style.color = '#fff';
        circle.textContent = i.toString();
      }
      if (title) title.style.color = 'var(--cust-brown-900)';
    } else {
      // Upcoming step
      node.classList.remove('active', 'completed');
      if (circle) {
        circle.style.background = 'var(--gray-200)';
        circle.style.color = 'var(--gray-600)';
        circle.textContent = i.toString();
      }
      if (title) title.style.color = 'var(--gray-500)';
    }
  }

  if (targetStep === 5) {
    populateReviewStep();
  }
}

function policyAppNextStep(currentStep) {
  if (currentStep === 1) {
    // Save Step 1 contact values
    const phoneInp = document.getElementById('app-cust-phone');
    const addrInp = document.getElementById('app-cust-address');
    const notesInp = document.getElementById('app-cust-notes');
    window.policyAppState.applicantInfo = {
      name: document.getElementById('app-cust-name')?.value || '',
      email: document.getElementById('app-cust-email')?.value || '',
      phone: phoneInp?.value || '',
      address: addrInp?.value || '',
      id: document.getElementById('app-cust-id')?.value || '',
      notes: notesInp?.value || ''
    };
    policyAppGoToStep(2);
  } else if (currentStep === 2) {
    // Save Step 2 date & term
    const dateInp = document.getElementById('app-effective-date');
    if (dateInp && dateInp.value) {
      window.policyAppState.effectiveDate = dateInp.value;
    }
    policyAppGoToStep(3);
  } else if (currentStep === 3) {
    // Collect & Validate Step 3 inputs
    const p = window.policyAppState.selectedProduct;
    if (p && p.fields) {
      for (const field of p.fields) {
        const inp = document.getElementById(`dyn-field-${field.id}`);
        if (inp) {
          if (field.required && !inp.value.trim()) {
            showToast(`Please complete required field: ${field.label}`, 'error');
            inp.focus();
            return;
          }
          window.policyAppState.policySpecificData[field.id] = inp.value.trim();
        }
      }
    }
    policyAppGoToStep(4);
  } else if (currentStep === 4) {
    // Validate that at least one document is uploaded
    const alertEl = document.getElementById('app-doc-validation-alert');
    if (window.policyAppState.uploadedDocs.length === 0) {
      if (alertEl) alertEl.style.display = 'block';
      showToast('Please upload at least one verification document before proceeding.', 'error');
      return;
    }
    if (alertEl) alertEl.style.display = 'none';
    policyAppGoToStep(5);
  }
}

function renderCoverageTiers() {
  const container = document.getElementById('app-coverage-tiers-container');
  const product = window.policyAppState.selectedProduct;
  if (!container || !product || !product.coverageTiers) return;

  const selectedTierKey = window.policyAppState.selectedTier || 'Standard';
  const tierCount = Object.keys(product.coverageTiers).length;

  container.className = tierCount === 4 ? 'grid grid-4' : (tierCount === 3 ? 'grid grid-3' : 'grid');

  container.innerHTML = Object.entries(product.coverageTiers).map(([tierKey, tier]) => {
    const isSelected = (tierKey === selectedTierKey);
    return `
      <div class="coverage-tier-card ${isSelected ? 'selected' : ''}" onclick="selectCoverageTier('${tierKey}')" id="tier-card-${tierKey}">
        <div class="coverage-tier-card-body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;min-height:24px;">
            <span style="font-weight:700;font-size:0.95rem;color:var(--cust-brown-900);line-height:1.3;">${tier.label}</span>
            ${isSelected ? `<span style="background:var(--cust-brown-700);color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0;margin-left:6px;">✓</span>` : ''}
          </div>
          <div style="font-size:0.8rem;color:var(--gray-700);margin-bottom:8px;line-height:1.4;">
            ${tier.limit}
          </div>
          <div class="coverage-tier-desc">
            ${tier.desc}
          </div>
        </div>
        <div class="coverage-tier-card-footer" style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:0.75rem;color:var(--gray-500);">Deductible: <strong>${tier.deductible}</strong></span>
          <span style="font-size:1.1rem;font-weight:800;color:var(--cust-brown-900);">$${tier.premiumYear}/yr</span>
        </div>
      </div>
    `;
  }).join('');

  // Set default effective date if empty
  const dateInp = document.getElementById('app-effective-date');
  if (dateInp && !dateInp.value) {
    dateInp.value = window.policyAppState.effectiveDate;
  }

  updateEstimatedPremiumDisplay();
}

function selectCoverageTier(tierKey) {
  window.policyAppState.selectedTier = tierKey;
  renderCoverageTiers();
}

function selectAppDuration(months) {
  window.policyAppState.durationMonths = months;
  document.querySelectorAll('#app-duration-selectors .btn-duration-pill').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-months')) === months);
  });
  updateEstimatedPremiumDisplay();
}

function updateEstimatedPremiumDisplay() {
  const product = window.policyAppState.selectedProduct;
  if (!product) return;

  const tierKey = window.policyAppState.selectedTier || 'Standard';
  const tier = product.coverageTiers[tierKey] || Object.values(product.coverageTiers)[0];
  const months = window.policyAppState.durationMonths || 12;

  let calculated = tier.premiumYear;
  if (months === 6) calculated = Math.round(tier.premiumYear * 0.52);
  else if (months === 24) calculated = Math.round(tier.premiumYear * 1.9);

  const premEl = document.getElementById('app-estimated-premium-display');
  const dedEl = document.getElementById('app-deductible-display');

  if (premEl) premEl.textContent = `$${calculated.toLocaleString()} (${months} Months)`;
  if (dedEl) dedEl.textContent = tier.deductible;
}

function renderPolicySpecificFields() {
  const container = document.getElementById('app-policy-specific-fields-container');
  const subEl = document.getElementById('app-step3-subtitle');
  const product = window.policyAppState.selectedProduct;
  if (!container || !product) return;

  if (subEl) {
    subEl.textContent = `Please answer these specific risk parameters for ${product.title}:`;
  }

  if (!product.fields || product.fields.length === 0) {
    container.innerHTML = `<div style="color:var(--gray-600);font-size:0.85rem;">No additional specifications required for this policy.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-2" style="gap:1.25rem;">
      ${product.fields.map(f => {
        const val = window.policyAppState.policySpecificData[f.id] || '';
        if (f.type === 'select') {
          return `
            <div class="form-group">
              <label style="font-size:0.8rem;font-weight:600;color:var(--cust-brown-800);margin-bottom:4px;display:block;">
                ${f.label} ${f.required ? '<span style="color:#DC2626;">*</span>' : ''}
              </label>
              <select id="dyn-field-${f.id}" class="form-control">
                ${f.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
          `;
        } else {
          return `
            <div class="form-group">
              <label style="font-size:0.8rem;font-weight:600;color:var(--cust-brown-800);margin-bottom:4px;display:block;">
                ${f.label} ${f.required ? '<span style="color:#DC2626;">*</span>' : ''}
              </label>
              <input type="${f.type}" id="dyn-field-${f.id}" class="form-control" placeholder="${f.placeholder || ''}" value="${val}" ${f.required ? 'required' : ''}>
            </div>
          `;
        }
      }).join('')}
    </div>
  `;
}

function renderRequiredDocsChecklist() {
  const checklist = document.getElementById('app-required-docs-checklist');
  const product = window.policyAppState.selectedProduct;
  if (!checklist || !product || !product.requiredDocs) return;

  checklist.innerHTML = product.requiredDocs.map(d => `
    <div style="display:flex;align-items:flex-start;gap:8px;">
      <span style="color:#059669;font-weight:bold;">✓</span>
      <div>
        <strong>${d.type}:</strong> ${d.desc}
      </div>
    </div>
  `).join('');
}

function triggerAppDocUpload() {
  const fileInp = document.getElementById('app-doc-file-input');
  if (fileInp) fileInp.click();
}

function handleAppFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const alertEl = document.getElementById('app-doc-validation-alert');
  if (alertEl) alertEl.style.display = 'none';

  const product = window.policyAppState.selectedProduct;
  const reqTypes = (product && product.requiredDocs) ? product.requiredDocs.map(d => d.type) : ['ID Proof', 'Verification Document'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // File size check: 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast(`File "${file.name}" exceeds 10MB limit.`, 'error');
      continue;
    }

    const assignedType = reqTypes[window.policyAppState.uploadedDocs.length % reqTypes.length];
    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    window.policyAppState.uploadedDocs.push({
      doc_type: assignedType,
      file_name: file.name,
      file_size: sizeFormatted,
      file_data: '',
      uploaded_at: new Date().toISOString()
    });
  }

  renderUploadedFilesList();
  showToast(`Added ${files.length} document(s).`);
}

function removeAppDoc(index) {
  if (index >= 0 && index < window.policyAppState.uploadedDocs.length) {
    const removed = window.policyAppState.uploadedDocs.splice(index, 1);
    renderUploadedFilesList();
    showToast(`Removed ${removed[0].file_name}`);
  }
}

function renderUploadedFilesList() {
  const container = document.getElementById('app-uploaded-files-container');
  const noHint = document.getElementById('app-no-files-hint');
  if (!container) return;

  const docs = window.policyAppState.uploadedDocs || [];
  if (noHint) noHint.style.display = (docs.length === 0) ? 'block' : 'none';

  container.innerHTML = docs.map((doc, idx) => `
    <div class="app-doc-badge">
      <div style="display:flex;align-items:center;gap:10px;overflow:hidden;">
        <div style="width:32px;height:32px;border-radius:6px;background:#F0FDF4;color:#059669;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <div style="font-weight:600;color:var(--cust-brown-900);">${doc.file_name}</div>
          <div style="font-size:0.75rem;color:var(--gray-500);">${doc.doc_type} · ${doc.file_size} · Ready</div>
        </div>
      </div>
      <button type="button" onclick="removeAppDoc(${idx})" style="border:none;background:transparent;color:#DC2626;cursor:pointer;padding:4px 8px;font-size:1rem;" title="Remove document">✕</button>
    </div>
  `).join('');
}

function populateReviewStep() {
  const product = window.policyAppState.selectedProduct;
  const applicant = window.policyAppState.applicantInfo || {};
  const tierKey = window.policyAppState.selectedTier || 'Standard';
  const tier = (product && product.coverageTiers) ? product.coverageTiers[tierKey] : {};
  const months = window.policyAppState.durationMonths || 12;

  // Box 1
  document.getElementById('rev-applicant-name').textContent = applicant.name || 'Valued Customer';
  document.getElementById('rev-applicant-email').textContent = applicant.email || '-';
  document.getElementById('rev-applicant-phone').textContent = applicant.phone || '-';
  document.getElementById('rev-applicant-address').textContent = applicant.address || '-';

  // Box 2
  document.getElementById('rev-policy-product').textContent = product ? product.title : '-';
  document.getElementById('rev-coverage-tier').textContent = tier.label || tierKey;
  document.getElementById('rev-limit-deductible').textContent = `${tier.limit || '-'} (Deductible: ${tier.deductible || '$1,000'})`;
  document.getElementById('rev-term-dates').textContent = `${months} Months (Starting ${window.policyAppState.effectiveDate || 'Tomorrow'})`;

  let calcPrem = tier.premiumYear || 1200;
  if (months === 6) calcPrem = Math.round(calcPrem * 0.52);
  else if (months === 24) calcPrem = Math.round(calcPrem * 1.9);
  document.getElementById('rev-premium-value').textContent = `$${calcPrem.toLocaleString()} (${months} Months)`;

  // Box 3: Specific Data
  const specSummary = document.getElementById('rev-specific-data-summary');
  if (specSummary && product && product.fields) {
    const data = window.policyAppState.policySpecificData || {};
    specSummary.innerHTML = product.fields.map(f => `
      <div><strong style="color:var(--cust-brown-900);">${f.label}:</strong> <span>${data[f.id] || 'Not specified'}</span></div>
    `).join('');
  }

  // Box 4: Docs
  const docsSummary = document.getElementById('rev-documents-summary-list');
  const docsCount = document.getElementById('rev-docs-count');
  const docs = window.policyAppState.uploadedDocs || [];
  if (docsCount) docsCount.textContent = docs.length.toString();

  if (docsSummary) {
    if (docs.length === 0) {
      docsSummary.innerHTML = `<span style="color:#DC2626;">No documents attached.</span>`;
    } else {
      docsSummary.innerHTML = docs.map(d => `
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:#059669;">✓</span>
          <span><strong>${d.doc_type}:</strong> ${d.file_name} (${d.file_size})</span>
        </div>
      `).join('');
    }
  }

  // Reset declaration checkbox
  const chk = document.getElementById('app-declaration-checkbox');
  if (chk) chk.checked = false;
}

async function submitFinalPolicyApplication() {
  const chk = document.getElementById('app-declaration-checkbox');
  if (!chk || !chk.checked) {
    showToast('Please check the Applicant Declaration box before submitting.', 'error');
    if (chk) chk.focus();
    return;
  }

  const submitBtn = document.getElementById('btn-submit-policy-app');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;display:inline-block;animation:spin 0.8s linear infinite;"></span> Submitting to Underwriting...`;
  }

  const product = window.policyAppState.selectedProduct;
  const tierKey = window.policyAppState.selectedTier || 'Standard';
  const tier = product.coverageTiers[tierKey] || {};
  const months = window.policyAppState.durationMonths || 12;

  let calculatedPrem = tier.premiumYear || 1200;
  if (months === 6) calculatedPrem = Math.round(calculatedPrem * 0.52);
  else if (months === 24) calculatedPrem = Math.round(calculatedPrem * 1.9);

  const payload = {
    policy_type: product.policyType,
    product_name: product.title,
    coverage_tier: tierKey,
    coverage_limit: tier.limitNum || 300000,
    deductible: tier.deductibleNum || 1000,
    duration_months: months,
    start_date: window.policyAppState.effectiveDate || new Date().toISOString().split('T')[0],
    estimated_premium: calculatedPrem,
    applicant_info: window.policyAppState.applicantInfo || {},
    policy_specific_data: window.policyAppState.policySpecificData || {},
    documents: (window.policyAppState.uploadedDocs || []).map(d => ({
      doc_type: d.doc_type,
      file_name: d.file_name,
      file_size: d.file_size,
      file_data: d.file_data || '',
      uploaded_at: d.uploaded_at
    }))
  };

  const token = (typeof getActiveToken === 'function') ? getActiveToken() : localStorage.getItem('auth_token');

  try {
    const res = await fetch('http://localhost:8002/customer/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const refNum = data.application_id || 'APP-2026-SUCCESS';

    const refEl = document.getElementById('app-confirmed-ref-number');
    if (refEl) refEl.textContent = refNum;

    // Show Confirmation Step
    policyAppGoToStep(6);
    showToast(`Application ${refNum} submitted successfully!`);

    // Refresh applications count in background
    fetchCustomerApplications();
  } catch (err) {
    console.error('Error submitting application:', err);
    showToast(`Submission failed: ${err.message}`, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Submit Application`;
    }
  }
}

async function fetchCustomerApplications(manualToast = false) {
  const token = (typeof getActiveToken === 'function') ? getActiveToken() : localStorage.getItem('auth_token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:8002/customer/applications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      const apps = await res.json();
      window.policyAppState.applications = apps || [];

      // Update badge count
      const badge = document.getElementById('my-apps-badge-count');
      if (badge) badge.textContent = (apps.length || 0).toString();

      renderMyApplicationsList();
      if (manualToast) showToast(`Refreshed ${apps.length} application(s).`);
    }
  } catch (e) {
    console.warn('Unable to load customer applications:', e);
  }
}

function renderMyApplicationsList() {
  const container = document.getElementById('my-applications-cards-container');
  if (!container) return;

  const currentStatusFilter = window.policyAppState.activeAppStatusFilter || 'all';
  const apps = (window.policyAppState.applications || []).filter(a => {
    if (currentStatusFilter === 'all') return true;
    return (a.status || '').toLowerCase() === currentStatusFilter.toLowerCase();
  });

  if (apps.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem 1.5rem;background:#fff;border:1px dashed var(--cust-cream-border);border-radius:12px;">
        <div style="width:48px;height:48px;border-radius:50%;background:var(--cust-brown-100);color:var(--cust-brown-800);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h4 style="font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;color:var(--cust-brown-900);margin:0 0 6px;">No Submitted Applications</h4>
        <p style="font-size:0.85rem;color:var(--gray-600);margin:0 0 16px;max-width:400px;margin-left:auto;margin-right:auto;">
          You have not submitted any policy applications yet. Explore our supported insurance lines and apply online.
        </p>
        <button type="button" class="btn btn-primary btn-sm" onclick="switchPolicyAppTab('available')">
          Browse Available Policies →
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = apps.map(app => {
    let statusBg = '#ECFDF5';
    let statusColor = '#065F46';
    const st = (app.status || 'Submitted').toLowerCase();
    if (st.includes('reject')) {
      statusBg = '#FEF2F2';
      statusColor = '#991B1B';
    } else if (st.includes('review') || st.includes('pending')) {
      statusBg = '#FFFBEB';
      statusColor = '#92400E';
    }

    const subDate = app.created_at ? app.created_at.split('T')[0] : 'Today';

    return `
      <div class="my-app-card">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--cust-brown-100);color:var(--cust-brown-800);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
              <span style="font-family:monospace;font-weight:700;font-size:0.95rem;color:var(--cust-brown-900);">${app.application_id}</span>
              <span class="badge" style="background:${statusBg};color:${statusColor};font-size:0.75rem;font-weight:600;">
                ${app.status || 'Submitted'}
              </span>
            </div>
            <div style="font-size:0.9rem;font-weight:600;color:var(--cust-brown-900);margin-bottom:2px;">
              ${app.product_name || app.policy_type}
            </div>
            <div style="font-size:0.78rem;color:var(--gray-500);">
              Tier: <strong>${app.coverage_tier}</strong> · Term: <strong>${app.duration_months} Mos</strong> · Submitted: <strong>${subDate}</strong>
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:18px;">
          <div style="text-align:right;">
            <div style="font-size:0.75rem;color:var(--gray-500);">Est. Premium</div>
            <div style="font-size:1.15rem;font-weight:800;color:var(--cust-brown-900);">${app.estimated_premium}</div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="openApplicationDetailsModal('${app.application_id}')" style="font-weight:600;font-size:0.8rem;">
            View Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterMyApplications(status) {
  window.policyAppState.activeAppStatusFilter = status;
  document.querySelectorAll('#my-apps-status-filter-pills .btn-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-status') === status);
  });
  renderMyApplicationsList();
}

function openApplicationDetailsModal(appId) {
  const app = (window.policyAppState.applications || []).find(a => a.application_id === appId);
  if (!app) return;

  const modal = document.getElementById('modal-application-details');
  const idEl = document.getElementById('modal-app-record-id');
  const prodEl = document.getElementById('modal-app-record-product');
  const badgeEl = document.getElementById('modal-app-record-status-badge');
  const bodyEl = document.getElementById('modal-app-record-body');

  if (idEl) idEl.textContent = app.application_id;
  if (prodEl) prodEl.textContent = app.product_name || app.policy_type;
  if (badgeEl) badgeEl.textContent = app.status || 'Submitted';

  if (bodyEl) {
    const applicant = app.applicant_info || {};
    const riskData = app.policy_specific_data || {};
    const docs = app.documents || [];

    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <!-- Summary Cards Grid -->
        <div class="grid grid-2" style="gap:1rem;">
          <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:4px;">Applicant Profile</div>
            <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:4px;color:var(--gray-800);">
              <div><strong>Name:</strong> ${applicant.name || app.customer_name || '-'}</div>
              <div><strong>Email:</strong> ${applicant.email || '-'}</div>
              <div><strong>Phone:</strong> ${applicant.phone || '-'}</div>
              <div><strong>Address:</strong> ${applicant.address || '-'}</div>
            </div>
          </div>

          <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:4px;">Policy & Coverage Parameters</div>
            <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:4px;color:var(--gray-800);">
              <div><strong>Coverage Tier:</strong> ${app.coverage_tier}</div>
              <div><strong>Coverage Limit:</strong> ${app.coverage_limit || '$300,000'}</div>
              <div><strong>Deductible:</strong> ${app.deductible || '$1,000'}</div>
              <div><strong>Term & Start Date:</strong> ${app.duration_months} Months (From ${app.start_date || 'Standard'})</div>
              <div><strong>Estimated Premium:</strong> <strong style="color:var(--cust-brown-900);">${app.estimated_premium}</strong></div>
            </div>
          </div>
        </div>

        <!-- Risk Specifications -->
        ${Object.keys(riskData).length > 0 ? `
          <div style="background:#fff;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;">Risk & Specification Details</div>
            <div class="grid grid-2" style="gap:8px;font-size:0.8rem;">
              ${Object.entries(riskData).map(([k, v]) => `
                <div><strong style="color:var(--cust-brown-900);text-transform:capitalize;">${k.replace(/_/g, ' ')}:</strong> <span>${v}</span></div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Uploaded Documents List -->
        <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
          <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;">Attached Documents (${docs.length})</div>
          ${docs.length === 0 ? `<div style="font-size:0.8rem;color:var(--gray-500);">No attached files.</div>` : `
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${docs.map(d => `
                <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--cust-cream-border);padding:6px 10px;border-radius:6px;font-size:0.8rem;">
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="color:#059669;">✓</span>
                    <strong style="color:var(--cust-brown-900);">${d.doc_type}:</strong>
                    <span>${d.file_name} (${d.file_size || '1.0 MB'})</span>
                  </div>
                  <span class="badge" style="background:#ECFDF5;color:#065F46;font-size:0.7rem;">Verified</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${((app.status || '').toLowerCase().includes('more') || (app.status || '').toLowerCase().includes('info')) ? `
          <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-weight:700;color:#92400E;font-size:0.85rem;">Action Required: Additional Information Requested</div>
              <div style="font-size:0.8rem;color:#B45309;margin-top:2px;">${app.agent_notes || 'The reviewing Agent has requested additional verification documents.'}</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="openCustomerProvideInfoModal('${app.application_id}')" style="font-weight:700;background:#B45309;border-color:#B45309;">
              Upload & Respond →
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (modal) modal.style.display = 'flex';
}

// =========================================================================
// AGENT APPLICATION INTAKE & FORWARD TO UNDERWRITER CONTROLLERS
// =========================================================================
window.agentApplicationsData = [];
window.agentApplicationsFilter = 'all';
window.agentApplicationsSearch = '';
window.agentApplicationsCurrentPage = 1;
window.agentApplicationsPageSize = 10;
window.currentActiveReviewApp = null;
window.currentCustomerRespondingAppId = null;

async function fetchAgentApplications(manualToast = false) {
  const token = (typeof getActiveToken === 'function') ? getActiveToken() : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
  if (!token) return;

  try {
    const res = await fetch(`${AGENT_SERVICE_URL}/agent/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      window.agentApplicationsData = data.applications || [];

      // Update counters
      const total = window.agentApplicationsData.length;
      const pending = window.agentApplicationsData.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s === 'SUBMITTED' || s === 'AGENT REVIEW' || s === 'AGENT_REVIEW' || s === 'PENDING VERIFICATION' || s === 'UNDER_REVIEW' || s === 'UNDER REVIEW';
      }).length;
      const infoReq = window.agentApplicationsData.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s.includes('MORE_INFORMATION_REQUIRED') || s.includes('MORE INFO');
      }).length;
      const forwarded = window.agentApplicationsData.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s.includes('FORWARDED') || s.includes('UNDERWRITER');
      }).length;

      const elTotal = document.getElementById('agent-metric-apps-total');
      const elPending = document.getElementById('agent-metric-apps-pending');
      const elInfo = document.getElementById('agent-metric-apps-info');
      const elFwd = document.getElementById('agent-metric-apps-forwarded');
      const pageTitle = document.getElementById('agent-apps-page-title');

      if (elTotal) elTotal.textContent = total;
      if (elPending) elPending.textContent = pending;
      if (elInfo) elInfo.textContent = infoReq;
      if (elFwd) elFwd.textContent = forwarded;
      if (pageTitle) pageTitle.textContent = `Customer Policy Applications (${total})`;

      renderAgentApplicationsTable();
      if (manualToast) showToast(`Refreshed ${total} application(s) in queue.`);
    }
  } catch (e) {
    console.warn('Error fetching agent applications:', e);
  }
}

function renderAgentApplicationsTable() {
  const tbody = document.getElementById('agent-applications-tbody');
  if (!tbody) return;

  const currentFilter = window.agentApplicationsFilter || 'all';
  const query = (window.agentApplicationsSearch || '').toLowerCase().trim();

  const filtered = (window.agentApplicationsData || []).filter(app => {
    const s = (app.status || '').toUpperCase();
    if (currentFilter === 'review') {
      if (!(s === 'SUBMITTED' || s === 'AGENT REVIEW' || s === 'AGENT_REVIEW' || s === 'PENDING VERIFICATION' || s === 'UNDER_REVIEW' || s === 'UNDER REVIEW')) return false;
    } else if (currentFilter === 'info') {
      if (!(s.includes('MORE_INFORMATION_REQUIRED') || s.includes('MORE INFO'))) return false;
    } else if (currentFilter === 'forwarded') {
      if (!(s.includes('FORWARDED') || s.includes('UNDERWRITER') || s.includes('APPROVED') || s.includes('REJECTED'))) return false;
    }

    if (query) {
      const matchId = (app.application_id || '').toLowerCase().includes(query);
      const matchName = (app.customer_name || '').toLowerCase().includes(query);
      const matchProd = (app.product_name || app.policy_type || '').toLowerCase().includes(query);
      if (!matchId && !matchName && !matchProd) return false;
    }
    return true;
  });

  const totalItems = filtered.length;
  const pageSize = window.agentApplicationsPageSize || 10;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (window.agentApplicationsCurrentPage > totalPages) {
    window.agentApplicationsCurrentPage = 1;
  }
  if (window.agentApplicationsCurrentPage < 1) {
    window.agentApplicationsCurrentPage = 1;
  }

  const currentPage = window.agentApplicationsCurrentPage;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const paginated = filtered.slice(startIdx, endIdx);

  // Update Pagination Info
  const pageInfoEl = document.getElementById('agent-apps-pagination-info');
  const startDisplay = totalItems === 0 ? 0 : startIdx + 1;
  const endDisplay = endIdx;
  if (pageInfoEl) {
    if (totalItems === 0) {
      pageInfoEl.textContent = 'Showing 0 applications';
    } else {
      pageInfoEl.textContent = `Showing ${startDisplay}–${endDisplay} of ${totalItems} applications`;
    }
  }

  // Update Pagination Controls
  const controlsEl = document.getElementById('agent-apps-pagination-controls');
  if (controlsEl) {
    if (totalItems === 0) {
      controlsEl.innerHTML = '';
    } else {
      let buttonsHtml = '';
      
      // Previous button
      const isPrevDisabled = currentPage <= 1;
      buttonsHtml += `
        <button type="button" class="btn btn-outline btn-sm agent-app-page-btn" 
          ${isPrevDisabled ? 'disabled style="opacity:0.4;cursor:not-allowed;padding:5px 12px;font-size:0.8rem;border-radius:6px;border:1px solid var(--cust-cream-border);background:var(--white);color:var(--cust-brown-900);"' : 'onclick="handleAgentAppPagination(' + (currentPage - 1) + ')" style="padding:5px 12px;font-size:0.8rem;border-radius:6px;border:1px solid var(--cust-cream-border);background:var(--white);color:var(--cust-brown-900);cursor:pointer;font-weight:600;"'}>
          ← Previous
        </button>
      `;

      // Page number buttons
      for (let p = 1; p <= totalPages; p++) {
        const isActive = p === currentPage;
        if (isActive) {
          buttonsHtml += `
            <button type="button" class="btn btn-sm agent-app-page-btn active" 
              style="min-width:32px;height:32px;padding:0 8px;font-size:0.8rem;border-radius:6px;background:var(--cust-brown-700);color:#ffffff;font-weight:700;border:none;cursor:default;">
              ${p}
            </button>
          `;
        } else {
          buttonsHtml += `
            <button type="button" class="btn btn-outline btn-sm agent-app-page-btn" 
              onclick="handleAgentAppPagination(${p})" 
              style="min-width:32px;height:32px;padding:0 8px;font-size:0.8rem;border-radius:6px;border:1px solid var(--cust-cream-border);background:var(--white);color:var(--cust-brown-900);font-weight:600;cursor:pointer;">
              ${p}
            </button>
          `;
        }
      }

      // Next button
      const isNextDisabled = currentPage >= totalPages;
      buttonsHtml += `
        <button type="button" class="btn btn-outline btn-sm agent-app-page-btn" 
          ${isNextDisabled ? 'disabled style="opacity:0.4;cursor:not-allowed;padding:5px 12px;font-size:0.8rem;border-radius:6px;border:1px solid var(--cust-cream-border);background:var(--white);color:var(--cust-brown-900);"' : 'onclick="handleAgentAppPagination(' + (currentPage + 1) + ')" style="padding:5px 12px;font-size:0.8rem;border-radius:6px;border:1px solid var(--cust-cream-border);background:var(--white);color:var(--cust-brown-900);cursor:pointer;font-weight:600;"'}>
          Next →
        </button>
      `;

      controlsEl.innerHTML = buttonsHtml;
    }
  }

  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--gray-500);padding:2.5rem;">No policy applications found matching your criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = paginated.map(app => {
    const docs = app.documents || [];
    const status = app.status || 'Submitted';
    const statusUpper = status.toUpperCase();

    let statusBadge = `<span class="agent-app-status-badge" style="background:#FEF3C7;color:#92400E;">Pending</span>`;
    if (statusUpper.includes('APPROV')) {
      statusBadge = `<span class="agent-app-status-badge" style="background:#ECFDF5;color:#065F46;">Approved</span>`;
    } else if (statusUpper.includes('REJECT')) {
      statusBadge = `<span class="agent-app-status-badge" style="background:#FEF2F2;color:#991B1B;">Rejected</span>`;
    } else if (statusUpper.includes('FORWARDED') || statusUpper.includes('UNDERWRITER')) {
      statusBadge = `<span class="agent-app-status-badge" style="background:#EFF6FF;color:#1D4ED8;">Forwarded</span>`;
    } else if (statusUpper.includes('MORE_INFORMATION') || statusUpper.includes('MORE INFO') || statusUpper.includes('INFO REQUIRED')) {
      statusBadge = `<span class="agent-app-status-badge" style="background:#FFFBEB;color:#B45309;">Info Required</span>`;
    } else {
      statusBadge = `<span class="agent-app-status-badge" style="background:#FEF3C7;color:#92400E;">Pending</span>`;
    }

    const isVerified = (
      (app.verification_status || '').toLowerCase().includes('verified') ||
      Boolean(app.forwarded_by_agent_id) ||
      statusUpper.includes('FORWARDED') ||
      statusUpper.includes('APPROV') ||
      statusUpper.includes('REJECT')
    );
    const verifBadge = isVerified ? 
      `<span style="color:#059669;font-size:0.8rem;font-weight:600;">Verified</span>` : 
      `<span style="color:#D97706;font-size:0.8rem;font-weight:500;">Incomplete</span>`;

    const docCount = docs.length;
    const docLabel = `${docCount} ${docCount === 1 ? 'file' : 'files'}`;

    return `
      <tr>
        <td><code style="font-size:0.825rem;font-weight:700;background:var(--cust-brown-100);color:var(--cust-brown-900);padding:3px 8px;border-radius:4px;">${app.application_id}</code></td>
        <td><strong style="color:var(--cust-brown-900);">${app.customer_name}</strong></td>
        <td>
          <div style="font-weight:600;color:var(--cust-brown-900);font-size:0.85rem;">${app.product_name}</div>
          <div style="font-size:0.75rem;color:var(--gray-500);">${app.policy_type}</div>
        </td>
        <td><span class="badge" style="background:#F3F4F6;color:#374151;font-size:0.75rem;">${app.coverage_tier}</span></td>
        <td style="font-weight:700;color:var(--cust-brown-900);">${app.estimated_premium}</td>
        <td>
          <span style="font-size:0.825rem;color:var(--gray-700);font-weight:500;">${docLabel}</span>
        </td>
        <td>${verifBadge}</td>
        <td class="td-status">${statusBadge}</td>
        <td class="td-action" style="text-align:right;">
          <button type="button" class="btn btn-outline btn-sm agent-app-review-btn" onclick="openAgentApplicationReviewModal('${app.application_id}')" title="Review application ${app.application_id}">
            Review
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAgentApplications(filterKey, btnElem) {
  window.agentApplicationsFilter = filterKey;
  window.agentApplicationsCurrentPage = 1;
  document.querySelectorAll('#agent-app-filter-pills .agent-app-filter-pill').forEach(b => {
    b.classList.remove('active');
    b.style.background = '';
    b.style.color = '';
  });
  if (btnElem) {
    btnElem.classList.add('active');
    btnElem.style.background = 'var(--cust-brown-700)';
    btnElem.style.color = '#fff';
  }
  renderAgentApplicationsTable();
}

function handleAgentAppSearch(q) {
  window.agentApplicationsSearch = q;
  window.agentApplicationsCurrentPage = 1;
  renderAgentApplicationsTable();
}

function handleAgentAppPagination(pageNumber) {
  window.agentApplicationsCurrentPage = Number(pageNumber);
  renderAgentApplicationsTable();
}

async function openAgentApplicationReviewModal(appId) {
  let app = (window.agentApplicationsData || []).find(a => a.application_id === appId);
  const token = (typeof getActiveToken === 'function') ? getActiveToken() : (localStorage.getItem('auth_token') || localStorage.getItem('token'));

  if (token) {
    try {
      const res = await fetch(`${AGENT_SERVICE_URL}/agent/applications/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        app = await res.json();
      }
    } catch (e) {
      console.warn('Error fetching fresh application details:', e);
    }
  }

  if (!app) return;
  window.currentActiveReviewApp = app;

  const modal = document.getElementById('modal-agent-app-review');
  const idEl = document.getElementById('agent-review-modal-id');
  const prodEl = document.getElementById('agent-review-modal-product');
  const statusBadgeEl = document.getElementById('agent-review-modal-status-badge');
  const bodyEl = document.getElementById('agent-review-modal-body');
  const forwardBtn = document.getElementById('btn-agent-forward-uw');

  if (idEl) idEl.textContent = app.application_id;
  if (prodEl) prodEl.textContent = `${app.product_name} · ${app.customer_name}`;

  const status = app.status || 'Submitted';
  const statusUpper = status.toUpperCase();
  const isForwarded = statusUpper.includes('FORWARDED') || statusUpper.includes('UNDERWRITER') || statusUpper.includes('APPROVED') || statusUpper.includes('REJECTED');

  if (statusBadgeEl) {
    if (statusUpper.includes('APPROV')) {
      statusBadgeEl.textContent = 'Approved';
      statusBadgeEl.style.background = '#ECFDF5';
      statusBadgeEl.style.color = '#065F46';
    } else if (statusUpper.includes('REJECT')) {
      statusBadgeEl.textContent = 'Rejected';
      statusBadgeEl.style.background = '#FEF2F2';
      statusBadgeEl.style.color = '#991B1B';
    } else if (statusUpper.includes('FORWARDED') || statusUpper.includes('UNDERWRITER')) {
      statusBadgeEl.textContent = 'Forwarded';
      statusBadgeEl.style.background = '#EFF6FF';
      statusBadgeEl.style.color = '#1D4ED8';
    } else if (statusUpper.includes('MORE_INFORMATION') || statusUpper.includes('MORE INFO') || statusUpper.includes('INFO REQUIRED')) {
      statusBadgeEl.textContent = 'Info Required';
      statusBadgeEl.style.background = '#FFFBEB';
      statusBadgeEl.style.color = '#B45309';
    } else {
      statusBadgeEl.textContent = 'Pending';
      statusBadgeEl.style.background = '#FEF3C7';
      statusBadgeEl.style.color = '#92400E';
    }
  }

  // Update Button Actions
  if (forwardBtn) {
    if (isForwarded) {
      forwardBtn.disabled = true;
      forwardBtn.innerHTML = `<span>✓ Forwarded to Underwriter</span>`;
      forwardBtn.style.opacity = '0.7';
      forwardBtn.style.cursor = 'not-allowed';
    } else {
      forwardBtn.disabled = false;
      forwardBtn.innerHTML = `<span>Forward to Underwriter →</span>`;
      forwardBtn.style.opacity = '1';
      forwardBtn.style.cursor = 'pointer';
    }
  }

  if (bodyEl) {
    const applicant = app.applicant_info || {};
    const riskData = app.policy_specific_data || {};
    const docs = app.documents || [];

    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <!-- Status & Audit Banner -->
        ${app.forwarded_at ? `
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 14px;font-size:0.825rem;color:#166534;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <strong>Forwarded to Underwriting:</strong> Forwarded by <strong>${app.forwarded_by_agent_name || 'Agent'}</strong> on <strong>${app.forwarded_at.split('T')[0]}</strong>.
            </div>
            <span class="badge badge-active">In UW Queue</span>
          </div>
        ` : ''}

        ${app.agent_notes ? `
          <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:10px 14px;font-size:0.825rem;color:#92400E;">
            <strong>Agent Audit / Missing Info Notes:</strong> ${app.agent_notes}
          </div>
        ` : ''}

        <!-- 2 Column Overview -->
        <div class="grid grid-2" style="gap:1rem;">
          <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:4px;">Applicant Profile & Contact</div>
            <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:5px;color:var(--gray-800);">
              <div><strong>Name:</strong> ${app.customer_name}</div>
              <div><strong>Customer ID:</strong> ${app.customer_id}</div>
              <div><strong>Email:</strong> ${applicant.email || app.customer_email || 'customer@example.com'}</div>
              <div><strong>Phone:</strong> ${applicant.phone || app.customer_phone || '(555) 302-8819'}</div>
              <div><strong>Address:</strong> ${applicant.address || '742 Evergreen Terrace, Springfield, IL'}</div>
            </div>
          </div>

          <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;border-bottom:1px solid var(--cust-cream-border);padding-bottom:4px;">Policy Coverage Parameters</div>
            <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:5px;color:var(--gray-800);">
              <div><strong>Selected Product:</strong> ${app.product_name}</div>
              <div><strong>Coverage Tier:</strong> <span class="badge" style="background:var(--cust-brown-100);color:var(--cust-brown-900);">${app.coverage_tier}</span></div>
              <div><strong>Coverage Limit:</strong> <strong>${app.coverage_limit || '$300,000'}</strong></div>
              <div><strong>Policy Deductible:</strong> <strong>${app.deductible || '$1,000'}</strong></div>
              <div><strong>Term & Effective Date:</strong> ${app.duration_months} Mos (From ${app.start_date || 'Immediate'})</div>
              <div><strong>Calculated Premium:</strong> <strong style="color:var(--cust-brown-900);font-size:0.95rem;">${app.estimated_premium}</strong></div>
            </div>
          </div>
        </div>

        <!-- Risk Specifications / Questionnaire Data -->
        ${Object.keys(riskData).length > 0 ? `
          <div style="background:#fff;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);margin-bottom:8px;">Risk & Underwriting Specifications</div>
            <div class="grid grid-2" style="gap:8px;font-size:0.8rem;">
              ${Object.entries(riskData).map(([k, v]) => `
                <div style="background:#FAF6F2;padding:6px 10px;border-radius:6px;border:1px solid var(--cust-cream-border);">
                  <strong style="color:var(--cust-brown-900);text-transform:capitalize;">${k.replace(/_/g, ' ')}:</strong> 
                  <span style="color:var(--gray-800);">${v}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Uploaded Customer Documents Section -->
        <div style="background:#FBF9F5;border:1px solid var(--cust-cream-border);border-radius:8px;padding:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--cust-brown-900);">Uploaded Verification Documents (${docs.length})</div>
            <span style="font-size:0.75rem;color:var(--gray-600);">${docs.length > 0 ? 'All files ready for underwriter audit' : 'No documents uploaded yet'}</span>
          </div>

          ${docs.length === 0 ? `
            <div style="background:#FFFDF7;border:1px dashed #FDE68A;border-radius:6px;padding:12px;font-size:0.8rem;color:#92400E;text-align:center;">
              ⚠️ Customer has not uploaded supporting documents yet. You can use <strong>Request More Information</strong> below to request missing items.
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${docs.map(d => `
                <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--cust-cream-border);padding:8px 12px;border-radius:6px;font-size:0.825rem;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="color:#059669;font-weight:700;">✓</span>
                    <div>
                      <strong style="color:var(--cust-brown-900);">${d.doc_type || 'Document'}:</strong>
                      <span style="color:var(--gray-700);">${d.file_name}</span>
                      <span style="font-size:0.75rem;color:var(--gray-500);margin-left:4px;">(${d.file_size || '1.2 MB'})</span>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span class="badge" style="background:#ECFDF5;color:#065F46;font-size:0.725rem;">Verified</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  if (modal) modal.style.display = 'flex';
}

async function submitForwardToUnderwriter() {
  if (!window.currentActiveReviewApp) return;
  const app = window.currentActiveReviewApp;
  const appId = app.application_id;

  const btn = document.getElementById('btn-agent-forward-uw');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>Forwarding...</span>`;
  }

  const token = (typeof getActiveToken === 'function') ? getActiveToken() : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
  if (!token) {
    showToast('Authentication token missing. Please log in as Agent.', 'error');
    if (btn) btn.disabled = false;
    return;
  }

  try {
    const res = await fetch(`${AGENT_SERVICE_URL}/agent/applications/${appId}/forward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        notes: "Verified application data and uploaded documents. Ready for underwriting binding decision.",
        verification_status: "Verified by Agent"
      })
    });

    if (res.ok) {
      const updated = await res.json();
      showToast("Application forwarded to Underwriter successfully.", "success");
      closeModalById('modal-agent-app-review');
      fetchAgentApplications(false);
      if (typeof fetchUnderwriterQueue === 'function') fetchUnderwriterQueue();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || 'Failed to forward application to Underwriter.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Forward to Underwriter →</span>`;
      }
    }
  } catch (e) {
    console.error('Error forwarding to underwriter:', e);
    showToast('Network error forwarding application to Underwriter.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Forward to Underwriter →</span>`;
    }
  }
}

function openAgentRequestMoreInfoModal() {
  if (!window.currentActiveReviewApp) return;
  const app = window.currentActiveReviewApp;
  const subEl = document.getElementById('agent-req-info-sub');
  const inputEl = document.getElementById('agent-req-notes-input');
  if (subEl) subEl.textContent = `Specify what is missing for application ${app.application_id} (${app.customer_name}).`;
  if (inputEl) inputEl.value = '';

  const modal = document.getElementById('modal-agent-request-more-info');
  if (modal) modal.style.display = 'flex';
}

async function submitAgentRequestMoreInfo() {
  if (!window.currentActiveReviewApp) return;
  const app = window.currentActiveReviewApp;
  const appId = app.application_id;
  const notesInput = document.getElementById('agent-req-notes-input');
  const notes = (notesInput ? notesInput.value : '').trim();

  if (!notes) {
    showToast('Please specify what information or documentation is required.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-agent-req-info');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting...';
  }

  const token = (typeof getActiveToken === 'function') ? getActiveToken() : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
  try {
    const res = await fetch(`${AGENT_SERVICE_URL}/agent/applications/${appId}/request-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ notes })
    });

    if (res.ok) {
      showToast('Information request sent to customer successfully.', 'success');
      closeModalById('modal-agent-request-more-info');
      closeModalById('modal-agent-app-review');
      fetchAgentApplications(false);
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || 'Failed to submit information request.', 'error');
    }
  } catch (e) {
    console.error('Error requesting more info:', e);
    showToast('Network error submitting request.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Request to Customer';
    }
  }
}

function openCustomerProvideInfoModal(appId) {
  const app = (window.policyAppState.applications || []).find(a => a.application_id === appId);
  if (!app) return;

  window.currentCustomerRespondingAppId = appId;
  const noteText = document.getElementById('cust-provide-agent-note-text');
  const noteBanner = document.getElementById('cust-provide-agent-note-banner');
  const notesInput = document.getElementById('cust-provide-notes-input');
  const docTypeInput = document.getElementById('cust-provide-doc-type');
  const docFileInput = document.getElementById('cust-provide-doc-filename');

  if (noteText) noteText.textContent = app.agent_notes || 'Please upload the required verification documentation.';
  if (notesInput) notesInput.value = '';
  if (docTypeInput) docTypeInput.value = '';
  if (docFileInput) docFileInput.value = '';

  const modal = document.getElementById('modal-customer-provide-info');
  if (modal) modal.style.display = 'flex';
}

async function submitCustomerProvideInfo() {
  const appId = window.currentCustomerRespondingAppId;
  if (!appId) return;

  const notesInput = document.getElementById('cust-provide-notes-input');
  const docTypeInput = document.getElementById('cust-provide-doc-type');
  const docFileInput = document.getElementById('cust-provide-doc-filename');

  const notes = (notesInput ? notesInput.value : '').trim();
  const docType = (docTypeInput ? docTypeInput.value : '').trim();
  const docFile = (docFileInput ? docFileInput.value : '').trim();

  const docs = [];
  if (docType && docFile) {
    docs.push({
      doc_type: docType,
      file_name: docFile,
      file_size: '1.5 MB',
      file_data: '',
      uploaded_at: new Date().toISOString()
    });
  }

  const token = (typeof getActiveToken === 'function') ? getActiveToken() : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
  const btn = document.getElementById('btn-submit-cust-provide-info');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Uploading...';
  }

  try {
    const res = await fetch(`${CUSTOMER_SERVICE_URL}/customer/applications/${appId}/provide-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        additional_notes: notes,
        documents: docs
      })
    });

    if (res.ok) {
      showToast('Information submitted. Application returned to Agent Review.', 'success');
      closeModalById('modal-customer-provide-info');
      closeModalById('modal-application-details');
      fetchCustomerApplications(false);
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || 'Failed to submit information.', 'error');
    }
  } catch (e) {
    console.error('Error submitting customer info:', e);
    showToast('Network error submitting information.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Upload & Return to Agent Review';
    }
  }
}

// Global exports
if (typeof initPolicyApplicationModule === 'function') window.initPolicyApplicationModule = initPolicyApplicationModule;
if (typeof renderAvailablePoliciesCatalog === 'function') window.renderAvailablePoliciesCatalog = renderAvailablePoliciesCatalog;
if (typeof filterPolicyCatalog === 'function') window.filterPolicyCatalog = filterPolicyCatalog;
if (typeof switchPolicyAppTab === 'function') window.switchPolicyAppTab = switchPolicyAppTab;
if (typeof openPolicyDetailsModal === 'function') window.openPolicyDetailsModal = openPolicyDetailsModal;
if (typeof closePolicyAppModal === 'function') window.closePolicyAppModal = closePolicyAppModal;
if (typeof closeModalById === 'function') window.closeModalById = closeModalById;
if (typeof applyFromPolicyModal === 'function') window.applyFromPolicyModal = applyFromPolicyModal;
if (typeof openSelectedProductDetailsModal === 'function') window.openSelectedProductDetailsModal = openSelectedProductDetailsModal;
if (typeof startPolicyApplication === 'function') window.startPolicyApplication = startPolicyApplication;
if (typeof cancelPolicyApplication === 'function') window.cancelPolicyApplication = cancelPolicyApplication;
if (typeof resetPolicyAppFlow === 'function') window.resetPolicyAppFlow = resetPolicyAppFlow;
if (typeof policyAppGoToStep === 'function') window.policyAppGoToStep = policyAppGoToStep;
if (typeof policyAppNextStep === 'function') window.policyAppNextStep = policyAppNextStep;
if (typeof selectCoverageTier === 'function') window.selectCoverageTier = selectCoverageTier;
if (typeof selectAppDuration === 'function') window.selectAppDuration = selectAppDuration;
if (typeof triggerAppDocUpload === 'function') window.triggerAppDocUpload = triggerAppDocUpload;
if (typeof handleAppFileUpload === 'function') window.handleAppFileUpload = handleAppFileUpload;
if (typeof removeAppDoc === 'function') window.removeAppDoc = removeAppDoc;
if (typeof submitFinalPolicyApplication === 'function') window.submitFinalPolicyApplication = submitFinalPolicyApplication;
if (typeof fetchCustomerApplications === 'function') window.fetchCustomerApplications = fetchCustomerApplications;
if (typeof renderMyApplicationsList === 'function') window.renderMyApplicationsList = renderMyApplicationsList;
if (typeof filterMyApplications === 'function') window.filterMyApplications = filterMyApplications;
if (typeof openApplicationDetailsModal === 'function') window.openApplicationDetailsModal = openApplicationDetailsModal;
if (typeof fetchAgentApplications === 'function') window.fetchAgentApplications = fetchAgentApplications;
if (typeof renderAgentApplicationsTable === 'function') window.renderAgentApplicationsTable = renderAgentApplicationsTable;
if (typeof filterAgentApplications === 'function') window.filterAgentApplications = filterAgentApplications;
if (typeof handleAgentAppSearch === 'function') window.handleAgentAppSearch = handleAgentAppSearch;
if (typeof openAgentApplicationReviewModal === 'function') window.openAgentApplicationReviewModal = openAgentApplicationReviewModal;
if (typeof submitForwardToUnderwriter === 'function') window.submitForwardToUnderwriter = submitForwardToUnderwriter;
if (typeof openAgentRequestMoreInfoModal === 'function') window.openAgentRequestMoreInfoModal = openAgentRequestMoreInfoModal;
if (typeof submitAgentRequestMoreInfo === 'function') window.submitAgentRequestMoreInfo = submitAgentRequestMoreInfo;
if (typeof openCustomerProvideInfoModal === 'function') window.openCustomerProvideInfoModal = openCustomerProvideInfoModal;
if (typeof submitCustomerProvideInfo === 'function') window.submitCustomerProvideInfo = submitCustomerProvideInfo;
if (typeof handleAgentAppPagination === 'function') window.handleAgentAppPagination = handleAgentAppPagination;


