import { TransactionType } from 'app/entities/enumerations/transaction-type.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IProductTransaction, NewProductTransaction } from './product-transaction.model';

export const sampleWithRequiredData: IProductTransaction = {
  id: 37357,
};

export const sampleWithPartialData: IProductTransaction = {
  id: 23210,
  refrenceId: 25701,
  freeField1: 'Officer Manat mission-critical',
  freeField2: 'Borders even-keeled',
  lastModified: 'bleeding-edge',
};

export const sampleWithFullData: IProductTransaction = {
  id: 92898,
  refrenceId: 62205,
  transactionType: TransactionType['INWARD_STOCKS'],
  transactionStatus: Status['COMPLETED'],
  transactionDate: 'synthesizing Delaware Developer',
  description: 'Vision-oriented Jewelery Loan',
  freeField1: 'Handmade',
  freeField2: 'Bedfordshire archive context-sensitive',
  lastModified: 'deposit Fall',
  lastModifiedBy: 'Persevering copying bricks-and-clicks',
};

export const sampleWithNewData: NewProductTransaction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
