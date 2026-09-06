// Comprehensive Mock Database for SamadhanSetu Jharkhand

export const INITIAL_ISSUES = [
  {
    id: 'JH-ISSUE-2025-089',
    title: 'Severe Siltation and Industrial Runoff in Subarnarekha River Basin',
    description: 'Heavy industrial effluent and sand runoff near the river confluence have caused water stagnation, impacting 4 surrounding tribal hamlets and local fishing.',
    category: 'water',
    categoryLabel: 'Water & River Conservation',
    district: 'East Singhbhum (Jamshedpur)',
    locationName: 'Subarnarekha Ghat, Ghatshila Block',
    coordinates: { lat: 22.5804, lng: 86.4812 },
    submittedBy: 'Birsa Munda (Citizen)',
    submitterPhone: '+91 98351 XXXXX',
    reportedDate: '2025-02-28',
    status: 'IN_RD',
    priority: 'High',
    upvotes: 42,
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'Site verified on ground. Bio-filtration & wetland restoration intervention assigned to IIT (ISM) Dhanbad Department of Environmental Engineering.',
    assignedUniversity: 'IIT (ISM) Dhanbad',
    assignedProject: 'PRJ-2025-042',
    csrPartner: 'Tata Steel Foundation',
    fundingRequired: '₹ 8,50,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-02-28', remark: 'Reported with geo-tagged images by citizen' },
      { status: 'VERIFIED', date: '2025-03-01', remark: 'Field inspection completed by Nodal Officer East Singhbhum' },
      { status: 'IN_RD', date: '2025-03-02', remark: 'Adopted by IIT ISM Dhanbad Water Research Lab' }
    ]
  },
  {
    id: 'JH-ISSUE-2025-092',
    title: 'Coal Dust Particulate Dispersion and Acid Mine Runoff in Jharia Belt',
    description: 'Uncovered coal transit points causing PM2.5 spikes (over 380 µg/m³) affecting respiratory health across 3 primary schools in the Lodna mining cluster.',
    category: 'mining',
    categoryLabel: 'Mining Land Reclamation',
    district: 'Dhanbad',
    locationName: 'Lodna Colliery Buffer Zone, Jharia',
    coordinates: { lat: 23.7421, lng: 86.4172 },
    submittedBy: 'Pooja Soren (Citizen Activist)',
    submitterPhone: '+91 94311 XXXXX',
    reportedDate: '2025-03-01',
    status: 'CSR_FUNDED',
    priority: 'Critical',
    upvotes: 88,
    images: [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'High priority. Dust suppression canopy and vetiver grass phytoremediation proposal approved.',
    assignedUniversity: 'BIT Mesra',
    assignedProject: 'PRJ-2025-018',
    csrPartner: 'Coal India / BCCL Green CSR',
    fundingRequired: '₹ 14,00,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-03-01', remark: 'Citizen grievance lodged with drone visual evidence' },
      { status: 'VERIFIED', date: '2025-03-02', remark: 'Joint inspection by State Pollution Control Board & Nodal Officer' },
      { status: 'IN_RD', date: '2025-03-03', remark: 'BIT Mesra Green Tech group finalized vetiver bio-filter design' },
      { status: 'CSR_FUNDED', date: '2025-03-04', remark: 'Coal India CSR sanctioned initial ₹7 Lakh phase-1 tranche' }
    ]
  },
  {
    id: 'JH-ISSUE-2025-104',
    title: 'Saranda Forest Illegal Logging & Soil Erosion on Elephant Corridor',
    description: 'Monsoon flash washouts and illegal timber felling near Kiriburu reserve ridge disrupting indigenous elephant migratory paths and soil stability.',
    category: 'forest',
    categoryLabel: 'Forestry & Biodiversity',
    district: 'West Singhbhum (Chaibasa)',
    locationName: 'Kiriburu Range, Saranda Forest',
    coordinates: { lat: 22.1850, lng: 85.3450 },
    submittedBy: 'Mangal Ho (Van Samiti Leader)',
    submitterPhone: '+91 91223 XXXXX',
    reportedDate: '2025-03-02',
    status: 'VERIFIED',
    priority: 'High',
    upvotes: 63,
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'Confirmed with DFO Chaibasa. Need automated acoustic IoT monitoring network and native Sal sapling replenishment.',
    assignedUniversity: 'Birsa Agricultural University',
    assignedProject: 'PRJ-2025-055',
    csrPartner: 'Pending CSR Pledge',
    fundingRequired: '₹ 6,20,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-03-02', remark: 'Reported via mobile app with GPS trail' },
      { status: 'VERIFIED', date: '2025-03-03', remark: 'Verified by West Singhbhum Forest Nodal Officer' }
    ]
  },
  {
    id: 'JH-ISSUE-2025-110',
    title: 'Off-Grid Tribal Hamlet Solar Micro-Grid Failure in Netarhat Plateau',
    description: 'Existing mini-inverter bank damaged due to lightning storm. 65 households and tribal boarding school in darkness for 12 days.',
    category: 'solar',
    categoryLabel: 'Renewable Energy & Solar Micro-Grids',
    district: 'Latehar',
    locationName: 'Mahauadand - Netarhat Border Village',
    coordinates: { lat: 23.4795, lng: 84.2697 },
    submittedBy: 'Sunita Kerketta (Panchayat Mukhiya)',
    submitterPhone: '+91 97715 XXXXX',
    reportedDate: '2025-03-03',
    status: 'IN_RD',
    priority: 'Critical',
    upvotes: 51,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'Emergency power need. Assigned to NIT Jamshedpur Renewable Energy Lab for smart surge-protected lithium BESS retrofitting.',
    assignedUniversity: 'NIT Jamshedpur',
    assignedProject: 'PRJ-2025-029',
    csrPartner: 'Adani Renewables CSR',
    fundingRequired: '₹ 4,80,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-03-03', remark: 'Gram Panchayat registered complaint' },
      { status: 'VERIFIED', date: '2025-03-04', remark: 'Nodal Officer validated inverter surge damage' },
      { status: 'IN_RD', date: '2025-03-05', remark: 'NIT Jamshedpur students drafted hybrid BMS schematics' }
    ]
  },
  {
    id: 'JH-ISSUE-2025-115',
    title: 'Solid Waste Accumulation & Drainage Clogging near Deoghar Temple Zone',
    description: 'Single-use plastic and organic pilgrim offering accumulation in Darbhanga Nullah creating blockage and water contamination ahead of festive influx.',
    category: 'sanitation',
    categoryLabel: 'Civic Sanitation & Waste',
    district: 'Deoghar',
    locationName: 'Baidyanath Dham Periphery, Deoghar',
    coordinates: { lat: 24.4925, lng: 86.7025 },
    submittedBy: 'Anand Kumar Jha (Citizen)',
    submitterPhone: '+91 93345 XXXXX',
    reportedDate: '2025-03-04',
    status: 'SUBMITTED',
    priority: 'Medium',
    upvotes: 29,
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'Awaiting on-site field verification by municipal nodal team.',
    assignedUniversity: 'Pending Assignment',
    assignedProject: null,
    csrPartner: null,
    fundingRequired: '₹ 3,50,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-03-04', remark: 'Issue registered with geo-tag and visual evidence' }
    ]
  },
  {
    id: 'JH-ISSUE-2025-072',
    title: 'Indigenous Millets & Lac Cultivation Solar Processing Machine Needed',
    description: 'Women self-help groups in Torpa block require decentralised solar-powered lac de-husking and processing machines to triple local household incomes.',
    category: 'agritech',
    categoryLabel: 'Tribal Livelihood & AgriTech',
    district: 'Khunti',
    locationName: 'Torpa Tribal Mahila SHG Cluster',
    coordinates: { lat: 22.9554, lng: 85.0831 },
    submittedBy: 'Shanti Mundu (SHG President)',
    submitterPhone: '+91 99341 XXXXX',
    reportedDate: '2025-02-15',
    status: 'RESOLVED',
    priority: 'High',
    upvotes: 114,
    images: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'
    ],
    nodalRemarks: 'Project successfully completed. 4 solar de-lac machines engineered by Birsa Agricultural University fabricated and operational on ground.',
    assignedUniversity: 'Birsa Agricultural University',
    assignedProject: 'PRJ-2025-007',
    csrPartner: 'JSPL Foundation',
    fundingRequired: '₹ 5,00,000',
    timeline: [
      { status: 'SUBMITTED', date: '2025-02-15', remark: 'Community requirement submitted' },
      { status: 'VERIFIED', date: '2025-02-17', remark: 'Nodal officer approved viability' },
      { status: 'IN_RD', date: '2025-02-18', remark: 'Agri engineering lab developed prototype' },
      { status: 'CSR_FUNDED', date: '2025-02-22', remark: 'JSPL Foundation funded fabrication' },
      { status: 'RESOLVED', date: '2025-03-01', remark: 'Commissioned at Torpa SHG hub' }
    ]
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'PRJ-2025-042',
    title: 'Subarnarekha River Wetland Phytoremediation & Eco-Biofilter System',
    issueId: 'JH-ISSUE-2025-089',
    university: 'IIT (ISM) Dhanbad',
    department: 'Department of Environmental Science & Engineering',
    facultyMentor: 'Prof. Dr. Alok Kumar Sinha (HOD Env Eng)',
    studentLead: 'Rohan Sharma (M.Tech Final Year)',
    teamMembers: [
      { name: 'Rohan Sharma', role: 'Student Lead & Fluid Modeling' },
      { name: 'Ananya Mahato', role: 'Microbial Water Quality Analyst' },
      { name: 'Debashish Roy', role: 'Bio-Char Wetland Filter Design' },
      { name: 'Priyanka Hansda', role: 'GIS Mapping & Field Sensor Deployment' }
    ],
    domain: 'Water Conservation',
    stage: 'In Progress',
    budgetTotal: 850000,
    budgetFunded: 600000,
    sponsor: 'Tata Steel Foundation',
    progressPercentage: 68,
    sdgGoal: 'SDG 6 (Clean Water) & SDG 15 (Life on Land)',
    kanbanTasks: [
      { id: 'TSK-101', title: 'Water sample toxicity & heavy metal lab analysis', status: 'done', priority: 'high', assignee: 'Ananya Mahato' },
      { id: 'TSK-102', title: 'Constructed wetland pilot scale model at Ghatshila', status: 'in_progress', priority: 'high', assignee: 'Debashish Roy' },
      { id: 'TSK-103', title: 'Deploy continuous pH/DO telemetry sensor nodes', status: 'in_progress', priority: 'medium', assignee: 'Priyanka Hansda' },
      { id: 'TSK-104', title: 'Final ecological impact validation & local community handover', status: 'todo', priority: 'medium', assignee: 'Rohan Sharma' }
    ],
    milestones: [
      { title: 'Baseline Water Quality Mapping', date: 'March 10, 2025', status: 'completed' },
      { title: 'Pilot Biofilter Installation', date: 'March 25, 2025', status: 'in_progress' },
      { title: 'Field IoT Sensor Telemetry Live', date: 'April 15, 2025', status: 'pending' },
      { title: 'Handover & Water Quality Clearance Report', date: 'May 10, 2025', status: 'pending' }
    ]
  },
  {
    id: 'PRJ-2025-018',
    title: 'Jharia Coal Dust Canopy & Deep-Rooted Vetiver Phytoremediation',
    issueId: 'JH-ISSUE-2025-092',
    university: 'BIT Mesra, Ranchi',
    department: 'Civil & Environmental Engineering',
    facultyMentor: 'Dr. Smriti Sengupta (Associate Professor)',
    studentLead: 'Adarsh Tirkey (B.Tech Final Year)',
    teamMembers: [
      { name: 'Adarsh Tirkey', role: 'Project Coordinator & Material Testing' },
      { name: 'Sneha Pandey', role: 'Aerosol Sensor Network & ESP32 Dev' },
      { name: 'Rahul Murmu', role: 'Agronomic Vetiver Propagation Specialist' }
    ],
    domain: 'Mining Land Reclamation',
    stage: 'CSR Funded',
    budgetTotal: 1400000,
    budgetFunded: 1400000,
    sponsor: 'Coal India / BCCL Green CSR',
    progressPercentage: 45,
    sdgGoal: 'SDG 11 (Sustainable Communities) & SDG 3 (Good Health)',
    kanbanTasks: [
      { id: 'TSK-201', title: 'Simulate micro-climate wind dispersion in OpenFOAM', status: 'done', priority: 'medium', assignee: 'Adarsh Tirkey' },
      { id: 'TSK-202', title: 'Fabricate fogger canopy prototype at BIT lab', status: 'in_progress', priority: 'high', assignee: 'Adarsh Tirkey' },
      { id: 'TSK-203', title: 'Source 5,000 Vetiver Grass cultivars from BAU', status: 'todo', priority: 'high', assignee: 'Rahul Murmu' },
      { id: 'TSK-204', title: 'Calibrate solar PM2.5 real-time monitoring display', status: 'todo', priority: 'medium', assignee: 'Sneha Pandey' }
    ],
    milestones: [
      { title: 'Lab Simulation & Wind Modeling', date: 'Feb 20, 2025', status: 'completed' },
      { title: 'Tranche-1 CSR Disbursement (₹7 Lakh)', date: 'March 04, 2025', status: 'completed' },
      { title: 'Plantation of 5000 Vetiver slips at Lodna site', date: 'March 30, 2025', status: 'pending' },
      { title: 'PM2.5 Reduction Verification (>45% drop)', date: 'May 01, 2025', status: 'pending' }
    ]
  },
  {
    id: 'PRJ-2025-029',
    title: 'Fault-Tolerant Hybrid Solar Microgrid with Lithium-LFP Storage',
    issueId: 'JH-ISSUE-2025-110',
    university: 'NIT Jamshedpur',
    department: 'Electrical Engineering & Clean Energy Center',
    facultyMentor: 'Prof. Rajeshwar Verma',
    studentLead: 'Vikram Soren (M.Tech Power Systems)',
    teamMembers: [
      { name: 'Vikram Soren', role: 'Power Inverter & BMS Engineer' },
      { name: 'Nikita Kumari', role: 'Remote Telemetry & Cloud Dashboard' }
    ],
    domain: 'Renewable Energy',
    stage: 'In Progress',
    budgetTotal: 480000,
    budgetFunded: 480000,
    sponsor: 'Adani Renewables CSR',
    progressPercentage: 55,
    sdgGoal: 'SDG 7 (Affordable Clean Energy)',
    kanbanTasks: [
      { id: 'TSK-301', title: 'Design modular 10kVA solar inverter with dual-surge protection', status: 'done', priority: 'high', assignee: 'Vikram Soren' },
      { id: 'TSK-302', title: 'Integrate 48V LFP battery management unit', status: 'in_progress', priority: 'high', assignee: 'Vikram Soren' },
      { id: 'TSK-303', title: 'Field visit to Netarhat hamlet for wiring overhaul', status: 'todo', priority: 'high', assignee: 'Nikita Kumari' }
    ],
    milestones: [
      { title: 'Inverter Hardware Testing at Lab', date: 'March 12, 2025', status: 'in_progress' },
      { title: 'Netarhat Microgrid Site Commissioning', date: 'March 28, 2025', status: 'pending' }
    ]
  }
];

