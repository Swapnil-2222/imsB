import dayjs from 'dayjs/esm';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';

export interface IGoodsRecived {
  id: number;
  grDate?: dayjs.Dayjs | null;
  qtyOrdered?: number | null;
  qtyRecieved?: number | null;
  manufacturingDate?: dayjs.Dayjs | null;
  expiryDate?: dayjs.Dayjs | null;
  lotNo?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  freeField3?: string | null;
  purchaseQuotation?: Pick<IPurchaseQuotation, 'id'> | null;
}

export type NewGoodsRecived = Omit<IGoodsRecived, 'id'> & { id: null };
