export interface CitizenProfile {
  name: string;
  mobile: string;
  email: string;
  ward: string;
  address: string;
  isLoggedIn: boolean;
}

export type AdministrativeZone =
  | 'Headquarters'
  | 'NIT Zone'
  | 'Old Faridabad'
  | 'Ballabgarh Zone';

export interface WardInfo {
  wardNumber: number;
  zone: AdministrativeZone;
  councillorName?: string;
  sanitationInspector?: string;
  inspectorPhone?: string;
}
