import dayjs from 'dayjs/esm';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { IProduct } from 'app/entities/product/product.model';
import { ITransfer } from 'app/entities/transfer/transfer.model';

export interface ITransferDetails {
  id: number;
  approvalDate?: dayjs.Dayjs | null;
  qty?: number | null;
  comment?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  wareHouse?: Pick<IWareHouse, 'id' | 'whName'> | null;
  product?: Pick<IProduct, 'id'> | null;
  transfer?: Pick<ITransfer, 'id'> | null;
}

export type NewTransferDetails = Omit<ITransferDetails, 'id'> & { id: null };
