import dayjs from 'dayjs/esm';

import { ITransferDetailsApprovals, NewTransferDetailsApprovals } from './transfer-details-approvals.model';

export const sampleWithRequiredData: ITransferDetailsApprovals = {
  id: 2376,
};

export const sampleWithPartialData: ITransferDetailsApprovals = {
  id: 47490,
  qtyApproved: 60216,
  freeField1: 'SDD',
  lastModified: 'copy Shilling invoice',
  lastModifiedBy: 'local auxiliary',
};

export const sampleWithFullData: ITransferDetailsApprovals = {
  id: 72041,
  approvalDate: dayjs('2022-09-20T16:21'),
  qtyRequested: 47862,
  qtyApproved: 82483,
  comment: 'invoice',
  freeField1: 'Specialist Metical',
  lastModified: 'cross-platform Plastic',
  lastModifiedBy: 'Persevering',
  isDeleted: false,
  isActive: false,
};

export const sampleWithNewData: NewTransferDetailsApprovals = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
