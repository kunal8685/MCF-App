export type NearMeCategory =
  | 'atm'
  | 'bus'
  | 'community'
  | 'hospital'
  | 'metro'
  | 'police'
  | 'toilet';

export interface NearMePlace {
  id: string;
  name: string;
  category: NearMeCategory;
  address: string;
  distance: string;
  phone?: string;
  timings?: string;
  latitude: number;
  longitude: number;
  rating?: number;
}

export interface CategoryInfo {
  id: NearMeCategory;
  title: string;
  hindiTitle: string;
  icon: string;
  count: number;
}
