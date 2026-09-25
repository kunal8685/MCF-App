export type HelplineCategory = 'MCF' | 'Emergency' | 'Safety' | 'Utility';

export interface HelplineItem {
  id: string;
  title: string;
  hindiTitle: string;
  number: string;
  altNumber?: string;
  hours: string;
  category: HelplineCategory;
  icon: string;
  description: string;
}
