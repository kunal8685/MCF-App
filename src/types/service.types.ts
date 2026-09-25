export type ServiceCategory = 'Tax' | 'Certificates' | 'Licensing' | 'Planning';

export interface CitizenService {
  id: string;
  title: string;
  hindiTitle: string;
  icon: string;
  description: string;
  hindiDescription: string;
  category: ServiceCategory;
  url?: string;
  actionText: string;
  requirements: string[];
}

export interface TaxAssessmentRecord {
  propertyId: string;
  ownerName: string;
  ward: string;
  address: string;
  annualValue: number;
  rebatePercent: number;
  netPayable: number;
  dueDate: string;
}
