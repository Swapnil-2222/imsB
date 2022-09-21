import { IPurchaseQuotationDetails, NewPurchaseQuotationDetails } from './purchase-quotation-details.model';

export const sampleWithRequiredData: IPurchaseQuotationDetails = {
  id: 18963,
  lastModified: 'Outdoors Refined Auto',
  lastModifiedBy: 'GB Frozen 1080p',
};

export const sampleWithPartialData: IPurchaseQuotationDetails = {
  id: 73801,
  gstTaxPercentage: 46884,
  pricePerUnit: 42566,
  discount: 49558,
  lastModified: 'homogeneous mobile Brook',
  lastModifiedBy: 'Islands',
  freeField1: 'actuating',
};

export const sampleWithFullData: IPurchaseQuotationDetails = {
  id: 48196,
  qtyordered: 69708,
  gstTaxPercentage: 52848,
  pricePerUnit: 29497,
  totalPrice: 14009,
  discount: 91486,
  lastModified: 'Small Liaison',
  lastModifiedBy: 'Buckinghamshire',
  freeField1: 'Tools Buckinghamshire',
  freeField2: 'Regional programming',
};

export const sampleWithNewData: NewPurchaseQuotationDetails = {
  lastModified: 'Investment Soft',
  lastModifiedBy: 'Mississippi enterprise Keyboard',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
