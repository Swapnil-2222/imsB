import dayjs from 'dayjs/esm';

import { ITransferDetails, NewTransferDetails } from './transfer-details.model';

export const sampleWithRequiredData: ITransferDetails = {
  id: 16824,
};

export const sampleWithPartialData: ITransferDetails = {
  id: 10976,
  freeField2: 'system-worthy',
  lastModified: 'Computers',
  lastModifiedBy: 'navigating',
  isDeleted: true,
};

export const sampleWithFullData: ITransferDetails = {
  id: 31742,
  approvalDate: dayjs('2022-09-20T22:30'),
  qty: 16314,
  comment: 'generate target initiatives',
  freeField1: 'transmit',
  freeField2: 'Plastic',
  lastModified: 'Rubber overriding Reverse-engineered',
  lastModifiedBy: 'disintermediate coherent',
  isDeleted: false,
  isActive: true,
};

export const sampleWithNewData: NewTransferDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
