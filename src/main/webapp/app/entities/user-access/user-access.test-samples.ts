import { AccessLevel } from 'app/entities/enumerations/access-level.model';

import { IUserAccess, NewUserAccess } from './user-access.model';

export const sampleWithRequiredData: IUserAccess = {
  id: 32172,
  lastModified: 'multi-state',
  lastModifiedBy: 'synthesize adapter Awesome',
};

export const sampleWithPartialData: IUserAccess = {
  id: 42824,
  level: AccessLevel['SECTION'],
  lastModified: 'adapter streamline',
  lastModifiedBy: 'harness',
};

export const sampleWithFullData: IUserAccess = {
  id: 11651,
  level: AccessLevel['LAB'],
  accessId: 16016,
  lastModified: 'Ball Account monitoring',
  lastModifiedBy: 'Checking',
};

export const sampleWithNewData: NewUserAccess = {
  lastModified: 'mobile Gorgeous',
  lastModifiedBy: 'COM Dakota Functionality',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
