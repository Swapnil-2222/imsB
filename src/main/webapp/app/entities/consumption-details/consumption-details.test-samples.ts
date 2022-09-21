import dayjs from 'dayjs/esm';

import { IConsumptionDetails, NewConsumptionDetails } from './consumption-details.model';

export const sampleWithRequiredData: IConsumptionDetails = {
  id: 96955,
};

export const sampleWithPartialData: IConsumptionDetails = {
  id: 12113,
  lastModifiedBy: 'Salad protocol Tennessee',
};

export const sampleWithFullData: IConsumptionDetails = {
  id: 48330,
  comsumptionDate: dayjs('2022-09-20T22:08'),
  qtyConsumed: 2000,
  freeField1: 'Regional Home',
  freeField2: 'enhance Shoal index',
  lastModified: 'Kansas success Martin',
  lastModifiedBy: 'grey',
};

export const sampleWithNewData: NewConsumptionDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
