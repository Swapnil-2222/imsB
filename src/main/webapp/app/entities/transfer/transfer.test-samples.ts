import dayjs from 'dayjs/esm';

import { Status } from 'app/entities/enumerations/status.model';

import { ITransfer, NewTransfer } from './transfer.model';

export const sampleWithRequiredData: ITransfer = {
  id: 61430,
};

export const sampleWithPartialData: ITransfer = {
  id: 14878,
  tranferDate: dayjs('2022-09-21T01:35'),
  comment: 'Configurable',
};

export const sampleWithFullData: ITransfer = {
  id: 94480,
  tranferDate: dayjs('2022-09-21T09:56'),
  comment: 'Guadeloupe Buckinghamshire',
  status: Status['RECEIVED'],
  sourceWareHouse: 'Mobility Handmade',
  destinationWareHouse: 'digital virtual',
  freeField1: 'User-centric',
  lastModified: 'payment',
  lastModifiedBy: 'Norwegian',
};

export const sampleWithNewData: NewTransfer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
