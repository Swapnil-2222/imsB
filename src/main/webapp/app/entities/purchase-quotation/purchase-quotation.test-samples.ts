import dayjs from 'dayjs/esm';

import { OrderType } from 'app/entities/enumerations/order-type.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IPurchaseQuotation, NewPurchaseQuotation } from './purchase-quotation.model';

export const sampleWithRequiredData: IPurchaseQuotation = {
  id: 65303,
  lastModified: 'Pants',
  lastModifiedBy: 'Montana',
};

export const sampleWithPartialData: IPurchaseQuotation = {
  id: 89513,
  totalGSTAmount: 88812,
  orderStatus: Status['APPROVED'],
  clientEmail: 'Intuitive',
  termsAndCondition: 'Corporate',
  notes: 'invoice parse ability',
  lastModified: 'calculating Buckinghamshire',
  lastModifiedBy: 'intangible',
  freeField2: 'capacitor Market state',
};

export const sampleWithFullData: IPurchaseQuotation = {
  id: 92023,
  totalPOAmount: 19996,
  totalGSTAmount: 78367,
  expectedDeliveryDate: dayjs('2022-09-20T16:39'),
  poDate: dayjs('2022-09-21T09:05'),
  orderType: OrderType['PURCHASE_ORDER'],
  orderStatus: Status['RECEIVED'],
  clientName: 'cyan monitor neural',
  clientMobile: 'Infrastructure Flat',
  clientEmail: 'Tasty Street metrics',
  termsAndCondition: 'Plastic France innovate',
  notes: 'Steel matrix',
  lastModified: 'Forward',
  lastModifiedBy: 'Avon online Garden',
  freeField1: 'content Rico',
  freeField2: 'Shirt',
};

export const sampleWithNewData: NewPurchaseQuotation = {
  lastModified: 'Sausages orchestration',
  lastModifiedBy: 'transform',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
