import { ProductType } from 'app/entities/enumerations/product-type.model';

import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 77672,
};

export const sampleWithPartialData: IProduct = {
  id: 304,
  materialImage: '../fake-data/blob/hipster.png',
  materialImageContentType: 'unknown',
  isDeleted: false,
  isActive: true,
  alertUnits: 'invoice bluetooth District',
  catlogNumber: 'Garden Customer-focused Island',
  molecularFormula: 'mission-critical',
  gstPercentage: 32091,
  lastModifiedBy: 'Agent',
  freeField2: 'encompassing vertical policy',
};

export const sampleWithFullData: IProduct = {
  id: 80395,
  shortName: 'copying Tuna Marketing',
  chemicalFormula: 'Multi-lateral',
  hsnNo: 'deposit Loaf withdrawal',
  materialImage: '../fake-data/blob/hipster.png',
  materialImageContentType: 'unknown',
  isDeleted: false,
  isActive: true,
  productName: 'enhance Berkshire payment',
  alertUnits: 'Horizontal',
  casNumber: 'Progressive',
  catlogNumber: 'monitor feed',
  molecularWt: 95124,
  molecularFormula: 'service-desk Salad Dollar',
  chemicalName: 'Rapid',
  structureImg: 'synergy Village',
  description: 'red Security',
  qrCode: 'Planner',
  barCode: 'Movies Rubber',
  gstPercentage: 93874,
  productType: ProductType['BOTH'],
  lastModified: 'collaboration',
  lastModifiedBy: 'Dobra Canyon',
  freeField1: 'e-enable Jewelery',
  freeField2: 'viral Circles',
};

export const sampleWithNewData: NewProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
