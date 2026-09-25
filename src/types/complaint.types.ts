export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export interface TimelineMilestone {
  status: string;
  date: string;
  remarks: string;
}

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
  timeline: TimelineMilestone[];
}

export interface ComplaintCategory {
  id: string;
  title: string;
  icon: string;
  department?: string;
  slaHours?: number;
}
