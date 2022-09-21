import dayjs from 'dayjs/esm';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { ITransfer } from 'app/entities/transfer/transfer.model';

export interface ITransferDetailsApprovals {
  id: number;
  approvalDate?: dayjs.Dayjs | null;
  qtyRequested?: number | null;
  qtyApproved?: number | null;
  comment?: string | null;
  freeField1?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  transfer?: Pick<ITransfer, 'id'> | null;
}

export type NewTransferDetailsApprovals = Omit<ITransferDetailsApprovals, 'id'> & { id: null };
