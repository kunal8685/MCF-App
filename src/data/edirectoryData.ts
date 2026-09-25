export interface Officer {
  id: string;
  name: string;
  designation: string;
  department: 'Administration' | 'Engineering' | 'Sanitation' | 'Health' | 'Horticulture';
  zone: 'Headquarters' | 'NIT Zone' | 'Old Faridabad' | 'Ballabgarh Zone';
  phone: string;
  email: string;
  officeAddress?: string;
}

export const EDIRECTORY_DATA: Officer[] = [
  // Senior Administration
  {
    id: '1',
    name: 'Sh. Jitender Joshi',
    designation: 'Joint Commissioner',
    department: 'Administration',
    zone: 'Ballabgarh Zone',
    phone: '8558873113',
    email: 'jc.ballabgarh@mcfaridabad.org',
    officeAddress: 'Zonal Office, Ballabgarh, Faridabad',
  },
  {
    id: '2',
    name: 'Sh. Rajesh Kumar',
    designation: 'Joint Commissioner',
    department: 'Administration',
    zone: 'Old Faridabad',
    phone: '8558873114',
    email: 'jc.old@mcfaridabad.org',
    officeAddress: 'Zonal Office, Old Faridabad, Near Bus Stand',
  },
  {
    id: '3',
    name: 'Sh. Karan Singh',
    designation: 'Joint Commissioner',
    department: 'Administration',
    zone: 'NIT Zone',
    phone: '8558873115',
    email: 'jc.nit@mcfaridabad.org',
    officeAddress: 'Zonal Office, BK Chowk, NIT Faridabad',
  },
  {
    id: '4',
    name: 'Sh. Gajender Singh',
    designation: 'Joint Commissioner (Hq)',
    department: 'Administration',
    zone: 'Headquarters',
    phone: '8558873116',
    email: 'jc.hq@mcfaridabad.org',
    officeAddress: 'MCF Headquarters, BK Chowk, Faridabad',
  },

  // Engineering & Technical
  {
    id: '5',
    name: 'Sh. Vivek Gill',
    designation: 'Chief Engineer',
    department: 'Engineering',
    zone: 'Headquarters',
    phone: '7988669791',
    email: 'ce@mcfaridabad.org',
    officeAddress: '4th Floor, MCF Headquarters, BK Chowk',
  },
  {
    id: '6',
    name: 'Sh. Gurcharan',
    designation: 'Superintending Engineer (SD)',
    department: 'Engineering',
    zone: 'Headquarters',
    phone: '9213628214',
    email: 'se.sd@mcfaridabad.org',
    officeAddress: '3rd Floor, MCF Headquarters, Faridabad',
  },
  {
    id: '7',
    name: 'Sh. Om Dutt',
    designation: 'Executive Engineer (XEN-I)',
    department: 'Engineering',
    zone: 'NIT Zone',
    phone: '9818012345',
    email: 'xen1@mcfaridabad.org',
    officeAddress: 'NIT Engineering Division, Faridabad',
  },
  {
    id: '8',
    name: 'Sh. Surender Khatri',
    designation: 'Executive Engineer (XEN-II)',
    department: 'Engineering',
    zone: 'Old Faridabad',
    phone: '9811234567',
    email: 'xen2@mcfaridabad.org',
    officeAddress: 'Old Faridabad Division Office',
  },
  {
    id: '9',
    name: 'Sh. Sandeep Kumar',
    designation: 'Executive Engineer (XEN-III)',
    department: 'Engineering',
    zone: 'Ballabgarh Zone',
    phone: '9873456789',
    email: 'xen3@mcfaridabad.org',
    officeAddress: 'Ballabgarh Zonal Engineering Cell',
  },
  {
    id: '10',
    name: 'Sh. Deepak Kumar',
    designation: 'Executive Engineer (Water Supply & Sewage)',
    department: 'Engineering',
    zone: 'Headquarters',
    phone: '9818899001',
    email: 'xen.water@mcfaridabad.org',
    officeAddress: 'Water Works Division, Sector 12',
  },

  // Sanitation & Public Health
  {
    id: '11',
    name: 'Dr. Nitin Sharma',
    designation: 'Chief Medical Officer / Health Officer',
    department: 'Health',
    zone: 'Headquarters',
    phone: '9811099887',
    email: 'cmo@mcfaridabad.org',
    officeAddress: 'Health Branch, MCF Headquarters',
  },
  {
    id: '12',
    name: 'Sh. Ramesh Chandra',
    designation: 'Chief Sanitation Officer (CSO)',
    department: 'Sanitation',
    zone: 'Headquarters',
    phone: '9818223344',
    email: 'cso@mcfaridabad.org',
    officeAddress: 'Swachh Bharat Cell, MCF Headquarters',
  },
  {
    id: '13',
    name: 'Sh. Harish Rawat',
    designation: 'Senior Sanitation Inspector',
    department: 'Sanitation',
    zone: 'NIT Zone',
    phone: '9416012348',
    email: 'sanitation.nit@mcfaridabad.org',
    officeAddress: 'Sanitation Office, NIT-1, Faridabad',
  },
  {
    id: '14',
    name: 'Sh. Sunil Deswal',
    designation: 'Assistant Engineer (Horticulture)',
    department: 'Horticulture',
    zone: 'Headquarters',
    phone: '9810554433',
    email: 'horticulture@mcfaridabad.org',
    officeAddress: 'Town Park Maintenance Office, Sector 12',
  },
];
