import dayjs from 'dayjs/esm';

import { IProductInventory, NewProductInventory } from './product-inventory.model';

export const sampleWithRequiredData: IProductInventory = {
  id: 46555,
};

export const sampleWithPartialData: IProductInventory = {
  id: 15424,
  outwardQty: 'Proactive JBOD',
  lotNo: 'payment Team-oriented Saint',
  expiryDate: dayjs('2022-09-21T00:45'),
  inventoryTypeId: 'Berkshire',
  freeField1: 'Market red attitude',
  isActive: true,
};

export const sampleWithFullData: IProductInventory = {
  id: 98001,
  inwardOutwardDate: dayjs('2022-09-20T19:35'),
  inwardQty: 'Kyat Sausages Pines',
  outwardQty: 'Wooden Rubber',
  totalQuanity: 'Frozen Steel artificial',
  pricePerUnit: 23337,
  lotNo: 'generating',
  expiryDate: dayjs('2022-09-20T19:08'),
  inventoryTypeId: 'Mississippi Realigned Fish',
  freeField1: 'reboot Afghanistan up',
  freeField2: 'methodologies driver copy',
  lastModified: 'Wooden',
  lastModifiedBy: 'Croatia Route instruction',
  isDeleted: true,
  isActive: false,
};

export const sampleWithNewData: NewProductInventory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
