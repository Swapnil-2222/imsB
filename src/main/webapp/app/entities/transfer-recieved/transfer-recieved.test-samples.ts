import dayjs from 'dayjs/esm';

import { ITransferRecieved, NewTransferRecieved } from './transfer-recieved.model';

export const sampleWithRequiredData: ITransferRecieved = {
  id: 82795,
};

export const sampleWithPartialData: ITransferRecieved = {
  id: 74081,
  qtyTransfered: 62967,
  qtyReceived: 9358,
  comment: 'Knoll',
  lastModifiedBy: 'Ergonomic',
};

export const sampleWithFullData: ITransferRecieved = {
  id: 29656,
  transferDate: dayjs('2022-09-20T19:21'),
  qtyTransfered: 78348,
  qtyReceived: 67904,
  comment: 'Outdoors reciprocal dot-com',
  freeField1: 'Montana',
  lastModified: 'Concrete salmon',
  lastModifiedBy: 'bluetooth plum',
  isDeleted: false,
  isActive: false,
};

export const sampleWithNewData: NewTransferRecieved = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
