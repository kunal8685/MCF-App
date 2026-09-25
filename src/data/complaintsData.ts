export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export interface Complaint {
  id: string;
  complaintNumber: string;
  category: string;
  description: string;
  address: string;
  ward: string;
  date: string;
  status: ComplaintStatus;
  imageUrl?: string;
  officerAssigned?: string;
  officerPhone?: string;
  resolutionRemarks?: string;
  timeline: {
    status: string;
    date: string;
    remarks: string;
  }[];
}

export const COMPLAINT_CATEGORIES = [
  { id: 'garbage', title: 'Garbage & Solid Waste', icon: 'trash-2' },
  { id: 'street_light', title: 'Street Light Fault', icon: 'zap' },
  { id: 'sewerage', title: 'Sewerage Overflow / Blockage', icon: 'droplets' },
  { id: 'water_leak', title: 'Water Supply & Leakage', icon: 'alert-circle' },
  { id: 'roads', title: 'Potholes & Road Damage', icon: 'truck' },
  { id: 'stray_animals', title: 'Stray Cattle / Dogs', icon: 'shield-alert' },
  { id: 'encroachment', title: 'Illegal Encroachment', icon: 'slash' },
  { id: 'park', title: 'Park & Horticulture Issue', icon: 'tree-pine' },
  { id: 'drainage', title: 'Storm Water Drainage', icon: 'umbrella' },
  { id: 'other', title: 'Other Civic Grievance', icon: 'more-horizontal' },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c-1',
    complaintNumber: 'MCF-2026-8941',
    category: 'Garbage & Solid Waste',
    description: 'Community garbage bin overflowing for 3 days near community center park, bad odor spreading in sector.',
    address: 'Near Sector 15 Community Park, Faridabad',
    ward: 'Ward 14',
    date: '24 Sep 2026, 09:30 AM',
    status: 'In Progress',
    officerAssigned: 'Sh. Harish Rawat (Sanitation Inspector)',
    officerPhone: '9416012348',
    timeline: [
      {
        status: 'Complaint Registered',
        date: '24 Sep 2026, 09:30 AM',
        remarks: 'Ticket logged by Citizen Kunal Jagtap via Mobile App.',
      },
      {
        status: 'Assigned to Ward Inspector',
        date: '24 Sep 2026, 11:15 AM',
        remarks: 'Assigned to Ward 14 Sanitation Unit for immediate pickup.',
      },
      {
        status: 'Vehicle Dispatched',
        date: '25 Sep 2026, 08:00 AM',
        remarks: 'Tipper truck dispatched to clearance point.',
      },
    ],
  },
  {
    id: 'c-2',
    complaintNumber: 'MCF-2026-8420',
    category: 'Street Light Fault',
    description: 'LED pole number 14 not functioning since last week creating dark patch at intersection.',
    address: 'Main Market Road, Near Huda Booth, Sector 15',
    ward: 'Ward 14',
    date: '20 Sep 2026, 07:15 PM',
    status: 'Resolved',
    officerAssigned: 'Sh. Om Dutt (XEN Electrical)',
    officerPhone: '9818012345',
    resolutionRemarks: 'Defective LED driver and cable replaced by field team on 21 Sep.',
    timeline: [
      {
        status: 'Complaint Registered',
        date: '20 Sep 2026, 07:15 PM',
        remarks: 'Street light fault reported with pole reference.',
      },
      {
        status: 'Inspected by Team',
        date: '21 Sep 2026, 10:45 AM',
        remarks: 'Lineman inspected the pole connection.',
      },
      {
        status: 'Resolved & Tested',
        date: '21 Sep 2026, 04:30 PM',
        remarks: 'Driver replaced, light verified active.',
      },
    ],
  },
  {
    id: 'c-3',
    complaintNumber: 'MCF-2026-7812',
    category: 'Water Supply & Leakage',
    description: 'Underground pipeline leakage causing low water pressure in lane 4.',
    address: 'House No. 452 Lane, Sector 15, Faridabad',
    ward: 'Ward 14',
    date: '15 Sep 2026, 06:40 AM',
    status: 'Resolved',
    officerAssigned: 'Sh. Deepak Kumar (XEN Water Supply)',
    officerPhone: '9818899001',
    resolutionRemarks: 'Excavation completed, pipeline clamp installed and tested.',
    timeline: [
      {
        status: 'Complaint Registered',
        date: '15 Sep 2026, 06:40 AM',
        remarks: 'Water supply issue logged.',
      },
      {
        status: 'Excavation in Progress',
        date: '15 Sep 2026, 02:00 PM',
        remarks: 'Leakage spot identified on distribution line.',
      },
      {
        status: 'Resolved',
        date: '16 Sep 2026, 11:00 AM',
        remarks: 'Clamp fixed and road patched.',
      },
    ],
  },
];
