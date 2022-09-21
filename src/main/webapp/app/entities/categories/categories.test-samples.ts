import { ICategories, NewCategories } from './categories.model';

export const sampleWithRequiredData: ICategories = {
  id: 71041,
};

export const sampleWithPartialData: ICategories = {
  id: 28399,
  categoryName: 'Granite',
  categoryDescription: 'Credit functionalities',
  lastModified: 'maximize implementation cyan',
  isDeleted: true,
};

export const sampleWithFullData: ICategories = {
  id: 86510,
  categoryName: 'Concrete',
  categoryDescription: 'Unbranded program GB',
  freeField1: 'Libyan Cape Associate',
  lastModified: 'Oklahoma HDD',
  lastModifiedBy: '24/7 United Human',
  isDeleted: true,
  isActive: false,
};

export const sampleWithNewData: NewCategories = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
