export type OfficerDepartment =
  | 'Administration'
  | 'Engineering'
  | 'Sanitation'
  | 'Health'
  | 'Horticulture';

export type OfficerZone =
  | 'Headquarters'
  | 'NIT Zone'
  | 'Old Faridabad'
  | 'Ballabgarh Zone';

export interface Officer {
  id: string;
  name: string;
  designation: string;
  department: OfficerDepartment;
  zone: OfficerZone;
  phone: string;
  email: string;
  officeAddress?: string;
}
