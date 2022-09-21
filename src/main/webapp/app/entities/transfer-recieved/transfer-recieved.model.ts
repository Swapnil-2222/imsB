import dayjs from 'dayjs/esm';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { ITransfer } from 'app/entities/transfer/transfer.model';

export interface ITransferRecieved {
  id: number;
  transferDate?: dayjs.Dayjs | null;
  qtyTransfered?: number | null;
  qtyReceived?: number | null;
  comment?: string | null;
  freeField1?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  transfer?: Pick<ITransfer, 'id'> | null;
}

export type NewTransferRecieved = Omit<ITransferRecieved, 'id'> & { id: null };
