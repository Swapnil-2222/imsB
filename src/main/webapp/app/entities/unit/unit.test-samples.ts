import { IUnit, NewUnit } from './unit.model';

export const sampleWithRequiredData: IUnit = {
  id: 80394,
};

export const sampleWithPartialData: IUnit = {
  id: 73016,
  isDeleted: true,
  isActive: false,
};

export const sampleWithFullData: IUnit = {
  id: 87654,
  unitName: 'Generic compressing',
  shortName: 'Grocery',
  freeField1: 'Fuerte',
  lastModified: 'copying',
  lastModifiedBy: 'Bedfordshire',
  isDeleted: false,
  isActive: true,
};

export const sampleWithNewData: NewUnit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
