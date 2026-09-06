export const ROLES = {
  CITIZEN: 'citizen',
  NODAL: 'nodal',
  FACULTY: 'faculty',
  STUDENT: 'student',
  INDUSTRY: 'industry',
  ADMIN: 'admin'
};

export const ROLE_CONFIGS = {
  [ROLES.CITIZEN]: {
    id: 'citizen',
    label: 'Citizen',
    portalTitle: 'Citizen Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Report civic & environmental issues, track resolutions, and engage with community actions.',
    defaultPath: '/citizen'
  },
  [ROLES.NODAL]: {
    id: 'nodal',
    label: 'Nodal Officer',
    portalTitle: 'Field Verification Desk',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Verify citizen reports on ground, assign urgency levels, and route to academic R&D or civic departments.',
    defaultPath: '/nodal'
  },
  [ROLES.FACULTY]: {
    id: 'faculty',
    label: 'Academic Faculty',
    portalTitle: 'Faculty R&D Workspace',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Mentor student research groups, review technical solutions, and liaise with industry CSR partners.',
    defaultPath: '/faculty'
  },
  [ROLES.STUDENT]: {
    id: 'student',
    label: 'Student Researcher',
    portalTitle: 'Student Innovation Lab',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Develop grassroots sustainable engineering solutions using interactive Kanban workflows.',
    defaultPath: '/student'
  },
  [ROLES.INDUSTRY]: {
    id: 'industry',
    label: 'Industry / CSR Partner',
    portalTitle: 'CSR Impact Marketplace',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Pledge CSR funds to vetted university projects, track measurable ESG impact and compliance.',
    defaultPath: '/industry'
  },
  [ROLES.ADMIN]: {
    id: 'admin',
    label: 'System Admin',
    portalTitle: 'State Command Center',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    description: 'Oversee state-wide GIS heatmaps, platform health, user roles, and multi-departmental KPIs.',
    defaultPath: '/admin'
  }
};

export const ISSUE_STATUSES = {
  SUBMITTED: { label: 'Submitted', color: 'bg-gray-100 text-gray-800 border-gray-300', step: 1 },
  VERIFIED: { label: 'Verified by Nodal', color: 'bg-blue-100 text-blue-800 border-blue-300', step: 2 },
  IN_RD: { label: 'Assigned to R&D', color: 'bg-purple-100 text-purple-800 border-purple-300', step: 3 },
  CSR_FUNDED: { label: 'CSR Funded', color: 'bg-amber-100 text-amber-800 border-amber-300', step: 4 },
  RESOLVED: { label: 'Resolved & Restored', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', step: 5 },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-300', step: 0 }
};

export const ISSUE_CATEGORIES = [
  { id: 'water', label: 'Water & River Conservation', icon: 'Droplets', color: '#0284c7' },
  { id: 'forest', label: 'Forestry & Biodiversity', icon: 'Trees', color: '#1b5e3b' },
  { id: 'mining', label: 'Mining Land Reclamation', icon: 'Mountain', color: '#c45c26' },
  { id: 'solar', label: 'Renewable Energy & Solar Micro-Grids', icon: 'SunMedium', color: '#e07a3d' },
  { id: 'sanitation', label: 'Civic Sanitation & Waste', icon: 'Trash2', color: '#475569' },
  { id: 'agritech', label: 'Tribal Livelihood & AgriTech', icon: 'Wheat', color: '#16a34a' }
];

export const JHARKHAND_DISTRICTS = [
  'Ranchi', 'East Singhbhum (Jamshedpur)', 'Dhanbad', 'Bokaro', 'Hazaribagh',
  'Deoghar', 'Dumka', 'West Singhbhum (Chaibasa)', 'Giridih', 'Palamu',
  'Latehar', 'Ramgarh', 'Garhwa', 'Chatra', 'Koderma', 'Jamtara', 'Godda',
  'Sahebganj', 'Pakur', 'Khunti', 'Gumla', 'Simdega', 'Lohardaga', 'Seraikela Kharsawan'
];