export const MOCK_CSR_SPONSORS = [
  {
    id: 'CSR-01',
    name: 'Tata Steel Foundation',
    logo: '🏢',
    totalPledged: '₹ 2.45 Cr',
    projectsFunded: 14,
    focusAreas: ['Water Security', 'Tribal Healthcare', 'Forest Biodiversity'],
    activeGrants: 3
  },
  {
    id: 'CSR-02',
    name: 'Coal India / BCCL Green Initiative',
    logo: '⚡',
    totalPledged: '₹ 4.10 Cr',
    projectsFunded: 21,
    focusAreas: ['Mine Overburden Greenery', 'Dust Suppression', 'Clean Air'],
    activeGrants: 5
  },
  {
    id: 'CSR-03',
    name: 'SAIL Bokaro Steel CSR',
    logo: '🏭',
    totalPledged: '₹ 1.80 Cr',
    projectsFunded: 9,
    focusAreas: ['Civic Sanitation', 'Rural STEM Labs', 'Solar Lighting'],
    activeGrants: 2
  },
  {
    id: 'CSR-04',
    name: 'Adani Renewables & Solar CSR',
    logo: '☀️',
    totalPledged: '₹ 1.20 Cr',
    projectsFunded: 6,
    focusAreas: ['Off-grid Hamlets', 'Solar Micro-grids', 'Agri-pump Solarization'],
    activeGrants: 2
  }
];

