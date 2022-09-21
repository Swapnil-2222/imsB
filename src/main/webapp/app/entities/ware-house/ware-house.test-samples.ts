import { IWareHouse, NewWareHouse } from './ware-house.model';

export const sampleWithRequiredData: IWareHouse = {
  id: 88879,
  lastModified: 'Fall Ergonomic',
  lastModifiedBy: 'Implementation programming',
};

export const sampleWithPartialData: IWareHouse = {
  id: 11271,
  address: 'violet Wooden',
  pincode: 28048,
  country: 'Malta',
  gSTDetails: 'SAS',
  managerEmail: 'stable',
  isActive: false,
  lastModified: 'Account Kroon Human',
  lastModifiedBy: 'web-readiness bypassing Account',
};

export const sampleWithFullData: IWareHouse = {
  id: 25601,
  whName: 'Computer Assurance',
  address: 'XSS Minnesota',
  pincode: 26258,
  city: 'Edina',
  state: 'primary Credit',
  country: 'Bosnia and Herzegovina',
  gSTDetails: 'Buckinghamshire services',
  managerName: 'back',
  managerEmail: 'Pizza schemas Hawaii',
  managerContact: 'Carolina Account FTP',
  contact: 'unleash',
  isDeleted: false,
  isActive: true,
  wareHouseId: 24851,
  lastModified: 'holistic navigating',
  lastModifiedBy: 'Buckinghamshire',
};

export const sampleWithNewData: NewWareHouse = {
  lastModified: 'Lilangeni Borders Missouri',
  lastModifiedBy: 'Illinois Investment Circles',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
