import { ISecurityPermission, NewSecurityPermission } from './security-permission.model';

export const sampleWithRequiredData: ISecurityPermission = {
  id: 9587,
  name: 'real-time Louisiana',
  lastModified: 'magnetic',
  lastModifiedBy: 'vortals parallelism',
};

export const sampleWithPartialData: ISecurityPermission = {
  id: 94613,
  name: 'Chief withdrawal',
  lastModified: 'Ruble',
  lastModifiedBy: 'optical Gorgeous sensor',
};

export const sampleWithFullData: ISecurityPermission = {
  id: 46104,
  name: '3rd Incredible Saint',
  description: 'harness CSS',
  lastModified: 'green',
  lastModifiedBy: 'Savings Brooks',
};

export const sampleWithNewData: NewSecurityPermission = {
  name: 'non-volatile lime transitional',
  lastModified: '24/7 Rupee Washington',
  lastModifiedBy: 'Gloves Ameliorated',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