export const MOCK_USERS = [
  {
    id: 'USR-CITIZEN-01',
    role: 'citizen',
    name: 'Birsa Munda',
    email: 'birsa.munda@jharkhand.in',
    phone: '+91 98351 44210',
    district: 'East Singhbhum (Jamshedpur)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    reputationPoints: 480,
    issuesReported: 6,
    issuesResolved: 4
  },
  {
    id: 'USR-NODAL-01',
    role: 'nodal',
    name: 'Officer Rajeshwar Soren',
    title: 'District Nodal Officer (Environment & Civic)',
    email: 'rajeshwar.soren@jharkhand.gov.in',
    phone: '+91 94311 88022',
    district: 'East Singhbhum (Jamshedpur)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    department: 'Dept. of Forest, Environment & Climate Change',
    pendingVerificationCount: 8,
    totalVerified: 142
  },
  {
    id: 'USR-FACULTY-01',
    role: 'faculty',
    name: 'Prof. Dr. Alok Kumar Sinha',
    title: 'Head of Department, Environmental Eng.',
    email: 'alok.sinha@iitism.ac.in',
    phone: '+91 94711 00219',
    university: 'IIT (ISM) Dhanbad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    mentoredProjects: 5,
    activeStudents: 18,
    publishedSolutions: 12
  },
  {
    id: 'USR-STUDENT-01',
    role: 'student',
    name: 'Rohan Sharma',
    title: 'Student R&D Lead',
    email: 'rohan.21me@iitism.ac.in',
    phone: '+91 88771 99014',
    university: 'IIT (ISM) Dhanbad',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    project: 'PRJ-2025-042',
    tasksCompleted: 14,
    activeTasks: 3
  },
  {
    id: 'USR-INDUSTRY-01',
    role: 'industry',
    name: 'Vikramjit Roy',
    title: 'Chief CSR & ESG Officer',
    organization: 'Tata Steel Foundation',
    email: 'vikramjit.roy@tatasteel.com',
    phone: '+91 99343 00811',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    totalCSRBudget: '₹ 15.00 Cr',
    allocatedPledges: '₹ 2.45 Cr'
  },
  {
    id: 'USR-ADMIN-01',
    role: 'admin',
    name: 'Shri A. K. Choudhary, IAS',
    title: 'Principal Secretary & State Platform Administrator',
    email: 'admin.samadhan@jharkhand.gov.in',
    phone: '+91 651 2400100',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    systemStatus: 'Optimal (All 24 Districts Connected)'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'N-01',
    title: 'Subarnarekha River Issue moved to R&D',
    message: 'IIT (ISM) Dhanbad has accepted the bio-filter research proposal.',
    time: '15 mins ago',
    read: false,
    role: 'citizen'
  },
  {
    id: 'N-02',
    title: 'New Citizen Issue requires field verification',
    message: 'New issue reported in Deoghar: Single-use plastic clogging Darbhanga nullah.',
    time: '1 hour ago',
    read: false,
    role: 'nodal'
  },
  {
    id: 'N-03',
    title: 'CSR Tranche Approved by Coal India',
    message: '₹7,00,000 released for BIT Mesra Jharia Dust Mitigation Project.',
    time: '3 hours ago',
    read: true,
    role: 'faculty'
  },
  {
    id: 'N-04',
    title: 'New Task assigned to you',
    message: 'Prof. Sinha assigned task: "Constructed wetland pilot scale model at Ghatshila".',
    time: '5 hours ago',
    read: false,
    role: 'student'
  }
];

export const PLATFORM_STATS = {
  totalIssuesReported: 1248,
  totalIssuesVerified: 1104,
  activeUniversityProjects: 86,
  totalCSRFundingSanctioned: '₹ 18.6 Cr',
  forestWaterAreaRestoredSqKm: '412 sq.km',
  activeCitizensEngaged: 34200,
  participatingInstitutions: 16
};
