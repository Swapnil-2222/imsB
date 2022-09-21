import dayjs from 'dayjs/esm';

import { IGoodsRecived, NewGoodsRecived } from './goods-recived.model';

export const sampleWithRequiredData: IGoodsRecived = {
  id: 65331,
};

export const sampleWithPartialData: IGoodsRecived = {
  id: 51670,
  expiryDate: dayjs('2022-09-20T13:01'),
  lotNo: 'Computer',
  freeField3: 'Tennessee',
};

export const sampleWithFullData: IGoodsRecived = {
  id: 3633,
  grDate: dayjs('2022-09-21T03:44'),
  qtyOrdered: 99858,
  qtyRecieved: 90543,
  manufacturingDate: dayjs('2022-09-21T09:08'),
  expiryDate: dayjs('2022-09-20T16:48'),
  lotNo: 'Loan Guatemala Front-line',
  freeField1: 'Colorado Islands Oklahoma',
  freeField2: 'bypass synthesizing Strategist',
  freeField3: 'Branch generate',
};

export const sampleWithNewData: NewGoodsRecived = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
